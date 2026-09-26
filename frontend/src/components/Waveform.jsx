import React, { useEffect, useRef, useState } from 'react';

const STATIC_HEIGHTS = [
  8, 22, 14, 38, 18, 30, 10, 46, 22, 34, 12, 50, 20, 26, 42, 16, 36, 24, 44,
  14, 32, 20, 48, 18, 28, 40, 12, 36, 22, 42, 16, 28, 38, 20, 44, 12, 30, 22
];

export function Waveform({
  bars = 32,
  height = 64,
  color = '#2563EB',
  analyserNode = null,
  isActive = false,
  isSpoof = false,
}) {
  const [liveHeights, setLiveHeights] = useState(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!isActive || !analyserNode) {
      setLiveHeights(null);
      return;
    }

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const update = () => {
      analyserNode.getByteFrequencyData(dataArray);
      // Map FFT data into bar heights
      const step = Math.floor(bufferLength / bars);
      const heights = [];
      for (let i = 0; i < bars; i++) {
        const val = dataArray[i * step] || 0;
        const normalized = (val / 255) * (height - 8) + 4;
        heights.push(Math.round(normalized));
      }
      setLiveHeights(heights);
      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, analyserNode, bars, height]);

  const activeColor = isSpoof ? '#EF4444' : color;

  return (
    <div
      className="flex items-end gap-[3px] py-1 select-none overflow-hidden"
      style={{ height }}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        let barHeight = 4;
        if (liveHeights) {
          barHeight = liveHeights[i] || 4;
        } else if (isActive) {
          barHeight = STATIC_HEIGHTS[i % STATIC_HEIGHTS.length];
        } else {
          barHeight = 4 + (i % 3) * 2;
        }

        return (
          <div
            key={i}
            className={`w-[3px] rounded-sm transition-all duration-75 shrink-0 ${
              isActive && !liveHeights ? 'anim' : ''
            }`}
            style={{
              height: `${Math.min(height, Math.max(3, barHeight))}px`,
              backgroundColor: activeColor,
              opacity: isActive ? 0.85 + (i % 3) * 0.05 : 0.3,
            }}
          />
        );
      })}
    </div>
  );
}

export function MiniSparkline({ data = [2, 5, 3, 8, 4, 9, 6], color = '#2563EB', width = 64, height = 24 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" className="shrink-0">
      <polyline
        points={pts.join(' ')}
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
