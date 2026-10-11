import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from 'recharts'
import { tiktok, tiktokProfile } from '../data/report'
import PieceList from '../components/PieceList'
import type { Piece } from '../components/PieceList'
import { C, Card, CardTitle, ChartBox, Kpi, Section, Source, Tip, cursorFill, grid, useAnim, xAxis, yAxis } from '../components/ui'
import { dlong, dm, median, nf, snip, sum } from '../lib/stats'

export default function TikTok() {
  const anim = useAnim()
  const views = tiktok.map((t) => t.vistas)
  const total = sum(views)
  const max = Math.max(...views)
  const inter = sum(tiktok.map((t) => t.likes + t.com + t.guard))
  const data = tiktok.map((t, i) => ({ i, ...t }))
  const pieces: Piece[] = tiktok.map((t, i) => ({
    id: `${i}`,
    f: t.f,
    texto: t.texto,
    vistas: t.vistas,
    metrics: [
      ['Vistas', nf(t.vistas)],
      ['Me gusta', nf(t.likes)],
      ['Comentarios', nf(t.com)],
      ['Guardados', nf(t.guard)],
      ['Interacción', `${nf(((t.likes + t.com + t.guard) / t.vistas) * 100, 2)} %`],
    ],
  }))

  return (
    <Section
      id="tiktok"
      num="08"
      label="TikTok"
      title="Un solo video explica dos tercios de las vistas; lo habitual es entre 400 y 1.000 por video"
    >
      <Card large>
        <CardTitle>Vistas por video, en orden cronológico</CardTitle>
        <ChartBox
          className="h-[260px] sm:h-[360px]"
          label="Barras de vistas por video de TikTok: el video del 16 de julio concentra 34.800 vistas, dos tercios del total"
        >
          <BarChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid {...grid} />
            <XAxis dataKey="i" {...xAxis} interval={0} angle={-60} textAnchor="end" height={48} tickFormatter={(i: number) => dm(tiktok[i].f)} />
            <YAxis {...yAxis} />
            <Tooltip cursor={cursorFill} content={<Tip head={(_l, r) => `${dlong(r.f)} · ${snip(r.texto).slice(0, 70)}`} />} />
            <Bar dataKey="vistas" name="Vistas" radius={[6, 6, 0, 0]} {...anim}>
              {data.map((d) => (
                <Cell key={d.i} fill={d.vistas === max ? C.ink : C.lavanda} />
              ))}
            </Bar>
          </BarChart>
        </ChartBox>
        <Source>Fuente: perfil público de TikTok, lectura pieza por pieza. Fechas en hora de Lima.</Source>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi value={total} label="Vistas" sub={`${tiktok.length} videos (mediana ${nf(median(views))})`} hint="La mediana es el valor central: la mitad de los videos obtuvo menos de 739 vistas. Describe lo habitual mejor que el promedio." />
        <Kpi value={Math.round((max / total) * 100)} suffix=" %" label="En el video del 16 de julio" sub={`${nf(max)} vistas`} tone="lavanda" hint="Un solo video concentra dos tercios del total: sin él, el canal rinde mucho menos y el resultado es difícil de repetir." />
        <Kpi value={(inter / total) * 100} decimals={1} suffix=" %" label="Interacción sobre vistas" sub="Sin compartidos, que TikTok no expone sin sesión" tone="menta" hint="Mide cuántos espectadores reaccionan: me gusta, comentarios y guardados entre cada 100 vistas." />
        <Kpi value={3} label="Semanas sin publicar" sub="Del 7 al 27 de septiembre · último video: 2 de octubre" tone="rosa" hint="Las pausas largas frenan al algoritmo: al volver a publicar, la cuenta parte con menos impulso." />
        <Kpi value={tiktokProfile.seguidores} label="Seguidores en TikTok" sub="113 vistas por seguidor en la ventana" hint="Con una comunidad pequeña, el alcance depende del algoritmo y no de los seguidores: por eso un solo video puede disparar la cifra." />
      </div>

      <PieceList
        noun="videos"
        accent={C.lavanda}
        items={pieces}
        sorts={[
          { v: 'vistas', l: 'Vistas', get: (p) => p.vistas },
          { v: 'f', l: 'Fecha', get: (p) => p.f },
          { v: 'likes', l: 'Me gusta', get: (p) => tiktok[+p.id].likes },
          { v: 'com', l: 'Comentarios', get: (p) => tiktok[+p.id].com },
        ]}
        initial={6}
      />
      <Source>TikTok no expone compartidos sin sesión iniciada; su tasa no es estrictamente comparable con la de Instagram.</Source>
    </Section>
  )
}
