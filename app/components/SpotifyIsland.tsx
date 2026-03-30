'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'

const FALLBACK_TRACKS = [
  { song: 'Redbone',         artist: 'Childish Gambino', dur: 208, colors: ['#1a0a3c','#3b1a6e','#7c3aed'] },
  { song: 'Sweater Weather', artist: 'The Neighbourhood',dur: 242, colors: ['#0a0a1a','#1e1e3e','#3b3b7a'] },
  { song: 'Blinding Lights', artist: 'The Weeknd',       dur: 200, colors: ['#1a0808','#4a1c1c','#c0392b'] },
  { song: 'Levitating',      artist: 'Dua Lipa',         dur: 203, colors: ['#0a1a2e','#1a3a6e','#2563eb'] },
  { song: 'good 4 u',        artist: 'Olivia Rodrigo',   dur: 178, colors: ['#1a0a1a','#4a1a4a','#9333ea'] },
  { song: 'Stay',            artist: 'The Kid LAROI',    dur: 141, colors: ['#0a1a10','#1a3a20','#16a34a'] },
]

const PILL_W = 52, PILL_H = 52
const OPEN_W = 310, OPEN_H = 210

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`
}

function SpotifyLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#1db954" />
      <path d="M16.8 10.8c-2.6-1.5-6.9-1.7-9.4-.9-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9 2.8-.9 7.6-.7 10.5 1.1.4.2.5.7.3 1.1-.2.3-.7.4-1 .1zm-.1 2.7c-.2.3-.6.4-.9.2-2.2-1.3-5.5-1.7-8.1-.9-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 2.9-.9 6.6-.5 9.1 1.1.4.2.5.6.3.8zm-1 2.6c-.2.3-.5.3-.8.2-1.9-1.1-4.3-1.4-7.1-.8-.3.1-.5-.1-.6-.4-.1-.3.1-.5.4-.6 3-.6 5.7-.3 7.8.9.3.2.4.5.3.7z" fill="white" />
    </svg>
  )
}

interface TrackData {
  isPlaying: boolean
  title:     string
  artist:    string
  album:     string
  albumArt:  string | null
  songUrl:   string
}

export default function SpotifyIsland() {
  const widgetRef   = useRef<HTMLDivElement>(null)
  const logoPillRef = useRef<HTMLDivElement>(null)
  const expandedRef = useRef<HTMLDivElement>(null)
  const artRef      = useRef<HTMLDivElement>(null)
  const fillRef     = useRef<HTMLDivElement>(null)
  const songRef     = useRef<HTMLDivElement>(null)
  const artistRef   = useRef<HTMLDivElement>(null)
  const curRef      = useRef<HTMLSpanElement>(null)

  const [isOpen,    setIsOpen]    = useState(false)
  const [playing,   setPlaying]   = useState(false)
  const [elapsed,   setElapsed]   = useState(0)
  const [usingReal, setUsingReal] = useState(false)
  const [songUrl,   setSongUrl]   = useState<string | null>(null)

  const isOpenRef    = useRef(false)
  const playingRef   = useRef(false)
  const elapsedRef   = useRef(0)
  const usingRealRef = useRef(false)
  const songUrlRef   = useRef<string | null>(null)
  const fallbackIdx  = useRef(0)
  const tickerRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { isOpenRef.current    = isOpen    }, [isOpen])
  useEffect(() => { playingRef.current   = playing   }, [playing])
  useEffect(() => { elapsedRef.current   = elapsed   }, [elapsed])
  useEffect(() => { usingRealRef.current = usingReal }, [usingReal])
  useEffect(() => { songUrlRef.current   = songUrl   }, [songUrl])

  const drawArtColor = useCallback((colors: string[]) => {
    if (!artRef.current) return
    artRef.current.style.background = `radial-gradient(circle at 35% 35%, ${colors[2]}, ${colors[1]} 55%, ${colors[0]})`
    artRef.current.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style="opacity:.3">
        <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1"/>
        <circle cx="24" cy="24" r="10" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
        <circle cx="24" cy="24" r="3.5" fill="rgba(255,255,255,.25)"/>
      </svg>`
  }, [])

  const drawArtImage = useCallback((url: string, title: string) => {
    if (!artRef.current) return
    artRef.current.style.background = '#000'
    artRef.current.innerHTML = `
      <img src="${url}" alt="${title}"
        style="width:100%;height:100%;object-fit:cover;border-radius:10px;"/>`
  }, [])

  const pulsePill = useCallback(() => {
    if (isOpenRef.current || !widgetRef.current) return
    gsap.fromTo(widgetRef.current,
      { scale: 1 },
      { scale: 1.18, duration: .18, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    )
  }, [])

  const fetchTrack = useCallback(async () => {
    try {
      const res  = await fetch('/api/spotify')
      if (!res.ok) throw new Error()
      const data: TrackData = await res.json()
      if (!data.title) throw new Error()

      const prevTitle = songRef.current?.textContent?.trim()
      const changed   = prevTitle && prevTitle !== data.title && prevTitle !== 'Loading...'

      if (changed) {
        if (songRef.current)
          gsap.fromTo(songRef.current, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: .3, onStart: () => { if (songRef.current) songRef.current.textContent = data.title } })
        if (artistRef.current)
          gsap.fromTo(artistRef.current, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: .3, delay: .06, onStart: () => { if (artistRef.current) artistRef.current.textContent = data.artist } })
        pulsePill()
      } else {
        if (songRef.current)   songRef.current.textContent   = data.title
        if (artistRef.current) artistRef.current.textContent = data.artist
      }

      if (data.albumArt) drawArtImage(data.albumArt, data.title)
      else               drawArtColor(['#1a0a3c','#3b1a6e','#7c3aed'])

      setSongUrl(data.songUrl);   songUrlRef.current = data.songUrl
      setUsingReal(true);         usingRealRef.current = true
      setPlaying(data.isPlaying); playingRef.current = data.isPlaying

      if (!data.isPlaying) {
        setElapsed(0); elapsedRef.current = 0
        if (fillRef.current) fillRef.current.style.width = '0%'
        if (curRef.current)  curRef.current.textContent  = '0:00'
      }
      return true
    } catch { return false }
  }, [drawArtColor, drawArtImage, pulsePill])

  const loadFallback = useCallback((idx: number, animate = false) => {
    const t     = FALLBACK_TRACKS[idx]
    const start = Math.floor(t.dur * 0.18)
    setElapsed(start);  elapsedRef.current = start
    setPlaying(true);   playingRef.current = true
    setSongUrl(null);   songUrlRef.current = null
    if (fillRef.current) fillRef.current.style.width = (start / t.dur * 100) + '%'
    if (curRef.current)  curRef.current.textContent  = fmt(start)
    drawArtColor(t.colors)
    if (animate) {
      if (songRef.current)
        gsap.fromTo(songRef.current, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: .3, onStart: () => { if (songRef.current)   songRef.current.textContent   = t.song   } })
      if (artistRef.current)
        gsap.fromTo(artistRef.current, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: .3, delay: .06, onStart: () => { if (artistRef.current) artistRef.current.textContent = t.artist } })
    } else {
      if (songRef.current)   songRef.current.textContent   = t.song
      if (artistRef.current) artistRef.current.textContent = t.artist
    }
    pulsePill()
  }, [drawArtColor, pulsePill])

  const tick = useCallback(() => {
    if (!playingRef.current) return
    const newElapsed = elapsedRef.current + 1
    setElapsed(newElapsed); elapsedRef.current = newElapsed
    if (usingRealRef.current) {
      if (fillRef.current) fillRef.current.style.width = Math.min((newElapsed / 240) * 100, 99) + '%'
      if (curRef.current)  curRef.current.textContent  = fmt(newElapsed)
    } else {
      const t = FALLBACK_TRACKS[fallbackIdx.current]
      if (newElapsed >= t.dur) {
        const next = (fallbackIdx.current + 1) % FALLBACK_TRACKS.length
        fallbackIdx.current = next; loadFallback(next, true); return
      }
      if (fillRef.current) fillRef.current.style.width = (newElapsed / t.dur * 100) + '%'
      if (curRef.current)  curRef.current.textContent  = fmt(newElapsed)
    }
  }, [loadFallback])

  const startTicker = useCallback(() => {
    if (tickerRef.current) clearInterval(tickerRef.current)
    tickerRef.current = setInterval(tick, 1000)
  }, [tick])

  const stopTicker = useCallback(() => {
    if (tickerRef.current) clearInterval(tickerRef.current)
  }, [])

  const openIsland = useCallback(() => {
    if (isOpenRef.current || !widgetRef.current || !logoPillRef.current || !expandedRef.current) return
    setIsOpen(true); isOpenRef.current = true
    gsap.timeline()
      .to(widgetRef.current,    { width: PILL_W*1.15, height: PILL_H*.85, borderRadius: 100, duration: .1, ease: 'power2.in' })
      .to(widgetRef.current,    { width: OPEN_W, height: OPEN_H, borderRadius: 24, duration: .5, ease: 'expo.out' })
      .to(logoPillRef.current,  { opacity: 0, scale: .5, duration: .15, ease: 'power2.in' }, '-=.45')
      .set(logoPillRef.current, { pointerEvents: 'none' })
      .to(expandedRef.current,  { opacity: 1, duration: .35, ease: 'power2.out', onStart: () => { if (expandedRef.current) expandedRef.current.style.pointerEvents = 'all' } }, '-=.2')
      .to(widgetRef.current,    { boxShadow: '0 12px 50px rgba(0,0,0,.7),0 0 32px rgba(29,185,84,.22)', duration: .4 }, '-=.3')
  }, [])

  const closeIsland = useCallback(() => {
    if (!isOpenRef.current || !widgetRef.current || !logoPillRef.current || !expandedRef.current) return
    setIsOpen(false); isOpenRef.current = false
    gsap.timeline()
      .to(expandedRef.current,  { opacity: 0, duration: .2, ease: 'power2.in', onComplete: () => { if (expandedRef.current) expandedRef.current.style.pointerEvents = 'none' } })
      .to(widgetRef.current,    { width: PILL_W*1.1, height: PILL_H*.85, borderRadius: 100, duration: .38, ease: 'expo.in' }, '-=.05')
      .to(widgetRef.current,    { width: PILL_W, height: PILL_H, borderRadius: 100, boxShadow: '0 8px 32px rgba(0,0,0,.55)', duration: .22, ease: 'back.out(2)' })
      .to(logoPillRef.current,  { opacity: 1, scale: 1, duration: .3, ease: 'back.out(1.8)', onStart: () => { if (logoPillRef.current) logoPillRef.current.style.pointerEvents = 'all' } }, '-=.15')
  }, [])

  useEffect(() => {
    if (widgetRef.current) {
      gsap.fromTo(widgetRef.current,
        { y: 80, opacity: 0, scale: .7 },
        { y: 0, opacity: 1, scale: 1, duration: .7, ease: 'back.out(1.6)', delay: 2.2 }
      )
    }
    fetchTrack().then(ok => { if (!ok) loadFallback(0, false) })
    startTicker()
    const interval = setInterval(fetchTrack, 30_000)
    const onDocClick = (e: MouseEvent) => { if (isOpenRef.current && widgetRef.current && !widgetRef.current.contains(e.target as Node)) closeIsland() }
    const onEsc      = (e: KeyboardEvent) => { if (e.key === 'Escape') closeIsland() }
    document.addEventListener('click',   onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      stopTicker(); clearInterval(interval)
      document.removeEventListener('click',   onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openInSpotify = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (songUrlRef.current) window.open(songUrlRef.current, '_blank', 'noopener,noreferrer')
  }

  const prevTrack = () => {
    if (usingRealRef.current) return
    const idx = (fallbackIdx.current - 1 + FALLBACK_TRACKS.length) % FALLBACK_TRACKS.length
    fallbackIdx.current = idx; loadFallback(idx, true)
  }
  const nextTrack = () => {
    if (usingRealRef.current) return
    const idx = (fallbackIdx.current + 1) % FALLBACK_TRACKS.length
    fallbackIdx.current = idx; loadFallback(idx, true)
  }

  return (
    <div id="sp-island-wrap">
      <div id="spotify-widget" ref={widgetRef}>

        {/* Collapsed pill */}
        <div
          id="sp-logo-pill"
          ref={logoPillRef}
          onClick={e => { e.stopPropagation(); isOpenRef.current ? closeIsland() : openIsland() }}
        >
          <SpotifyLogo size={26} />
        </div>

        {/* Expanded player */}
        <div id="sp-expanded" ref={expandedRef}>

          {/* Header */}
          <div className="sp-header">
            <SpotifyLogo size={16} />
            <span className="sp-now">
              {usingReal ? (playing ? 'Now Playing' : 'Last Played') : 'Now Playing'}
            </span>
            <div className="sp-bars" style={{ marginLeft: 'auto' }}>
              {[...Array(5)].map((_, i) => <div key={i} className="sp-bar" />)}
            </div>
            <button className="sp-close-btn" onClick={e => { e.stopPropagation(); closeIsland() }}>✕</button>
          </div>

          {/* Track */}
          <div className="sp-track">
            <div className="sp-art">
              <div className="sp-art-inner" ref={artRef} />
              <div className="sp-art-ring" />
            </div>
            <div className="sp-info">
              <div className="sp-song"   ref={songRef}>Loading...</div>
              <div className="sp-artist" ref={artistRef} />
            </div>
          </div>

          {/* Progress */}
          <div className="sp-progress">
            <div className="sp-times">
              <span ref={curRef}>0:00</span>
              <span style={{ fontSize: '.52rem', fontFamily: 'JetBrains Mono,monospace', color: 'rgba(200,190,255,.28)', letterSpacing: '.1em' }}>
                {usingReal ? 'LIVE' : '--:--'}
              </span>
            </div>
            <div className="sp-track-bar">
              <div className="sp-track-fill" ref={fillRef} />
            </div>
          </div>

          {/* Controls */}
          <div className="sp-controls">

            {/* Prev — hidden when real */}
            <button
              className="sp-ctrl"
              onClick={e => { e.stopPropagation(); prevTrack() }}
              style={{ opacity: usingReal ? 0 : 1, pointerEvents: usingReal ? 'none' : 'all' }}
            >&#9664;&#9664;</button>

            {/* Centre — "Open in Spotify" when real, play/pause when fallback */}
            {usingReal ? (
              <button
                className="sp-ctrl play"
                onClick={openInSpotify}
                title="Open in Spotify"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  fontSize: '.65rem', letterSpacing: '.06em', fontFamily: 'JetBrains Mono,monospace',
                  color: '#1db954',
                  background: 'rgba(29,185,84,.1)',
                  border: '1px solid rgba(29,185,84,.28)',
                  borderRadius: '100px',
                  padding: '.42rem .95rem',
                  cursor: 'pointer',
                  transition: 'background .2s, box-shadow .2s',
                }}
                onMouseEnter={e => {
                  const b = e.currentTarget
                  b.style.background  = 'rgba(29,185,84,.2)'
                  b.style.boxShadow   = '0 0 18px rgba(29,185,84,.35)'
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget
                  b.style.background = 'rgba(29,185,84,.1)'
                  b.style.boxShadow  = 'none'
                }}
              >
                {/* External link icon */}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
                Open in Spotify
              </button>
            ) : (
              <button
                className="sp-ctrl play"
                onClick={e => {
                  e.stopPropagation()
                  const next = !playingRef.current
                  setPlaying(next); playingRef.current = next
                  if (next) { startTicker(); gsap.to('.sp-bar', { animationPlayState: 'running' }) }
                  else       { stopTicker();  gsap.to('.sp-bar', { animationPlayState: 'paused'  }) }
                }}
              >{playing ? '❚❚' : '▶'}</button>
            )}

            {/* Next — hidden when real */}
            <button
              className="sp-ctrl"
              onClick={e => { e.stopPropagation(); nextTrack() }}
              style={{ opacity: usingReal ? 0 : 1, pointerEvents: usingReal ? 'none' : 'all' }}
            >&#9654;&#9654;</button>

          </div>

          {/* Bottom label */}
          <div style={{
            textAlign: 'center', marginTop: '-.1rem',
            fontSize: '.5rem', letterSpacing: '.12em', textTransform: 'uppercase',
            fontFamily: 'JetBrains Mono,monospace',
            color: playing ? 'rgba(29,185,84,.5)' : 'rgba(200,190,255,.22)',
          }}>
            {usingReal
              ? (playing ? '● streaming live' : '◷ last scrobbled via last.fm')
              : '● demo mode'}
          </div>

        </div>
      </div>
    </div>
  )
}