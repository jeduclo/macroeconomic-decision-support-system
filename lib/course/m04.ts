import { Sprout } from "lucide-react";
import type { CourseModule } from "./types";
import { C, fmt, firstWhere, last } from "./helpers";

const m04: CourseModule = {
  id: "m04",
  number: 4,
  title: "Economic Growth",
  short: "Economic Growth",
  tagline: "Small differences in growth rates become huge differences in living standards.",
  accent: "#34d399",
  icon: Sprout,
  duration: "Week 4 · ~3 h",
  summary:
    "Why are some countries rich and others poor, and why do living standards rise over time? This module introduces the sources of long-run growth — capital, labour, human capital, and above all technology — and the Solow growth model. You will see why saving more raises a country's income level but not its long-run growth rate, why poor countries can catch up, and how the rule of 70 turns growth rates into doubling times.",
  objectives: [
    "Explain how real GDP per person measures average living standards over time.",
    "Use the rule of 70 to compute doubling times.",
    "Identify the sources of growth: physical capital, human capital, natural resources and technology.",
    "Use the Solow model to explain diminishing returns and the steady state.",
    "Explain convergence (catch-up) and why technology drives sustained growth.",
  ],
  sections: [
    {
      heading: "Growth compounds",
      body: [
        "A country growing 1 % a year doubles its income per person in about 70 years; at 3 % it doubles in about 23 years (rule of 70: doubling time ≈ 70 ÷ growth %). Over a few generations, these differences explain much of the gap between rich and poor countries.",
      ],
    },
    {
      heading: "Where growth comes from",
      body: ["Output per worker rises when workers have more and better tools and knowledge:"],
      bullets: [
        "Physical capital: machines, equipment and infrastructure.",
        "Human capital: education, skills and health.",
        "Technology and ideas: better ways to combine inputs — the key to sustained growth.",
        "Institutions: property rights, rule of law, open markets and stable policy make investment and innovation worthwhile.",
      ],
    },
    {
      heading: "The Solow model in pictures",
      body: [
        "Saving pays for new capital (investment). But each extra machine adds less output than the one before — diminishing returns. At the same time, capital wears out (depreciation) and must be spread over a growing workforce. When investment just covers depreciation and the new workers, capital per worker stops growing: the steady state. In the Solow diagram this is where the investment curve meets the break-even line.",
        "Saving more moves the steady state up — a country becomes richer — but once it gets there, growth per person is again set by technology. Only continuing technological progress keeps living standards rising.",
      ],
    },
    {
      heading: "Catch-up",
      body: [
        "Because of diminishing returns, a country with little capital gains a lot from each new machine, so it can grow faster than rich countries — conditional convergence. Post-war Japan, South Korea and more recently China grew very fast as they accumulated capital and adopted existing technology. Convergence is not automatic: it requires the saving, education and institutions that support investment.",
      ],
    },
  ],
  equations: [
    { label: "Rule of 70", formula: "doubling time ≈ 70 / growth rate (%)" },
    { label: "Capital accumulation", formula: "change in capital = investment (s × output) − break-even investment" },
    { label: "Steady state", formula: "investment = (n + g + δ) × capital per worker" },
    { label: "Long-run growth", formula: "income per worker grows at the rate of technology g" },
  ],
  loops: [
    { type: "R", name: "Accumulation", chain: "Capital → Output → Saving & investment → Capital" },
    { type: "B", name: "Diminishing returns & depreciation", chain: "More capital → more wear-out and smaller gains per machine → slower accumulation" },
  ],
  keyTerms: [
    { term: "Productivity", def: "Output per worker (or per hour worked)." },
    { term: "Diminishing returns", def: "Each extra unit of capital adds less output than the previous one." },
    { term: "Steady state", def: "The point where capital per worker no longer changes." },
    { term: "Human capital", def: "Knowledge and skills workers gain through education and experience." },
    { term: "Convergence", def: "Poorer countries growing faster than richer ones and catching up." },
    { term: "Rule of 70", def: "A quick way to find doubling time: 70 ÷ growth rate." },
  ],
  experiments: [
    {
      title: "Catch-up growth",
      preset: "Baseline",
      steps: ["Load the preset.", "Compare the poor country's growth in early years with the rich country's 1.5 %."],
      observe: "The poor country grows several times faster at first, then slows as diminishing returns set in.",
    },
    {
      title: "Saving more",
      preset: "Saving more",
      steps: ["Load the preset (40 % saving).", "Check the Solow diagram and the long-run growth rate."],
      observe: "The steady state moves right (higher income per worker), but long-run growth is still 1.5 % — set by technology.",
    },
    {
      title: "Ideas drive growth",
      preset: "Faster technology",
      steps: ["Load the preset (3 % technology growth).", "Compare income after 100 years with the baseline."],
      observe: "Doubling technology growth makes the country more than four times richer after a century.",
    },
  ],
  quiz: [
    {
      q: "Real GDP per person grows 2 % a year. It doubles in about…",
      options: ["14 years", "35 years", "50 years", "70 years"],
      answer: 1,
      explain: "70 ÷ 2 = 35 years.",
    },
    {
      q: "In the Solow model, a permanent rise in the saving rate…",
      options: ["Raises the long-run growth rate forever", "Raises the level of income per worker but not long-run growth", "Has no effect", "Lowers income"],
      answer: 1,
      explain: "Diminishing returns mean growth returns to the rate of technology at the new, higher steady state.",
    },
    {
      q: "Why can poor countries grow faster than rich ones?",
      options: ["They have more natural resources", "Capital is scarce, so each new machine adds a lot of output", "They have lower taxes", "They print more money"],
      answer: 1,
      explain: "Diminishing returns mean the gain from extra capital is largest where capital is scarce.",
    },
    {
      q: "What keeps living standards rising in the long run?",
      options: ["Ever more saving", "Population growth", "Technological progress", "Higher prices"],
      answer: 2,
      explain: "Without new ideas, capital accumulation eventually stops raising output per worker.",
    },
    {
      q: "Faster population growth (all else equal) …",
      options: ["Raises capital per worker", "Lowers steady-state capital and income per worker", "Raises long-run growth per worker", "Has no effect"],
      answer: 1,
      explain: "More investment is needed just to equip new workers.",
    },
  ],
  readings: [
    { cite: "OpenStax (2022). Principles of Macroeconomics, 3rd ed., Ch. 7: Economic Growth." },
    { cite: "Solow, R. (1956). A contribution to the theory of economic growth. Quarterly Journal of Economics, 70(1), 65-94." },
    { cite: "Acemoglu, D. & Robinson, J. (2012). Why Nations Fail. Crown." },
    { cite: "Our World in Data — 'Economic Growth' (ourworldindata.org/economic-growth)." },
  ],
  discussion: [
    "Is economic growth always good? What could GDP growth miss (connect to Module 1)?",
    "Which policy would you choose to raise long-run growth: higher saving, more education, or more research funding? Why?",
  ],
  charts: [
    {
      id: "m04-income",
      title: "Income per worker: rich vs poor country (rich in year 0 = 100)",
      x: "year",
      xLabel: "Year",
      wide: true,
      series: [
        { key: "rich", name: "Rich country", color: C.capital },
        { key: "poor", name: "Poor country", color: "#34d399", type: "area" },
      ],
    },
    {
      id: "m04-solow",
      title: "The Solow diagram",
      subtitle: "Steady state where investment = break-even investment",
      data: "curve",
      x: "k",
      xLabel: "Capital per (effective) worker",
      series: [
        { key: "output", name: "Output per worker", color: C.output, dashed: true },
        { key: "investment", name: "Investment s·f(k)", color: "#34d399" },
        { key: "breakEven", name: "Break-even (n + g + δ)·k", color: C.pollution },
      ],
      dots: (e) => [{ x: e.kStar, y: e.iStar, label: "steady state k*", color: "#34d399" }],
    },
    {
      id: "m04-growth",
      title: "Growth rate of income per worker (%)",
      x: "year",
      xLabel: "Year",
      series: [
        { key: "growthPoor", name: "Poor country", color: "#34d399" },
        { key: "growthRich", name: "Rich country", color: C.capital, dashed: true },
      ],
      transform: (rows) => rows.slice(1),
    },
  ],
  kpis: (r) => {
    const s = r.series;
    const catch75 = firstWhere(s, (x) => x.ratio >= 75);
    const e = r.extra as Record<string, number>;
    return [
      { label: "Long-run growth", value: `${fmt(last(s).growthRich, 1)}%/yr`, tone: "neutral", hint: "= technology growth" },
      { label: "Doubling time", value: e.doubling > 0 ? `${fmt(e.doubling, 0)} yrs` : "never", tone: "neutral", hint: "rule of 70" },
      { label: "Poor country growth (year 1)", value: `${fmt(s[1].growthPoor, 1)}%`, tone: "good" },
      { label: "Reaches 75 % of rich", value: catch75 ? `year ${catch75.year}` : "not in 100 yrs", tone: catch75 ? "good" : "warn" },
    ];
  },
  labFile: "module_04_growth.py",
};

export default m04;
