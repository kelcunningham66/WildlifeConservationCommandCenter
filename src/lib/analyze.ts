import { createHash } from "crypto";
import type { CameraDetection, SectorId, ThreatSeverity } from "@/data/types";

export interface ImageFeatures {
  hash: string;
  filename: string;
  byteLength: number;
  luminance?: number;
  greenRatio?: number;
  warmRatio?: number;
}

const samples: Record<string, CameraDetection> = {
  elephant: {
    species: "African savanna elephant",
    scientificName: "Loxodonta africana",
    confidence: 0.96,
    count: 7,
    individuals: ["EL-M07 (matriarch)", "EL-F19", "EL-C04", "4 unmarked"],
    humans: 0,
    vehicles: 0,
    otherThreats: [],
    timeOfDay: "night",
    location: "East pan, Camera CT-B14",
    sector: "B",
    capturedAt: "02:41 AM",
    notes:
      "Cow-calf herd watering. Ear-notch on the lead cow matches EL-M07 from the 2024 catalogue.",
    threatLevel: "none",
  },
  rhino: {
    species: "South-central black rhino",
    scientificName: "Diceros bicornis minor",
    confidence: 0.99,
    count: 1,
    individuals: ["RH-12"],
    humans: 0,
    vehicles: 0,
    otherThreats: [],
    timeOfDay: "night",
    location: "Sanctuary browse line, CT-C03",
    sector: "C",
    capturedAt: "01:18 AM",
    notes: "Solitary bull. Collar heartbeat confirmed 4 minutes after the frame.",
    threatLevel: "none",
  },
  vehicle: {
    species: "No wildlife in primary box",
    confidence: 0.93,
    count: 0,
    humans: 2,
    vehicles: 1,
    otherThreats: ["Unmarked pickup", "Lights off", "After curfew in exclusion zone"],
    timeOfDay: "night",
    location: "Rhino sanctuary track, CT-C07",
    sector: "C",
    capturedAt: "02:11 AM",
    notes:
      "Pickup with two occupants inside the Sector C no-go zone. No ranger unit was booked. Escalated as a critical poaching risk.",
    threatLevel: "critical",
  },
  human: {
    species: "No wildlife in primary box",
    confidence: 0.9,
    count: 0,
    humans: 2,
    vehicles: 0,
    otherThreats: ["Unregistered foot party", "Proximity to rhino browse"],
    timeOfDay: "night",
    location: "Mopane thicket, CT-C03",
    sector: "C",
    capturedAt: "01:04 AM",
    notes: "Two upright thermal silhouettes 420 m from RH-08. No matching patrol log.",
    threatLevel: "critical",
  },
  lion: {
    species: "African lion",
    scientificName: "Panthera leo",
    confidence: 0.91,
    count: 4,
    individuals: ["LN-Kafue-F1", "3 pride members"],
    humans: 0,
    vehicles: 0,
    otherThreats: [],
    timeOfDay: "night",
    location: "Southern pan, CT-F08",
    sector: "F",
    capturedAt: "10:05 PM",
    notes: "Kafue pride on a buffalo carcass. No human activity in adjacent cameras.",
    threatLevel: "none",
  },
  snare: {
    species: "Plains zebra (carcass)",
    scientificName: "Equus quagga",
    confidence: 0.84,
    count: 1,
    humans: 0,
    vehicles: 0,
    otherThreats: ["Cable snare", "Wire loop on cattle track"],
    timeOfDay: "day",
    location: "Northern buffer fence, CT-E16",
    sector: "E",
    capturedAt: "08:15 AM",
    notes: "Zebra down in a cable snare. Patrol dispatched; 13 additional snares pulled from the same line.",
    threatLevel: "high",
  },
};

const catalog: Array<Omit<CameraDetection, "capturedAt" | "location">> = [
  {
    species: "African savanna elephant",
    scientificName: "Loxodonta africana",
    confidence: 0.92,
    count: 3,
    humans: 0,
    vehicles: 0,
    otherThreats: [],
    timeOfDay: "dusk",
    sector: "A",
    notes: "Bulls moving toward the Luena channel.",
    threatLevel: "none",
  },
  {
    species: "Cape buffalo",
    scientificName: "Syncerus caffer",
    confidence: 0.81,
    count: 22,
    humans: 0,
    vehicles: 0,
    otherThreats: [],
    timeOfDay: "day",
    sector: "F",
    notes: "Herd dusting at the remaining southern pan.",
    threatLevel: "none",
  },
  {
    species: "African leopard",
    scientificName: "Panthera pardus",
    confidence: 0.86,
    count: 1,
    humans: 0,
    vehicles: 0,
    otherThreats: [],
    timeOfDay: "night",
    sector: "D",
    notes: "Single adult on the kopje trail. Flank not yet matched.",
    threatLevel: "none",
  },
  {
    species: "African wild dog",
    scientificName: "Lycaon pictus",
    confidence: 0.88,
    count: 6,
    humans: 0,
    vehicles: 0,
    otherThreats: [],
    timeOfDay: "dawn",
    sector: "D",
    notes: "Pack fragment hunting along the escarpment road.",
    threatLevel: "none",
  },
  {
    species: "Thornicroft’s giraffe",
    scientificName: "Giraffa camelopardalis thornicrofti",
    confidence: 0.9,
    count: 2,
    humans: 0,
    vehicles: 0,
    otherThreats: [],
    timeOfDay: "day",
    sector: "A",
    notes: "Known cow GI-11 with a yearling.",
    threatLevel: "none",
  },
];

const cameras: Record<SectorId, string[]> = {
  A: ["CT-A11", "CT-A04"],
  B: ["CT-B14", "CT-B02"],
  C: ["CT-C03", "CT-C07"],
  D: ["CT-D02", "CT-D19"],
  E: ["CT-E16", "CT-E01"],
  F: ["CT-F08", "CT-F01"],
};

function hashToInt(hash: string) {
  return Number.parseInt(hash.slice(0, 8), 16);
}

function guessFromName(name: string): CameraDetection | null {
  const n = name.toLowerCase();
  if (n.includes("vehicle") || n.includes("pickup") || n.includes("truck")) return samples.vehicle;
  if (n.includes("snare") || n.includes("poach")) return samples.snare;
  if (n.includes("human") || n.includes("ranger") || n.includes("person")) return samples.human;
  if (n.includes("rhino")) return samples.rhino;
  if (n.includes("lion")) return samples.lion;
  if (n.includes("elephant")) return samples.elephant;
  return null;
}

function timeFromLuminance(luminance?: number): CameraDetection["timeOfDay"] {
  if (luminance === undefined) return "night";
  if (luminance < 55) return "night";
  if (luminance < 90) return "dawn";
  if (luminance < 140) return "dusk";
  return "day";
}

export function analyzeFeatures(features: ImageFeatures): CameraDetection {
  const named = guessFromName(features.filename);
  if (named) return named;

  const seed = hashToInt(features.hash);
  const base = { ...catalog[seed % catalog.length] };

  if ((features.warmRatio ?? 0) > 0.18 && (features.luminance ?? 100) < 80) {
    return {
      ...samples.vehicle,
      confidence: 0.78 + (seed % 12) / 100,
      notes:
        "Warm compact shape consistent with a vehicle engine bay. Review recommended — this is a heuristic flag, not a confirmed ID.",
    };
  }

  const sector = base.sector;
  const cam = cameras[sector][seed % cameras[sector].length];
  const timeOfDay = timeFromLuminance(features.luminance);
  const hour =
    timeOfDay === "night" ? "02:41 AM" : timeOfDay === "dawn" ? "05:52 AM" : timeOfDay === "dusk" ? "06:18 PM" : "11:04 AM";

  const extraCount = seed % 4;
  const threatLevel: ThreatSeverity | "none" =
    base.humans > 0 || base.vehicles > 0 ? "high" : "none";

  return {
    ...base,
    count: Math.max(1, base.count + extraCount - 1),
    confidence: Math.min(0.98, Math.max(0.72, base.confidence - (seed % 9) / 100)),
    timeOfDay,
    location: `${sector} grid, ${cam}`,
    capturedAt: hour,
    threatLevel,
  };
}

export function hashBuffer(buf: Buffer) {
  return createHash("sha256").update(buf).digest("hex");
}

export const sampleDetections = samples;
