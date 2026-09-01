export function seriesBounds(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return { min, max, span };
}

export function LineChartSvg({
  labels,
  series,
  height = 280,
}: {
  labels: string[];
  series: Array<{ name: string; values: Array<number | null>; color: string; dashed?: boolean }>;
  height?: number;
}) {
  const width = 720;
  const pad = { l: 44, r: 12, t: 16, b: 28 };
  const nums = series.flatMap((s) => s.values.filter((v): v is number => v != null));
  const { min, span } = seriesBounds(nums);
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const n = labels.length - 1 || 1;
  const x = (i: number) => pad.l + (i / n) * innerW;
  const y = (v: number) => pad.t + (1 - (v - min) / span) * innerH;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img">
      {[0, 0.5, 1].map((t) => {
        const yy = pad.t + t * innerH;
        const val = Math.round(min + (1 - t) * span);
        return (
          <g key={t}>
            <line x1={pad.l} x2={width - pad.r} y1={yy} y2={yy} stroke="#2d4a38" />
            <text x={pad.l - 8} y={yy + 4} textAnchor="end" fill="#9cb8a6" fontSize="11">
              {val}
            </text>
          </g>
        );
      })}
      {series.map((s) => {
        const pts = s.values
          .map((v, i) => (v == null ? null : `${x(i)},${y(v)}`))
          .filter(Boolean)
          .join(" ");
        return (
          <polyline
            key={s.name}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeDasharray={s.dashed ? "6 4" : undefined}
            points={pts}
          />
        );
      })}
      {labels.map((label, i) =>
        i % 4 === 0 ? (
          <text key={label + i} x={x(i)} y={height - 6} textAnchor="middle" fill="#9cb8a6" fontSize="11">
            {label}
          </text>
        ) : null
      )}
    </svg>
  );
}

export function BarChartSvg({
  labels,
  series,
  height = 256,
}: {
  labels: string[];
  series: Array<{ name: string; values: number[]; color: string }>;
  height?: number;
}) {
  const width = 720;
  const pad = { l: 44, r: 12, t: 16, b: 28 };
  const nums = series.flatMap((s) => s.values);
  const { min, span } = seriesBounds([0, ...nums]);
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const groupW = innerW / labels.length;
  const barW = groupW / (series.length + 1);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img">
      {labels.map((label, i) => (
        <g key={label}>
          {series.map((s, si) => {
            const v = s.values[i];
            const h = ((v - min) / span) * innerH;
            const xx = pad.l + i * groupW + si * barW + barW * 0.4;
            const yy = pad.t + innerH - h;
            return <rect key={s.name} x={xx} y={yy} width={barW} height={Math.max(h, 0)} fill={s.color} rx="2" />;
          })}
          {i % 2 === 0 ? (
            <text
              x={pad.l + i * groupW + groupW / 2}
              y={height - 6}
              textAnchor="middle"
              fill="#9cb8a6"
              fontSize="11"
            >
              {label}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
