"""
Module 9 lab — Monetary policy and the transmission mechanism
=============================================================
What you will do
  1. Compute a Taylor-rule interest rate.
  2. Simulate demand and cost-push shocks with and without a policy response.
  3. Measure the contribution of each transmission channel.
  4. (Optional) Compare the actual US federal funds rate with a simple Taylor rule.

Exercises
  a) Inflation 5 %, output gap +1 %: what rate does the Taylor rule give (φπ = 0.5, φy = 0.5)?
  b) Lower credibility from 0.9 to 0.2 in the cost-push case. How does peak inflation change?
  c) Which transmission channel is largest in this model? Why might the exchange-rate
     channel be bigger in Canada than in the US?
"""
from lab_utils import COLORS, extra, fred, heading, plt, presets, save, simulate


def taylor(pi, gap, r_star=2.0, target=2.0, phi_pi=0.5, phi_y=0.5):
    return r_star + pi + phi_pi * (pi - target) + phi_y * gap


heading("1. The Taylor rule")
for pi, gap in [(2, 0), (4, 0), (5, 1), (1, -3)]:
    print(f"  inflation {pi} %, gap {gap:+} % → policy rate {taylor(pi, gap):.1f} %")

heading("2. Shocks and responses")
fig, axes = plt.subplots(1, 2, figsize=(10, 4))
for i, (name, p) in enumerate(presets("m09").items()):
    df = simulate("m09", p, name)
    print(f"  {name:<36} peak inflation {df.inflation.max():.1f} %  deepest gap {df.gap.min():.1f} %  "
          f"final inflation {df.inflation.iloc[-1]:.1f} %")
    axes[0].plot(df.quarter, df.inflation, label=name, color=COLORS[i])
    axes[1].plot(df.quarter, df.policyRate, label=name, color=COLORS[i])
axes[0].axhline(2, ls="--", color="grey")
axes[0].set(title="Inflation (%)", xlabel="Quarter")
axes[1].set(title="Policy rate (%)", xlabel="Quarter")
axes[0].legend(fontsize=7)
save(fig, "m09_shocks.png")

heading("3. Transmission channels")
names = ["interest rate", "exchange rate", "wealth"]
ch = extra("m09", presets("m09")["Demand shock, Taylor rule"])["channels"]
for n, c in zip(names, ch):
    print(f"  {n:<14} total effect on output gap {c['value']:+.2f}")

heading("4. Real data: fed funds rate vs a Taylor rule (FRED)")
ff, cpi = fred("FEDFUNDS", "1990-01-01"), fred("CPIAUCSL", "1989-01-01")
if ff is not None and cpi is not None:
    pi = (100 * cpi.pct_change(12)).dropna()
    rule = taylor(pi, 0).reindex(ff.index).dropna()
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.plot(ff.index, ff.values, label="Federal funds rate", color=COLORS[0])
    ax.plot(rule.index, rule.values, label="Taylor rule (gap = 0)", color=COLORS[2], ls="--")
    ax.set(ylabel="%", title="Actual policy vs a simple rule")
    ax.legend()
    save(fig, "m09_taylor_us.png")
