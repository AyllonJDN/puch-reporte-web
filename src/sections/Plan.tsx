import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { weekly } from '../data/report'
import { C, Card, CardTitle, ChartBox, Section, Source, Tip, cursorFill, grid, legendProps, useAnim, xAxis, yAxis } from '../components/ui'

const notes = [
  { big: '0', t: 'coincidencias', d: 'Los 17 guiones con fecha en el calendario (3 ago a 4 sep) no se publicaron en su fecha.' },
  { big: '0', t: 'registros de video', d: 'La sección Videos del portal tiene 0 registros en las 12 semanas.' },
  { big: '4', t: 'guiones duplicados', d: 'Tienen el texto copiado de otro (marcadores de posición sin redactar): guiones 32, 37, 43 y 48 del listado.' },
]

export default function Plan() {
  const anim = useAnim()
  const data = weekly.map((w) => ({ label: `S${w.sem}`, g: w.guiones, p: w.reels + w.tiktoks, sem: w.sem }))
  return (
    <Section
      id="plan"
      alt
      num="12"
      label="Planificado frente a publicado"
      title="Lo que se escribe cada semana no coincide con lo que se publica"
    >
      <Card large>
        <CardTitle>Guiones escritos y piezas publicadas por semana</CardTitle>
        <ChartBox label="Barras agrupadas por semana de guiones escritos frente a piezas publicadas en Instagram y TikTok; no siguen el mismo patrón">
          <BarChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid {...grid} />
            <XAxis dataKey="label" {...xAxis} />
            <YAxis {...yAxis} allowDecimals={false} />
            <Tooltip cursor={cursorFill} content={<Tip head={(_l, r) => `Semana ${r.sem}`} />} />
            <Legend {...legendProps} />
            <Bar dataKey="g" name="Guiones escritos" fill={C.arena} radius={[6, 6, 0, 0]} {...anim} />
            <Bar dataKey="p" name="Piezas publicadas (IG + TikTok)" fill={C.ink} radius={[6, 6, 0, 0]} {...anim} />
          </BarChart>
        </ChartBox>
        <Source>Fuente: portal de contenido The Framework, panel de Instagram y perfil de TikTok.</Source>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {notes.map((n) => (
          <Card key={n.d} large>
            <p className="font-display text-5xl font-semibold text-ink">{n.big}</p>
            <p className="mt-2 font-sans text-sm font-bold text-ink">{n.t}</p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-sec">{n.d}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
