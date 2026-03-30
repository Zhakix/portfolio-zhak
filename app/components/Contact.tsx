'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SOCIALS = [
  {
    label: 'GitHub', href: 'https://github.com/Zhakix',
    icon: <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />,
  },
  {
    label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-rifki-zhaki-80b618297?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BPUEmFpU2Ri%2B0JKoCIciuEw%3D%3D',
    icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
  },
  {
    label: 'Instagram', 
    href: 'https://www.instagram.com/zh4ki_/',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </g>
    ),
  },
  {
    label: 'CV', 
    href: '/cv.pdf',
    isText: true,
  },
]

export default function Contact() {
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
    reveal('#contact .s-label')
    reveal('#contact .s-title')
    reveal('.contact-sub')
    reveal('.contact-card')
    reveal('.socials')

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section id="contact">
      <div className="contact-inner">
        <span className="s-label gsap-hidden">05 — Contact</span>
        <h2 className="s-title gsap-hidden">
          Let&apos;s build something<br /><span className="g">remarkable</span>
        </h2>
        <p className="contact-sub gsap-hidden">
          Open to freelance projects, full-time roles, and interesting collaborations.
          I usually reply within 24 hours.
        </p>
        <div className="contact-card gsap-hidden">
          <a href="mailto:muhammadrifkizhaki@gmail.com" className="c-email">
            muhammadrifkizhaki@gmail.com
          </a>
        </div>
        <div className="socials gsap-hidden">
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="sp sp-icon" title={s.label} aria-label={s.label}>
              {s.isText ? (
                <span className="cv-text" style={{ fontWeight: 500 }}>{s.label}</span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  {s.icon}
                </svg>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
