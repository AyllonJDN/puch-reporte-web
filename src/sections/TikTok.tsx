import { useMemo, useState } from 'react'
import { ArrowDownUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from 'recharts'
import { tiktok, tiktokProfile } from '../data/report'
import { C, Card, CardTitle, ChartBox, Kpi, Section, Segmented, Source, Tip, ZebraRow, cursorFill, grid, useAnim, xAxis, yAxis } from '../components/ui'
import { dlong, dm, median, nf, snip, sum } from '../lib/stats'

type Key = 'f' | 'vistas' | 'likes' | 'com' | 'guard'
const cols: { k: Exclude<Key, 'f'>; l: string }[] = [
  { k: 'vistas', l: 'Vistas' },
  { k: 'likes', l: 'Me gusta' },
  { k: 'com', l: 'Comentarios' },
  { k: 'guard', l: 'Guardados' },
]

export default function TikTok() {
  const anim = useAnim()
  const [key, setKey] = useState<Key>('f')
  const [desc, setDesc] = useState(false)
  const views = tiktok.map((t) => t.vistas)
  const total = sum(views)
  const max = Math.max(...views)
  const inter = sum(tiktok.map((t) => t.likes + t.com + t.guard))
  const data = tiktok.map((t, i) => ({ i, ...t }))
  const sorted = useMemo(() => {
    const out = [...tiktok].sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0))
    return desc ? out.reverse() : out
  }, [key, desc])

  return (
    <Section
      id="tiktok"
      num="08"
      label="TikTok"
      title="Un solo video explica dos tercios de las vistas; lo habitual es entre 400 y 1.000 por video"
    >
      <Card large>
        <CardTitle>Vistas por video, en orden cronológico</CardTitle>
        <ChartBox
          className="h-[260px] sm:h-[360px]"
          label="Barras de vistas por video de TikTok: el video del 16 de julio concentra 34.800 vistas, dos tercios del total"
        >
          <BarChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid {...grid} />
            <XAxis dataKey="i" {...xAxis} interval={0} angle={-60} textAnchor="end" height={48} tickFormatter={(i: number) => dm(tiktok[i].f)} />
            <YAxis {...yAxis} />
            <Tooltip cursor={cursorFill} content={<Tip head={(_l, r) => `${dlong(r.f)} · ${snip(r.texto).slice(0, 70)}`} />} />
            <Bar dataKey="vistas" name="Vistas" radius={[6, 6, 0, 0]} {...anim}>
              {data.map((d) => (
                <Cell key={d.i} fill={d.vistas === max ? C.ink : C.lavanda} />
              ))}
            </Bar>
          </BarChart>
        </ChartBox>
        <Source>Fuente: perfil público de TikTok, lectura pieza por pieza. Fechas en hora de Lima.</Source>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi value={total} label="Vistas" sub={`${tiktok.length} videos (mediana ${nf(median(views))})`} />
        <Kpi value={Math.round((max / total) * 100)} suffix=" %" label="En el video del 16 de julio" sub={`${nf(max)} vistas`} />
        <Kpi value={(inter / total) * 100} decimals={1} suffix=" %" label="Interacción sobre vistas" sub="Sin compartidos, que TikTok no expone sin sesión" />
        <Kpi value={3} label="Semanas sin publicar" sub="Del 7 al 27 de septiembre · último video: 2 de octubre" />
        <Kpi value={tiktokProfile.seguidores} label="Seguidores en TikTok" />
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="font-sans text-sm text-sec">Ordenar por</span>
          <Segmented
            label="Ordenar videos"
            value={key}
            onChange={(k) => {
              setKey(k)
              setDesc(k !== 'f')
            }}
            options={[{ v: 'f', l: 'Fecha' }, ...cols.map((c) => ({ v: c.k, l: c.l }))]}
          />
          <button type="button" onClick={() => setDesc(!desc)} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm text-sec shadow-card">
            <ArrowDownUp size={14} /> {desc ? 'Mayor a menor' : 'Menor a mayor'}
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-card">
          {sorted.map((t, i) => (
            <ZebraRow key={t.f + t.vistas} i={i} className="grid gap-x-4 gap-y-2 md:grid-cols-[72px_1fr_repeat(4,80px)] md:items-center">
              <span className="font-num text-xs font-semibold text-ink">{dlong(t.f)}</span>
              <span className="font-sans text-sm text-ink">{snip(t.texto)}</span>
              <div className="grid grid-cols-4 gap-2 md:contents">
                {cols.map((c) => (
                  <div key={c.k} className="md:text-right">
                    <p className="font-sans text-[11px] text-ter md:hidden">{c.l}</p>
                    <p className="font-num text-xs font-semibold text-ink">{nf(t[c.k])}</p>
                  </div>
                ))}
              </div>
            </ZebraRow>
          ))}
        </div>
        <Source>TikTok no expone compartidos sin sesión iniciada; su tasa no es estrictamente comparable con la de Instagram.</Source>
      </div>
    </Section>
  )
}
