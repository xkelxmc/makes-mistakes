# Makes Mistakes 🤡

A joke Chrome extension for chatgpt.com and claude.ai. It removes the hedge from the
footer disclaimer and gives you a one-click way to express your disappointment.

## What it does

- **Rewrites the disclaimer** — "ChatGPT can make mistakes." becomes
  "ChatGPT makes mistakes. Check important info. 🤡", rendered bold with a slow gold
  band that glides across it. Claude's wordier version gets the same treatment.
- **Adds an "Improve answer" button** above the composer — one click appends
  `YOU'RE WRONG. DOUBLE-CHECK THE INFORMATION. DON'T LIE TO ME!` to your prompt.

Works on `chatgpt.com`, `chat.openai.com` and `claude.ai`.

**Landing page:** <https://makes-mistakes-theta.vercel.app>

## Settings

Click the extension icon. One switch: **Flash the button once when it appears** — turn
it off if the arrival pulse annoys you.

## Install (unpacked)

1. [Download `makes-mistakes.zip`](https://github.com/xkelxmc/makes-mistakes/releases/latest/download/makes-mistakes.zip) and unpack it.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. **Load unpacked** → pick the unpacked folder.
4. Reload any open ChatGPT / Claude tab.

Chrome cannot install a `.zip` directly — unpack it first, then load the folder.

## Repo layout

```
manifest.json      MV3 manifest
src/               content script, popup, icons
site/              landing page (TanStack Start, SSR, deployed on Vercel)
scripts/           build + Open Graph image generation
assets/            icon source and the fonts used to draw the OG card
```

The extension itself has **no build step** — the repo root _is_ the extension.

## Commands

```bash
bun run check:fix   # lint + format (oxlint + oxfmt)
bun run build       # dist/makes-mistakes + versioned and version-less zips
bun run dev         # landing page on :9224
bun run dev:portless  # landing page at makes-mistakes.localhost
```

`zip` and `pack` are aliases of `build`. The landing page has its own `check:fix`
inside `site/`, and `python3 scripts/make-og.py` redraws the Open Graph card.

## Releasing

The version in `manifest.json` is the source of truth. Tagging triggers CI, which
verifies the tag matches it, builds the zip, publishes a GitHub release, and — once the
Chrome Web Store secrets are set — uploads and submits the new version.

```bash
git tag v1.1.0 && git push --tags
```

## License

MIT. Not affiliated with OpenAI or Anthropic.
