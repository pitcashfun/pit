/** Original garages. Not a championship constructor list. */

export type Garage = {
  name: string;
  tag: string;
  from: string;
  to: string;
  mark: string;
  body: string;
  accent: string;
  people: { given: string; family: string }[];
};

export const GARAGES: Garage[] = [
  {
    name: "Soft",
    tag: "×1",
    from: "#5eead4",
    to: "#0f766e",
    mark: "S",
    body: "#111111",
    accent: "#5eead4",
    people: [
      { given: "Warm", family: "LAP" },
      { given: "Out", family: "LAP" },
    ],
  },
  {
    name: "Medium",
    tag: "×2",
    from: "#fb7185",
    to: "#9f1239",
    mark: "M",
    body: "#f4f4f5",
    accent: "#e11d48",
    people: [
      { given: "Under", family: "CUT" },
      { given: "Over", family: "CUT" },
    ],
  },
  {
    name: "Hard",
    tag: "×3",
    from: "#fdba74",
    to: "#c2410c",
    mark: "H",
    body: "#111111",
    accent: "#fb923c",
    people: [
      { given: "Long", family: "STINT" },
      { given: "Fuel", family: "SAVE" },
    ],
  },
  {
    name: "Apex",
    tag: "S1",
    from: "#60a5fa",
    to: "#1e3a8a",
    mark: "A",
    body: "#1e3a8a",
    accent: "#facc15",
    people: [
      { given: "Purple", family: "S1" },
      { given: "Green", family: "S2" },
    ],
  },
  {
    name: "Kerbs",
    tag: "S2",
    from: "#818cf8",
    to: "#312e81",
    mark: "K",
    body: "#0f172a",
    accent: "#a5b4fc",
    people: [
      { given: "Track", family: "LIMIT" },
      { given: "Wall", family: "HIT" },
    ],
  },
  {
    name: "Box",
    tag: "S3",
    from: "#38bdf8",
    to: "#075985",
    mark: "B",
    body: "#082f49",
    accent: "#38bdf8",
    people: [
      { given: "Pit", family: "IN" },
      { given: "Pit", family: "OUT" },
    ],
  },
];

export function GarageGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {GARAGES.map((g) => (
        <article
          key={g.name}
          className="relative overflow-hidden rounded-2xl px-6 pb-3 pt-5 text-white shadow-sm"
          style={{ background: `linear-gradient(180deg, ${g.from} 0%, ${g.to} 100%)` }}
        >
          <div className="halftone pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-4xl font-black italic leading-none tracking-tight">{g.name}</h2>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {g.people.map((p) => (
                  <li key={p.family + p.given} className="flex items-center gap-2">
                    <span className="size-6 rounded-full bg-black/25 ring-1 ring-white/40" />
                    <span>
                      {p.given} <span className="font-bold uppercase tracking-wide">{p.family}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black/25 font-display text-lg font-black italic ring-1 ring-white/30">
              {g.mark}
            </div>
          </div>
          <div className="relative -mx-2 mt-4">
            <SideCar body={g.body} accent={g.accent} />
          </div>
          <p className="relative mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">{g.tag}</p>
        </article>
      ))}
    </div>
  );
}

function SideCar({ body, accent }: { body: string; accent: string }) {
  return (
    <svg viewBox="0 0 640 160" className="h-auto w-full" aria-hidden>
      <ellipse cx="118" cy="128" rx="52" ry="12" fill="rgba(0,0,0,0.25)" />
      <ellipse cx="500" cy="128" rx="58" ry="12" fill="rgba(0,0,0,0.25)" />
      <path d="M70 108 H560 L540 88 H500 L470 70 H300 L250 88 H140 L110 108 Z" fill={body} />
      <path d="M250 88 H470 L440 74 H300 Z" fill={accent} opacity="0.85" />
      <rect x="300" y="52" width="90" height="18" rx="3" fill={accent} />
      <path d="M388 52 L430 70 H388 Z" fill={body} />
      <rect x="538" y="62" width="8" height="46" fill={accent} />
      <rect x="520" y="58" width="48" height="8" fill={body} />
      <rect x="72" y="78" width="36" height="8" fill={accent} />
      <circle cx="118" cy="118" r="28" fill="#111" stroke="#c4c4c8" strokeWidth="5" />
      <circle cx="118" cy="118" r="10" fill="#6b6b74" />
      <circle cx="500" cy="118" r="32" fill="#111" stroke="#c4c4c8" strokeWidth="5" />
      <circle cx="500" cy="118" r="11" fill="#6b6b74" />
      <rect x="200" y="92" width="70" height="10" rx="2" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}
