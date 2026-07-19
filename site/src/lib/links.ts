// Set VITE_CHROME_WEB_STORE_URL in Vercel once the listing is published; until then the
// primary button falls back to the GitHub release so it is never a dead end.
const storeUrl = import.meta.env.VITE_CHROME_WEB_STORE_URL?.trim() || null

// Point VITE_WISHLIST_URL at a real form (Tally, Google Forms, …) when there is one;
// until then it lands on a prefilled GitHub issue, which at least works.
const wishlistUrl =
  import.meta.env.VITE_WISHLIST_URL?.trim() ||
  "https://github.com/xkelxmc/makes-mistakes/issues/new?labels=wishlist&title=Wishlist%3A+&body=Which+button+do+you+want+most%3F"

// Kit's public form endpoint takes no API key — the form id is not a secret, and Kit
// handles double opt-in and spam filtering on their side.
const kitFormId = import.meta.env.VITE_KIT_FORM_ID?.trim()

export const links = {
  github: "https://github.com/xkelxmc/makes-mistakes",
  releases: "https://github.com/xkelxmc/makes-mistakes/releases/latest",
  // Resolves to the newest release's asset — the build publishes a version-less copy
  // precisely so this stays valid.
  zip: "https://github.com/xkelxmc/makes-mistakes/releases/latest/download/makes-mistakes.zip",
  issues: "https://github.com/xkelxmc/makes-mistakes/issues",
  chromeWebStore: storeUrl,
  install: storeUrl ?? "https://github.com/xkelxmc/makes-mistakes/releases/latest",
  wishlist: wishlistUrl,
  suggest:
    "https://github.com/xkelxmc/makes-mistakes/issues/new?labels=feature&title=Feature%3A+&body=What+should+the+extension+do%3F",
  kitFormAction: kitFormId ? `https://app.kit.com/forms/${kitFormId}/subscriptions` : null,
}

export const site = {
  name: "Makes Mistakes",
  tagline: "ChatGPT makes mistakes. The footer finally admits it.",
  url: "https://ai-mistakes.org",
}
