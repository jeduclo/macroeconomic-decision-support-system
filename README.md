# MacroLab — Principles of Macroeconomics (Modules 1–10)

An interactive introductory macroeconomics course. Each module is a tab with four parts:

| Part | What students get |
|---|---|
| **Learn** | Objectives, explanation, a concept-map diagram, key equations (minimal algebra), key terms, readings, discussion questions |
| **Simulate** | Sliders and preset scenarios driving textbook diagrams (Keynesian cross, AD/AS, IS-LM, Solow…), KPI cards, guided experiments, CSV download |
| **Python Lab** | A beginner-friendly script (pandas + matplotlib) that runs the same model, answers questions and, optionally, pulls real US/Canadian data from FRED |
| **Quiz** | Five auto-graded questions with explanations; progress is saved in the browser |

| # | Module | Simulator |
|---|---|---|
| 1 | GDP | Expenditure approach, nominal vs real GDP, deflator |
| 2 | Unemployment | Labour-market flows, natural rate s/(s+f), recession, Okun's law |
| 3 | Inflation | Quantity theory, real wages, Fisher relation |
| 4 | Economic growth | Solow model, steady state, convergence, rule of 70 |
| 5 | AE model | Keynesian cross, multiplier round by round, gaps |
| 6 | AD/AS | Demand and supply shocks, stagflation, self-correction |
| 7 | IS-LM | Fiscal and monetary policy, crowding out, policy mix |
| 8 | Fiscal policy | Spending vs tax multipliers, policy lags, debt and r − g |
| 9 | Monetary policy | Taylor rule, transmission channels, credibility |
| 10 | Capstone policy lab | Demand collapse / oil shock / financial crisis, loss function |

Site created by **Jean Alegue, PhD**.

## Architecture

```
engine/specs.json      ← one source of truth: parameters, ranges, presets (Python AND TypeScript)
engine/models.py       ← the 10 models in pure Python (no numpy → tiny serverless function)
api/index.py           ← FastAPI: /api/py/health, /modules, /simulate/{id}, /policy_lab
lib/engines.ts         ← the same models in TypeScript (instant slider feedback; fallback if the API is down)
lib/course/m01..m10.ts ← curriculum content, charts, KPIs, quizzes
lib/course/diagrams.ts ← concept maps for the Learn tab (rendered by components/SystemDiagram.tsx)
components/            ← CourseApp (tabs), Simulator, ChartCard (Recharts), Learn, LabView, Quiz
labs/                  ← Python labs 1–10 (pandas, matplotlib, optional FRED data)
deploy/                ← Dockerfiles + docker-compose
tests/                 ← pytest: model behaviour, API, Python↔TypeScript parity
```

## 1. Set up on Windows (VS Code)

Install once: **Node.js 20 LTS+**, **Python 3.11+** (tick *"Add python.exe to PATH"*), **Git**.
Unzip, open the folder in VS Code, open a terminal (**Ctrl + `**):

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1          # if blocked: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
pip install -r requirements-dev.txt
npm install
npm run dev                          # Next.js on :3000 + FastAPI on :8000
```

Open http://localhost:3000 — the header pill should say **"Python API online"**. API docs: http://localhost:3000/api/py/docs.

### Labs and tests

```powershell
python labs/module_05_ae_model.py    # prints results, saves charts to labs/output/
python -m pytest -q                  # model + API tests
npm run test:parity                  # Python and TypeScript engines agree
npm run build                        # production build check
```

The labs try to download FRED data (no key needed); offline they skip that part and still run.

## 2. Push to GitHub

Create an empty repository on github.com (no README), then:

```powershell
git init
git add .
git commit -m "MacroLab: modules 1-10"
git branch -M main
git remote add origin https://github.com/jeduclo/macroeconomic-decision-support-system.git
git push -u origin main
```

## 3. Deploy on Vercel

1. vercel.com → **Add New… → Project** → import the repository (preset **Next.js**, defaults).
2. **Deploy.** `api/index.py` becomes a Python function using `requirements.txt`.
3. Check `https://<project>.vercel.app/api/py/health`.

Every push to `main` redeploys. If the API is ever down, every simulator falls back to the TypeScript engine.

## 4. Changing a model

Edit the equations in **both** `engine/models.py` and `lib/engines.ts`, adjust `engine/specs.json`, then run `npm run test:parity` and `python -m pytest -q`.

## 5. Docker

```powershell
docker compose -f deploy/docker-compose.yml up --build
```

> The models are simplified textbook teaching tools, not forecasts.
