import { BookOpen, Repeat, Sigma, Target, MessageSquare, Library, Network } from "lucide-react";
import SystemDiagram from "./SystemDiagram";
import { DIAGRAMS } from "@/lib/course/diagrams";
import type { CourseModule } from "@/lib/course/types";

function DiagramLegend({ sfd }: { sfd: boolean }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-400">
      <span><b className="text-emerald-500 text-sm">+</b> same direction</span>
      <span><b className="text-rose-500 text-sm">−</b> opposite direction</span>
      <span><b className="text-slate-300">‖</b> delay</span>
      <span><b className="text-rose-500">R</b> reinforcing loop</span>
      <span><b className="text-sky-500">B</b> balancing loop</span>
      <span><b className="text-[var(--accent)]">Coloured label</b> = slider in the simulator</span>
      {sfd && <span>▭ stock · ⧓ valve (flow rate) · ☁ boundary</span>}
    </div>
  );
}

function DagLegend() {
  const roles: [string, string][] = [["Treatment", "#6366f1"], ["Outcome", "#f43f5e"], ["Confounder — adjust", "#d97706"], ["Mediator — don't adjust", "#0d9488"], ["Collider — don't adjust", "#8b5cf6"]];
  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-400">
      {roles.map(([r, c]) => (
        <span key={r} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />{r}</span>
      ))}
      <span>Arrows = direct causal effects (no cycles)</span>
    </div>
  );
}

export default function Learn({ mod }: { mod: CourseModule }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
      <div className="space-y-5 min-w-0">
        <div className="card p-6">
          <h3 className="section-title"><Target size={16} /> Learning objectives</h3>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-3">
            {mod.objectives.map((o) => (
              <li key={o} className="flex gap-2 text-sm text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                {o}
              </li>
            ))}
          </ul>
        </div>

        {(DIAGRAMS[mod.id] ?? []).map((dg) => (
          <figure key={dg.id} className="card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="section-title"><Network size={16} /> {dg.title}</h3>
              <span className="text-[11px] uppercase tracking-wider text-slate-500">{dg.kind}</span>
            </div>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 px-2 py-3">
              <SystemDiagram diagram={dg} />
            </div>
            {(dg.kind === "Causal loop diagram" || dg.kind === "Stock-and-flow diagram") && <DiagramLegend sfd={dg.kind === "Stock-and-flow diagram"} />}
            {dg.kind === "Causal DAG" && <DagLegend />}
            <figcaption className="mt-4 grid gap-2.5 md:grid-cols-2">
              {dg.explanation.map((e) => (
                <p key={e.slice(0, 30)} className="text-sm leading-relaxed text-slate-300 flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  {e}
                </p>
              ))}
            </figcaption>
          </figure>
        ))}

        {mod.sections.map((s, i) => (
          <article key={s.heading} className="card p-6">
            <h3 className="section-title"><BookOpen size={16} /> {String.fromCharCode(65 + i)}. {s.heading}</h3>
            <div className="prose-dee mt-3">
              {s.body.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              )}
            </div>
          </article>
        ))}

        <div className="card p-6">
          <h3 className="section-title"><MessageSquare size={16} /> Discussion questions</h3>
          <ol className="list-decimal list-inside space-y-2 mt-3 text-sm text-slate-300">
            {mod.discussion.map((d) => <li key={d}>{d}</li>)}
          </ol>
        </div>
      </div>

      <aside className="space-y-5">
        <div className="card p-5">
          <h3 className="section-title"><Sigma size={16} /> Model equations</h3>
          <div className="space-y-3 mt-3">
            {mod.equations.map((e) => (
              <div key={e.label}>
                <div className="text-xs text-slate-400 mb-1">{e.label}</div>
                <div className="formula">{e.formula}</div>
                {e.note && <div className="text-[11px] text-slate-500 mt-1">{e.note}</div>}
              </div>
            ))}
          </div>
        </div>

        {mod.loops.length > 0 && (
          <div className="card p-5">
            <h3 className="section-title"><Repeat size={16} /> Key mechanisms</h3>
            <div className="space-y-3 mt-3">
              {mod.loops.map((l) => (
                <div key={l.name}>
                  <div className="text-sm text-slate-200">{l.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5 leading-relaxed">{l.chain}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card p-5">
          <h3 className="section-title">Key terms</h3>
          <dl className="space-y-2.5 mt-3">
            {mod.keyTerms.map((k) => (
              <div key={k.term}>
                <dt className="text-sm text-slate-200">{k.term}</dt>
                <dd className="text-xs text-slate-400">{k.def}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="card p-5">
          <h3 className="section-title"><Library size={16} /> Readings</h3>
          <ul className="space-y-2.5 mt-3">
            {mod.readings.map((r) => (
              <li key={r.cite} className="text-xs text-slate-300 leading-relaxed">
                {r.cite}
                {r.note && <span className="block text-slate-500 mt-0.5">{r.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
