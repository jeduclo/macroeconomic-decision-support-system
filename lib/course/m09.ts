import { Banknote } from "lucide-react";
import type { CourseModule } from "./types";
import { C, fmt, peak, trough, last } from "./helpers";

const m09: CourseModule = {
  id: "m09",
  number: 9,
  title: "Monetary Policy and the Transmission Mechanism",
  short: "Monetary Policy",
  tagline: "From the central bank's policy rate to your mortgage, your job and the price of groceries.",
  accent: "#22d3ee",
  icon: Banknote,
  duration: "Week 9 · ~4 h",
  summary:
    "Central banks such as the Bank of Canada and the Federal Reserve steer the economy by setting a short-term policy interest rate. This module explains the tools of monetary policy, a simple Taylor rule for choosing the rate, and the transmission mechanism — the chain of effects from the policy rate to market interest rates, the exchange rate and asset prices, then to spending, output and finally inflation. You will see why policy works with long lags and why credibility matters so much.",
  objectives: [
    "Describe the goals and tools of a modern central bank (policy rate, forward guidance, quantitative easing).",
    "Use a Taylor rule to explain how central banks respond to inflation and the output gap.",
    "Trace the transmission mechanism through the interest-rate, exchange-rate and wealth channels.",
    "Explain why monetary policy works with 'long and variable lags'.",
    "Explain why credible, well-anchored inflation expectations make policy more effective.",
  ],
  sections: [
    {
      heading: "Goals and tools",
      body: [
        "The Bank of Canada targets 2 % inflation; the Federal Reserve has a dual mandate of maximum employment and 2 % inflation. Their main tool is a short-term policy rate (the overnight rate in Canada, the federal funds rate in the US). When rates hit zero, they also use forward guidance (promises about future rates) and quantitative easing (buying bonds to lower longer-term rates).",
      ],
    },
    {
      heading: "A rule of thumb: the Taylor rule",
      body: [
        "John Taylor (1993) noticed that the Fed's decisions were well described by a simple rule: policy rate = neutral rate + inflation + 0.5 × (inflation − target) + 0.5 × output gap. The key lesson — the Taylor principle — is that when inflation rises the central bank should raise the nominal rate by more than one-for-one, so the real interest rate rises and cools spending.",
      ],
    },
    {
      heading: "The transmission mechanism",
      body: ["A change in the policy rate reaches the economy through several channels:"],
      bullets: [
        "Interest-rate channel: banks change mortgage, loan and bond rates; higher real rates reduce investment, home buying and durable consumption.",
        "Exchange-rate channel: higher rates attract foreign capital and raise the currency, making exports dearer and imports cheaper (important for open economies like Canada).",
        "Wealth / asset-price channel: higher rates lower stock and house prices, so households feel poorer and spend less.",
        "Expectations channel: if people trust the central bank, inflation expectations stay near 2 % and wage and price setting does much of the work.",
        "Lags: the full effect on output takes about a year and on inflation up to two years.",
      ],
    },
    {
      heading: "Supply shocks and credibility",
      body: [
        "A demand shock pushes inflation and output in the same direction, so the central bank's job is easy: move rates to offset it. A cost-push shock raises inflation while lowering output — a trade-off. If expectations are well anchored, the bank can 'look through' a temporary shock; if credibility is weak, higher inflation becomes built into expectations and the bank must respond harder, at a bigger cost to output — as in the early 1980s, and again in 2022-2023.",
      ],
    },
  ],
  equations: [
    { label: "Taylor rule", formula: "i = r* + π + φπ·(π − 2) + φy·gap" },
    { label: "Real interest rate", formula: "r = i − expected inflation" },
    { label: "Expectations", formula: "expected π = credibility × 2 % + (1 − credibility) × last π" },
    { label: "Transmission", formula: "policy rate → market rates → real rate → (lag) spending → output gap → inflation" },
  ],
  loops: [
    { type: "B", name: "Inflation targeting", chain: "Inflation ↑ → policy rate ↑ → real rate ↑ → spending ↓ → output gap ↓ → inflation ↓" },
  ],
  keyTerms: [
    { term: "Policy rate", def: "The short-term interest rate the central bank targets (overnight rate, federal funds rate)." },
    { term: "Taylor rule", def: "A simple formula linking the policy rate to inflation and the output gap." },
    { term: "Transmission mechanism", def: "The channels through which monetary policy affects spending, output and inflation." },
    { term: "Forward guidance", def: "Central bank communication about the likely future path of rates." },
    { term: "Quantitative easing", def: "Large-scale purchases of bonds to lower long-term interest rates." },
    { term: "Anchored expectations", def: "Inflation expectations that stay close to the target even after shocks." },
  ],
  experiments: [
    {
      title: "Offsetting a demand shock",
      preset: "Demand shock, Taylor rule",
      steps: ["Load the preset.", "Compare the gap with and without a policy response.", "Watch the policy rate fall and then return."],
      observe: "Cutting the rate shortens and softens the recession. Effects build with a lag of a few quarters.",
    },
    {
      title: "Credibility pays",
      preset: "Cost-push shock, credible bank",
      steps: ["Load the preset, note peak inflation.", "Then load 'Cost-push shock, weak credibility'."],
      observe: "With anchored expectations inflation returns quickly; with weak credibility it persists and the bank must raise rates more.",
    },
    {
      title: "Too passive",
      preset: "Passive central bank",
      steps: ["Load the preset (φπ = 0.5).", "Does the real interest rate rise when inflation rises?"],
      observe: "Violating the Taylor principle: the real rate falls, so inflation stays high for longer.",
    },
  ],
  quiz: [
    {
      q: "Inflation is 4 %, the target is 2 %, the gap is 0, r* = 2 % and φπ = 0.5. The Taylor rule rate is…",
      options: ["4 %", "6 %", "7 %", "8 %"],
      answer: 2,
      explain: "2 + 4 + 0.5 × (4 − 2) = 7 %.",
    },
    {
      q: "The Taylor principle says that when inflation rises by 1 point the policy rate should rise by…",
      options: ["Less than 1 point", "Exactly 0", "More than 1 point", "It should fall"],
      answer: 2,
      explain: "So that the real interest rate rises and cools demand.",
    },
    {
      q: "Which is the exchange-rate channel of a rate increase?",
      options: ["The currency rises, exports fall", "House prices rise", "Taxes rise", "The money supply rises"],
      answer: 0,
      explain: "Higher returns attract capital, the currency appreciates and net exports fall.",
    },
    {
      q: "Why do central banks look 18-24 months ahead when setting rates?",
      options: ["Data is published late", "Policy affects inflation with long lags", "They meet only twice a year", "Rates are fixed by law"],
      answer: 1,
      explain: "Today's decision mostly affects inflation one to two years later.",
    },
    {
      q: "With well-anchored inflation expectations, a temporary oil price shock…",
      options: ["Must be met with very large rate hikes", "Can largely be 'looked through'", "Always causes hyperinflation", "Lowers inflation"],
      answer: 1,
      explain: "Expectations stay near target, so inflation falls back on its own as the shock fades.",
    },
  ],
  readings: [
    { cite: "Bank of Canada — 'How monetary policy works: the transmission mechanism' (bankofcanada.ca)." },
    { cite: "Federal Reserve — 'The Fed Explained: What the central bank does', Ch. 3 (federalreserve.gov)." },
    { cite: "Taylor, J. B. (1993). Discretion versus policy rules in practice. Carnegie-Rochester Conference Series on Public Policy, 39, 195-214." },
    { cite: "Mishkin, F. (1995). Symposium on the monetary transmission mechanism. Journal of Economic Perspectives, 9(4), 3-10." },
  ],
  discussion: [
    "In 2021 many central banks called the rise in inflation 'transitory'. Using this module, why might that judgement have been reasonable at the time — and why did it turn out wrong?",
    "Canada is very open to trade. Which transmission channel might be more important for the Bank of Canada than for the Fed?",
  ],
  charts: [
    {
      id: "m09-rates",
      title: "Interest rates (%)",
      x: "quarter",
      xLabel: "Quarter",
      wide: true,
      series: [
        { key: "policyRate", name: "Policy rate", color: "#22d3ee" },
        { key: "marketRate", name: "Market (lending) rate", color: C.capital, dashed: true },
        { key: "realRate", name: "Real rate", color: C.violet },
      ],
      refY: [{ value: 4, label: "neutral", color: C.slate }],
    },
    {
      id: "m09-pi",
      title: "Inflation (%)",
      x: "quarter",
      xLabel: "Quarter",
      series: [
        { key: "inflation", name: "With policy", color: C.pollution },
        { key: "inflationNoResponse", name: "No response", color: C.slate, dashed: true },
        { key: "expected", name: "Expected inflation", color: C.output, dashed: true },
      ],
      refY: [{ value: 2, label: "2 % target", color: C.nature }],
    },
    {
      id: "m09-gap",
      title: "Output gap (%)",
      x: "quarter",
      xLabel: "Quarter",
      series: [
        { key: "gap", name: "With policy", color: "#22d3ee", type: "area" },
        { key: "gapNoResponse", name: "No response", color: C.slate, dashed: true },
      ],
      refY: [{ value: 0, label: "", color: C.slate }],
    },
    {
      id: "m09-channels",
      title: "Total effect on output, by channel",
      subtitle: "Sum over all quarters (positive = stimulus)",
      data: "channels",
      x: "idx",
      xTickLabels: ["Interest rate", "Exchange rate", "Wealth"],
      series: [{ key: "value", name: "Contribution to output gap", color: "#22d3ee", type: "bar" }],
    },
  ],
  kpis: (r) => {
    const s = r.series;
    const piPeak = peak(s, "inflation");
    const gapLow = trough(s, "gap");
    const rateHi = peak(s, "policyRate");
    const rateLo = trough(s, "policyRate");
    const rateMove = Math.abs(rateHi.policyRate - 4) > Math.abs(rateLo.policyRate - 4) ? rateHi : rateLo;
    const tail = s.slice(-8);
    const settled = tail.reduce((a, x) => a + x.inflation, 0) / tail.length;
    return [
      { label: "Peak inflation", value: `${fmt(piPeak.inflation, 1)}%`, tone: piPeak.inflation < 3 ? "good" : piPeak.inflation < 5 ? "warn" : "bad", hint: `quarter ${piPeak.quarter}` },
      { label: "Deepest output gap", value: `${fmt(gapLow.gap, 1)}%`, tone: gapLow.gap > -1 ? "good" : gapLow.gap > -2 ? "warn" : "bad" },
      { label: "Policy rate at its extreme", value: `${fmt(rateMove.policyRate, 1)}%`, tone: "neutral", hint: `quarter ${rateMove.quarter}` },
      { label: "Inflation, last 2 yrs", value: `${fmt(settled, 1)}%`, tone: Math.abs(settled - 2) < 0.3 ? "good" : "warn", hint: `final: ${fmt(last(s).inflation, 1)}%` },
    ];
  },
  labFile: "module_09_monetary.py",
};

export default m09;
