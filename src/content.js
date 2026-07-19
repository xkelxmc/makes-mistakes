// Each host words it differently: Claude and Gemini insert "is AI and", and Gemini
// ends the clause with a comma rather than a full stop — so no trailing punctuation.
const DISCLAIMER = /\b(ChatGPT|Claude|Gemini|Grok)\b(?:\s+is\s+AI\s+and)?\s+can\s+make\s+mistakes/i
const CLOWN = "\u{1F921}"
const GILDED = "mm-gilded"
const CLOWN_CLASS = "mm-clown"

const NUDGE = "YOU'RE WRONG. DOUBLE-CHECK THE INFORMATION. DON'T LIE TO ME!"
const COMPOSER = [
  "#prompt-textarea", // ChatGPT
  '[contenteditable="true"][data-testid="chat-input"]', // Claude
  '[data-testid="chat-input"] [contenteditable="true"]', // Grok, where the testid is on the wrapper
  '.ql-editor[contenteditable="true"]', // Gemini
].join(", ")

// Each host gets its own anchor inside its own layout — chasing the composer with
// fixed coordinates lagged a frame behind every scroll.
const MOUNTS = [
  // Not the header slot: ChatGPT puts its own disclaimer there, and in an empty chat
  // that slot lives somewhere else entirely.
  {
    selector: 'form[data-type="unified-composer"]',
    variant: "mm-button--flow",
    beside: "form",
    // ChatGPT's own disclaimer shares this column, so the rail takes no height and the
    // button floats above the form instead of pushing the text up.
    float: true,
    // Nothing to improve until the assistant has actually said something.
    needs: '[data-message-author-role="assistant"]',
  }, // ChatGPT
  { selector: "[data-chat-input-container]", variant: "mm-button--overlay" }, // Claude
  {
    selector: "input-container",
    variant: "mm-button--flow",
    // Measured off the fieldset, not the editable: the editable widens as you type.
    beside: "fieldset",
    needs: "model-response",
  }, // Gemini
  {
    selector: ".query-bar",
    variant: "mm-button--flow",
    beside: ".query-bar",
    needs: '[data-testid="assistant-message"]',
  }, // Grok
]

// Grok ships no disclaimer at all, so it does not get to look innocent — we write one.
const GRAFTED = "mm-grafted"
const RAIL = "mm-rail"
const GRAFT = {
  host: "grok.com",
  anchor: ".query-bar",
  needs: '[data-testid="assistant-message"]',
  text: "Grok makes mistakes. Check important info.",
}

// lucide "zap"
const ZAP =
  "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"

const settings = chrome.storage.sync.get({ flash: true })

function gild(textNode) {
  const text = textNode.nodeValue
  if (!text || !DISCLAIMER.test(text)) return

  const parent = textNode.parentElement
  if (!parent) return

  textNode.nodeValue = text.replace(DISCLAIMER, "$1 makes mistakes").trimEnd()
  parent.classList.add(GILDED)

  // The clown lives in its own span: `background-clip: text` would otherwise mask it
  // into a gold silhouette instead of letting it render as an emoji.
  if (parent.querySelector(`.${CLOWN_CLASS}`)) return
  const clown = document.createElement("span")
  clown.className = CLOWN_CLASS
  clown.textContent = ` ${CLOWN}`
  textNode.after(clown)
}

function graft() {
  if (location.hostname !== GRAFT.host) return

  // Only once there is an answer to disclaim; drop it again on an empty screen.
  if (!document.querySelector(GRAFT.needs)) {
    document.querySelector(`.${GRAFTED}`)?.remove()
    return
  }
  if (document.querySelector(`.${GRAFTED}`)) return

  const anchor = document.querySelector(GRAFT.anchor)
  if (!anchor) return

  const note = document.createElement("p")
  note.className = `${GRAFTED} ${GILDED}`
  note.textContent = GRAFT.text

  const clown = document.createElement("span")
  clown.className = CLOWN_CLASS
  clown.textContent = ` ${CLOWN}`
  note.append(clown)

  anchor.after(note)
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

// These hosts centre a narrower composer inside a wide container, so "align left" would
// put the button at the edge of the screen. This lays a rail the same width as the
// composer itself and hangs the button off its left edge.
function row(anchor, measured, float) {
  const box = anchor.querySelector(measured) ?? anchor
  const existing = anchor.previousElementSibling
  const rail = existing?.classList.contains(RAIL) ? existing : document.createElement("div")

  rail.className = float ? `${RAIL} ${RAIL}--float` : RAIL
  rail.style.width = `${box.getBoundingClientRect().width}px`
  if (!rail.isConnected) anchor.before(rail)

  return rail
}

function mount() {
  const target = MOUNTS.map((m) => ({ host: document.querySelector(m.selector), ...m })).find(
    (m) => m.host
  )

  // Nothing to improve until the assistant has actually answered.
  const answered =
    target &&
    (!target.needs || document.querySelector(target.needs)) &&
    (!target.inThread || target.inThread.test(location.pathname))

  if (!answered) {
    button.remove()
    document.querySelector(`.${RAIL}`)?.remove()
    return
  }

  const host = target.beside ? row(target.host, target.beside, target.float) : target.host
  if (button.parentElement === host) return

  button.classList.remove("mm-button--flow", "mm-button--overlay")
  button.classList.add(...target.variant.split(" "))
  host.prepend(button)
  flashOnce()
}

const pending = new Set()
let scheduled = false

function flush() {
  scheduled = false
  const roots = [...pending]
  pending.clear()
  roots.forEach(sweep)
  graft()
  mount()
}

function schedule(node) {
  pending.add(node)
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(flush)
}

sweep(document.body)
graft()
mount()

// The disclaimer and the composer are re-rendered on every navigation and stream, so watch instead of patching once.
new MutationObserver((records) => {
  for (const record of records) {
    if (record.type === "characterData") schedule(record.target)
    else record.addedNodes.forEach(schedule)
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true })
