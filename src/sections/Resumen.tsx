import { Bar, BarChart, CartesianGrid, Legend, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import { weekly } from '../data/report'
import { C, Card, CardTitle, ChartBox, Kpi, Num, Section, Source, Tip, cursorFill, grid, legendProps, useAnim, xAxis, yAxis } from '../components/ui'
import { mean, nf } from '../lib/stats'

const findings = [
  {
    c: 'bg-arena',
    t: 'Concentración',
    big: '31 %',
    bigL: 'de las vistas, en la semana 1',
    d: 'Un video de TikTok de 34.800 vistas explica ese pico. Las últimas 6 semanas rinden 80 % menos que las primeras 6.',
  },
  {
    c: 'bg-lavanda',
    t: 'Continuidad',
    big: '4',
    bigL: 'semanas con vacíos de publicación',
    d: 'Hubo 1 semana sin reels (S7) y 3 semanas sin TikTok, del 7 al 27 de septiembre. Lo habitual en un reel es de 1.400 a 3.200 vistas.',
  },
  {
    c: 'bg-menta',
    t: 'Guiones',
    big: '34',
    bigL: 'de 49 guiones no se reflejan',
    d: 'Los reels con guion obtienen más interacción por vista: 1,82 % frente a 1,10 % de los reels sin guion.',
  },
]

const weeks = weekly.map((w) => ({ label: `S${w.sem}`, w, a: w.reels ? w.vistasReels : null, b: w.tiktoks ? w.vistasTikTok : null }))
const avg = mean(weekly.map((w) => w.vistasReels + w.vistasTikTok))

export default function Resumen() {
  const anim = useAnim()
  return (
    <Section
      id="resumen"
      num="01"
      label="Resumen ejecutivo"
      title="En 12 semanas se acumularon 132.920 vistas, pero el volumen depende de pocas piezas y de la frecuencia"
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white shadow-card sm:p-9 lg:col-span-5">
          <div className="grid-dots pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[.16em] text-arena">Vistas combinadas · 12 semanas</p>
            <p className="mt-4 font-display text-[64px] font-semibold leading-none sm:text-[88px]">
              <Num value={132920} />
            </p>
            <div className="mt-8 flex h-3 overflow-hidden rounded-full bg-white/10" role="img" aria-label="Reels 60,5 % y TikTok 39,5 % de las vistas">
              <span className="bg-arena" style={{ width: '60.5%' }} />
              <span className="bg-lavanda" style={{ width: '39.5%' }} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 font-num text-sm">
              <p>
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-arena" />
                <b>80.427</b> <span className="text-white/60">reels · 60,5 %</span>
              </p>
              <p>
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lavanda" />
                <b>52.493</b> <span className="text-white/60">TikTok · 39,5 %</span>
              </p>
            </div>
            <p className="mt-8 border-t border-white/15 pt-6 font-display text-xl leading-snug text-white/90">
              Lectura general: el resultado depende menos de cuánto se publica que de cuántas piezas conectan.
            </p>
          </div>
        </div>

        <Card large className="lg:col-span-7">
          <CardTitle>Vistas por semana: el pico inicial y la meseta posterior</CardTitle>
          <ChartBox
            className="h-[260px] sm:h-[320px]"
            label="Barras apiladas por semana de reels y TikTok: la semana 1 y la semana 2 superan ampliamente al resto, con un promedio de 11.077"
          >
            <BarChart data={weeks} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...grid} />
              <XAxis dataKey="label" {...xAxis} />
              <YAxis {...yAxis} />
              <Tooltip cursor={cursorFill} content={<Tip head={(_l, r) => `Semana ${r.w.sem} · desde el ${r.w.inicio}`} />} />
              <Legend {...legendProps} />
              <ReferenceLine y={avg} stroke={C.ink} strokeDasharray="5 4" strokeOpacity={0.5} label={{ value: `Promedio ${nf(avg)}`, position: 'insideTopRight', fill: C.sec, fontSize: 11 }} />
              <Bar dataKey="a" name="Reels" stackId="s" fill={C.arena} {...anim} />
              <Bar dataKey="b" name="TikTok" stackId="s" fill={C.lavanda} radius={[6, 6, 0, 0]} {...anim} />
            </BarChart>
          </ChartBox>
          <Source>Fuente: panel de Instagram y perfil de TikTok. Detalle y comparaciones en las secciones 03 y 04.</Source>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi value={1128} label="Interacciones en reels" sub="1,40 % de las vistas · 3,23 % del alcance" hint="Suma de me gusta, comentarios, guardados y compartidos de los 27 reels." />
        <Kpi value={38.7} decimals={1} suffix=" %" label="Vistas de no seguidores" sub="Cuenta de Instagram, 90 días" tone="menta" hint="Mide el descubrimiento: casi 4 de cada 10 vistas llegan a personas que aún no siguen la cuenta." />
        <Kpi value={15} suffix=" de 49" label="Guiones con publicación" sub="13 de 15 grabados · 0 de 23 en revisión" tone="lavanda" hint="Solo 15 guiones del portal tienen una publicación identificable; el cruce se infirió por título, gancho y tema." />
        <Kpi value={27} label="Reels publicados" sub="Más 15 videos en TikTok en la misma ventana" tone="rosa" hint="Son 42 piezas en 12 semanas, un promedio de 3,5 por semana entre ambas plataformas." />
      </div>

      <div className="grid divide-y divide-ink/10 border-y border-ink/10 md:grid-cols-3 md:divide-x md:divide-y-0">
        {findings.map((f, i) => (
          <article key={f.t} className="py-7 md:px-8 md:first:pl-0 md:last:pr-0">
            <div className="flex items-center gap-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full font-num text-sm font-semibold text-ink ${f.c}`}>0{i + 1}</span>
              <h3 className="font-sans text-xs font-bold uppercase tracking-[.16em] text-sec">{f.t}</h3>
            </div>
            <p className="mt-5 font-display text-5xl font-semibold leading-none text-ink">{f.big}</p>
            <p className="mt-2 font-sans text-sm font-bold text-ink">{f.bigL}</p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-sec">{f.d}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
