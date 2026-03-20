'use client'

import { useEffect } from 'react'
import gsap from 'gsap'

export default function Scroll({ className }: { className?: string }) {
  useEffect(() => {
    // Animate scroll-hint
    gsap.to('#scrollHint', { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      ease: 'power3.out'
    })
  }, [])

  return (
    <section id="scroll-section" className={className || 'scroll-section'}>
      <div className="scroll-hint" id="scrollHint">
        <div className="scroll-dot" />
        <span>Scroll to explore</span>
      </div>
    </section>
  )
}