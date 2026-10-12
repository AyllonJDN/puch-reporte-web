import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Funnel, FunnelChart, LabelList, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { guiones } from '../data/report'
import { C, Card, CardTitle, ChartBox, Kpi, Section, Source, Tag, Tip, cursorFill, grid, legendProps, useAnim, xAxis } from '../components/ui'
import { dlong, nf } from '../lib/stats'

const ESTADOS = ['Grabado', 'Aprobado', 'En revisión'] as const
const tone = { Grabado: 'menta', Aprobado: 'lavanda', 'En revisión': 'arena' } as const

export default function Guiones() {
  const anim = useAnim()
  const [estado, setEstado] = useState('todos')
  const [semana, setSemana] = useState('todas')
  const [abierto, setAbierto] = useState<number | null>(null)
  const [all, setAll] = useState(false)

  const conteo = ESTADOS.map((e) => {
    const l = guiones.filter((g) => g.estado === e)
    const con = l.filter((g) => g.publicaciones.length > 0).length
    return { estado: e, con, sin: l.length - con, total: l.length }
  })
  const con = conteo.reduce((s, c) => s + c.con, 0)
  const aprob = conteo[1]
  const filtered = useMemo(
    () => guiones.filter((g) => (estado === 'todos' || g.estado === estado) && (semana === 'todas' || g.sem === +semana)),
    [estado, semana],
  )
  const funnel = [
    { name: 'Guiones escritos', value: guiones.length, fill: C.arena, label: `Guiones escritos · ${guiones.length}` },
    { name: 'Aprobados o grabados', value: conteo[0].total + conteo[1].total, fill: C.lavanda, label: `Aprobados o grabados · ${conteo[0].total + conteo[1].total}` },
    { name: 'Publicados', value: con, fill: C.menta, label: `Publicados · ${con}` },
  ]
  const sel = 'rounded-full bg-white px-4 py-2 font-sans text-sm text-ink shadow-card'

  return (
    <Section
      id="guiones"
      num="10"
      label="Guiones del portal"
      title="De 49 guiones escritos, 15 tienen una publicación identificable; ninguno de los 23 en revisión se publicó"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Kpi value={guiones.length} label="Guiones en 12 semanas" sub={`${conteo[0].total} grabados · ${aprob.total} aprobados · ${conteo[2].total} en revisión`} hint="Un guion pasa por tres estados: en revisión, aprobado y grabado. Solo los grabados deberían llegar a publicarse." />
        <Kpi text={`${conteo[0].con} de ${conteo[0].total}`} label="Grabados con publicación" sub="Los dos restantes son «Respuesta Jhonsan» y «YAP», piezas de reacción sin hallazgo" tone="menta" hint="Casi todo lo grabado terminó publicado: el cuello de botella está antes de grabar, en los guiones aprobados que esperan." />
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card large>
          <CardTitle>Guiones por estado</CardTitle>
          <ChartBox label="Barras horizontales apiladas por estado: de 15 grabados, 13 tienen publicación; de 11 aprobados, 2; de 23 en revisión, ninguno" className="h-[240px] sm:h-[280px]">
            <BarChart data={conteo} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="gCon" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={C.menta} />
                  <stop offset="100%" stopColor={C.menta} stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="gSin" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={C.sand} />
                  <stop offset="100%" stopColor={C.sand} stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid {...grid} horizontal={false} vertical />
              <XAxis type="number" {...xAxis} />
              <YAxis type="category" dataKey="estado" tickLine={false} axisLine={false} width={84} tick={{ fontFamily: 'DM Sans', fontSize: 12, fill: C.sec }} />
              <Tooltip cursor={cursorFill} content={<Tip />} />
              <Legend {...legendProps} />
              <Bar dataKey="con" name="Con publicación" stackId="g" fill="url(#gCon)" {...anim}>
                <LabelList dataKey="con" position="center" style={{ fontFamily: 'Inter', fontSize: 11, fill: C.ink }} />
              </Bar>
              <Bar dataKey="sin" name="Sin publicación" stackId="g" fill="url(#gSin)" radius={[0, 6, 6, 0]} {...anim}>
                <LabelList dataKey="sin" position="center" style={{ fontFamily: 'Inter', fontSize: 11, fill: C.ink }} />
              </Bar>
            </BarChart>
          </ChartBox>
        </Card>
        <Card large>
          <CardTitle>Embudo: de guion a publicación</CardTitle>
          <ChartBox label="Embudo de 49 guiones escritos, 26 aprobados o grabados y 15 publicados" className="h-[240px] sm:h-[280px]">
            <FunnelChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <Tooltip content={<Tip fmt={(v) => nf(v)} />} />
              <Funnel dataKey="value" data={funnel} isAnimationActive={anim.isAnimationActive} animationDuration={1000}>
                <LabelList dataKey="label" position="center" style={{ fontFamily: 'DM Sans', fontSize: 12, fill: C.ink }} stroke="none" />
              </Funnel>
            </FunnelChart>
          </ChartBox>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-sec">
            Estado
            <select value={estado} onChange={(e) => setEstado(e.target.value)} className={sel}>
              <option value="todos">Todos</option>
              {ESTADOS.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-sec">
            Semana
            <select value={semana} onChange={(e) => setSemana(e.target.value)} className={sel}>
              <option value="todas">Todas</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  S{i + 1}
                </option>
              ))}
            </select>
          </label>
          <span className="font-sans text-sm text-ter">
            {filtered.length} de {guiones.length} guiones
          </span>
        </div>
        <Card large className="!p-0">
          <ul>
            {(all ? filtered : filtered.slice(0, 10)).map((g, i) => {
              const isOpen = abierto === g.n
              return (
                <li key={g.n} className={`border-t border-ink/[.05] first:border-t-0 ${i % 2 ? 'bg-base/60' : ''}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setAbierto(isOpen ? null : g.n)}
                    className="grid w-full grid-cols-[56px_1fr_auto_24px] items-center gap-3 px-4 py-2.5 text-left sm:px-6"
                  >
                    <span className="font-num text-[11px] font-semibold text-ter">
                      {String(g.n).padStart(2, '0')} · S{g.sem}
                    </span>
                    <span className="truncate font-sans text-sm text-ink">{g.titulo}</span>
                    <span className="flex items-center gap-2">
                      {g.publicaciones.length > 0 && (
                        <span className="hidden font-num text-[11px] text-sec sm:inline">{g.publicaciones.length} pub.</span>
                      )}
                      <Tag tone={tone[g.estado as keyof typeof tone]}>{g.estado}</Tag>
                    </span>
                    <ChevronDown size={16} className={`text-ter transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                        <div className="px-4 pb-4 pt-1 sm:px-6 md:pl-[84px]">
                          <p className="font-sans text-sm text-sec">{g.gancho}</p>
                          <p className="mt-2 font-num text-xs text-ter">
                            {nf(g.caracteres)} caracteres · Calendario: {g.fechaCalendario ? dlong(g.fechaCalendario) : '—'}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {g.publicaciones.length === 0 ? (
                              <span className="text-xs text-ter">Publicación asociada: —</span>
                            ) : (
                              g.publicaciones.map((p, k) => (
                                <Tag key={k} tone={p.nivel === 'alta' ? 'menta' : 'lavanda'}>
                                  {p.plat === 'IG' ? 'Instagram' : 'TikTok'} · {dlong(p.fecha)} · {p.nivel}
                                </Tag>
                              ))
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
          {filtered.length > 10 && (
            <button
              type="button"
              onClick={() => setAll(!all)}
              className="flex w-full items-center justify-center gap-2 border-t border-ink/[.07] py-3.5 font-sans text-sm font-bold text-ink hover:bg-base"
            >
              {all ? 'Mostrar solo los primeros 10' : `Ver los ${filtered.length} guiones`}
              <ChevronDown size={16} className={all ? 'rotate-180' : ''} />
            </button>
          )}
        </Card>
        <Source>Fuente: portal de contenido The Framework. El cruce con las publicaciones se infirió por título, gancho y tema.</Source>
      </div>
    </Section>
  )
}
