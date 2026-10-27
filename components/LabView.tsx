"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import type { CourseModule } from "@/lib/course/types";

function CodeBlock({ title, code, lang = "python" }: { title: string; code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/60">
        <span className="font-mono text-xs text-slate-400">{title}</span>
        <button onClick={copy} className="btn-ghost text-xs">
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed text-slate-300 max-h-[560px]" data-lang={lang}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function LabView({ mod, labCode, modelCode }: { mod: CourseModule; labCode: string; modelCode: string }) {
  const setup = `# Windows (PowerShell), from the project folder
python -m venv .venv
.venv\\Scripts\\Activate.ps1
pip install -r requirements-dev.txt
python labs/${mod.labFile}`;

  return (
    <div className="space-y-5">
      <div className="card p-6">
        <h3 className="section-title"><Terminal size={16} /> Python lab {mod.number}</h3>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl">
          The lab runs the same model that powers this page, puts the results in a <b>pandas</b> table, answers a few
          questions with simple calculations and saves charts with matplotlib to <code className="inline-code">labs/output/</code>.
          No prior Python experience is needed — the exercises are in the comment block at the top of the file.
        </p>
        <pre className="formula mt-4 whitespace-pre overflow-x-auto">{setup}</pre>
        <p className="text-xs text-slate-500 mt-2">
          macOS/Linux: <code className="inline-code">source .venv/bin/activate</code>. If PowerShell blocks activation, run
          {" "}<code className="inline-code">Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code> once.
        </p>
      </div>
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        <CodeBlock title={`labs/${mod.labFile}`} code={labCode} />
        <CodeBlock title={`engine/models.py — ${mod.id}()`} code={modelCode} />
      </div>
    </div>
  );
}
