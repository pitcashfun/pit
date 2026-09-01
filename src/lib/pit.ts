import { create } from "zustand";
import { COMPOUND, GRID_MAX, STINT_SEC } from "./catalog";

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
  stintEndsAt: number;
  cars: Car[];
  lastFlag: string;
  stop: (who: string, compound: CompoundId) => string | null;
  flag: (caller: string) => string | null;
  tickEndsAt: () => number;
};

function tones(): [SectorTone, SectorTone, SectorTone] {
  const pool: SectorTone[] = ["purple", "green", "yellow"];
  return [
    pool[Math.floor(Math.random() * 3)]!,
    pool[Math.floor(Math.random() * 3)]!,
    pool[Math.floor(Math.random() * 3)]!,
  ];
}

function seed(): Car[] {
  const demo = [
    "0xA11CE0000000000000000000000000000000PIT1",
    "0xB0B00000000000000000000000000000000PIT2",
    "0xCA5H0000000000000000000000000000000PIT3",
    "0xD4SH0000000000000000000000000000000PIT4",
    "0xE1ITE000000000000000000000000000000PIT5",
  ];
  return demo.map((who, i) => {
    const compound = (i % 3) as CompoundId;
    const [s1, s2, s3] = tones();
    return {
      slot: i + 1,
      who,
      compound,
      weight: (3 - i) * COMPOUND[compound].mult * 100,
      s1,
      s2,
      s3,
      lastMs: 82000 + i * 340,
    };
  });
}

export const usePit = create<PitState>((set, get) => ({
  stintEndsAt: Date.now() + STINT_SEC * 1000,
  cars: seed(),
  lastFlag: "",
  tickEndsAt: () => get().stintEndsAt,
  stop: (who, compound) => {
    const cars = [...get().cars];
    if (cars.some((c) => c.who.toLowerCase() === who.toLowerCase())) {
      return "Already in this stint.";
    }
    if (cars.length >= GRID_MAX) return "Grid full. Wait for the flag.";
    const [s1, s2, s3] = tones();
    cars.push({
      slot: cars.length + 1,
      who,
      compound,
      weight: COMPOUND[compound].mult * 250,
      s1,
      s2,
      s3,
      lastMs: 80000 + Math.floor(Math.random() * 8000),
    });
    set({ cars });
    return null;
  },
  flag: (caller) => {
    if (Date.now() < get().stintEndsAt) return "Stint still green.";
    set({
      cars: [],
      lastFlag: caller,
      stintEndsAt: Date.now() + STINT_SEC * 1000,
    });
    return null;
  },
}));
