"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpen, ChartLine, CircleCheck, CircleHelp, Code, Gauge as GaugeIcon, Moon, Sun } from "lucide-react";
import { MODULES } from "@/lib/course";
import Learn from "./Learn";
import Simulator from "./Simulator";
import LabView from "./LabView";
import Quiz from "./Quiz";

type Section = "learn" | "simulate" | "lab" | "quiz";
const SECTIONS: { id: Section; label: string; icon: typeof BookOpen }[] = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "simulate", label: "Simulate", icon: GaugeIcon },
  { id: "lab", label: "Python Lab", icon: Code },
  { id: "quiz", label: "Quiz", icon: CircleHelp },
];
const STORAGE_KEY = "macrolab-progress-v1";
const THEME_KEY = "macrolab-theme-v1";

function readHash(): { m: number; s: Section } {
  if (typeof window === "undefined") return { m: 0, s: "learn" };
  const [mod, sec] = window.location.hash.replace("#", "").split("/");
  const idx = MODULES.findIndex((x) => x.id === mod);
  const s = SECTIONS.some((x) => x.id === sec) ? (sec as Section) : "learn";
  return { m: idx >= 0 ? idx : 0, s };
}

export default function CourseApp({ code }: { code: Record<string, { lab: string; model: string }> }) {
  const [active, setActive] = useState(0);
  const [section, setSection] = useState<Section>("learn");
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  // "auto": soft light for reading pages, dark for the simulator.  "dark": dark everywhere.
  const [themePref, setThemePref] = useState<"auto" | "dark">("auto");

  useEffect(() => {
    const sync = () => {
      const { m, s } = readHash();
      setActive(m);
      setSection(s);
    };
    sync();
    window.addEventListener("hashchange", sync);
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress(JSON.parse(saved));
      if (window.localStorage.getItem(THEME_KEY) === "dark") setThemePref("dark");
    } catch {
      /* storage unavailable */
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    fetch("/api/py/health", { signal: ctrl.signal })
      .then((r) => setApiOnline(r.ok))
      .catch(() => setApiOnline(false))
      .finally(() => clearTimeout(t));
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const go = useCallback((m: number, s: Section) => {
    window.location.hash = `${MODULES[m].id}/${s}`;
    setActive(m);
    setSection(s);
  }, []);

  const recordScore = (id: string, score: number, total: number) => {
    setProgress((p) => {
      const next = { ...p, [id]: Math.max(p[id] ?? 0, score / total) };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  };

  useEffect(() => {
    document.getElementById(`tab-${MODULES[active].id}`)?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);

  const toggleTheme = () => {
    const next = themePref === "auto" ? "dark" : "auto";
    setThemePref(next);
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable */
    }
  };

  const mod = MODULES[active];
  const Icon = mod.icon;
  const theme = themePref === "dark" || section === "simulate" ? "dark" : "paper";
  const done = MODULES.filter((m) => (progress[m.id] ?? 0) >= 0.8).length;

  return (
    <div style={{ ["--accent-base" as string]: mod.accent }} data-theme={theme} className="theme-root min-h-screen">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-fuchsia-500 grid place-items-center shrink-0">
                <ChartLine size={20} className="text-slate-950" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white leading-tight truncate">MacroLab</div>
                <div className="text-xs text-slate-400 truncate">Principles of Macroeconomics · Modules 1–10 · by Jean Alegue, PhD</div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                <div className="h-1.5 w-24 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 transition-all" style={{ width: `${done * 10}%` }} />
                </div>
                {done}/10 complete
              </div>
              <button onClick={toggleTheme} className="pill border-slate-700 text-slate-300 hover:text-white"
                title={themePref === "auto" ? "Reading pages use a soft light theme. Click for dark everywhere." : "Dark everywhere. Click for soft light reading pages."}>
                {themePref === "auto" ? <Sun size={13} /> : <Moon size={13} />}
                <span className="hidden md:inline">{themePref === "auto" ? "Soft light reading" : "Dark everywhere"}</span>
              </button>
              <span className={`pill ${apiOnline ? "text-emerald-300 border-emerald-500/40" : apiOnline === false ? "text-amber-300 border-amber-500/40" : "text-slate-400 border-slate-700"}`}
                title="Status of the FastAPI backend at /api/py/health">
                <span className={`h-1.5 w-1.5 rounded-full ${apiOnline ? "bg-emerald-400" : apiOnline === false ? "bg-amber-400" : "bg-slate-500"}`} />
                {apiOnline ? "Python API online" : apiOnline === false ? "API offline" : "Checking API"}
              </span>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto no-scrollbar -mb-px" aria-label="Modules">
            {MODULES.map((m, i) => {
              const isActive = i === active;
              const passed = (progress[m.id] ?? 0) >= 0.8;
              return (
                <button key={m.id} id={`tab-${m.id}`} onClick={() => go(i, section)}
                  style={{ ["--tab-base" as string]: m.accent }}
                  className={`tab-btn group shrink-0 flex items-center gap-2 px-3 py-2.5 text-sm border-b-2 transition ${isActive ? "border-[var(--tab)] text-white" : "border-transparent text-slate-400 hover:text-slate-200"}`}>
                  <span className={`font-mono text-xs ${isActive ? "text-[var(--tab)]" : "text-slate-500"}`}>{String(m.number).padStart(2, "0")}</span>
                  <span className="whitespace-nowrap">{m.short}</span>
                  {passed && <CircleCheck size={13} className="text-emerald-400" />}
                </button>
              );
            })}

          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6 sm:py-8">
        <section className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex gap-4 min-w-0">
            <div className="h-14 w-14 shrink-0 rounded-2xl grid place-items-center bg-[var(--accent)]/15 ring-1 ring-[var(--accent)]/40">
              <Icon size={28} className="text-[var(--accent)]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Module {mod.number} · {mod.duration}</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 text-balance">{mod.title}</h1>
              <p className="text-slate-400 mt-1">{mod.tagline}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:flex gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800 w-full sm:w-auto self-start lg:self-auto">
            {SECTIONS.map((s) => {
              const SIcon = s.icon;
              return (
                <button key={s.id} onClick={() => go(active, s.id)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg px-2 sm:px-3.5 py-2 text-xs sm:text-sm font-medium transition whitespace-nowrap ${section === s.id ? "bg-[var(--accent)] text-slate-950" : "text-slate-400 hover:text-white"}`}>
                  <SIcon size={15} className="hidden sm:block" /> {s.label}
                </button>
              );
            })}
          </div>
        </section>

        {section === "learn" && (
          <>
            <p className="text-slate-300 max-w-4xl mb-6 leading-relaxed">{mod.summary}</p>
            <Learn mod={mod} />
            <div className="mt-6 flex justify-end">
              <button className="btn-accent" onClick={() => go(active, "simulate")}>Open the simulator →</button>
            </div>
          </>
        )}
        {section === "simulate" && <Simulator key={mod.id} mod={mod} apiOnline={apiOnline} />}
        {section === "lab" && <LabView mod={mod} labCode={code[mod.id]?.lab ?? ""} modelCode={code[mod.id]?.model ?? ""} />}
        {section === "quiz" && <Quiz key={mod.id} mod={mod} onScore={(s, t) => recordScore(mod.id, s, t)} />}
      </main>

      <footer className="border-t border-slate-800 mt-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <span className="space-y-1">
            <span className="block text-sm text-slate-300">Site created by <b className="font-semibold text-slate-100">Jean Alegue, PhD</b></span>
            <span className="block">Textbook models for learning — simplified, not forecasts. Equations: engine/models.py (Python) · lib/engines.ts (TypeScript).</span>
          </span>
          <a className="hover:text-slate-300" href="/api/py/docs" target="_blank" rel="noreferrer">API docs (/api/py/docs)</a>
        </div>
      </footer>
    </div>
  );
}
