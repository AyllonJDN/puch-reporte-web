/** Silueta de edificios en línea fina; decorativa. `seed` cambia la distribución. */
function rng(seed: number) {
  let s = seed * 9301 + 49297
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export default function Skyline({
  seed = 1,
  tone = 'light',
  className = '',
}: {
  seed?: number
  tone?: 'light' | 'dark'
  className?: string
}) {
  const r = rng(seed)
  const stroke = '#C4D3F7'
  const fillO = tone === 'dark' ? 0.07 : 0.16
  const items: { x: number; w: number; h: number; kind: number }[] = []
  let x = -10
  while (x < 1210) {
    const w = 34 + Math.round(r() * 46)
    const h = 36 + Math.round(r() * 88)
    items.push({ x, w, h, kind: Math.floor(r() * 4) })
    x += w + 4 + Math.round(r() * 10)
  }
  return (
    <svg aria-hidden className={`pointer-events-none block w-full ${className}`} viewBox="0 0 1200 150" preserveAspectRatio="xMidYMax slice">
      {items.map((b, i) => {
        const top = 150 - b.h
        return (
          <g key={i}>
            <rect x={b.x} y={top} width={b.w} height={b.h} fill={stroke} fillOpacity={fillO} stroke={stroke} strokeOpacity={0.55} strokeWidth={1} />
            {b.kind === 0 && <line x1={b.x + b.w / 2} y1={top} x2={b.x + b.w / 2} y2={top - 16} stroke={stroke} strokeOpacity={0.55} />}
            {b.kind === 1 && <rect x={b.x + 8} y={top - 9} width={b.w - 16} height={9} fill="none" stroke={stroke} strokeOpacity={0.5} />}
            {b.kind === 2 && <path d={`M${b.x} ${top} L${b.x + b.w / 2} ${top - 12} L${b.x + b.w} ${top}`} fill="none" stroke={stroke} strokeOpacity={0.5} />}
            {Array.from({ length: Math.max(0, Math.floor((b.h - 10) / 15)) }).map((_, row) =>
              Array.from({ length: Math.max(1, Math.floor((b.w - 8) / 13)) }).map((__, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={b.x + 6 + col * 13}
                  y={top + 8 + row * 15}
                  width={5}
                  height={7}
                  fill={stroke}
                  fillOpacity={(row * 5 + col * 3 + i) % 4 === 0 ? 0.6 : 0.2}
                />
              )),
            )}
          </g>
        )
      })}
      <line x1="0" y1="149.5" x2="1200" y2="149.5" stroke={stroke} strokeOpacity={0.6} />
    </svg>
  )
}

export function SkylineDivider({ seed }: { seed: number }) {
  return (
    <div className="no-print -mb-px h-14 overflow-hidden sm:h-24" aria-hidden>
      <Skyline seed={seed} className="h-full" />
    </div>
  )
}
