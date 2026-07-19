import { useEffect, useRef, useState } from "react"
import { RotateCcw, Zap } from "lucide-react"
import { models, nudge } from "@/lib/models"

// Matches the slap-flick keyframes: the hand connects ~0.76s in, the text is knocked
// aside first and only swaps on the rebound.
const KNOCK_AT = 760
const SWAP_AT = 900
const DONE_AT = 1500
const REVEAL_AT = SWAP_AT + 260

const MODEL_EVERY = 3600
const TYPE_EVERY = 18

export function ChatMock() {
  const root = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const autoplayed = useRef(false)
  const [swinging, setSwinging] = useState(false)
  const [knocked, setKnocked] = useState(false)
  const [fixed, setFixed] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [model, setModel] = useState(0)
  const [typed, setTyped] = useState("")

  const shown = models[model % models.length]

  function play() {
    timers.current.forEach(clearTimeout)
    setFixed(false)
    setKnocked(false)
    setRevealed(false)
    setTyped("")
    setSwinging(true)
    timers.current = [
      window.setTimeout(() => setKnocked(true), KNOCK_AT),
      window.setTimeout(() => setFixed(true), SWAP_AT),
      window.setTimeout(() => setSwinging(false), DONE_AT),
      window.setTimeout(() => setRevealed(true), REVEAL_AT),
    ]
  }

  // Types the nudge in character by character, the way it lands in a real composer.
  function improve() {
    let count = 0
    const type = window.setInterval(() => {
      count += 1
      setTyped(nudge.slice(0, count))
      if (count >= nudge.length) window.clearInterval(type)
    }, TYPE_EVERY)
    timers.current.push(type)
  }

  useEffect(() => {
    const interval = window.setInterval(() => setModel((m) => m + 1), MODEL_EVERY)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const node = root.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || autoplayed.current) return
        autoplayed.current = true
        play()
        observer.disconnect()
      },
      { threshold: 0.6 }
    )
    observer.observe(node)

    return () => {
      observer.disconnect()
      timers.current.forEach(clearTimeout)
    }
  }, [])

  return (
    <div
      ref={root}
      className="grain relative overflow-hidden rounded-2xl border border-white/5 bg-black/60 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:p-7"
    >
      <div className="relative mx-auto flex max-w-lg flex-col gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={improve}
            className={`border-gold/40 bg-gold/10 text-gold-lit hover:bg-gold/20 absolute start-3 -top-3 z-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] leading-none font-semibold tracking-wide backdrop-blur transition-all duration-500 ${
              revealed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
            }`}
          >
            <Zap className="size-3.5" aria-hidden />
            Improve answer
          </button>

          <div className="min-h-[58px] rounded-[22px] border border-white/8 bg-[#191919] px-4 pt-6 pb-4 text-sm">
            {typed ? (
              <span className="text-white/85">
                {typed}
                <span className="ml-px inline-block h-[1.1em] w-px translate-y-[0.15em] bg-white/60" />
              </span>
            ) : (
              <span className="text-white/35">Ask {shown}</span>
            )}
          </div>
        </div>

        <div className="relative flex min-h-12 items-center justify-center">
          <span
            aria-hidden
            className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 text-4xl select-none ${
              swinging ? "slap-approach" : "opacity-0"
            }`}
          >
            <span className={swinging ? "slap-flick" : undefined}>✋</span>
          </span>

          {/* Plain swap rather than a flip: the gold fill paints its children transparent,
              and stacking flip layers inside it fights that. */}
          {fixed ? (
            <span className="impact">
              <p className="gilded sweep text-center text-[13px] font-bold text-white">
                {shown} makes mistakes. Check important info.
                <span className="[color:initial] [-webkit-text-fill-color:initial]"> 🤡</span>
              </p>
            </span>
          ) : (
            <p className={`text-center text-[13px] text-white/45 ${knocked ? "knocked" : ""}`}>
              {shown} can make mistakes. Check important info.
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={play}
        className="text-muted-foreground hover:text-gold absolute end-4 bottom-3 inline-flex items-center gap-1.5 text-[11px] transition-colors"
      >
        <RotateCcw className="size-3" aria-hidden />
        Replay
      </button>
    </div>
  )
}
