/** Shared types, specs and helpers for the MacroLab engines. */
import specsJson from "../engine/specs.json";

export type ParamValue = number | boolean | string;
export type Params = Record<string, ParamValue>;
export type Row = Record<string, number>;
/** Rows may contain null for missing observations (Module 12). */
export type NRow = Record<string, number | null>;
export type SimResult = { series: Row[]; extra: Record<string, any> };

export type ParamSpec = {
  key: string;
  label: string;
  type: "range" | "bool" | "choice";
  default: ParamValue;
  min?: number;
  max?: number;
  step?: number;
  format?: "pct" | "num" | "x" | "ratio";
  options?: string[];
  help?: string;
};
export type ModuleSpec = {
  years: number;
  startYear?: number;
  params: ParamSpec[];
  presets: Record<string, Params>;
};

export const SPECS = specsJson as unknown as Record<string, ModuleSpec>;

export const DT = 0.25;
export const SPY = Math.round(1 / DT);

export const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

export function defaults(id: string): Params {
  const out: Params = {};
  for (const p of SPECS[id].params) out[p.key] = p.default;
  return out;
}

export function withDefaults(id: string, params?: Params): Record<string, any> {
  const merged: Record<string, any> = defaults(id);
  for (const [k, v] of Object.entries(params ?? {})) {
    if (k in merged && v !== undefined && v !== null) merged[k] = v;
  }
  return merged;
}

