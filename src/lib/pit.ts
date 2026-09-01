import { create } from "zustand";
import { encodeFlag, encodeStop, readPit, sendPit } from "./chain";
import { useWallet } from "./wallet";

export type CompoundId = 0 | 1 | 2;
export type SectorTone = "purple" | "green" | "yellow";

export type Car = {
  slot: number;
  who: string;
  compound: CompoundId;
  weight: number;
  s1: SectorTone;
  s2: SectorTone;
  s3: SectorTone;
  lastMs: number;
};

type PitState = {
  stint: number;
  stintEndsAt: number;
  cars: Car[];
  pot: bigint;
  inBox: boolean;
  pitBal: bigint;
  lastFlag: string;
  lastHash: string;
  busy: boolean;
  error: string;
  hydrate: () => Promise<void>;
  listen: () => () => void;
  stop: (compound: CompoundId) => Promise<string | null>;
  flag: () => Promise<string | null>;
};

const TONE: SectorTone[] = ["purple", "green", "yellow"];

function tones(who: string, slot: number): [SectorTone, SectorTone, SectorTone] {
  const n = who.toLowerCase().charCodeAt(who.length - 1) + slot;
  return [TONE[n % 3]!, TONE[(n + 1) % 3]!, TONE[(n + 2) % 3]!];
}

export const usePit = create<PitState>((set, get) => ({
  stint: 0,
  stintEndsAt: 0,
  cars: [],
  pot: 0n,
  inBox: false,
  pitBal: 0n,
  lastFlag: "",
  lastHash: "",
  busy: false,
  error: "",

  hydrate: async () => {
    try {
      const who = useWallet.getState().address;
      const snap = await readPit(who);
      set({
        stint: snap.stint,
        stintEndsAt: snap.stintEndsAt,
        pot: snap.pot,
        inBox: snap.inBox,
        pitBal: snap.pitBal,
        cars: snap.cars.map((c, i) => {
          const [s1, s2, s3] = tones(c.who, i + 1);
          return {
            slot: i + 1,
            who: c.who,
            compound: c.compound,
            weight: Number(c.weight),
            s1,
            s2,
            s3,
            lastMs: 0,
          };
        }),
        error: "",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "rpc";
      set({ error: msg });
    }
  },

  listen: () => {
    void get().hydrate();
    const id = setInterval(() => void get().hydrate(), 4000);
    return () => clearInterval(id);
  },

  stop: async (compound) => {
    const who = useWallet.getState().address;
    if (!who) return "Connect first.";
    if (Date.now() >= get().stintEndsAt) return "Stint dead. Flag first.";
    if (get().inBox) return "Already in this stint.";
    if (get().cars.length >= 20) return "Grid full. Wait for the flag.";
    if (compound > 0 && get().pitBal === 0n) return "Hold $PIT for that compound.";
    set({ busy: true, error: "" });
    try {
      const hash = await sendPit(encodeStop(compound));
      set({ lastHash: hash, busy: false });
      await get().hydrate();
      return null;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed.";
      set({ busy: false, error: msg });
      return msg;
    }
  },

  flag: async () => {
    const who = useWallet.getState().address;
    if (!who) return "Connect first.";
    if (Date.now() < get().stintEndsAt) return "Stint still green.";
    set({ busy: true, error: "" });
    try {
      const hash = await sendPit(encodeFlag());
      set({ lastHash: hash, lastFlag: who, busy: false });
      await get().hydrate();
      return null;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed.";
      set({ busy: false, error: msg });
      return msg;
    }
  },
}));

