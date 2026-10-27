import type { LucideIcon } from "lucide-react";
import type { Params, Row, SimResult } from "../engines";

export type SeriesSpec = {
  key: string;
  name: string;
  color: string;
  type?: "line" | "area" | "bar" | "scatter" | "band";
  /** for type "band": lower bound key (key is the upper bound) */
  keyLow?: string;
  /** stack areas/bars with the same id */
  stack?: string;
  /** for type "bar": keys of the lower / upper confidence bounds, drawn as error bars */
  errorKeys?: [string, string];
  axis?: "left" | "right";
  dashed?: boolean;
};

export type RefLine = { value: number | ((p: Params, extra: Record<string, any>) => number); label: string; color?: string };

/** A labelled point (e.g. an equilibrium) with dashed guide lines to both axes. */
export type RefDot = { x: number; y: number; label: string; color?: string; guides?: boolean };

export type ChartSpec = {
  id: string;
  title: string;
  subtitle?: string;
  /** key inside result.extra; defaults to result.series */
  data?: string;
  x: string;
  xLabel?: string;
  series: SeriesSpec[];
  yLabel?: string;
  yRightLabel?: string;
  refY?: RefLine[];
  refX?: RefLine[];
  yDomain?: [number | "auto", number | "auto"];
  /** transform rows before plotting (e.g. thin out or derive values) */
  transform?: (rows: Row[], p: Params) => Row[];
  wide?: boolean;
  /** equilibrium points etc., computed from the result */
  dots?: (extra: Record<string, any>, p: Params) => RefDot[];
  yLabelText?: string;
  /** categorical x axis: tick labels for x = 0, 1, 2, ... */
  xTickLabels?: string[];
};

export type Kpi = { label: string; value: string; tone?: "good" | "bad" | "warn" | "neutral"; hint?: string };

export type Experiment = {
  title: string;
  preset?: string;
  params?: Params;
  steps: string[];
  observe: string;
};

export type QuizQuestion = { q: string; options: string[]; answer: number; explain: string };

export type Section = { heading: string; body: string[]; bullets?: string[] };

export type Equation = { label: string; formula: string; note?: string };

export type Loop = { type: "R" | "B"; name: string; chain: string };

export type Reading = { cite: string; note?: string };

export type CourseModule = {
  id: string;
  number: number;
  title: string;
  short: string;
  tagline: string;
  accent: string;
  icon: LucideIcon;
  duration: string;
  summary: string;
  objectives: string[];
  sections: Section[];
  equations: Equation[];
  loops: Loop[];
  keyTerms: { term: string; def: string }[];
  experiments: Experiment[];
  quiz: QuizQuestion[];
  readings: Reading[];
  discussion: string[];
  charts: ChartSpec[];
  kpis: (r: SimResult, p: Params) => Kpi[];
  labFile: string;
  course?: number;
  /** Run this module on the FastAPI backend by default */
  preferServer?: boolean;
};
