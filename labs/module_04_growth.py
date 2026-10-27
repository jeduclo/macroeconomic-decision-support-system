"""
Module 4 lab — Economic growth
==============================
What you will do
  1. Use the rule of 70 to compute doubling times.
  2. Run the Solow model and find the steady state.
  3. Compare a rich and a poor country (convergence).
  4. Test what saving, population growth and technology do.

Exercises
  a) How long does it take income to double at 0.5 %, 2 % and 7 % growth?
  b) Raise the saving rate to 0.35. Does long-run growth change? Does the level?
  c) Which preset makes the poor country reach 75 % of the rich one fastest?
"""
from lab_utils import COLORS, extra, heading, plt, presets, save, simulate

heading("1. Rule of 70")
for g in [0.5, 1, 2, 3, 7]:
    print(f"  growth {g:>3} % → doubles in about {70 / g:.0f} years")

heading("2. Solow steady state")
e = extra("m04")
print(f"  steady-state capital per effective worker k* = {e['kStar']:.2f}, output y* = {e['yStar']:.2f}")
curve = e["curve"]
fig, ax = plt.subplots(figsize=(7, 4))
ax.plot([c["k"] for c in curve], [c["investment"] for c in curve], label="investment s·f(k)", color=COLORS[3])
ax.plot([c["k"] for c in curve], [c["breakEven"] for c in curve], label="break-even (n+g+δ)k", color=COLORS[2])
ax.scatter([e["kStar"]], [e["iStar"]], color="black", zorder=3, label="steady state")
ax.set(xlabel="capital per effective worker", title="Solow diagram")
ax.legend()
save(fig, "m04_solow.png")

heading("3. Presets: level vs growth")
fig, ax = plt.subplots(figsize=(7, 4))
for i, (name, p) in enumerate(presets("m04").items()):
    df = simulate("m04", p, name)
    reach = df[df.ratio >= 75]
    when = int(reach.year.iloc[0]) if len(reach) else None
    print(f"  {name:<24} income after 100 yrs {df.rich.iloc[-1]:7.0f}   long-run growth {df.growthRich.iloc[-1]:.2f} %   "
          f"poor reaches 75 %: {when if when is not None else 'not within 100 yrs'}")
    ax.plot(df.year, df.poor, label=f"poor — {name}", color=COLORS[i])
ax.set(xlabel="Year", ylabel="income per worker (rich, year 0 = 100)", yscale="log", title="Catch-up growth")
ax.legend(fontsize=8)
save(fig, "m04_convergence.png")
