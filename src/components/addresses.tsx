import { useState } from "react";
import { EXPLORER_URL, PIT_CA, TOKEN_CA, isAddress, shortCa } from "@/lib/catalog";

function Row({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const live = isAddress(value);
  async function copy() {
    if (!live) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-3 first:border-t-0">
      <div>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-white/45">{label}</p>
        <p className="mt-1 font-mono text-sm text-white">{live ? value : "— waiting LetsCash"}</p>
      </div>
      <div className="flex gap-2">
        {live ? (
          <>
            <button type="button" onClick={copy} className="rounded-md bg-white/10 px-3 py-1.5 text-xs text-white">
              {copied ? "Copied" : "Copy"}
            </button>
            <a
              href={`${EXPLORER_URL}/address/${value}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg"
            >
              Explorer
            </a>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function AddressStrip() {
  return (
    <section className="overflow-hidden rounded-2xl bg-night">
      <Row label="PitStop" value={PIT_CA} />
      <Row label="$PIT" value={TOKEN_CA} />
    </section>
  );
}

export function PitChip() {
  if (!isAddress(PIT_CA)) return null;
  return (
    <a
      href={`${EXPLORER_URL}/address/${PIT_CA}`}
      target="_blank"
      rel="noreferrer"
      className="font-mono text-[11px] text-white/60 hover:text-white"
    >
      PitStop {shortCa(PIT_CA)}
    </a>
  );
}
