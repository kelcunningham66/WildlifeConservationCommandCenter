"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReserveMap } from "@/components/map/reserve-map";
import { SeverityDot } from "@/components/status-badges";
import { threatAlerts } from "@/data/threats";
import type { SectorId, ThreatKind } from "@/data/types";
import { cn } from "@/lib/utils";

const kinds: Array<ThreatKind | "all"> = [
  "all",
  "poaching",
  "vehicle",
  "human",
  "snare",
  "fire",
  "encroachment",
  "collar",
  "fence",
];

export default function ThreatsPage() {
  const [kind, setKind] = useState<(typeof kinds)[number]>("all");
  const [sector, setSector] = useState<SectorId | undefined>();
  const [selected, setSelected] = useState(threatAlerts[0].id);

  const filtered = useMemo(
    () =>
      threatAlerts.filter((t) => (kind === "all" || t.kind === kind) && (!sector || t.sector === sector)),
    [kind, sector]
  );

  const active = filtered.find((t) => t.id === selected) ?? filtered[0];
  const counts = threatAlerts.reduce<Partial<Record<SectorId, number>>>((acc, t) => {
    if (t.status !== "resolved") acc[t.sector] = (acc[t.sector] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Poaching / threat detection</p>
        <h1 className="font-heading text-3xl tracking-tight">Threat desk</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Suspicious activity is fused from camera traps, collar GPS, ranger reports, vehicle sightings, and
          satellite hotspots. Night traffic in the rhino sanctuary is always treated as critical.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {kinds.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm capitalize",
              kind === k ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <ReserveMap
            highlight={sector}
            counts={counts}
            onSelect={(id) => setSector((cur) => (cur === id ? undefined : id))}
          />
          <p className="text-xs text-muted-foreground">
            Click a sector to filter. Open incidents per sector are labelled on the map.
          </p>
        </div>
        <div className="space-y-3">
          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-8 text-sm text-muted-foreground">
                No alerts in this filter. Clear the sector or choose another source type.
              </CardContent>
            </Card>
          )}
          {filtered.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t.id)}
              className={cn(
                "w-full rounded-xl border p-3 text-left text-sm hover:bg-muted/40",
                active?.id === t.id && "ring-2 ring-ring"
              )}
            >
              <p className="flex items-center gap-2 font-medium">
                <SeverityDot severity={t.severity} />
                {t.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.id} · Sector {t.sector} · {t.source} · {t.status}
              </p>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <Card>
          <CardHeader>
            <CardTitle>{active.title}</CardTitle>
            <CardDescription>
              {active.id} · {new Date(active.time).toLocaleString("en-GB")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">
                {active.kind}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {active.severity}
              </Badge>
              <Badge variant="outline">{active.source}</Badge>
              <Badge variant={active.status === "open" ? "destructive" : "outline"}>{active.status}</Badge>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed">{active.detail}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
