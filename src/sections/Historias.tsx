import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { stories } from '../data/report'
import { C, Card, ChartBox, Kpi, Section, Source, Tip, grid, useAnim, xAxis, yAxis } from '../components/ui'
import { mean, median, sum } from '../lib/stats'

export default function Historias() {
  const anim = useAnim()
  const data = [...stories].sort((a, b) => b - a).map((v, i) => ({ i: i + 1, v }))
  return (
    <Section
      id="historias"
      alt
      num="10"
      label="Historias"
      title="Las historias sostienen una audiencia estable de entre 450 y 1.100 vistas"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Kpi value={sum(stories)} label="Vistas totales" sub={`${stories.length} historias`} />
        <Kpi value={mean(stories)} label="Promedio por historia" />
        <Kpi value={median(stories)} label="Mediana por historia" />
      </div>
      <Card large>
        <ChartBox label="Área de las 44 historias ordenadas de mayor a menor número de vistas, entre 1.100 y 451">
          <AreaChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 24 }}>
            <defs>
              <linearGradient id="gHist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.menta} stopOpacity={0.35} />
                <stop offset="100%" stopColor={C.menta} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...grid} />
            <XAxis dataKey="i" {...xAxis} interval={3} label={{ value: 'Historia (ordenadas por vistas)', position: 'insideBottom', offset: -14, fill: C.ter, fontSize: 11 }} />
            <YAxis {...yAxis} domain={[0, 1200]} />
            <Tooltip content={<Tip head={(l) => `Historia ${l}`} />} />
            <Area dataKey="v" name="Vistas" type="monotone" stroke={C.menta} strokeWidth={2.5} fill="url(#gHist)" {...anim} />
          </AreaChart>
        </ChartBox>
        <Source>Fuente: panel profesional de Instagram. No se muestran imágenes de historias.</Source>
      </Card>
    </Section>
  )
}
