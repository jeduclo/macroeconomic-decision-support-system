"""
FastAPI service for MacroLab — Principles of Macroeconomics simulators.

Local dev:   python -m uvicorn api.index:app --reload --port 8000
             (npm run dev starts this automatically alongside Next.js)
On Vercel:   this file is deployed as a Python serverless function. Next.js
             rewrites /api/py/* to it (see next.config.mjs).

Interactive docs: /api/py/docs
"""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Make the project root importable both locally and on Vercel.
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from engine.models import SPECS, run, with_defaults  # noqa: E402

app = FastAPI(
    title="MacroLab API",
    description="Textbook macroeconomic models (GDP, unemployment, inflation, growth, AE, AD/AS, IS-LM, fiscal and monetary policy) for MacroLab, Modules 1-10.",
    version="1.0.0",
    docs_url="/api/py/docs",
    openapi_url="/api/py/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulationRequest(BaseModel):
    params: Dict[str, Any] = Field(default_factory=dict, description="Parameter overrides; missing keys use defaults.")


class SimulationResponse(BaseModel):
    module: str
    engine: str = "python"
    params: Dict[str, Any]
    series: List[Dict[str, Optional[float]]]     
    extra: Dict[str, Any]


def _round(obj: Any, digits: int = 5) -> Any:
    if isinstance(obj, float):
        return round(obj, digits)
    if isinstance(obj, list):
        return [_round(x, digits) for x in obj]
    if isinstance(obj, dict):
        return {k: _round(v, digits) for k, v in obj.items()}
    return obj


def validate_params(module_id: str, params: Dict[str, Any]) -> Dict[str, Any]:
    """Check every supplied parameter against engine/specs.json."""
    if module_id not in SPECS:
        raise HTTPException(status_code=404, detail=f"Unknown module '{module_id}'")
    specs = {p["key"]: p for p in SPECS[module_id]["params"]}
    errors = []
    clean: Dict[str, Any] = {}
    for key, value in params.items():
        spec = specs.get(key)
        if spec is None:
            errors.append(f"'{key}' is not a parameter of {module_id}")
            continue
        if spec["type"] == "range":
            try:
                v = float(value)
            except (TypeError, ValueError):
                errors.append(f"'{key}' must be a number")
                continue
            if not (spec["min"] <= v <= spec["max"]):
                errors.append(f"'{key}'={v} outside [{spec['min']}, {spec['max']}]")
                continue
            clean[key] = v
        elif spec["type"] == "bool":
            clean[key] = bool(value)
        elif spec["type"] == "choice":
            if value not in spec["options"]:
                errors.append(f"'{key}' must be one of {spec['options']}")
                continue
            clean[key] = value
    if errors:
        raise HTTPException(status_code=422, detail=errors)
    return with_defaults(module_id, clean)


@app.get("/api/py/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "engine": "python", "python": sys.version.split()[0]}


@app.get("/api/py/modules")
def list_modules() -> Dict[str, Any]:
    """Parameter schemas (ranges, defaults, presets) for every module."""
    return SPECS


@app.post("/api/py/simulate/{module_id}", response_model=SimulationResponse)
def simulate(module_id: str, body: SimulationRequest) -> SimulationResponse:
    params = validate_params(module_id, body.params)
    result = run(module_id, params)
    return SimulationResponse(
        module=module_id,
        params=params,
        series=_round(result["series"]),
        extra=_round(result["extra"]),
    )


@app.get("/api/py/policy_lab")
def policy_lab(
    scenario: str = Query("demandCollapse", description="demandCollapse | oilShock | financialCrisis"),
    fiscal: float = Query(1.5, ge=0, le=4, description="Fiscal stimulus (% of GDP per year)"),
    fiscalLag: float = Query(2, ge=0, le=6, description="Quarters before stimulus starts"),
    phiPi: float = Query(1.5, ge=0, le=3, description="Taylor-rule response to inflation"),
    phiY: float = Query(0.5, ge=0, le=1.5, description="Taylor-rule response to the output gap"),
    credibility: float = Query(0.6, ge=0, le=1, description="Central-bank credibility (0-1)"),
) -> Dict[str, Any]:
    """Module 10 capstone: score a fiscal-monetary policy mix against doing nothing."""
    params = validate_params("m10", {"scenario": scenario, "fiscal": fiscal, "fiscalLag": fiscalLag,
                                     "phiPi": phiPi, "phiY": phiY, "credibility": credibility})
    result = run("m10", params)
    s = result["series"]
    summary = {
        "loss": result["extra"]["loss"],
        "loss_do_nothing": result["extra"]["lossNone"],
        "peak_unemployment": max(r["unemployment"] for r in s),
        "peak_inflation": max(r["inflation"] for r in s),
        "ending_debt": s[-1]["debt"],
        "ending_debt_do_nothing": s[-1]["debtNone"],
    }
    return {"params": params, "series": _round(s), "summary": _round(summary)}
