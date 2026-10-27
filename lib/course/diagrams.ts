/**
 * Concept maps (textbook flow diagrams) for the Learn tab.
 *  - curve: bow of a link; positive bows to the right of the direction of travel,
 *    negative to the left (clockwise loops use negative curves so links bow outward).
 *  - kind "policy" marks a lever students control with a slider in the simulator.
 */
export type DNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind?: "var" | "policy" | "stock" | "cloud" | "valve" | "box";
  /** optional colour for box outlines / labels (e.g. DAG roles) */
  color?: string;
};
export type DEdge = {
  from: string;
  to: string;
  sign?: "+" | "-";
  curve?: number;
  delay?: boolean;
  kind?: "causal" | "flow" | "info";
  label?: string;
  dashed?: boolean;
  /** which side of the link the +/− sits on (1 = right of travel, −1 = left); default follows the bow */
  signSide?: 1 | -1;
  /** position of the sign along the link, 0-1 (default 0.82) */
  signAt?: number;
};
export type DLoop = {
  x: number;
  y: number;
  type: "R" | "B";
  label?: string;
  dir?: "cw" | "ccw";
  labelPos?: "below" | "above" | "left" | "right";
  /** explicit label position (left-aligned), overrides labelPos */
  labelAt?: [number, number];
};
export type Diagram = {
  id: string;
  title: string;
  kind: "Concept map" | "Causal loop diagram" | "Stock-and-flow diagram" | "Causal DAG" | "Architecture";
  width: number;
  height: number;
  nodes: DNode[];
  edges: DEdge[];
  loops?: DLoop[];
  explanation: string[];
};


const B = "box" as const;
const LEVER = "#fbbf24";
const SHOCK = "#fb7185";
const GOAL = "#34d399";

export const DIAGRAMS: Record<string, Diagram[]> = {
  m01: [
    {
      id: "m01-flow",
      title: "The circular flow of income and spending",
      kind: "Concept map",
      width: 720,
      height: 365,
      nodes: [
        { id: "hh", label: "Households", x: 105, y: 180, kind: B, color: "#60a5fa" },
        { id: "fi", label: "Firms", x: 615, y: 180, kind: B, color: "#60a5fa" },
        { id: "gov", label: "Government", x: 360, y: 32, kind: B },
        { id: "fin", label: "Financial markets", x: 360, y: 180, kind: B },
        { id: "row", label: "Rest of the world", x: 360, y: 330, kind: B },
      ],
      edges: [
        { from: "hh", to: "gov", label: "taxes (T)" },
        { from: "gov", to: "fi", label: "purchases (G)" },
        { from: "hh", to: "fin", label: "saving" },
        { from: "fin", to: "fi", label: "investment (I)" },
        { from: "hh", to: "row", label: "imports (M)" },
        { from: "row", to: "fi", label: "exports (X)" },
        { from: "fi", to: "hh", label: "income: wages, rent, profit", curve: 0.2, dashed: true },
        { from: "hh", to: "fi", label: "consumption (C)", curve: 0.2 },
      ],
      explanation: [
        "Every dollar spent on final goods becomes someone's income, so total spending = total income = GDP.",
        "Saving, taxes and imports leak out of the household-firm loop; investment, government purchases and exports inject spending back in.",
        "Adding up the injections and consumption gives the expenditure identity: GDP = C + I + G + (X − M).",
        "The dashed arrow is the income side: the same GDP measured as wages, rent, interest and profit.",
      ],
    },
  ],
  m02: [
    {
      id: "m02-flows",
      title: "Flows in and out of unemployment",
      kind: "Concept map",
      width: 720,
      height: 330,
      nodes: [
        { id: "emp", label: "Employed", x: 140, y: 140, kind: B, color: GOAL },
        { id: "un", label: "Unemployed\n(looking for work)", x: 580, y: 140, kind: B, color: SHOCK },
        { id: "nilf", label: "Not in the labour force\n(students, retirees, discouraged)", x: 360, y: 285, kind: B },
        { id: "rec", label: "Recession", x: 360, y: 32, kind: B, color: SHOCK },
      ],
      edges: [
        { from: "emp", to: "un", label: "separations (s)", curve: -0.16 },
        { from: "un", to: "emp", label: "job finding (f)", curve: -0.16 },
        { from: "un", to: "nilf", label: "give up looking", curve: 0.12 },
        { from: "nilf", to: "un", label: "start looking", curve: 0.12 },
        { from: "nilf", to: "emp", label: "hired directly", curve: -0.1 },
        { from: "rec", to: "emp", label: "more layoffs", dashed: true },
        { from: "rec", to: "un", label: "fewer hires", dashed: true },
      ],
      explanation: [
        "The unemployment rate counts only people in the labour force who are looking for work: U ÷ (E + U).",
        "When inflows (separations) equal outflows (job finding), unemployment is steady at the natural rate s ÷ (s + f).",
        "A recession raises separations and lowers job finding, so cyclical unemployment builds up for months after the shock.",
        "Discouraged workers who stop looking leave the labour force, which can make the unemployment rate understate weakness.",
      ],
    },
  ],
  m03: [
    {
      id: "m03-causes",
      title: "Where inflation comes from — and who it affects",
      kind: "Concept map",
      width: 720,
      height: 340,
      nodes: [
        { id: "money", label: "Money growth faster\nthan real output", x: 125, y: 50, kind: B },
        { id: "dp", label: "Demand-pull:\nspending > capacity", x: 125, y: 170, kind: B },
        { id: "cp", label: "Cost-push:\noil, wages, supply chains", x: 125, y: 290, kind: B, color: SHOCK },
        { id: "pi", label: "Inflation (π)", x: 380, y: 170, kind: B, color: SHOCK },
        { id: "exp", label: "Expected\ninflation", x: 380, y: 300, kind: B },
        { id: "real", label: "Real wage ≈ wage growth − π\nReal rate ≈ i − π", x: 600, y: 95, kind: B },
        { id: "dist", label: "Borrowers gain,\nsavers & fixed incomes lose", x: 600, y: 245, kind: B },
      ],
      edges: [
        { from: "money", to: "pi" },
        { from: "dp", to: "pi" },
        { from: "cp", to: "pi" },
        { from: "pi", to: "exp", curve: 0.35 },
        { from: "exp", to: "pi", label: "built into wages & prices", curve: 0.35, signSide: 1 },
        { from: "pi", to: "real" },
        { from: "pi", to: "dist", label: "if unexpected" },
      ],
      explanation: [
        "In the long run, sustained inflation ≈ money growth − real output growth (the quantity theory).",
        "In the short run, inflation can be pulled up by strong demand or pushed up by rising costs.",
        "Expectations close the loop: if people expect inflation they build it into wages and prices — which is why central banks care about credibility.",
        "What matters for households is real values: nominal wages and interest rates minus inflation.",
      ],
    },
  ],
  m04: [
    {
      id: "m04-solow",
      title: "Capital accumulation in the Solow model",
      kind: "Concept map",
      width: 720,
      height: 330,
      nodes: [
        { id: "s", label: "Saving rate (s)", x: 95, y: 60, kind: B, color: LEVER },
        { id: "inv", label: "Investment\n= s × output", x: 330, y: 60, kind: B },
        { id: "k", label: "Capital per worker (k)", x: 330, y: 190, kind: B, color: "#60a5fa" },
        { id: "y", label: "Output per worker (y)\n(diminishing returns)", x: 600, y: 125, kind: B, color: GOAL },
        { id: "dep", label: "Depreciation (δ) &\nnew workers (n)", x: 120, y: 285, kind: B, color: SHOCK },
        { id: "tech", label: "Technology, education,\ninstitutions", x: 600, y: 285, kind: B, color: LEVER },
      ],
      edges: [
        { from: "s", to: "inv" },
        { from: "inv", to: "k", label: "adds capital" },
        { from: "k", to: "y", curve: 0.12 },
        { from: "y", to: "inv", label: "income to save", curve: 0.12 },
        { from: "dep", to: "k", label: "wears down k", curve: -0.15 },
        { from: "tech", to: "y", label: "sustained growth" },
      ],
      explanation: [
        "Saving funds investment, which builds capital; capital raises output, and part of that output is saved again.",
        "Each extra unit of capital adds less output than the last, while depreciation and population growth erode capital per worker.",
        "When investment just offsets these losses, k stops growing: the steady state. Saving more raises the level of income, not long-run growth.",
        "Only continual improvements in technology and ideas keep output per worker rising.",
      ],
    },
  ],
  m05: [
    {
      id: "m05-mult",
      title: "How the multiplier works",
      kind: "Concept map",
      width: 720,
      height: 320,
      nodes: [
        { id: "shock", label: "Spending rises\n(e.g. investment +50)", x: 115, y: 70, kind: B, color: LEVER },
        { id: "inc", label: "Income ↑\n(someone's earnings)", x: 360, y: 70, kind: B, color: "#60a5fa" },
        { id: "c", label: "Consumption ↑\n= MPC × Δincome", x: 360, y: 250, kind: B },
        { id: "sav", label: "Saving leaks out\n= (1 − MPC) × Δincome", x: 615, y: 250, kind: B, color: SHOCK },
        { id: "tot", label: "Total ΔY =\nΔspending ÷ (1 − MPC)", x: 620, y: 70, kind: B, color: GOAL },
      ],
      edges: [
        { from: "shock", to: "inc", label: "round 1" },
        { from: "inc", to: "c", curve: 0.25, label: "spend part" },
        { from: "c", to: "inc", curve: 0.25, label: "next round" },
        { from: "inc", to: "sav", label: "save the rest" },
        { from: "inc", to: "tot", dashed: true },
      ],
      explanation: [
        "An extra dollar of spending becomes a dollar of income for someone, who spends MPC of it and saves the rest.",
        "Each round is smaller than the last, because part of income leaks into saving (and in reality taxes and imports).",
        "Adding all rounds gives the multiplier 1 ÷ (1 − MPC): with MPC = 0.75 a $50 boost raises output by $200.",
        "In the Keynesian cross, this shows up as an upward shift of AE and a move along the 45° line to the new equilibrium.",
      ],
    },
  ],
  m06: [
    {
      id: "m06-self",
      title: "Self-correction after a fall in demand",
      kind: "Concept map",
      width: 720,
      height: 300,
      nodes: [
        { id: "ad", label: "AD falls\n(confidence ↓)", x: 125, y: 60, kind: B, color: SHOCK },
        { id: "gap", label: "Output below\npotential", x: 360, y: 60, kind: B },
        { id: "u", label: "Unemployment ↑", x: 615, y: 60, kind: B },
        { id: "w", label: "Wages & expected\nprices fall", x: 615, y: 235, kind: B },
        { id: "sras", label: "SRAS shifts\ndown / right", x: 360, y: 235, kind: B, color: "#f472b6" },
        { id: "lr", label: "Output back at potential,\nlower price level", x: 130, y: 235, kind: B, color: GOAL },
      ],
      edges: [
        { from: "ad", to: "gap", label: "short run" },
        { from: "gap", to: "u" },
        { from: "u", to: "w", label: "slowly" },
        { from: "w", to: "sras" },
        { from: "sras", to: "lr", label: "long run" },
        { from: "sras", to: "gap", label: "closes the gap", dashed: true },
      ],
      explanation: [
        "In the short run a fall in AD moves the economy down along SRAS: lower output and a slightly lower price level.",
        "Slack in the labour market gradually lowers wages and expected prices, so SRAS shifts down.",
        "In the long run output returns to potential (LRAS) and only the price level is lower.",
        "Because wages adjust slowly, self-correction can take years — the case for fiscal and monetary policy.",
      ],
    },
  ],
  m07: [
    {
      id: "m07-crowd",
      title: "Fiscal expansion and crowding out in IS-LM",
      kind: "Concept map",
      width: 720,
      height: 360,
      nodes: [
        { id: "g", label: "G ↑ or taxes ↓", x: 100, y: 60, kind: B, color: LEVER },
        { id: "is", label: "IS shifts right", x: 330, y: 60, kind: B, color: "#a78bfa" },
        { id: "y", label: "Output (Y) ↑", x: 600, y: 60, kind: B, color: GOAL },
        { id: "md", label: "Money demand ↑", x: 600, y: 215, kind: B },
        { id: "r", label: "Interest rate (r) ↑", x: 330, y: 215, kind: B, color: SHOCK },
        { id: "i", label: "Investment ↓", x: 100, y: 215, kind: B },
        { id: "m", label: "Central bank: money\nsupply ↑ (LM right)", x: 330, y: 320, kind: B, color: LEVER },
      ],
      edges: [
        { from: "g", to: "is" },
        { from: "is", to: "y", label: "multiplier" },
        { from: "y", to: "md", label: "more transactions" },
        { from: "md", to: "r" },
        { from: "r", to: "i" },
        { from: "i", to: "y", label: "crowding out: Y rises less", dashed: true, curve: -0.04 },
        { from: "m", to: "r", label: "holds r down" },
      ],
      explanation: [
        "Higher government spending shifts IS right and raises output through the multiplier.",
        "Higher income raises money demand; with a fixed money supply the interest rate must rise.",
        "The higher rate reduces investment, so output rises by less than the Keynesian-cross multiplier — crowding out.",
        "If the central bank expands the money supply at the same time (LM shifts right), the rate need not rise and crowding out disappears.",
      ],
    },
  ],
  m08: [
    {
      id: "m08-fiscal",
      title: "Fiscal policy: stabilisers, stimulus and debt",
      kind: "Concept map",
      width: 720,
      height: 330,
      nodes: [
        { id: "rec", label: "Recession", x: 100, y: 60, kind: B, color: SHOCK },
        { id: "auto", label: "Automatic stabilisers:\ntaxes ↓, EI / UI ↑", x: 380, y: 55, kind: B },
        { id: "disc", label: "Discretionary stimulus\n(after recognition,\ndecision & action lags)", x: 425, y: 180, kind: B, color: LEVER },
        { id: "ad", label: "Aggregate demand ↑\n(gap narrows)", x: 610, y: 112, kind: B, color: GOAL },
        { id: "def", label: "Deficit ↑", x: 165, y: 295, kind: B },
        { id: "debt", label: "Debt / GDP\n(depends on r − g)", x: 440, y: 295, kind: B, color: SHOCK },
      ],
      edges: [
        { from: "rec", to: "auto", label: "immediately" },
        { from: "rec", to: "disc", label: "with a lag" },
        { from: "auto", to: "ad" },
        { from: "disc", to: "ad", label: "k_G or k_T" },
        { from: "auto", to: "def" },
        { from: "disc", to: "def" },
        { from: "def", to: "debt" },
      ],
      explanation: [
        "Automatic stabilisers respond at once: tax revenue falls and insurance payments rise as unemployment climbs.",
        "Discretionary stimulus is more powerful but arrives with lags; if it arrives late it can overheat the economy.",
        "Spending multipliers exceed tax multipliers because part of a tax cut is saved.",
        "Both raise the deficit. Whether debt-to-GDP keeps rising depends on the interest rate relative to growth (r − g).",
      ],
    },
  ],
  m09: [
    {
      id: "m09-tm",
      title: "The monetary transmission mechanism",
      kind: "Concept map",
      width: 780,
      height: 400,
      nodes: [
        { id: "pr", label: "Policy rate ↑\n(overnight /\nfed funds)", x: 70, y: 200, kind: B, color: LEVER },
        { id: "mr", label: "Interest-rate channel:\nloan & mortgage rates ↑", x: 290, y: 45, kind: B },
        { id: "fx", label: "Exchange-rate channel:\ncurrency appreciates", x: 290, y: 150, kind: B },
        { id: "ap", label: "Wealth channel:\nstock & house prices ↓", x: 290, y: 255, kind: B },
        { id: "ex", label: "Expectations channel:\ninflation expected ↓", x: 290, y: 360, kind: B },
        { id: "ic", label: "Investment &\nconsumption ↓", x: 515, y: 45, kind: B },
        { id: "nx", label: "Net exports ↓", x: 515, y: 150, kind: B },
        { id: "wl", label: "Spending ↓", x: 515, y: 255, kind: B },
        { id: "ad", label: "Aggregate\ndemand ↓", x: 695, y: 150, kind: B, color: "#22d3ee" },
        { id: "pi", label: "Inflation ↓\n(after 1-2 yrs)", x: 685, y: 330, kind: B, color: GOAL },
      ],
      edges: [
        { from: "pr", to: "mr" },
        { from: "pr", to: "fx" },
        { from: "pr", to: "ap" },
        { from: "pr", to: "ex" },
        { from: "mr", to: "ic" },
        { from: "fx", to: "nx" },
        { from: "ap", to: "wl" },
        { from: "ic", to: "ad" },
        { from: "nx", to: "ad" },
        { from: "wl", to: "ad" },
        { from: "ad", to: "pi", label: "output gap ↓" },
        { from: "ex", to: "pi", label: "wage & price setting" },
      ],
      explanation: [
        "A higher policy rate is passed on to the rates banks charge on mortgages and business loans, which reduces borrowing and spending.",
        "Higher rates attract foreign funds and raise the currency, making exports dearer — an important channel for Canada.",
        "Lower stock and house prices make households feel less wealthy, and credible policy keeps inflation expectations near 2 %.",
        "Together these lower aggregate demand and, with a lag of one to two years, inflation. The central bank watches inflation and the output gap and adjusts the rate again (Taylor rule).",
      ],
    },
  ],
  m10: [
    {
      id: "m10-mix",
      title: "Matching the policy mix to the shock",
      kind: "Concept map",
      width: 740,
      height: 330,
      nodes: [
        { id: "d", label: "Demand collapse", x: 105, y: 50, kind: B, color: SHOCK },
        { id: "s", label: "Oil / cost-push shock", x: 105, y: 165, kind: B, color: SHOCK },
        { id: "f", label: "Financial crisis", x: 105, y: 280, kind: B, color: SHOCK },
        { id: "d2", label: "Output & inflation\nfall together", x: 345, y: 50, kind: B },
        { id: "s2", label: "Trade-off: output ↓,\ninflation ↑", x: 345, y: 165, kind: B },
        { id: "f2", label: "Rate cuts pass\nthrough only partly", x: 345, y: 280, kind: B },
        { id: "d3", label: "Cut rates + fiscal\nstimulus", x: 600, y: 50, kind: B, color: GOAL },
        { id: "s3", label: "Look through if credible;\ntighten if expectations drift", x: 600, y: 165, kind: B, color: GOAL },
        { id: "f3", label: "Fiscal policy carries\nmore of the load", x: 600, y: 280, kind: B, color: GOAL },
      ],
      edges: [
        { from: "d", to: "d2" }, { from: "d2", to: "d3" },
        { from: "s", to: "s2" }, { from: "s2", to: "s3" },
        { from: "f", to: "f2" }, { from: "f2", to: "f3" },
      ],
      explanation: [
        "Diagnose first: demand shocks move output and inflation in the same direction, supply shocks in opposite directions.",
        "With a demand shock there is no trade-off — stabilising output also stabilises inflation.",
        "With a supply shock, credibility decides how hard the central bank must respond.",
        "When the banking system is damaged, monetary policy is weaker and fiscal policy matters more, at the cost of higher debt.",
      ],
    },
  ],
};
