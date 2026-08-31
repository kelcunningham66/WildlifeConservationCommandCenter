import type { ThreatAlert } from "./types";

export const threatAlerts: ThreatAlert[] = [
  {
    id: "TH-8841",
    kind: "vehicle",
    severity: "critical",
    title: "Unmarked vehicle in rhino sanctuary after curfew",
    detail:
      "CT-C07 captured a pickup with lights off at 02:11 inside the Sector C exclusion zone. No ranger unit was scheduled. GPS geofence for RH-12 also showed a 1.4 km displacement in 18 minutes.",
    sector: "C",
    source: "camera",
    time: "2026-08-31T02:11:00Z",
    status: "investigating",
  },
  {
    id: "TH-8838",
    kind: "human",
    severity: "critical",
    title: "Two people on foot near known rhino browse",
    detail:
      "Thermal camera CT-C03 flagged two upright human silhouettes 420 m from RH-08. No matching ranger patrol log.",
    sector: "C",
    source: "camera",
    time: "2026-08-31T01:04:00Z",
    status: "open",
  },
  {
    id: "TH-8832",
    kind: "poaching",
    severity: "high",
    title: "Gunshot report from northern buffer",
    detail:
      "Ranger team Echo-2 reported two shots from the charcoal woodland at 19:40. Follow-up found a spent 7.62 casing and elephant dung less than 200 m away.",
    sector: "E",
    source: "ranger",
    time: "2026-08-30T19:40:00Z",
    status: "investigating",
  },
  {
    id: "TH-8824",
    kind: "snare",
    severity: "high",
    title: "Wire snare line along cattle track",
    detail:
      "Patrol recovered 14 cable snares on the Sector E fence line. One zebra carcass. Snares logged and removed.",
    sector: "E",
    source: "ranger",
    time: "2026-08-30T08:15:00Z",
    status: "resolved",
  },
  {
    id: "TH-8819",
    kind: "collar",
    severity: "high",
    title: "Wild dog collar stopped transmitting",
    detail:
      "WD-Alpha collar last pinged at 04:22 on the escarpment. Battery was at 61%. Possible snare, drop-off, or unit failure.",
    sector: "D",
    source: "gps",
    time: "2026-08-30T04:22:00Z",
    status: "open",
  },
  {
    id: "TH-8807",
    kind: "vehicle",
    severity: "moderate",
    title: "Night traffic on the southern access track",
    detail:
      "Vehicle headlights on the F-track at 23:18. Likely fishing crew, but the route also feeds the waterhole funnel.",
    sector: "F",
    source: "vehicle",
    time: "2026-08-29T23:18:00Z",
    status: "resolved",
  },
  {
    id: "TH-8794",
    kind: "fire",
    severity: "moderate",
    title: "Late-season burn on floodplain margin",
    detail:
      "Satellite hotspot cluster, 42 ha. Fire appears contained by the channel. Cheetah hunting grassland reduced.",
    sector: "B",
    source: "satellite",
    time: "2026-08-29T13:50:00Z",
    status: "investigating",
  },
  {
    id: "TH-8771",
    kind: "fence",
    severity: "watch",
    title: "Sanctuary fence voltage drop",
    detail:
      "Eastern rhino fence dropped below 4 kV for 26 minutes. Restored after ranger check; no cut found.",
    sector: "C",
    source: "gps",
    time: "2026-08-28T21:06:00Z",
    status: "resolved",
  },
  {
    id: "TH-8755",
    kind: "encroachment",
    severity: "moderate",
    title: "New charcoal kiln inside buffer",
    detail:
      "PlanetScope scene shows a 0.6 ha clearing and kiln mound 180 m inside the conservancy boundary.",
    sector: "E",
    source: "satellite",
    time: "2026-08-27T09:00:00Z",
    status: "open",
  },
];
