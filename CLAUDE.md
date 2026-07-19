# Makes Mistakes

A joke MV3 Chrome extension that rewrites the ChatGPT/Claude footer disclaimer and adds
an "Improve answer" button next to the composer.

## Overview

Two content-script features, injected into `chatgpt.com`, `chat.openai.com` and
`claude.ai`:

1. Every text node matching `<Assistant> can make mistakes.` is rewritten to
   `<Assistant> makes mistakes.`, a 🤡 is appended, and the parent element gets
   `.mm-gilded` (bold + gold shimmer sweep).
2. A fixed-position pill button is anchored above the composer; clicking it appends a
   fixed nudge phrase to the prompt.

## Stack

- **Vanilla MV3** — no build step, no bundler, no framework. The repo folder _is_ the
  extension; `chrome://extensions` → Load unpacked.
- **oxlint + oxfmt** as the toolchain.
- Everything is plain JS and CSS. Do not introduce a bundler, TypeScript, or a UI
  framework — the whole point is that this stays a two-file extension.

## Checks

There is exactly one verification command, run from the repo root:

```bash
bun run check:fix
```

Never run `oxlint` / `oxfmt` directly, and never add a narrower check script.

## Conventions

- **English only** in code, comments, filenames, and commit messages.
- **Read a file fully before editing it.** These files are short; there is no excuse
  for a partial read.
- **Comments explain _why_, not _what_.** If a comment has to describe what the code
  does, rewrite the code instead.
- Class names and CSS variables are prefixed `mm-` / `--mm-` — we are a guest inside
  someone else's DOM and must never collide with the host page.
- **Errors belong where they happen.** Do not wrap the observers in blanket try/catch
  to "make it robust"; if a selector breaks, we want to know.

## Host-page fragility

Both sites are React apps that re-render constantly, so:

- All DOM work is driven by a single `MutationObserver` on `document.body`, debounced
  through `requestAnimationFrame`. Do not add polling intervals.
- Prompt insertion uses `document.execCommand("insertText")` for contenteditable
  composers. It is deprecated but it is the only path that fires the `beforeinput`
  events ProseMirror listens for — setting `textContent` silently loses the text on
  the next render. Do not "modernize" it without verifying in a real tab.
- The composer selector (`COMPOSER` in `src/content.js`) is the most likely thing to
  break when a site ships a redesign. That is the first place to look.
