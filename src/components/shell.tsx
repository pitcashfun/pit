import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Connect } from "@/components/connect";
import { GH_URL, TG_URL, TOKEN_TICKER, X_URL } from "@/lib/catalog";

const NAV = [
  { to: "/", label: "Wall" },
  { to: "/box", label: "Box" },
  { to: "/paper", label: "Paper" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="size-8" />
            <span className="font-display text-2xl font-semibold tracking-tight">PITCASH</span>
          </Link>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-mute sm:block">The box</p>
          <nav className="ml-auto flex flex-wrap items-center gap-1 font-mono text-xs uppercase tracking-wider text-mute">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-none border-b-2 border-transparent px-3 py-2 hover:text-ink"
                activeProps={{ className: "rounded-none border-b-2 border-accent px-3 py-2 text-ink" }}
              >
                {n.label}
              </Link>
            ))}
            <a href={X_URL} target="_blank" rel="noreferrer" className="rounded-md px-3 py-2 hover:text-ink">
              X
            </a>
            <a href={TG_URL} target="_blank" rel="noreferrer" className="rounded-md px-3 py-2 hover:text-ink">
              TG
            </a>
            <a href={GH_URL} target="_blank" rel="noreferrer" className="rounded-md px-3 py-2 hover:text-ink">
              Git
            </a>
            <Connect />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="px-4 pb-10 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
        ${TOKEN_TICKER} · pitcash.fun · not affiliated with any championship
      </footer>
    </div>
  );
}
