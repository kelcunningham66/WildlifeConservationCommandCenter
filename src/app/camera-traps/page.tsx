import { readFile } from "node:fs/promises";
import path from "node:path";
import { TrapAnalyzer } from "@/components/camera/trap-analyzer";
import { trapDemos } from "@/data/trap-demos";
import { analyzeFeatures, hashBuffer } from "@/lib/analyze";

export default async function CameraTrapsPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const { demo } = await searchParams;
  const sample = trapDemos.find((d) => d.name === demo);
  let initialPreview: string | null = null;
  let initialDetection = null;
  if (sample) {
    const buf = await readFile(path.join(process.cwd(), "public", sample.file.replace(/^\//, "")));
    initialPreview = sample.file;
    initialDetection = analyzeFeatures({
      hash: hashBuffer(buf),
      filename: sample.name,
      byteLength: buf.length,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Computer vision</p>
        <h1 className="font-heading text-3xl tracking-tight">AI camera-trap analysis</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Upload a still from a Bushnell, Reconyx, or thermal unit. RangeWatch scores species, counts animals,
          matches known individuals where the catalogue allows, and flags humans, vehicles, and snares.
        </p>
      </div>
      <TrapAnalyzer initialPreview={initialPreview} initialDetection={initialDetection} activeDemo={sample?.name} />
    </div>
  );
}
