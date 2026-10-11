import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'
import { Bar, BarChart, Cell, Pie, PieChart, Tooltip, XAxis } from 'recharts'
import { C, ChartBox, Num, Tip } from '../components/ui'
import { weekly } from '../data/report'
import { nf } from '../lib/stats'

const stats = [
  { v: 132920, d: 0, s: '', l: 'vistas combinadas' },
  { v: 1128, d: 0, s: '', l: 'interacciones en reels' },
  { v: 38.7, d: 1, s: ' %', l: 'vistas de no seguidores' },
  { v: 15, d: 0, s: ' de 49', l: 'guiones con publicación identificada' },
]

const weeks = weekly.map((w) => ({ label: `S${w.sem}`, w, a: w.reels ? w.vistasReels : null, b: w.tiktoks ? w.vistasTikTok : null }))
const mix = [
  { name: 'Reels', value: 80427, fill: C.arena },
  { name: 'TikTok', value: 52493, fill: C.lavanda },
]
const top = [
  { t: 'TikTok · 16 jul', d: 'Listado de propiedad', v: 34800, c: C.lavanda },
  { t: 'Reel · 7 ago', d: '«Indignación»', v: 13511, c: C.arena },
  { t: 'TikTok · 10 ago', d: '«Indignación»', v: 7540, c: C.lavanda },
  { t: 'Reel · 22 jul', d: '¿Quién define el precio?', v: 7133, c: C.arena },
]
const tot = weekly.map((w) => w.vistasReels + w.vistasTikTok)
const s12 = ((tot[11] - tot[10]) / tot[10]) * 100

const ticker: { k: string; v: string; d?: number }[] = [
  { k: 'VISTAS COMBINADAS', v: '132.920' },
  { k: 'REELS', v: '80.427' },
  { k: 'TIKTOK', v: '52.493' },
  { k: 'INTERACCIONES', v: '1.128' },
  { k: 'TASA DE INTERACCIÓN', v: '1,40 %' },
  { k: 'NO SEGUIDORES', v: '38,7 %' },
  { k: 'MEJOR REEL', v: '13.511' },
  { k: 'MEJOR TIKTOK', v: '34.800' },
  { k: 'MEDIANA REEL', v: '2.241' },
  { k: 'GUIONES PUBLICADOS', v: '15 / 49' },
  { k: 'S12 VS S11', v: `${nf(Math.abs(s12), 1)} %`, d: s12 },
  { k: 'SEGUIDORES IG', v: '3.538' },
]

function Skyline() {
  const b = [
    [0, 90, 60], [70, 60, 50], [130, 110, 70], [210, 40, 46], [264, 80, 56], [330, 130, 80],
    [420, 70, 60], [490, 100, 50], [550, 50, 64], [624, 120, 72], [706, 80, 54], [770, 140, 84],
    [864, 60, 52], [926, 100, 66], [1002, 70, 58], [1070, 120, 76], [1156, 90, 44],
  ]
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-14 h-48 w-full opacity-50" viewBox="0 0 1200 160" preserveAspectRatio="xMidYMax slice">
      {b.map(([x, h, w], i) => (
        <g key={i}>
          <motion.rect
            x={x}
            y={160 - h}
            width={w}
            height={h}
            fill="none"
            stroke="#C4A882"
            strokeOpacity={0.35}
            strokeWidth={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.3 + i * 0.07 }}
          />
          {Array.from({ length: Math.floor(h / 18) }).map((_, r) =>
            Array.from({ length: Math.floor(w / 16) }).map((__, c) => (
              <rect
                key={`${r}-${c}`}
                x={x + 6 + c * 16}
                y={160 - h + 8 + r * 18}
                width={5}
                height={7}
                fill={(r * 7 + c * 3 + i) % 5 === 0 ? '#C4A882' : '#C4A882'}
                fillOpacity={(r * 7 + c * 3 + i) % 5 === 0 ? 0.55 : 0.14}
              />
            )),
          )}
        </g>
      ))}
    </svg>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  return (
    <section id="inicio" className="relative flex min-h-screen flex-col overflow-hidden bg-ink pt-24">
      <div className="grid-dots pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-arena/[.07] blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-lavanda/[.06] blur-3xl" />
      {[360, 560, 780].map((s, i) => (
        <motion.div
          key={s}
          aria-hidden
          className="pointer-events-none absolute right-[-160px] top-1/2 hidden rounded-full border border-dashed border-arena/20 md:block"
          style={{ width: s, height: s, marginTop: -s / 2 }}
          animate={reduce ? undefined : { rotate: i % 2 ? -360 : 360 }}
          transition={{ duration: 120 + i * 40, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      <Skyline />

      <div className="relative mx-auto w-full max-w-[1200px] flex-1 px-4 pb-20 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_.7fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="inline-block rounded-full border border-arena/50 px-4 py-1.5 font-sans text-xs uppercase tracking-[.2em] text-arena"
          >
            Informe cuantitativo · 12 semanas
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-6 max-w-3xl font-display text-[40px] font-semibold leading-[1.06] text-white sm:text-6xl xl:text-[68px]"
          >
            Desempeño en redes sociales de <span className="text-arena">@puch_realtor</span>
          </motion.h1>
          <p className="mt-6 font-sans text-lg text-white/80 md:text-xl">
            Instagram, TikTok y guiones del portal de contenido
          </p>
          <p className="mt-2 font-sans text-sm text-white/60 md:text-base">
            Ventana: 13 de julio al 4 de octubre de 2026 · Cifras actualizadas al 10 de octubre de 2026
          </p>

          <motion.div
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 1.2 } } }}
          >
            {stats.map((s) => (
              <motion.div
                key={s.l}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                className="min-w-0 rounded-2xl border border-white/12 bg-white/[.07] p-4 backdrop-blur-md"
              >
                <p className="font-display text-3xl font-semibold text-white sm:text-[28px] xl:text-3xl">
                  <Num value={s.v} decimals={s.d} suffix={s.s} />
                </p>
                <p className="mt-2 font-sans text-xs text-white/70 sm:text-sm">{s.l}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: reduce ? 0 : 2 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="relative mx-auto w-full max-w-[340px] lg:max-w-none"
        >
          <div className="absolute -inset-3 -rotate-3 rounded-[28px] border border-arena/40" aria-hidden />
          <img
            src="/img/brikia-sergio.png"
            alt="Sergio Puch, Broker y Founder de Brikia: «Vender no es suerte. Es estrategia»"
            className="relative max-h-[470px] w-full rounded-3xl object-cover object-top shadow-2xl"
            width={460}
            height={615}
          />
          <motion.div
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-4 bottom-10 flex items-center gap-3 rounded-2xl border border-white/20 bg-ink/70 p-2.5 pr-4 backdrop-blur-md sm:-left-10"
          >
            <img src="/img/sergio-retrato.png" alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-arena" />
            <div>
              <p className="flex items-center gap-1 font-sans text-sm font-bold text-white">
                puch_realtor <BadgeCheck size={14} className="text-lavanda" />
              </p>
              <p className="font-num text-[11px] text-white/70">3.538 seguidores</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.5 }}
        className="mt-8 grid gap-3 lg:grid-cols-12"
      >
        <div className="min-w-0 rounded-2xl border border-white/12 bg-white/[.06] p-4 backdrop-blur-md lg:col-span-5">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[.14em] text-white/60">Vistas por semana</p>
          <ChartBox className="mt-2 h-[130px]" label="Barras de vistas semanales de reels y TikTok: pico en las semanas 1 y 2">
            <BarChart data={weeks} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'rgba(255,255,255,.5)' }} tickLine={false} axisLine={false} interval={0} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,.06)' }} content={<Tip head={(_l, r) => `Semana ${r.w.sem}`} />} />
              <Bar dataKey="a" name="Reels" stackId="s" fill={C.arena} isAnimationActive={!reduce} />
              <Bar dataKey="b" name="TikTok" stackId="s" fill={C.lavanda} radius={[3, 3, 0, 0]} isAnimationActive={!reduce} />
            </BarChart>
          </ChartBox>
        </div>
        <div className="min-w-0 rounded-2xl border border-white/12 bg-white/[.06] p-4 backdrop-blur-md lg:col-span-3">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[.14em] text-white/60">Mezcla de vistas</p>
          <div className="relative">
            <ChartBox className="mt-2 h-[130px]" label="Dona: reels 60,5 % y TikTok 39,5 % de las vistas">
              <PieChart>
                <Pie data={mix} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={3} stroke="none" isAnimationActive={!reduce}>
                  {mix.map((m) => (
                    <Cell key={m.name} fill={m.fill} />
                  ))}
                </Pie>
                <Tooltip content={<Tip fmt={(v) => nf(v)} />} />
              </PieChart>
            </ChartBox>
            <div className="pointer-events-none absolute inset-0 mt-2 flex flex-col items-center justify-center">
              <span className="font-display text-xl font-semibold text-white">60,5 %</span>
              <span className="text-[10px] text-white/60">reels</span>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-2xl border border-white/12 bg-white/[.06] p-4 backdrop-blur-md lg:col-span-4">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[.14em] text-white/60">Piezas con más vistas</p>
          <ul className="mt-3 space-y-2.5">
            {top.map((t) => (
              <li key={t.t + t.v}>
                <div className="flex items-baseline justify-between gap-2 font-sans text-xs">
                  <span className="truncate text-white/80">
                    <b className="text-white">{t.t}</b> · {t.d}
                  </span>
                  <span className="font-num font-semibold text-white">{nf(t.v)}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: t.c }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(t.v / 34800) * 100}%` }}
                    transition={{ duration: 1, delay: 1.8 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
      </div>

      {/* Cinta de indicadores tipo terminal */}
      <div className="relative z-10 overflow-hidden border-y border-white/10 bg-black/30 py-3 backdrop-blur">
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-num text-xs">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="tracking-widest text-white/50">{t.k}</span>
              <span className="font-semibold text-white">{t.v}</span>
              {t.d != null && <span className={t.d >= 0 ? 'text-menta' : 'text-rosa'}>{t.d >= 0 ? '▲' : '▼'}</span>}
              <span className="text-arena/60">|</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
