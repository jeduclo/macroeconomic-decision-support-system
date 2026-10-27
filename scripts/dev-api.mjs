// Starts the FastAPI dev server on port 8000 (used by `npm run dev`).
// Finds the right Python automatically: $PYTHON, then .venv / venv, then the system Python.
import { spawnSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const win = process.platform === "win32";
const root = process.cwd();

const candidates = [
  process.env.PYTHON && [process.env.PYTHON],
  [path.join(root, ".venv", win ? "Scripts/python.exe" : "bin/python")],
  [path.join(root, "venv", win ? "Scripts/python.exe" : "bin/python")],
  win ? ["py", "-3"] : null,
  ["python"],
  ["python3"],
].filter(Boolean);

function works(cmd) {
  if (path.isAbsolute(cmd[0]) && !existsSync(cmd[0])) return false;
  const r = spawnSync(cmd[0], [...cmd.slice(1), "-c", "import sys; print(sys.version_info[:2] >= (3, 10))"], { encoding: "utf8" });
  return r.status === 0 && r.stdout.trim() === "True";
}

const py = candidates.find(works);
if (!py) {
  console.error("\n[api] No Python 3.10+ found. Install Python from python.org (tick 'Add to PATH'), then:");
  console.error("      python -m venv .venv  &&  .venv\\Scripts\\Activate.ps1  &&  pip install -r requirements-dev.txt\n");
  console.error("[api] The website still works using the browser engine.\n");
  process.exit(0);
}

const check = spawnSync(py[0], [...py.slice(1), "-c", "import fastapi, uvicorn"], { encoding: "utf8" });
if (check.status !== 0) {
  const shown = py.join(" ");
  console.error(`\n[api] Python found (${shown}) but FastAPI/uvicorn are not installed in it. Run:`);
  console.error(`      "${py[0]}" ${py.slice(1).join(" ")} -m pip install -r requirements-dev.txt`);
  console.error("[api] then restart `npm run dev`. The website still works using the browser engine.\n");
  process.exit(0);
}

console.log(`[api] Starting FastAPI with ${py.join(" ")} on http://127.0.0.1:8000`);
const child = spawn(py[0], [...py.slice(1), "-m", "uvicorn", "api.index:app", "--reload", "--port", "8000"], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
