import { useMemo, useState } from 'react'
import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts'
import { weekly } from '../data/report'
import { C, Card, CardTitle, ChartBox, Kpi, Section, Segmented, Source, Tip, cursorFill, grid, legendProps, useAnim, xAxis, yAxis } from '../components/ui'
import { linreg, mean, median, nf, stdev } from '../lib/stats'

type Metric = 'vistas' | 'inter' | 'pubs'

export const totals = weekly.map((w) => w.vistasReels + w.vistasTikTok)

export default function Semanal() {
  const anim = useAnim()
  const [metric, setMetric] = useState<Metric>('vistas')

  const rows = useMemo(() => {
    const ma = totals.map((_, i) => (i < 2 ? null : mean(totals.slice(i - 2, i + 1))))
    return weekly.map((w, i) => {
      const base = { label: `S${w.sem}`, w }
      if (metric === 'vistas') return { ...base, a: w.reels ? w.vistasReels : null, b: w.tiktoks ? w.vistasTikTok : null, line: ma[i] }
      if (metric === 'inter') return { ...base, a: w.reels ? w.inter : null, b: null, line: null }
      return { ...base, a: w.reels, b: w.tiktoks, line: null }
    })
  }, [metric])

  const avg = mean(totals)
  const lr = linreg(totals.map((_, i) => i + 1), totals)
  const sd = stdev(totals)
  const over = totals.filter((t) => t > avg + sd).length
  const med312 = median(totals.slice(2))

  return (
    <Section
      id="semanal"
      num="03"
      label="Serie semanal"
      title="La primera semana concentra el 31 % de las vistas; desde la semana 7 el nivel se estabiliza cerca de 4.000"
    >
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card large>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <CardTitle>
              {metric === 'vistas' ? 'Vistas por semana' : metric === 'inter' ? 'Interacciones en reels por semana' : 'Publicaciones por semana'}
            </CardTitle>
            <Segmented
              label="Métrica del gráfico"
              value={metric}
              onChange={setMetric}
              options={[
                { v: 'vistas', l: 'Vistas' },
                { v: 'inter', l: 'Interacciones' },
                { v: 'pubs', l: 'Publicaciones' },
              ]}
            />
          </div>
          <ChartBox
            className="h-[280px] sm:h-[400px]"
            label="Barras apiladas por semana de reels y TikTok con media móvil de 3 semanas: la semana 1 y la semana 2 superan ampliamente al resto"
          >
            <ComposedChart data={rows} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...grid} />
              <XAxis dataKey="label" {...xAxis} />
              <YAxis {...yAxis} />
              <Tooltip
                cursor={cursorFill}
                content={
                  <Tip
                    head={(_l, r) => `Semana ${r.w.sem} · desde el ${r.w.inicio}`}
                    foot={(r) =>
                      metric === 'vistas' ? (
                        <>
                          <p>Total: <b className="font-num text-ink">{r.a == null && r.b == null ? '—' : nf((r.a ?? 0) + (r.b ?? 0))}</b></p>
                          <p>Publicaciones: <b className="font-num text-ink">{nf(r.w.reels + r.w.tiktoks)}</b></p>
                        </>
                      ) : (
                        <p>Publicaciones: <b className="font-num text-ink">{nf(r.w.reels + r.w.tiktoks)}</b></p>
                      )
                    }
                  />
                }
              />
              <Legend {...legendProps} />
              <Bar dataKey="a" name="Reels" stackId="s" fill={C.arena} radius={[6, 6, 0, 0]} {...anim} />
              {metric !== 'inter' && (
                <Bar dataKey="b" name="TikTok" stackId="s" fill={C.lavanda} radius={[6, 6, 0, 0]} {...anim} />
              )}
              {metric === 'vistas' && (
                <Line
                  dataKey="line"
                  name="Media móvil (3 semanas)"
                  type="monotone"
                  stroke={C.ink}
                  strokeWidth={2.5}
                  dot={{ r: 2.5, stroke: '#fff', strokeWidth: 1.5, fill: C.ink }}
                  connectNulls={false}
                  {...anim}
                />
              )}
            </ComposedChart>
          </ChartBox>
          <Source>
            Fuente: panel de Instagram y perfil de TikTok. La media móvil comienza en la semana 3; en las semanas sin publicación el dato se omite.
          </Source>
        </Card>
        <div className="grid content-start gap-4">
          <Kpi value={avg} label="Vistas promedio por semana" sub={`Mediana S3 a S12: ${nf(med312)}`} />
          <Kpi value={lr.slope} label="Tendencia lineal, vistas por semana" sub={`R² = ${nf(lr.r2, 2)}`} />
          <Kpi value={over} label="Semanas sobre la media + 1 desviación" sub="S1 y S2" />
        </div>
      </div>
    </Section>
  )
}
