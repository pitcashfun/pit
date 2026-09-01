import { useEffect, useState } from "react";
import { STINT_SEC } from "@/lib/catalog";
import { usePit } from "@/lib/pit";

function fmt(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function StintClock() {
  const stintEndsAt = usePit((s) => s.stintEndsAt);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);
  const left = stintEndsAt - now;
  const live = left > 0;
  const pct = live ? Math.min(100, (left / (STINT_SEC * 1000)) * 100) : 0;
  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">Stint</p>
      <p className="mt-2 font-display text-6xl font-semibold leading-none tracking-tight">{fmt(left)}</p>
      <p className="mt-2 font-mono text-xs text-mute">{live ? "GREEN" : "FLAG WINDOW"}</p>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
