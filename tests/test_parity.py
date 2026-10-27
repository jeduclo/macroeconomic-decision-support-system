"""TypeScript (lib/engines.ts) vs Python (engine/models.py) parity.

    npm run test:parity
(writes tests/.ts_output.json with tsx, then runs this file)
"""
import json
import math
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from engine.models import MODELS, SPECS, run  # noqa: E402

TS_FILE = Path(__file__).parent / ".ts_output.json"
pytestmark = pytest.mark.skipif(not TS_FILE.exists(), reason="run `npm run test:parity` to generate TS output")


def close(a, b, tol=1e-6):
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return math.isclose(a, b, rel_tol=tol, abs_tol=tol)
    return a == b


def compare(py, ts, path):
    if isinstance(py, dict):
        assert set(py) == set(ts), f"{path}: keys differ {set(py) ^ set(ts)}"
        for k in py:
            compare(py[k], ts[k], f"{path}.{k}")
    elif isinstance(py, list):
        assert len(py) == len(ts), f"{path}: length {len(py)} vs {len(ts)}"
        for i, (a, b) in enumerate(zip(py, ts)):
            compare(a, b, f"{path}[{i}]")
    else:
        assert close(py, ts), f"{path}: python={py} ts={ts}"


@pytest.mark.parametrize("module_id", sorted(MODELS))
def test_parity(module_id):
    ts = json.loads(TS_FILE.read_text())[module_id]
    compare(run(module_id), ts["__defaults"], f"{module_id}/defaults")
    for name, params in SPECS[module_id]["presets"].items():
        compare(run(module_id, params), ts[name], f"{module_id}/{name}")
