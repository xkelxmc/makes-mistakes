import { useEffect, useRef, useState } from "react"

const FIRST = 1500
const HOLD = 2600
const FLIP = 760

/** `at` drives the word from outside, so several flippers can turn in step. */
export function FlipWord({
  words,
  at,
  layerClass = "",
}: {
  words: string[]
  at?: number
  /** Applied to each layer — `.gilded` has to sit on the text itself, not a parent. */
  layerClass?: string
}) {
  const [own, setOwn] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [width, setWidth] = useState<number>()
  const ruler = useRef<HTMLSpanElement>(null)

  const controlled = at !== undefined
  const index = controlled ? at % words.length : own
  const setIndex = setOwn

  const previous = words[(index - 1 + words.length) % words.length]
  const current = controlled && flipping ? previous : words[index]
  const next = controlled ? words[index] : words[(index + 1) % words.length]

  function widthOf(word: string) {
    const node = ruler.current
    if (!node) return
    node.textContent = word
    const measured = node.getBoundingClientRect().width
    node.textContent = ""
    return measured
  }

  useEffect(() => {
    setWidth(widthOf(words[0]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Driven from outside: run the same flip whenever the given index moves on.
  const shown = useRef(index)
  useEffect(() => {
    if (!controlled || shown.current === index) return

    shown.current = index
    setFlipping(true)

    const target = widthOf(words[index])
    const grow = target !== undefined && width !== undefined && target > width
    if (grow) setWidth(target)

    const done = window.setTimeout(() => {
      setFlipping(false)
      if (!grow) setWidth(target)
    }, FLIP)

    return () => window.clearTimeout(done)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, controlled])

  useEffect(() => {
    if (controlled || words.length < 2) return

    let start: number | undefined
    let swap: number | undefined
    let shrink: number | undefined

    const run = () => {
      const target = widthOf(next)
      setFlipping(true)

      // Growing has to happen up front — otherwise the following text is still sitting
      // where the longer word needs to land. Shrinking has to wait until the shorter
      // word is actually on screen, or the text beside it slides in over the old one.
      if (target !== undefined && width !== undefined && target > width) {
        setWidth(target)
      } else {
        shrink = window.setTimeout(() => setWidth(target), FLIP)
      }

      swap = window.setTimeout(() => {
        setIndex((i) => (i + 1) % words.length)
        setFlipping(false)
      }, FLIP)
    }

    start = window.setTimeout(run, index === 0 && width === undefined ? FIRST : HOLD)

    return () => {
      window.clearTimeout(start)
      window.clearTimeout(swap)
      window.clearTimeout(shrink)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words, controlled])

  return (
    <span className="flip" style={width ? { width } : undefined}>
      <span ref={ruler} className="flip__ruler" aria-hidden />

      {/* In the flow, so the box keeps a real text baseline. */}
      <span className="flip__spacer" aria-hidden>
        {current}
      </span>

      <span className={`flip__half flip__half--bottom ${layerClass}`} aria-hidden>
        {current}
      </span>
      <span className={`flip__half flip__half--top ${layerClass}`} aria-hidden>
        {flipping ? next : current}
      </span>

      {flipping && (
        <>
          <span className={`flip__flap flip__flap--top ${layerClass}`} aria-hidden>
            {current}
          </span>
          <span className={`flip__flap flip__flap--bottom ${layerClass}`} aria-hidden>
            {next}
          </span>
        </>
      )}

      <span className="sr-only">{current}</span>
    </span>
  )
}
