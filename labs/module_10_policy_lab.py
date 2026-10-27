"""
Module 10 lab — Capstone policy lab
===================================
What you will do
  1. Score every preset policy with the loss function  L = mean(gap² + (π − 2)²).
  2. Search for the best Taylor-rule settings for each scenario.
  3. Write up a short policy brief from the results.

Exercises
  a) For the oil shock, is the best φπ above or below 1.5? Explain using credibility.
  b) In the financial crisis, how much does adding fiscal stimulus lower the loss?
     What does it cost in extra debt?
  c) Write a one-page brief for one scenario: diagnosis, settings, results, risks.
"""
import itertools

import pandas as pd

from lab_utils import COLORS, extra, heading, plt, presets, save, simulate

heading("1. Presets scored")
rows = []
for name, p in presets("m10").items():
    e, df = extra("m10", p), simulate("m10", p)
    rows.append({"preset": name, "loss": e["loss"], "do nothing": e["lossNone"],
                 "peak unemployment": df.unemployment.max(), "peak inflation": df.inflation.max(),
                 "debt at end": df.debt.iloc[-1]})
print(pd.DataFrame(rows).round(2).to_string(index=False))

heading("2. Best monetary settings by scenario (grid search, fiscal = 1.5)")
best = {}
for scenario in ["demandCollapse", "oilShock", "financialCrisis"]:
    grid = itertools.product([0.5, 1.0, 1.5, 2.0, 2.5, 3.0], [0.0, 0.25, 0.5, 1.0, 1.5])
    scores = [(extra("m10", {"scenario": scenario, "phiPi": a, "phiY": b, "fiscal": 1.5})["loss"], a, b) for a, b in grid]
    loss, a, b = min(scores)
    best[scenario] = {"phiPi": a, "phiY": b}
    print(f"  {scenario:<16} best φπ = {a}, φy = {b} → loss {loss:.2f}")

heading("3. Chart: your best policy vs doing nothing")
fig, axes = plt.subplots(1, 3, figsize=(12, 3.6), sharey=True)
for ax, (scenario, s) in zip(axes, best.items()):
    df = simulate("m10", {"scenario": scenario, "fiscal": 1.5, **s})
    ax.plot(df.quarter, df.gap, label="best policy", color=COLORS[0])
    ax.plot(df.quarter, df.gapNone, "--", label="do nothing", color="grey")
    ax.axhline(0, color="black", lw=0.6)
    ax.set(title=scenario, xlabel="Quarter")
axes[0].set_ylabel("output gap (%)")
axes[0].legend()
save(fig, "m10_best_policy.png")
