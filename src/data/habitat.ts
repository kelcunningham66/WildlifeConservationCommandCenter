import type { HabitatMetric } from "./types";

export const habitatSeries: HabitatMetric[] = [
  { month: "2025-09", ndvi: 0.52, waterIndex: 0.41, burnedHa: 18, encroachmentHa: 2.1 },
  { month: "2025-10", ndvi: 0.48, waterIndex: 0.33, burnedHa: 64, encroachmentHa: 2.4 },
  { month: "2025-11", ndvi: 0.55, waterIndex: 0.38, burnedHa: 12, encroachmentHa: 2.6 },
  { month: "2025-12", ndvi: 0.61, waterIndex: 0.52, burnedHa: 0, encroachmentHa: 2.8 },
  { month: "2026-01", ndvi: 0.68, waterIndex: 0.71, burnedHa: 0, encroachmentHa: 2.9 },
  { month: "2026-02", ndvi: 0.72, waterIndex: 0.78, burnedHa: 0, encroachmentHa: 3.0 },
  { month: "2026-03", ndvi: 0.7, waterIndex: 0.74, burnedHa: 0, encroachmentHa: 3.1 },
  { month: "2026-04", ndvi: 0.64, waterIndex: 0.66, burnedHa: 4, encroachmentHa: 3.3 },
  { month: "2026-05", ndvi: 0.58, waterIndex: 0.54, burnedHa: 9, encroachmentHa: 3.6 },
  { month: "2026-06", ndvi: 0.51, waterIndex: 0.42, burnedHa: 21, encroachmentHa: 3.9 },
  { month: "2026-07", ndvi: 0.44, waterIndex: 0.31, burnedHa: 48, encroachmentHa: 4.2 },
  { month: "2026-08", ndvi: 0.39, waterIndex: 0.24, burnedHa: 86, encroachmentHa: 4.8 },
];

export const habitatNotes = [
  {
    title: "Dry-season water collapse",
    body: "Southern pans are 38% below the 10-year August mean. Buffalo and elephant are concentrating on three remaining holes, which raises both disease and poaching risk.",
  },
  {
    title: "Fire on the floodplain margin",
    body: "86 ha burned this month, mostly in Sector B. Short-grass hunting habitat for cheetah is contracting as mopane thicket expands behind the fire line.",
  },
  {
    title: "Buffer encroachment",
    body: "Charcoal clearing inside Sector E is up 1.9 ha since March. The new kiln sits on an elephant night path used to reach riverine browse.",
  },
];
