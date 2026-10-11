import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, ChevronDown } from 'lucide-react'
import { Num } from '../components/ui'
import { weekly } from '../data/report'
import { nf } from '../lib/stats'

const stats = [
  { v: 132920, d: 0, s: '', l: 'vistas combinadas' },
  { v: 1128, d: 0, s: '', l: 'interacciones en reels' },
  { v: 38.7, d: 1, s: ' %', l: 'vistas de no seguidores' },
  { v: 15, d: 0, s: ' de 49', l: 'guiones con publicación identificada' },
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

      <div className="relative mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[1.25fr_.75fr]">
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
            className="mt-10 grid grid-cols-2 gap-3 sm:gap-4"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 1.2 } } }}
          >
            {stats.map((s) => (
              <motion.div
                key={s.l}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                className="min-w-0 rounded-2xl border border-white/12 bg-white/[.07] p-4 backdrop-blur-md sm:p-5"
              >
                <p className="font-display text-3xl font-semibold text-white sm:text-4xl">
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
            className="relative w-full rounded-3xl shadow-2xl"
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

      <a href="#perfil" className="absolute bottom-[68px] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-white/60 sm:flex">
        Desliza
        <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown size={18} />
        </motion.span>
      </a>

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
