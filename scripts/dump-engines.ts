// Prints every module x (defaults + presets) result from the TypeScript engine as JSON.
import { MODELS, SPECS } from "../lib/engines";

const out: Record<string, Record<string, unknown>> = {};
for (const id of Object.keys(MODELS)) {
  out[id] = { __defaults: MODELS[id]() };
  for (const [name, params] of Object.entries(SPECS[id].presets)) out[id][name] = MODELS[id](params);
}
process.stdout.write(JSON.stringify(out));
