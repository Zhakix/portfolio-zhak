'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Hero() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // ── Custom cursor (optimized) ──
    const cur = cursorRef.current
    const tr  = trailRef.current
    if (!cur || !tr) return

    let mx = 0, my = 0, tx = 0, ty = 0
    let lastMoveTime = 0
    const DEBOUNCE_MS = 16

    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastMoveTime < DEBOUNCE_MS) return
      lastMoveTime = now
      mx = e.clientX; my = e.clientY
      if (cur) cur.style.left = mx + 'px'; cur.style.top = my + 'px'
    }
    document.addEventListener('mousemove', onMove, { passive: true })

    let rafId: number
    const loop = () => {
      tx += (mx - tx) * 0.1
      ty += (my - ty) * 0.1
      if (tr) tr.style.left = tx + 'px'; tr.style.top = ty + 'px'
      rafId = requestAnimationFrame(loop)
    }
    loop()

    const interactEls: Array<{ el: Element, enter: EventListener, leave: EventListener }> = []
    document.querySelectorAll('a,button,.tc,.pc,.tl').forEach(el => {
      const enter = () => {
        if (cur) gsap.to(cur, { width: 14, height: 14, duration: 0.15 })
        if (tr) gsap.to(tr, { width: 14, height: 14, duration: 0.15 })
      }
      const leave = () => {
        if (cur) gsap.to(cur, { width: 8, height: 8, duration: 0.15 })
        if (tr) gsap.to(tr, { width: 8, height: 8, duration: 0.15 })
      }
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
      interactEls.push({ el, enter, leave })
    })

    // ── Hero text split & animate ──
    function splitIntoChars(el: HTMLElement) {
      const text = el.textContent || ''
      el.textContent = ''
      return [...text].map(ch => {
        const span = document.createElement('span')
        span.className = 'split-char'
        span.textContent = ch === ' ' ? '\u00a0' : ch
        el.appendChild(span)
        return span
      })
    }

    const l1El = document.getElementById('heroL1')
    const l2El = document.getElementById('heroL2')
    if (!l1El || !l2El) return

    const l1Chars = splitIntoChars(l1El)
    const l2Chars = splitIntoChars(l2El)

    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } })
    heroTL
      .to('.hero-pill',  { opacity: 1, y: 0, duration: .7, ease: 'back.out(1.5)' })
      .to(l1Chars, { opacity: 1, y: 0, duration: .06, stagger: .04, ease: 'power4.out' }, '-=.3')
      .to(l2Chars, { opacity: 1, y: 0, duration: .06, stagger: .04, ease: 'power4.out' }, '-=.4')
      .to('#heroSub',    { opacity: 1, y: 0, duration: .8 }, '-=.2')
      .to('#heroCta',    { opacity: 1, y: 0, duration: .7 }, '-=.5')

    // ── Hover effect on hero text (like .tc:hover) ──
    const heroH1 = document.querySelector('.hero-h1')
    if (heroH1) {
      heroH1.addEventListener('mouseenter', () => {
        const allChars = heroH1.querySelectorAll('.split-char')
        gsap.to(allChars, {
          opacity: 1,
          y: -4,
          scale: 1.04,
          duration: 0.15,
          stagger: 0.05,
          ease: 'back.out(1.5)'
        })
      })

      heroH1.addEventListener('mouseleave', () => {
        const allChars = heroH1.querySelectorAll('.split-char')
        gsap.to(allChars, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          stagger: 0.03,
          ease: 'power2.out'
        })
      })
    }

    // ── Orb parallax ──
    gsap.to('#orb1', { y: -120, x:  60, scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.5 } })
    gsap.to('#orb2', { y:  100, x: -80, scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2   } })
    gsap.to('#orb3', { y:  -80, x:  40, scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2.5 } })

    // ── Magnetic buttons ──
    document.querySelectorAll<HTMLElement>('.mag').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width  / 2)
        const dy = e.clientY - (r.top  + r.height / 2)
        gsap.to(btn, { x: dx * .22, y: dy * .22, duration: .3, ease: 'power2.out' })
      })
      btn.addEventListener('mouseleave', () =>
        gsap.to(btn, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.4)' })
      )
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      if (rafId) cancelAnimationFrame(rafId)
      interactEls.forEach(({ el, enter, leave }) => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      })
      gsap.killTweensOf('#orb1, #orb2, #orb3')
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <>
      {/* Custom cursor — rendered here so it's always on top */}
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={trailRef} />

      <section id="hero">
        <div className="hero-pill">
          <div className="pill-dot" />
          <span>Open to new opportunities</span>
        </div>
        <h1 className="hero-h1">
          <span className="l1" id="heroL1">Full-Stack</span>
          <span className="l2" id="heroL2">Developer</span>
        </h1>
        <p className="hero-sub" id="heroSub">
          I design and build digital products that live at the edge of engineering
          and design — fast, scalable, and beautiful by default.
        </p>
        <div className="hero-cta" id="heroCta">
          <a href="#projects" className="btn-primary mag">View My Work</a>
          <a href="#contact"  className="btn-secondary mag">Get In Touch</a>
        </div>
      </section>
    </>
  )
}
