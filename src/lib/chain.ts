import { PIT_CA, TOKEN_CA, isAddress } from "./catalog";
import { RH_RPC, ensureChain, useWallet, type Eip } from "./wallet";

export const SEL = {
  stop: "0x96153396",
  flag: "0x890eba68",
  pitToken: "0xf25ba28a",
  stint: "0x4590c3f4",
  stintEndsAt: "0x143e5af9",
  filled: "0x5c0133d9",
  pot: "0x4ba2363a",
  grid: "0x822858d6",
  inStint: "0x5eb27cec",
  balanceOf: "0x70a08231",
} as const;

const REVERT: Record<string, string> = {
  "0x3b334652": "Stint dead. Flag first.",
  "0xf36efb6f": "Grid full. Wait for the flag.",
  "0x3e422662": "Already in this stint.",
  "0xe143a034": "Box rejected.",
  "0xab8a0360": "Not the owner.",
};

function word(n: bigint | number | string) {
  if (typeof n === "string") {
    const h = n.startsWith("0x") ? n.slice(2) : n;
    return h.padStart(64, "0");
  }
  return BigInt(n).toString(16).padStart(64, "0");
}

function asHex(v: unknown) {
  if (typeof v !== "string" || !v.startsWith("0x")) return "";
  return v;
}

function asBig(hex: string) {
  if (!hex || hex === "0x") return 0n;
  return BigInt(hex);
}

function asAddr(wordHex: string) {
  const h = wordHex.replace(/^0x/, "").padStart(64, "0");
  return ("0x" + h.slice(24)).toLowerCase();
}

function rpcBody(method: string, params: unknown[]) {
  return JSON.stringify({ jsonrpc: "2.0", id: 1, method, params });
}

async function rpcCall(data: string, from?: string): Promise<string> {
  const p = useWallet.getState().provider;
  if (p) {
    try {
      const res = await p.request({
        method: "eth_call",
        params: [{ to: PIT_CA, data, ...(from ? { from } : {}) }, "latest"],
      });
      return asHex(res);
    } catch {
      /* public rpc */
    }
  }
  const res = await fetch(RH_RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: rpcBody("eth_call", [{ to: PIT_CA, data, ...(from ? { from } : {}) }, "latest"]),
  });
  const j = (await res.json()) as { result?: string; error?: { message?: string } };
  if (!j.result) throw new Error(j.error?.message ?? "rpc");
  return j.result;
}

async function tokenCall(data: string): Promise<string> {
  if (!isAddress(TOKEN_CA)) return "0x0";
  const p = useWallet.getState().provider;
  if (p) {
    try {
      const res = await p.request({
        method: "eth_call",
        params: [{ to: TOKEN_CA, data }, "latest"],
      });
      return asHex(res);
    } catch {
      /* public rpc */
    }
  }
  const res = await fetch(RH_RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: rpcBody("eth_call", [{ to: TOKEN_CA, data }, "latest"]),
  });
  const j = (await res.json()) as { result?: string };
  return j.result ?? "0x0";
}

export type ChainCar = {
  who: string;
  compound: 0 | 1 | 2;
  weight: bigint;
  paid: boolean;
};

export type PitSnap = {
  stint: number;
  stintEndsAt: number;
  filled: number;
  pot: bigint;
  pitToken: string;
  cars: ChainCar[];
  inBox: boolean;
  pitBal: bigint;
};

export async function readPit(who = ""): Promise<PitSnap> {
  const [stintH, endsH, filledH, potH, tokenH] = await Promise.all([
    rpcCall(SEL.stint),
    rpcCall(SEL.stintEndsAt),
    rpcCall(SEL.filled),
    rpcCall(SEL.pot),
    rpcCall(SEL.pitToken),
  ]);
  const stint = Number(asBig(stintH));
  const filled = Number(asBig(filledH));
  const cars: ChainCar[] = [];
  for (let i = 0; i < filled; i++) {
    const raw = await rpcCall(SEL.grid + word(stint) + word(i));
    const body = raw.replace(/^0x/, "").padEnd(256, "0");
    const whoA = asAddr(body.slice(0, 64));
    const compound = Number(asBig("0x" + body.slice(64, 128))) as 0 | 1 | 2;
    const weight = asBig("0x" + body.slice(128, 192));
    const paid = asBig("0x" + body.slice(192, 256)) !== 0n;
    if (whoA === "0x0000000000000000000000000000000000000000") continue;
    cars.push({ who: whoA, compound, weight, paid });
  }
  let inBox = false;
  let pitBal = 0n;
  if (isAddress(who)) {
    const inH = await rpcCall(SEL.inStint + word(stint) + word(who.toLowerCase()));
    inBox = asBig(inH) !== 0n;
    const balH = await tokenCall(SEL.balanceOf + word(who.toLowerCase()));
    pitBal = asBig(balH);
  }
  return {
    stint,
    stintEndsAt: Number(asBig(endsH)) * 1000,
    filled,
    pot: asBig(potH),
    pitToken: asAddr(tokenH.replace(/^0x/, "").slice(-64)),
    cars,
    inBox,
    pitBal,
  };
}

export function revertMsg(e: unknown) {
  const err = e as {
    data?: string;
    message?: string;
    shortMessage?: string;
    error?: { data?: string; message?: string };
  };
  const data = [err.data, err.error?.data]
    .filter((x): x is string => typeof x === "string")
    .find((x) => x.startsWith("0x"));
  if (data) {
    const sel = data.slice(0, 10).toLowerCase();
    if (REVERT[sel]) return REVERT[sel];
  }
  const m = err.shortMessage || err.message || err.error?.message || "";
  if (/reject|denied/i.test(m)) return "Rejected.";
  if (/Early/i.test(m)) return "Stint dead. Flag first.";
  if (/Full/i.test(m)) return "Grid full. Wait for the flag.";
  if (/In\b/.test(m)) return "Already in this stint.";
  return m.slice(0, 140) || "Failed.";
}

export async function sendPit(data: string) {
  const { provider, address } = useWallet.getState();
  if (!provider || !address) throw new Error("Connect first.");
  await ensureChain(provider);
  try {
    const hash = await provider.request({
      method: "eth_sendTransaction",
      params: [{ from: address, to: PIT_CA, data, value: "0x0" }],
    });
    if (typeof hash !== "string") throw new Error("No hash.");
    await waitReceipt(provider, hash);
    return hash;
  } catch (e) {
    throw new Error(revertMsg(e));
  }
}

async function waitReceipt(p: Eip, hash: string) {
  for (let i = 0; i < 40; i++) {
    const r = await p.request({ method: "eth_getTransactionReceipt", params: [hash] });
    if (r && typeof r === "object") {
      const status = (r as { status?: string }).status;
      if (status === "0x0") throw new Error("Reverted.");
      if (status === "0x1") return;
    }
    await new Promise((ok) => setTimeout(ok, 1500));
  }
  throw new Error("Pending. Check the explorer.");
}

export function encodeStop(compound: number) {
  return SEL.stop + word(compound);
}

export function encodeFlag() {
  return SEL.flag;
}

export function fmtEth(wei: bigint) {
  const n = Number(wei) / 1e18;
  if (!Number.isFinite(n) || n === 0) return "0";
  if (n < 0.0001) return n.toExponential(2);
  return n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}
