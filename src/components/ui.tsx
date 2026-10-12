import { useEffect, useRef, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ChevronUp, Info } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { ResponsiveContainer } from 'recharts'
import { nf } from '../lib/stats'
import Drawing from './Drawing'

/* ---------- Paleta Matiz ---------- */
export const C = {
  cream: '#FFFAF5',
  ink: '#FFFAF5', // texto sobre tarjeta uva (las tarjetas siempre son oscuras)
  grape: '#470B24',
  deep: '#2A0615',
  coral: '#F47358', // TikTok / destacado cálido
  peri: '#C4D3F7', // Instagram / destacado frío
  olive: '#B9AE6F', // tercera serie, positivo
  clay: '#9C4A44', // versión apagada del coral, negativo
  periDim: '#6F80B3',
  sec: 'rgba(255,250,245,.72)',
  ter: 'rgba(255,250,245,.55)',
  sand: 'rgba(255,250,245,.22)',
}
export const EASE = [0.2, 0.7, 0.2, 1] as const

/* ---------- Estilos compartidos de gráficos ---------- */
const tick = { fontFamily: 'Hanken Grotesk, sans-serif', fontSize: 12, fill: '#CDBCC6' }
export const xAxis = { tick, tickLine: false, axisLine: { stroke: 'rgba(255,255,255,.2)' } } as const
export const yAxis = {
  tick,
  tickLine: false,
  axisLine: false,
  width: 48,
  tickFormatter: (v: number) => nf(v),
} as const
export const grid = { vertical: false, strokeDasharray: '4 4', stroke: 'rgba(255,255,255,.09)' } as const
export const legendProps = {
  verticalAlign: 'bottom',
  iconType: 'circle',
  iconSize: 8,
  wrapperStyle: { fontSize: 12, fontFamily: 'Hanken Grotesk, sans-serif', color: '#CDBCC6', paddingTop: 12 },
} as const
export const cursorFill = { fill: 'rgba(255,255,255,.05)' }

export function useAnim() {
  const reduce = useReducedMotion()
  return { isAnimationActive: !reduce, animationDuration: 1400, animationEasing: 'ease-out' } as const
}

/* ---------- Movimiento ---------- */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Titular palabra por palabra; *palabra* queda en cursiva de acento. */
export function WordReveal({ text, className = '' }: { text: string; className?: string }) {
  const reduce = useReducedMotion()
  const words = text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .flatMap((p) => {
      const it = p.startsWith('*')
      return p
        .replace(/\*/g, '')
        .split(' ')
        .filter(Boolean)
        .map((w) => ({ w, it }))
    })
  return (
    <motion.h2
      className={className}
      aria-label={text.replace(/\*/g, '')}
      initial={reduce ? 'show' : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {words.map((x, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[.14em] align-bottom">
          <motion.span
            className={`inline-block ${x.it ? 'italic text-accent' : ''}`}
            variants={{ hidden: { y: '115%' }, show: { y: 0, transition: { duration: 0.85, delay: i * 0.055, ease: EASE } } }}
          >
            {x.w}
          </motion.span>
          {' '}
        </span>
      ))}
    </motion.h2>
  )
}

/** Inclinación 3D con el mouse (±5°). */
export function Tilt({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 180, damping: 18 })
  const sy = useSpring(my, { stiffness: 180, damping: 18 })
  const rx = useTransform(sy, [-0.5, 0.5], [5, -5])
  const ry = useTransform(sx, [-0.5, 0.5], [-5, 5])
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const b = ref.current!.getBoundingClientRect()
        mx.set((e.clientX - b.left) / b.width - 0.5)
        my.set((e.clientY - b.top) / b.height - 0.5)
      }}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Estructura: hojas apiladas ---------- */
type Tone = 'dark' | 'grape' | 'light'
const TONES: Record<string, Tone> = {
  perfil: 'light',
  resumen: 'dark',
  cuenta: 'light',
  semanal: 'grape',
  historial: 'light',
  estadistica: 'dark',
  reels: 'light',
  interaccion: 'grape',
  tiktok: 'light',
  plataformas: 'dark',
  guiones: 'light',
  plan: 'grape',
  cruce: 'light',
  recomendaciones: 'dark',
}
const DRAW: Record<string, string> = {
  perfil: 'house',
  resumen: 'tower',
  cuenta: 'villa',
  semanal: 'tower',
  historial: 'plan',
  estadistica: 'key',
  reels: 'door',
  interaccion: 'house',
  tiktok: 'villa',
  plataformas: 'plan',
  guiones: 'key',
  plan: 'tower',
  cruce: 'door',
  recomendaciones: 'villa',
}

export function Section({
  id,
  num,
  label,
  title,
  lede,
  children,
}: {
  id: string
  num: string
  label: string
  title?: string
  lede?: string
  dark?: boolean
  alt?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)
  const tone = TONES[id] ?? 'light'
  useEffect(() => {
    const all = (e: Event) => setOpen((e as CustomEvent<boolean>).detail)
    const hash = () => {
      if (window.location.hash === `#${id}`) setOpen(true)
    }
    window.addEventListener('sections:set', all)
    window.addEventListener('hashchange', hash)
    hash()
    return () => {
      window.removeEventListener('sections:set', all)
      window.removeEventListener('hashchange', hash)
    }
  }, [id])
  return (
    <section
      id={id}
      className={`tone-${tone} relative -mt-10 scroll-mt-16 overflow-hidden rounded-t-[36px] pb-16 pt-24 md:-mt-14 md:rounded-t-[72px] md:pb-24 md:pt-32`}
    >
      <Drawing name={DRAW[id] ?? 'tower'} className="pointer-events-none absolute -top-2 right-2 h-44 w-44 text-accent opacity-[.22] md:right-12 md:top-6 md:h-64 md:w-64" />
      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6">
        <Reveal>
          <div className="flex items-center gap-3 font-sans text-xs uppercase tracking-[.22em] text-t2">
            <span className="font-display text-[26px] font-normal normal-case italic leading-none tracking-normal text-coral">{num}</span>
            <motion.span
              className="h-px w-12 origin-left bg-coral/70"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
            />
            <span>{label}</span>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls={`${id}-contenido`}
              className="no-print relative z-10 ml-auto flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 font-sans text-[11px] font-semibold normal-case tracking-normal text-t1 transition-colors hover:bg-coral hover:text-deep"
            >
              {open ? 'Ocultar' : 'Mostrar'}
              <ChevronUp size={14} className={`transition-transform ${open ? '' : 'rotate-180'}`} />
            </button>
          </div>
          {title && <WordReveal text={title} className="mt-5 max-w-4xl font-display text-[34px] font-light leading-[1.04] text-t1 md:text-[52px]" />}
          {lede && <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-t2">{lede}</p>}
        </Reveal>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={`${id}-contenido`}
              key="c"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="-mx-6 overflow-hidden px-6"
            >
              <div className="space-y-6 pb-8 pt-10 md:space-y-8 md:pt-12">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export function Card({ children, className = '', large }: { children: ReactNode; className?: string; large?: boolean }) {
  return <div className={`card min-w-0 ${large ? 'p-5 sm:p-8' : 'p-5 sm:p-6'} ${className}`}>{children}</div>
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-4 font-sans text-base font-semibold text-t1">{children}</h3>
}

export function Source({ children }: { children: ReactNode }) {
  return <p className="mt-4 font-display text-[15px] italic leading-snug text-t3">{children}</p>
}

/* ---------- Números ---------- */
export function Num({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
}: {
  value: number | null
  decimals?: number
  prefix?: string
  suffix?: string
}) {
  const reduce = useReducedMotion()
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!inView || value == null || reduce) return
    const c = animate(0, value, { duration: 1.8, ease: 'easeOut', onUpdate: setShown })
    return () => c.stop()
  }, [inView, value, reduce])
  if (value == null) return <span>—</span>
  const fmt = (n: number) => `${prefix}${nf(n, decimals)}${suffix}`
  return <span ref={ref}>{reduce ? fmt(value) : fmt(inView ? shown : 0)}</span>
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 flex gap-2 rounded-xl bg-cream/[.06] px-3 py-2.5 font-sans text-xs leading-snug text-t2">
      <Info size={14} className="mt-px shrink-0 text-coral" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

export function Delta({ v, children }: { v: number; children?: ReactNode }) {
  const up = v >= 0
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-num text-[11px] font-bold text-deep ${up ? 'bg-olive' : 'bg-coral'}`}>
      {up ? '▲' : '▼'} {children ?? `${nf(Math.abs(v), 1)} %`}
    </span>
  )
}

const GLOW = { peri: '#C4D3F7', olive: '#B9AE6F', coral: '#F47358', clay: '#9C4A44' }

export function Kpi({
  value,
  text,
  decimals,
  prefix,
  suffix,
  label,
  sub,
  delta,
  hint,
  tone = 'peri',
  className = '',
}: {
  value?: number | null
  text?: string
  decimals?: number
  prefix?: string
  suffix?: string
  label: string
  sub?: ReactNode
  delta?: ReactNode
  hint?: string
  tone?: 'peri' | 'olive' | 'coral' | 'clay'
  className?: string
}) {
  return (
    <Tilt className={className}>
      <Card className="relative h-full overflow-hidden">
        <span className="pointer-events-none absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 100% 0%, ${GLOW[tone]}, transparent 55%)` }} aria-hidden />
        <p className="relative font-sans text-[11px] font-semibold uppercase tracking-[.2em] text-t2">{label}</p>
        <div className="relative mt-4 flex flex-wrap items-end gap-x-3 gap-y-1">
          <span className="break-words font-display text-[56px] font-light leading-[.95] text-t1 md:text-[68px]">
            {text ?? <Num value={value ?? null} decimals={decimals} prefix={prefix} suffix={suffix} />}
          </span>
          {delta}
        </div>
        {sub && <p className="relative mt-4 border-t border-line pt-3 font-sans text-[13px] leading-snug text-t2">{sub}</p>}
        {hint && <Hint>{hint}</Hint>}
      </Card>
    </Tilt>
  )
}

/* ---------- Controles ---------- */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { v: T; l: string }[]
  value: T
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-full border border-line bg-cream/[.06] p-1">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          aria-pressed={value === o.v}
          onClick={() => onChange(o.v)}
          className={`rounded-full px-4 py-1.5 font-sans text-sm transition-colors ${
            value === o.v ? 'bg-coral font-semibold text-deep' : 'text-t2 hover:text-t1'
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  )
}

export function Tag({ children, tone }: { children: ReactNode; tone: 'olive' | 'coral' | 'peri' | 'clay' }) {
  const bg = { olive: 'bg-olive', coral: 'bg-coral', peri: 'bg-peri', clay: 'bg-peri/70' }[tone]
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold text-deep ${bg}`}>
      {children}
    </span>
  )
}

/* ---------- Gráficos ---------- */
export function ChartBox({
  label,
  className = 'h-[260px] sm:h-[340px]',
  children,
}: {
  label: string
  className?: string
  children: ReactElement
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <div ref={ref} role="img" aria-label={label} className={`w-full min-w-0 ${className}`}>
      {inView && (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      )}
    </div>
  )
}

interface TipProps {
  active?: boolean
  payload?: any[]
  label?: any
  fmt?: (v: number, name: string) => string
  head?: (label: any, row: any) => ReactNode
  foot?: (row: any) => ReactNode
}

export function Tip({ active, payload, label, fmt, head, foot }: TipProps) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="tip max-w-[260px] rounded-xl bg-cream p-3 font-sans text-xs shadow-2xl">
      <p className="mb-1.5 font-bold text-[#B8442E]">{head ? head(label, row) : label}</p>
      {payload
        .filter((p) => p.value != null && p.name != null)
        .map((p, i) => (
          <p key={i} className="flex items-center gap-2 text-deep/70">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color ?? p.fill ?? p.stroke }} />
            <span>{p.name}:</span>
            <span className="ml-auto pl-3 font-num font-semibold text-deep">{fmt ? fmt(p.value, p.name) : nf(p.value)}</span>
          </p>
        ))}
      {foot && <div className="mt-1.5 border-t border-deep/10 pt-1.5 text-deep/70">{foot(row)}</div>}
    </div>
  )
}

/** Filas con separadores sutiles y zebra, sin bordes gruesos. */
export function ZebraRow({ children, i, className = '' }: { children: ReactNode; i: number; className?: string }) {
  return <div className={`px-3 py-3 sm:px-4 ${i % 2 ? 'bg-cream/[.06]' : 'bg-cream/[.02]'} ${className}`}>{children}</div>
}
