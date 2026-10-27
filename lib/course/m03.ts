import { TrendingUp } from "lucide-react";
import type { CourseModule } from "./types";
import { C, fmt, last } from "./helpers";

const m03: CourseModule = {
  id: "m03",
  number: 3,
  title: "Inflation",
  short: "Inflation",
  tagline: "When prices rise, what matters is what your money can buy.",
  accent: "#fb7185",
  icon: TrendingUp,
  duration: "Week 3 · ~3 h",
  summary:
    "Inflation is a sustained rise in the general price level. This module shows how the Consumer Price Index (CPI) measures it, why inflation can come from too much money chasing too few goods (the quantity theory), from strong demand or from rising costs, and how to turn nominal wages and interest rates into real ones. You will also see why central banks such as the Bank of Canada and the Federal Reserve aim for about 2 %.",
  objectives: [
    "Calculate a price index and an inflation rate from a basket of goods.",
    "Use the quantity equation to explain long-run inflation.",
    "Distinguish demand-pull and cost-push inflation.",
    "Convert nominal wages and interest rates into real values.",
    "Explain the costs of inflation and why central banks target low, stable inflation.",
  ],
  sections: [
    {
      heading: "Measuring inflation: the CPI",
      body: [
        "Statistical agencies price a fixed 'basket' of goods and services that a typical household buys — food, shelter, transportation, clothing, recreation. The CPI = cost of the basket this year ÷ cost in the base year × 100. The inflation rate is the percentage change in the CPI over a year.",
        "The CPI can overstate the true rise in the cost of living: people switch to cheaper substitutes, product quality improves and new goods appear. Agencies adjust for some of these biases.",
      ],
    },
    {
      heading: "Where long-run inflation comes from",
      body: [
        "The quantity equation says money × velocity = price level × real output (M·V = P·Y). If velocity is roughly stable and real output grows because of productivity, then sustained inflation ≈ money growth − real output growth. Very high inflations (hyperinflations) have always involved very rapid money growth, often to finance government deficits.",
      ],
    },
    {
      heading: "Demand-pull and cost-push",
      body: [],
      bullets: [
        "Demand-pull: spending grows faster than the economy's capacity, so firms raise prices (e.g. a boom, large stimulus).",
        "Cost-push: production costs rise — oil, wages, supply-chain disruptions — and firms pass them on. The 1970s oil shocks and the 2021-2022 surge (Canada's CPI peaked at 8.1 % and the U.S. at 9.1 % in June 2022) mixed both.",
        "Expectations matter: if people expect inflation, they ask for higher wages and set higher prices, which can make inflation persist.",
      ],
    },
    {
      heading: "Real vs nominal",
      body: [
        "A raise of 3 % when prices rise 5 % is a cut in your real wage. Real wage ≈ nominal wage growth − inflation. Likewise the real interest rate ≈ nominal rate − inflation (the Fisher relation): a 5 % savings rate with 8 % inflation loses purchasing power. Unexpected inflation redistributes from lenders to borrowers and from people on fixed incomes. The Bank of Canada targets 2 % CPI inflation (the middle of a 1-3 % range) and the Federal Reserve targets 2 % PCE inflation.",
      ],
    },
  ],
  equations: [
    { label: "Price index", formula: "CPI = cost of basket now / cost in base year × 100" },
    { label: "Inflation rate", formula: "π = (CPI this year − CPI last year) / CPI last year × 100" },
    { label: "Quantity theory", formula: "inflation ≈ money growth + velocity change − real growth" },
    { label: "Real interest rate", formula: "real rate ≈ nominal rate − inflation" },
    { label: "Rule of 70", formula: "years for prices to double ≈ 70 / inflation %" },
  ],
  loops: [],
  keyTerms: [
    { term: "Inflation", def: "A sustained increase in the general price level." },
    { term: "CPI", def: "Consumer Price Index: the cost of a fixed basket of consumer goods relative to a base year." },
    { term: "Deflation", def: "A sustained fall in the general price level." },
    { term: "Real wage", def: "The wage measured in purchasing power: nominal wage ÷ price level." },
    { term: "Fisher relation", def: "Real interest ≈ nominal interest − inflation." },
    { term: "Hyperinflation", def: "Extremely rapid inflation, often over 50 % a month." },
  ],
  experiments: [
    {
      title: "Money growth and prices",
      preset: "Price stability (2 %)",
      steps: ["Load the preset (4 % money growth, 2 % real growth).", "Raise money growth to 10 %."],
      observe: "Inflation rises almost one-for-one with money growth once real growth is fixed.",
    },
    {
      title: "The 1970s",
      preset: "1970s inflation",
      steps: ["Load the preset.", "Look at the real wage and the real interest rate."],
      observe: "Wages rising 8 % fall behind ~9 % inflation, and savers earn a negative real interest rate.",
    },
    {
      title: "High inflation",
      preset: "High inflation episode",
      steps: ["Load the preset.", "How many years until prices double?"],
      observe: "At ~30 % inflation prices double in about 2-3 years — money stops being a good store of value.",
    },
  ],
  quiz: [
    {
      q: "A basket costs $200 in the base year and $214 this year. The CPI is…",
      options: ["14", "107", "114", "214"],
      answer: 1,
      explain: "214 ÷ 200 × 100 = 107, so prices are 7 % higher than in the base year.",
    },
    {
      q: "Money grows 6 %, real GDP grows 2 %, velocity is stable. Inflation is about…",
      options: ["2 %", "4 %", "6 %", "8 %"],
      answer: 1,
      explain: "π ≈ 6 − 2 = 4 %.",
    },
    {
      q: "Your wage rises 3 % while inflation is 5 %. Your real wage…",
      options: ["Rises 8 %", "Rises 2 %", "Falls about 2 %", "Is unchanged"],
      answer: 2,
      explain: "Real wage growth ≈ 3 − 5 = −2 %.",
    },
    {
      q: "A sudden jump in oil prices that raises inflation is an example of…",
      options: ["Demand-pull inflation", "Cost-push inflation", "Deflation", "Hyperinflation"],
      answer: 1,
      explain: "Higher input costs push prices up from the supply side.",
    },
    {
      q: "Who tends to gain from unexpectedly high inflation?",
      options: ["Savers", "Lenders", "Borrowers with fixed-rate loans", "People on fixed pensions"],
      answer: 2,
      explain: "They repay loans with dollars that are worth less than expected.",
    },
  ],
  readings: [
    { cite: "OpenStax (2022). Principles of Macroeconomics, 3rd ed., Ch. 9: Inflation." },
    { cite: "Bank of Canada — 'Inflation-control target' and 'Understanding inflation' (bankofcanada.ca)." },
    { cite: "Federal Reserve — 'The Fed Explained', Ch. 3: Conducting monetary policy (federalreserve.gov)." },
    { cite: "Friedman, M. (1970). The Counter-Revolution in Monetary Theory. Institute of Economic Affairs." },
  ],
  discussion: [
    "If inflation is 2 % every year, does it still hurt anyone? Why might a little inflation even help?",
    "Why could a 'basket' that is right for the average household be wrong for students or retirees?",
  ],
  charts: [
    {
      id: "m03-p",
      title: "Price level and the real wage (index, year 0 = 100)",
      x: "year",
      xLabel: "Year",
      wide: true,
      series: [
        { key: "priceLevel", name: "Price level", color: "#fb7185", type: "area" },
        { key: "nominalWage", name: "Nominal wage", color: C.output, dashed: true },
        { key: "realWage", name: "Real wage", color: C.nature },
      ],
    },
    {
      id: "m03-r",
      title: "Inflation and interest rates (%)",
      x: "year",
      xLabel: "Year",
      series: [
        { key: "inflation", name: "Inflation", color: "#fb7185" },
        { key: "nominalRate", name: "Nominal interest rate", color: C.output, dashed: true },
        { key: "realRate", name: "Real interest rate", color: C.capital },
      ],
      refY: [
        { value: 2, label: "2 % target", color: C.slate },
        { value: 0, label: "", color: C.slate },
      ],
    },
  ],
  kpis: (r) => {
    const e = r.extra as Record<string, number>;
    const end = last(r.series);
    return [
      { label: "Inflation", value: `${fmt(e.inflation, 1)}%`, tone: e.inflation <= 3 && e.inflation >= 1 ? "good" : e.inflation <= 6 ? "warn" : "bad", hint: "per year" },
      { label: "Real interest rate", value: `${fmt(end.realRate, 1)}%`, tone: end.realRate >= 0 ? "good" : "bad" },
      { label: "Real wage after 20 yrs", value: `${end.realWage >= 100 ? "+" : ""}${fmt(end.realWage - 100, 0)}%`, tone: end.realWage >= 100 ? "good" : "bad" },
      { label: "Prices double in", value: e.doubling > 0 ? `${fmt(e.doubling, 1)} yrs` : "never", tone: "neutral", hint: "rule of 70" },
    ];
  },
  labFile: "module_03_inflation.py",
};

export default m03;
