import { ArrowUpRight, BadgeCheck, Play } from 'lucide-react'
import { Card, Section, Source } from '../components/ui'
import { IG_URL } from '../components/Chrome'

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
const rowA = tiles.filter((_, i) => i % 2 === 0)
const rowB = tiles.filter((_, i) => i % 2 === 1)

const facts = [
  { v: '72', l: 'publicaciones' },
  { v: '3.538', l: 'seguidores' },
  { v: '4.532', l: 'seguidos' },
  { v: '464', l: 'en TikTok' },
]

function Tile({ n, t }: { n: number; t: string }) {
  return (
    <figure className="group relative h-[230px] w-[172px] shrink-0 overflow-hidden rounded-2xl border border-cream/20 bg-deep shadow-xl sm:h-[270px] sm:w-[202px]">
      <img
        src={`/img/reel-${n}.jpg`}
        alt={`Reel de Sergio Puch: ${t}`}
        loading="lazy"
        width={282}
        height={374}
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
      />
      <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center">
        <span className="pulse-ring absolute inset-0 rounded-full border border-cream/70" />
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-coral text-deep">
          <Play size={11} fill="currentColor" />
        </span>
      </span>
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/90 to-transparent px-3 pb-2.5 pt-10 font-sans text-[11px] leading-tight text-cream">
        {t}
      </figcaption>
    </figure>
  )
}

export default function Perfil() {
  return (
    <Section id="perfil" num="00" label="El protagonista">
      <div className="grid items-stretch gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <Card large className="relative overflow-hidden">
          <span className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-coral/25 blur-3xl" aria-hidden />
          <p className="relative font-sans text-[11px] font-semibold uppercase tracking-[.2em] text-t2">Perfil de Instagram</p>
          <img
            src="/img/perfil-instagram.png"
            alt="Perfil de Instagram de puch_realtor: Sergio Puch, consultor inmobiliario, broker de brikia.tech"
            className="relative mt-4 w-full rounded-xl border border-cream/20"
            width={597}
            height={250}
          />
          <div className="relative mt-6 flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-t-[999px] rounded-b-[14px] border border-coral/70" aria-hidden />
              <img
                src="/img/sergio-retrato.png"
                alt="Retrato de Sergio Puch"
                className="relative h-[84px] w-[72px] rounded-t-[999px] rounded-b-[14px] border border-peri/40 object-cover object-top"
              />
            </div>
            <div>
              <p className="flex items-center gap-1.5 font-display text-3xl font-light text-t1">
                Sergio <span className="italic">Puch</span> <BadgeCheck size={18} className="text-peri" />
              </p>
              <p className="font-sans text-sm text-t2">Consultor inmobiliario · Broker de Brikia</p>
            </div>
          </div>
          <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.l} className="rounded-xl border border-line bg-cream/[.05] p-3">
                <p className="font-display text-3xl font-light text-t1">{f.v}</p>
                <p className="mt-0.5 font-sans text-[11px] leading-tight text-t2">{f.l}</p>
              </div>
            ))}
          </div>
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-6 inline-flex items-center gap-2 rounded-full border border-cream/25 px-5 py-2.5 font-sans text-sm text-t1 transition-colors hover:bg-coral hover:text-deep"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
            </svg>
            Ver perfil en Instagram
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <Source>Fuente: captura del perfil público de Instagram y TikTok.</Source>
        </Card>

        <div className="flex min-w-0 flex-col justify-center gap-4 overflow-hidden rounded-[22px]">
          <div className="marquee flex w-max gap-4">
            {[...rowA, ...rowA, ...rowA, ...rowA].map((t, i) => (
              <Tile key={i} {...t} />
            ))}
          </div>
          <div className="marquee-rev flex w-max gap-4">
            {[...rowB, ...rowB, ...rowB, ...rowB].map((t, i) => (
              <Tile key={i} {...t} />
            ))}
          </div>
          <p className="px-2 font-display text-lg italic text-t2">
            Muestra de los reels analizados: formato vertical, cámara frontal y texto en pantalla como gancho.
          </p>
        </div>
      </div>
    </Section>
  )
}
