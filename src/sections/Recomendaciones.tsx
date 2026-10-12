import { motion } from 'framer-motion'
import { Section } from '../components/ui'

const recs = [
  { c: 'bg-peri', t: 'Sostener la cadencia', d: 'Mínimo 3 reels por semana y 2 videos en TikTok. Hubo vacíos en las semanas 7, 9, 10 y 11.' },
  { c: 'bg-olive', t: 'Grabar lo ya escrito', d: '11 guiones aprobados (semanas 2 a 6) no tienen grabación ni publicación: priorizarlos antes de redactar nuevos.' },
  { c: 'bg-coral', t: 'Replicar lo que conecta', d: 'Los reels del 11 de agosto, 14 de septiembre y 2 de octubre tuvieron la mayor interacción: repetir formato, gancho y llamada a compartir o guardar.' },
  { c: 'bg-clay', t: 'Mantener el portal al día', d: 'Actualizar estados, completar los 4 guiones duplicados y registrar los videos publicados para comparar guion, video y resultado.' },
]

export default function Recomendaciones() {
  return (
    <Section id="recomendaciones" num="13" label="Recomendaciones" title="Cuatro acciones para *sostener* los resultados de las próximas 12 semanas" dark>
      <motion.div
        className="grid gap-4 md:grid-cols-2"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      >
        {recs.map((r, i) => (
          <motion.div
            key={r.t}
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            className="rounded-3xl border border-line bg-white/[.07] p-6 backdrop-blur-md sm:p-8"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-full font-display text-xl font-semibold text-deep ${r.c}`}>{i + 1}</span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-cream">{r.t}</h3>
            <p className="mt-2 font-sans leading-relaxed text-cream/75">{r.d}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
