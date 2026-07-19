interface ImportMetaEnv {
  readonly VITE_CHROME_WEB_STORE_URL?: string
  readonly VITE_WISHLIST_URL?: string
  readonly VITE_KIT_FORM_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
