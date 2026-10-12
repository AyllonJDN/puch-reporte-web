import { Bar, BarChart, CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'
import { reels, weekly } from '../data/report'
import { C, Card, CardTitle, ChartBox, Kpi, Section, Source, Tip, cursorFill, grid, legendProps, useAnim, xAxis, yAxis } from '../components/ui'
import { corr, dlong, linreg, nf, pct, snip, sum } from '../lib/stats'
import { rate } from './Reels'

const short: Record<string, string> = {
  '2026-08-11': '¿Agente inmobiliario o tour guide?',
  '2026-09-14': 'El mercado evolucionó',
  '2026-08-18': 'Propiedad sin vender en 6 meses',
}

export default function Interaccion() {
  const anim = useAnim()
  const wk = weekly.map((w) => (w.reels ? { label: `S${w.sem}`, likes: w.likes, com: w.com, guard: w.guard, comp: w.comp, w } : { label: `S${w.sem}`, w }))
  const x = reels.map((r) => r.vistas)
  const y = reels.map((r) => r.inter)
  const r = corr(x, y)
  const lr = linreg(x, y)
  const xmin = Math.min(...x)
  const xmax = Math.max(...x)
  const trend = [xmin, xmax].map((v) => ({ vistas: v, inter: lr.intercept + lr.slope * v }))
  const dots = reels.map((p) => ({ vistas: p.vistas, inter: p.inter, f: p.f, texto: p.texto }))
  const tot = sum(weekly.map((w) => w.inter))
  const likes = sum(weekly.map((w) => w.likes))
  const com = sum(weekly.map((w) => w.com))
  const guard = sum(weekly.map((w) => w.guard))
  const comp = sum(weekly.map((w) => w.comp))
  const top = [...reels].sort((a, b) => rate(b) - rate(a)).slice(0, 3)

  return (
    <Section
      id="interaccion"
      alt
      num="07"
      label="Interacción"
      title="La interacción es de 1,40 % sobre las vistas; los *compartidos* aportan 21 % y son la señal más valiosa"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi value={tot} label="Interacciones" sub="1,40 % de las vistas" className="sm:col-span-2 lg:col-span-1" hint="Suma de me gusta, comentarios, guardados y compartidos. La tasa de 1,40 % es interacciones divididas entre vistas." />
        <Kpi value={likes} label="Me gusta" tone="olive" hint="Señal de agrado: es la más fácil de dar y la menos comprometida." />
        <Kpi value={com} label="Comentarios" tone="coral" hint="Señal de conversación: el tema generó interés suficiente para escribir." />
        <Kpi value={guard} label="Guardados" tone="olive" hint="Señal de utilidad: la persona quiere volver a ver el contenido." />
        <Kpi value={comp} label="Compartidos" sub={`${nf(Math.round((comp / tot) * 100))} % del total`} tone="clay" hint="La señal más valiosa: cada compartido lleva el reel a personas nuevas." />
      </div>

      <Card large>
        <CardTitle>Interacciones en reels por semana</CardTitle>
        <ChartBox
          label="Barras apiladas por semana con me gusta, comentarios, guardados y compartidos; la semana 2 concentra la mayor interacción"
          className="h-[260px] sm:h-[360px]"
        >
          <BarChart data={wk} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid {...grid} />
            <XAxis dataKey="label" {...xAxis} />
            <YAxis {...yAxis} />
            <Tooltip cursor={cursorFill} content={<Tip head={(_l, row) => `Semana ${row.w.sem}`} />} />
            <Legend {...legendProps} />
            <Bar dataKey="likes" name="Me gusta" stackId="i" fill={C.peri} {...anim} />
            <Bar dataKey="com" name="Comentarios" stackId="i" fill={C.coral} {...anim} />
            <Bar dataKey="guard" name="Guardados" stackId="i" fill={C.olive} {...anim} />
            <Bar dataKey="comp" name="Compartidos" stackId="i" fill={C.clay} radius={[6, 6, 0, 0]} {...anim} />
          </BarChart>
        </ChartBox>
        <Source>Fuente: estadísticas individuales de cada reel. La semana 7 no tuvo reels y se omite.</Source>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card large>
          <CardTitle>Vistas frente a interacciones, por reel</CardTitle>
          <ChartBox
            label={`Dispersión de vistas e interacciones por reel con línea de tendencia ascendente, r = ${nf(r, 2)}`}
            className="h-[260px] sm:h-[360px]"
          >
            <ScatterChart margin={{ top: 16, right: 16, left: 0, bottom: 24 }}>
              <CartesianGrid {...grid} />
              <XAxis type="number" dataKey="vistas" name="Vistas" {...xAxis} tickFormatter={(v: number) => nf(v)} label={{ value: 'Vistas del reel', position: 'insideBottom', offset: -14, fill: C.ter, fontSize: 11 }} />
              <YAxis type="number" dataKey="inter" name="Interacciones" {...yAxis} label={{ value: 'Interacciones del reel', angle: -90, position: 'insideLeft', offset: 12, fill: C.ter, fontSize: 11 }} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={<Tip head={(_l, row) => (row.f ? `${dlong(row.f)} · ${snip(row.texto).slice(0, 60)}` : 'Tendencia')} />}
              />
              <Scatter name="Reel" data={dots} fill={C.peri} fillOpacity={0.7} {...anim} />
              <Scatter
                name="Tendencia"
                data={trend}
                legendType="none"
                line={{ stroke: C.ink, strokeWidth: 2, strokeDasharray: '6 4' }}
                shape={<g />}
                isAnimationActive={false}
              />
            </ScatterChart>
          </ChartBox>
          <Source>
            Cada punto es un reel. Cuanto más a la derecha, más vistas; cuanto más arriba, más interacciones. Los puntos siguen una línea ascendente: más vistas implican más interacciones (r = {nf(r, 2)}).
          </Source>
        </Card>
        <Card large>
          <CardTitle>Reels más eficientes</CardTitle>
          <p className="-mt-2 mb-4 text-sm text-t2">Tasa de interacción sobre vistas</p>
          <ul className="space-y-5">
            {top.map((t) => (
              <li key={t.f}>
                <p className="font-display text-3xl font-semibold text-t1">{pct(rate(t), 2)}</p>
                <p className="mt-1 font-num text-xs text-t3">{dlong(t.f)}</p>
                <p className="font-sans text-sm text-t1">{short[t.f] ?? snip(t.texto)}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Section>
  )
}
