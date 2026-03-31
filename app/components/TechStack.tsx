'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StackIcon from "tech-stack-icons"

type TechItem = {
  name: string;
  iconName: string;
}

const ROW1: TechItem[] = [
  { name: 'React',      iconName: 'react' },
  { name: 'Next.js',    iconName: 'nextjs' },
  { name: 'TypeScript', iconName: 'typescript' },
  { name: 'Tailwind',   iconName: 'tailwindcss' },
  { name: 'Node.js',    iconName: 'nodejs' },
  { name: 'Express',    iconName: 'expressjs' },
  { name: 'Python',     iconName: 'python' },
  { name: 'GraphQL',    iconName: 'graphql' },
  { name: 'Framer',     iconName: 'framer' },
]

const ROW2: TechItem[] = [
  { name: 'Three.js',   iconName: 'threejs' },
  { name: 'PostgreSQL', iconName: 'postgresql' },
  { name: 'MongoDB',    iconName: 'mongodb' },
  { name: 'After Effects',      iconName: 'ae' },
  { name: 'Docker',     iconName: 'docker' },
  { name: 'AWS',        iconName: 'aws' },
  { name: 'Figma',      iconName: 'figma' },
  { name: 'Git',        iconName: 'git' },
]

function TechChip({ name, iconName }: TechItem) {
  return (
    <div className="tc tc-original">
      <span className="tc-icon">
        <div style={{ width: '1.9rem', height: '1.9rem', margin: '0 auto' }}>
          <StackIcon name={iconName} variant="dark" />
        </div>
      </span>
      <div className="tc-name">{name}</div>
      <div className="tc-bar">
        {/* Fill statis 100% mengikuti desain garis bawah kamu */}
        <div className="tc-fill" style={{ width: '100%' }}></div>
      </div>
    </div>
  )
}

export default function TechStack() {
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    gsap.registerPlugin(ScrollTrigger)

    // 1. Animasi Fade In Judul & Label
    gsap.utils.toArray('#stack .s-label, #stack .s-title').forEach((el: any) => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, { 
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' } 
      })
    })

    // 2. Logika Infinite Belt
    function setupBelt(row: HTMLDivElement, speed: number) {
      if (!row) return
      let oneSetW = 0, x = 0, vel = speed
      let dragging = false, prevX = 0, smoothVel = 0

      const buildAndMeasure = () => {
        row.querySelectorAll('.tc-clone').forEach(c => c.remove())
        const originals = Array.from(row.querySelectorAll<HTMLElement>('.tc-original'))
        if (originals.length === 0) return
        
        // Ukuran satu set ikon (lebar elemen + gap 16px)
        oneSetW = originals.reduce((sum, el) => sum + el.offsetWidth + 16, 0)
        
        let total = oneSetW
        while (total < window.innerWidth * 3) {
          originals.forEach(orig => {
            const clone = orig.cloneNode(true) as HTMLElement
            clone.classList.remove('tc-original')
            clone.classList.add('tc-clone')
            row.appendChild(clone)
          })
          total += oneSetW
        }
      }

      setTimeout(buildAndMeasure, 100)
      window.addEventListener('resize', buildAndMeasure)

      const tickFn = () => {
        if (!oneSetW || dragging) return
        vel += (speed - vel) * 0.032; x += vel
        if (x > 0) x -= oneSetW; if (x < -oneSetW) x += oneSetW
        row.style.transform = `translate3d(${x}px, 0, 0)`
      }
      gsap.ticker.add(tickFn)

      const onDown = (e: MouseEvent) => { dragging = true; prevX = e.clientX; row.style.cursor = 'grabbing' }
      const onMove = (e: MouseEvent) => {
        if (!dragging) return
        const dx = e.clientX - prevX; prevX = e.clientX
        smoothVel = dx * 0.6 + smoothVel * 0.4
        x += dx; gsap.set(row, { x, force3D: true })
      }
      const onUp = () => { dragging = false; row.style.cursor = 'grab'; vel = Math.max(-15, Math.min(15, smoothVel)) }

      row.addEventListener('mousedown', onDown)
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)

      return () => {
        gsap.ticker.remove(tickFn)
        window.removeEventListener('resize', buildAndMeasure)
        row.removeEventListener('mousedown', onDown)
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
    }

    const clean1 = row1Ref.current ? setupBelt(row1Ref.current, -0.6) : undefined
    const clean2 = row2Ref.current ? setupBelt(row2Ref.current, 0.6) : undefined

    return () => { clean1?.(); clean2?.(); ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [mounted])

  return (
    <section id="stack" className="py-20 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <span className="s-label">02 — Tech Stack</span>
        <h2 className="s-title">Tools I <span className="g">master</span></h2>
      </div>

      <div className="stack-rows">
        <div className="stack-row" ref={row1Ref}>
          {ROW1.map((t, i) => <TechChip key={`r1-${i}`} {...t} />)}
        </div>
        <div className="stack-row" ref={row2Ref}>
          {ROW2.map((t, i) => <TechChip key={`r2-${i}`} {...t} />)}
        </div>
      </div>
    </section>
  )
}
