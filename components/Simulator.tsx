"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Cpu, Download, FlaskConical, RotateCcw, Server, TriangleAlert } from "lucide-react";
import ChartCard from "./ChartCard";
import { defaults, runModel, SPECS, type ParamSpec, type Params, type SimResult } from "@/lib/engines";
import type { CourseModule, Kpi } from "@/lib/course/types";

type Engine = "browser" | "server";

function formatValue(spec: ParamSpec, v: number) {
  switch (spec.format) {
    case "pct":
      return `${(v * 100).toFixed(v * 100 < 10 && v !== 0 ? 1 : 0)}%`;
    case "x":
      return `${v.toFixed(1)}×`;
    case "ratio":
      return `${v.toFixed(v < 10 ? 1 : 0)}:1`;
    default:
      return Number.isInteger(v) ? v.toLocaleString() : v.toFixed(v < 1 ? 3 : 2);
  }
}

const toneClass: Record<NonNullable<Kpi["tone"]>, string> = {
  good: "text-emerald-300 border-emerald-500/30",
  bad: "text-rose-300 border-rose-500/30",
  warn: "text-amber-300 border-amber-500/30",
  neutral: "text-slate-100 border-slate-700",
};

/** Make an unpaired half-width chart span the full row so the grid has no holes. */
function layoutCharts(charts: CourseModule["charts"]) {
  const out = [];
  for (let i = 0; i < charts.length; i++) {
    const c = charts[i];
    if (c.wide) { out.push(c); continue; }
    const next = charts[i + 1];
    if (next && !next.wide) { out.push(c, next); i++; } else out.push({ ...c, wide: true });
  }
  return out;
}

function toCsv(result: SimResult) {
  const rows = result.series;
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  return [keys.join(","), ...rows.map((r) => keys.map((k) => r[k]).join(","))].join("\n");
}

export default function Simulator({ mod, apiOnline }: { mod: CourseModule; apiOnline: boolean | null }) {
  const spec = SPECS[mod.id];
  const [params, setParams] = useState<Params>(() => defaults(mod.id));
  const [engine, setEngine] = useState<Engine>(mod.preferServer ? "server" : "browser");
  const [serverResult, setServerResult] = useState<SimResult | null>(null);
  const [serverInfo, setServerInfo] = useState<{ ms: number; error?: string } | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const reqId = useRef(0);

  const browserResult = useMemo(() => runModel(mod.id, params), [mod.id, params]);
  const useServer = engine === "server" && apiOnline !== false;

  useEffect(() => {
    if (!useServer) return;
    const id = ++reqId.current;
    const timer = setTimeout(async () => {
      const t0 = performance.now();
      try {
        const res = await fetch(`/api/py/simulate/${mod.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ params }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (id !== reqId.current) return;
        setServerResult({ series: json.series, extra: json.extra });
        setServerInfo({ ms: Math.round(performance.now() - t0) });
      } catch (e) {
        if (id !== reqId.current) return;
        setServerResult(null);
        setServerInfo({ ms: 0, error: (e as Error).message });
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [useServer, mod.id, params]);

  const result = useServer && serverResult && !serverInfo?.error ? serverResult : browserResult;
  const runningOn: Engine = result === browserResult ? "browser" : "server";
  const kpis = mod.kpis(result, params);

  const set = (key: string, value: Params[string]) => {
    setActivePreset(null);
    setParams((p) => ({ ...p, [key]: value }));
  };
  const loadPreset = (name: string) => {
    setActivePreset(name);
    setParams({ ...defaults(mod.id), ...spec.presets[name] });
  };
  const loadExperiment = (preset?: string, extra?: Params) => {
    const base = preset ? { ...defaults(mod.id), ...spec.presets[preset] } : defaults(mod.id);
    setActivePreset(preset ?? null);
    setParams({ ...base, ...(extra ?? {}) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const download = () => {
    const blob = new Blob([toCsv(result)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `module-${mod.number}-simulation.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-5">
      {/* Controls */}
      <aside className="space-y-5">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-100">Policy & parameters</h3>
            <button onClick={() => { setParams(defaults(mod.id)); setActivePreset(null); }} className="btn-ghost" title="Reset to defaults">
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div className="mb-5">
            <div className="label mb-2">Scenarios</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(spec.presets).map((name) => (
                <button key={name} onClick={() => loadPreset(name)}
                  className={`chip ${activePreset === name ? "chip-active" : ""}`}>
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {spec.params.map((p) => {
              const v = params[p.key];
              if (p.type === "bool") {
                return (
                  <label key={p.key} className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={Boolean(v)} onChange={(e) => set(p.key, e.target.checked)} className="mt-1 accent-[var(--accent)] h-4 w-4" />
                    <span>
                      <span className="text-sm text-slate-200">{p.label}</span>
                      {p.help && <span className="block text-xs text-slate-500 mt-0.5">{p.help}</span>}
                    </span>
                  </label>
                );
              }
              if (p.type === "choice") {
                return (
                  <div key={p.key}>
                    <div className="text-sm text-slate-300 mb-2">{p.label}</div>
                    <div className={`grid ${p.options!.length === 3 ? "grid-cols-3" : "grid-cols-2"} gap-1 rounded-lg bg-slate-950/60 p-1 border border-slate-800`}>
                      {p.options!.map((o) => (
                        <button key={o} onClick={() => set(p.key, o)}
                          className={`rounded-md py-1.5 px-1 text-xs font-medium transition ${v === o ? "bg-[var(--accent)] text-slate-950" : "text-slate-400 hover:text-slate-200"}`}>
                          {(() => { const t = o.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase(); return t.charAt(0).toUpperCase() + t.slice(1); })()}
                        </button>
                      ))}
                    </div>
                    {p.help && <p className="text-xs text-slate-500 mt-1.5">{p.help}</p>}
                  </div>
                );
              }
              const num = Number(v);
              return (
                <div key={p.key}>
                  <div className="flex justify-between items-baseline mb-1.5 gap-3">
                    <label htmlFor={`${mod.id}-${p.key}`} className="text-sm text-slate-300">{p.label}</label>
                    <span className="font-mono text-sm text-[var(--accent)] whitespace-nowrap">{formatValue(p, num)}</span>
                  </div>
                  <input id={`${mod.id}-${p.key}`} type="range" min={p.min} max={p.max} step={p.step} value={num}
                    onChange={(e) => set(p.key, parseFloat(e.target.value))} className="w-full accent-[var(--accent)]" />
                  {p.help && <p className="text-xs text-slate-500 mt-1">{p.help}</p>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <div className="label mb-2">Simulation engine</div>
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-950/60 p-1 border border-slate-800">
            <button onClick={() => setEngine("browser")}
              className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition ${engine === "browser" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"}`}>
              <Cpu size={14} /> Browser (TS)
            </button>
            <button onClick={() => setEngine("server")}
              className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition ${engine === "server" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"}`}>
              <Server size={14} /> FastAPI (Py)
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
            {runningOn === "server" && serverInfo
              ? `Computed by Python on the server in ${serverInfo.ms} ms.`
              : engine === "server"
                ? apiOnline === false || serverInfo?.error
                  ? "Python API unreachable — showing the identical TypeScript engine. Run `npm run dev` to start both."
                  : "Contacting the Python API…"
                : "Same equations as engine/models.py, ported to TypeScript for instant feedback."}
          </p>
          {engine === "server" && (apiOnline === false || serverInfo?.error) && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-300"><TriangleAlert size={13} /> Fallback active</div>
          )}
          <button onClick={download} className="btn-ghost mt-4 w-full justify-center border border-slate-700">
            <Download size={14} /> Download run as CSV
          </button>
        </div>
      </aside>

      {/* Results */}
      <section className="space-y-5 min-w-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((k) => (
            <div key={k.label} className={`rounded-xl border bg-slate-900/70 p-3.5 ${toneClass[k.tone ?? "neutral"]}`}>
              <div className="text-[11px] uppercase tracking-wider text-slate-400">{k.label}</div>
              <div className="mt-1 font-mono text-lg font-semibold leading-tight">{k.value}</div>
              {k.hint && <div className="text-[11px] text-slate-500 mt-0.5">{k.hint}</div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {layoutCharts(mod.charts).map((c) => (
            <ChartCard key={c.id} spec={c} rows={c.data ? (result.extra[c.data] as never) : result.series} params={params} accent={mod.accent} extra={result.extra} />
          ))}
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-4">
            <FlaskConical size={16} className="text-[var(--accent)]" /> Guided experiments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mod.experiments.map((ex, i) => (
              <div key={ex.title} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 flex flex-col">
                <div className="text-xs text-[var(--accent)] font-mono mb-1">Experiment {i + 1}</div>
                <div className="font-medium text-slate-100 mb-2">{ex.title}</div>
                <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1 mb-3">
                  {ex.steps.map((s) => <li key={s}>{s}</li>)}
                </ol>
                <details className="text-sm mt-auto">
                  <summary className="cursor-pointer text-slate-300 hover:text-white">What should I see?</summary>
                  <p className="text-slate-400 mt-2">{ex.observe}</p>
                </details>
                {(ex.preset || ex.params) && (
                  <button onClick={() => loadExperiment(ex.preset, ex.params)} className="btn-accent mt-3">Load setup</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
