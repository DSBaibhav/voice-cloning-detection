interface WaveformProps {
  bars?: number;
  height?: number;
  color?: string;
  animated?: boolean;
  compact?: boolean;
}

const STATIC_HEIGHTS = [
  8, 24, 14, 40, 18, 32, 10, 48, 22, 36, 12, 52, 20, 28, 44, 16, 38, 26, 46,
  14, 34, 20, 50, 18, 30, 42, 12, 38, 24, 44,
];

export function Waveform({ bars = 30, height = 64, color = '#3D7DF5', animated = true, compact = false }: WaveformProps) {
  const barW = compact ? 2 : 3;
  const gap = compact ? 2 : 3;

  return (
    <div
      className="flex items-end gap-0"
      style={{ height, gap }}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const staticH = STATIC_HEIGHTS[i % STATIC_HEIGHTS.length];
        return (
          <div
            key={i}
            className={`waveform-bar rounded-sm shrink-0${animated ? ' anim' : ''}`}
            style={{
              width: barW,
              height: animated ? `${STATIC_HEIGHTS[i % STATIC_HEIGHTS.length]}px` : staticH,
              background: color,
              opacity: 0.7 + (i % 5) * 0.06,
            }}
          />
        );
      })}
    </div>
  );
}

export function MiniSparkline({ data, color = '#3D7DF5', width = 64, height = 24 }: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline
        points={pts.join(' ')}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
}
