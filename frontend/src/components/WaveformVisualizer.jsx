/**
 * WaveformVisualizer — real-time audio level visualizer using AnalyserNode.
 *
 * Props:
 *   analyserNode : Web Audio API AnalyserNode | null
 *   active       : boolean — whether to animate
 *   status       : "idle" | "bonafide" | "spoof" | "challenge" | "connecting"
 */

import { useRef, useEffect } from 'react'

const BAR_COUNT = 48
const FFT_SIZE  = 256

const STATUS_COLORS = {
  idle:       '#4b5563',
  connecting: '#8b5cf6',
  bonafide:   '#22c55e',
  spoof:      '#ef4444',
  challenge:  '#f59e0b',
}

export function WaveformVisualizer({ analyserNode, active = false, status = 'idle' }) {
  const canvasRef  = useRef(null)
  const rafRef     = useRef(null)
  const dataRef    = useRef(new Uint8Array(FFT_SIZE))

  const color = STATUS_COLORS[status] ?? STATUS_COLORS.idle

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)

      const { width: W, height: H } = canvas
      ctx.clearRect(0, 0, W, H)

      let data = dataRef.current

      if (analyserNode && active) {
        analyserNode.fftSize = FFT_SIZE
        analyserNode.getByteFrequencyData(data)
      } else {
        // Idle animation: gentle sine-wave bars
        const t = Date.now() / 1000
        for (let i = 0; i < FFT_SIZE; i++) {
          data[i] = Math.max(0, Math.sin(t * 1.5 + i * 0.4) * 20 + 22)
        }
      }

      const barW    = W / BAR_COUNT
      const gap     = barW * 0.25
      const realBarW = barW - gap

      for (let i = 0; i < BAR_COUNT; i++) {
        // Map bar index → frequency bucket
        const bucketIdx = Math.floor((i / BAR_COUNT) * (FFT_SIZE / 2))
        const amp       = data[bucketIdx] / 255

        const barH = Math.max(3, amp * H * 0.9)
        const x    = i * barW + gap / 2
        const y    = (H - barH) / 2

        // Gradient per bar
        const grad = ctx.createLinearGradient(0, y, 0, y + barH)
        grad.addColorStop(0, `${color}cc`)
        grad.addColorStop(0.5, color)
        grad.addColorStop(1, `${color}cc`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.roundRect(x, y, realBarW, barH, realBarW / 2)
        ctx.fill()
      }
    }

    draw()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [analyserNode, active, status, color])

  // Handle DPI scaling
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width  = rect.width  * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
  }, [])

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-raised)',
        border:     '1px solid var(--border)',
        height:     '96px',
      }}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 50% 50%, ${color}0d, transparent)`,
          transition: 'background 0.4s ease',
        }}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
        aria-label="Audio waveform visualizer"
      />
    </div>
  )
}
