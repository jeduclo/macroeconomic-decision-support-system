"use client";

import { useState } from "react";
import { CircleCheck, CircleX, RotateCcw } from "lucide-react";
import type { CourseModule } from "@/lib/course/types";

export default function Quiz({ mod, onScore }: { mod: CourseModule; onScore: (score: number, total: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const total = mod.quiz.length;
  const score = mod.quiz.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
  const complete = Object.keys(answers).length === total;

  const submit = () => {
    setSubmitted(true);
    onScore(score, total);
  };
  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl space-y-4">
      {mod.quiz.map((q, i) => (
        <div key={q.q} className="card p-5">
          <div className="text-sm font-medium text-slate-100 mb-3">
            <span className="text-[var(--accent)] font-mono mr-2">Q{i + 1}</span>
            {q.q}
          </div>
          <div className="space-y-2">
            {q.options.map((o, j) => {
              const chosen = answers[i] === j;
              const correct = j === q.answer;
              let cls = "border-slate-800 hover:border-slate-600";
              if (chosen && !submitted) cls = "border-[var(--accent)] bg-[var(--accent)]/10";
              if (submitted && correct) cls = "border-emerald-500/60 bg-emerald-500/10";
              if (submitted && chosen && !correct) cls = "border-rose-500/60 bg-rose-500/10";
              return (
                <button key={o} disabled={submitted} onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                  className={`w-full text-left rounded-lg border px-3.5 py-2.5 text-sm text-slate-300 transition flex items-center gap-2 ${cls}`}>
                  {submitted && correct && <CircleCheck size={15} className="text-emerald-400 shrink-0" />}
                  {submitted && chosen && !correct && <CircleX size={15} className="text-rose-400 shrink-0" />}
                  {o}
                </button>
              );
            })}
          </div>
          {submitted && <p className="text-xs text-slate-400 mt-3 leading-relaxed">{q.explain}</p>}
        </div>
      ))}
      <div className="flex items-center gap-4">
        {!submitted ? (
          <button onClick={submit} disabled={!complete} className="btn-accent disabled:opacity-40">
            Submit answers
          </button>
        ) : (
          <>
            <div className={`font-mono text-lg ${score >= Math.ceil(total * 0.8) ? "text-emerald-300" : "text-amber-300"}`}>
              Score {score}/{total} {score >= Math.ceil(total * 0.8) ? "— module complete ✓" : "— 80 % needed to complete"}
            </div>
            <button onClick={reset} className="btn-ghost border border-slate-700"><RotateCcw size={14} /> Retry</button>
          </>
        )}
      </div>
    </div>
  );
}
