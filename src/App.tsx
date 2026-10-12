import { MotionConfig } from 'framer-motion'
import { Footer, Loader, Navbar, ScrollProgress } from './components/Chrome'
import Hero from './sections/Hero'
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
        <Resumen />
        <Cuenta />
        <Semanal />
        <Historial />
        <Estadistica />
        <Reels />
        <Interaccion />
        <TikTok />
        <Plataformas />
        <Guiones />
        <Plan />
        <Cruce />
        <Recomendaciones />
      </main>
      <Footer />
    </MotionConfig>
  )
}
