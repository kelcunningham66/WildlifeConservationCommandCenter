"use client";

import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export function SizedChart({
  children,
  height = 280,
  className,
}: {
  children: React.ReactElement;
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height={height} minWidth={0} minHeight={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
