"""
Shared helpers for the MacroLab Python labs.

    pip install -r requirements-dev.txt
    python labs/module_01_gdp.py

Each lab:
  1. runs the module's model (engine/models.py — the same code the website uses)
  2. puts the results in a pandas DataFrame (a table)
  3. answers a few questions with simple calculations
  4. saves charts to labs/output/
  5. optionally downloads real data from FRED (US) — falls back gracefully if offline
"""

from __future__ import annotations

import io
import sys
from pathlib import Path
from typing import Dict, Optional

import matplotlib

matplotlib.use("Agg")  # save charts to files; works on Windows without a display
import matplotlib.pyplot as plt
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from engine.models import SPECS, run  # noqa: E402

OUTPUT = Path(__file__).resolve().parent / "output"
OUTPUT.mkdir(exist_ok=True)

COLORS = ["#0ea5e9", "#f59e0b", "#e11d48", "#10b981", "#8b5cf6", "#64748b"]


def simulate(module_id: str, params: Optional[Dict] = None, scenario: str = "custom") -> pd.DataFrame:
    """Run the model once and return its main time series as a DataFrame."""
    df = pd.DataFrame(run(module_id, params)["series"])
    df.insert(0, "scenario", scenario)
    return df


def extra(module_id: str, params: Optional[Dict] = None) -> Dict:
    """Return the model's extra outputs (equilibria, multipliers, curves ...)."""
    return run(module_id, params)["extra"]


def presets(module_id: str) -> Dict[str, Dict]:
    """The preset scenarios shown in the website's Simulate tab."""
    return SPECS[module_id]["presets"]


def run_presets(module_id: str) -> pd.DataFrame:
    """Run every preset and stack the results in one table."""
    frames = [simulate(module_id, p, name) for name, p in presets(module_id).items()]
    return pd.concat(frames, ignore_index=True)


def fred(series_id: str, start: str = "1990-01-01") -> Optional[pd.Series]:
    """
    Download a data series from FRED (Federal Reserve Bank of St. Louis), no API key needed.
    Examples: GDPC1 (US real GDP), UNRATE (US unemployment), CPIAUCSL (US CPI),
              FEDFUNDS (fed funds rate), LRUNTTTTCAM156S (Canada unemployment).
    Returns None if you are offline, so labs still run.
    """
    url = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}"
    try:
        import requests

        text = requests.get(url, timeout=15).text
        df = pd.read_csv(io.StringIO(text))
        df.columns = ["date", series_id]
        df["date"] = pd.to_datetime(df["date"])
        s = pd.to_numeric(df.set_index("date")[series_id], errors="coerce").dropna()
        return s[s.index >= start]
    except Exception as exc:  # noqa: BLE001
        print(f"  (could not download {series_id} from FRED: {exc.__class__.__name__}; skipping real-data part)")
        return None


def save(fig, name: str) -> Path:
    """Save a matplotlib figure into labs/output/ and close it."""
    path = OUTPUT / name
    fig.tight_layout()
    fig.savefig(path, dpi=130)
    plt.close(fig)
    print(f"  chart saved → {path.relative_to(ROOT)}")
    return path


def heading(text: str) -> None:
    print("\n" + text)
    print("-" * len(text))
