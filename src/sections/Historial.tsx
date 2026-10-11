import { Area, AreaChart, Bar, BarChart, Cell, CartesianGrid, Legend, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import { weekly } from '../data/report'
import { C, Card, CardTitle, ChartBox, Delta, Kpi, Section, Source, Tip, cursorFill, grid, legendProps, useAnim, xAxis, yAxis } from '../components/ui'
import { nf, sum } from '../lib/stats'

const tot = weekly.map((w) => w.vistasReels + w.vistasTikTok)
const first = weekly.slice(0, 6)
const last = weekly.slice(6)

let accR = 0
let accT = 0
const cumulative = weekly.map((w) => {
  accR += w.vistasReels
  accT += w.vistasTikTok
  return { label: `S${w.sem}`, w, reels: accR, tiktok: accT }
})

const deltas = tot.map((t, i) => ({ label: `S${i + 1}`, w: weekly[i], d: i === 0 ? null : t - tot[i - 1], total: t }))

const half = (rows: typeof weekly) => ({
  vistas: sum(rows.map((w) => w.vistasReels + w.vistasTikTok)),
  reels: sum(rows.map((w) => w.vistasReels)),
  tiktok: sum(rows.map((w) => w.vistasTikTok)),
  inter: sum(rows.map((w) => w.inter)),
  piezas: sum(rows.map((w) => w.reels + w.tiktoks)),
  guiones: sum(rows.map((w) => w.guiones)),
})
const A = half(first)
const B = half(last)
const pc = (a: number, b: number) => ((b - a) / a) * 100

const compare: { l: string; a: number; b: number }[] = [
  { l: 'Vistas combinadas', a: A.vistas, b: B.vistas },
  { l: 'Vistas de reels', a: A.reels, b: B.reels },
  { l: 'Vistas de TikTok', a: A.tiktok, b: B.tiktok },
  { l: 'Interacciones en reels', a: A.inter, b: B.inter },
  { l: 'Piezas publicadas', a: A.piezas, b: B.piezas },
  { l: 'Vistas por pieza', a: A.vistas / A.piezas, b: B.vistas / B.piezas },
  { l: 'Guiones escritos', a: A.guiones, b: B.guiones },
]

type HeatRow = { l: string; vals: (number | null)[] }
const heat: HeatRow[] = [
  { l: 'Vistas de reels', vals: weekly.map((w) => (w.reels ? w.vistasReels : null)) },
  { l: 'Vistas de TikTok', vals: weekly.map((w) => (w.tiktoks ? w.vistasTikTok : null)) },
  { l: 'Interacciones (reels)', vals: weekly.map((w) => (w.reels ? w.inter : null)) },
  { l: 'Reels publicados', vals: weekly.map((w) => w.reels) },
  { l: 'Videos de TikTok', vals: weekly.map((w) => w.tiktoks) },
  { l: 'Guiones escritos', vals: weekly.map((w) => w.guiones) },
]

export default function Historial() {
  const anim = useAnim()
  const share = (B.vistas / (A.vistas + B.vistas)) * 100
  return (
    <Section
      id="historial"
      num="04"
      label="Comparación histórica"
      alt
      title="Las últimas 6 semanas aportan 17 % de las vistas acumuladas: la primera mitad las superó casi cinco veces"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi value={A.vistas} label="Semanas 1 a 6" sub="Vistas combinadas" tone="arena" hint="Se comparan dos bloques iguales de 6 semanas para ver cómo evolucionó el rendimiento." />
        <Kpi value={B.vistas} label="Semanas 7 a 12" sub="Vistas combinadas" tone="lavanda" delta={<Delta v={pc(A.vistas, B.vistas)} />} />
        <Kpi value={share} decimals={1} suffix=" %" label="Aporte de la segunda mitad" sub="Del total de 132.920 vistas" tone="rosa" hint="Si el aporte fuera parejo sería 50 %. Un valor menor confirma que el volumen se concentró al inicio." />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card large>
          <CardTitle>Vistas acumuladas por plataforma</CardTitle>
          <ChartBox label="Área apilada de vistas acumuladas: la curva sube con fuerza en las primeras seis semanas y luego se aplana">
            <AreaChart data={cumulative} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gAcR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.arena} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={C.arena} stopOpacity={0.15} />
                </linearGradient>
                <linearGradient id="gAcT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.lavanda} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={C.lavanda} stopOpacity={0.15} />
                </linearGradient>
              </defs>
              <CartesianGrid {...grid} />
              <XAxis dataKey="label" {...xAxis} />
              <YAxis {...yAxis} />
              <Tooltip
                content={
                  <Tip
                    head={(_l, r) => `Hasta la semana ${r.w.sem}`}
                    foot={(r) => (
                      <p>
                        Acumulado: <b className="font-num text-ink">{nf(r.reels + r.tiktok)}</b>
                      </p>
                    )}
                  />
                }
              />
              <Legend {...legendProps} />
              <ReferenceLine x="S6" stroke={C.ink} strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: 'Mitad', fontSize: 11, fill: C.ter, position: 'insideTopRight' }} />
              <Area type="monotone" dataKey="reels" name="Reels (acumulado)" stackId="1" stroke={C.arena} strokeWidth={2.5} fill="url(#gAcR)" {...anim} />
              <Area type="monotone" dataKey="tiktok" name="TikTok (acumulado)" stackId="1" stroke={C.lavanda} strokeWidth={2.5} fill="url(#gAcT)" {...anim} />
            </AreaChart>
          </ChartBox>
          <Source>Fuente: panel de Instagram y perfil de TikTok. Suma progresiva de las 12 semanas.</Source>
        </Card>

        <Card large>
          <CardTitle>Cambio de vistas frente a la semana anterior</CardTitle>
          <ChartBox label="Barras de variación semanal de vistas: caídas fuertes en las semanas 2 y 5, y repuntes en las semanas 4, 8 y 12">
            <BarChart data={deltas} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...grid} />
              <XAxis dataKey="label" {...xAxis} />
              <YAxis {...yAxis} />
              <ReferenceLine y={0} stroke={C.ink} strokeOpacity={0.3} />
              <Tooltip
                cursor={cursorFill}
                content={
                  <Tip
                    head={(_l, r) => `Semana ${r.w.sem} frente a la ${r.w.sem - 1 || '—'}`}
                    fmt={(v) => `${v > 0 ? '+' : ''}${nf(v)}`}
                  />
                }
              />
              <Bar dataKey="d" name="Variación de vistas" radius={[6, 6, 6, 6]} {...anim}>
                {deltas.map((d) => (
                  <Cell key={d.label} fill={(d.d ?? 0) >= 0 ? C.menta : C.rosa} />
                ))}
              </Bar>
            </BarChart>
          </ChartBox>
          <Source>En la semana 1 no hay semana previa de comparación; el dato se omite.</Source>
        </Card>
      </div>

      <Card large>
        <CardTitle>Primera mitad frente a segunda mitad</CardTitle>
        <div className="overflow-hidden rounded-xl">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_.8fr] gap-2 bg-ink px-4 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[.12em] text-white sm:grid">
            <span>Indicador</span>
            <span className="text-right">Semanas 1 a 6</span>
            <span className="text-right">Semanas 7 a 12</span>
            <span className="text-right">Variación</span>
          </div>
          {compare.map((r, i) => (
            <div
              key={r.l}
              className={`grid grid-cols-2 items-center gap-2 px-4 py-3 font-num text-sm sm:grid-cols-[1.4fr_1fr_1fr_.8fr] ${i % 2 ? 'bg-base' : 'bg-white'}`}
            >
              <span className="col-span-2 font-sans font-bold text-ink sm:col-span-1">{r.l}</span>
              <span className="text-ink sm:text-right">
                <span className="mr-2 font-sans text-[11px] text-ter sm:hidden">S1–S6</span>
                {nf(r.a)}
              </span>
              <span className="text-right text-ink">
                <span className="mr-2 font-sans text-[11px] text-ter sm:hidden">S7–S12</span>
                {nf(r.b)}
              </span>
              <span className="col-span-2 sm:col-span-1 sm:text-right">
                <Delta v={pc(r.a, r.b)} />
              </span>
            </div>
          ))}
        </div>
        <Source>Cada mitad reúne 6 semanas completas. En «Vistas por pieza» se divide entre reels y videos de TikTok publicados.</Source>
      </Card>

      <Card large>
        <CardTitle>Mapa de calor semanal</CardTitle>
        <div className="-mx-2 overflow-x-auto px-2 pb-2">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[130px_repeat(12,1fr)] gap-1 pb-1 font-num text-[11px] text-ter">
              <span />
              {weekly.map((w) => (
                <span key={w.sem} className="text-center">
                  S{w.sem}
                </span>
              ))}
            </div>
            {heat.map((r) => {
              const max = Math.max(...r.vals.map((v) => v ?? 0))
              return (
                <div key={r.l} className="grid grid-cols-[130px_repeat(12,1fr)] gap-1 pb-1">
                  <span className="self-center font-sans text-xs font-bold text-ink">{r.l}</span>
                  {r.vals.map((v, i) => (
                    <span
                      key={i}
                      title={`${r.l}, semana ${i + 1}: ${v == null ? '—' : nf(v)}`}
                      className="flex h-9 items-center justify-center rounded-md font-num text-[11px] text-ink"
                      style={{ background: v == null ? '#F5F0EB' : `rgba(196,168,130,${0.12 + (v / max) * 0.88})` }}
                    >
                      {v == null ? '—' : nf(v)}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
        <Source>Cuanto más intenso el tono arena, mayor el valor dentro de su fila. «—» indica que no hubo publicación de esa plataforma en la semana.</Source>
      </Card>
    </Section>
  )
}
