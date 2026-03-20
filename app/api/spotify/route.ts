import { NextResponse } from 'next/server'

const API_KEY  = process.env.LASTFM_API_KEY!
const USERNAME = process.env.LASTFM_USERNAME!
const BASE     = 'https://ws.audioscrobbler.com/2.0'

export async function GET() {
  try {
    const url  = `${BASE}/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`
    const res  = await fetch(url, { next: { revalidate: 0 } })
    const data = await res.json()

    const track = data?.recenttracks?.track?.[0]
    if (!track) {
      return NextResponse.json({ isPlaying: false, title: null })
    }

    const isPlaying = track['@attr']?.nowplaying === 'true'
    const albumArt  = track.image?.find(
      (img: { size: string; '#text': string }) => img.size === 'extralarge'
    )?.['#text'] ?? null

    const title  = track.name
    const artist = track.artist['#text']

    // Build a Spotify search URL so "Open Spotify" goes to the right place
    const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`

    return NextResponse.json({
      isPlaying,
      title,
      artist,
      album:    track.album['#text'],
      albumArt: albumArt && albumArt !== '' ? albumArt : null,
      songUrl:  spotifySearchUrl,   // ← Spotify search, not Last.fm
    })
  } catch (err) {
    console.error('Last.fm error:', err)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}