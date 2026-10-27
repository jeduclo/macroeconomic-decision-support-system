import type { Diagram, DNode } from "@/lib/course/diagrams";

/**
 * Renders causal-loop diagrams (CLD), stock-and-flow diagrams (SFD) and simple
 * architecture diagrams from a small JSON-like spec. Colours come from Tailwind
 * CSS variables, so diagrams follow the light/dark theme automatically.
 */

const FONT = 12.5;
const LINE = 15;

type Pt = { x: number; y: number };

const lines = (n: DNode) => n.label.split("\n");
const textW = (n: DNode) => Math.max(...lines(n).map((l) => l.length)) * (n.kind === "box" || n.kind === "stock" ? 7.6 : 6.9);

function size(n: DNode) {
  const k = n.kind ?? "var";
  if (k === "stock" || k === "box") return { w: Math.max(96, textW(n) + 26), h: Math.max(42, lines(n).length * LINE + 16) };
  if (k === "cloud") return { w: 40, h: 28 };
  if (k === "valve") return { w: 22, h: 22 };
  return { w: textW(n) + 14, h: lines(n).length * LINE + 8 };
}

function inside(n: DNode, p: Pt, pad = 4) {
  const k = n.kind ?? "var";
  const { w, h } = size(n);
  const dx = p.x - n.x;
  const dy = p.y - n.y;
  if (k === "stock" || k === "box") return Math.abs(dx) <= w / 2 + pad && Math.abs(dy) <= h / 2 + pad;
  if (k === "cloud") return dx * dx + dy * dy <= 22 * 22;
  if (k === "valve") return dx * dx + dy * dy <= 13 * 13;
  const rx = w / 2 + pad;
  const ry = h / 2 + pad;
  return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
}

function bezier(a: Pt, c: Pt, b: Pt, t: number): Pt {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

function route(from: DNode, to: DNode, curve = 0) {
  const a = { x: from.x, y: from.y };
  const b = { x: to.x, y: to.y };
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const perp = { x: -dy / len, y: dx / len }; // right-hand side of travel (screen coords)
  const c = { x: (a.x + b.x) / 2 + perp.x * curve * len, y: (a.y + b.y) / 2 + perp.y * curve * len };
  const N = 80;
  const pts: Pt[] = [];
  for (let i = 0; i <= N; i++) pts.push(bezier(a, c, b, i / N));
  let s = 0;
  while (s < N && inside(from, pts[s])) s++;
  let e = N;
  while (e > s && inside(to, pts[e], 9)) e--;
  const seg = pts.slice(s, e + 1);
  return { seg, perp, c, a, b };
}

const d = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

function Cloud({ x, y }: Pt) {
  return (
    <g fill="var(--color-slate-800)" stroke="var(--color-slate-600)" strokeWidth={1.2}>
      <circle cx={x - 10} cy={y + 3} r={9} />
      <circle cx={x + 10} cy={y + 3} r={9} />
      <circle cx={x} cy={y - 5} r={11} />
      <rect x={x - 10} y={y} width={20} height={11} stroke="none" />
    </g>
  );
}

function Label({ n, color, weight = 500 }: { n: DNode; color: string; weight?: number }) {
  const ls = lines(n);
  const y0 = n.y - ((ls.length - 1) * LINE) / 2 + 4;
  return (
    <text textAnchor="middle" fontSize={FONT} fontWeight={weight} fill={color}
      stroke="var(--color-slate-900)" strokeWidth={4} paintOrder="stroke" strokeLinejoin="round">
      {ls.map((l, i) => (
        <tspan key={i} x={n.x} y={y0 + i * LINE}>{l}</tspan>
      ))}
    </text>
  );
}

export default function SystemDiagram({ diagram }: { diagram: Diagram }) {
  const byId = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]));
  const mid = `ah-${diagram.id}`;
  const loopMid = `lh-${diagram.id}`;

  return (
    <svg viewBox={`0 0 ${diagram.width} ${diagram.height}`} className="w-full h-auto" role="img" aria-label={diagram.title}>
      <defs>
        <marker id={mid} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--color-slate-400)" />
        </marker>
        <marker id={`${loopMid}-R`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--color-rose-500)" />
        </marker>
        <marker id={`${loopMid}-B`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--color-sky-500)" />
        </marker>
      </defs>

      {/* Flows (pipes) */}
      {diagram.edges.filter((e) => e.kind === "flow").map((e, i) => {
        const { seg } = route(byId[e.from], byId[e.to], 0);
        if (seg.length < 2) return null;
        const p0 = seg[0];
        const p1 = seg[seg.length - 1];
        const ang = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        const tip = { x: p1.x + Math.cos(ang) * 6, y: p1.y + Math.sin(ang) * 6 };
        const base = { x: p1.x - Math.cos(ang) * 6, y: p1.y - Math.sin(ang) * 6 };
        const nx = -Math.sin(ang) * 9;
        const ny = Math.cos(ang) * 9;
        return (
          <g key={`f${i}`}>
            <line x1={p0.x} y1={p0.y} x2={base.x} y2={base.y} stroke="var(--color-slate-500)" strokeWidth={9} />
            <line x1={p0.x} y1={p0.y} x2={base.x} y2={base.y} stroke="var(--color-slate-900)" strokeWidth={4} />
            <polygon points={`${tip.x},${tip.y} ${base.x + nx},${base.y + ny} ${base.x - nx},${base.y - ny}`} fill="var(--color-slate-500)" />
          </g>
        );
      })}

      {/* Causal links / information arrows */}
      {diagram.edges.filter((e) => e.kind !== "flow").map((e, i) => {
        const { seg, perp } = route(byId[e.from], byId[e.to], e.curve ?? 0);
        if (seg.length < 2) return null;
        const side = e.signSide ?? ((e.curve ?? 0) < 0 ? -1 : 1);
        const sp = seg[Math.min(seg.length - 1, Math.max(0, Math.floor(seg.length * (e.signAt ?? 0.82))))];
        const signPos = { x: sp.x + perp.x * 11 * side, y: sp.y + perp.y * 11 * side };
        const m = seg[Math.floor(seg.length / 2)];
        const m2 = seg[Math.min(seg.length - 1, Math.floor(seg.length / 2) + 1)];
        const ang = Math.atan2(m2.y - m.y, m2.x - m.x);
        const px = -Math.sin(ang);
        const py = Math.cos(ang);
        const negative = e.sign === "-";
        return (
          <g key={`e${i}`}>
            <path d={d(seg)} fill="none" stroke="var(--color-slate-400)" strokeWidth={1.6} markerEnd={`url(#${mid})`}
              strokeDasharray={e.dashed ? "5 4" : undefined} />
            {e.delay &&
              [-3, 3].map((o) => (
                <line key={o}
                  x1={m.x + Math.cos(ang) * o - px * 8} y1={m.y + Math.sin(ang) * o - py * 8}
                  x2={m.x + Math.cos(ang) * o + px * 8} y2={m.y + Math.sin(ang) * o + py * 8}
                  stroke="var(--color-slate-300)" strokeWidth={1.8} />
              ))}
            {e.sign && (
              <text x={signPos.x} y={signPos.y + 5} textAnchor="middle" fontSize={15} fontWeight={700}
                fill={negative ? "var(--color-rose-500)" : "var(--color-emerald-500)"}>
                {negative ? "−" : "+"}
              </text>
            )}
            {e.label && (
              <text x={m.x + px * 12 * side} y={m.y + py * 12 * side + 4} textAnchor="middle" fontSize={11}
                fill="var(--color-slate-400)" stroke="var(--color-slate-900)" strokeWidth={4} paintOrder="stroke">
                {e.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Loop markers */}
      {diagram.loops?.map((l, i) => {
        const r = 14;
        const cw = (l.dir ?? "cw") === "cw";
        const a0 = (-60 * Math.PI) / 180;
        const a1 = (230 * Math.PI) / 180;
        const start = cw ? a0 : a1;
        const end = cw ? a1 : a0;
        const p0 = { x: l.x + r * Math.cos(start), y: l.y + r * Math.sin(start) };
        const p1 = { x: l.x + r * Math.cos(end), y: l.y + r * Math.sin(end) };
        const color = l.type === "R" ? "var(--color-rose-500)" : "var(--color-sky-500)";
        return (
          <g key={`l${i}`}>
            <path d={`M${p0.x},${p0.y} A${r},${r} 0 1 ${cw ? 1 : 0} ${p1.x},${p1.y}`} fill="none" stroke={color} strokeWidth={1.8} markerEnd={`url(#${loopMid}-${l.type})`} />
            <text x={l.x} y={l.y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{l.type}</text>
            {l.label && (() => {
              const pos = l.labelPos ?? "below";
              let lx = pos === "left" ? l.x - r - 6 : pos === "right" ? l.x + r + 6 : l.x;
              let ly = pos === "below" ? l.y + r + 15 : pos === "above" ? l.y - r - 7 : l.y + 4;
              let anchor: "start" | "middle" | "end" = pos === "left" ? "end" : pos === "right" ? "start" : "middle";
              if (l.labelAt) [lx, ly, anchor] = [l.labelAt[0], l.labelAt[1], "start"];
              return (
                <text x={lx} y={ly} textAnchor={anchor} fontSize={10.5} fill={color}
                  stroke="var(--color-slate-900)" strokeWidth={3} paintOrder="stroke">{l.label}</text>
              );
            })()}
          </g>
        );
      })}

      {/* Nodes */}
      {diagram.nodes.map((n) => {
        const k = n.kind ?? "var";
        const { w, h } = size(n);
        if (k === "cloud") return <Cloud key={n.id} x={n.x} y={n.y} />;
        if (k === "valve") {
          return (
            <g key={n.id}>
              <path d={`M${n.x - 9},${n.y - 9} L${n.x + 9},${n.y + 9} L${n.x + 9},${n.y - 9} L${n.x - 9},${n.y + 9} Z`}
                fill="var(--color-slate-900)" stroke="var(--accent)" strokeWidth={1.8} strokeLinejoin="round" />
              <text x={n.x} y={n.y - 18} textAnchor="middle" fontSize={11.5} fill="var(--color-slate-200)"
                stroke="var(--color-slate-900)" strokeWidth={4} paintOrder="stroke">{n.label}</text>
            </g>
          );
        }
        if (k === "stock" || k === "box") {
          return (
            <g key={n.id}>
              <rect x={n.x - w / 2} y={n.y - h / 2} width={w} height={h} rx={k === "box" ? 10 : 3}
                fill="var(--color-slate-950)" stroke={n.color ?? (k === "stock" ? "var(--accent)" : "var(--color-slate-600)")} strokeWidth={k === "stock" || n.color ? 2 : 1.4} />
              <Label n={n} color="var(--color-slate-100)" weight={600} />
            </g>
          );
        }
        return <Label key={n.id} n={n} color={n.color ?? (k === "policy" ? "var(--accent)" : "var(--color-slate-200)")} weight={k === "policy" || n.color ? 650 : 500} />;
      })}
    </svg>
  );
}
