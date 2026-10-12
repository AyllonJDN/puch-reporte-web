import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'
import { Bar, BarChart, Cell, Pie, PieChart, Tooltip, XAxis } from 'recharts'
import { C, ChartBox, EASE, Num, Tilt, Tip } from '../components/ui'
import { weekly } from '../data/report'
import { nf } from '../lib/stats'
import Skyline from '../components/Skyline'

const stats = [
  { v: 132920, d: 0, s: '', l: 'vistas combinadas' },
  { v: 1128, d: 0, s: '', l: 'interacciones en reels' },
  { v: 38.7, d: 1, s: ' %', l: 'vistas de no seguidores' },
  { v: 15, d: 0, s: ' de 49', l: 'guiones con publicación identificada' },
]

const weeks = weekly.map((w) => ({ label: `S${w.sem}`, w, a: w.reels ? w.vistasReels : null, b: w.tiktoks ? w.vistasTikTok : null }))
const mix = [
  { name: 'Reels', value: 80427, fill: C.peri },
  { name: 'TikTok', value: 52493, fill: C.coral },
]
const top = [
  { t: 'TikTok · 16 jul', d: 'Listado de propiedad', v: 34800, c: C.coral },
  { t: 'Reel · 7 ago', d: '«Indignación»', v: 13511, c: C.peri },
  { t: 'TikTok · 10 ago', d: '«Indignación»', v: 7540, c: C.coral },
  { t: 'Reel · 22 jul', d: '¿Quién define el precio?', v: 7133, c: C.peri },
]

const tot = weekly.map((w) => w.vistasReels + w.vistasTikTok)
const s12 = ((tot[11] - tot[10]) / tot[10]) * 100
const ticker = [
  ['VISTAS COMBINADAS', '132.920'],
  ['REELS', '80.427'],
  ['TIKTOK', '52.493'],
  ['INTERACCIONES', '1.128'],
  ['TASA DE INTERACCIÓN', '1,40 %'],
  ['NO SEGUIDORES', '38,7 %'],
  ['MEJOR REEL', '13.511'],
  ['MEJOR TIKTOK', '34.800'],
  ['MEDIANA REEL', '2.241'],
  ['GUIONES PUBLICADOS', '15 / 49'],
  ['S12 VS S11', `▲ ${nf(s12, 1)} %`],
  ['SEGUIDORES IG', '3.538'],
]

const glass =
  'min-w-0 rounded-[22px] border border-peri/15 bg-gradient-to-br from-white/[.075] to-white/[.025] p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,.6)]'

export default function Hero() {
  const reduce = useReducedMotion()
  const spot = useRef<HTMLDivElement>(null)
  return (
    <section
      id="inicio"
      onMouseMove={(e) => {
        const b = e.currentTarget.getBoundingClientRect()
        spot.current?.style.setProperty('transform', `translate(${e.clientX - b.left - 260}px, ${e.clientY - b.top - 260}px)`)
      }}
      className="grain relative flex min-h-screen flex-col overflow-hidden pt-24 text-cream"
      style={{
        background: `radial-gradient(40% 40% at 88% 18%, rgba(196,211,247,.18), transparent 70%), radial-gradient(40% 40% at 8% 95%, rgba(244,115,88,.14), transparent 70%), linear-gradient(160deg, #5C1232, #470B24 48%, #2A0615)`,
      }}
    >
      <div ref={spot} aria-hidden className="pointer-events-none absolute left-0 top-0 h-[520px] w-[520px] rounded-full opacity-70 transition-transform duration-500 ease-out" style={{ background: 'radial-gradient(circle, rgba(244,115,88,.16), transparent 70%)', transform: 'translate(900px, 100px)' }} />
      {[360, 560, 780].map((s, i) => (
        <motion.div
          key={s}
          aria-hidden
          className="pointer-events-none absolute right-[-200px] top-1/2 hidden rounded-full border border-dashed border-peri/20 md:block"
          style={{ width: s, height: s, marginTop: -s / 2 }}
          animate={reduce ? undefined : { rotate: i % 2 ? -360 : 360 }}
          transition={{ duration: 90 + i * 30, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      <Skyline tone="dark" seed={3} className="pointer-events-none absolute inset-x-0 bottom-10 h-56 opacity-60" />
      <Skyline tone="dark" seed={11} className="pointer-events-none absolute inset-x-0 bottom-10 h-32 opacity-35" />

      <div className="relative mx-auto w-full max-w-[1320px] flex-1 px-4 pb-24 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
              className="inline-block rounded-full border border-cream/25 px-4 py-1.5 font-sans text-xs uppercase tracking-[.22em] text-cream/80"
            >
              Informe cuantitativo · 12 semanas
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1, ease: EASE }}
              className="mt-6 max-w-3xl font-display text-[48px] font-light leading-[.98] sm:text-[64px] xl:text-[84px]"
            >
              Desempeño en redes sociales de <span className="italic text-peri">@puch_realtor</span>
            </motion.h1>
            <p className="mt-6 font-sans text-lg text-cream/80 md:text-xl">Instagram, TikTok y guiones del portal de contenido</p>
            <p className="mt-2 font-sans text-sm text-cream/60 md:text-base">
              Ventana: 13 de julio al 4 de octubre de 2026 · Cifras actualizadas al 10 de octubre de 2026
            </p>

            <motion.div
              className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 1.2 } } }}
            >
              {stats.map((s) => (
                <motion.div
                  key={s.l}
                  variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
                  className={glass}
                >
                  <p className="font-display text-[44px] font-light leading-none">
                    <Num value={s.v} decimals={s.d} suffix={s.s} />
                  </p>
                  <p className="mt-3 font-sans text-xs leading-snug text-cream/70">{s.l}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease: EASE }}
            className="relative mx-auto w-full max-w-[320px] lg:max-w-none"
          >
            <Tilt>
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[28px] border border-coral/70" aria-hidden />
              <img
                src="/img/brikia-sergio.png"
                alt="Sergio Puch, Broker y Founder de Brikia: «Vender no es suerte. Es estrategia»"
                className="relative max-h-[470px] w-full rounded-[28px] border border-peri/40 object-cover object-top shadow-2xl"
                width={460}
                height={615}
                fetchPriority="high"
              />
              <motion.div
                animate={reduce ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-4 bottom-10 flex items-center gap-3 rounded-2xl border border-peri/20 bg-deep/75 p-2.5 pr-4 backdrop-blur-md sm:-left-10"
              >
                <img src="/img/sergio-retrato.png" alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-coral" />
                <div>
                  <p className="flex items-center gap-1 font-sans text-sm font-bold">
                    puch_realtor <BadgeCheck size={14} className="text-peri" />
                  </p>
                  <p className="font-num text-[11px] text-cream/70">3.538 seguidores</p>
                </div>
              </motion.div>
            </Tilt>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5, ease: EASE }}
          className="mt-8 grid gap-3 lg:grid-cols-12"
        >
          <div className={`${glass} lg:col-span-5`}>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[.2em] text-cream/60">Vistas por semana</p>
            <ChartBox className="mt-2 h-[130px]" label="Barras de vistas semanales de reels y TikTok: pico en las semanas 1 y 2">
              <BarChart data={weeks} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#CDBCC6' }} tickLine={false} axisLine={false} interval={0} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,.06)' }} content={<Tip head={(_l, r) => `Semana ${r.w.sem}`} />} />
                <Bar dataKey="a" name="Reels" stackId="s" fill={C.peri} isAnimationActive={!reduce} animationDuration={1400} />
                <Bar dataKey="b" name="TikTok" stackId="s" fill={C.coral} radius={[3, 3, 0, 0]} isAnimationActive={!reduce} animationDuration={1400} />
              </BarChart>
            </ChartBox>
          </div>
          <div className={`${glass} lg:col-span-3`}>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[.2em] text-cream/60">Mezcla de vistas</p>
            <div className="relative">
              <ChartBox className="mt-2 h-[130px]" label="Dona: reels 60,5 % y TikTok 39,5 % de las vistas">
                <PieChart>
                  <Pie data={mix} dataKey="value" nameKey="name" innerRadius="70%" outerRadius="94%" paddingAngle={3} cornerRadius={6} stroke="none" isAnimationActive={!reduce} animationDuration={1400}>
                    {mix.map((m) => (
                      <Cell key={m.name} fill={m.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<Tip fmt={(v) => nf(v)} />} />
                </PieChart>
              </ChartBox>
              <div className="pointer-events-none absolute inset-0 mt-2 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-light">60,5 %</span>
                <span className="text-[10px] text-cream/60">reels</span>
              </div>
            </div>
          </div>
          <div className={`${glass} lg:col-span-4`}>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[.2em] text-cream/60">Piezas con más vistas</p>
            <ul className="mt-3 space-y-2.5">
              {top.map((t) => (
                <li key={t.t + t.v}>
                  <div className="flex items-baseline justify-between gap-2 font-sans text-xs">
                    <span className="truncate text-cream/80">
                      <b className="text-cream">{t.t}</b> · {t.d}
                    </span>
                    <span className="font-num font-semibold">{nf(t.v)}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-cream/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: t.c }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(t.v / 34800) * 100}%` }}
                      transition={{ duration: 1.2, delay: 1.8, ease: EASE }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Cinta coral inclinada con indicadores */}
      <div className="relative z-20 -mb-5 -rotate-[1.2deg] overflow-hidden bg-coral py-3 text-deep shadow-xl">
        <div className="marquee-fast flex w-max gap-8 whitespace-nowrap font-sans text-sm">
          {[...ticker, ...ticker].map(([k, v], i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="text-xs tracking-[.18em] text-deep/70">{k}</span>
              <span className="font-display text-xl font-semibold">{v}</span>
              <span aria-hidden>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
