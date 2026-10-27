import { Landmark } from "lucide-react";
import type { CourseModule } from "./types";
import { C, fmt, last } from "./helpers";

const m01: CourseModule = {
  id: "m01",
  number: 1,
  title: "Measuring the Economy: GDP",
  short: "GDP",
  tagline: "One number for everything an economy produces — and what it leaves out.",
  accent: "#38bdf8",
  icon: Landmark,
  duration: "Week 1 · ~3 h",
  summary:
    "Gross domestic product (GDP) is the market value of all final goods and services produced within a country in a given period. In this module you will learn the three ways to measure it, build GDP from its spending components (C + I + G + NX), separate nominal from real GDP, and see why economists care about GDP — and where it falls short as a measure of well-being.",
  objectives: [
    "Define GDP and explain 'market value', 'final' and 'within a country'.",
    "Compute GDP with the expenditure approach: C + I + G + (X − M).",
    "Distinguish nominal GDP, real GDP and the GDP deflator.",
    "Calculate growth rates and explain why real growth is what matters for living standards.",
    "Describe the limits of GDP as a measure of well-being.",
  ],
  sections: [
    {
      heading: "What GDP measures",
      body: [
        "GDP adds up the market value of all final goods and services produced inside a country's borders during a year or a quarter. 'Final' means we count the car, not the steel and tires used to make it — otherwise we would count the same value several times. Used goods and purely financial transactions (buying shares) are not new production, so they are not included.",
        "Statistical agencies publish GDP every quarter: Statistics Canada in Canada and the Bureau of Economic Analysis (BEA) in the United States.",
      ],
    },
    {
      heading: "Three ways to measure GDP",
      body: ["Because every dollar spent on output is a dollar of someone's income, three approaches give (in principle) the same answer:"],
      bullets: [
        "Expenditure approach: add up spending on final output — consumption (C), investment (I), government purchases (G) and net exports (X − M).",
        "Income approach: add up wages, profits, rent and interest earned in production (plus taxes on production and depreciation).",
        "Production (value-added) approach: add up the value each industry adds at its stage of production.",
      ],
    },
    {
      heading: "The spending components",
      body: [
        "Consumption is usually the biggest part — over half of GDP in Canada and roughly two-thirds in the United States. Investment means new capital: machines, buildings, new homes and changes in inventories (not buying shares). Government purchases include public services and infrastructure but exclude transfer payments such as pensions, which are not payments for production. Imports are subtracted because C, I and G include spending on foreign-made goods.",
      ],
    },
    {
      heading: "Nominal vs real GDP",
      body: [
        "Nominal GDP values output at today's prices, so it can rise just because prices rise. Real GDP values output at the prices of a fixed base year, so it only rises when the quantity of goods and services rises. The GDP deflator = nominal GDP ÷ real GDP × 100 is a broad measure of the price level.",
        "GDP per person is a common indicator of average living standards, but it ignores the distribution of income, unpaid work at home, leisure, environmental damage and the informal economy.",
      ],
    },
  ],
  equations: [
    { label: "Expenditure approach", formula: "GDP = C + I + G + (X − M)" },
    { label: "Real vs nominal", formula: "Nominal GDP = Real GDP × Price index / 100" },
    { label: "GDP deflator", formula: "Deflator = Nominal GDP / Real GDP × 100" },
    { label: "Growth rate", formula: "Growth % = (this year − last year) / last year × 100" },
  ],
  loops: [],
  keyTerms: [
    { term: "GDP", def: "Market value of all final goods and services produced within a country in a period." },
    { term: "Final good", def: "A good bought by its end user, not used up to make another good." },
    { term: "Investment (I)", def: "Spending on new capital goods, new housing and inventories." },
    { term: "Net exports", def: "Exports minus imports (X − M)." },
    { term: "Real GDP", def: "GDP measured at constant (base-year) prices." },
    { term: "GDP deflator", def: "Nominal GDP divided by real GDP, × 100: a price index for all output." },
  ],
  experiments: [
    {
      title: "Build GDP",
      preset: "Typical economy",
      steps: ["Load the preset and check the bar chart adds up to GDP.", "Raise imports by 100. What happens to GDP? To net exports?"],
      observe: "Imports are subtracted because they were already counted inside C, I and G — higher imports alone (with C unchanged) lower GDP.",
    },
    {
      title: "Inflation fools nominal GDP",
      preset: "High inflation, no growth",
      steps: ["Load the preset.", "Compare nominal and real GDP after 10 years."],
      observe: "Nominal GDP more than doubles while real GDP is flat — people are not better off, prices just rose.",
    },
    {
      title: "Real growth compounds",
      preset: "Export boom",
      steps: ["Compare real GDP after 10 years at 2 % and 4 % growth."],
      observe: "Doubling the growth rate more than doubles the gain after a decade, because growth compounds.",
    },
  ],
  quiz: [
    {
      q: "Which of these is counted in this year's GDP?",
      options: ["A used car bought from a neighbour", "Shares of a company bought on the stock market", "A new house built this year", "A pension cheque paid by the government"],
      answer: 2,
      explain: "New residential construction is investment. Used goods, financial assets and transfers are not new production.",
    },
    {
      q: "C = 600, I = 200, G = 250, X = 150, M = 170. GDP is…",
      options: ["1,370", "1,030", "1,200", "1,050"],
      answer: 1,
      explain: "600 + 200 + 250 + (150 − 170) = 1,030.",
    },
    {
      q: "Nominal GDP rose 6 % and the deflator rose 4 %. Real GDP grew about…",
      options: ["10 %", "6 %", "2 %", "−2 %"],
      answer: 2,
      explain: "Real growth ≈ nominal growth − inflation = 6 − 4 = 2 %.",
    },
    {
      q: "Why are imports subtracted in the expenditure approach?",
      options: ["Imports hurt the economy", "C, I and G already include spending on imported goods, which were not produced here", "To avoid counting exports twice", "Because of tariffs"],
      answer: 1,
      explain: "Subtracting imports removes foreign production so that GDP counts only domestic output.",
    },
    {
      q: "Which is NOT a limitation of GDP as a welfare measure?",
      options: ["It ignores unpaid household work", "It ignores pollution", "It ignores how income is distributed", "It counts final goods only"],
      answer: 3,
      explain: "Counting only final goods is a deliberate feature that avoids double counting.",
    },
  ],
  readings: [
    { cite: "OpenStax (2022). Principles of Macroeconomics, 3rd ed., Ch. 6: The Macroeconomic Perspective. Free at openstax.org." },
    { cite: "Mankiw, N. G. Principles of Macroeconomics, Ch. 'Measuring a Nation's Income'. Cengage." },
    { cite: "CORE Econ. The Economy, Unit 13: Economic fluctuations and unemployment. Free at core-econ.org." },
    { cite: "Statistics Canada — Gross domestic product, expenditure-based (table 36-10-0104-01); U.S. BEA — National Income and Product Accounts." },
  ],
  discussion: [
    "A country's GDP rises after a hurricane because of rebuilding. Is the country better off? What does this tell you about GDP?",
    "Should unpaid care work be included in GDP? How could it be measured?",
  ],
  charts: [
    {
      id: "m01-bars",
      title: "GDP = C + I + G + (X − M)",
      data: "bars",
      x: "idx",
      xTickLabels: ["C", "I", "G", "X", "−M", "GDP"],
      series: [{ key: "value", name: "$ billions", color: "#38bdf8", type: "bar" }],
    },
    {
      id: "m01-nr",
      title: "Nominal vs real GDP",
      x: "year",
      xLabel: "Year",
      series: [
        { key: "nominal", name: "Nominal GDP", color: C.output },
        { key: "real", name: "Real GDP (base-year prices)", color: "#38bdf8", type: "area" },
      ],
    },
    {
      id: "m01-defl",
      title: "GDP deflator and growth rates",
      x: "year",
      xLabel: "Year",
      wide: true,
      series: [
        { key: "deflator", name: "GDP deflator (left)", color: C.pollution },
        { key: "nominalGrowth", name: "Nominal growth % (right)", color: C.output, axis: "right", dashed: true },
        { key: "realGrowth", name: "Real growth % (right)", color: "#38bdf8", axis: "right" },
      ],
    },
  ],
  kpis: (r) => {
    const e = r.extra as Record<string, number>;
    const end = last(r.series);
    const p0 = r.series[0];
    return [
      { label: "GDP (year 0)", value: `$${fmt(e.gdp, 0)}B`, tone: "neutral" },
      { label: "Net exports", value: `${e.netExports >= 0 ? "+" : ""}${fmt(e.netExports, 0)}`, tone: e.netExports >= 0 ? "good" : "warn", hint: e.netExports >= 0 ? "trade surplus" : "trade deficit" },
      { label: "Real GDP growth (10 yrs)", value: `${fmt((end.real / p0.real - 1) * 100, 1)}%`, tone: end.real >= p0.real ? "good" : "bad" },
      { label: "Deflator in year 10", value: fmt(end.deflator, 1), tone: "neutral", hint: "base year = 100" },
    ];
  },
  labFile: "module_01_gdp.py",
};

export default m01;
