import { TrapAnalyzer } from "@/components/camera/trap-analyzer";

export default function CameraTrapsPage() {
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
      <TrapAnalyzer />
    </div>
  );
}
