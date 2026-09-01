import { COMPOUND, GRID_MAX } from "@/lib/catalog";
import type { Car, SectorTone } from "@/lib/pit";

const DOT: Record<SectorTone, string> = {
  purple: "bg-s-purple",
  green: "bg-s-green",
  yellow: "bg-s-yellow",
};

function short(who: string) {
  if (who.length < 12) return who;
  return `${who.slice(0, 6)}…${who.slice(-4)}`;
}

export function TimingTower({ cars }: { cars: Car[] }) {
  const rows = Array.from({ length: GRID_MAX }, (_, i) => cars[i] ?? null);
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel">
      <div className="grid grid-cols-[2rem_1fr_3.2rem_3.2rem_3.2rem_4.5rem] gap-0 border-b border-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
        <span>P</span>
        <span>Car</span>
        <span>S1</span>
        <span>S2</span>
        <span>S3</span>
        <span>Tyre</span>
      </div>
      <ol className="tower font-mono text-xs">
        {rows.map((car, i) => (
          <li
            key={i}
            className="grid grid-cols-[2rem_1fr_3.2rem_3.2rem_3.2rem_4.5rem] items-center border-b border-line/60 px-3 py-2 last:border-0"
          >
            <span className="text-mute">{String(i + 1).padStart(2, "0")}</span>
            {car ? (
              <>
                <span className="truncate">{short(car.who)}</span>
                <span className={`sector-dot ${DOT[car.s1]}`} />
                <span className={`sector-dot ${DOT[car.s2]}`} />
                <span className={`sector-dot ${DOT[car.s3]}`} />
                <span className="text-mute">{COMPOUND[car.compound].name}</span>
              </>
            ) : (
              <>
                <span className="text-mute">—</span>
                <span className="text-line">·</span>
                <span className="text-line">·</span>
                <span className="text-line">·</span>
                <span className="text-mute">OPEN</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
