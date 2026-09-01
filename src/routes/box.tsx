import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Connect } from "@/components/connect";
import { TimingTower } from "@/components/timing-tower";
import { StintClock } from "@/components/stint-clock";
import { COMPOUND, GRID_MAX, PIT_CA, isAddress } from "@/lib/catalog";
import { usePit, type CompoundId } from "@/lib/pit";
import { useWallet } from "@/lib/wallet";

export const Route = createFileRoute("/box")({ component: Box });

function Box() {
  const address = useWallet((s) => s.address);
  const cars = usePit((s) => s.cars);
  const stop = usePit((s) => s.stop);
  const flag = usePit((s) => s.flag);
  const stintEndsAt = usePit((s) => s.stintEndsAt);
  const lastFlag = usePit((s) => s.lastFlag);
  const [compound, setCompound] = useState<CompoundId>(0);
  const [msg, setMsg] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const live = isAddress(PIT_CA);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  function onStop() {
    if (!address) {
      setMsg("Connect first.");
      return;
    }
    const err = stop(address, compound);
    setMsg(err ?? "In the box. Demo grid — chain stop waits for PitStop.");
  }

  function onFlag() {
    if (!address) {
      setMsg("Connect first.");
      return;
    }
    const err = flag(address);
    setMsg(err ?? "Flag. Stint reset. On-chain flag pays the 20 when PitStop is live.");
  }

  return (
    <Shell>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">Box</p>
      <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight">Stop or DNF.</h1>
      <p className="mt-3 max-w-xl text-mute">
        One stop per stint. Soft is free. Medium and hard raise weight. First {GRID_MAX} cars. Anyone can throw the flag when the clock dies — 1% bounty.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <StintClock />
          <div className="rounded-lg border border-line bg-panel p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Compound</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {COMPOUND.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCompound(c.id as CompoundId)}
                  className={
                    compound === c.id
                      ? "rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg"
                      : "rounded-md border border-line px-4 py-2 text-sm"
                  }
                >
                  {c.name} ×{c.mult}
                </button>
              ))}
            </div>
            <p className="mt-3 font-mono text-xs text-mute">{COMPOUND[compound].note}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onStop}
                className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-fg"
              >
                Stop
              </button>
              <button
                type="button"
                onClick={onFlag}
                disabled={now < stintEndsAt}
                className="rounded-md border border-line px-5 py-3 text-sm disabled:opacity-40"
              >
                Flag
              </button>
              <Connect />
            </div>
            {msg ? <p className="mt-4 font-mono text-xs text-mute">{msg}</p> : null}
            <p className="mt-4 font-mono text-[11px] text-mute">
              {live ? `PitStop ${PIT_CA}` : "PitStop empty. This wall is the model. LetsCash is second."}
            </p>
            {lastFlag ? <p className="mt-2 font-mono text-[11px] text-mute">Last flag {lastFlag.slice(0, 8)}…</p> : null}
          </div>
        </div>
        <TimingTower cars={cars} />
      </div>
    </Shell>
  );
}
