"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ErrorBar,
  Legend,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Params, Row } from "@/lib/engines";
import type { ChartSpec } from "@/lib/course/types";

const tick = { fill: "#94a3b8", fontSize: 11 };

function compact(v: number) {
  if (!Number.isFinite(v)) return "";
  const a = Math.abs(v);
  if (a >= 1e6) return (v / 1e6).toFixed(1) + "M";
  if (a >= 1e4) return (v / 1e3).toFixed(0) + "k";
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return v.toFixed(1);
  return v.toFixed(2);
}

export default function ChartCard({ spec, rows, params, accent, extra = {} }: { spec: ChartSpec; rows: Row[]; params: Params; accent: string; extra?: Record<string, any> }) {
  const data = spec.transform ? spec.transform(rows, params) : rows;
  const hasRight = spec.series.some((s) => s.axis === "right");
  const hasBars = spec.series.some((s) => s.type === "bar");
  // bars must start from zero: make sure the left axis includes it
  const leftDomain = spec.yDomain ?? (hasBars
    ? [(min: number) => Math.min(0, min * 1.1), (max: number) => Math.max(0, max * 1.1)]
    : ["auto", "auto"]);
  const resolve = (v: number | ((p: Params, e: Record<string, any>) => number)) => (typeof v === "function" ? v(params, extra) : v);
  const dots = spec.dots ? spec.dots(extra, params) : [];

  return (
    <div className={`card p-4 sm:p-5 ${spec.wide ? "lg:col-span-2" : ""}`}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-100">{spec.title}</h3>
        {spec.subtitle && <p className="text-xs text-slate-400 mt-0.5">{spec.subtitle}</p>}
      </div>
      <div className={spec.wide ? "h-80" : "h-64"}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 6, right: hasRight ? 4 : 12, bottom: 0, left: -8 }}>
            <defs>
              {spec.series.map((s) => (
                <linearGradient key={s.key} id={`g-${spec.id}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey={spec.x}
              type={spec.xTickLabels ? "category" : "number"}
              domain={spec.xTickLabels ? undefined : ["dataMin", "dataMax"]}
              tick={tick}
              stroke="#334155"
              interval={spec.xTickLabels ? 0 : "preserveEnd"}
              tickFormatter={(v) => (spec.xTickLabels ? spec.xTickLabels[Number(v)] ?? String(v) : String(Math.round(v * 100) / 100))}
              label={spec.xLabel ? { value: spec.xLabel, position: "insideBottomRight", offset: -2, fill: "#64748b", fontSize: 11 } : undefined}
              height={34}
            />
            <YAxis yAxisId="left" tick={tick} stroke="#334155" tickFormatter={compact} domain={leftDomain as never} width={52}
              allowDataOverflow={Boolean(spec.yDomain)}
              label={spec.yLabel ? { value: spec.yLabel, angle: -90, position: "insideLeft", offset: 14, fill: "#64748b", fontSize: 11 } : undefined} />
            {hasRight && <YAxis yAxisId="right" orientation="right" tick={tick} stroke="#334155" tickFormatter={compact} width={48} domain={["auto", "auto"]} />}
            <Tooltip
              contentStyle={{ background: "#0b1220", border: "1px solid #334155", borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: "#cbd5e1", marginBottom: 4 }}
              labelFormatter={(v) =>
                spec.xTickLabels ? spec.xTickLabels[Number(v)] ?? String(v) : `${spec.xLabel ?? spec.x}: ${Math.round(Number(v) * 100) / 100}`
              }
              formatter={(v: unknown, name: unknown) => [
                Array.isArray(v) ? `${compact(Number(v[0]))} – ${compact(Number(v[1]))}` : compact(Number(v)),
                String(name),
              ]}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} iconType="plainline" />
            {spec.refY?.map((r, i) => (
              <ReferenceLine key={`ry${i}`} yAxisId="left" y={resolve(r.value)} stroke={r.color ?? "#475569"} strokeDasharray="4 4"
                label={r.label ? { value: r.label, fill: r.color ?? "#94a3b8", fontSize: 10, position: "insideTopLeft" } : undefined} />
            ))}
            {spec.refX?.map((r, i) => (
              <ReferenceLine key={`rx${i}`} yAxisId="left" x={resolve(r.value)} stroke={r.color ?? accent} strokeDasharray="4 4"
                label={{ value: r.label, fill: r.color ?? accent, fontSize: 10, position: "insideTopRight" }} />
            ))}
            {dots.flatMap((d, i) => [
              ...(d.guides !== false
                ? [
                    <ReferenceLine key={`dgx${i}`} yAxisId="left" stroke={d.color ?? "#94a3b8"} strokeDasharray="3 3" strokeOpacity={0.6}
                      segment={[{ x: d.x, y: spec.yDomain && typeof spec.yDomain[0] === "number" ? spec.yDomain[0] : 0 }, { x: d.x, y: d.y }]} ifOverflow="extendDomain" />,
                    <ReferenceLine key={`dgy${i}`} yAxisId="left" stroke={d.color ?? "#94a3b8"} strokeDasharray="3 3" strokeOpacity={0.6}
                      segment={[{ x: rows.length ? rows[0][spec.x] : 0, y: d.y }, { x: d.x, y: d.y }]} ifOverflow="extendDomain" />,
                  ]
                : []),
              <ReferenceDot key={`d${i}`} yAxisId="left" x={d.x} y={d.y} r={5} fill={d.color ?? "#e2e8f0"} stroke="#0b1220" strokeWidth={2}
                label={{ value: d.label, position: "top", fill: d.color ?? "#e2e8f0", fontSize: 11, fontWeight: 600 }} ifOverflow="extendDomain" />,
            ])}
            {spec.series.map((s) =>
              s.type === "band" ? (
                <Area key={s.key} yAxisId={s.axis ?? "left"} type="monotone" name={s.name}
                  dataKey={(d: Record<string, number>) => [d[s.keyLow ?? s.key], d[s.key]]}
                  stroke="none" fill={s.color} fillOpacity={0.22} isAnimationActive={false} activeDot={false} />
              ) : s.type === "bar" ? (
                <Bar key={s.key} yAxisId={s.axis ?? "left"} dataKey={s.key} name={s.name} fill={s.color}
                  radius={4} isAnimationActive={false} stackId={s.stack} maxBarSize={56} fillOpacity={0.85}>
                  {s.errorKeys && (
                    <ErrorBar
                      dataKey={(d: Record<string, number>) => [d[s.key] - d[s.errorKeys![0]], d[s.errorKeys![1]] - d[s.key]]}
                      width={10} strokeWidth={1.8} stroke="#e2e8f0" direction="y" />
                  )}
                </Bar>
              ) : s.type === "scatter" ? (
                <Scatter key={s.key} yAxisId={s.axis ?? "left"} dataKey={s.key} name={s.name} fill={s.color}
                  fillOpacity={0.55} isAnimationActive={false} shape="circle" />
              ) : s.type === "area" ? (
                <Area key={s.key} yAxisId={s.axis ?? "left"} type="monotone" dataKey={s.key} name={s.name} stroke={s.color}
                  strokeWidth={2} fill={`url(#g-${spec.id}-${s.key})`} isAnimationActive={false} dot={false}
                  strokeDasharray={s.dashed ? "5 4" : undefined} stackId={s.stack} />
              ) : (
                <Line key={s.key} yAxisId={s.axis ?? "left"} type="monotone" dataKey={s.key} name={s.name} stroke={s.color}
                  strokeWidth={2} dot={false} isAnimationActive={false} strokeDasharray={s.dashed ? "5 4" : undefined}
                  connectNulls />
              ),
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
