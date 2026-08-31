"use client";

import { useState } from "react";
import { Camera, Loader2, ShieldAlert, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CameraDetection } from "@/data/types";
import { cn } from "@/lib/utils";

const demos = [
  { file: "/samples/elephant-herd.svg", label: "Elephant herd", name: "elephant-herd.svg" },
  { file: "/samples/rhino-night.svg", label: "Black rhino", name: "rhino-night.svg" },
  { file: "/samples/lion-pride.svg", label: "Lion pride", name: "lion-pride.svg" },
  { file: "/samples/vehicle-night.svg", label: "Night vehicle", name: "vehicle-night.svg" },
  { file: "/samples/human-thermal.svg", label: "Human thermal", name: "human-thermal.svg" },
  { file: "/samples/snare-zebra.svg", label: "Snare", name: "snare-zebra.svg" },
];

function samplePixels(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  const w = 48;
  const h = 32;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return {};
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  let lum = 0;
  let green = 0;
  let warm = 0;
  const n = w * h;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    lum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (g > r + 12 && g > b) green += 1;
    if (r > 140 && r > g + 10 && r > b) warm += 1;
  }
  return { luminance: lum / n, greenRatio: green / n, warmRatio: warm / n };
}

async function fileFromUrl(url: string, name: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], name, { type: blob.type || "image/svg+xml" });
}

export function TrapAnalyzer() {
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CameraDetection | null>(null);

  async function run(file: File, objectUrl?: string) {
    setBusy(true);
    setError(null);
    setResult(null);
    const url = objectUrl ?? URL.createObjectURL(file);
    setPreview(url);

    const img = new Image();
    img.src = url;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    const feats = samplePixels(img);

    const body = new FormData();
    body.append("image", file);
    if (feats.luminance != null) body.append("luminance", String(feats.luminance));
    if (feats.greenRatio != null) body.append("greenRatio", String(feats.greenRatio));
    if (feats.warmRatio != null) body.append("warmRatio", String(feats.warmRatio));

    const res = await fetch("/api/analyze", { method: "POST", body });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "Analysis failed.");
      return;
    }
    setResult(json.detection);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Upload a camera-trap image</CardTitle>
          <CardDescription>
            The classifier looks for species, group size, known individuals, humans, vehicles, and snares.
            Night-vision and thermal stills are supported. Demo frames below use the same pipeline as a field upload.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground hover:bg-muted/40">
            <Upload className="size-5" />
            <span>Drop a JPEG, PNG, or SVG, or click to browse</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void run(file).catch(() => setError("Could not read that image."));
              }}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {demos.map((d) => (
              <Button
                key={d.file}
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  void fileFromUrl(d.file, d.name)
                    .then((f) => run(f, d.file))
                    .catch(() => setError("Could not load the sample frame."));
                }}
              >
                {d.label}
              </Button>
            ))}
          </div>
          <div className="relative overflow-hidden rounded-xl border bg-black/40">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Camera trap frame" className="max-h-80 w-full object-contain" />
            ) : (
              <div className="flex h-52 items-center justify-center text-muted-foreground">
                <Camera className="mr-2 size-4" />
                No frame loaded
              </div>
            )}
            {busy && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Running detection…
              </div>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detection</CardTitle>
          <CardDescription>Model output for the selected frame.</CardDescription>
        </CardHeader>
        <CardContent>
          {!result && !busy && (
            <p className="text-sm text-muted-foreground">
              Load a field photo or a demo frame. Elephant herd, night vehicle, and snare samples show the main alert paths.
            </p>
          )}
          {result && (
            <div className="space-y-4">
              <div>
                <p className="text-xs tracking-wide text-muted-foreground uppercase">Detected</p>
                <p className="font-heading text-2xl">{result.species}</p>
                {result.scientificName && (
                  <p className="text-sm text-muted-foreground italic">{result.scientificName}</p>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Confidence</dt>
                  <dd className="font-medium">{Math.round(result.confidence * 100)}%</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Herd / group size</dt>
                  <dd className="font-medium">{result.count}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="font-medium">{result.location}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Time</dt>
                  <dd className="font-medium">{result.capturedAt}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Humans</dt>
                  <dd className="font-medium">{result.humans}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Vehicles</dt>
                  <dd className="font-medium">{result.vehicles}</dd>
                </div>
              </dl>
              {result.individuals && result.individuals.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Known individuals</p>
                  <p className="mt-1 text-sm">{result.individuals.join(" · ")}</p>
                </div>
              )}
              {result.otherThreats.length > 0 && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
                  <p className="flex items-center gap-1.5 font-medium text-destructive">
                    <ShieldAlert className="size-4" />
                    Threat flags
                  </p>
                  <ul className="mt-2 list-disc pl-4">
                    {result.otherThreats.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-sm text-muted-foreground">{result.notes}</p>
              <Badge
                variant="outline"
                className={cn(
                  result.threatLevel === "critical" || result.threatLevel === "high"
                    ? "border-destructive/40 text-destructive"
                    : ""
                )}
              >
                Threat level: {result.threatLevel}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
