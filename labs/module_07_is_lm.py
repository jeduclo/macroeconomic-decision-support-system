"""
Module 7 lab — The IS-LM model
==============================
What you will do
  1. Solve IS-LM for output and the interest rate.
  2. Measure crowding out after a fiscal expansion.
  3. Show how the policy mix can avoid crowding out.

Exercises
  a) Make investment more sensitive to the interest rate (investSens = 40). Does crowding out rise?
  b) Make money demand more sensitive (moneySens = 120, a flatter LM). What happens?
  c) What increase in M keeps the interest rate unchanged when G rises by 100?
"""
from lab_utils import COLORS, extra, heading, plt, presets, save, simulate

heading("1. Policies compared")
for name, p in presets("m07").items():
    e = extra("m07", p)
    print(f"  {name:<22} Y {e['y0']:6.0f} → {e['y1']:6.0f}   r {e['r0']:4.1f} % → {e['r1']:4.1f} %   "
          f"crowding out {e['crowdingOut']:4.0f} %")

heading("2. Crowding out depends on the slopes")
for d in [10, 20, 40]:
    for h in [20, 40, 120]:
        e = extra("m07", {"dG": 100, "investSens": d, "moneySens": h})
        print(f"  investSens {d:>3}, moneySens {h:>3} → crowding out {e['crowdingOut']:4.0f} %")

heading("3. Holding the interest rate fixed")
target = extra("m07", {"dG": 0})["r0"]
best = min(range(0, 401, 5), key=lambda dm: abs(extra("m07", {"dG": 100, "dM": dm})["r1"] - target))
print(f"  with G + 100, a money-supply increase of about {best} keeps r ≈ {target:.1f} %")

p = presets("m07")["Fiscal expansion"]
df, e = simulate("m07", p), extra("m07", p)
fig, ax = plt.subplots(figsize=(6, 5))
ax.plot(df.Y, df.is0, "--", color=COLORS[4], label="IS before")
ax.plot(df.Y, df.is1, color=COLORS[4], label="IS after")
ax.plot(df.Y, df.lm0, color=COLORS[0], label="LM")
ax.scatter([e["y0"], e["y1"]], [e["r0"], e["r1"]], color="black", zorder=3)
ax.set(xlabel="Output Y", ylabel="Interest rate (%)", ylim=(-2, 14), title="Fiscal expansion in IS-LM")
ax.legend()
save(fig, "m07_islm.png")
