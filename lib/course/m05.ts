import { Repeat } from "lucide-react";
import type { CourseModule } from "./types";
import { C, fmt } from "./helpers";

const m05: CourseModule = {
  id: "m05",
  number: 5,
  title: "The Aggregate Expenditure Model",
  short: "AE Model",
  tagline: "One person's spending is another person's income — and that multiplies.",
  accent: "#fbbf24",
  icon: Repeat,
  duration: "Week 5 · ~3 h",
  summary:
    "In the short run, when firms have spare capacity, output is set by how much people, businesses, governments and foreigners plan to spend. The aggregate expenditure (AE) model — the 'Keynesian cross' — finds the level of output where planned spending equals production, and shows how a change in spending is multiplied as it ripples through the economy.",
  objectives: [
    "Describe the consumption function and the marginal propensity to consume (MPC).",
    "Draw planned aggregate expenditure and the 45° line and find equilibrium output.",
    "Explain the adjustment process through unplanned inventory changes.",
    "Calculate the spending multiplier 1 / (1 − MPC) and trace it round by round.",
    "Identify recessionary and inflationary gaps relative to potential output.",
  ],
  sections: [
    {
      heading: "Planned spending",
      body: [
        "Households spend more when their disposable income (income after taxes) rises, but not one-for-one: the marginal propensity to consume (MPC) is the share of each extra dollar that is spent; the rest is saved. Planned aggregate expenditure adds consumption, planned investment, government purchases and net exports: AE = C + I + G + NX.",
      ],
    },
    {
      heading: "Equilibrium: where AE meets the 45° line",
      body: [
        "On the 45° line, spending equals output. If planned spending is greater than output, firms see their inventories fall unexpectedly and increase production; if spending is less than output, inventories pile up and firms cut production. Output settles where the AE line crosses the 45° line — the equilibrium.",
      ],
    },
    {
      heading: "The multiplier",
      body: [
        "Suppose businesses spend $50 billion more on investment. Workers and owners who receive that $50 billion spend MPC × 50 of it; the next people spend MPC × that, and so on. The rounds add up to 50 ÷ (1 − MPC). With MPC = 0.75 the multiplier is 4, so output rises by $200 billion.",
        "In reality multipliers are smaller than this simple model suggests, because some extra spending goes on imports, taxes rise with income, and interest rates and prices can respond (Modules 6-8).",
      ],
    },
    {
      heading: "Gaps",
      body: [
        "Equilibrium output need not equal potential output (the full-employment level). If equilibrium is below potential there is a recessionary gap with cyclical unemployment; if above, an inflationary gap. Keynes argued that economies can get stuck in a recessionary gap, which justifies government action to raise spending.",
      ],
    },
  ],
  equations: [
    { label: "Consumption function", formula: "C = autonomous C + MPC × (Y − T)" },
    { label: "Planned expenditure", formula: "AE = C + I + G + NX" },
    { label: "Equilibrium", formula: "Y = AE   (where AE crosses the 45° line)" },
    { label: "Spending multiplier", formula: "ΔY = ΔSpending × 1 / (1 − MPC)" },
  ],
  loops: [
    { type: "R", name: "The multiplier", chain: "Spending → Income → Consumption → more Spending (each round smaller)" },
  ],
  keyTerms: [
    { term: "MPC", def: "Marginal propensity to consume: fraction of extra disposable income that is spent." },
    { term: "Autonomous spending", def: "Spending that does not depend on current income." },
    { term: "45° line", def: "All points where spending equals output." },
    { term: "Multiplier", def: "Change in equilibrium output per $1 change in autonomous spending." },
    { term: "Recessionary gap", def: "Equilibrium output below potential output." },
    { term: "Unplanned inventory change", def: "The signal that makes firms adjust production toward equilibrium." },
  ],
  experiments: [
    {
      title: "Find the equilibrium",
      preset: "Investment boom",
      steps: ["Load the preset.", "Read both equilibria off the chart: where AE crosses the 45° line.", "Check the change equals the shock × 4."],
      observe: "A $50 increase in investment raises output by $200 when MPC = 0.75.",
    },
    {
      title: "A bigger MPC",
      preset: "Higher MPC",
      steps: ["Load the preset (MPC = 0.85).", "Watch the round-by-round chart."],
      observe: "With a higher MPC each round is larger, so the multiplier rises to about 6.7.",
    },
    {
      title: "Recessionary gap",
      preset: "Investment collapse",
      steps: ["Load the preset.", "Compare equilibrium output with potential output.", "How much extra government spending would close the gap?"],
      observe: "Output falls by $400 to 800, leaving a $600 recessionary gap below potential (1,400). With a multiplier of 4, raising G by 600 ÷ 4 = 150 would close it.",
    },
  ],
  quiz: [
    {
      q: "If the MPC is 0.8, the spending multiplier is…",
      options: ["0.8", "1.25", "5", "8"],
      answer: 2,
      explain: "1 ÷ (1 − 0.8) = 5.",
    },
    {
      q: "Planned spending is greater than output. What happens next?",
      options: ["Inventories rise and firms cut output", "Inventories fall and firms raise output", "Prices fall", "Nothing"],
      answer: 1,
      explain: "Unexpectedly falling inventories signal firms to produce more.",
    },
    {
      q: "Investment falls by $20 billion and the MPC is 0.75. Equilibrium output falls by…",
      options: ["$15 billion", "$20 billion", "$60 billion", "$80 billion"],
      answer: 3,
      explain: "20 × 1/(1 − 0.75) = 20 × 4 = $80 billion.",
    },
    {
      q: "On the 45° line…",
      options: ["Consumption equals income", "Spending equals output", "Saving equals zero", "Prices are fixed"],
      answer: 1,
      explain: "Every point on the 45° line has the same value on both axes.",
    },
    {
      q: "Why are real-world multipliers usually smaller than 1/(1 − MPC)?",
      options: ["Because of imports, taxes and price/interest-rate responses", "Because the MPC is above 1", "Because GDP is measured badly", "They are always larger"],
      answer: 0,
      explain: "Each leakage reduces how much of each round is spent on domestic output.",
    },
  ],
  readings: [
    { cite: "OpenStax (2022). Principles of Macroeconomics, 3rd ed., Ch. 11: The Keynesian Perspective (and Appendix on the expenditure-output model)." },
    { cite: "Keynes, J. M. (1936). The General Theory of Employment, Interest and Money. Macmillan." },
    { cite: "CORE Econ. The Economy, Unit 14: Unemployment and fiscal policy." },
  ],
  discussion: [
    "During a recession many households try to save more. If everyone does, what happens to total saving and income? (the paradox of thrift)",
    "Why might the MPC be different for low-income and high-income households, and why would that matter for policy?",
  ],
  charts: [
    {
      id: "m05-cross",
      title: "The Keynesian cross",
      subtitle: "Dashed = before the change; solid = after",
      x: "Y",
      xLabel: "Real output / income (Y)",
      wide: true,
      series: [
        { key: "line45", name: "45° line (AE = Y)", color: C.slate },
        { key: "ae0", name: "AE before", color: "#fbbf24", dashed: true },
        { key: "ae1", name: "AE after", color: "#fbbf24" },
      ],
      yDomain: [0, "auto"],
      dots: (e) => [
        { x: e.y0, y: e.y0, label: "E₀", color: C.slate },
        { x: e.y1, y: e.y1, label: "E₁", color: "#fbbf24" },
      ],
      refX: [{ value: (p) => Number(p.potential), label: "potential", color: C.nature }],
    },
    {
      id: "m05-rounds",
      title: "The multiplier, round by round",
      data: "rounds",
      x: "idx",
      xTickLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      series: [
        { key: "spending", name: "New spending this round", color: "#fbbf24", type: "bar" },
        { key: "cumulative", name: "Cumulative change in output", color: C.capital },
      ],
    },
  ],
  kpis: (r, p) => {
    const e = r.extra as Record<string, number>;
    const gap = e.y1 - Number(p.potential);
    return [
      { label: "Equilibrium before → after", value: `${fmt(e.y0, 0)} → ${fmt(e.y1, 0)}`, tone: "neutral" },
      { label: "Multiplier", value: `${fmt(e.multiplier, 2)}×`, tone: "neutral", hint: "1 / (1 − MPC)" },
      { label: "Change in output", value: `${e.y1 - e.y0 >= 0 ? "+" : ""}${fmt(e.y1 - e.y0, 0)}`, tone: e.y1 >= e.y0 ? "good" : "bad" },
      { label: gap < 0 ? "Recessionary gap" : gap > 0 ? "Inflationary gap" : "At potential", value: fmt(gap, 0), tone: Math.abs(gap) < 1 ? "good" : gap < 0 ? "bad" : "warn" },
    ];
  },
  labFile: "module_05_ae_model.py",
};

export default m05;
