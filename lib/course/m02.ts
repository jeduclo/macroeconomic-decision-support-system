import { Users } from "lucide-react";
import type { CourseModule } from "./types";
import { C, fmt, peak } from "./helpers";

const m02: CourseModule = {
  id: "m02",
  number: 2,
  title: "Unemployment",
  short: "Unemployment",
  tagline: "Millions of people find and lose jobs every month — the rate is what's left over.",
  accent: "#a78bfa",
  icon: Users,
  duration: "Week 2 · ~3 h",
  summary:
    "The unemployment rate is one of the most watched numbers in the economy. This module explains how it is measured, the three types of unemployment, why there is always some 'natural' unemployment, and how recessions push unemployment above that level. A simple model of workers flowing between jobs and job search shows where the natural rate comes from and how a recession raises unemployment and output losses (Okun's law).",
  objectives: [
    "Define the labour force, the unemployment rate and the participation rate.",
    "Distinguish frictional, structural and cyclical unemployment.",
    "Explain the natural rate as a balance between job losses and job finding.",
    "Use Okun's law to link unemployment to lost output.",
    "Recognise measurement issues: discouraged workers and underemployment.",
  ],
  sections: [
    {
      heading: "Measuring unemployment",
      body: [
        "Surveys of households — the Labour Force Survey (Statistics Canada) and the Current Population Survey (U.S. Bureau of Labor Statistics) — classify working-age people as employed, unemployed (no job, available, and looking for work) or not in the labour force (students, retirees, people not looking).",
      ],
      bullets: [
        "Labour force = employed + unemployed.",
        "Unemployment rate = unemployed ÷ labour force × 100.",
        "Participation rate = labour force ÷ working-age population × 100.",
        "Discouraged workers who stop looking are not counted as unemployed, so the rate can understate hardship.",
      ],
    },
    {
      heading: "Three types of unemployment",
      body: [],
      bullets: [
        "Frictional: time spent searching and matching — new graduates, people changing jobs. Some is healthy.",
        "Structural: a mismatch between workers' skills or locations and available jobs, e.g. after technological change or the decline of an industry.",
        "Cyclical: unemployment caused by recessions, when total spending falls.",
      ],
    },
    {
      heading: "The natural rate",
      body: [
        "Even in a healthy economy, some people lose jobs and others find them each month. When these flows balance, unemployment is steady at the natural rate — frictional plus structural unemployment. In our model, if a share s of workers lose their jobs each month and a share f of the unemployed find one, the natural rate is s ÷ (s + f). Policies that speed up matching (job boards, training, mobility) raise f and lower the natural rate.",
      ],
    },
    {
      heading: "Recessions and Okun's law",
      body: [
        "In a recession, firms hire less, so job finding falls and unemployment rises above the natural rate — cyclical unemployment. Arthur Okun found that each extra percentage point of cyclical unemployment goes with roughly 2 % of output lost relative to potential (Okun's law). Unemployment also lags the economy: it keeps rising for a while after a recession ends, because hiring recovers slowly.",
      ],
    },
  ],
  equations: [
    { label: "Unemployment rate", formula: "u = Unemployed / Labour force × 100" },
    { label: "Natural rate (flows balance)", formula: "u* = s / (s + f)" },
    { label: "Cyclical unemployment", formula: "u − u*" },
    { label: "Okun's law", formula: "Output gap ≈ −2 × (u − u*)" },
  ],
  loops: [
    { type: "B", name: "Flows balance", chain: "More unemployed → more hires → fewer unemployed" },
  ],
  keyTerms: [
    { term: "Labour force", def: "People who are employed or actively looking for work." },
    { term: "Participation rate", def: "Share of the working-age population in the labour force." },
    { term: "Frictional unemployment", def: "Short-term unemployment from searching and matching." },
    { term: "Structural unemployment", def: "Unemployment from a mismatch of skills, location or wages." },
    { term: "Natural rate", def: "Unemployment when the economy is at potential output (no cyclical unemployment)." },
    { term: "Okun's law", def: "Rule of thumb linking cyclical unemployment to the output gap." },
  ],
  experiments: [
    {
      title: "Where the natural rate comes from",
      preset: "Mild recession",
      steps: ["Set recession depth to 0.", "Change the job-finding rate from 0.25 to 0.4. What happens to the natural rate?"],
      observe: "Faster job finding lowers the natural rate — that is why matching and training policies matter.",
    },
    {
      title: "A deep recession",
      preset: "Great Recession style",
      steps: ["Load the preset.", "Note the peak unemployment and when it happens relative to the end of the recession (month 48)."],
      observe: "Unemployment peaks around the time the recession ends and takes months to come back down.",
    },
    {
      title: "Rigid labour markets",
      preset: "Rigid labour market",
      steps: ["Load the preset and compare the natural rate with the baseline."],
      observe: "Fewer separations but much slower hiring give a higher natural rate and longer spells of unemployment.",
    },
  ],
  quiz: [
    {
      q: "A country has 19 million employed and 1 million unemployed. The unemployment rate is…",
      options: ["5.0 %", "5.3 %", "1.0 %", "19 %"],
      answer: 0,
      explain: "1 ÷ (19 + 1) = 5 %.",
    },
    {
      q: "A software developer quits to search for a better job. This is…",
      options: ["Cyclical unemployment", "Structural unemployment", "Frictional unemployment", "Not unemployment"],
      answer: 2,
      explain: "Short-term job search is frictional.",
    },
    {
      q: "Discouraged workers stop looking for work. The measured unemployment rate…",
      options: ["Rises", "Falls", "Is unchanged", "Doubles"],
      answer: 1,
      explain: "They leave the labour force, so they are no longer counted as unemployed.",
    },
    {
      q: "If s = 2 % per month and f = 30 % per month, the natural rate is about…",
      options: ["2 %", "6.3 %", "15 %", "30 %"],
      answer: 1,
      explain: "0.02 ÷ (0.02 + 0.30) ≈ 6.25 %.",
    },
    {
      q: "Unemployment is 2 points above its natural rate. Okun's law suggests output is about…",
      options: ["2 % below potential", "4 % below potential", "4 % above potential", "unchanged"],
      answer: 1,
      explain: "Gap ≈ −2 × 2 = −4 %.",
    },
  ],
  readings: [
    { cite: "OpenStax (2022). Principles of Macroeconomics, 3rd ed., Ch. 8: Unemployment." },
    { cite: "Statistics Canada — Labour Force Survey (monthly); U.S. BLS — The Employment Situation (monthly)." },
    { cite: "Okun, A. (1962). Potential GNP: its measurement and significance. Proceedings of the Business and Economic Statistics Section, ASA." },
    { cite: "CORE Econ. The Economy, Unit 9: The labour market." },
  ],
  discussion: [
    "Why might the unemployment rate fall during a long recession even though few people are finding jobs?",
    "Is zero unemployment a sensible goal? Why or why not?",
  ],
  charts: [
    {
      id: "m02-u",
      title: "Unemployment rate vs the natural rate (%)",
      x: "month",
      xLabel: "Month",
      wide: true,
      series: [
        { key: "unemploymentRate", name: "Unemployment rate", color: "#a78bfa", type: "area" },
        { key: "naturalRate", name: "Natural rate", color: C.white, dashed: true },
      ],
      refX: [
        { value: 24, label: "recession starts", color: C.pollution },
        { value: (p) => 24 + Number(p.length), label: "ends", color: C.nature },
      ],
    },
    {
      id: "m02-gap",
      title: "Okun's law: output gap (%)",
      x: "month",
      xLabel: "Month",
      series: [{ key: "outputGap", name: "Output gap", color: C.pollution, type: "area" }],
      refY: [{ value: 0, label: "", color: C.slate }],
    },
    {
      id: "m02-flows",
      title: "Job-finding rate (% per month)",
      x: "month",
      xLabel: "Month",
      series: [{ key: "jobFinding", name: "Job-finding rate", color: C.nature }],
    },
  ],
  kpis: (r) => {
    const e = r.extra as Record<string, number>;
    const pk = peak(r.series, "unemploymentRate");
    const worstGap = Math.min(...r.series.map((x) => x.outputGap));
    return [
      { label: "Natural rate", value: `${fmt(e.naturalRate, 1)}%`, tone: e.naturalRate < 6 ? "good" : "warn" },
      { label: "Peak unemployment", value: `${fmt(pk.unemploymentRate, 1)}% @ m${pk.month}`, tone: pk.unemploymentRate - e.naturalRate > 2 ? "bad" : "warn" },
      { label: "Peak cyclical", value: `${fmt(pk.unemploymentRate - e.naturalRate, 1)} pts`, tone: "neutral" },
      { label: "Worst output gap", value: `${fmt(worstGap, 1)}%`, tone: worstGap < -3 ? "bad" : "warn", hint: "Okun's law" },
    ];
  },
  labFile: "module_02_unemployment.py",
};

export default m02;
