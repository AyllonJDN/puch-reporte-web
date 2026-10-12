import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Menu, X } from 'lucide-react'

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

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })
  return <motion.div style={{ scaleX }} className="no-print fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-arena" />
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    )
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

  const light = !scrolled && !open
  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[60] h-[72px] transition-colors duration-300 ${
          scrolled || open ? 'bg-white/80 shadow-card backdrop-blur-md' : 'bg-transparent'
        } ${open ? '!bg-ink !shadow-none' : ''}`}
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <a
            href="#inicio"
            onClick={() => setOpen(false)}
            className={`font-display text-lg font-semibold ${light || open ? 'text-white' : 'text-ink'}`}
          >
            Informe · @puch_realtor
          </a>
          <ul className="hidden items-center gap-6 xl:flex">
            {GROUPS.map((g) => {
              const on = g.ids.includes(active)
              return (
                <li key={g.l} className="relative">
                  <a
                    href={`#${g.ids[0]}`}
                    className={`font-sans text-[13px] ${light ? 'text-white/80' : 'text-ink'} ${on ? 'font-bold' : ''}`}
                  >
                    {g.l}
                  </a>
                  {on && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-arena"
                    />
                  )}
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className={`xl:hidden ${light || open ? 'text-white' : 'text-ink'}`}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] overflow-y-auto bg-ink pt-24"
          >
            <ul className="space-y-1 px-6 pb-10">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className={`block py-2 font-display text-2xl ${active === n.id ? 'text-arena' : 'text-white'}`}
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
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
        >
          <p className="font-display text-2xl text-white">Preparando informe</p>
          <div className="mt-4 flex gap-2" aria-hidden>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-arena"
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
    <footer className="relative overflow-hidden bg-ink px-4 py-16 text-white sm:px-6">
      <div className="grid-dots pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 md:grid-cols-[1fr_260px]">
        <div>
          <p className="font-sans text-xs uppercase tracking-[.2em] text-arena">Cierre del informe</p>
          <p className="mt-4 font-display text-3xl font-semibold leading-tight md:text-5xl">
            Vender no es suerte. <span className="text-arena">Es estrategia.</span>
          </p>
          <p className="mt-6 font-display text-xl font-semibold md:text-2xl">Desempeño en redes sociales de @puch_realtor</p>
          <p className="mt-3 font-sans text-white/80">Ventana analizada: 13 de julio al 4 de octubre de 2026</p>
          <p className="mt-1 font-sans text-white/80">Cifras actualizadas al 10 de octubre de 2026</p>
          <p className="mt-6 text-sm text-white/60">
            Fuentes: panel de Instagram, perfil de TikTok y portal de contenido The Framework
          </p>
          <p className="mt-8 font-sans text-xs uppercase tracking-[.2em] text-white/40">Elaborado por Matiz</p>
        </div>
        <img
          src="/img/brikia-sergio.png"
          alt="Sergio Puch, Broker y Founder de Brikia"
          className="mx-auto w-[220px] rotate-2 rounded-3xl border border-arena/40 shadow-2xl md:w-full"
          loading="lazy"
        />
      </div>
    </footer>
  )
}
