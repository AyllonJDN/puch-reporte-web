import { Card, Kpi, Section } from '../components/ui'

const findings = [
  {
    c: 'bg-arena',
    t: 'Concentración',
    d: 'La semana 1 reúne el 31 % de las vistas por un video de TikTok de 34.800. Las últimas 6 semanas rinden 80 % menos que las primeras 6.',
  },
  {
    c: 'bg-lavanda',
    t: 'Continuidad',
    d: 'Hubo 1 semana sin reels (S7) y 3 semanas sin TikTok, del 7 al 27 de septiembre. Lo habitual en un reel es de 1.400 a 3.200 vistas.',
  },
  {
    c: 'bg-menta',
    t: 'Guiones',
    d: '34 de los 49 guiones no se reflejan en lo publicado. Los reels con guion obtienen más interacción por vista: 1,82 % frente a 1,10 %.',
  },
]

export default function Resumen() {
  return (
    <Section
      id="resumen"
      num="01"
      label="Resumen ejecutivo"
      title="En 12 semanas se acumularon 132.920 vistas, pero el volumen depende de pocas piezas y de la frecuencia"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi value={132920} label="Vistas combinadas" sub="80.427 en reels · 52.493 en TikTok" />
        <Kpi value={1128} label="Interacciones en reels" sub="1,40 % de las vistas · 3,23 % del alcance" />
        <Kpi value={38.7} decimals={1} suffix=" %" label="Vistas de no seguidores" sub="Cuenta de Instagram, 90 días" />
        <Kpi value={15} suffix=" de 49" label="Guiones con publicación" sub="13 de 15 grabados · 0 de 23 en revisión" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {findings.map((f, i) => (
          <Card key={f.t} large>
            <span className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-lg font-semibold text-ink ${f.c}`}>
              {i + 1}
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-ink">{f.t}</h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-sec">{f.d}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
