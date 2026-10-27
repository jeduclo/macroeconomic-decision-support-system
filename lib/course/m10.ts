import { Gauge } from "lucide-react";
import type { CourseModule } from "./types";
import { C, fmt, peak, last } from "./helpers";

const m10: CourseModule = {
  id: "m10",
  number: 10,
  title: "Capstone: Policy Lab",
  short: "Policy Lab",
  tagline: "You are the finance minister and the central bank governor. What do you do?",
  accent: "#e879f9",
  icon: Gauge,
  duration: "Week 10 · ~4 h",
  summary:
    "The capstone brings everything together. Choose a scenario — a collapse in demand, an oil price shock or a financial crisis — and set fiscal and monetary policy. The lab tracks the output gap, unemployment (via Okun's law), inflation, the policy rate and public debt, and scores your choices with a simple loss function that penalises both output gaps and inflation away from target. Compare your strategy with doing nothing.",
  objectives: [
    "Diagnose whether a shock is mainly a demand or a supply shock.",
    "Design a fiscal-monetary policy mix suited to the shock.",
    "Use a loss function to compare policy strategies.",
    "Weigh short-run stabilisation against inflation and debt costs.",
    "Write a short policy brief defending a recommendation.",
  ],
  sections: [
    {
      heading: "Diagnose first",
      body: [
        "Demand shocks move output and inflation in the same direction, so stabilising one stabilises the other. Supply shocks move them in opposite directions and force a trade-off. Financial crises are demand shocks in which the transmission mechanism is damaged: banks pass on rate cuts only partly, so monetary policy is weaker and fiscal policy matters more.",
      ],
    },
    {
      heading: "Scoring policy",
      body: [
        "Economists often judge policy with a loss function: the average of (output gap)² + (inflation − 2)². Squaring means that big misses are penalised much more than small ones and that overshooting counts as much as undershooting. A lower score is better.",
      ],
    },
    {
      heading: "Lessons from history",
      body: [],
      bullets: [
        "2008-2009: rates cut to near zero, fiscal stimulus and quantitative easing — a coordinated response to a financial crisis.",
        "1970s-1980s: accommodating oil shocks let inflation expectations drift up; the Volcker disinflation then caused a deep recession.",
        "2020: very fast, very large fiscal and monetary support after the pandemic shock; the 2021-2023 inflation surge then required rapid rate increases.",
      ],
    },
    {
      heading: "Your brief",
      body: [
        "For each scenario, write one page: the diagnosis, your policy settings, the results (loss, peak unemployment, peak inflation, debt) compared with doing nothing, and the main risks of your strategy.",
      ],
    },
  ],
  equations: [
    { label: "Loss function", formula: "L = average of [gap² + (π − 2)²]   (lower is better)" },
    { label: "Okun's law", formula: "unemployment ≈ 6 % − gap / 2" },
    { label: "Taylor rule", formula: "i = 4 + φπ·(π − 2) + φy·gap" },
    { label: "Fiscal impulse", formula: "spending for 6 quarters, starting after the fiscal lag" },
  ],
  loops: [],
  keyTerms: [
    { term: "Policy mix", def: "The joint setting of fiscal and monetary policy." },
    { term: "Loss function", def: "A score that penalises deviations of output and inflation from their targets." },
    { term: "Look through", def: "Choosing not to react to a temporary supply shock." },
    { term: "Impaired transmission", def: "When banks and markets do not pass on policy-rate changes fully." },
  ],
  experiments: [
    {
      title: "Coordinated response to a demand collapse",
      preset: "Demand collapse: coordinated",
      steps: ["Load the preset.", "Compare the loss with 'Do nothing'.", "Set fiscal stimulus to 0 — how much worse is the loss?"],
      observe: "Monetary and fiscal policy together cut the loss sharply; monetary policy alone does part of the job.",
    },
    {
      title: "Oil shock: fight hard or look through?",
      preset: "Oil shock: fight hard",
      steps: ["Load the preset and note the loss.", "Load 'Oil shock: look through' and compare."],
      observe: "With credible expectations, a measured response gives a much lower loss than fighting the temporary inflation hard — and barely reacting at all ('Do nothing') does about as well, because the shock fades on its own.",
    },
    {
      title: "Financial crisis",
      preset: "Financial crisis: all hands",
      steps: ["Load the preset.", "Set fiscal stimulus to 0, then raise φπ and φy. Can monetary policy alone close the gap?"],
      observe: "When transmission is impaired, rate cuts do much less, so fiscal policy carries more of the load (at the cost of higher debt).",
    },
  ],
  quiz: [
    {
      q: "Which shock creates a trade-off between stabilising output and stabilising inflation?",
      options: ["A collapse in consumer confidence", "A rise in oil prices", "A rise in government spending", "A fall in exports"],
      answer: 1,
      explain: "A cost-push shock raises inflation while lowering output.",
    },
    {
      q: "In a financial crisis monetary policy is weaker because…",
      options: ["Rates cannot be cut", "Banks pass on rate cuts only partly", "Inflation is very high", "Fiscal policy is banned"],
      answer: 1,
      explain: "Damaged transmission means lower policy rates do not fully reach borrowers.",
    },
    {
      q: "Why does the loss function square the gaps?",
      options: ["To make numbers positive and penalise large misses more", "To make it easier to compute", "Because inflation is always positive", "To ignore small shocks"],
      answer: 0,
      explain: "Squaring treats over- and undershooting alike and weights big misses heavily.",
    },
    {
      q: "A cost of large fiscal stimulus is…",
      options: ["Lower unemployment", "Higher public debt", "Lower inflation", "Lower interest rates forever"],
      answer: 1,
      explain: "Stimulus is financed by borrowing, raising debt relative to GDP.",
    },
    {
      q: "Output gap −3 %, inflation 2 %. Using Okun's law in this lab, unemployment is about…",
      options: ["4.5 %", "6 %", "7.5 %", "9 %"],
      answer: 2,
      explain: "6 − (−3)/2 = 7.5 %.",
    },
  ],
  readings: [
    { cite: "Bernanke, B. (2015). The Courage to Act: A Memoir of a Crisis and Its Aftermath. W. W. Norton." },
    { cite: "Bank of Canada (2021). Monetary Policy Framework Renewal." },
    { cite: "Blanchard, O. & Bernanke, B. (2023). What caused the U.S. pandemic-era inflation? Brookings / NBER Working Paper 31417." },
    { cite: "OpenStax (2022). Principles of Macroeconomics, 3rd ed., Ch. 20: Macroeconomic Policy Around the World." },
  ],
  discussion: [
    "Should central banks and finance ministries coordinate openly, or is central-bank independence more important?",
    "Pick a recent recession in Canada or the US. How well did the policy mix match the type of shock?",
  ],
  charts: [
    {
      id: "m10-gap",
      title: "Output gap (%)",
      x: "quarter",
      xLabel: "Quarter",
      series: [
        { key: "gap", name: "Your policy", color: "#e879f9", type: "area" },
        { key: "gapNone", name: "Do nothing", color: C.slate, dashed: true },
      ],
      refY: [{ value: 0, label: "", color: C.slate }],
    },
    {
      id: "m10-pi",
      title: "Inflation (%)",
      x: "quarter",
      xLabel: "Quarter",
      series: [
        { key: "inflation", name: "Your policy", color: C.pollution },
        { key: "inflationNone", name: "Do nothing", color: C.slate, dashed: true },
      ],
      refY: [{ value: 2, label: "target", color: C.nature }],
    },
    {
      id: "m10-u",
      title: "Unemployment rate (%)",
      x: "quarter",
      xLabel: "Quarter",
      series: [
        { key: "unemployment", name: "Your policy", color: C.capital },
        { key: "unemploymentNone", name: "Do nothing", color: C.slate, dashed: true },
      ],
    },
    {
      id: "m10-rd",
      title: "Policy rate (%) and public debt (% GDP)",
      x: "quarter",
      xLabel: "Quarter",
      series: [
        { key: "policyRate", name: "Policy rate (left)", color: C.cyan },
        { key: "debt", name: "Debt, your policy (right)", color: C.output, axis: "right" },
        { key: "debtNone", name: "Debt, do nothing (right)", color: C.slate, axis: "right", dashed: true },
      ],
    },
  ],
  kpis: (r) => {
    const e = r.extra as Record<string, number>;
    const s = r.series;
    const uPeak = peak(s, "unemployment");
    const piPeak = peak(s, "inflation");
    const better = e.loss < e.lossNone;
    return [
      { label: "Policy score (loss)", value: fmt(e.loss, 2), tone: better ? "good" : "bad", hint: `do nothing: ${fmt(e.lossNone, 2)}` },
      { label: "Peak unemployment", value: `${fmt(uPeak.unemployment, 1)}%`, tone: uPeak.unemployment < 7 ? "good" : uPeak.unemployment < 8 ? "warn" : "bad" },
      { label: "Peak inflation", value: `${fmt(piPeak.inflation, 1)}%`, tone: piPeak.inflation < 3 ? "good" : piPeak.inflation < 5 ? "warn" : "bad" },
      { label: "Debt at end", value: `${fmt(last(s).debt, 1)}%`, tone: last(s).debt - last(s).debtNone > 5 ? "warn" : "neutral", hint: `do nothing: ${fmt(last(s).debtNone, 1)}%` },
    ];
  },
  labFile: "module_10_policy_lab.py",
};

export default m10;
