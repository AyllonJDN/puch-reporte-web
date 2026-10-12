import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownUp, ChevronDown } from 'lucide-react'
import { Card, Segmented } from './ui'
import { dlong, nf, snip } from '../lib/stats'

export type Piece = {
  id: string
  f: string
  texto: string
  vistas: number
  chip?: string
  badge?: ReactNode
  metrics: [string, string][]
}

export type SortOpt = { v: string; l: string; get: (p: Piece) => number | string }

/**
 * Ranking compacto: una línea por pieza con barra proporcional de vistas.
 * Cada fila se despliega para ver todas las métricas; por defecto muestra solo las primeras.
 */
export default function PieceList({
  items,
  sorts,
  accent,
  chipLabel,
  initial = 8,
  noun,
}: {
  items: Piece[]
  sorts: SortOpt[]
  accent: string
  chipLabel?: string
  initial?: number
  noun: string
}) {
  const [key, setKey] = useState(sorts[0].v)
  const [desc, setDesc] = useState(true)
  const [open, setOpen] = useState<string | null>(null)
  const [all, setAll] = useState(false)

  const sorted = useMemo(() => {
    const get = sorts.find((s) => s.v === key)!.get
    const out = [...items].sort((a, b) => (get(a) > get(b) ? 1 : get(a) < get(b) ? -1 : 0))
    return desc ? out.reverse() : out
  }, [items, key, desc, sorts])

  const max = Math.max(...items.map((i) => i.vistas))
  const shown = all ? sorted : sorted.slice(0, initial)

  return (
    <Card large className="!p-0">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-4 sm:px-6">
        <div className="mr-auto">
          <h3 className="font-sans text-base font-bold text-t1">Ranking de {noun}</h3>
          <p className="font-sans text-xs text-t3">Toca una fila para ver todas sus métricas</p>
        </div>
        <Segmented
          label={`Ordenar ${noun}`}
          value={key}
          onChange={(k) => {
            setKey(k)
            setDesc(true)
          }}
          options={sorts.map((s) => ({ v: s.v, l: s.l }))}
        />
        <button
          type="button"
          onClick={() => setDesc(!desc)}
          className="flex items-center gap-1.5 rounded-full bg-cream/[.06] px-3 py-2 text-sm text-t2"
          aria-label="Invertir el orden"
        >
          <ArrowDownUp size={14} /> {desc ? 'Mayor a menor' : 'Menor a mayor'}
        </button>
      </div>

      <div className="hidden grid-cols-[28px_52px_minmax(0,1fr)_240px_24px] gap-3 px-6 pb-1 pt-3 font-sans text-[10px] font-bold uppercase tracking-[.14em] text-t3 md:grid">
        <span>#</span>
        <span>Fecha</span>
        <span>Pieza</span>
        <span>Vistas{chipLabel ? ` · ${chipLabel}` : ''}</span>
        <span />
      </div>

      <ul>
        {shown.map((p, i) => {
          const isOpen = open === p.id
          return (
            <li key={p.id} className={`border-t border-line ${i % 2 ? 'bg-cream/[.04]' : ''}`}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : p.id)}
                className="grid w-full grid-cols-[28px_1fr_24px] items-center gap-x-3 gap-y-1.5 px-4 py-2.5 text-left sm:px-6 md:grid-cols-[28px_52px_minmax(0,1fr)_240px_24px]"
              >
                <span className="font-num text-[11px] text-t3">{i + 1}</span>
                <span className="hidden font-num text-xs font-semibold text-t1 md:block">{dlong(p.f)}</span>
                <span className="truncate font-sans text-sm text-t1">
                  <span className="mr-2 font-num text-xs font-semibold text-t3 md:hidden">{dlong(p.f)}</span>
                  {snip(p.texto)}
                </span>
                <ChevronDown size={16} className={`text-t3 transition-transform md:order-last ${isOpen ? 'rotate-180' : ''}`} />
                <span className="flex items-center gap-2 max-md:col-span-2 max-md:col-start-2">
                  <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-deep/[.07]">
                    <motion.span
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: accent }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.vistas / max) * 100}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  </span>
                  <span className="w-14 text-right font-num text-xs font-semibold text-t1">{nf(p.vistas)}</span>
                  {p.chip && <span className="w-12 text-right font-num text-[11px] text-t2">{p.chip}</span>}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 sm:px-6 md:pl-[100px]">
                      <p className="font-sans text-sm leading-relaxed text-t2">{snip(p.texto)}</p>
                      {p.badge && <div className="mt-2">{p.badge}</div>}
                      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                        {p.metrics.map(([k, v]) => (
                          <div key={k}>
                            <dt className="font-sans text-[11px] text-t3">{k}</dt>
                            <dd className="font-num text-sm font-semibold text-t1">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>

      {sorted.length > initial && (
        <button
          type="button"
          onClick={() => setAll(!all)}
          className="flex w-full items-center justify-center gap-2 border-t border-line py-3.5 font-sans text-sm font-bold text-t1 hover:bg-cream/[.06]"
        >
          {all ? `Mostrar solo los primeros ${initial}` : `Ver los ${sorted.length} ${noun}`}
          <ChevronDown size={16} className={all ? 'rotate-180' : ''} />
        </button>
      )}
    </Card>
  )
}
