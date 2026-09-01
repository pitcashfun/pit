/** Pit Ring — Spielberg-style triangle. Not a championship circuit. */

type Pt = { x: number; y: number };

const TURNS: { n: string; x: number; y: number }[] = [
  { n: "01", x: 508, y: 548 },
  { n: "02", x: 268, y: 392 },
  { n: "03", x: 72, y: 248 },
  { n: "04", x: 548, y: 52 },
  { n: "05", x: 498, y: 188 },
  { n: "06", x: 318, y: 268 },
  { n: "07", x: 468, y: 428 },
  { n: "08", x: 538, y: 318 },
  { n: "09", x: 868, y: 128 },
  { n: "10", x: 948, y: 268 },
];

/** Centerline vertices. Fillets round every corner. */
const RING: Pt[] = [
  { x: 630, y: 458 },
  { x: 508, y: 548 },
  { x: 268, y: 392 },
  { x: 72, y: 248 },
  { x: 220, y: 128 },
  { x: 400, y: 56 },
  { x: 548, y: 52 },
  { x: 498, y: 188 },
  { x: 318, y: 268 },
  { x: 468, y: 428 },
  { x: 538, y: 318 },
  { x: 700, y: 208 },
  { x: 868, y: 128 },
  { x: 948, y: 268 },
  { x: 820, y: 372 },
  { x: 700, y: 448 },
];

const S1 = [0, 3] as const;
const S2 = [3, 9] as const;
const S3 = [9, 0] as const;

type Corner = { from: Pt; to: Pt; r: number; sweep: 0 | 1 };

function sub(a: Pt, b: Pt): Pt {
  return { x: a.x - b.x, y: a.y - b.y };
}
function len(a: Pt) {
  return Math.hypot(a.x, a.y);
}
function norm(a: Pt): Pt {
  const L = len(a) || 1;
  return { x: a.x / L, y: a.y / L };
}
function fmt(p: Pt) {
  return `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
}

function filletClosed(pts: Pt[], radius: number): Corner[] {
  const n = pts.length;
  const corners: Corner[] = [];
  for (let i = 0; i < n; i++) {
    const A = pts[(i - 1 + n) % n];
    const B = pts[i];
    const C = pts[(i + 1) % n];
    const vIn = sub(B, A);
    const vOut = sub(C, B);
    const dIn = norm(vIn);
    const dOut = norm(vOut);
    const back = { x: -dIn.x, y: -dIn.y };
    const dot = Math.max(-1, Math.min(1, back.x * dOut.x + back.y * dOut.y));
    const half = Math.acos(dot) / 2;
    const th = Math.tan(half);
    if (!Number.isFinite(th) || th < 1e-3) {
      corners.push({ from: B, to: B, r: 0, sweep: 0 });
      continue;
    }
    const d = Math.min(radius / th, len(vIn) * 0.44, len(vOut) * 0.44);
    const r = d * th;
    corners.push({
      from: { x: B.x + back.x * d, y: B.y + back.y * d },
      to: { x: B.x + dOut.x * d, y: B.y + dOut.y * d },
      r,
      sweep: dIn.x * dOut.y - dIn.y * dOut.x > 0 ? 1 : 0,
    });
  }
  return corners;
}

function pathAll(corners: Corner[]) {
  const n = corners.length;
  let d = `M ${fmt(corners[0].from)}`;
  for (let i = 0; i < n; i++) {
    const c = corners[i];
    if (c.r > 0.8) d += ` A ${c.r.toFixed(1)} ${c.r.toFixed(1)} 0 0 ${c.sweep} ${fmt(c.to)}`;
    const next = corners[(i + 1) % n];
    d += ` L ${fmt(next.from)}`;
  }
  return `${d} Z`;
}

function pathSlice(corners: Corner[], a: number, b: number) {
  const n = corners.length;
  let d = `M ${fmt(corners[a].from)}`;
  let i = a;
  for (;;) {
    const c = corners[i];
    if (c.r > 0.8) d += ` A ${c.r.toFixed(1)} ${c.r.toFixed(1)} 0 0 ${c.sweep} ${fmt(c.to)}`;
    if (i === b) break;
    const j = (i + 1) % n;
    d += ` L ${fmt(corners[j].from)}`;
    i = j;
  }
  return d;
}

const CORNERS = filletClosed(RING, 52);
const TRACK = pathAll(CORNERS);
const TRACK_S1 = pathSlice(CORNERS, S1[0], S1[1]);
const TRACK_S2 = pathSlice(CORNERS, S2[0], S2[1]);
const TRACK_S3 = pathSlice(CORNERS, S3[0], S3[1]);

export function TrackMap() {
  return (
    <svg viewBox="0 0 1100 640" className="h-auto w-full" aria-label="Pit Ring, three sectors, ten turns">
      <rect width="1100" height="640" fill="#050505" />

      <path d={TRACK} fill="none" stroke="#1a1a1a" strokeWidth="44" strokeLinejoin="round" strokeLinecap="round" />
      <path d={TRACK} fill="none" stroke="#2a2a2a" strokeWidth="30" strokeLinejoin="round" strokeLinecap="round" />

      <path d={TRACK_S1} fill="none" stroke="#ff3b3b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d={TRACK_S2} fill="none" stroke="#3dd6ff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d={TRACK_S3} fill="none" stroke="#ffe600" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

      <g stroke="#39ff14" strokeWidth="3" strokeDasharray="4 6" strokeLinecap="round">
        <path d="M 560 500 L 470 545" />
        <path d="M 200 320 L 100 260" />
        <path d="M 820 200 L 900 250" />
        <path d="M 200 180 L 400 80" />
      </g>

      {TURNS.map((t) => (
        <g key={t.n}>
          <circle cx={t.x} cy={t.y} r="16" fill="#111" stroke="#f4f4f5" strokeWidth="1.5" />
          <text
            x={t.x}
            y={t.y + 4}
            textAnchor="middle"
            fill="#f4f4f5"
            fontSize="11"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="500"
          >
            {t.n}
          </text>
        </g>
      ))}

      <g transform="translate(640 448)">
        <rect width="18" height="18" rx="3" fill="#111" />
        <rect width="9" height="9" rx="1" fill="#f4f4f5" />
        <rect x="9" y="9" width="9" height="9" rx="1" fill="#f4f4f5" />
      </g>

      <text x="360" y="500" fill="#ff3b3b" fontSize="13" fontFamily="IBM Plex Mono, monospace" letterSpacing="0.2em">
        SECTOR 1
      </text>
      <text x="380" y="230" fill="#3dd6ff" fontSize="13" fontFamily="IBM Plex Mono, monospace" letterSpacing="0.2em">
        SECTOR 2
      </text>
      <text x="700" y="200" fill="#ffe600" fontSize="13" fontFamily="IBM Plex Mono, monospace" letterSpacing="0.2em">
        SECTOR 3
      </text>

      <Callout x={40} y={300} label="DETECTION 2" color="#39ff14" />
      <Callout x={430} y={8} label="SPEED TRAP" color="#ff4ae2" />
      <Callout x={880} y={40} label="DETECTION 3" color="#39ff14" />
      <Callout x={620} y={560} label="DETECTION 1" color="#39ff14" />
    </svg>
  );
}

function Callout({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="148" height="28" rx="8" fill={color} />
      <text
        x="74"
        y="19"
        textAnchor="middle"
        fill="#050505"
        fontSize="11"
        fontFamily="IBM Plex Mono, monospace"
        fontWeight="600"
        letterSpacing="0.08em"
      >
        {label}
      </text>
    </g>
  );
}
