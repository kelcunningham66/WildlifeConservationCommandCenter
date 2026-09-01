import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartSvg } from "@/components/charts/svg-charts";
import { TrendBadge } from "@/components/status-badges";
import { populationSeries, species } from "@/data/species";
import { formatMonth, holtForecast, percentChange } from "@/lib/forecast";
import { cn } from "@/lib/utils";

export default async function PopulationsPage({
  searchParams,
}: {
  searchParams: Promise<{ species?: string }>;
}) {
  const params = await searchParams;
  const sp = species.find((s) => s.id === params.species) ?? species[0];
  const chart = holtForecast(populationSeries[sp.id], 12).map((p) => ({
    ...p,
    label: formatMonth(p.month),
  }));
  const lastActual = chart.filter((p) => p.actual != null).at(-1);
  const horizon = chart.at(-1);
  const yoy = percentChange(sp.previousEstimate, sp.currentEstimate);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Time-series forecast</p>
        <h1 className="font-heading text-3xl tracking-tight">Population prediction</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Monthly index counts from camera recapture and aerial surveys are smoothed with Holt linear
          exponential smoothing. The 12-month line is a projection, not a census.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {species.map((s) => (
          <a
            key={s.id}
            href={`/populations?species=${s.id}`}
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              s.id === sp.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            {s.commonName}
          </a>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Current estimate</CardDescription>
            <CardTitle className="font-heading text-3xl">{sp.currentEstimate}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Previous estimate</CardDescription>
            <CardTitle className="font-heading text-3xl">{sp.previousEstimate}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{yoy.toFixed(1)}% vs last census window</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>12-month projection</CardDescription>
            <CardTitle className="font-heading text-3xl">{horizon?.forecast ?? sp.projection12m}</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendBadge trend={sp.trend} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{sp.commonName}</CardTitle>
          <CardDescription>
            Solid line is observed index. Dashed line is the Holt forecast. Last observed {lastActual?.actual} in{" "}
            {lastActual?.label}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineChartSvg
            labels={chart.map((p) => p.label)}
            series={[
              { name: "Observed", color: "#8ee0a0", values: chart.map((p) => p.actual ?? null) },
              { name: "Forecast", color: "#e6c07a", dashed: true, values: chart.map((p) => p.forecast) },
            ]}
          />
          <p className="mt-4 text-sm text-muted-foreground">{sp.notes}</p>
        </CardContent>
      </Card>
    </div>
  );
}
