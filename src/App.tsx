import { MotionConfig } from 'framer-motion'
import { Footer, Loader, Navbar, ScrollProgress } from './components/Chrome'
import Hero from './sections/Hero'
import { SkylineDivider } from './components/Skyline'
import Perfil from './sections/Perfil'
import Historial from './sections/Historial'
import Resumen from './sections/Resumen'
import Cuenta from './sections/Cuenta'
import Semanal from './sections/Semanal'
import Estadistica from './sections/Estadistica'
import Reels from './sections/Reels'
import Interaccion from './sections/Interaccion'
import TikTok from './sections/TikTok'
import Plataformas from './sections/Plataformas'
import Guiones from './sections/Guiones'
import Plan from './sections/Plan'
import Cruce from './sections/Cruce'
import Recomendaciones from './sections/Recomendaciones'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Loader />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Perfil />
        <SkylineDivider seed={2} />
        <Resumen />
        <Cuenta />
        <SkylineDivider seed={3} />
        <Semanal />
        <Historial />
        <SkylineDivider seed={4} />
        <Estadistica />
        <Reels />
        <SkylineDivider seed={5} />
        <Interaccion />
        <TikTok />
        <SkylineDivider seed={6} />
        <Plataformas />
        <Guiones />
        <SkylineDivider seed={8} />
        <Plan />
        <Cruce />
        <SkylineDivider seed={9} />
        <Recomendaciones />
      </main>
      <Footer />
    </MotionConfig>
  )
}
