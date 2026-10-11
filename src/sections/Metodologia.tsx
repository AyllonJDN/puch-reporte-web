import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Download } from 'lucide-react'
import * as data from '../data/report'
import { Card, Section } from '../components/ui'

const steps = [
  { t: 'Cuenta', d: 'Panel profesional de Instagram: indicadores de 7, 14, 30 y 90 días.' },
  { t: 'Reels', d: 'Estadísticas individuales de los 27 reels: vistas, alcance, interacciones y visitas.' },
  { t: 'TikTok', d: 'Perfil público: vistas, me gusta, comentarios y guardados de cada video.' },
  { t: 'Guiones', d: 'Lectura de los 49 guiones del portal, sin modificar ningún dato.' },
  { t: 'Cruce', d: 'Cada pieza se compara con los guiones por título, gancho y tema (niveles «alta» y «probable»).' },
]

const glossary = [
  ['Media', 'Suma de todos los valores dividida entre la cantidad de valores. Representa el nivel típico, pero la afectan los valores extremos.'],
  ['Mediana', 'Valor central al ordenar los datos de menor a mayor. La mitad de las piezas queda por debajo y la otra mitad por encima.'],
  ['Desviación estándar', 'Medida de cuánto se alejan los datos de la media. Cuanto mayor es, más irregular es el resultado entre semanas o piezas.'],
  ['Margen de error al 95 %', 'Rango alrededor de la media que probablemente contiene el valor real. Se calcula como 1,96 × desviación estándar ÷ raíz de la cantidad de piezas (z = 1,96).'],
  ['Coeficiente de correlación (r)', 'Número entre −1 y 1 que indica si dos medidas suben juntas. Cerca de 1 significa que crecen a la par; cerca de 0, que no se relacionan.'],
  ['Regresión lineal y R²', 'La regresión traza la recta que mejor resume una tendencia. R² indica qué parte de la variación explica esa recta: 0 nada, 1 todo.'],
  ['Carta de control ±1σ', 'Gráfico que marca la media y una banda de una desviación estándar hacia cada lado. Lo que cae fuera de la banda es una semana excepcional.'],
]

function download() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'informe-puch-realtor.json'
  a.click()
  URL.revokeObjectURL(url)
}

export default function Metodologia() {
  const [open, setOpen] = useState(false)
  return (
    <Section
      id="metodologia"
      num="15"
      label="Metodología"
      title="Cómo se obtuvieron los datos: lectura directa de cada fuente, pieza por pieza"
    >
      <ol className="relative grid gap-4 md:grid-cols-5">
        {steps.map((s, i) => (
          <li key={s.t} className="relative">
            <Card className="h-full">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-arena font-display font-semibold text-ink">{i + 1}</span>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-sec">{s.d}</p>
            </Card>
          </li>
        ))}
      </ol>
      <Card large>
        <p className="font-sans leading-relaxed text-sec">
          Periodo: 13 de julio al 4 de octubre de 2026 (12 semanas completas; el 13 de julio comenzó la producción técnica; los guiones se escribieron desde el 30 de junio). Las fechas de cada pieza se decodifican de su identificador y se convierten a hora de Lima. No hubo inversión publicitaria en el periodo, por lo que no se calculan costos por mil impresiones ni por clic.
        </p>
        <p className="mt-4 font-sans leading-relaxed text-sec">
          Los guiones del portal y las publicaciones no comparten identificador: el cruce se infirió por título, gancho y tema, con dos niveles de coincidencia, «alta» y «probable».
        </p>
      </Card>

      <Card large>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 text-left">
          <span className="font-display text-xl font-semibold text-ink">Glosario estadístico</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }}>
            <ChevronDown size={22} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.dl initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="space-y-4 pt-5">
                {glossary.map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-sans text-sm font-bold text-ink">{k}</dt>
                    <dd className="mt-0.5 font-sans text-sm leading-relaxed text-sec">{v}</dd>
                  </div>
                ))}
              </div>
            </motion.dl>
          )}
        </AnimatePresence>
      </Card>

      <button type="button" onClick={download} className="no-print inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-sans text-sm text-sec shadow-card hover:text-ink">
        <Download size={16} /> Descargar datos (JSON)
      </button>
    </Section>
  )
}
