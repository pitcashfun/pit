/** Original garages. Liveries are ours — no championship constructors. */

export type Garage = {
  name: string;
  tag: string;
  from: string;
  to: string;
  mark: string;
  photo: string;
  people: { given: string; family: string }[];
};

export const GARAGES: Garage[] = [
  {
    name: "Soft",
    tag: "×1",
    from: "#5eead4",
    to: "#0f766e",
    mark: "S",
    photo: "/cars/soft.jpg",
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
    photo: "/cars/medium.jpg",
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
    photo: "/cars/hard.jpg",
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
    photo: "/cars/apex.jpg",
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
    photo: "/cars/kerbs.jpg",
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
    photo: "/cars/box.jpg",
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
          className="relative overflow-hidden rounded-2xl text-white shadow-sm"
          style={{ background: `linear-gradient(180deg, ${g.from} 0%, ${g.to} 100%)` }}
        >
          <div className="relative z-10 flex items-start justify-between gap-3 px-6 pt-5">
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
          <div className="relative mt-2 h-44 sm:h-52">
            <img
              src={g.photo}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_62%]"
            />
          </div>
        </article>
      ))}
    </div>
  );
}
