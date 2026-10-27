"""
Module 6 lab — Aggregate demand and aggregate supply
====================================================
What you will do
  1. Simulate demand and supply shocks.
  2. Compare the short-run and long-run effects on output and prices.
  3. Measure how long self-correction takes.

Exercises
  a) In "Demand fall (recession)", how many periods until the output gap is smaller than 0.5 %?
  b) Repeat with a slower wage adjustment (adjust = 0.1). How much longer does it take?
  c) Run "Oil price shock" with supplyType = "permanent". What happens to potential output?
"""
from lab_utils import COLORS, extra, heading, plt, presets, save, simulate


def recovery_time(df, tol=0.5):
    after = df[(df.period > 0) & (df.gap.abs() < tol)]
    return int(after.period.iloc[0]) if len(after) else None


heading("1. Short run vs long run, by preset")
for name, p in presets("m06").items():
    e = extra("m06", p)
    df = simulate("m06", p)
    print(f"  {name:<26} short run: Y {e['srY']:6.0f}, P {e['srP']:5.1f} | long run: Y {e['lrY']:6.0f}, P {e['lrP']:5.1f} "
          f"| gap < 0.5 % after {recovery_time(df)} periods")

heading("2. Speed of self-correction")
base = presets("m06")["Demand fall (recession)"]
fig, ax = plt.subplots(figsize=(7, 4))
for i, a in enumerate([0.1, 0.3, 0.6]):
    df = simulate("m06", {**base, "adjust": a})
    print(f"  adjustment speed {a:.1f}: recovery after {recovery_time(df)} periods")
    ax.plot(df.period, df.gap, label=f"adjust = {a}", color=COLORS[i])
ax.axhline(0, color="black", lw=0.8)
ax.set(xlabel="Period", ylabel="output gap (%)", title="Faster wage/price adjustment → shorter recession")
ax.legend()
save(fig, "m06_self_correction.png")

heading("3. AD/AS diagram for the oil shock")
e = extra("m06", presets("m06")["Oil price shock"])
c = e["curves"]
fig, ax = plt.subplots(figsize=(6, 5))
Y = [r["Y"] for r in c]
ax.plot(Y, [r["ad0"] for r in c], color=COLORS[0], label="AD")
ax.plot(Y, [r["sras0"] for r in c], "--", color=COLORS[2], label="SRAS before")
ax.plot(Y, [r["sras1"] for r in c], color=COLORS[2], label="SRAS after shock")
ax.axvline(e["yp"], color="grey", ls=":", label="LRAS")
ax.scatter([e["srY"]], [e["srP"]], color="black", zorder=3, label="short-run equilibrium")
ax.set(xlabel="Real GDP", ylabel="Price level", ylim=(60, 150), title="Stagflation")
ax.legend(fontsize=8)
save(fig, "m06_oil_shock.png")
