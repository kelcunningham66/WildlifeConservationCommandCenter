"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { habitatNotes, habitatSeries } from "@/data/habitat";
import { formatMonth } from "@/lib/forecast";

const chart = habitatSeries.map((h) => ({ ...h, label: formatMonth(h.month) }));
const latest = habitatSeries[habitatSeries.length - 1];
const first = habitatSeries[0];

export default function HabitatPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Landscape change</p>
        <h1 className="font-heading text-3xl tracking-tight">Habitat</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Vegetation greenness, surface water, burned area, and buffer encroachment from monthly Sentinel and
          Planet scenes. Dry-season water is the binding constraint for elephant and buffalo this year.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardDescription>NDVI (Aug)</CardDescription>
            <CardTitle className="font-heading text-3xl">{latest.ndvi.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {(((latest.ndvi - first.ndvi) / first.ndvi) * 100).toFixed(0)}% vs last September
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Water index</CardDescription>
            <CardTitle className="font-heading text-3xl">{latest.waterIndex.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Southern pans 38% below decade mean</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Burned this month</CardDescription>
            <CardTitle className="font-heading text-3xl">{latest.burnedHa} ha</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Encroachment YTD</CardDescription>
            <CardTitle className="font-heading text-3xl">{latest.encroachmentHa} ha</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Greenness and water</CardTitle>
            <CardDescription>NDVI and a simple surface-water index, September 2025–August 2026.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-64 w-full"
              config={{
                ndvi: { label: "NDVI", color: "var(--chart-2)" },
                waterIndex: { label: "Water", color: "var(--chart-1)" },
              }}
            >
              <AreaChart data={chart}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 1]} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="ndvi" type="monotone" stroke="var(--color-ndvi)" fill="var(--color-ndvi)" fillOpacity={0.2} />
                <Area
                  dataKey="waterIndex"
                  type="monotone"
                  stroke="var(--color-waterIndex)"
                  fill="var(--color-waterIndex)"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fire and clearing</CardTitle>
            <CardDescription>Burned hectares and cumulative charcoal encroachment inside the boundary.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-64 w-full"
              config={{
                burnedHa: { label: "Burned ha", color: "var(--chart-4)" },
                encroachmentHa: { label: "Encroachment ha", color: "var(--chart-5)" },
              }}
            >
              <BarChart data={chart}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="burnedHa" fill="var(--color-burnedHa)" radius={4} />
                <Bar dataKey="encroachmentHa" fill="var(--color-encroachmentHa)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {habitatNotes.map((n) => (
          <Card key={n.title} size="sm">
            <CardHeader>
              <CardTitle>{n.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{n.body}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
