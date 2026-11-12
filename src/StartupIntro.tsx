import { useCallback, useEffect, useRef, useState } from "react"

const INTRO_STORAGE_KEY = "great-books-startup-intro"
const STANDARD_INTRO_DURATION = 25100
let introDecision: boolean | undefined

export function shouldPlayStartupIntro() {
  if (introDecision !== undefined) return introDecision

  try {
    const hasPlayed = sessionStorage.getItem(INTRO_STORAGE_KEY) === "played"
    if (!hasPlayed) {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "played")
    }
    introDecision = !hasPlayed
  } catch {
    introDecision = true
  }

  return introDecision
}

export default function StartupIntro({
  onComplete,
}: {
  onComplete: () => void
}) {
  const skipRef = useRef<HTMLDivElement>(null)
  const completionTimerRef = useRef<number | undefined>(undefined)
  const hasFinishedRef = useRef(false)
  const [isExiting, setIsExiting] = useState(false)
  const [prefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  const finishIntro = useCallback(() => {
    if (hasFinishedRef.current) return
    hasFinishedRef.current = true
    window.clearTimeout(completionTimerRef.current)

    if (prefersReducedMotion) {
      onComplete()
      return
    }

    setIsExiting(true)
    completionTimerRef.current = window.setTimeout(onComplete, 220)
  }, [onComplete, prefersReducedMotion])

  useEffect(() => {
    const documentElementOverflow = document.documentElement.style.overflow
    const bodyOverflow = document.body.style.overflow

    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    skipRef.current?.focus({ preventScroll: true })

    completionTimerRef.current = window.setTimeout(
      onComplete,
      prefersReducedMotion ? 2000 : STANDARD_INTRO_DURATION,
    )

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") finishIntro()
    }

    window.addEventListener("keydown", handleEscape)
    return () => {
      window.clearTimeout(completionTimerRef.current)
      window.removeEventListener("keydown", handleEscape)
      document.documentElement.style.overflow = documentElementOverflow
      document.body.style.overflow = bodyOverflow
    }
  }, [finishIntro, onComplete, prefersReducedMotion])

  return (
    <div
      className={`startup-intro ${
        prefersReducedMotion ? "is-reduced" : "is-standard"
      } ${isExiting ? "is-exiting" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio introduction"
      onClick={finishIntro}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          event.preventDefault()
          skipRef.current?.focus()
        }
      }}
    >
      <div className="startup-content">
        <div className="startup-opening">
          <div className="startup-title">Voyages Through the Great Books</div>
          <div className="startup-subline">Seven works. Seven voyages.</div>
        </div>

        <div className="startup-quote">
          <div className="startup-quote-line startup-quote-line-one">
            Twenty years from now you will be more disappointed by the things
            you didn&apos;t do than by the ones you did do.
          </div>
          <div className="startup-quote-line startup-quote-line-two">
            So throw off the bowlines. Sail away from the safe harbor. Catch the
            trade winds in your sails.
          </div>
          <div
            className="startup-gold-words"
            aria-label="Explore. Dream. Discover."
          >
            <span className="startup-word-one">Explore.</span>
            <span className="startup-word-two">Dream.</span>
            <span className="startup-word-three">Discover.</span>
          </div>
          <div className="startup-credit">
            — H. Jackson Brown Jr., P.S. I Love You (1990)
          </div>
        </div>
      </div>

      <div
        ref={skipRef}
        className="startup-skip"
        role="button"
        tabIndex={0}
        aria-label="Skip introduction"
        onClick={(event) => {
          event.stopPropagation()
          finishIntro()
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return
          event.preventDefault()
          event.stopPropagation()
          finishIntro()
        }}
      >
        Skip
      </div>
    </div>
  )
}
