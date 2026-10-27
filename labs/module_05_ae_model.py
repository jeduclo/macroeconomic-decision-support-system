"""
Module 5 lab — The aggregate expenditure (Keynesian cross) model
================================================================
What you will do
  1. Solve for equilibrium output: Y = AE.
  2. Compute the multiplier 1 / (1 − MPC) and trace it round by round.
  3. Find how much extra government spending closes a recessionary gap.

Exercises
  a) With MPC = 0.6, what is the multiplier? How much does a 50 increase in I raise Y?
  b) Investment falls by 100 ("Investment collapse"). How much must G rise to reach potential (1,400)?
  c) Why do the round-by-round amounts get smaller each time?
"""
from lab_utils import COLORS, extra, heading, plt, presets, save, simulate

heading("1. Equilibrium by hand")
autoC, mpc, I, G, T, NX = 100, 0.75, 150, 200, 200, 0
autonomous = autoC - mpc * T + I + G + NX
Y = autonomous / (1 - mpc)
print(f"  Y = (autonomous spending) / (1 − MPC) = {autonomous:.0f} / {1 - mpc:.2f} = {Y:.0f}")
print(f"  model check: {extra('m05', {'shock': 0})['y0']:.0f}")

heading("2. The multiplier")
for m in [0.5, 0.6, 0.75, 0.8, 0.9]:
    print(f"  MPC {m:.2f} → multiplier {1 / (1 - m):.1f}")
e = extra("m05", presets("m05")["Investment boom"])
print(f"\n  Investment boom: output {e['y0']:.0f} → {e['y1']:.0f} (change {e['y1'] - e['y0']:+.0f})")
fig, ax = plt.subplots(figsize=(7, 4))
r = e["rounds"]
ax.bar([x["idx"] + 1 for x in r], [x["spending"] for x in r], color=COLORS[1], label="new spending this round")
ax.plot([x["idx"] + 1 for x in r], [x["cumulative"] for x in r], color=COLORS[0], marker="o", label="cumulative")
ax.set(xlabel="Round", title="The multiplier, round by round")
ax.legend()
save(fig, "m05_rounds.png")

heading("3. Keynesian cross and the gap")
p = presets("m05")["Investment collapse"]
df = simulate("m05", p)
e = extra("m05", p)
potential = p.get("potential", 1400)
needed = (potential - e["y1"]) * (1 - p.get("mpc", 0.75))
print(f"  equilibrium falls to {e['y1']:.0f}; recessionary gap {potential - e['y1']:.0f}; extra G needed: {needed:.0f}")
fig, ax = plt.subplots(figsize=(6, 6))
ax.plot(df.Y, df.line45, color="grey", label="45° line")
ax.plot(df.Y, df.ae0, "--", color=COLORS[1], label="AE before")
ax.plot(df.Y, df.ae1, color=COLORS[1], label="AE after")
ax.scatter([e["y0"], e["y1"]], [e["y0"], e["y1"]], color="black", zorder=3)
ax.set(xlabel="Output Y", ylabel="Planned spending AE", title="Keynesian cross")
ax.legend()
save(fig, "m05_cross.png")
