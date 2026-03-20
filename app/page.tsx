import BgCanvas       from './components/BgCanvas'
import Nav            from './components/Nav'
import Hero           from './components/Hero'
import About          from './components/About'
import TechStack      from './components/TechStack'
import Projects       from './components/Projects'
import Experience     from './components/Experience'
import Contact        from './components/Contact'
import SpotifyIsland  from './components/SpotifyIsland'
import Scroll from './components/Scroll'

export default function Home() {
  return (
    <>
      <BgCanvas />
      <div className="grid-overlay" />
      <SpotifyIsland />
      <Nav />
      <Hero />
      <hr className="sec-divider" />
      <Scroll className="scroll-section" />
      <hr className="sec-divider" />
      <About />
      <hr className="sec-divider" />
      <TechStack />
      <hr className="sec-divider" />
      <Projects />
      <hr className="sec-divider" />
      <Experience />
      <hr className="sec-divider" />
      <Contact />
      <footer>
        <p>© 2025 — All rights reserved</p>
        <p>Designed &amp; built with yes king 👑</p>
      </footer>
    </>
  )
}
