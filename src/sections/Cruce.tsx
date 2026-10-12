import { Bar, BarChart, CartesianGrid, Cell, LabelList, Tooltip, XAxis, YAxis } from 'recharts'
import { reels } from '../data/report'
import { C, Card, CardTitle, ChartBox, Kpi, Section, Source, Tip, cursorFill, grid, useAnim, xAxis, yAxis } from '../components/ui'
import { median, nf, sum } from '../lib/stats'

export default function Cruce() {
  const anim = useAnim()
  const groups = [
    { name: 'Con guion', fill: C.olive, l: reels.filter((r) => r.clase.startsWith('Con guion')) },
    { name: 'Sin guion', fill: C.clay, l: reels.filter((r) => r.clase.startsWith('Sin guion')) },
    { name: 'Listados de propiedad', fill: C.peri, l: reels.filter((r) => r.clase.startsWith('Listado')) },
  ].map((g) => ({
    ...g,
    n: g.l.length,
    tasa: (sum(g.l.map((r) => r.inter)) / sum(g.l.map((r) => r.vistas))) * 100,
    mediana: median(g.l.map((r) => r.vistas)),
  }))
  const alta = reels.filter((r) => r.clase.includes('alta')).length
  const prob = reels.filter((r) => r.clase.includes('probable')).length

  const chart = (key: 'tasa' | 'mediana', title: string, label: string, dec: number) => (
    <Card large>
      <CardTitle>{title}</CardTitle>
      <ChartBox label={label} className="h-[240px] sm:h-[300px]">
        <BarChart data={groups} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid {...grid} />
          <XAxis dataKey="name" {...xAxis} />
          <YAxis {...yAxis} tickFormatter={(v: number) => nf(v, dec)} />
          <Tooltip cursor={cursorFill} content={<Tip fmt={(v) => (key === 'tasa' ? `${nf(v, 2)} %` : nf(v))} head={(l) => l} />} />
          <Bar dataKey={key} name={title} radius={[6, 6, 0, 0]} {...anim}>
            {groups.map((g) => (
              <Cell key={g.name} fill={g.fill} />
            ))}
            <LabelList dataKey={key} position="top" formatter={(v: any) => (key === 'tasa' ? `${nf(v, 2)} %` : nf(v))} style={{ fontFamily: 'Inter', fontSize: 12, fill: C.ink }} />
          </Bar>
        </BarChart>
      </ChartBox>
    </Card>
  )

  return (
    <Section
      id="cruce"
      num="12"
      label="Con guion frente a sin guion"
      title="Los reels con guion obtienen más *interacción* por vista; el alcance depende más del tema y del momento"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {chart('tasa', 'Interacción sobre vistas (reels)', 'Barras de interacción sobre vistas: con guion 1,82 %, sin guion 1,10 % y listados de propiedad 0,94 %', 2)}
        {chart('mediana', 'Vistas medianas por reel', 'Barras de vistas medianas por reel según grupo: con guion, sin guion y listados de propiedad', 0)}
      </div>
      <Source>En TikTok los listados incluyen el video más visto, con 34.800 vistas.</Source>
      <div className="grid gap-4 md:grid-cols-2">
        <Kpi
          text={groups.map((g) => g.n).join(' · ')}
          label="Reels con guion · sin guion · listados"
          sub={`${alta} coincidencias altas y ${prob} probables`}
          hint="Coincidencia alta: título y gancho casi idénticos al guion. Probable: mismo tema, redacción distinta; es una inferencia."
        />
        <Card>
          <p className="font-sans text-sm leading-relaxed text-t2">
            Sin guion: opiniones, reacciones, colaboraciones y la serie de septiembre; el reel más visto (13.511) pertenece a este grupo.
          </p>
        </Card>
      </div>
    </Section>
  )
}
