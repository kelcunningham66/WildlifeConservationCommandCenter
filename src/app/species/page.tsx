import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IucnBadge, TrendBadge } from "@/components/status-badges";
import { species } from "@/data/species";
import { percentChange } from "@/lib/forecast";

export default function SpeciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Catalogue</p>
        <h1 className="font-heading text-3xl tracking-tight">Endangered species monitoring</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Every black rhino on the conservancy is known. Elephants, wild dogs, and cheetahs are tracked with a
          mix of camera recapture, collars, and aerial blocks. Counts below are living estimates, not a one-day census.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {species.map((s) => {
          const change = percentChange(s.previousEstimate, s.currentEstimate);
          return (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle>{s.commonName}</CardTitle>
                <CardDescription className="italic">{s.scientificName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <IucnBadge status={s.iucn} />
                  <TrendBadge trend={s.trend} />
                </div>
                <dl className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Now</dt>
                    <dd className="font-heading text-2xl">{s.currentEstimate}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Previous</dt>
                    <dd className="font-heading text-2xl">{s.previousEstimate}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">+12 months</dt>
                    <dd className="font-heading text-2xl">{s.projection12m}</dd>
                  </div>
                </dl>
                <p className="text-xs text-muted-foreground">
                  {change.toFixed(1)}% vs last window · {s.individualsKnown > 0
                    ? `${s.individualsKnown} known individuals`
                    : "herd counts only"}{" "}
                  · sectors {s.preferredSectors.join(", ")}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.notes}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
