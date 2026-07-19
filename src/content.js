// Claude words it as "Claude is AI and can make mistakes."
const DISCLAIMER = /\b(ChatGPT|Claude)\b(?:\s+is\s+AI\s+and)?\s+can\s+make\s+mistakes\./i
const CLOWN = "\u{1F921}"
const GILDED = "mm-gilded"
const CLOWN_CLASS = "mm-clown"

const NUDGE = "YOU'RE WRONG. DOUBLE-CHECK THE INFORMATION. DON'T LIE TO ME!"
const COMPOSER =
  '#prompt-textarea, div[contenteditable="true"].ProseMirror, textarea[data-testid="chat-input"]'

// lucide "zap"
const ZAP =
  "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"

function gild(textNode) {
  const text = textNode.nodeValue
  if (!text || !DISCLAIMER.test(text)) return

  const parent = textNode.parentElement
  if (!parent) return

  textNode.nodeValue = text.replace(DISCLAIMER, "$1 makes mistakes.").trimEnd()
  parent.classList.add(GILDED)

  // The clown lives in its own span: `background-clip: text` would otherwise mask it
  // into a gold silhouette instead of letting it render as an emoji.
  if (parent.querySelector(`.${CLOWN_CLASS}`)) return
  const clown = document.createElement("span")
  clown.className = CLOWN_CLASS
  clown.textContent = ` ${CLOWN}`
  textNode.after(clown)
}

function sweep(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    gild(root)
    return
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const found = []
  while (walker.nextNode()) found.push(walker.currentNode)
  found.forEach(gild)
}

function insertNudge(composer) {
  composer.focus()

  if (composer instanceof HTMLTextAreaElement) {
    const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set
    setValue.call(composer, composer.value ? `${composer.value} ${NUDGE}` : NUDGE)
    composer.dispatchEvent(new Event("input", { bubbles: true }))
    return
  }

  // execCommand fires beforeinput/input, which is how ProseMirror learns about the text
  const selection = window.getSelection()
  selection.removeAllRanges()
  const range = document.createRange()
  range.selectNodeContents(composer)
  range.collapse(false)
  selection.addRange(range)
  document.execCommand("insertText", false, composer.textContent.trim() ? ` ${NUDGE}` : NUDGE)
}

function buildButton() {
  const button = document.createElement("button")
  button.type = "button"
  button.className = "mm-button"
  button.title = "Improve answer"
  button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ZAP}"/></svg><span>Improve answer</span>`
  return button
}

const button = buildButton()
let composer = null

button.addEventListener("click", () => {
  if (!composer) return
  insertNudge(composer)
  button.classList.remove("mm-button--fired")
  void button.offsetWidth
  button.classList.add("mm-button--fired")
})

// Anchor to the composer's outer shell, not the editable itself — the editable grows
// upward as you type, which would drag the button down over the input.
function anchorOf(element) {
  return element.closest("form, fieldset") ?? element
}

function place() {
  if (!composer?.isConnected) {
    composer = document.querySelector(COMPOSER)
    if (!composer) {
      button.remove()
      return
    }
  }

  const box = anchorOf(composer).getBoundingClientRect()
  if (box.width === 0) {
    button.remove()
    return
  }

  if (!button.isConnected) document.body.append(button)
  button.style.left = `${box.left}px`
  button.style.top = `${box.top}px`
}

const pending = new Set()
let scheduled = false

function flush() {
  scheduled = false
  const roots = [...pending]
  pending.clear()
  roots.forEach(sweep)
  place()
}

function schedule(node) {
  pending.add(node)
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(flush)
}

sweep(document.body)
place()

// The disclaimer and the composer are re-rendered on every navigation and stream, so watch instead of patching once.
new MutationObserver((records) => {
  for (const record of records) {
    if (record.type === "characterData") schedule(record.target)
    else record.addedNodes.forEach(schedule)
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true })

window.addEventListener("resize", place)
window.addEventListener("scroll", place, true)
