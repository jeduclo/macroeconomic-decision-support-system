"""
Module 8 lab — Fiscal policy
============================
What you will do
  1. Compare spending and tax multipliers.
  2. Simulate a recession with timely and late stimulus.
  3. Project public debt with different interest and growth rates (r − g).
  4. (Optional) Download US federal debt-to-GDP from FRED.

Exercises
  a) With MPC = 0.8 and no crowding out, what are the spending and tax multipliers?
  b) Find the longest lag for which stimulus still reduces the average |output gap|.
  c) With interest = 0.05 and growth = 0.03, what is debt after 30 years?
"""
from lab_utils import COLORS, extra, fred, heading, plt, presets, save, simulate

heading("1. Multipliers")
for mpc in [0.6, 0.75, 0.8]:
    e = extra("m08", {"mpc": mpc, "crowding": 0})
    print(f"  MPC {mpc:.2f}: spending {e['kG']:.2f}, tax {e['kT']:.2f}, balanced budget {e['balanced']:.2f}")

heading("2. Timing matters")
fig, ax = plt.subplots(figsize=(7, 4))
for i, (name, p) in enumerate(presets("m08").items()):
    df = simulate("m08", p, name)
    avg_gap = df.gapPolicy.abs().mean()
    overshoot = max(0, df.gapPolicy.max())
    print(f"  {name:<18} average |gap| {avg_gap:.2f} %   peak overshoot {overshoot:.2f} %")
    ax.plot(df.quarter, df.gapPolicy, label=name, color=COLORS[i])
ax.axhline(0, color="black", lw=0.8)
ax.set(xlabel="Quarter", ylabel="output gap (%)", title="Recession with different fiscal responses")
ax.legend()
save(fig, "m08_timing.png")

heading("3. Debt dynamics and r − g")
fig, ax = plt.subplots(figsize=(7, 4))
for i, (r, g) in enumerate([(0.02, 0.04), (0.03, 0.03), (0.05, 0.03)]):
    debt = extra("m08", {"interest": r, "growth": g})["debt"]
    print(f"  r = {r:.0%}, g = {g:.0%} → debt after 30 years {debt[-1]['withStimulus']:.0f} % of GDP")
    ax.plot([d["year"] for d in debt], [d["withStimulus"] for d in debt], label=f"r − g = {100 * (r - g):+.0f} pts", color=COLORS[i])
ax.set(xlabel="Year", ylabel="% of GDP", title="Public debt")
ax.legend()
save(fig, "m08_debt.png")

heading("4. Real data: US federal debt (FRED: GFDEGDQ188S)")
debt = fred("GFDEGDQ188S")
if debt is not None:
    print(f"  latest: {debt.iloc[-1]:.0f} % of GDP ({debt.index[-1]:%Y-%m})")
