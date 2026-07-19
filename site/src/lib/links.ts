// Set VITE_CHROME_WEB_STORE_URL in Vercel once the listing is published; until then the
// primary button falls back to the GitHub release so it is never a dead end.
const storeUrl = import.meta.env.VITE_CHROME_WEB_STORE_URL?.trim() || null

export const links = {
  github: "https://github.com/xkelxmc/makes-mistakes",
  releases: "https://github.com/xkelxmc/makes-mistakes/releases/latest",
  issues: "https://github.com/xkelxmc/makes-mistakes/issues",
  chromeWebStore: storeUrl,
  install: storeUrl ?? "https://github.com/xkelxmc/makes-mistakes/releases/latest",
}

export const site = {
  name: "Makes Mistakes",
  tagline: "They don't can make mistakes. They make them.",
  url: "https://makes-mistakes-theta.vercel.app",
}
