export const TOKEN_NAME = "Pitcash";
export const TOKEN_TICKER = "PIT";
export const SITE_HOST = "pitcash.fun";
export const SITE_URL = "https://pitcash.fun";
export const X_URL = "https://x.com/pitcashfun";
export const GH_URL = "https://github.com/pitcashfun/pit";
export const TG_URL = "https://t.me/pitcashfun";
export const LETSCASH_URL = "https://www.letscash.fun";
export const CHAIN_ID = 4663;
export const CHAIN_NAME = "Robinhood Chain";
export const EXPLORER_URL = "https://robinhoodchain.blockscout.com";

/** Empty until Remix + LetsCash. Never invent. */
export const TOKEN_CA = "";
export const PIT_CA = "0x74Fe3e0dC82dbDB69D50B854dd6f492f93f74dd9";

export const TAX_BPS = 500;
export const PLATFORM_BPS = 30;
export const CREATOR_BPS = 470;
export const STINT_SEC = 180;
export const GRID_MAX = 20;
export const BOUNTY_BPS = 100;

export const COMPOUND = [
  { id: 0, name: "SOFT", mult: 1, note: "Free stop. Grid only." },
  { id: 1, name: "MEDIUM", mult: 2, note: "Hold $PIT. Double weight." },
  { id: 2, name: "HARD", mult: 3, note: "Burn a slice. Triple weight." },
] as const;

export function isAddress(v: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(v.trim());
}

export function shortCa(ca: string) {
  const t = ca.trim();
  if (!isAddress(t)) return "";
  return `${t.slice(0, 6)}…${t.slice(-4)}`;
}
