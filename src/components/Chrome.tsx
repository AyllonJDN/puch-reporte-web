import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, ChevronsDownUp, ChevronsUpDown, Menu, X } from 'lucide-react'
import Skyline from './Skyline'
import { EASE } from './ui'

export const IG_URL = 'https://www.instagram.com/puch_realtor/'

export const NAV: { id: string; l: string }[] = [
  { id: 'perfil', l: 'Protagonista' },
  { id: 'resumen', l: 'Resumen' },
  { id: 'cuenta', l: 'Cuenta' },
  { id: 'semanal', l: 'Serie semanal' },
  { id: 'historial', l: 'Historial' },
  { id: 'estadistica', l: 'Estadística' },
  { id: 'reels', l: 'Reels' },
  { id: 'interaccion', l: 'Interacción' },
  { id: 'tiktok', l: 'TikTok' },
  { id: 'plataformas', l: 'Plataformas' },
  { id: 'guiones', l: 'Guiones' },
  { id: 'plan', l: 'Planificado' },
  { id: 'cruce', l: 'Con y sin guion' },
  { id: 'recomendaciones', l: 'Recomendaciones' },
]

const GROUPS: { l: string; ids: string[] }[] = [
  { l: 'Resumen', ids: ['perfil', 'resumen'] },
  { l: 'Cuenta', ids: ['cuenta'] },
  { l: 'Semanal', ids: ['semanal', 'historial', 'estadistica'] },
  { l: 'Reels', ids: ['reels', 'interaccion'] },
  { l: 'TikTok', ids: ['tiktok', 'plataformas'] },
  { l: 'Guiones', ids: ['guiones', 'plan', 'cruce'] },
  { l: 'Recomendaciones', ids: ['recomendaciones'] },
]

/** Óvalo doble con «Mz» en cursiva. */
export function Monogram({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 60 43" fill="none" aria-hidden>
      <ellipse cx="30" cy="21.5" rx="28" ry="19.5" stroke="#C4D3F7" strokeWidth="1" />
      <ellipse cx="30" cy="21.5" rx="24" ry="15.5" stroke="#F47358" strokeWidth="0.8" />
      <text x="30" y="27" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontStyle="italic" fontSize="17" fill="#FFFAF5">
        Mz
      </text>
    </svg>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })
  return <motion.div style={{ scaleX }} className="no-print fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-coral" />
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [allOpen, setAllOpen] = useState(true)
  const toggleAll = () => {
    const next = !allOpen
    setAllOpen(next)
    window.dispatchEvent(new CustomEvent('sections:set', { detail: next }))
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), {
      rootMargin: '-40% 0px -55% 0px',
    })
    NAV.forEach((n) => {
      const el = document.getElementById(n.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[60] h-[68px] transition-all duration-300 ${
          scrolled || open ? 'border-b border-peri/10 bg-deep/70 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#inicio" onClick={() => setOpen(false)} className="flex items-center gap-3 text-cream">
            <Monogram size={38} />
            <span className="font-display text-xl italic">Informe · @puch_realtor</span>
          </a>
          <ul className="hidden items-center gap-1 xl:flex">
            {GROUPS.map((g) => {
              const on = g.ids.includes(active)
              return (
                <li key={g.l} className="relative">
                  <a href={`#${g.ids[0]}`} className={`relative z-10 block px-3.5 py-1.5 font-sans text-[13px] ${on ? 'text-cream' : 'text-cream/70'}`}>
                    {g.l}
                  </a>
                  {on && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-cream/10 ring-1 ring-peri/20" transition={{ duration: 0.4, ease: EASE }} />}
                </li>
              )
            })}
          </ul>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleAll}
              className="hidden items-center gap-1.5 rounded-full border border-cream/25 px-3.5 py-1.5 font-sans text-xs text-cream transition-colors hover:bg-coral hover:text-deep xl:flex"
            >
              {allOpen ? <ChevronsDownUp size={14} /> : <ChevronsUpDown size={14} />}
              {allOpen ? 'Contraer todo' : 'Expandir todo'}
            </button>
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-full border border-cream/25 px-3.5 py-1.5 font-sans text-xs text-cream transition-colors hover:bg-coral hover:text-deep sm:flex"
            >
              Instagram <ArrowUpRight size={13} />
            </a>
            <button
              type="button"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="text-cream xl:hidden"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] overflow-y-auto bg-deep pt-24"
          >
            <button
              type="button"
              onClick={toggleAll}
              className="mx-6 mb-4 flex items-center gap-2 rounded-full border border-cream/25 px-4 py-2 text-sm text-cream"
            >
              {allOpen ? <ChevronsDownUp size={16} /> : <ChevronsUpDown size={16} />}
              {allOpen ? 'Contraer todas las secciones' : 'Expandir todas las secciones'}
            </button>
            <ul className="space-y-1 px-6 pb-10">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className={`block py-2 font-display text-3xl font-light ${active === n.id ? 'italic text-peri' : 'text-cream'}`}
                  >
                    {n.l}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function Loader() {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 900)
    return () => clearTimeout(t)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep">
          <Monogram size={84} />
          <p className="mt-6 font-display text-2xl italic text-cream">Preparando informe</p>
          <div className="mt-4 flex gap-2" aria-hidden>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-coral"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Footer() {
  return (
    <footer className="tone-dark grain relative -mt-10 overflow-hidden rounded-t-[36px] px-4 pb-0 pt-24 text-cream sm:px-6 md:-mt-14 md:rounded-t-[72px] md:pt-32">
      <div className="relative mx-auto max-w-[1320px]">
        <div className="flex items-center gap-4">
          <Monogram size={64} />
          <p className="font-sans text-xs uppercase tracking-[.22em] text-cream/60">Cierre del informe</p>
        </div>
        <p className="mt-8 max-w-4xl font-display text-[44px] font-light leading-[1.02] md:text-[88px]">
          Vender no es suerte. <span className="italic text-peri">Es estrategia.</span>
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="font-sans text-cream/75">
            <p className="font-display text-2xl text-cream">Desempeño en redes sociales de @puch_realtor</p>
            <p className="mt-3">Ventana analizada: 13 de julio al 4 de octubre de 2026</p>
            <p className="mt-1">Cifras actualizadas al 10 de octubre de 2026</p>
            <p className="mt-5 text-sm text-cream/55">Fuentes: panel de Instagram, perfil de TikTok y portal de contenido The Framework</p>
          </div>
          <div className="flex flex-wrap content-start gap-3 md:justify-end">
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-cream/25 px-6 py-3 font-sans text-sm text-cream transition-colors hover:bg-coral hover:text-deep"
            >
              Ver @puch_realtor en Instagram <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
        <p className="mt-12 font-display text-3xl italic text-cream/80">Matiz</p>
      </div>
      <Skyline tone="dark" seed={7} className="relative mt-10 h-28 md:h-40" />
    </footer>
  )
}
