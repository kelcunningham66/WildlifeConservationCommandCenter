export type IucnStatus =
  | "Least Concern"
  | "Near Threatened"
  | "Vulnerable"
  | "Endangered"
  | "Critically Endangered";

export type Trend = "declining" | "stable" | "recovering" | "increasing";

export type ThreatSeverity = "critical" | "high" | "moderate" | "watch";

export type ThreatKind =
  | "poaching"
  | "vehicle"
  | "human"
  | "snare"
  | "fire"
  | "encroachment"
  | "collar"
  | "fence";

export type SectorId = "A" | "B" | "C" | "D" | "E" | "F";

export interface Sector {
  id: SectorId;
  name: string;
  habitat: string;
  notes: string;
  risk: ThreatSeverity;
  x: number;
  y: number;
  path: string;
}

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  iucn: IucnStatus;
  trend: Trend;
  currentEstimate: number;
  previousEstimate: number;
  projection12m: number;
  ciLow: number;
  ciHigh: number;
  individualsKnown: number;
  preferredSectors: SectorId[];
  notes: string;
}

export interface MonthlyCount {
  month: string;
  count: number;
}

export interface Sighting {
  id: string;
  speciesId: string;
  count: number;
  sector: SectorId;
  camera: string;
  time: string;
  confidence: number;
  notes: string;
}

export interface ThreatAlert {
  id: string;
  kind: ThreatKind;
  severity: ThreatSeverity;
  title: string;
  detail: string;
  sector: SectorId;
  source: "camera" | "gps" | "ranger" | "vehicle" | "satellite";
  time: string;
  status: "open" | "investigating" | "resolved";
}

export interface HabitatMetric {
  month: string;
  ndvi: number;
  waterIndex: number;
  burnedHa: number;
  encroachmentHa: number;
}

export interface CameraDetection {
  species: string;
  scientificName?: string;
  confidence: number;
  count: number;
  individuals?: string[];
  humans: number;
  vehicles: number;
  otherThreats: string[];
  timeOfDay: "night" | "dawn" | "day" | "dusk";
  location: string;
  sector: SectorId;
  capturedAt: string;
  notes: string;
  threatLevel: ThreatSeverity | "none";
}
