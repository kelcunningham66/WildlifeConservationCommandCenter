"use client";

import { sectors } from "@/data/sectors";
import type { SectorId, ThreatSeverity } from "@/data/types";
import { cn } from "@/lib/utils";

const fill: Record<ThreatSeverity, string> = {
  critical: "fill-destructive/35 stroke-destructive",
  high: "fill-amber-500/30 stroke-amber-500",
  moderate: "fill-lime-600/25 stroke-lime-700",
  watch: "fill-emerald-700/20 stroke-emerald-600",
};

export function ReserveMap({
  highlight,
  counts,
  onSelect,
}: {
  highlight?: SectorId;
  counts?: Partial<Record<SectorId, number>>;
  onSelect?: (id: SectorId) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card">
      <svg viewBox="0 0 110 100" className="h-auto w-full" role="img" aria-label="Mopane Ridge Conservancy map">
        <defs>
          <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1c3a28" />
            <stop offset="100%" stopColor="#0f241a" />
          </linearGradient>
        </defs>
        <rect width="110" height="100" fill="url(#land)" />
        <path d="M 0 40 C 20 36, 40 48, 70 42 C 90 38, 110 44, 110 44 L 110 100 L 0 100 Z" className="fill-emerald-950/80" />
        <path d="M 6 40 C 22 34, 30 48, 18 58 C 10 52, 4 48, 6 40 Z" className="fill-sky-800/50" />
        {sectors.map((s) => (
          <g key={s.id}>
            <path
              d={s.path}
              className={cn(
                "cursor-pointer stroke-[1.2] transition-opacity",
                fill[s.risk],
                highlight && highlight !== s.id && "opacity-40"
              )}
              onClick={() => onSelect?.(s.id)}
            />
            <text
              x={s.x}
              y={s.y}
              textAnchor="middle"
              className="fill-foreground text-[5px] font-medium pointer-events-none"
            >
              {s.id}
              {counts?.[s.id] != null ? ` · ${counts[s.id]}` : ""}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-2 border-t px-3 py-2 text-[11px] text-muted-foreground">
        <span>Risk: </span>
        <span className="text-destructive">critical</span>
        <span className="text-amber-500">high</span>
        <span className="text-lime-600">moderate</span>
        <span className="text-emerald-500">watch</span>
      </div>
    </div>
  );
}
