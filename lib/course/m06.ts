import { Scale } from "lucide-react";
import type { CourseModule } from "./types";
import { C, fmt } from "./helpers";

const m06: CourseModule = {
  id: "m06",
  number: 6,
  title: "Aggregate Demand and Aggregate Supply",
  short: "AD / AS",
  tagline: "Output and the price level — in the short run and the long run.",
  accent: "#f472b6",
  icon: Scale,
  duration: "Week 6 · ~4 h",
  summary:
    "The AD/AS model adds prices to the story. Aggregate demand (AD) shows how much output is demanded at each price level; short-run aggregate supply (SRAS) shows how much firms produce when wages and some prices are sticky; long-run aggregate supply (LRAS) is vertical at potential output. With this model you can explain recessions, booms and stagflation — and why, in the long run, the economy tends to return to potential output.",
  objectives: [
    "Explain why AD slopes down and what shifts it.",
    "Explain why SRAS slopes up, why LRAS is vertical, and what shifts each.",
    "Analyse demand shocks and supply shocks in the short run.",
    "Describe the self-correction mechanism through wage and price adjustment.",
    "Explain stagflation and the policy dilemma it creates.",
  ],
  sections: [
    {
      heading: "Aggregate demand",
      body: [
        "AD is the total quantity of goods and services demanded (C + I + G + NX) at each price level. It slopes down because a higher price level reduces the real value of money and wealth, raises interest rates (people need more money for transactions) and makes domestic goods less competitive abroad.",
        "AD shifts when spending changes at every price level: consumer or business confidence, government spending and taxes, monetary policy, foreign demand or the exchange rate.",
      ],
    },
    {
      heading: "Aggregate supply: short run and long run",
      body: [
        "In the short run, many wages and prices are fixed by contracts or change slowly, so when demand rises firms produce more and raise prices only somewhat: SRAS slopes up. In the long run, wages and prices fully adjust, and output is determined by labour, capital and technology — potential output. LRAS is vertical at potential output.",
      ],
      bullets: [
        "SRAS shifts with production costs (oil, wages), expected prices and supply disruptions.",
        "LRAS shifts with the economy's capacity: technology, capital, labour force, institutions (Module 4).",
      ],
    },
    {
      heading: "Shocks",
      body: [
        "A fall in AD (e.g. a collapse in confidence) moves the economy down along SRAS: output falls, unemployment rises and inflation slows — a recession. An adverse supply shock (e.g. an oil price spike) shifts SRAS up: output falls and prices rise at the same time — stagflation, as in the 1970s. That creates a dilemma: stimulating demand would worsen inflation; restraining it would deepen the recession.",
      ],
    },
    {
      heading: "Self-correction",
      body: [
        "In a recession, unemployment puts downward pressure on wages and expected prices, which shifts SRAS down and gradually brings output back to potential at a lower price level. In a boom, the reverse happens. The process can be slow — that is the case for using fiscal and monetary policy to speed it up (Modules 8-9).",
      ],
    },
  ],
  equations: [
    { label: "Aggregate demand", formula: "AD = C + I + G + NX, lower at higher price levels" },
    { label: "Short run", formula: "Equilibrium where AD crosses SRAS" },
    { label: "Long run", formula: "Output returns to potential (LRAS); only the price level changes" },
    { label: "Output gap", formula: "gap % = (actual output − potential) / potential × 100" },
  ],
  loops: [
    { type: "B", name: "Self-correction", chain: "Output below potential → wages and expected prices fall → SRAS shifts down → output rises" },
  ],
  keyTerms: [
    { term: "Aggregate demand (AD)", def: "Total spending on domestic output at each price level." },
    { term: "SRAS", def: "Short-run aggregate supply: output firms produce when some wages and prices are sticky." },
    { term: "LRAS", def: "Long-run aggregate supply: vertical at potential output." },
    { term: "Demand shock", def: "An event that shifts AD." },
    { term: "Supply shock", def: "An event that shifts SRAS (or LRAS)." },
    { term: "Stagflation", def: "Falling output combined with rising inflation." },
  ],
  experiments: [
    {
      title: "A recession and recovery",
      preset: "Demand fall (recession)",
      steps: ["Load the preset.", "Compare the short-run (SR) and long-run (LR) points.", "Make wage adjustment slower (0.1). What changes?"],
      observe: "Output first falls below potential; as wages and prices adjust, SRAS shifts down and output returns to potential at a lower price level. Slower adjustment means a longer recession.",
    },
    {
      title: "Stagflation",
      preset: "Oil price shock",
      steps: ["Load the preset.", "What happens to output and prices in the short run?", "Switch the shock to 'permanent'."],
      observe: "Prices rise while output falls. A temporary shock fades; a permanent one lowers potential output (LRAS shifts left).",
    },
    {
      title: "Good supply shock",
      preset: "Productivity boom",
      steps: ["Load the preset.", "Compare output and the price level with the starting point."],
      observe: "Higher productivity raises output and lowers prices — the best kind of growth.",
    },
  ],
  quiz: [
    {
      q: "Consumer confidence collapses. In the short run…",
      options: ["AD shifts right; output and prices rise", "AD shifts left; output and prices fall", "SRAS shifts left", "LRAS shifts left"],
      answer: 1,
      explain: "Lower spending at every price level shifts AD left along an upward-sloping SRAS.",
    },
    {
      q: "Stagflation is most likely caused by…",
      options: ["A rise in government spending", "An adverse supply shock such as an oil price spike", "A rise in the money supply", "A productivity boom"],
      answer: 1,
      explain: "Higher costs shift SRAS up: output falls and prices rise.",
    },
    {
      q: "Why is LRAS vertical?",
      options: ["Prices never change in the long run", "In the long run output depends on resources and technology, not the price level", "Demand is fixed", "Because of taxes"],
      answer: 1,
      explain: "Once wages and prices fully adjust, the price level does not affect real capacity.",
    },
    {
      q: "Without policy, how does an economy leave a recessionary gap?",
      options: ["AD shifts right automatically", "Falling wages and expected prices shift SRAS down", "LRAS shifts left", "It cannot"],
      answer: 1,
      explain: "This self-correction can be slow.",
    },
    {
      q: "A productivity improvement shifts…",
      options: ["Only AD", "SRAS and LRAS to the right", "SRAS to the left", "Nothing"],
      answer: 1,
      explain: "Greater capacity shifts both supply curves right: more output, lower prices.",
    },
  ],
  readings: [
    { cite: "OpenStax (2022). Principles of Macroeconomics, 3rd ed., Ch. 10: The Aggregate Demand/Aggregate Supply Model." },
    { cite: "Mankiw, N. G. Principles of Macroeconomics, Ch. 'Aggregate Demand and Aggregate Supply'. Cengage." },
    { cite: "Blinder, A. (1979). Economic Policy and the Great Stagflation. Academic Press." },
  ],
  discussion: [
    "The COVID-19 pandemic reduced both demand and supply. Which way would you draw each shift, and what does the model predict for prices?",
    "If self-correction works, why do governments still act during recessions?",
  ],
  charts: [
    {
      id: "m06-adas",
      title: "AD / AS diagram",
      subtitle: "Dashed blue/pink = starting curves; solid = after the shock; dashed yellow = SRAS once wages and expectations adjust",
      data: "curves",
      x: "Y",
      xLabel: "Real GDP (Y)",
      yLabel: "Price level",
      wide: true,
      yDomain: [60, 150],
      series: [
        { key: "ad0", name: "AD before", color: C.capital, dashed: true },
        { key: "ad1", name: "AD after", color: C.capital },
        { key: "sras0", name: "SRAS before", color: "#f472b6", dashed: true },
        { key: "sras1", name: "SRAS after shock", color: "#f472b6" },
        { key: "srasLR", name: "SRAS after adjustment", color: C.output, dashed: true },
      ],
      refX: [
        { value: (_p, e) => Number(e.ypOld), label: "LRAS₀", color: C.slate },
        { value: (_p, e) => Number(e.yp), label: "LRAS₁", color: C.nature },
      ],
      dots: (e) => [
        { x: 1000, y: 100, label: "start", color: C.slate, guides: false },
        { x: e.srY, y: e.srP, label: "short run", color: "#f472b6" },
        { x: e.lrY, y: e.lrP, label: "long run", color: C.output },
      ],
    },
    {
      id: "m06-path",
      title: "Adjustment over time",
      x: "period",
      xLabel: "Period",
      series: [
        { key: "gap", name: "Output gap % (left)", color: "#f472b6", type: "area" },
        { key: "price", name: "Price level (right)", color: C.output, axis: "right" },
      ],
      refY: [{ value: 0, label: "", color: C.slate }],
    },
  ],
  kpis: (r) => {
    const e = r.extra as Record<string, number>;
    const gap0 = (100 * (e.srY - e.yp)) / e.yp;
    return [
      { label: "Short-run output change", value: `${e.srY - 1000 >= 0 ? "+" : ""}${fmt(e.srY - 1000, 0)}`, tone: e.srY >= 1000 ? "good" : "bad" },
      { label: "Short-run price change", value: `${e.srP - 100 >= 0 ? "+" : ""}${fmt(e.srP - 100, 1)}%`, tone: Math.abs(e.srP - 100) < 2 ? "good" : "warn" },
      { label: "Initial output gap", value: `${fmt(gap0, 1)}%`, tone: Math.abs(gap0) < 1 ? "good" : gap0 < 0 ? "bad" : "warn" },
      { label: "Long-run price level", value: fmt(e.lrP, 1), tone: "neutral", hint: `output → ${fmt(e.lrY, 0)}` },
    ];
  },
  labFile: "module_06_ad_as.py",
};

export default m06;
