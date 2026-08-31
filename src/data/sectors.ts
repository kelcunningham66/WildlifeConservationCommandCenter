import type { Sector } from "./types";

export const conservancy = {
  name: "Mopane Ridge Conservancy",
  region: "Zambezi–Kafue corridor",
  areaKm2: 1840,
  established: 2009,
  lastSync: "2026-08-31T23:10:00Z",
  camerasOnline: 86,
  camerasTotal: 92,
  rangersDeployed: 24,
};

export const sectors: Sector[] = [
  {
    id: "A",
    name: "Riverine woodland",
    habitat: "Gallery forest along the Luena channel",
    notes: "Elephant and hippo corridor. Seasonal flooding Apr–Jun.",
    risk: "moderate",
    x: 22,
    y: 42,
    path: "M 8 28 C 18 18, 32 22, 38 36 C 40 48, 28 62, 16 58 C 6 52, 4 38, 8 28 Z",
  },
  {
    id: "B",
    name: "Floodplain grassland",
    habitat: "Open dambo and termite-mound savanna",
    notes: "Highest elephant density. Night herds around Camera CT-B14.",
    risk: "high",
    x: 48,
    y: 38,
    path: "M 38 30 C 50 18, 68 20, 74 36 C 76 48, 62 56, 46 54 C 36 50, 32 38, 38 30 Z",
  },
  {
    id: "C",
    name: "Rhino sanctuary",
    habitat: "Closed mopane woodland, fenced core",
    notes: "Intensive protection zone. Vehicle traffic after dusk is prohibited.",
    risk: "critical",
    x: 72,
    y: 32,
    path: "M 70 16 C 82 12, 96 18, 98 32 C 96 44, 84 48, 72 44 C 64 38, 64 22, 70 16 Z",
  },
  {
    id: "D",
    name: "Escarpment kopjes",
    habitat: "Granite outcrops and miombo",
    notes: "Leopard dens. Limited vehicle access; ranger foot patrols.",
    risk: "watch",
    x: 78,
    y: 62,
    path: "M 62 52 C 74 48, 92 54, 96 68 C 92 80, 76 82, 64 74 C 56 66, 56 56, 62 52 Z",
  },
  {
    id: "E",
    name: "Northern buffer",
    habitat: "Farm edge and charcoal woodland",
    notes: "Human–wildlife interface. Most snares and vehicle incursions.",
    risk: "critical",
    x: 28,
    y: 18,
    path: "M 12 8 C 28 2, 52 4, 58 16 C 54 26, 36 28, 18 24 C 8 20, 6 12, 12 8 Z",
  },
  {
    id: "F",
    name: "Southern waterholes",
    habitat: "Seasonal pans and migration funnel",
    notes: "Dry-season concentration. Fire risk August–October.",
    risk: "high",
    x: 42,
    y: 74,
    path: "M 18 66 C 32 60, 58 62, 64 74 C 60 88, 40 92, 22 86 C 12 80, 12 70, 18 66 Z",
  },
];

export function sectorById(id: string) {
  return sectors.find((s) => s.id === id);
}
