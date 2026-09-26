import { useEffect, useRef } from 'react';

interface RiskGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

function getColor(score: number) {
  if (score >= 80) return '#EF4444';
  if (score >= 60) return '#F59E0B';
  return '#12B981';
}

export function RiskGauge({ score, size = 180, label = 'Risk Score' }: RiskGaugeProps) {
  const fillRef = useRef<SVGCircleElement>(null);

  const r = (size - 24) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const arcLength = circumference * 0.75;
  const offset = arcLength - (score / 100) * arcLength;
  const color = getColor(score);

  useEffect(() => {
    if (!fillRef.current) return;
    const el = fillRef.current;
    el.style.strokeDasharray = `${arcLength} ${circumference}`;
    el.style.strokeDashoffset = `${arcLength}`;
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
      el.style.strokeDashoffset = `${offset}`;
    });
  }, [score, arcLength, offset, circumference]);

  const startAngle = 135;
  const endAngle = 405;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-225deg)' }}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#1C2840"
          strokeWidth="10"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          opacity="1"
        />
        <circle
          ref={fillRef}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${color}66)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold" style={{ color, fontFamily: 'var(--font-mono)' }}>
          {score}
        </div>
        <div className="text-xs font-semibold uppercase tracking-widest text-text-muted mt-1">{label}</div>
      </div>
    </div>
  );
}

export function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="text-xs font-mono font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 6px ${color}66` }}
        />
      </div>
    </div>
  );
}
