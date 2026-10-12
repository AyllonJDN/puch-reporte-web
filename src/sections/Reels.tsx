import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import { reels } from '../data/report'
import PieceList from '../components/PieceList'
import type { Piece } from '../components/PieceList'
import { C, Card, CardTitle, ChartBox, Kpi, Section, Source, Tag, Tip, cursorFill, grid, useAnim, xAxis, yAxis } from '../components/ui'
import { dlong, dm, mean, median, nf, pct, snip, stdev, sum } from '../lib/stats'

export type Reel = (typeof reels)[number]
export const rate = (r: Reel) => (r.inter / r.vistas) * 100

export function claseTag(c: string) {
  if (c.includes('alta')) return <Tag tone="olive">Coincidencia alta</Tag>
  if (c.includes('probable')) return <Tag tone="coral">Coincidencia probable</Tag>
  if (c.startsWith('Listado')) return <Tag tone="peri">Listado de propiedad</Tag>
  return <Tag tone="clay">Sin guion</Tag>
}

export default function Reels() {
  const anim = useAnim()

  const views = reels.map((r) => r.vistas)
  const avg = mean(views)
  const max = Math.max(...views)
  const top5 = sum([...views].sort((a, b) => b - a).slice(0, 5))
  const first = mean(views.slice(0, 13))
  const last = mean(views.slice(13))
  const moe = (1.96 * stdev(views)) / Math.sqrt(views.length)
  const data = reels.map((r, i) => ({ i, ...r }))

  const pieces: Piece[] = reels.map((r, i) => ({
    id: `${i}`,
    f: r.f,
    texto: r.texto,
    vistas: r.vistas,
    chip: pct(rate(r), 2),
    badge: claseTag(r.clase),
    metrics: [
      ['Vistas', nf(r.vistas)],
      ['% de seguidores', pct(r.pctSeg)],
      ['Alcance', nf(r.alcance)],
      ['Tasa de interacción', pct(rate(r), 2)],
      ['Me gusta', nf(r.likes)],
      ['Comentarios', nf(r.com)],
      ['Guardados', nf(r.guard)],
      ['Compartidos', nf(r.comp)],
    ],
  }))

  return (
    <Section
      id="reels"
      alt
      num="06"
      label="Instagram · Reels"
      title="27 reels sumaron 80.427 vistas; el rendimiento por pieza *cayó* 62 % entre la primera y la segunda mitad"
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
                <Cell key={d.i} fill={d.vistas === max ? C.peri : C.periDim} />
              ))}
            </Bar>
          </BarChart>
        </ChartBox>
        <Source>Fuente: estadísticas individuales de cada reel en el panel de Instagram. Fechas en hora de Lima.</Source>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Kpi value={avg} label="Vistas promedio por reel" sub={`Mediana ${nf(median(views))} · margen de error 95 %: ±${nf(moe)}`} hint={`El margen de error indica el rango probable del promedio real: entre ${nf(avg - moe)} y ${nf(avg + moe)} vistas por reel, con 95 % de confianza.`} />
        <Kpi value={Math.round((top5 / sum(views)) * 100)} suffix=" %" label="Del volumen, en los 5 mejores reels" sub={`Máximo ${nf(max)}, 7 de agosto`} tone="coral" hint="Mide la concentración: cuanto más alto, más depende el resultado total de muy pocas piezas." />
        <Kpi text={`${nf(first)} → ${nf(last)}`} label="Promedio de los 13 primeros frente a los 14 últimos" sub={`Caída de ${nf(Math.round((1 - last / first) * 100))} %`} tone="clay" hint="Compara el rendimiento típico de un reel al inicio de la ventana con el del final: cada reel reciente rinde bastante menos." />
      </div>

      <PieceList
        noun="reels"
        accent={C.peri}
        chipLabel="tasa"
        items={pieces}
        sorts={[
          { v: 'vistas', l: 'Vistas', get: (p) => p.vistas },
          { v: 'f', l: 'Fecha', get: (p) => p.f },
          { v: 'tasa', l: 'Interacción', get: (p) => parseFloat(p.chip!.replace(',', '.')) },
        ]}
      />
    </Section>
  )
}
