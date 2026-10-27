"""
Module 2 lab — Unemployment
===========================
What you will do
  1. Compute the natural rate of unemployment from job flows: s / (s + f).
  2. Simulate a recession and measure cyclical unemployment.
  3. Use Okun's law to link unemployment and the output gap.
  4. (Optional) Compare US and Canadian unemployment from FRED.

Exercises
  a) What natural rate do you get if the job-finding rate falls from 0.25 to 0.15?
  b) Run the "Great Recession style" preset. What is the peak unemployment rate
     and how many months does it take to come back within 0.5 points of normal?
  c) In the real data, which country had the higher unemployment rate in 2010?
"""
from lab_utils import COLORS, fred, heading, plt, presets, save, simulate

heading("1. The natural rate from flows")
for s, f in [(0.015, 0.25), (0.015, 0.15), (0.02, 0.30)]:
    print(f"  separation {s:.3f}, job finding {f:.2f} → natural rate {100 * s / (s + f):.1f} %")

heading("2. A recession")
fig, ax = plt.subplots(figsize=(7, 4))
for i, (name, p) in enumerate(presets("m02").items()):
    df = simulate("m02", p, name)
    peak = df.loc[df.unemploymentRate.idxmax()]
    print(f"  {name:<24} peak {peak.unemploymentRate:.1f} % in month {int(peak.month)}, "
          f"natural rate {df.naturalRate[0]:.1f} %")
    ax.plot(df.month, df.unemploymentRate, label=name, color=COLORS[i])
ax.set(xlabel="Month", ylabel="%", title="Unemployment rate after a recession")
ax.legend()
save(fig, "m02_recession.png")

heading("3. Okun's law")
df = simulate("m02", presets("m02")["Great Recession style"])
worst = df.loc[df.cyclical.idxmax()]
print(f"  worst month: cyclical unemployment {worst.cyclical:.1f} pts → output gap {worst.outputGap:.1f} %")
print("  rule of thumb: each point of cyclical unemployment ≈ 2 % of lost output")

heading("4. Real data: US vs Canada (FRED)")
us, ca = fred("UNRATE"), fred("LRUNTTTTCAM156S")
if us is not None and ca is not None:
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.plot(us.index, us.values, label="United States", color=COLORS[0])
    ax.plot(ca.index, ca.values, label="Canada", color=COLORS[2])
    ax.set(ylabel="%", title="Unemployment rate")
    ax.legend()
    save(fig, "m02_us_canada.png")
