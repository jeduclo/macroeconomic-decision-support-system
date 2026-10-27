"""
Module 1 lab — Measuring GDP
============================
What you will do
  1. Build GDP with the expenditure approach: C + I + G + (X − M).
  2. Separate nominal growth from real growth using the GDP deflator.
  3. (Optional) Download US real GDP from FRED and find the recessions.

Exercises
  a) Change "M" (imports) below to 600. What happens to GDP? Why?
  b) Set inflation to 0.08 and real growth to 0. How much does nominal GDP grow
     after 10 years, and how much does real GDP grow?
  c) Using the FRED data, in which years did US real GDP fall?
"""
from lab_utils import COLORS, fred, heading, plt, save, simulate, extra

params = {"C": 1300, "I": 400, "G": 450, "X": 650, "M": 700, "inflation": 0.02, "realGrowth": 0.02}

heading("1. GDP by the expenditure approach")
gdp = params["C"] + params["I"] + params["G"] + params["X"] - params["M"]
print(f"  GDP = C + I + G + (X − M) = {params['C']} + {params['I']} + {params['G']} + ({params['X']} − {params['M']}) = {gdp}")
for part in ["C", "I", "G"]:
    print(f"  share of {part}: {100 * params[part] / gdp:.1f} %")
print(f"  model check: {extra('m01', params)['gdp']:.0f}")

heading("2. Nominal vs real GDP")
df = simulate("m01", params)
print(df[["year", "nominal", "real", "deflator"]].round(1).to_string(index=False))
end = df.iloc[-1]
print(f"\n  After {int(end.year)} years nominal GDP grew {100 * (end.nominal / df.nominal[0] - 1):.1f} %, "
      f"but real GDP only {100 * (end.real / df.real[0] - 1):.1f} %.")

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(df.year, df.nominal, label="Nominal GDP", color=COLORS[1])
ax.plot(df.year, df.real, label="Real GDP (base-year prices)", color=COLORS[0])
ax.set(xlabel="Year", ylabel="$ billions", title="Nominal vs real GDP")
ax.legend()
save(fig, "m01_nominal_real.png")

heading("3. Real data: US real GDP (FRED: GDPC1)")
us = fred("GDPC1")
if us is not None:
    annual = us.resample("YE").mean()
    growth = 100 * annual.pct_change().dropna()
    print("  Years with falling real GDP:", [d.year for d, g in growth.items() if g < 0])
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.bar(growth.index.year, growth.values, color=[COLORS[2] if g < 0 else COLORS[0] for g in growth.values])
    ax.axhline(0, color="black", lw=0.8)
    ax.set(xlabel="Year", ylabel="% change", title="US real GDP growth")
    save(fig, "m01_us_growth.png")
