'use client'

import { useEffect, useRef } from 'react'

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav ref={navRef} id="nav">
      <a href="#hero" className="nav-logo">ZhAk.dev</a>
      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#stack">Stack</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#contact" className="nav-cta">Hire Me</a></li>
      </ul>
    </nav>
  )
}
