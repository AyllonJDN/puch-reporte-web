import { CartesianGrid, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import { weekly } from '../data/report'
import { C, Card, CardTitle, ChartBox, Kpi, Section, Source, Tip, ZebraRow, grid, useAnim, xAxis, yAxis } from '../components/ui'
import { corr, cv, mean, median, nf, pct, stdev } from '../lib/stats'
import { totals } from './Semanal'

const refLabel = (value: string, fill: string, position: 'insideTopRight' | 'insideTopLeft') => ({
  value,
  position,
  fill,
  fontSize: 11,
  fontFamily: 'DM Sans',
})

export default function Estadistica() {
  const anim = useAnim()
  const m = mean(totals)
  const sd = stdev(totals)
  const data = weekly.map((w, i) => ({ label: `S${w.sem}`, v: totals[i], w }))
  const r = corr(
    weekly.map((w) => w.reels + w.tiktoks),
    totals,
  )
  const below = totals.filter((t) => t < m - sd).length
  const rows: [string, string][] = [
    ['Media', nf(m)],
    ['Mediana', nf(median(totals))],
    ['Desviación estándar (muestral)', nf(sd)],
    ['Mínimo', nf(Math.min(...totals))],
    ['Máximo', nf(Math.max(...totals))],
    ['Coeficiente de variación', pct(cv(totals))],
  ]

  return (
    <Section
      id="estadistica"
      num="05"
      label="Lectura estadística"
      title="Solo las semanas 1 y 2 salen de lo *normal*; el resto oscila por debajo de la media del periodo"
    >
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card large>
          <CardTitle>Carta de control: vistas combinadas por semana</CardTitle>
          <ChartBox
            className="h-[280px] sm:h-[380px]"
            label="Carta de control de vistas semanales con media y bandas de más y menos una desviación estándar: solo las semanas 1 y 2 superan la banda superior"
          >
            <LineChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid {...grid} />
              <XAxis dataKey="label" {...xAxis} />
              <YAxis {...yAxis} domain={[0, 45000]} />
              <Tooltip
                content={<Tip head={(_l, row) => `Semana ${row.w.sem}`} fmt={(v) => nf(v)} />}
              />
              <ReferenceLine y={m + sd} stroke={C.olive} strokeWidth={1.5} strokeDasharray="6 4" label={refLabel(`Media + 1σ ≈ ${nf(m + sd)}`, C.sec, 'insideTopRight')} />
              <ReferenceLine y={m} stroke={C.peri} strokeWidth={1.5} strokeDasharray="6 4" label={refLabel(`Media ${nf(m)}`, C.sec, 'insideTopRight')} />
              <ReferenceLine y={0} stroke={C.clay} strokeWidth={1.5} strokeDasharray="6 4" label={refLabel('Límite inferior no aplicable', C.sec, 'insideTopLeft')} />
              <Line
                dataKey="v"
                name="Vistas combinadas"
                type="monotone"
                stroke={C.ink}
                strokeWidth={2.5}
                dot={{ r: 2.5, stroke: '#fff', strokeWidth: 1.5, fill: C.ink }}
                {...anim}
              />
            </LineChart>
          </ChartBox>
          <Source>
            Fuente: panel de Instagram y perfil de TikTok. La media − 1σ (≈ −868) se recorta en 0 porque las vistas no pueden ser negativas.
          </Source>
        </Card>
        <div className="grid content-start gap-4">
          <Card>
            <p className="font-sans text-sm leading-relaxed text-t2">
              Una carta de control marca la media y una banda de ±1 desviación estándar: lo que cae fuera de ella es una semana excepcional.
            </p>
          </Card>
          <Kpi value={r} decimals={2} label="Correlación entre publicaciones y vistas" sub="Más piezas por semana se asocian a más vistas" tone="olive" hint="La correlación va de −1 a 1. Un valor de 0,57 indica una relación moderada y positiva; no prueba que publicar más cause más vistas." />
          <Kpi value={below || null} label="Semanas bajo la media − 1 desviación" sub="Ninguna" tone="coral" hint="Marcaría una semana inusualmente baja. Como ese límite es negativo, ninguna semana puede caer por debajo." />
        </div>
      </div>
      <Card large>
        <CardTitle>Estadísticos descriptivos · vistas combinadas semanales</CardTitle>
        <div className="overflow-hidden rounded-xl">
          {rows.map(([k, v], i) => (
            <ZebraRow key={k} i={i} className="flex items-center justify-between gap-4">
              <span className="font-sans text-sm text-t2">{k}</span>
              <span className="font-num text-sm font-semibold text-t1">{v}</span>
            </ZebraRow>
          ))}
        </div>
        <p className="mt-4 font-sans text-xs leading-relaxed text-t2">
          Media: promedio simple. Mediana: valor central, menos sensible a los picos. Desviación estándar: cuánto se alejan las semanas del promedio. Coeficiente de variación (CV): esa desviación como porcentaje del promedio; cuanto mayor, más irregular la serie.
        </p>
      </Card>
    </Section>
  )
}
