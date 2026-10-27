import type { Row } from "../engines";

export const C = {
  nature: "#34d399",
  capital: "#60a5fa",
  pollution: "#fb7185",
  output: "#fbbf24",
  extraction: "#fb923c",
  regen: "#a3e635",
  violet: "#a78bfa",
  cyan: "#22d3ee",
  slate: "#94a3b8",
  white: "#e2e8f0",
};

export const fmt = (v: number, digits = 1) => {
  if (!Number.isFinite(v)) return "—";
  const abs = Math.abs(v);
  if (abs >= 10000) return v.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
};
export const pct = (v: number, digits = 0) => `${fmt(v, digits)}%`;

export const first = (rows: Row[]) => rows[0];
export const last = (rows: Row[]) => rows[rows.length - 1];

export function peak(rows: Row[], key: string) {
  let best = rows[0];
  for (const r of rows) if (r[key] > best[key]) best = r;
  return best;
}
export function trough(rows: Row[], key: string) {
  let best = rows[0];
  for (const r of rows) if (r[key] < best[key]) best = r;
  return best;
}
export function firstWhere(rows: Row[], pred: (r: Row) => boolean) {
  return rows.find(pred);
}
export const sum = (rows: Row[], key: string) => rows.reduce((a, r) => a + r[key], 0);
