"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SizedChart } from "@/components/charts/sized-chart";
import { TrendBadge } from "@/components/status-badges";
import { populationSeries, species } from "@/data/species";
import { formatMonth, holtForecast, percentChange } from "@/lib/forecast";
import { cn } from "@/lib/utils";

export default function PopulationsPage() {
  const [id, setId] = useState("elephant");
  const sp = species.find((s) => s.id === id) ?? species[0];
  const chart = useMemo(() => {
    const points = holtForecast(populationSeries[sp.id], 12);
    return points.map((p) => ({
      ...p,
      label: formatMonth(p.month),
    }));
  }, [sp.id]);

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
          <button
            key={s.id}
            type="button"
            onClick={() => setId(s.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              s.id === sp.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            {s.commonName}
          </button>
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
            Solid line is observed index. Dashed line and band are the Holt forecast (±1.64σ). Last observed{" "}
            {lastActual?.actual} in {lastActual?.label}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SizedChart>
            <AreaChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#2d4a38" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} interval={3} tick={{ fill: "#9cb8a6", fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} width={40} tick={{ fill: "#9cb8a6", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#1a2e24", border: "1px solid #2d4a38", borderRadius: 8 }}
                labelStyle={{ color: "#d7eadc" }}
              />
              <Area dataKey="high" type="monotone" stroke="none" fill="#3d6b52" fillOpacity={0.25} />
              <Line dataKey="actual" type="monotone" stroke="#8ee0a0" strokeWidth={2} dot={false} connectNulls={false} />
              <Line
                dataKey="forecast"
                type="monotone"
                stroke="#e6c07a"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </AreaChart>
          </SizedChart>
          <p className="mt-4 text-sm text-muted-foreground">{sp.notes}</p>
        </CardContent>
      </Card>
    </div>
  );
}
