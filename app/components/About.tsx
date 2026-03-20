'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const reveal = (selector: string) => {
      document.querySelectorAll(selector).forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: .9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          }
        )
      })
    }

    reveal('#about .s-label')
    reveal('#about .s-title')
    reveal('.avatar-card')
    reveal('.about-body')

    // Count-up numbers
    document.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => {
          const target = Number(el.dataset.count)
          gsap.to({ val: 0 }, {
            val: target, duration: 1.4, ease: 'power2.out',
            onUpdate(this: gsap.core.Tween) {
              el.textContent = Math.floor((this.targets()[0] as { val: number }).val) + (target >= 10 ? '+' : '')
            },
          })
        },
      })
    })

    // Handle ESC key untuk close modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      <section id="about" ref={sectionRef}>
        <span className="s-label gsap-hidden">01 — About</span>
        <h2 className="s-title gsap-hidden">
          The person behind<br />the <span className="g">code</span>
        </h2>
        <div className="about-wrap">
          <div className="avatar-card gsap-hidden">
            <div 
              className="avi-wrapper"
              onClick={() => setIsModalOpen(true)}
            >
              <Image 
                src="/profile.jpg"
                alt="Mybini"
                width={110}
                height={110}
                className="avi-img"
              />
            </div>
            <div className="avi-name">Muhammad Rifki Zhaki</div>
            <div className="avi-role">Full-Stack Developer &amp; UX Engineer</div>
            <div className="badges">
              <span className="badge">Depok</span>
              <span className="badge">6 Yrs Exp</span>
              <span className="badge">Freelance</span>
            </div>
            <div className="stats">
              <div className="stat">
                <div className="stat-n" data-count="11">0</div>
                <div className="stat-l">Projects</div>
              </div>
              <div className="stat">
                <div className="stat-n" data-count="12">0</div>
                <div className="stat-l">Clients</div>
              </div>
              <div className="stat">
                <div className="stat-n" data-count="13">0</div>
                <div className="stat-l">Years</div>
              </div>
            </div>
          </div>

          <div className="about-body gsap-hidden">
            <p>
              Hey! I&apos;m a <strong>full-stack developer</strong> based in New York with 6 years of
              experience crafting products that people actually enjoy using. I&apos;ve worked with
              early-stage startups, scale-ups, and global agencies.
            </p>
            <p>
              My work sits at the intersection of <strong>clean engineering and thoughtful UX</strong>.
              I obsess over the details — from database schema design to micro-interaction timing.
              The best code is the kind users never have to think about.
            </p>
            <p>
              Currently focused on <strong>React, TypeScript, and Node.js</strong> ecosystems, with a
              growing interest in AI-augmented tooling.
            </p>
            <p>Outside the terminal: specialty coffee nerd, type enthusiast, and amateur cello player.</p>
          </div>
        </div>
      </section>

      {/* Modal Lightbox */}
      {isModalOpen && (
        <div 
          className="modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <Image 
              src="/profile.jpg"
              alt="Muhammad Rifki Zhaki"
              width={600}
              height={600}
              className="modal-image"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}