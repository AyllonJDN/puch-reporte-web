import { motion, useReducedMotion } from 'framer-motion'

/** Ilustraciones inmobiliarias en trazo fino (currentColor, sin relleno). Se dibujan al entrar en pantalla. */
const DEFS: Record<string, string[]> = {
  tower: [
    'M70 190V30h60v160',
    'M60 190h80',
    'M100 30V8',
    'M92 18h16',
    'M70 52h60M70 76h60M70 100h60M70 124h60M70 148h60',
    'M86 40v10M114 40v10M86 62v10M114 62v10M86 86v10M114 86v10M86 110v10M114 110v10M86 134v10M114 134v10',
    'M92 190v-24h16v24',
  ],
  house: [
    'M30 100 100 40l70 60',
    'M44 90v100h112V90',
    'M20 190h160',
    'M84 190v-48h32v48',
    'M58 112h26v24H58zM116 112h26v24h-26z',
    'M128 62V40h14v34',
  ],
  villa: [
    'M20 190h160',
    'M30 190V110h80v80',
    'M24 112 70 70l46 42',
    'M110 190V90h66v100',
    'M104 92l36-30 42 30',
    'M46 130h24v22H46zM126 108h22v20h-22zM126 148h22v20h-22z',
    'M58 190v-28h16v28',
  ],
  plan: [
    'M30 40h140v120H30z',
    'M90 40v70M30 110h90M120 110v50M120 80h50',
    'M90 110a20 20 0 0 1-20-20',
    'M120 130a14 14 0 0 0 14 14',
    'M52 40v-0M60 160v14M140 160v14',
  ],
  key: [
    'M64 100a34 34 0 1 1 68 0 34 34 0 0 1-68 0z',
    'M82 100a16 16 0 1 1 32 0 16 16 0 0 1-32 0z',
    'M98 134v54',
    'M98 160h22M98 178h16',
  ],
  door: [
    'M50 190V70a50 50 0 0 1 100 0v120',
    'M30 190h140',
    'M66 190V76a34 34 0 0 1 68 0v114',
    'M122 132a5 5 0 1 0 0 .1',
    'M80 100h40M80 130h40',
  ],
}

export default function Drawing({ name, className = '' }: { name: string; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {(DEFS[name] ?? DEFS.tower).map((d, i) => (
        <motion.path
          key={i}
          d={d}
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: i * 0.12, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}
