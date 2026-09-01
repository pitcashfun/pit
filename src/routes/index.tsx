import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { TrackMap } from "@/components/track-map";
import { TimingTower } from "@/components/timing-tower";
import { StintClock } from "@/components/stint-clock";
import { GRID_MAX, STINT_SEC } from "@/lib/catalog";
import { usePit } from "@/lib/pit";

export const Route = createFileRoute("/")({ component: Home });

const FACTS = [
  { k: "Turns", v: "10" },
  { k: "Sectors", v: "3" },
  { k: "Grid", v: `${GRID_MAX}` },
  { k: "Stint", v: `${STINT_SEC / 60}:00` },
  { k: "Bounty", v: "1%" },
];

function Home() {
  const cars = usePit((s) => s.cars);
  return (
    <Shell>
      <section className="relative overflow-hidden rounded-lg border border-line bg-black">
        <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-sm sm:left-8 sm:top-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">Stint · 3 minutes</p>
          <h1 className="mt-2 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight sm:text-7xl">
            Pit
            <br />
            Cash
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-mute">The box · pitcash.fun</p>
        </div>
        <div className="px-2 pb-2 pt-28 sm:px-4 sm:pt-8">
          <TrackMap />
        </div>
      </section>

      <div className="mt-px grid grid-cols-2 border-x border-b border-line sm:grid-cols-5">
        {FACTS.map((f) => (
          <div key={f.k} className="border-r border-line px-4 py-4 last:border-r-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{f.k}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{f.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/box" className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-fg">
          Stop
        </Link>
        <Link to="/paper" className="rounded-md border border-line px-5 py-3 text-sm">
          Circuit guide
        </Link>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
        <StintClock />
        <TimingTower cars={cars} />
      </div>
      <p className="mt-4 font-mono text-[11px] text-mute">
        Map: red S1 · cyan S2 · yellow S3. Tower: purple session best · green personal · yellow off pace. Demo grid until
        PitStop is live.
      </p>
    </Shell>
  );
}
