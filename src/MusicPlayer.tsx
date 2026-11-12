import { useCallback, useEffect, useRef, useState } from "react"

const VIDEO_ID = "GkjbHYi1dqQ"
const TRACK_START_TIME = 40
const STORAGE_KEY = `great-books-music-player-${VIDEO_ID}`

type YouTubePlayer = {
  destroy: () => void
  getCurrentTime: () => number
  pauseVideo: () => void
  playVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
}

type YouTubePlayerStateChangeEvent = {
  data: number
  target: YouTubePlayer
}

type YouTubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string
      playerVars: Record<string, number | string>
      events: {
        onReady: (event: { target: YouTubePlayer }) => void
        onStateChange: (event: YouTubePlayerStateChangeEvent) => void
      }
    },
  ) => YouTubePlayer
  PlayerState: {
    ENDED: number
    PAUSED: number
    PLAYING: number
  }
}

declare global {
  interface Window {
    YT?: YouTubeNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let youtubeApiPromise: Promise<YouTubeNamespace> | undefined

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (youtubeApiPromise) return youtubeApiPromise

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.()
      if (window.YT) resolve(window.YT)
    }

    const existingScript = document.getElementById("youtube-iframe-api")
    if (existingScript) return

    const script = document.createElement("script")
    script.id = "youtube-iframe-api"
    script.src = "https://www.youtube.com/iframe_api"
    script.async = true
    script.onerror = () => reject(new Error("Unable to load YouTube player"))
    document.head.appendChild(script)
  })

  return youtubeApiPromise
}

function readSavedPosition() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")
    return typeof saved.position === "number"
      ? Math.max(TRACK_START_TIME, saved.position)
      : TRACK_START_TIME
  } catch {
    return TRACK_START_TIME
  }
}

function DiscIcon({ playing }: { playing: boolean }) {
  return (
    <svg
      className={`music-disc ${playing ? "is-playing" : ""}`}
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <circle className="vinyl-disc" cx="20" cy="20" r="18" />
      <circle className="vinyl-groove" cx="20" cy="20" r="14.5" />
      <circle className="vinyl-groove" cx="20" cy="20" r="11.5" />
      <circle className="vinyl-groove" cx="20" cy="20" r="8.5" />
      <path className="vinyl-highlight" d="M8.8 9.5A15.5 15.5 0 0 1 20 4.5" />
      <circle className="vinyl-label" cx="20" cy="20" r="6" />
      <circle className="vinyl-label-mark" cx="22.2" cy="17.8" r="1.2" />
      <circle className="vinyl-spindle" cx="20" cy="20" r="1.8" />
    </svg>
  )
}

function PlaybackIcon({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {playing ? (
        <>
          <path d="M8 6v12M16 6v12" />
        </>
      ) : (
        <path d="m9 6 9 6-9 6Z" />
      )}
    </svg>
  )
}

export default function MusicPlayer({ ready = true }: { ready?: boolean }) {
  const playerHostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayer | undefined>(undefined)
  const pendingPlayRef = useRef(false)
  const playingRef = useRef(false)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isIntroduced, setIsIntroduced] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [activityVersion, setActivityVersion] = useState(0)
  const autoplayTriedRef = useRef(false)

  const savePosition = useCallback(() => {
    const player = playerRef.current
    if (!player) return

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          position: player.getCurrentTime(),
          playing: playingRef.current,
        }),
      )
    } catch {
      // Playback still works when storage is unavailable.
    }
  }, [])

  const revealPlayer = useCallback(() => {
    setIsIntroduced(true)
    setIsExpanded(true)
    setActivityVersion((version) => version + 1)
  }, [])

  useEffect(() => {
    playingRef.current = isPlaying
  }, [isPlaying])

  // Open the pill when the intro ends
  useEffect(() => {
    if (ready) revealPlayer()
  }, [ready, revealPlayer])

  // Try to start music once, when both the intro and the player are ready
  useEffect(() => {
    if (!ready || !isReady || autoplayTriedRef.current) return
    autoplayTriedRef.current = true
    playerRef.current?.playVideo()
  }, [ready, isReady])

  useEffect(() => {
    let cancelled = false

    loadYouTubeApi()
      .then((youtube) => {
        if (cancelled || !playerHostRef.current) return

        const player = new youtube.Player(playerHostRef.current, {
          videoId: VIDEO_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            playlist: VIDEO_ID,
            playsinline: 1,
            rel: 0,
            start: TRACK_START_TIME,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              const savedPosition = readSavedPosition()
              playerRef.current = event.target
              event.target.seekTo(savedPosition, true)
              setIsReady(true)

              if (pendingPlayRef.current) {
                pendingPlayRef.current = false
                event.target.playVideo()
              }
            },
            onStateChange: (event) => {
              if (event.data === youtube.PlayerState.ENDED) {
                event.target.seekTo(TRACK_START_TIME, true)
                event.target.playVideo()
                return
              }

              const playing = event.data === youtube.PlayerState.PLAYING
              setIsPlaying(playing)
              playingRef.current = playing

              if (event.data === youtube.PlayerState.PAUSED) {
                savePosition()
              }
            },
          },
        })

        playerRef.current = player
      })
      .catch(() => setIsReady(false))

    return () => {
      cancelled = true
      savePosition()
      playerRef.current?.destroy()
      playerRef.current = undefined
    }
  }, [savePosition])

  useEffect(() => {
    if (!isIntroduced || !isExpanded || isPlaying || isHovered || isFocused) {
      return
    }

    const retractTimer = window.setTimeout(() => setIsExpanded(false), 8000)
    return () => window.clearTimeout(retractTimer)
  }, [
    activityVersion,
    isExpanded,
    isFocused,
    isHovered,
    isIntroduced,
    isPlaying,
  ])

  useEffect(() => {
    if (!isPlaying) return

    const positionTimer = window.setInterval(savePosition, 1000)
    return () => window.clearInterval(positionTimer)
  }, [isPlaying, savePosition])

  useEffect(() => {
    window.addEventListener("pagehide", savePosition)
    return () => window.removeEventListener("pagehide", savePosition)
  }, [savePosition])

  const togglePlayback = () => {
    revealPlayer()

    if (!isReady || !playerRef.current) {
      pendingPlayRef.current = true
      return
    }

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const handlePlaybackKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    togglePlayback()
  }

  return (
    <div
      className={`music-player-shell ${isIntroduced ? "is-introduced" : ""} ${
        isExpanded ? "is-expanded" : "is-collapsed"
      }`}
    >
      <div className="music-player-youtube" aria-hidden="true">
        <div ref={playerHostRef} />
      </div>

      <div
        className="music-player-tab"
        role="button"
        tabIndex={isExpanded ? -1 : 0}
        aria-label="Open music player"
        onPointerEnter={revealPlayer}
        onPointerDown={revealPlayer}
        onFocus={() => {
          setIsFocused(true)
          revealPlayer()
        }}
        onBlur={() => {
          setIsFocused(false)
          setActivityVersion((version) => version + 1)
        }}
        onClick={revealPlayer}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return
          event.preventDefault()
          revealPlayer()
        }}
      >
        <DiscIcon playing={isPlaying} />
      </div>

      <div
        className="music-player-pill"
        role="group"
        aria-label="Music player"
        onPointerEnter={() => {
          setIsHovered(true)
          revealPlayer()
        }}
        onPointerLeave={() => {
          setIsHovered(false)
          setActivityVersion((version) => version + 1)
        }}
        onPointerDown={revealPlayer}
        onFocusCapture={() => {
          setIsFocused(true)
          revealPlayer()
        }}
        onBlurCapture={(event) => {
          if (event.currentTarget.contains(event.relatedTarget)) return
          setIsFocused(false)
          setActivityVersion((version) => version + 1)
        }}
      >
        <DiscIcon playing={isPlaying} />
        <div className="music-player-copy">
          <div className="music-player-title">Mice on Venus</div>
          <div className="music-player-artist">C418</div>
        </div>
        <div
          className="music-player-control"
          role="button"
          tabIndex={0}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          aria-disabled={!isReady}
          onClick={togglePlayback}
          onKeyDown={handlePlaybackKeyDown}
        >
          <PlaybackIcon playing={isPlaying} />
        </div>
      </div>
    </div>
  )
}
