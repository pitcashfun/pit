import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { GRID_MAX, STINT_SEC } from "@/lib/catalog";

export const Route = createFileRoute("/paper")({ component: Paper });

const ROWS = [
  {
    t: "The pad",
    d: "LetsCash takes a cut of every swap in ETH. Point the rest at PitStop. That is the pot. We never sell $PIT to pay.",
  },
  {
    t: "The stint",
    d: `${STINT_SEC / 60} minutes. Same clock as this chain. Undercut: stop early, take a slot. Overcut: wait, risk a full grid.`,
  },
  {
    t: "The box",
    d: `stop(compound). Soft ×1, medium ×2, hard ×3. One car per wallet per stint. Cap ${GRID_MAX}. Weight is balance × compound, written on-chain at the stop.`,
  },
  {
    t: "The flag",
    d: "When the clock dies anyone calls flag(). 1% bounty to the caller. The 20 split the pot by weight. No merkle. No private keeper.",
  },
  {
    t: "The factory",
    d: "Later: other LetsCash coins paste their stream into a race. $PIT is fuel to enter the box. Not a second launchpad. Not an agent runtime.",
  },
  {
    t: "Sectors",
    d: "Purple session best. Green personal best. Yellow off pace. Timing language only — not a championship mark.",
  },
];

function Paper() {
  return (
    <Shell>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">Paper</p>
      <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight">How the box works.</h1>
      <p className="mt-3 max-w-xl text-mute">
        Infrastructure is a standard pit lane. One rulebook. Many cars. The first race is $PIT itself.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {ROWS.map((r) => (
          <article key={r.t} className="rounded-lg border border-line bg-panel p-6">
            <h2 className="font-display text-2xl font-semibold">{r.t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-mute">{r.d}</p>
          </article>
        ))}
      </div>
      <Link to="/box" className="mt-8 inline-block rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-fg">
        Open the box
      </Link>
    </Shell>
  );
}
