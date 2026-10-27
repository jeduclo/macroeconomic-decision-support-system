import { Crosshair } from "lucide-react";
import type { CourseModule } from "./types";
import { C, fmt } from "./helpers";

const m07: CourseModule = {
  id: "m07",
  number: 7,
  title: "The IS-LM Model",
  short: "IS-LM",
  tagline: "Where the goods market and the money market agree.",
  accent: "#a78bfa",
  icon: Crosshair,
  duration: "Week 7 · ~4 h",
  summary:
    "The AE model held the interest rate fixed. IS-LM lets it move. The IS curve shows combinations of output and the interest rate where the goods market is in equilibrium; the LM curve shows combinations where the money market is in equilibrium. Where they cross, both markets clear. The model explains why fiscal stimulus can 'crowd out' private investment and how monetary policy moves output through the interest rate.",
  objectives: [
    "Explain why the IS curve slopes down and the LM curve slopes up.",
    "Identify what shifts each curve.",
    "Find the IS-LM equilibrium and analyse fiscal and monetary policy.",
    "Explain crowding out and what makes it larger or smaller.",
    "Describe the policy mix and the liquidity-trap case.",
  ],
  sections: [
    {
      heading: "The IS curve: goods market",
      body: [
        "Investment falls when interest rates rise, because borrowing to buy machines or houses becomes more expensive. Lower investment lowers aggregate expenditure and, through the multiplier, output. So a higher interest rate means lower equilibrium output: the IS curve slopes down. Higher government spending, lower taxes or more confidence shift IS to the right.",
      ],
    },
    {
      heading: "The LM curve: money market",
      body: [
        "People hold money to make transactions, so money demand rises with income. The central bank (in this simple model) fixes the money supply. If income rises, people want more money, and the interest rate must rise to make them content holding the same amount — so LM slopes up. More money supply shifts LM to the right (down).",
      ],
    },
    {
      heading: "Policy in IS-LM",
      body: [],
      bullets: [
        "Fiscal expansion shifts IS right: output and the interest rate both rise. The higher rate reduces investment — crowding out — so output rises by less than the simple multiplier.",
        "Monetary expansion shifts LM right: the interest rate falls, investment rises and output rises.",
        "A policy mix (both together) can raise output while keeping the interest rate steady, avoiding crowding out.",
      ],
    },
    {
      heading: "When does crowding out matter?",
      body: [
        "Crowding out is large when investment is very sensitive to interest rates or when money demand is insensitive to them (a steep LM curve). It is small when LM is flat — for example in a liquidity trap, when rates are near zero and people are happy to hold extra money. That is why fiscal policy was seen as especially powerful in 2008-2009 and in 2020.",
      ],
    },
  ],
  equations: [
    { label: "IS (goods market)", formula: "Y = C(Y − T) + I(r) + G   →   higher r, lower Y" },
    { label: "LM (money market)", formula: "M / P = L(Y, r)   →   higher Y, higher r" },
    { label: "Equilibrium", formula: "the (Y, r) where IS and LM cross" },
    { label: "Crowding out", formula: "simple multiplier effect − actual change in Y" },
  ],
  loops: [
    { type: "B", name: "Crowding out", chain: "G ↑ → Y ↑ → money demand ↑ → r ↑ → investment ↓ → Y rises less" },
  ],
  keyTerms: [
    { term: "IS curve", def: "Combinations of output and the interest rate where planned spending equals output." },
    { term: "LM curve", def: "Combinations of output and the interest rate where money demand equals money supply." },
    { term: "Crowding out", def: "Reduction in private investment caused by higher interest rates after fiscal expansion." },
    { term: "Liquidity trap", def: "Situation with interest rates near zero where monetary policy loses power." },
    { term: "Policy mix", def: "The combination of fiscal and monetary policy." },
  ],
  experiments: [
    {
      title: "Fiscal expansion and crowding out",
      preset: "Fiscal expansion",
      steps: ["Load the preset (G + 100).", "Compare the actual output increase with the simple multiplier effect (400)."],
      observe: "Output rises by about half the Keynesian-cross amount, because the higher interest rate crowds out investment.",
    },
    {
      title: "Monetary expansion",
      preset: "Monetary expansion",
      steps: ["Load the preset.", "Which way does LM shift? What happens to the interest rate?"],
      observe: "LM shifts right: the interest rate falls and output rises as investment increases.",
    },
    {
      title: "Policy mix",
      preset: "Policy mix (both)",
      steps: ["Load the preset.", "Look at the interest rate before and after."],
      observe: "Combining both policies raises output a lot while keeping the interest rate almost unchanged — no crowding out.",
    },
  ],
  quiz: [
    {
      q: "Why does the IS curve slope down?",
      options: ["Higher income raises money demand", "Higher interest rates reduce investment and therefore output", "Higher prices reduce wealth", "Taxes rise with income"],
      answer: 1,
      explain: "Lower investment reduces spending, and the multiplier lowers output.",
    },
    {
      q: "The central bank increases the money supply. In IS-LM…",
      options: ["IS shifts right", "LM shifts right; r falls and Y rises", "LM shifts left", "Nothing changes"],
      answer: 1,
      explain: "More money at each income level lowers the interest rate.",
    },
    {
      q: "Crowding out means that a fiscal expansion…",
      options: ["Raises investment", "Raises the interest rate and reduces private investment", "Lowers prices", "Has no effect on output"],
      answer: 1,
      explain: "The higher rate offsets part of the stimulus.",
    },
    {
      q: "Crowding out is smallest when…",
      options: ["LM is very steep", "LM is flat, as in a liquidity trap", "Investment is very rate-sensitive", "The MPC is low"],
      answer: 1,
      explain: "If rates barely rise, investment barely falls.",
    },
    {
      q: "How can policymakers raise output without raising the interest rate?",
      options: ["Raise taxes", "Combine fiscal expansion with monetary expansion", "Cut the money supply", "Cut government spending"],
      answer: 1,
      explain: "IS and LM both shift right, so r can stay unchanged.",
    },
  ],
  readings: [
    { cite: "Hicks, J. R. (1937). Mr. Keynes and the 'Classics': a suggested interpretation. Econometrica, 5(2), 147-159." },
    { cite: "Mankiw, N. G. Macroeconomics, Ch. 'Aggregate Demand I & II: the IS-LM model'. Worth." },
    { cite: "Krugman, P. (2011). IS-LMentary. The New York Times blog, 9 October 2011." },
  ],
  discussion: [
    "Today most central banks set an interest rate rather than the money supply. How would you redraw LM if the central bank fixes r?",
    "Why did economists argue that fiscal policy was especially effective when interest rates were near zero in 2009 and 2020?",
  ],
  charts: [
    {
      id: "m07-islm",
      title: "IS-LM diagram",
      subtitle: "Dashed = before policy; solid = after",
      x: "Y",
      xLabel: "Real output (Y)",
      yLabel: "Interest rate (%)",
      wide: true,
      series: [
        { key: "is0", name: "IS before", color: "#a78bfa", dashed: true },
        { key: "is1", name: "IS after", color: "#a78bfa" },
        { key: "lm0", name: "LM before", color: C.cyan, dashed: true },
        { key: "lm1", name: "LM after", color: C.cyan },
      ],
      yDomain: [-2, 14],
      dots: (e) => [
        { x: e.y0, y: e.r0, label: "E₀", color: C.slate },
        { x: e.y1, y: e.r1, label: "E₁", color: "#a78bfa" },
      ],
    },
  ],
  kpis: (r) => {
    const e = r.extra as Record<string, number>;
    const dY = e.y1 - e.y0;
    return [
      { label: "Output", value: `${fmt(e.y0, 0)} → ${fmt(e.y1, 0)}`, tone: dY >= 0 ? "good" : "bad", hint: `${dY >= 0 ? "+" : ""}${fmt(dY, 0)}` },
      { label: "Interest rate", value: `${fmt(e.r0, 1)}% → ${fmt(e.r1, 1)}%`, tone: "neutral" },
      { label: "Simple multiplier effect", value: fmt(e.crossEffect, 0), tone: "neutral", hint: "if r did not change" },
      { label: "Crowding out", value: `${fmt(e.crowdingOut, 0)}%`, tone: e.crowdingOut > 40 ? "bad" : e.crowdingOut > 10 ? "warn" : "good", hint: "of the fiscal effect" },
    ];
  },
  labFile: "module_07_is_lm.py",
};

export default m07;
