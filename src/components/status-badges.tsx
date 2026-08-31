import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IucnStatus, ThreatSeverity, Trend } from "@/data/types";

export function TrendBadge({ trend }: { trend: Trend }) {
  const styles: Record<Trend, string> = {
    declining: "border-destructive/40 bg-destructive/10 text-destructive",
    stable: "border-border bg-muted text-muted-foreground",
    recovering: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    increasing: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  };
  return (
    <Badge variant="outline" className={cn("capitalize", styles[trend])}>
      {trend === "declining" ? "Population declining" : trend}
    </Badge>
  );
}

export function IucnBadge({ status }: { status: IucnStatus }) {
  const hot = status === "Critically Endangered" || status === "Endangered";
  return (
    <Badge variant="outline" className={hot ? "border-destructive/40 text-destructive" : ""}>
      {status}
    </Badge>
  );
}

export function SeverityDot({ severity }: { severity: ThreatSeverity }) {
  const color: Record<ThreatSeverity, string> = {
    critical: "bg-destructive",
    high: "bg-amber-500",
    moderate: "bg-lime-600",
    watch: "bg-emerald-500",
  };
  return <span className={cn("inline-block size-2 rounded-full", color[severity])} />;
}
