'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const JOBS = [
  {
    period:  '2022 — Present',
    role:    'Senior Frontend Engineer',
    company: 'Vercel Inc. — Remote',
    desc:    'Led the DX team building Next.js-powered internal tooling. Improved build performance by 38% and shipped the new Analytics dashboard used by 500k+ teams.',
  },
  {
    period:  '2020 — 2022',
    role:    'Full-Stack Developer',
    company: 'Linear — San Francisco, CA',
    desc:    'Built real-time collaborative features for the issue-tracking platform. Designed the keyboard-shortcut system now used by 80k daily active users.',
  },
  {
    period:  '2018 — 2020',
    role:    'UI Engineer',
    company: 'Figma — New York, NY',
    desc:    'Worked on the design systems team crafting accessible component libraries and contributing to the plugin API architecture.',
  },
]

export default function Experience() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const reveal = (selector: string) => {
      document.querySelectorAll(selector).forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: .9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' } }
        )
      })
    }
    reveal('#experience .s-label')
    reveal('#experience .s-title')

    document.querySelectorAll('.tl').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: .8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' } }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section id="experience">
      <span className="s-label gsap-hidden">04 — Experience</span>
      <h2 className="s-title gsap-hidden">Where I&apos;ve <span className="g">worked</span></h2>

      <div className="timeline">
        {JOBS.map((job, i) => (
          <div key={i} className="tl gsap-hidden">
            <div className="tl-dot" />
            <div className="tl-period">{job.period}</div>
            <div className="tl-role">{job.role}</div>
            <div className="tl-co">{job.company}</div>
            <p className="tl-desc">{job.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
