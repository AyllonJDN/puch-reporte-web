import { Bar, BarChart, Cell, CartesianGrid, LabelList, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts'
import { account90d } from '../data/report'
import { C, Card, CardTitle, ChartBox, Kpi, Section, Source, Tip, grid, legendProps, useAnim, xAxis, yAxis, cursorFill } from '../components/ui'
import { nf } from '../lib/stats'

const tipos = [
  { name: 'Reels', value: account90d.tipo.reels, fill: C.arena },
  { name: 'Historias', value: account90d.tipo.historias, fill: C.menta },
  { name: 'Publicaciones', value: account90d.tipo.publicaciones, fill: C.lavanda },
]

export default function Cuenta() {
  const anim = useAnim()
  const a = account90d
  return (
    <Section
      id="cuenta"
      alt
      num="02"
      label="Cuenta de Instagram"
      title="La cuenta alcanza 4 espectadores por cada seguidor y casi 4 de cada 10 vistas son de personas nuevas"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi value={a.vistas} label="Vistas (90 días)" sub={`Instagram ${nf(a.vistasIG)} · Facebook ${nf(a.vistasFB)}`} hint="Cuenta cada reproducción, aunque la misma persona vea el contenido varias veces." />
        <Kpi value={a.espectadores} label="Espectadores únicos" sub="4 por cada seguidor" tone="menta" hint="Personas distintas alcanzadas. Si superan a los seguidores, el contenido llega más allá de la comunidad propia." />
        <Kpi value={a.seguidores} label="Seguidores" sub={`${nf(a.pctSeguidores, 1)} % de las vistas`} tone="lavanda" hint="Base de personas que ya eligieron seguir la cuenta; generan el 61,3 % de las vistas." />
        <Kpi value={a.visitasPerfil} label="Visitas al perfil" sub={`${nf(a.pctNoSeguidores, 1)} % de las vistas son de no seguidores`} tone="rosa" hint="El porcentaje de no seguidores mide el descubrimiento: casi 4 de cada 10 vistas llegan a personas nuevas." />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card large>
          <CardTitle>Vistas por tipo de contenido</CardTitle>
          <div className="relative">
            <ChartBox label="Dona de vistas por tipo de contenido: reels 55,2 %, historias 41,3 % y publicaciones 3,5 %">
              <PieChart>
                <Pie data={tipos} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={2} stroke="#fff" strokeWidth={2} {...anim}>
                  {tipos.map((t) => (
                    <Cell key={t.name} fill={t.fill} />
                  ))}
                </Pie>
                <Tooltip content={<Tip fmt={(v) => `${nf(v, 1)} %`} />} />
                <Legend {...legendProps} />
              </PieChart>
            </ChartBox>
            <div className="pointer-events-none absolute inset-x-0 top-[38%] text-center sm:top-[40%]">
              <p className="font-display text-3xl font-semibold text-ink">{nf(a.tipo.reels, 1)} %</p>
              <p className="text-xs text-sec">Reels</p>
            </div>
          </div>
          <Source>Fuente: panel profesional de Instagram, 90 días.</Source>
        </Card>
        <Card large>
          <CardTitle>Vistas por día, por tramo</CardTitle>
          <ChartBox label="Barras de vistas por día según tramo de 90 días: el tramo de los días 8 a 14 es el más alto, con 3.329">
            <BarChart data={a.vistasPorDia} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...grid} />
              <XAxis dataKey="tramo" {...xAxis} />
              <YAxis {...yAxis} />
              <Tooltip content={<Tip />} cursor={cursorFill} />
              <Bar dataKey="v" name="Vistas por día" fill={C.arena} radius={[6, 6, 0, 0]} {...anim}>
                <LabelList dataKey="v" position="top" formatter={(v: any) => nf(v)} style={{ fontFamily: 'Inter', fontSize: 11, fill: C.ink }} />
              </Bar>
            </BarChart>
          </ChartBox>
          <Source>Los tramos son consecutivos y no se solapan.</Source>
        </Card>
      </div>
    </Section>
  )
}
