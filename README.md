# Makes Mistakes

A joke Chrome extension for chatgpt.com and claude.ai. It removes the hedge from the
footer disclaimer and gives you a one-click way to express your disappointment.

## What it does

- **Rewrites the disclaimer** — "ChatGPT can make mistakes." becomes
  "ChatGPT makes mistakes. Check important info. 🤡", rendered bold with a slow gold
  shimmer that sweeps across it once every few seconds.
- **Adds an "Improve answer" button** above the composer — one click appends
  `YOU'RE WRONG. DOUBLE-CHECK THE INFORMATION. DON'T LIE TO ME!` to your prompt. It
  pulses gold once when it first shows up.

Works on `chatgpt.com`, `chat.openai.com` and `claude.ai`.

## Settings

Click the extension icon. One switch: **Flash the button once when it appears** — turn
it off if the arrival pulse annoys you.

## Build

```bash
bun run build
```

Produces a clean copy in `dist/makes-mistakes/` (manifest + `src/` only, no configs or
`node_modules`) and zips it as `dist/makes-mistakes-<version>.zip` for sharing or the
Web Store.

## Install (unpacked)

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. **Load unpacked** → pick `dist/makes-mistakes` (or the repo root — same thing).
4. Reload any open ChatGPT / Claude tab.

Chrome cannot install a `.zip` directly — whoever receives it unzips first, then loads
the resulting folder unpacked.

## Stack

Plain MV3 content script — no build step, no framework, no bundler. Load the folder
as-is. [oxlint](https://oxc.rs) + [oxfmt](https://oxc.rs) keep it tidy:

```bash
bun run check:fix
```

## Layout

```
manifest.json     MV3 manifest, content script registration
src/content.js    disclaimer rewrite + composer button
src/content.css   gold shimmer + button styling
```
