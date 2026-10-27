"""Behavioural tests for the MacroLab models and the API.   Run:  pytest -q"""
import math
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from api.index import app  # noqa: E402
from engine.models import MODELS, SPECS, run  # noqa: E402

client = TestClient(app)
TIME_MODELS = {"m01", "m02", "m03", "m04", "m06", "m08", "m09", "m10"}


def ex(module_id, params=None):
    return run(module_id, params)["extra"]


def series(module_id, params=None):
    return run(module_id, params)["series"]


@pytest.mark.parametrize("module_id", sorted(MODELS))
def test_every_preset_runs_and_is_finite(module_id):
    for name, params in SPECS[module_id]["presets"].items():
        s = series(module_id, params)
        assert len(s) > 0, name
        if module_id in TIME_MODELS:
            assert len(s) == SPECS[module_id]["years"] + 1, name
        for row in s:
            for key, value in row.items():
                assert math.isfinite(value), f"{module_id}/{name}: {key}={value}"


def test_m01_expenditure_identity():
    p = {"C": 1300, "I": 400, "G": 450, "X": 650, "M": 700}
    assert ex("m01", p)["gdp"] == pytest.approx(1300 + 400 + 450 + 650 - 700)


def test_m01_real_growth_excludes_inflation():
    s = series("m01", {"inflation": 0.08, "realGrowth": 0.0})
    assert s[-1]["real"] == pytest.approx(s[0]["real"])
    assert s[-1]["nominal"] > 2 * s[0]["nominal"] * 0.99


def test_m02_natural_rate_formula_and_recession():
    e = ex("m02", {"separation": 0.015, "jobFinding": 0.25})
    assert e["naturalRate"] == pytest.approx(100 * 0.015 / 0.265, rel=1e-6)
    s = series("m02", SPECS["m02"]["presets"]["Great Recession style"])
    assert max(r["unemploymentRate"] for r in s) > e["naturalRate"] + 3
    assert abs(s[-1]["unemploymentRate"] - s[-1]["naturalRate"]) < 1


def test_m03_quantity_theory():
    e = ex("m03", {"moneyGrowth": 0.06, "realGrowth": 0.02, "velocity": 0.0})
    assert e["inflation"] == pytest.approx(4.0, abs=0.15)


def test_m04_saving_raises_level_not_long_run_growth():
    lo, hi = series("m04", {"saving": 0.2}), series("m04", {"saving": 0.4})
    assert hi[-1]["rich"] > lo[-1]["rich"]
    assert hi[-1]["growthRich"] == pytest.approx(lo[-1]["growthRich"], abs=0.05)
    assert lo[1]["growthPoor"] > lo[1]["growthRich"]          # convergence


def test_m05_multiplier():
    e = ex("m05", {"mpc": 0.75, "shock": 50})
    assert e["multiplier"] == pytest.approx(4.0)
    assert e["y1"] - e["y0"] == pytest.approx(200.0)


def test_m06_demand_shock_self_corrects():
    e = ex("m06", SPECS["m06"]["presets"]["Demand fall (recession)"])
    assert e["srY"] < e["yp"] and e["srP"] < 100
    assert abs(e["lrY"] - e["yp"]) < 5 and e["lrP"] < e["srP"]


def test_m06_oil_shock_is_stagflation():
    e = ex("m06", SPECS["m06"]["presets"]["Oil price shock"])
    assert e["srY"] < 1000 and e["srP"] > 100


def test_m07_crowding_out_and_policy_mix():
    f = ex("m07", {"dG": 100, "dM": 0})
    assert f["r1"] > f["r0"] and 0 < f["y1"] - f["y0"] < f["crossEffect"]
    assert f["crowdingOut"] == pytest.approx(100 * (1 - (f["y1"] - f["y0"]) / f["crossEffect"]), abs=0.5)
    mix = ex("m07", SPECS["m07"]["presets"]["Policy mix (both)"])
    assert abs(mix["r1"] - mix["r0"]) < 0.2 and mix["crowdingOut"] < 5


def test_m08_timely_beats_late_and_tax_multiplier_smaller():
    def avg_abs(name):
        s = series("m08", SPECS["m08"]["presets"][name])
        return sum(abs(r["gapPolicy"]) for r in s) / len(s)
    assert avg_abs("Timely stimulus") < avg_abs("No policy") < avg_abs("Late stimulus")
    e = ex("m08")
    assert e["kT"] < e["kG"]


def test_m08_r_minus_g():
    low = ex("m08", {"interest": 0.02, "growth": 0.05})["debt"][-1]["withStimulus"]
    high = ex("m08", {"interest": 0.06, "growth": 0.02})["debt"][-1]["withStimulus"]
    assert low < 60 < high


def test_m09_policy_response_and_credibility():
    s = series("m09", SPECS["m09"]["presets"]["Demand shock, Taylor rule"])
    assert sum(abs(r["gap"]) for r in s) < 0.8 * sum(abs(r["gapNoResponse"]) for r in s)   # policy acts with a lag
    strong = max(r["inflation"] for r in series("m09", SPECS["m09"]["presets"]["Cost-push shock, credible bank"]))
    weak = max(r["inflation"] for r in series("m09", SPECS["m09"]["presets"]["Cost-push shock, weak credibility"]))
    assert strong < weak


def test_m10_coordinated_policy_beats_doing_nothing():
    e = ex("m10", SPECS["m10"]["presets"]["Demand collapse: coordinated"])
    assert e["loss"] < e["lossNone"]
    hard = ex("m10", SPECS["m10"]["presets"]["Oil shock: fight hard"])["loss"]
    soft = ex("m10", SPECS["m10"]["presets"]["Oil shock: look through"])["loss"]
    assert soft < hard


def test_api_simulate_and_validation():
    r = client.post("/api/py/simulate/m05", json={"params": {"mpc": 0.8}})
    assert r.status_code == 200 and r.json()["extra"]["multiplier"] == pytest.approx(5.0)
    assert client.post("/api/py/simulate/m05", json={"params": {"mpc": 5}}).status_code == 422
    assert client.post("/api/py/simulate/m99", json={"params": {}}).status_code == 404


def test_api_policy_lab():
    r = client.get("/api/py/policy_lab", params={"scenario": "oilShock", "phiPi": 1.1})
    assert r.status_code == 200
    assert r.json()["summary"]["peak_inflation"] > 2
