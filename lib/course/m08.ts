import { Landmark } from "lucide-react";
import type { CourseModule } from "./types";
import { C, fmt, last } from "./helpers";

const m08: CourseModule = {
  id: "m08",
  number: 8,
  title: "Fiscal Policy",
  short: "Fiscal Policy",
  tagline: "Government spending and taxes as tools to steady the economy.",
  accent: "#fb923c",
  icon: Landmark,
  duration: "Week 8 · ~3 h",
  summary:
    "Fiscal policy is the use of government spending and taxes to influence the economy. This module covers spending and tax multipliers, automatic stabilisers, the problem of policy lags, and how deficits add to public debt. You will run a recession with and without stimulus, test what happens when stimulus arrives late, and see when debt grows or shrinks as a share of GDP.",
  objectives: [
    "Distinguish expansionary and contractionary, discretionary and automatic fiscal policy.",
    "Compare spending and tax multipliers and explain the balanced-budget multiplier.",
    "Explain recognition, decision and implementation lags.",
    "Explain the link between deficits and debt and the role of r − g.",
    "Evaluate arguments for and against fiscal stimulus.",
  ],
  sections: [
    {
      heading: "Tools and multipliers",
      body: [
        "Government purchases add to spending directly. A tax cut works indirectly: households spend only the MPC share of it, so the tax multiplier (MPC × spending multiplier) is smaller than the spending multiplier. Raising both G and taxes by the same amount still raises output — the balanced-budget multiplier is about 1 in the simple model.",
        "Real-world multipliers are typically estimated between about 0.5 and 2, depending on the state of the economy, how open it is, and how the central bank responds.",
      ],
    },
    {
      heading: "Automatic stabilisers",
      body: [
        "Some parts of the budget respond to the cycle without any new decision: in a recession, income-tax revenue falls and employment-insurance (Canada) or unemployment-insurance (US) payments rise. These automatic stabilisers support spending when it is weak and enlarge the deficit temporarily.",
      ],
    },
    {
      heading: "Lags",
      body: [
        "Discretionary policy takes time: to recognise the recession, pass a budget and start spending. If stimulus arrives after the economy has recovered, it can push output above potential and add to inflation. That is why many economists favour 'timely, targeted and temporary' measures and rely on automatic stabilisers.",
      ],
    },
    {
      heading: "Deficits and debt",
      body: [
        "The deficit is the gap between spending and revenue in one year; the debt is the accumulated total. What matters for sustainability is debt relative to GDP. If the interest rate on debt (r) is below the economy's growth rate (g), the debt ratio tends to fall over time even with small deficits; if r is above g, it grows unless the government runs primary surpluses.",
      ],
    },
  ],
  equations: [
    { label: "Spending multiplier", formula: "k_G = 1 / (1 − MPC)   (smaller with crowding out)" },
    { label: "Tax multiplier", formula: "k_T = MPC / (1 − MPC)" },
    { label: "Balanced budget", formula: "k_G − k_T ≈ 1" },
    { label: "Debt dynamics", formula: "debt ratio next year ≈ debt ratio × (1 + r)/(1 + g) + deficit" },
  ],
  loops: [
    { type: "B", name: "Automatic stabilisers", chain: "Output ↓ → taxes ↓, transfers ↑ → disposable income supported → output falls less" },
  ],
  keyTerms: [
    { term: "Expansionary fiscal policy", def: "Raising spending or cutting taxes to increase aggregate demand." },
    { term: "Automatic stabiliser", def: "Tax or spending item that changes with the cycle without new legislation." },
    { term: "Budget deficit", def: "Government spending minus revenue in a given year." },
    { term: "Public debt", def: "Accumulated past deficits minus surpluses." },
    { term: "Policy lag", def: "Time between a shock and the policy response taking effect." },
    { term: "r − g", def: "Interest rate minus growth rate; decides whether the debt ratio grows on its own." },
  ],
  experiments: [
    {
      title: "Stimulus that arrives on time",
      preset: "Timely stimulus",
      steps: ["Load the preset.", "Compare the output gap with and without policy."],
      observe: "Starting quickly, the stimulus fills much of the gap while it is largest.",
    },
    {
      title: "Too late",
      preset: "Late stimulus",
      steps: ["Load the preset (lag of 8 quarters).", "Look at the gap after the economy recovers. Check 'Peak overshoot'."],
      observe: "The same stimulus now arrives when the gap has nearly closed, pushing output above potential — a risk of inflation.",
    },
    {
      title: "Tax cut vs spending",
      preset: "Tax cut instead",
      steps: ["Load the preset (2 % of GDP tax cut, no new spending).", "Compare the effect with 'Timely stimulus'."],
      observe: "The tax cut has a smaller effect because part of it is saved (multiplier MPC × k_G).",
    },
  ],
  quiz: [
    {
      q: "With MPC = 0.75 (no crowding out), the tax multiplier is…",
      options: ["0.75", "3", "4", "1"],
      answer: 1,
      explain: "0.75 / (1 − 0.75) = 3, smaller than the spending multiplier of 4.",
    },
    {
      q: "Which is an automatic stabiliser?",
      options: ["A new infrastructure plan", "Employment / unemployment insurance payments", "A central bank rate cut", "A one-time cheque passed by parliament"],
      answer: 1,
      explain: "Payments rise automatically as unemployment rises.",
    },
    {
      q: "The main danger of a long implementation lag is that stimulus…",
      options: ["Never affects output", "Arrives after recovery and overheats the economy", "Reduces the debt", "Lowers taxes"],
      answer: 1,
      explain: "Timing matters: late stimulus can be destabilising.",
    },
    {
      q: "If the interest rate on debt is below the growth rate of GDP and the budget is balanced (excluding interest), the debt-to-GDP ratio…",
      options: ["Rises", "Falls over time", "Stays fixed", "Becomes negative immediately"],
      answer: 1,
      explain: "GDP grows faster than the debt compounds.",
    },
    {
      q: "Government raises both spending and taxes by $10 billion. In the simple model output…",
      options: ["Falls by $10 billion", "Is unchanged", "Rises by about $10 billion", "Rises by $40 billion"],
      answer: 2,
      explain: "The balanced-budget multiplier is about 1.",
    },
  ],
  readings: [
    { cite: "OpenStax (2022). Principles of Macroeconomics, 3rd ed., Ch. 17: Government Budgets and Fiscal Policy." },
    { cite: "Ramey, V. (2019). Ten years after the financial crisis: what have we learned from the renaissance in fiscal research? Journal of Economic Perspectives, 33(2), 89-114." },
    { cite: "Blanchard, O. (2019). Public debt and low interest rates. American Economic Review, 109(4), 1197-1229." },
    { cite: "Parliamentary Budget Officer (Canada) and Congressional Budget Office (US) — budget and fiscal outlook reports." },
  ],
  discussion: [
    "Should governments run deficits during recessions and surpluses during booms? Why is that hard in practice?",
    "Compare the COVID-19 fiscal response in Canada and the US. Which tools were used and how quickly?",
  ],
  charts: [
    {
      id: "m08-gap",
      title: "Output gap: with and without fiscal policy (% of potential)",
      x: "quarter",
      xLabel: "Quarter",
      wide: true,
      series: [
        { key: "stimulus", name: "Stimulus (% GDP)", color: "#fb923c", type: "bar" },
        { key: "gapNoPolicy", name: "No policy", color: C.slate, dashed: true },
        { key: "gapPolicy", name: "With policy", color: "#fb923c" },
      ],
      refY: [{ value: 0, label: "potential", color: C.nature }],
    },
    {
      id: "m08-debt",
      title: "Public debt (% of GDP)",
      data: "debt",
      x: "year",
      xLabel: "Year",
      series: [
        { key: "withoutStimulus", name: "Without stimulus", color: C.slate, dashed: true },
        { key: "withStimulus", name: "With stimulus", color: C.pollution },
      ],
    },
  ],
  kpis: (r, p) => {
    const e = r.extra as Record<string, any>;
    const s = r.series;
    const overshoot = Math.max(0, ...s.map((x) => x.gapPolicy));
    const avgAbs = s.reduce((a, x) => a + Math.abs(x.gapPolicy), 0) / s.length;
    const avgAbsNone = s.reduce((a, x) => a + Math.abs(x.gapNoPolicy), 0) / s.length;
    const d = e.debt as Record<string, number>[];
    return [
      { label: "Multipliers (G / T)", value: `${fmt(e.kG, 2)} / ${fmt(e.kT, 2)}`, tone: "neutral" },
      { label: "Average |gap|", value: `${fmt(avgAbs, 2)}%`, tone: avgAbs < avgAbsNone ? "good" : "bad", hint: `no policy: ${fmt(avgAbsNone, 2)}%` },
      { label: "Peak overshoot", value: `${fmt(overshoot, 2)}%`, tone: overshoot > 0.5 ? "bad" : overshoot > 0.1 ? "warn" : "good", hint: "output above potential" },
      { label: "Debt after 30 yrs", value: `${fmt(last(d).withStimulus, 1)}%`, tone: last(d).withStimulus > Number(p.debt0) ? "warn" : "good", hint: `without: ${fmt(last(d).withoutStimulus, 1)}%` },
    ];
  },
  labFile: "module_08_fiscal.py",
};

export default m08;
