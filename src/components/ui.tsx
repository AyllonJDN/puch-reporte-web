import { useEffect, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion'
import { Building, Building2, ChevronUp, DoorOpen, Hotel, Info, KeyRound, Landmark, Store, Warehouse } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { ResponsiveContainer } from 'recharts'
import { nf } from '../lib/stats'

export const C = {
  base: '#F5F0EB',
  ink: '#1A1A2E',
  arena: '#C4A882',
  menta: '#A8D5BA',
  rosa: '#F2A7A7',
  lavanda: '#B8C8E8',
  sec: '#5C5C5C',
  ter: '#9A9A9A',
  sand: '#E4DDD3',
}

/* ---------- Estilos compartidos de gráficos ---------- */
const tick = { fontFamily: 'Inter, sans-serif', fontSize: 11, fill: C.ter }
export const xAxis = { tick, tickLine: false, axisLine: { stroke: 'rgba(26,26,46,.15)' } } as const
export const yAxis = {
  tick,
  tickLine: false,
  axisLine: false,
  width: 48,
  tickFormatter: (v: number) => nf(v),
} as const
export const grid = { vertical: false, strokeDasharray: '3 3', stroke: 'rgba(26,26,46,.08)' } as const
export const legendProps = {
  verticalAlign: 'bottom',
  iconType: 'circle',
  iconSize: 8,
  wrapperStyle: { fontSize: 12, fontFamily: 'DM Sans, sans-serif', color: C.sec, paddingTop: 12 },
} as const
export const cursorFill = { fill: 'rgba(26,26,46,.04)' }

export function useAnim() {
  const reduce = useReducedMotion()
  return { isAnimationActive: !reduce, animationDuration: 1000, animationEasing: 'ease-out' } as const
}

/* ---------- Estructura ---------- */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

const ICONS = [Building2, Building, Landmark, KeyRound, Store, Warehouse, Hotel, DoorOpen]

export function Section({
  id,
  num,
  label,
  title,
  lede,
  dark,
  alt,
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
  const Icon = ICONS[(parseInt(num, 10) || 0) % ICONS.length]
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
    <section id={id} className={`relative scroll-mt-16 overflow-hidden py-14 md:py-20 ${dark ? 'bg-ink text-white' : alt ? 'bg-white/60' : ''}`}>
      <span
        aria-hidden
        className={`pointer-events-none absolute -top-2 right-2 select-none font-display text-[120px] font-semibold leading-none md:right-10 md:text-[200px] ${
          dark ? 'text-white/[.04]' : 'text-arena/[.14]'
        }`}
      >
        {num}
      </span>
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        <Reveal>
          <div className="flex items-center gap-3 font-sans text-xs uppercase tracking-[.2em] text-arena">
            <Icon size={16} strokeWidth={1.6} aria-hidden />
            <span className="font-num text-[11px] font-semibold">{num}</span>
            <span className="h-px w-8 bg-arena/60" />
            <span>{label}</span>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls={`${id}-contenido`}
              className={`no-print relative z-10 ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold normal-case tracking-normal transition-colors ${
                dark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-ink shadow-card hover:bg-base'
              }`}
            >
              {open ? 'Ocultar' : 'Mostrar'}
              <ChevronUp size={14} className={`transition-transform ${open ? '' : 'rotate-180'}`} />
            </button>
          </div>
          {title && (
            <h2
              className={`mt-4 max-w-4xl font-display text-[28px] font-semibold leading-tight md:text-[40px] ${
                dark ? 'text-white' : 'text-ink'
              }`}
            >
              {title}
            </h2>
          )}
          {lede && <p className={`mt-4 max-w-2xl font-sans text-base leading-relaxed ${dark ? 'text-white/70' : 'text-sec'}`}>{lede}</p>}
        </Reveal>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={`${id}-contenido`}
              key="c"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
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

export function Card({
  children,
  className = '',
  large,
}: {
  children: ReactNode
  className?: string
  large?: boolean
}) {
  return (
    <div
      className={`min-w-0 border border-ink/[.06] bg-white shadow-card ${
        large ? 'rounded-3xl p-5 sm:p-8' : 'rounded-2xl p-5 sm:p-6'
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-4 font-sans text-base font-bold text-ink">{children}</h3>
}

export function Source({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return <p className={`mt-4 text-sm italic ${dark ? 'text-white/60' : 'text-ter'}`}>{children}</p>
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
    const c = animate(0, value, { duration: 1.6, ease: 'easeOut', onUpdate: setShown })
    return () => c.stop()
  }, [inView, value, reduce])
  if (value == null) return <span>—</span>
  const fmt = (n: number) => `${prefix}${nf(n, decimals)}${suffix}`
  return <span ref={ref}>{reduce ? fmt(value) : fmt(inView ? shown : 0)}</span>
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 flex gap-2 rounded-lg bg-base px-3 py-2 font-sans text-xs leading-snug text-sec">
      <Info size={13} className="mt-px shrink-0 text-arena" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

export function Delta({ v, children }: { v: number; children?: ReactNode }) {
  const up = v >= 0
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-num text-[11px] font-semibold text-ink ${
        up ? 'bg-menta/70' : 'bg-rosa/70'
      }`}
    >
      {up ? '▲' : '▼'} {children ?? `${nf(Math.abs(v), 1)} %`}
    </span>
  )
}

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
  tone = 'arena',
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
  tone?: 'arena' | 'menta' | 'lavanda' | 'rosa'
  className?: string
}) {
  const bar = { arena: 'bg-arena', menta: 'bg-menta', lavanda: 'bg-lavanda', rosa: 'bg-rosa' }[tone]
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} aria-hidden />
      <p className="font-sans text-[11px] font-bold uppercase tracking-[.14em] text-sec">{label}</p>
      <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
        <span className="break-words font-display text-4xl font-semibold leading-none text-ink md:text-[44px]">
          {text ?? <Num value={value ?? null} decimals={decimals} prefix={prefix} suffix={suffix} />}
        </span>
        {delta}
      </div>
      {sub && <p className="mt-3 border-t border-ink/[.07] pt-3 font-sans text-[13px] leading-snug text-sec">{sub}</p>}
      {hint && <Hint>{hint}</Hint>}
    </Card>
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
    <div role="group" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-base p-1">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          aria-pressed={value === o.v}
          onClick={() => onChange(o.v)}
          className={`rounded-full px-4 py-1.5 font-sans text-sm transition-colors ${
            value === o.v ? 'bg-ink text-white' : 'text-sec hover:text-ink'
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  )
}

export function Tag({ children, tone }: { children: ReactNode; tone: 'menta' | 'lavanda' | 'arena' | 'rosa' }) {
  const bg = { menta: 'bg-menta', lavanda: 'bg-lavanda', arena: 'bg-arena', rosa: 'bg-rosa' }[tone]
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 font-sans text-xs font-medium text-ink ${bg}`}>
      {children}
    </span>
  )
}

/* ---------- Gráficos ---------- */
export function ChartBox({
  label,
  className = 'h-[240px] sm:h-[340px]',
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
    <div className="max-w-[260px] rounded-xl bg-white p-3 font-sans text-xs shadow-card">
      <p className="mb-1.5 font-bold text-ink">{head ? head(label, row) : label}</p>
      {payload
        .filter((p) => p.value != null && p.name != null)
        .map((p, i) => (
          <p key={i} className="flex items-center gap-2 text-sec">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color ?? p.fill ?? p.stroke }} />
            <span>{p.name}:</span>
            <span className="ml-auto pl-3 font-num font-medium text-ink">
              {fmt ? fmt(p.value, p.name) : nf(p.value)}
            </span>
          </p>
        ))}
      {foot && <div className="mt-1.5 border-t border-ink/10 pt-1.5 text-sec">{foot(row)}</div>}
    </div>
  )
}

/** Filas con separadores sutiles y zebra, sin bordes gruesos. */
export function ZebraRow({ children, i, className = '' }: { children: ReactNode; i: number; className?: string }) {
  return <div className={`px-3 py-3 sm:px-4 ${i % 2 ? 'bg-base' : 'bg-white'} ${className}`}>{children}</div>
}
