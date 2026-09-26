import React, { useEffect, useRef } from 'react';

function getColor(score) {
  if (score >= 70) return '#EF4444'; // Red (High Risk Spoof)
  if (score >= 40) return '#F59E0B'; // Amber (Suspicious)
  return '#10B981'; // Green (Safe Bonafide)
}

export function RiskGauge({ score = 0, size = 180, label = 'Risk Score' }) {
  const fillRef = useRef(null);

  const r = (size - 24) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const arcLength = circumference * 0.75;
  const offset = arcLength - (Math.min(100, Math.max(0, score)) / 100) * arcLength;
  const color = getColor(score);

  useEffect(() => {
    if (!fillRef.current) return;
    const el = fillRef.current;
    el.style.strokeDasharray = `${arcLength} ${circumference}`;
    el.style.strokeDashoffset = `${offset}`;
  }, [score, arcLength, offset, circumference]);

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-225deg)' }}>
        {/* Track in clean light gray */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="10"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Dynamic score fill */}
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
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease',
            filter: `drop-shadow(0 2px 6px ${color}40)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-4xl font-extrabold tracking-tight" style={{ color, fontFamily: 'var(--font-mono)' }}>
          {Math.round(score)}%
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}

export function MetricBar({ label, value = 0, color = '#2563EB', unit = '%' }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="font-mono font-semibold" style={{ color }}>
          {value}{unit}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
