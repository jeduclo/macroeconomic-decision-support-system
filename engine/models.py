"""
MacroLab — textbook macroeconomic models for Modules 1-10.

These are the classic introductory models (no system dynamics): national
accounts, labour-market flows, the quantity theory, the Solow growth model,
the Keynesian cross, AD/AS, IS/LM, fiscal multipliers and a simple
monetary-transmission model with a Taylor rule.

Pure Python (no numpy) so the same file runs in the Vercel API function.
Every function is ported 1:1 to lib/engines.ts; tests/test_parity.py checks
that both give identical results.
"""

from __future__ import annotations

import math
from typing import Any, Callable, Dict, List

from .core import SPECS, clamp, with_defaults  # noqa: F401

Row = Dict[str, float]
Result = Dict[str, Any]


def _grid(lo: float, hi: float, n: int = 60) -> List[float]:
    return [lo + (hi - lo) * i / n for i in range(n + 1)]


# --- BEGIN m01 ---
def m01(params: Dict[str, Any] | None = None) -> Result:
    """Module 1 — GDP: the expenditure approach, nominal vs real GDP and the deflator.

    GDP = C + I + G + (X − M).  Real GDP grows at g; prices at π.
    Nominal GDP = real GDP × price index / 100.  Deflator = nominal / real × 100.
    """
    p = with_defaults("m01", params)
    years = SPECS["m01"]["years"]
    gdp0 = p["C"] + p["I"] + p["G"] + p["X"] - p["M"]
    rows: List[Row] = []
    prev_nom = prev_real = None
    for t in range(years + 1):
        real = gdp0 * (1.0 + p["realGrowth"]) ** t
        price = 100.0 * (1.0 + p["inflation"]) ** t
        nominal = real * price / 100.0
        rows.append({
            "year": float(t), "nominal": nominal, "real": real, "deflator": 100.0 * nominal / real if real else 0.0,
            "nominalGrowth": 100.0 * (nominal / prev_nom - 1.0) if prev_nom else 0.0,
            "realGrowth": 100.0 * (real / prev_real - 1.0) if prev_real else 0.0,
        })
        prev_nom, prev_real = nominal, real
    parts = [("C", p["C"]), ("I", p["I"]), ("G", p["G"]), ("X", p["X"]), ("−M", -p["M"]), ("GDP", gdp0)]
    bars = [{"idx": float(i), "value": v} for i, (_, v) in enumerate(parts)]
    return {"series": rows, "extra": {"bars": bars, "gdp": gdp0, "netExports": p["X"] - p["M"]}}
# --- END m01 ---


# --- BEGIN m02 ---
def m02(params: Dict[str, Any] | None = None) -> Result:
    """Module 2 — Unemployment as stocks and flows.

    Each month: separations = s·E move to unemployment; hires = f·U move to employment.
    Steady state (natural rate): u* = s / (s + f).  A recession lowers f for a while.
    Okun's law: output gap ≈ −okun × (u − u*).
    """
    p = with_defaults("m02", params)
    months = SPECS["m02"]["years"]
    population = 30.0                                   # working-age population, millions
    LF = population * p["participation"]
    s, f = p["separation"], p["jobFinding"]
    u_star = s / (s + f)
    U = u_star * LF
    E = LF - U
    start = 24
    rows: List[Row] = []
    for t in range(months + 1):
        in_recession = start <= t < start + p["length"]
        f_t = f * (1.0 - p["depth"]) if in_recession else f
        u = U / LF
        rows.append({
            "month": float(t), "unemploymentRate": 100.0 * u, "naturalRate": 100.0 * u_star,
            "cyclical": 100.0 * (u - u_star), "employed": E, "unemployed": U,
            "outputGap": -p["okun"] * 100.0 * (u - u_star), "jobFinding": 100.0 * f_t,
        })
        separations = s * E
        hires = f_t * U
        U = U + separations - hires
        E = LF - U
    return {"series": rows, "extra": {"naturalRate": 100.0 * u_star, "laborForce": LF,
                                      "employmentRate": 100.0 * (1 - u_star) * p["participation"]}}
# --- END m02 ---


# --- BEGIN m03 ---
def m03(params: Dict[str, Any] | None = None) -> Result:
    """Module 3 — Inflation: the quantity theory and real vs nominal values.

    Quantity equation  M·V = P·Y  ⇒  inflation ≈ money growth + velocity change − real growth.
    Real wage = nominal wage / price level.  Real interest ≈ nominal rate − inflation (Fisher).
    """
    p = with_defaults("m03", params)
    years = SPECS["m03"]["years"]
    P, W = 100.0, 100.0
    rows: List[Row] = []
    for t in range(years + 1):
        P_next = P * (1.0 + p["moneyGrowth"]) * (1.0 + p["velocity"]) / (1.0 + p["realGrowth"])
        inflation = P_next / P - 1.0
        real_rate = (1.0 + p["nominalRate"]) / (1.0 + inflation) - 1.0
        rows.append({"year": float(t), "priceLevel": P, "inflation": 100.0 * inflation,
                     "nominalWage": W, "realWage": 100.0 * W / P, "realRate": 100.0 * real_rate,
                     "nominalRate": 100.0 * p["nominalRate"]})
        P = P_next
        W = W * (1.0 + p["wageGrowth"])
    infl = rows[0]["inflation"]
    return {"series": rows, "extra": {"inflation": infl, "doubling": 70.0 / infl if infl > 0 else 0.0}}
# --- END m03 ---


# --- BEGIN m04 ---
ALPHA = 1.0 / 3.0


def m04(params: Dict[str, Any] | None = None) -> Result:
    """Module 4 — Economic growth: the Solow model with technology.

    Capital per effective worker k grows when investment s·k^α exceeds the
    'break-even' investment (n + g + δ)·k.  Income per worker = A·k^α, with A growing at g.
    Steady state k* = (s / (n + g + δ))^(1/(1−α)).
    The rich country starts at the baseline steady state; the poor one at poorStart × that capital.
    """
    p = with_defaults("m04", params)
    years = SPECS["m04"]["years"]
    s, n, d, g = p["saving"], p["popGrowth"], p["depreciation"], p["techGrowth"]
    k_star = (s / (n + g + d)) ** (1.0 / (1.0 - ALPHA))
    y_star = k_star ** ALPHA
    # Both countries start from the *baseline* steady state (default parameters), so a change
    # in s, n or g shows up as a transition to a new level.  Rich income per worker in year 0 = 100.
    k_base = (0.25 / (0.01 + 0.015 + 0.05)) ** (1.0 / (1.0 - ALPHA))
    k_rich, k_poor = k_base, p["poorStart"] * k_base
    base = k_base ** ALPHA
    rows: List[Row] = []
    prev_r = prev_p = None
    for t in range(years + 1):
        A = math.exp(g * t)
        y_r = 100.0 * A * k_rich ** ALPHA / base
        y_p = 100.0 * A * k_poor ** ALPHA / base
        rows.append({"year": float(t), "rich": y_r, "poor": y_p, "ratio": 100.0 * y_p / y_r,
                     "growthRich": 100.0 * (y_r / prev_r - 1.0) if prev_r else 100.0 * g,
                     "growthPoor": 100.0 * (y_p / prev_p - 1.0) if prev_p else 0.0})
        prev_r, prev_p = y_r, y_p
        k_rich = k_rich + s * k_rich ** ALPHA - (n + g + d) * k_rich
        k_poor = k_poor + s * k_poor ** ALPHA - (n + g + d) * k_poor
    curve = []
    for k in _grid(0.0, 2.0 * k_star, 50):
        curve.append({"k": k, "investment": s * k ** ALPHA, "breakEven": (n + g + d) * k, "output": k ** ALPHA})
    return {"series": rows, "extra": {"curve": curve, "kStar": k_star, "yStar": y_star, "iStar": s * y_star,
                                      "doubling": 70.0 / (100.0 * g) if g > 0 else 0.0}}
# --- END m04 ---


# --- BEGIN m05 ---
def m05(params: Dict[str, Any] | None = None) -> Result:
    """Module 5 — The aggregate expenditure (Keynesian cross) model.

    Planned spending AE = a + MPC·(Y − T) + I + G + NX.  Equilibrium where AE = Y (the 45° line).
    Multiplier = 1 / (1 − MPC): a change in spending ΔA changes output by ΔA / (1 − MPC).
    """
    p = with_defaults("m05", params)
    b = p["mpc"]
    autonomous = p["autoC"] - b * p["T"] + p["I"] + p["G"] + p["NX"]
    mult = 1.0 / (1.0 - b)
    y0 = autonomous * mult
    y1 = (autonomous + p["shock"]) * mult
    hi = max(y0, y1, p["potential"]) * 1.4
    rows: List[Row] = []
    for Y in _grid(0.0, hi, 60):
        ae0 = autonomous + b * Y
        rows.append({"Y": Y, "line45": Y, "ae0": ae0, "ae1": ae0 + p["shock"]})
    rounds = []
    cum = 0.0
    for k in range(1, 11):
        spend = p["shock"] * b ** (k - 1)
        cum += spend
        rounds.append({"idx": float(k - 1), "spending": spend, "cumulative": cum})
    return {"series": rows, "extra": {"y0": y0, "y1": y1, "multiplier": mult, "rounds": rounds,
                                      "gap": y1 - p["potential"]}}
# --- END m05 ---


# --- BEGIN m06 ---
AD_BASE, AD_SLOPE, P0, YP0 = 1000.0, 5.0, 100.0, 1000.0


def _m06_eq(d: float, pe: float, cost: float, yp: float, s: float):
    """Intersection of AD: P = P0 + (AD_BASE + d − Y)/AD_SLOPE and SRAS: P = pe + s(Y − yp) + cost."""
    y = (P0 - pe - cost + (AD_BASE + d) / AD_SLOPE + s * yp) / (s + 1.0 / AD_SLOPE)
    price = P0 + (AD_BASE + d - y) / AD_SLOPE
    return y, price


def m06(params: Dict[str, Any] | None = None) -> Result:
    """Module 6 — Aggregate demand and aggregate supply.

    AD slopes down, short-run AS (SRAS) slopes up, long-run AS (LRAS) is vertical at
    potential output. After a shock, expected prices and wages adjust over time,
    shifting SRAS until output returns to potential (self-correction).
    """
    p = with_defaults("m06", params)
    periods = SPECS["m06"]["years"]
    d, c, s = p["demandShock"], p["supplyShock"], p["slope"]
    temporary = p["supplyType"] == "temporary"
    yp_old = YP0
    # a permanent cost shock lowers potential output (LRAS shifts left); a temporary one fades
    yp = YP0 + p["potentialShift"] - (0.0 if temporary else c / s)
    yp_capacity = YP0 + p["potentialShift"]          # where SRAS is anchored before expectations adjust
    pe = P0
    path: List[Row] = []
    for t in range(periods + 1):
        cost = c * 0.7 ** t if temporary else c
        y, price = _m06_eq(d, pe, cost, yp_capacity, s)
        path.append({"period": float(t), "output": y, "price": price, "gap": 100.0 * (y - yp) / yp,
                     "expectedPrice": pe, "potential": yp})
        pe = pe + p["adjust"] * (price - pe)          # wages and expected prices catch up
    y_sr, p_sr = path[0]["output"], path[0]["price"]
    y_lr, p_lr = path[-1]["output"], path[-1]["price"]
    last_cost = c * 0.7 ** periods if temporary else c
    curves: List[Row] = []
    for Y in _grid(700.0, 1300.0, 60):
        curves.append({
            "Y": Y,
            "ad0": P0 + (AD_BASE - Y) / AD_SLOPE,
            "ad1": P0 + (AD_BASE + d - Y) / AD_SLOPE,
            "sras0": P0 + s * (Y - yp_old),
            "sras1": P0 + s * (Y - yp_capacity) + c,
            "srasLR": path[-1]["expectedPrice"] + s * (Y - yp_capacity) + last_cost,
        })
    return {"series": path, "extra": {"curves": curves, "yp": yp, "ypOld": yp_old, "srY": y_sr, "srP": p_sr,
                                      "lrY": y_lr, "lrP": p_lr}}
# --- END m06 ---


# --- BEGIN m07 ---
A_AUTO, I0, MPC7, K_MONEY = 100.0, 300.0, 0.75, 0.5


def _m07_eq(G: float, T: float, M: float, d: float, h: float):
    autonomous = A_AUTO - MPC7 * T + I0 + G
    y = (autonomous + d * M / h) / ((1.0 - MPC7) + d * K_MONEY / h)
    r = (K_MONEY * y - M) / h
    return y, r


def m07(params: Dict[str, Any] | None = None) -> Result:
    """Module 7 — The IS-LM model.

    IS (goods market): Y = [a − MPC·T + I0 − d·r + G] / (1 − MPC)  → slopes down in (Y, r).
    LM (money market): M = k·Y − h·r                                → slopes up.
    Fiscal policy shifts IS; monetary policy shifts LM. Higher r 'crowds out' investment.
    """
    p = with_defaults("m07", params)
    d, h = p["investSens"], p["moneySens"]
    y0, r0 = _m07_eq(p["G"], p["T"], p["M"], d, h)
    y1, r1 = _m07_eq(p["G"] + p["dG"], p["T"], p["M"] + p["dM"], d, h)
    cross = p["dG"] / (1.0 - MPC7)                          # Keynesian-cross effect (r fixed)
    lo, hi = min(y0, y1) * 0.6, max(y0, y1) * 1.4
    rows: List[Row] = []
    for Y in _grid(lo, hi, 60):
        is0 = (A_AUTO - MPC7 * p["T"] + I0 + p["G"] - (1.0 - MPC7) * Y) / d
        is1 = (A_AUTO - MPC7 * p["T"] + I0 + p["G"] + p["dG"] - (1.0 - MPC7) * Y) / d
        lm0 = (K_MONEY * Y - p["M"]) / h
        lm1 = (K_MONEY * Y - p["M"] - p["dM"]) / h
        rows.append({"Y": Y, "is0": is0, "is1": is1, "lm0": lm0, "lm1": lm1})
    crowd = min(100.0, 100.0 * max(0.0, d * (r1 - r0)) / (1.0 - MPC7) / cross) if cross > 0 else 0.0
    return {"series": rows, "extra": {"y0": y0, "r0": r0, "y1": y1, "r1": r1, "crossEffect": cross,
                                      "crowdingOut": crowd, "investmentChange": -d * (r1 - r0)}}
# --- END m07 ---


# --- BEGIN m08 ---
def m08(params: Dict[str, Any] | None = None) -> Result:
    """Module 8 — Fiscal policy: multipliers, lags, deficits and debt.

    Spending multiplier = (1 − crowding) / (1 − MPC)   (capped at 4 for realism)
    Tax multiplier      = MPC × spending multiplier      (smaller: part of a tax cut is saved)
    Debt ratio: d(t+1) = d(t)·(1 + i)/(1 + g) + deficit(t)
    """
    p = with_defaults("m08", params)
    quarters = SPECS["m08"]["years"]
    kG = min(4.0, (1.0 - p["crowding"]) / (1.0 - p["mpc"]))
    kT = p["mpc"] * kG
    start, end = int(p["lag"]), int(p["lag"]) + int(p["duration"])
    rows: List[Row] = []
    for q in range(quarters + 1):
        base = p["recession"] * 0.85 ** q                     # the recession fades on its own
        active = start <= q < end
        G_t = p["spending"] if active else 0.0
        T_t = p["taxCut"] if active else 0.0
        effect = kG * G_t + kT * T_t
        rows.append({"quarter": float(q), "gapNoPolicy": base, "gapPolicy": base + effect,
                     "stimulus": G_t + T_t, "effect": effect})
    # Debt path (annual): stimulus adds to the deficit in the year(s) it is spent
    cost_by_year = [0.0] * 31
    for q in range(start, end):
        cost_by_year[q // 4] += (p["spending"] + p["taxCut"]) / 4.0
    debt_rows: List[Row] = []
    d0 = d1 = p["debt0"]
    for y in range(31):
        debt_rows.append({"year": float(y), "withStimulus": d1, "withoutStimulus": d0})
        rec_deficit = -p["recession"] * 0.5 * 0.85 ** (4 * y) if y < 3 else 0.0   # automatic stabilisers
        factor = (1.0 + p["interest"]) / (1.0 + p["growth"])
        d0 = d0 * factor + rec_deficit
        d1 = d1 * factor + rec_deficit + cost_by_year[y]
    saved = sum(r["gapPolicy"] - r["gapNoPolicy"] for r in rows) / 4.0
    return {"series": rows, "extra": {"debt": debt_rows, "kG": kG, "kT": kT, "balanced": kG - kT,
                                      "outputGained": saved}}
# --- END m08 ---


# --- BEGIN m09 ---
PI_TARGET, R_NEUTRAL = 2.0, 2.0


def _transmission(p: Dict[str, Any], quarters: int, respond: bool, demand: float, cost: float,
                  fiscal: List[float] | None = None, impaired: float = 1.0) -> List[Row]:
    """Quarterly economy with a Taylor rule and three transmission channels.

    output gap  = demand shock + fiscal effect + accumulated effect of interest rates
    inflation   = expected inflation + 0.3 × gap + cost-push shock
    expectations = credibility × target + (1 − credibility) × last quarter's inflation
    """
    pi_prev = PI_TARGET
    policy_effect = 0.0
    market = R_NEUTRAL + PI_TARGET
    real_hist: List[float] = []
    out: List[Row] = []
    for q in range(quarters + 1):
        demand_shock = demand * 0.85 ** (q - 1) if q >= 1 else 0.0
        cost_push = cost * 0.6 ** (q - 1) if q >= 1 else 0.0
        f = fiscal[q] if fiscal is not None else 0.0
        gap = demand_shock + f + policy_effect
        exp_pi = p["credibility"] * PI_TARGET + (1.0 - p["credibility"]) * pi_prev
        pi = exp_pi + 0.3 * gap + cost_push
        if respond:
            policy = R_NEUTRAL + PI_TARGET + p["phiPi"] * (pi - PI_TARGET) + p["phiY"] * gap
        else:
            policy = R_NEUTRAL + PI_TARGET
        policy = max(0.0, policy)                                   # zero lower bound
        market = market + p["passThrough"] * impaired * (policy - market)
        real = market - exp_pi
        real_hist.append(real)
        lag = int(p["lag"])
        lagged = real_hist[-1 - lag] if len(real_hist) > lag else R_NEUTRAL
        dev = lagged - R_NEUTRAL
        ch_rate, ch_fx, ch_wealth = -0.12 * dev, -0.05 * dev, -0.03 * dev
        out.append({"quarter": float(q), "policyRate": policy, "marketRate": market, "realRate": real,
                    "inflation": pi, "expected": exp_pi, "gap": gap,
                    "chRate": ch_rate, "chFx": ch_fx, "chWealth": ch_wealth, "fiscal": f})
        policy_effect = 0.8 * policy_effect + ch_rate + ch_fx + ch_wealth
        pi_prev = pi
    return out


def m09(params: Dict[str, Any] | None = None) -> Result:
    """Module 9 — Monetary policy and the transmission mechanism.

    Policy rate (Taylor rule): i = r* + π* + φπ(π − π*) + φy·gap   (≥ 0)
    → market rates (pass-through) → real rate → spending via the interest-rate,
    exchange-rate and wealth channels (with a lag) → output gap → inflation
    (Phillips curve with expectations anchored by credibility).
    """
    p = with_defaults("m09", params)
    quarters = SPECS["m09"]["years"]
    demand = -p["shockSize"] if p["shockType"] == "demand" else 0.0
    cost = p["shockSize"] if p["shockType"] == "costPush" else 0.0
    pol = _transmission(p, quarters, True, demand, cost)
    none = _transmission(p, quarters, False, demand, cost)
    rows: List[Row] = []
    for a, b in zip(pol, none):
        rows.append({**a, "inflationNoResponse": b["inflation"], "gapNoResponse": b["gap"]})
    channels = [
        {"idx": 0.0, "value": sum(r["chRate"] for r in pol)},
        {"idx": 1.0, "value": sum(r["chFx"] for r in pol)},
        {"idx": 2.0, "value": sum(r["chWealth"] for r in pol)},
    ]
    return {"series": rows, "extra": {"channels": channels}}
# --- END m09 ---


# --- BEGIN m10 ---
SCENARIOS = {
    "demandCollapse": {"demand": -3.0, "cost": 0.0, "impaired": 1.0},
    "oilShock": {"demand": -0.5, "cost": 3.0, "impaired": 1.0},
    "financialCrisis": {"demand": -4.0, "cost": 0.0, "impaired": 0.4},
}


def m10(params: Dict[str, Any] | None = None) -> Result:
    """Module 10 — Capstone policy lab: fiscal + monetary responses to a crisis.

    Re-uses the Module 9 economy, adds a fiscal stimulus (multiplier 1.2, with a lag)
    and scores outcomes with a loss function: average of gap² + (π − 2)².
    Unemployment via Okun's law: u = 6 − gap / 2.
    """
    p = with_defaults("m10", params)
    quarters = SPECS["m10"]["years"]
    sc = SCENARIOS[p["scenario"]]
    base_p = {**p, "lag": 3, "passThrough": 0.7}
    start = int(p["fiscalLag"])
    fiscal = [(1.2 * p["fiscal"] * 0.25 if start <= q < start + 6 else 0.0) for q in range(quarters + 1)]
    mix = _transmission(base_p, quarters, True, sc["demand"], sc["cost"], fiscal, sc["impaired"])
    none_p = {**base_p, "phiPi": 0.0, "phiY": 0.0}
    none = _transmission(none_p, quarters, False, sc["demand"], sc["cost"], None, sc["impaired"])
    rows: List[Row] = []
    debt, debt_none = 60.0, 60.0
    for a, b in zip(mix, none):
        q = int(a["quarter"])
        debt += 0.25 * (p["fiscal"] if start <= q < start + 6 else 0.0) - 0.1 * min(0.0, a["gap"]) * 0.25
        debt_none += -0.1 * min(0.0, b["gap"]) * 0.25
        rows.append({"quarter": a["quarter"], "gap": a["gap"], "gapNone": b["gap"],
                     "inflation": a["inflation"], "inflationNone": b["inflation"],
                     "policyRate": a["policyRate"], "unemployment": 6.0 - a["gap"] / 2.0,
                     "unemploymentNone": 6.0 - b["gap"] / 2.0, "debt": debt, "debtNone": debt_none})
    loss = sum(r["gap"] ** 2 + (r["inflation"] - PI_TARGET) ** 2 for r in rows) / len(rows)
    loss_none = sum(r["gapNone"] ** 2 + (r["inflationNone"] - PI_TARGET) ** 2 for r in rows) / len(rows)
    return {"series": rows, "extra": {"loss": loss, "lossNone": loss_none}}
# --- END m10 ---


MODELS: Dict[str, Callable[[Dict[str, Any] | None], Result]] = {
    "m01": m01, "m02": m02, "m03": m03, "m04": m04, "m05": m05,
    "m06": m06, "m07": m07, "m08": m08, "m09": m09, "m10": m10,
}


def run(module_id: str, params: Dict[str, Any] | None = None) -> Result:
    if module_id not in MODELS:
        raise KeyError(f"Unknown module '{module_id}'. Valid: {sorted(MODELS)}")
    return MODELS[module_id](params)
