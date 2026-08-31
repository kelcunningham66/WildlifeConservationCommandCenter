import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReserveMap } from "@/components/map/reserve-map";
import { IucnBadge, SeverityDot, TrendBadge } from "@/components/status-badges";
import { conservancy, sectors } from "@/data/sectors";
import { recentSightings } from "@/data/sightings";
import { species, speciesById } from "@/data/species";
import { threatAlerts } from "@/data/threats";
import type { SectorId } from "@/data/types";
import { percentChange } from "@/lib/forecast";
import Link from "next/link";

export default function DashboardPage() {
  const elephant = speciesById.elephant;
  const delta = percentChange(elephant.previousEstimate, elephant.currentEstimate);
  const open = threatAlerts.filter((t) => t.status !== "resolved");
  const counts = recentSightings.reduce<Partial<Record<SectorId, number>>>((acc, s) => {
    acc[s.sector] = (acc[s.sector] ?? 0) + s.count;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Wildlife dashboard</p>
        <h1 className="font-heading text-3xl tracking-tight">{conservancy.name}</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          {conservancy.areaKm2.toLocaleString()} km² of mopane woodland, floodplain, and rhino sanctuary.
          Camera traps, collar pings, ranger logs, and habitat scenes land here so field teams can act before a
          census is finished.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Elephant estimate</CardDescription>
            <CardTitle className="font-heading text-3xl">{elephant.currentEstimate}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Previous {elephant.previousEstimate} · {delta.toFixed(1)}%
            <div className="mt-2">
              <TrendBadge trend={elephant.trend} />
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>12-month projection</CardDescription>
            <CardTitle className="font-heading text-3xl">{elephant.projection12m}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Holt forecast from 24 months of trap and aerial index counts. Interval {elephant.ciLow}–{elephant.ciHigh}.
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Open threat alerts</CardDescription>
            <CardTitle className="font-heading text-3xl">{open.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {open.filter((t) => t.severity === "critical").length} critical · rhino sanctuary under night watch.
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Cameras online</CardDescription>
            <CardTitle className="font-heading text-3xl">
              {conservancy.camerasOnline}/{conservancy.camerasTotal}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Six units offline in Sector D after a storm. Rangers on shift: {conservancy.rangersDeployed}.
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="font-heading text-xl">Geographic distribution</h2>
            <p className="text-xs text-muted-foreground">Counts from last 72 hours of trap events</p>
          </div>
          <ReserveMap counts={counts} />
          <div className="grid gap-2 sm:grid-cols-2">
            {sectors.map((s) => (
              <div key={s.id} className="rounded-lg border p-3 text-sm">
                <p className="flex items-center gap-2 font-medium">
                  <SeverityDot severity={s.risk} />
                  Sector {s.id} · {s.name}
                </p>
                <p className="mt-1 text-muted-foreground">{s.notes}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent sightings</CardTitle>
              <CardDescription>Highest-confidence camera events in the last 48 hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentSightings.slice(0, 6).map((s) => {
                const sp = speciesById[s.speciesId];
                return (
                  <div key={s.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <p className="font-medium">
                      {sp.commonName}
                      <span className="ml-2 text-muted-foreground">×{s.count}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sector {s.sector} · {s.camera} · {Math.round(s.confidence * 100)}% ·{" "}
                      {new Date(s.time).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                );
              })}
              <Link href="/camera-traps" className="text-sm text-primary underline-offset-4 hover:underline">
                Analyze a new trap image
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Threat alerts</CardTitle>
              <CardDescription>Poaching, vehicles, snares, and collar dropouts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {threatAlerts.slice(0, 4).map((t) => (
                <div key={t.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <SeverityDot severity={t.severity} />
                    {t.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.id} · Sector {t.sector} · {t.source} · {t.status}
                  </p>
                </div>
              ))}
              <Link href="/threats" className="text-sm text-primary underline-offset-4 hover:underline">
                Open the threat desk
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Endangered species monitoring</CardTitle>
          <CardDescription>Index estimates, IUCN status, and 12-month Holt projections.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {species
            .filter((s) => s.iucn !== "Least Concern")
            .map((s) => (
              <Link key={s.id} href="/species" className="rounded-lg border p-3 hover:bg-muted/40">
                <p className="font-medium">{s.commonName}</p>
                <p className="text-xs text-muted-foreground italic">{s.scientificName}</p>
                <p className="mt-2 font-heading text-2xl">{s.currentEstimate}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <IucnBadge status={s.iucn} />
                  <TrendBadge trend={s.trend} />
                </div>
              </Link>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
