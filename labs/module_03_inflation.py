"""
Module 3 lab — Inflation
========================
What you will do
  1. Build a CPI from a small basket of goods.
  2. Use the quantity theory: inflation ≈ money growth − real growth.
  3. Convert nominal wages and interest rates into real ones.
  4. (Optional) Download US CPI from FRED and compute annual inflation.

Exercises
  a) Change the price of rent in year 2 to 1500. What is the new CPI?
  b) Which preset gives a negative real interest rate? Why?
  c) In the FRED data, in which year was US inflation highest since 1990?
"""
import pandas as pd

from lab_utils import COLORS, fred, heading, plt, presets, save, simulate

heading("1. A CPI from a basket")
basket = pd.DataFrame({
    "item": ["food", "rent", "transport", "clothing"],
    "quantity": [50, 12, 30, 10],
    "price_year1": [4.0, 1200, 2.5, 40],
    "price_year2": [4.4, 1260, 2.8, 41],
})
cost1 = (basket.quantity * basket.price_year1).sum()
cost2 = (basket.quantity * basket.price_year2).sum()
print(basket.to_string(index=False))
print(f"\n  cost of basket: year 1 = {cost1:,.0f}, year 2 = {cost2:,.0f}")
print(f"  CPI (year 1 = 100) = {100 * cost2 / cost1:.1f} → inflation {100 * (cost2 / cost1 - 1):.1f} %")

heading("2. Quantity theory and real values")
fig, ax = plt.subplots(figsize=(7, 4))
for i, (name, p) in enumerate(presets("m03").items()):
    df = simulate("m03", p, name)
    end = df.iloc[-1]
    print(f"  {name:<24} inflation {df.inflation.iloc[1]:.1f} %  real rate {end.realRate:.1f} %  "
          f"real wage after 20 yrs {end.realWage - 100:+.0f} %")
    ax.plot(df.year, df.priceLevel, label=name, color=COLORS[i])
ax.set(xlabel="Year", ylabel="Price level (year 0 = 100)", yscale="log", title="Price level under different money growth")
ax.legend()
save(fig, "m03_price_level.png")

heading("3. Real data: US CPI inflation (FRED: CPIAUCSL)")
cpi = fred("CPIAUCSL")
if cpi is not None:
    infl = 100 * cpi.pct_change(12).dropna()
    yearly = infl.resample("YE").mean()
    top = yearly.idxmax()
    print(f"  highest average inflation: {top.year} ({yearly.max():.1f} %)")
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.plot(infl.index, infl.values, color=COLORS[2])
    ax.axhline(2, ls="--", color="grey", label="2 % target")
    ax.set(ylabel="% over 12 months", title="US CPI inflation")
    ax.legend()
    save(fig, "m03_us_inflation.png")
