import type { MonthlyCount, Trend } from "@/data/types";

export interface ForecastPoint {
  month: string;
  actual?: number;
  forecast: number;
  low: number;
  high: number;
}

function addMonths(isoMonth: string, n: number) {
  const [y, m] = isoMonth.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

/**
 * Holt linear exponential smoothing with residual-based prediction intervals.
 * Used as the on-device population projection when a full census is unavailable.
 */
export function holtForecast(series: MonthlyCount[], horizon = 12): ForecastPoint[] {
  if (series.length < 3) {
    return series.map((p) => ({
      month: p.month,
      actual: p.count,
      forecast: p.count,
      low: p.count,
      high: p.count,
    }));
  }

  const alpha = 0.45;
  const beta = 0.18;
  const values = series.map((p) => p.count);

  let level = values[0];
  let trend = values[1] - values[0];
  const fitted: number[] = [level];
  const residuals: number[] = [];

  for (let t = 1; t < values.length; t++) {
    const prevLevel = level;
    level = alpha * values[t] + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    fitted.push(level);
    residuals.push(values[t] - fitted[t - 1]);
  }

  const sse = residuals.reduce((s, r) => s + r * r, 0);
  const sigma = Math.sqrt(sse / Math.max(residuals.length - 1, 1));

  const history: ForecastPoint[] = series.map((p, i) => ({
    month: p.month,
    actual: p.count,
    forecast: Math.round(fitted[i]),
    low: Math.round(fitted[i] - 1.64 * sigma),
    high: Math.round(fitted[i] + 1.64 * sigma),
  }));

  const lastMonth = series[series.length - 1].month;
  const future: ForecastPoint[] = [];
  for (let h = 1; h <= horizon; h++) {
    const yhat = level + h * trend;
    const interval = 1.64 * sigma * Math.sqrt(h);
    future.push({
      month: addMonths(lastMonth, h),
      forecast: Math.max(0, Math.round(yhat)),
      low: Math.max(0, Math.round(yhat - interval)),
      high: Math.max(0, Math.round(yhat + interval)),
    });
  }

  return [...history, ...future];
}

export function trendFromChange(current: number, projected: number): Trend {
  const pct = (projected - current) / Math.max(current, 1);
  if (pct <= -0.04) return "declining";
  if (pct >= 0.08) return "increasing";
  if (pct >= 0.03) return "recovering";
  return "stable";
}

export function percentChange(from: number, to: number) {
  if (!from) return 0;
  return ((to - from) / from) * 100;
}

export function formatMonth(iso: string) {
  const [y, m] = iso.split("-");
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${labels[Number(m) - 1]} ${y.slice(2)}`;
}
