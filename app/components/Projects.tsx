'use client'

import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const PROJECTS = [
  { num: '01', tags: ['React', 'D3.js', 'SaaS'],             name: 'Aether Dashboard', desc: 'Real-time analytics platform for e-commerce. WebSocket-powered live data with beautiful D3 visualisations.',         link: '#', stars: '340'  },
  { num: '02', tags: ['React Native', 'Plaid', 'FinTech'],   name: 'Nomo Finance',     desc: 'Personal finance app simplifying budgeting with behavioral nudges and AI-driven spending insights.',                    link: '#', stars: '210'  },
  { num: '03', tags: ['Next.js', 'Shopify', 'Luxury'],       name: 'Maison Verre',     desc: 'Full brand identity & Shopify storefront with immersive scroll-driven animations for luxury glassware.',               link: '#', stars: '95'   },
  { num: '04', tags: ['CLI', 'TypeScript', 'Open Source'],   name: 'FormKit CLI',      desc: 'Open-source CLI generating accessible, typed form components from JSON schema. 1.2k+ GitHub stars.',                  link: '#', stars: '1.2k' },
  { num: '05', tags: ['AI/ML', 'Whisper', 'Vectors'],        name: 'Scribe AI',        desc: 'AI-powered meeting transcription with action-item extraction and semantic recall via vector search.',                   link: '#', stars: '580'  },
  { num: '06', tags: ['Three.js', 'GLSL', 'Creative'],       name: 'Parallax Studio',  desc: 'Generative 3D art using GLSL shaders to sculpt data-driven forms from live audio input.',                            link: '#', stars: '440'  },
]

export default function Projects() {
  const [showAll, setShowAll] = useState(false)
  const displayedProjects = showAll ? PROJECTS : PROJECTS.slice(0, 3)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Kill hanya animations dari Projects section
    gsap.killTweensOf('.pc')
    gsap.killTweensOf('#projects .s-label')
    gsap.killTweensOf('#projects .s-title')
    
    // Kill hanya ScrollTriggers dari Projects, bukan semua
    ScrollTrigger.getAll().forEach(t => {
      const isProjectTrigger = t.trigger && 
        (t.trigger instanceof Element && t.trigger.closest('#projects'))
      if (isProjectTrigger) {
        t.kill()
      }
    })

    const reveal = (selector: string) => {
      document.querySelectorAll(selector).forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: .9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' } }
        )
      })
    }
    reveal('#projects .s-label')
    reveal('#projects .s-title')

    gsap.fromTo('.pc',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: .7, stagger: .12, ease: 'power3.out',
        scrollTrigger: { trigger: '.proj-grid', start: 'top 80%' } }
    )

    // Refresh ScrollTrigger ketika showAll berubah
    ScrollTrigger.refresh()

    return () => {
      gsap.killTweensOf('.pc')
      gsap.killTweensOf('#projects .s-label')
      gsap.killTweensOf('#projects .s-title')
      ScrollTrigger.getAll().forEach(t => {
        const isProjectTrigger = t.trigger && 
          (t.trigger instanceof Element && t.trigger.closest('#projects'))
        if (isProjectTrigger) {
          t.kill()
        }
      })
    }
  }, [showAll])

  return (
    <section id="projects">
      <span className="s-label gsap-hidden">03 — Projects</span>
      <h2 className="s-title gsap-hidden">Work I&apos;m <span className="g">proud of</span></h2>

      <div className="proj-grid">
        {displayedProjects.map(p => (
          <div key={p.num} className="pc gc gsap-hidden">
            <div className="pc-bar" />
            <div className="pc-img"><div className="pc-num">{p.num}</div></div>
            <div className="pc-body">
              <div className="pc-tags">
                {p.tags.map(t => <span key={t} className="ptag">{t}</span>)}
              </div>
              <div className="pc-name">{p.name}</div>
              <p className="pc-desc">{p.desc}</p>
              <div className="pc-footer">
                <a href={p.link} className="pc-link">Case Study →</a>
                <span className="pc-stars">⭐ {p.stars}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="proj-actions">
        <button 
          onClick={() => setShowAll(!showAll)}
          className="btn-view-more mag"
        >
          {showAll ? 'Show Less' : 'View More Projects'}
        </button>
      </div>
    </section>
  )
}
