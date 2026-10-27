/**
 * Browser port of engine/models.py — keep the two files in sync.
 * `npm run test:parity` checks they produce identical results.
 */
import { SPECS, withDefaults } from "./engine-core";
import type { Params, Row, SimResult } from "./engine-core";

export * from "./engine-core";

const grid = (lo: number, hi: number, n = 60) => Array.from({ length: n + 1 }, (_, i) => lo + ((hi - lo) * i) / n);

/* ---------------- Module 1: GDP ---------------- */
export function m01(params?: Params): SimResult {
  const p = withDefaults("m01", params);
  const years = SPECS.m01.years;
  const gdp0 = p.C + p.I + p.G + p.X - p.M;
  const rows: Row[] = [];
  let prevNom: number | null = null, prevReal: number | null = null;
  for (let t = 0; t <= years; t++) {
    const real = gdp0 * (1 + p.realGrowth) ** t;
    const price = 100 * (1 + p.inflation) ** t;
    const nominal = (real * price) / 100;
    rows.push({
      year: t, nominal, real, deflator: real ? (100 * nominal) / real : 0,
      nominalGrowth: prevNom ? 100 * (nominal / prevNom - 1) : 0,
      realGrowth: prevReal ? 100 * (real / prevReal - 1) : 0,
    });
    prevNom = nominal;
    prevReal = real;
  }
  const parts: number[] = [p.C, p.I, p.G, p.X, -p.M, gdp0];
  const bars = parts.map((v, i) => ({ idx: i, value: v }));
  return { series: rows, extra: { bars, gdp: gdp0, netExports: p.X - p.M } };
}

/* ---------------- Module 2: Unemployment ---------------- */
export function m02(params?: Params): SimResult {
  const p = withDefaults("m02", params);
  const months = SPECS.m02.years;
  const population = 30;
  const LF = population * p.participation;
  const s = p.separation, f = p.jobFinding;
  const uStar = s / (s + f);
  let U = uStar * LF;
  let E = LF - U;
  const start = 24;
  const rows: Row[] = [];
  for (let t = 0; t <= months; t++) {
    const inRecession = start <= t && t < start + p.length;
    const fT = inRecession ? f * (1 - p.depth) : f;
    const u = U / LF;
    rows.push({
      month: t, unemploymentRate: 100 * u, naturalRate: 100 * uStar, cyclical: 100 * (u - uStar),
      employed: E, unemployed: U, outputGap: -p.okun * 100 * (u - uStar), jobFinding: 100 * fT,
    });
    const separations = s * E;
    const hires = fT * U;
    U = U + separations - hires;
    E = LF - U;
  }
  return { series: rows, extra: { naturalRate: 100 * uStar, laborForce: LF, employmentRate: 100 * (1 - uStar) * p.participation } };
}

/* ---------------- Module 3: Inflation ---------------- */
export function m03(params?: Params): SimResult {
  const p = withDefaults("m03", params);
  const years = SPECS.m03.years;
  let P = 100, W = 100;
  const rows: Row[] = [];
  for (let t = 0; t <= years; t++) {
    const Pnext = (P * (1 + p.moneyGrowth) * (1 + p.velocity)) / (1 + p.realGrowth);
    const inflation = Pnext / P - 1;
    const realRate = (1 + p.nominalRate) / (1 + inflation) - 1;
    rows.push({ year: t, priceLevel: P, inflation: 100 * inflation, nominalWage: W, realWage: (100 * W) / P, realRate: 100 * realRate, nominalRate: 100 * p.nominalRate });
    P = Pnext;
    W = W * (1 + p.wageGrowth);
  }
  const infl = rows[0].inflation;
  return { series: rows, extra: { inflation: infl, doubling: infl > 0 ? 70 / infl : 0 } };
}

/* ---------------- Module 4: Growth (Solow) ---------------- */
const ALPHA = 1 / 3;

export function m04(params?: Params): SimResult {
  const p = withDefaults("m04", params);
  const years = SPECS.m04.years;
  const s = p.saving, n = p.popGrowth, d = p.depreciation, g = p.techGrowth;
  const kStar = (s / (n + g + d)) ** (1 / (1 - ALPHA));
  const yStar = kStar ** ALPHA;
  // both countries start from the baseline steady state (default parameters)
  const kBase = (0.25 / (0.01 + 0.015 + 0.05)) ** (1 / (1 - ALPHA));
  let kRich = kBase, kPoor = p.poorStart * kBase;
  const base = kBase ** ALPHA;
  const rows: Row[] = [];
  let prevR: number | null = null, prevP: number | null = null;
  for (let t = 0; t <= years; t++) {
    const A = Math.exp(g * t);
    const yR = (100 * A * kRich ** ALPHA) / base;
    const yP = (100 * A * kPoor ** ALPHA) / base;
    rows.push({
      year: t, rich: yR, poor: yP, ratio: (100 * yP) / yR,
      growthRich: prevR ? 100 * (yR / prevR - 1) : 100 * g,
      growthPoor: prevP ? 100 * (yP / prevP - 1) : 0,
    });
    prevR = yR;
    prevP = yP;
    kRich = kRich + s * kRich ** ALPHA - (n + g + d) * kRich;
    kPoor = kPoor + s * kPoor ** ALPHA - (n + g + d) * kPoor;
  }
  const curve = grid(0, 2 * kStar, 50).map((k) => ({ k, investment: s * k ** ALPHA, breakEven: (n + g + d) * k, output: k ** ALPHA }));
  return { series: rows, extra: { curve, kStar, yStar, iStar: s * yStar, doubling: g > 0 ? 70 / (100 * g) : 0 } };
}

/* ---------------- Module 5: AE model ---------------- */
export function m05(params?: Params): SimResult {
  const p = withDefaults("m05", params);
  const b = p.mpc;
  const autonomous = p.autoC - b * p.T + p.I + p.G + p.NX;
  const mult = 1 / (1 - b);
  const y0 = autonomous * mult;
  const y1 = (autonomous + p.shock) * mult;
  const hi = Math.max(y0, y1, p.potential) * 1.4;
  const rows: Row[] = grid(0, hi, 60).map((Y) => {
    const ae0 = autonomous + b * Y;
    return { Y, line45: Y, ae0, ae1: ae0 + p.shock };
  });
  const rounds: Row[] = [];
  let cum = 0;
  for (let k = 1; k <= 10; k++) {
    const spend = p.shock * b ** (k - 1);
    cum += spend;
    rounds.push({ idx: k - 1, spending: spend, cumulative: cum });
  }
  return { series: rows, extra: { y0, y1, multiplier: mult, rounds, gap: y1 - p.potential } };
}

/* ---------------- Module 6: AD/AS ---------------- */
const AD_BASE = 1000, AD_SLOPE = 5, P0 = 100, YP0 = 1000;

function m06Eq(d: number, pe: number, cost: number, yp: number, s: number): [number, number] {
  const y = (P0 - pe - cost + (AD_BASE + d) / AD_SLOPE + s * yp) / (s + 1 / AD_SLOPE);
  const price = P0 + (AD_BASE + d - y) / AD_SLOPE;
  return [y, price];
}

export function m06(params?: Params): SimResult {
  const p = withDefaults("m06", params);
  const periods = SPECS.m06.years;
  const d = p.demandShock, c = p.supplyShock, s = p.slope;
  const temporary = p.supplyType === "temporary";
  const ypOld = YP0;
  const yp = YP0 + p.potentialShift - (temporary ? 0 : c / s);
  const ypCapacity = YP0 + p.potentialShift;
  let pe = P0;
  const path: Row[] = [];
  for (let t = 0; t <= periods; t++) {
    const cost = temporary ? c * 0.7 ** t : c;
    const [y, price] = m06Eq(d, pe, cost, ypCapacity, s);
    path.push({ period: t, output: y, price, gap: (100 * (y - yp)) / yp, expectedPrice: pe, potential: yp });
    pe = pe + p.adjust * (price - pe);
  }
  const lastCost = temporary ? c * 0.7 ** periods : c;
  const lastPe = path[path.length - 1].expectedPrice;
  const curves: Row[] = grid(700, 1300, 60).map((Y) => ({
    Y,
    ad0: P0 + (AD_BASE - Y) / AD_SLOPE,
    ad1: P0 + (AD_BASE + d - Y) / AD_SLOPE,
    sras0: P0 + s * (Y - ypOld),
    sras1: P0 + s * (Y - ypCapacity) + c,
    srasLR: lastPe + s * (Y - ypCapacity) + lastCost,
  }));
  return {
    series: path,
    extra: { curves, yp, ypOld, srY: path[0].output, srP: path[0].price, lrY: path[path.length - 1].output, lrP: path[path.length - 1].price },
  };
}

/* ---------------- Module 7: IS-LM ---------------- */
const A_AUTO = 100, I0 = 300, MPC7 = 0.75, K_MONEY = 0.5;

function m07Eq(G: number, T: number, M: number, d: number, h: number): [number, number] {
  const autonomous = A_AUTO - MPC7 * T + I0 + G;
  const y = (autonomous + (d * M) / h) / (1 - MPC7 + (d * K_MONEY) / h);
  const r = (K_MONEY * y - M) / h;
  return [y, r];
}

export function m07(params?: Params): SimResult {
  const p = withDefaults("m07", params);
  const d = p.investSens, h = p.moneySens;
  const [y0, r0] = m07Eq(p.G, p.T, p.M, d, h);
  const [y1, r1] = m07Eq(p.G + p.dG, p.T, p.M + p.dM, d, h);
  const cross = p.dG / (1 - MPC7);
  const lo = Math.min(y0, y1) * 0.6, hi = Math.max(y0, y1) * 1.4;
  const rows: Row[] = grid(lo, hi, 60).map((Y) => ({
    Y,
    is0: (A_AUTO - MPC7 * p.T + I0 + p.G - (1 - MPC7) * Y) / d,
    is1: (A_AUTO - MPC7 * p.T + I0 + p.G + p.dG - (1 - MPC7) * Y) / d,
    lm0: (K_MONEY * Y - p.M) / h,
    lm1: (K_MONEY * Y - p.M - p.dM) / h,
  }));
  const crowd = cross > 0 ? Math.min(100, (100 * Math.max(0, d * (r1 - r0))) / (1 - MPC7) / cross) : 0;
  return { series: rows, extra: { y0, r0, y1, r1, crossEffect: cross, crowdingOut: crowd, investmentChange: -d * (r1 - r0) } };
}

/* ---------------- Module 8: Fiscal policy ---------------- */
export function m08(params?: Params): SimResult {
  const p = withDefaults("m08", params);
  const quarters = SPECS.m08.years;
  const kG = Math.min(4, (1 - p.crowding) / (1 - p.mpc));
  const kT = p.mpc * kG;
  const start = Math.trunc(p.lag), end = Math.trunc(p.lag) + Math.trunc(p.duration);
  const rows: Row[] = [];
  for (let q = 0; q <= quarters; q++) {
    const base = p.recession * 0.85 ** q;
    const active = start <= q && q < end;
    const G = active ? p.spending : 0;
    const T = active ? p.taxCut : 0;
    const effect = kG * G + kT * T;
    rows.push({ quarter: q, gapNoPolicy: base, gapPolicy: base + effect, stimulus: G + T, effect });
  }
  const costByYear = new Array(31).fill(0);
  for (let q = start; q < end; q++) costByYear[Math.floor(q / 4)] += (p.spending + p.taxCut) / 4;
  const debt: Row[] = [];
  let d0 = p.debt0, d1 = p.debt0;
  for (let y = 0; y <= 30; y++) {
    debt.push({ year: y, withStimulus: d1, withoutStimulus: d0 });
    const recDeficit = y < 3 ? -p.recession * 0.5 * 0.85 ** (4 * y) : 0;
    const factor = (1 + p.interest) / (1 + p.growth);
    d0 = d0 * factor + recDeficit;
    d1 = d1 * factor + recDeficit + costByYear[y];
  }
  const saved = rows.reduce((a, r) => a + (r.gapPolicy - r.gapNoPolicy), 0) / 4;
  return { series: rows, extra: { debt, kG, kT, balanced: kG - kT, outputGained: saved } };
}

/* ---------------- Module 9: Monetary policy ---------------- */
const PI_TARGET = 2, R_NEUTRAL = 2;

function transmission(
  p: Record<string, any>, quarters: number, respond: boolean, demand: number, cost: number,
  fiscal: number[] | null = null, impaired = 1,
): Row[] {
  let piPrev = PI_TARGET;
  let policyEffect = 0;
  let market = R_NEUTRAL + PI_TARGET;
  const realHist: number[] = [];
  const out: Row[] = [];
  for (let q = 0; q <= quarters; q++) {
    const demandShock = q >= 1 ? demand * 0.85 ** (q - 1) : 0;
    const costPush = q >= 1 ? cost * 0.6 ** (q - 1) : 0;
    const f = fiscal !== null ? fiscal[q] : 0;
    const gap = demandShock + f + policyEffect;
    const expPi = p.credibility * PI_TARGET + (1 - p.credibility) * piPrev;
    const pi = expPi + 0.3 * gap + costPush;
    let policy = respond ? R_NEUTRAL + PI_TARGET + p.phiPi * (pi - PI_TARGET) + p.phiY * gap : R_NEUTRAL + PI_TARGET;
    policy = Math.max(0, policy);
    market = market + p.passThrough * impaired * (policy - market);
    const real = market - expPi;
    realHist.push(real);
    const lag = Math.trunc(p.lag);
    const lagged = realHist.length > lag ? realHist[realHist.length - 1 - lag] : R_NEUTRAL;
    const dev = lagged - R_NEUTRAL;
    const chRate = -0.12 * dev, chFx = -0.05 * dev, chWealth = -0.03 * dev;
    out.push({ quarter: q, policyRate: policy, marketRate: market, realRate: real, inflation: pi, expected: expPi, gap, chRate, chFx, chWealth, fiscal: f });
    policyEffect = 0.8 * policyEffect + chRate + chFx + chWealth;
    piPrev = pi;
  }
  return out;
}

export function m09(params?: Params): SimResult {
  const p = withDefaults("m09", params);
  const quarters = SPECS.m09.years;
  const demand = p.shockType === "demand" ? -p.shockSize : 0;
  const cost = p.shockType === "costPush" ? p.shockSize : 0;
  const pol = transmission(p, quarters, true, demand, cost);
  const none = transmission(p, quarters, false, demand, cost);
  const rows: Row[] = pol.map((a, i) => ({ ...a, inflationNoResponse: none[i].inflation, gapNoResponse: none[i].gap }));
  const sum = (k: string) => pol.reduce((acc, r) => acc + r[k], 0);
  const channels = [{ idx: 0, value: sum("chRate") }, { idx: 1, value: sum("chFx") }, { idx: 2, value: sum("chWealth") }];
  return { series: rows, extra: { channels } };
}

/* ---------------- Module 10: Capstone policy lab ---------------- */
const SCENARIOS: Record<string, { demand: number; cost: number; impaired: number }> = {
  demandCollapse: { demand: -3, cost: 0, impaired: 1 },
  oilShock: { demand: -0.5, cost: 3, impaired: 1 },
  financialCrisis: { demand: -4, cost: 0, impaired: 0.4 },
};

export function m10(params?: Params): SimResult {
  const p = withDefaults("m10", params);
  const quarters = SPECS.m10.years;
  const sc = SCENARIOS[p.scenario];
  const baseP = { ...p, lag: 3, passThrough: 0.7 };
  const start = Math.trunc(p.fiscalLag);
  const fiscal = Array.from({ length: quarters + 1 }, (_, q) => (start <= q && q < start + 6 ? 1.2 * p.fiscal * 0.25 : 0));
  const mix = transmission(baseP, quarters, true, sc.demand, sc.cost, fiscal, sc.impaired);
  const noneP = { ...baseP, phiPi: 0, phiY: 0 };
  const none = transmission(noneP, quarters, false, sc.demand, sc.cost, null, sc.impaired);
  const rows: Row[] = [];
  let debt = 60, debtNone = 60;
  mix.forEach((a, i) => {
    const b = none[i];
    const q = Math.trunc(a.quarter);
    debt += 0.25 * (start <= q && q < start + 6 ? p.fiscal : 0) - 0.1 * Math.min(0, a.gap) * 0.25;
    debtNone += -0.1 * Math.min(0, b.gap) * 0.25;
    rows.push({
      quarter: a.quarter, gap: a.gap, gapNone: b.gap, inflation: a.inflation, inflationNone: b.inflation,
      policyRate: a.policyRate, unemployment: 6 - a.gap / 2, unemploymentNone: 6 - b.gap / 2, debt, debtNone,
    });
  });
  const loss = rows.reduce((acc, r) => acc + r.gap ** 2 + (r.inflation - PI_TARGET) ** 2, 0) / rows.length;
  const lossNone = rows.reduce((acc, r) => acc + r.gapNone ** 2 + (r.inflationNone - PI_TARGET) ** 2, 0) / rows.length;
  return { series: rows, extra: { loss, lossNone } };
}

export const MODELS: Record<string, (p?: Params) => SimResult> = { m01, m02, m03, m04, m05, m06, m07, m08, m09, m10 };

export function runModel(id: string, params?: Params): SimResult {
  const fn = MODELS[id];
  if (!fn) throw new Error(`Unknown module ${id}`);
  return fn(params);
}
