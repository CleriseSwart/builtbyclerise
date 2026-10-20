/// <reference types="vite/client" />

// Only VITE_* variables reach the browser bundle. Declared here so `import.meta.env` is typed.
interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
