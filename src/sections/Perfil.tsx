import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, Building2, Play } from 'lucide-react'
import { Card, Section, Source } from '../components/ui'

const tiles = [
  { n: 1, t: 'Tu departamento solo se estrena' },
  { n: 2, t: 'La tercera vez que tu corredor…' },
  { n: 3, t: 'No sabes filtrar' },
  { n: 4, t: '¿Estás vendiendo tu propiedad?' },
  { n: 5, t: 'La venta de propiedades evolucionó' },
  { n: 6, t: 'Cuéntame los…' },
  { n: 7, t: 'Venta · Surco · 40 m²' },
  { n: 8, t: 'Siguen usando fotos con el celular' },
  { n: 9, t: '¿Por qué me llaman solamente agentes?' },
]

const facts = [
  { v: '72', l: 'publicaciones' },
  { v: '3.538', l: 'seguidores' },
  { v: '4.532', l: 'seguidos' },
  { v: '464', l: 'seguidores en TikTok' },
]

export default function Perfil() {
  const reduce = useReducedMotion()
  return (
    <Section
      id="perfil"
      num="00"
      label="El protagonista"
      title="Sergio Puch lleva el corretaje inmobiliario al video vertical: plano medio, una idea por pieza y el gancho en pantalla"
    >
      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <Card large className="relative overflow-hidden">
          <Building2 aria-hidden className="absolute -right-6 -top-6 h-36 w-36 text-arena/15" strokeWidth={1} />
          <p className="font-sans text-[11px] font-bold uppercase tracking-[.14em] text-sec">Perfil de Instagram</p>
          <img
            src="/img/perfil-instagram.png"
            alt="Perfil de Instagram de puch_realtor: Sergio Puch, consultor inmobiliario, broker de brikia.tech"
            className="mt-4 w-full rounded-xl border border-ink/10"
            width={597}
            height={250}
          />
          <div className="mt-5 flex items-center gap-4">
            <img src="/img/sergio-retrato.png" alt="Retrato de Sergio Puch" className="h-16 w-16 rounded-full object-cover ring-2 ring-arena ring-offset-2" />
            <div>
              <p className="flex items-center gap-1.5 font-display text-xl font-semibold text-ink">
                Sergio Puch <BadgeCheck size={18} className="text-lavanda" />
              </p>
              <p className="font-sans text-sm text-sec">Consultor inmobiliario · Broker de Brikia</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.l} className="rounded-xl bg-base p-3">
                <p className="font-display text-2xl font-semibold text-ink">{f.v}</p>
                <p className="mt-0.5 font-sans text-[11px] leading-tight text-sec">{f.l}</p>
              </div>
            ))}
          </div>
          <Source>Fuente: captura del perfil público de Instagram y TikTok.</Source>
        </Card>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {tiles.map((t, i) => (
            <motion.figure
              key={t.n}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink shadow-card"
            >
              <img
                src={`/img/reel-${t.n}.jpg`}
                alt={`Reel de Sergio Puch: ${t.t}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink/60 text-white backdrop-blur">
                <Play size={11} fill="currentColor" />
              </span>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-2.5 pb-2 pt-8 font-sans text-[10px] leading-tight text-white sm:text-xs">
                {t.t}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
      <Source>Muestra de los reels analizados: formato vertical, cámara frontal y texto en pantalla como gancho.</Source>
    </Section>
  )
}
