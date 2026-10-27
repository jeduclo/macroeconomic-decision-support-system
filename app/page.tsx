import { readFileSync } from "node:fs";
import path from "node:path";
import CourseApp from "@/components/CourseApp";
import { MODULES } from "@/lib/course";

export const dynamic = "force-static";

/** Read the Python lab scripts and model source at build time so the Lab tab always shows the real code. */
function loadCode() {
  const root = process.cwd();
  const models = readFileSync(path.join(root, "engine", "models.py"), "utf8");
  const out: Record<string, { lab: string; model: string }> = {};
  for (const m of MODULES) {
    const start = models.indexOf(`# --- BEGIN ${m.id} ---`);
    const end = models.indexOf(`# --- END ${m.id} ---`);
    const model = start >= 0 && end > start ? models.slice(start, end).split("\n").slice(1).join("\n").trim() : "";
    let lab = "";
    try {
      lab = readFileSync(path.join(root, "labs", m.labFile), "utf8");
    } catch {
      lab = `# labs/${m.labFile} not found`;
    }
    out[m.id] = { lab, model };
  }
  return out;
}

export default function Page() {
  return <CourseApp code={loadCode()} />;
}
