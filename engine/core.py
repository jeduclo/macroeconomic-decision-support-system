"""Shared constants and helpers for engine/models.py (Modules 1-10) and engine/advanced.py (11-20)."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict

DT = 0.25                     # integration step (years, or months for monthly models)
STEPS_PER_YEAR = int(round(1 / DT))

SPECS: Dict[str, Any] = json.loads((Path(__file__).parent / "specs.json").read_text(encoding="utf-8"))


def clamp(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))


def defaults(module_id: str) -> Dict[str, Any]:
    return {p["key"]: p["default"] for p in SPECS[module_id]["params"]}


def with_defaults(module_id: str, params: Dict[str, Any] | None) -> Dict[str, Any]:
    merged = defaults(module_id)
    for k, v in (params or {}).items():
        if k in merged and v is not None:
            merged[k] = v
    return merged
