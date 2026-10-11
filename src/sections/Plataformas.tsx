import { Bar, BarChart, CartesianGrid, LabelList, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { account90d, reels, tiktok, tiktokProfile, weekly } from '../data/report'
import { C, Card, CardTitle, ChartBox, Section, Source, Tip, ZebraRow, cursorFill, grid, legendProps, useAnim, xAxis, yAxis } from '../components/ui'
import { mean, median, nf, pct, sum } from '../lib/stats'

export default function Plataformas() {
  const anim = useAnim()
  const rv = reels.map((r) => r.vistas)
  const tv = tiktok.map((t) => t.vistas)
  const rTot = sum(rv)
  const tTot = sum(tv)
  const rInter = sum(reels.map((r) => r.inter))
  const tInter = sum(tiktok.map((t) => t.likes + t.com + t.guard))
  const rows: [string, string, string][] = [
    ['Piezas publicadas', nf(rv.length), nf(tv.length)],
    ['Vistas en la ventana', nf(rTot), nf(tTot)],
    ['Mediana por pieza', nf(median(rv)), nf(median(tv))],
    ['Pieza máxima', nf(Math.max(...rv)), nf(Math.max(...tv))],
    ['Concentración de la pieza máxima', pct((Math.max(...rv) / rTot) * 100, 0), pct((Math.max(...tv) / tTot) * 100, 0)],
    ['Vistas por seguidor', nf(rTot / account90d.seguidores), nf(tTot / tiktokProfile.seguidores)],
    ['Interacción sobre vistas', pct((rInter / rTot) * 100, 2), `${pct((tInter / tTot) * 100, 2)}*`],
    ['Semanas con publicación', `${weekly.filter((w) => w.reels).length} de 12`, `${weekly.filter((w) => w.tiktoks).length} de 12`],
  ]
  const data = [
    { n: 'Promedio', ig: mean(rv), tt: mean(tv) },
    { n: 'Mediana', ig: median(rv), tt: median(tv) },
  ]
  const lab = { position: 'top', formatter: (v: any) => nf(v), style: { fontFamily: 'Inter', fontSize: 11, fill: C.ink } } as const

  return (
    <Section
      id="plataformas"
      alt
      num="09"
      label="Instagram frente a TikTok"
      title="Instagram es más estable; TikTok es más explosivo y depende de una sola pieza"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card large>
          <CardTitle>Comparación de plataformas</CardTitle>
          <div className="overflow-hidden rounded-xl">
            <ZebraRow i={1} className="grid grid-cols-[1fr_88px_88px] gap-2 font-sans text-xs font-bold text-ink sm:grid-cols-[1fr_110px_110px]">
              <span />
              <span className="text-right">Instagram</span>
              <span className="text-right">TikTok</span>
            </ZebraRow>
            {rows.map(([k, a, b], i) => (
              <ZebraRow key={k} i={i} className="grid grid-cols-[1fr_88px_88px] items-center gap-2 sm:grid-cols-[1fr_110px_110px]">
                <span className="font-sans text-sm text-sec">{k}</span>
                <span className="text-right font-num text-sm font-semibold text-ink">{a}</span>
                <span className="text-right font-num text-sm font-semibold text-ink">{b}</span>
              </ZebraRow>
            ))}
          </div>
          <Source>* Interacción en TikTok sin compartidos: la plataforma no los expone sin sesión iniciada.</Source>
        </Card>
        <Card large>
          <CardTitle>Vistas por pieza: promedio y mediana</CardTitle>
          <ChartBox label="Barras agrupadas de vistas por pieza: Instagram promedia 2.979 y su mediana es 2.241; TikTok promedia 3.500 pero su mediana es 739">
            <BarChart data={data} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...grid} />
              <XAxis dataKey="n" {...xAxis} />
              <YAxis {...yAxis} />
              <Tooltip cursor={cursorFill} content={<Tip />} />
              <Legend {...legendProps} />
              <Bar dataKey="ig" name="Instagram" fill={C.arena} radius={[6, 6, 0, 0]} {...anim}>
                <LabelList dataKey="ig" {...lab} />
              </Bar>
              <Bar dataKey="tt" name="TikTok" fill={C.lavanda} radius={[6, 6, 0, 0]} {...anim}>
                <LabelList dataKey="tt" {...lab} />
              </Bar>
            </BarChart>
          </ChartBox>
        </Card>
      </div>
    </Section>
  )
}
