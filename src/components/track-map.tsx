/** Pit Ring — Spielberg-style triangle. Not a championship circuit. */

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

const TRACK =
  "M 620 470 L 508 548 C 430 500 300 430 268 392 C 180 330 90 280 72 248 C 160 140 380 40 548 52 C 620 90 560 160 498 188 C 420 230 340 250 318 268 C 360 340 430 410 468 428 C 520 390 530 340 538 318 C 620 240 780 140 868 128 C 920 160 960 220 948 268 C 900 340 780 430 680 470 Z";

export function TrackMap() {
  return (
    <svg viewBox="0 0 1100 640" className="h-auto w-full" aria-label="Pit Ring, three sectors, ten turns">
      <rect width="1100" height="640" fill="#050505" />

      {/* asphalt ribbon */}
      <path d={TRACK} fill="none" stroke="#1a1a1a" strokeWidth="42" strokeLinejoin="round" strokeLinecap="round" />
      <path d={TRACK} fill="none" stroke="#2a2a2a" strokeWidth="28" strokeLinejoin="round" strokeLinecap="round" />

      {/* S1 red: T1 → T3 */}
      <path
        d="M 620 470 L 508 548 C 430 500 300 430 268 392 C 180 330 90 280 72 248"
        fill="none"
        stroke="#ff3b3b"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* S2 cyan: T3 → T7 */}
      <path
        d="M 72 248 C 160 140 380 40 548 52 C 620 90 560 160 498 188 C 420 230 340 250 318 268 C 360 340 430 410 468 428"
        fill="none"
        stroke="#3dd6ff"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* S3 yellow: T7 → S/F */}
      <path
        d="M 468 428 C 520 390 530 340 538 318 C 620 240 780 140 868 128 C 920 160 960 220 948 268 C 900 340 780 430 680 470 L 620 470"
        fill="none"
        stroke="#ffe600"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* DRS hashes */}
      <g stroke="#39ff14" strokeWidth="3" strokeDasharray="4 6">
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

      {/* S/F */}
      <g transform="translate(640 448)">
        <rect width="18" height="18" fill="#111" />
        <rect width="9" height="9" fill="#f4f4f5" />
        <rect x="9" y="9" width="9" height="9" fill="#f4f4f5" />
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
      <rect width="148" height="28" rx="2" fill={color} />
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
