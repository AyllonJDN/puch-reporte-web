import { useMemo, useState } from 'react'
import { ArrowDownUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import { reels } from '../data/report'
import { C, Card, CardTitle, ChartBox, Kpi, Section, Segmented, Source, Tag, Tip, cursorFill, grid, useAnim, xAxis, yAxis } from '../components/ui'
import { dlong, dm, mean, median, nf, pct, snip, stdev, sum } from '../lib/stats'

export type Reel = (typeof reels)[number]
export const rate = (r: Reel) => (r.inter / r.vistas) * 100

export function claseTag(c: string) {
  if (c.includes('alta')) return <Tag tone="menta">Coincidencia alta</Tag>
  if (c.includes('probable')) return <Tag tone="lavanda">Coincidencia probable</Tag>
  if (c.startsWith('Listado')) return <Tag tone="arena">Listado de propiedad</Tag>
  return <Tag tone="rosa">Sin guion</Tag>
}

type SortKey = 'f' | 'vistas' | 'tasa'

export default function Reels() {
  const anim = useAnim()
  const [key, setKey] = useState<SortKey>('f')
  const [desc, setDesc] = useState(false)

  const views = reels.map((r) => r.vistas)
  const avg = mean(views)
  const max = Math.max(...views)
  const top5 = sum([...views].sort((a, b) => b - a).slice(0, 5))
  const first = mean(views.slice(0, 13))
  const last = mean(views.slice(13))
  const moe = (1.96 * stdev(views)) / Math.sqrt(views.length)
  const data = reels.map((r, i) => ({ i, ...r }))

  const sorted = useMemo(() => {
    const val = (r: Reel) => (key === 'f' ? r.f : key === 'vistas' ? r.vistas : rate(r))
    const out = [...reels].sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0))
    return desc ? out.reverse() : out
  }, [key, desc])

  return (
    <Section
      id="reels"
      alt
      num="06"
      label="Instagram · Reels"
      title="27 reels sumaron 80.427 vistas; el rendimiento por pieza cayó 62 % entre la primera y la segunda mitad"
    >
      <Card large>
        <CardTitle>Vistas por reel, en orden cronológico</CardTitle>
        <ChartBox
          className="h-[260px] sm:h-[380px]"
          label="Barras de vistas por reel en orden cronológico: el reel del 7 de agosto alcanza 13.511 vistas y el promedio es 2.979"
        >
          <BarChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid {...grid} />
            <XAxis dataKey="i" {...xAxis} interval={0} angle={-60} textAnchor="end" height={48} tickFormatter={(i: number) => dm(reels[i].f)} />
            <YAxis {...yAxis} />
            <Tooltip cursor={cursorFill} content={<Tip head={(_l, r) => `${dlong(r.f)} · ${snip(r.texto).slice(0, 70)}`} />} />
            <ReferenceLine y={avg} stroke={C.ink} strokeDasharray="5 4" strokeOpacity={0.5} label={{ value: `Promedio ${nf(avg)}`, position: 'insideTopRight', fill: C.sec, fontSize: 11 }} />
            <Bar dataKey="vistas" name="Vistas" radius={[6, 6, 0, 0]} {...anim}>
              {data.map((d) => (
                <Cell key={d.i} fill={d.vistas === max ? C.ink : C.arena} />
              ))}
            </Bar>
          </BarChart>
        </ChartBox>
        <Source>Fuente: estadísticas individuales de cada reel en el panel de Instagram. Fechas en hora de Lima.</Source>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Kpi value={avg} label="Vistas promedio por reel" sub={`Mediana ${nf(median(views))} · margen de error 95 %: ±${nf(moe)}`} />
        <Kpi value={Math.round((top5 / sum(views)) * 100)} suffix=" %" label="Del volumen, en los 5 mejores reels" sub={`Máximo ${nf(max)}, 7 de agosto`} />
        <Kpi text={`${nf(first)} → ${nf(last)}`} label="Promedio de los 13 primeros frente a los 14 últimos" sub={`Caída de ${nf(Math.round((1 - last / first) * 100))} %`} />
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="font-sans text-sm text-sec">Ordenar por</span>
          <Segmented
            label="Ordenar reels"
            value={key}
            onChange={(k) => {
              setKey(k)
              setDesc(k !== 'f')
            }}
            options={[
              { v: 'f', l: 'Fecha' },
              { v: 'vistas', l: 'Vistas' },
              { v: 'tasa', l: 'Tasa de interacción' },
            ]}
          />
          <button type="button" onClick={() => setDesc(!desc)} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm text-sec shadow-card">
            <ArrowDownUp size={14} /> {desc ? 'Mayor a menor' : 'Menor a mayor'}
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {sorted.map((r) => (
            <Card key={r.f + r.vistas}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-num text-xs font-semibold text-ink">{dlong(r.f)}</span>
                {claseTag(r.clase)}
              </div>
              <p className="mt-2 line-clamp-2 font-sans text-sm text-ink">{snip(r.texto)}</p>
              <dl className="mt-3 grid grid-cols-4 gap-x-2 gap-y-2 font-num text-xs">
                {[
                  ['Vistas', nf(r.vistas)],
                  ['% seguid.', pct(r.pctSeg)],
                  ['Alcance', nf(r.alcance)],
                  ['Tasa', pct(rate(r), 2)],
                  ['Me gusta', nf(r.likes)],
                  ['Comentarios', nf(r.com)],
                  ['Guardados', nf(r.guard)],
                  ['Compartidos', nf(r.comp)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-sans text-[11px] text-ter">{k}</dt>
                    <dd className="font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  )
}
