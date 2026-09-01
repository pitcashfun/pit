import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Shot } from "@/components/shot";
import { GarageGrid } from "@/components/garage-grid";
import { TrackMap } from "@/components/track-map";
import { TimingTower } from "@/components/timing-tower";
import { StintClock } from "@/components/stint-clock";
import { AddressStrip } from "@/components/addresses";
import { GRID_MAX, STINT_SEC } from "@/lib/catalog";
import { usePit } from "@/lib/pit";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const cars = usePit((s) => s.cars);
  return (
    <Shell>
      <Shot src="/shots/hero.jpg" kicker="The box" title="PIT CASH" tall align="right" />

      <div className="mt-4">
        <AddressStrip />
      </div>

      <div className="mt-6">
        <GarageGrid />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-night">
        <div className="flex flex-wrap items-end justify-between gap-3 px-6 pt-6">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Circuit</p>
            <h2 className="font-display text-5xl font-black italic leading-none text-white">Pit Ring</h2>
          </div>
          <p className="pb-1 font-display text-sm text-white/50">
            {GRID_MAX} cars · {STINT_SEC / 60}:00 stint · 10 turns
          </p>
        </div>
        <TrackMap />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/box" className="rounded-md bg-accent px-5 py-2.5 font-display text-base font-bold text-white">
          Stop
        </Link>
        <Link to="/paper" className="rounded-md bg-night px-5 py-2.5 font-display text-base font-semibold text-white">
          Paper
        </Link>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
        <StintClock />
        <TimingTower cars={cars} />
      </div>
    </Shell>
  );
}
