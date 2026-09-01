import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Shot } from "@/components/shot";
import { Connect } from "@/components/connect";
import { TimingTower } from "@/components/timing-tower";
import { StintClock } from "@/components/stint-clock";
import { AddressStrip } from "@/components/addresses";
import { COMPOUND, EXPLORER_URL, GRID_MAX, PIT_CA, isAddress } from "@/lib/catalog";
import { fmtEth } from "@/lib/chain";
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
  const lastHash = usePit((s) => s.lastHash);
  const busy = usePit((s) => s.busy);
  const inBox = usePit((s) => s.inBox);
  const pitBal = usePit((s) => s.pitBal);
  const hydrate = usePit((s) => s.hydrate);
  const [compound, setCompound] = useState<CompoundId>(0);
  const [msg, setMsg] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const live = isAddress(PIT_CA);
  const green = now < stintEndsAt;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    void hydrate();
  }, [address, hydrate]);

  async function onStop() {
    if (!address) {
      setMsg("Connect first.");
      return;
    }
    setMsg("Wallet…");
    const err = await stop(compound);
    setMsg(err ?? "In the box.");
  }

  async function onFlag() {
    if (!address) {
      setMsg("Connect first.");
      return;
    }
    setMsg("Wallet…");
    const err = await flag();
    setMsg(err ?? "Flag thrown. Next stint is green.");
  }

  return (
    <Shell>
      <Shot src="/shots/stop.jpg" kicker="Box" title="Stop or DNF." />
      <p className="mt-4 max-w-xl text-mute">
        One stop per stint. Soft is free. Medium and hard raise weight. First {GRID_MAX} cars. Anyone can throw the flag
        when the clock dies — 1% bounty.
      </p>
      <div className="mt-4">
        <AddressStrip />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <StintClock />
          <div className="rounded-2xl border border-line bg-panel p-5">
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
            {address ? (
              <p className="mt-2 font-mono text-xs text-mute">
                bag {fmtEth(pitBal)} $PIT{inBox ? " · already in" : ""}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void onStop()}
                disabled={busy || !green}
                className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-fg disabled:opacity-40"
              >
                {busy ? "…" : "Stop"}
              </button>
              <button
                type="button"
                onClick={() => void onFlag()}
                disabled={busy || green}
                className="rounded-md border border-line px-5 py-3 text-sm disabled:opacity-40"
              >
                {busy ? "…" : "Flag"}
              </button>
              <Connect />
            </div>
            {msg ? <p className="mt-4 font-mono text-xs text-mute">{msg}</p> : null}
            <p className="mt-4 font-mono text-[11px] text-mute">
              {live
                ? green
                  ? "Clock live. Stop writes on-chain."
                  : "Clock dead. Flag opens the next 3:00."
                : "PitStop empty."}
            </p>
            {lastHash ? (
              <a
                href={`${EXPLORER_URL}/tx/${lastHash}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block font-mono text-[11px] text-mute underline"
              >
                tx {lastHash.slice(0, 10)}…
              </a>
            ) : null}
            {lastFlag ? <p className="mt-2 font-mono text-[11px] text-mute">Last flag {lastFlag.slice(0, 8)}…</p> : null}
          </div>
        </div>
        <TimingTower cars={cars} />
      </div>
    </Shell>
  );
}
