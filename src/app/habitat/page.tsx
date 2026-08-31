"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SizedChart } from "@/components/charts/sized-chart";
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
            <SizedChart height={256}>
              <AreaChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#2d4a38" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#9cb8a6", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 1]} width={32} tick={{ fill: "#9cb8a6", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#1a2e24", border: "1px solid #2d4a38", borderRadius: 8 }}
                  labelStyle={{ color: "#d7eadc" }}
                />
                <Area dataKey="ndvi" type="monotone" stroke="#8ee0a0" fill="#8ee0a0" fillOpacity={0.2} />
                <Area dataKey="waterIndex" type="monotone" stroke="#6cb3d4" fill="#6cb3d4" fillOpacity={0.15} />
              </AreaChart>
            </SizedChart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fire and clearing</CardTitle>
            <CardDescription>Burned hectares and cumulative charcoal encroachment inside the boundary.</CardDescription>
          </CardHeader>
          <CardContent>
            <SizedChart height={256}>
              <BarChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#2d4a38" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#9cb8a6", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} width={32} tick={{ fill: "#9cb8a6", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#1a2e24", border: "1px solid #2d4a38", borderRadius: 8 }}
                  labelStyle={{ color: "#d7eadc" }}
                />
                <Bar dataKey="burnedHa" fill="#d9774a" radius={4} />
                <Bar dataKey="encroachmentHa" fill="#c4b5a0" radius={4} />
              </BarChart>
            </SizedChart>
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
