// Claude words it as "Claude is AI and can make mistakes."
const DISCLAIMER = /\b(ChatGPT|Claude)\b(?:\s+is\s+AI\s+and)?\s+can\s+make\s+mistakes\./i
const CLOWN = "\u{1F921}"
const GILDED = "mm-gilded"
const CLOWN_CLASS = "mm-clown"

const NUDGE = "YOU'RE WRONG. DOUBLE-CHECK THE INFORMATION. DON'T LIE TO ME!"
const COMPOSER = '#prompt-textarea, [contenteditable="true"][data-testid="chat-input"]'

// Both hosts already ship a positioned box above the composer, so the button can ride
// along in their layout instead of being chased with fixed coordinates.
const MOUNTS = [
  { selector: "[data-prompt-textarea-header]", variant: "mm-button--flow" },
  { selector: "[data-chat-input-container]", variant: "mm-button--overlay" },
]

// lucide "zap"
const ZAP =
  "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"

const settings = chrome.storage.sync.get({ flash: true })

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

function insertNudge() {
  const composer = document.querySelector(COMPOSER)
  if (!composer) return

  composer.focus()

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
  const element = document.createElement("button")
  element.type = "button"
  element.className = "mm-button"
  element.title = "Improve answer"
  element.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ZAP}"/></svg><span>Improve answer</span>`
  return element
}

const button = buildButton()
let flashed = false

button.addEventListener("click", () => {
  insertNudge()
  button.classList.remove("mm-button--fired")
  void button.offsetWidth
  button.classList.add("mm-button--fired")
})

async function flashOnce() {
  if (flashed) return
  flashed = true

  const { flash } = await settings
  if (flash) button.classList.add("mm-button--flash")
}

function mount() {
  const target = MOUNTS.map((m) => ({ host: document.querySelector(m.selector), ...m })).find(
    (m) => m.host
  )

  if (!target) {
    button.remove()
    return
  }
  if (button.parentElement === target.host) return

  button.classList.remove("mm-button--flow", "mm-button--overlay")
  button.classList.add(target.variant)
  target.host.prepend(button)
  flashOnce()
}

const pending = new Set()
let scheduled = false

function flush() {
  scheduled = false
  const roots = [...pending]
  pending.clear()
  roots.forEach(sweep)
  mount()
}

function schedule(node) {
  pending.add(node)
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(flush)
}

sweep(document.body)
mount()

// The disclaimer and the composer are re-rendered on every navigation and stream, so watch instead of patching once.
new MutationObserver((records) => {
  for (const record of records) {
    if (record.type === "characterData") schedule(record.target)
    else record.addedNodes.forEach(schedule)
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true })
