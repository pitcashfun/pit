import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Connect } from "@/components/connect";
import { EXPLORER_URL, GH_URL, PIT_CA, STINT_SEC, TG_URL, TOKEN_TICKER, X_URL, isAddress, shortCa } from "@/lib/catalog";

const NAV = [
  { to: "/", label: "Garages" },
  { to: "/box", label: "Box" },
  { to: "/paper", label: "Paper" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="sticky top-0 z-20">
        <div className="carbon">
          <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
            <Link to="/" className="flex items-center gap-2 text-white">
              <img src="/logo.jpg" alt="Pit Cash" className="h-9 w-9 rounded-md object-cover" />
              <span className="font-display text-2xl font-black italic tracking-tight">PIT</span>
              <span className="font-display text-2xl font-light italic tracking-tight text-white/80">CASH</span>
            </Link>
            <nav className="ml-2 hidden items-center gap-1 font-display text-lg font-semibold text-white/70 sm:flex">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="border-b-2 border-transparent px-3 py-1 hover:text-white"
                  activeProps={{ className: "border-b-2 border-accent px-3 py-1 text-white" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2 text-white">
              <a href={X_URL} target="_blank" rel="noreferrer" className="hidden px-2 text-sm text-white/70 hover:text-white sm:inline">
                X
              </a>
              <a href={TG_URL} target="_blank" rel="noreferrer" className="hidden px-2 text-sm text-white/70 hover:text-white sm:inline">
                TG
              </a>
              <a href={GH_URL} target="_blank" rel="noreferrer" className="hidden px-2 text-sm text-white/70 hover:text-white sm:inline">
                Git
              </a>
              <Connect night />
            </div>
          </div>
        </div>
        <div className="bg-night text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 font-display text-sm">
            <p className="flex items-center gap-3">
              <span className="font-black italic">STINT</span>
              <span className="text-white/50">
                {String(STINT_SEC / 60).padStart(2, "0")}:00
              </span>
              <span className="text-white/40">·</span>
              <span className="font-semibold">Pit Ring</span>
              {isAddress(PIT_CA) ? (
                <>
                  <span className="text-white/40">·</span>
                  <a
                    href={`${EXPLORER_URL}/address/${PIT_CA}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-white/60 hover:text-white"
                  >
                    {shortCa(PIT_CA)}
                  </a>
                </>
              ) : null}
            </p>
            <Clock />
          </div>
        </div>
      </header>
      <nav className="flex gap-2 overflow-x-auto px-4 py-2 font-display text-base font-semibold sm:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="rounded-full bg-white px-3 py-1"
            activeProps={{ className: "rounded-full bg-night px-3 py-1 text-white" }}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="px-4 pb-10 text-center font-display text-sm text-mute">
        ${TOKEN_TICKER} · pitcash.fun · not a championship
      </footer>
    </div>
  );
}

function Clock() {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const tick = () =>
      setT(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-white/70">
      <span>My time</span>
      <span className="font-mono text-white">{t}</span>
    </p>
  );
}
