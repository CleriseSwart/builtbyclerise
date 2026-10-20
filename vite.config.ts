import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
// Type-only import: pulls in vite-ssg's `ssgOptions` augmentation of the Vite config.
import type {} from 'vite-ssg'

import { buildSitemap, prerenderPaths } from './src/site.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // vite-ssg prerenders every page in every locale to static HTML (served by Cloudflare Pages).
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    // `flat`: /en/about -> en/about.html, /404 -> 404.html (what Cloudflare Pages expects).
    dirStyle: 'flat',
    includedRoutes: () => [...prerenderPaths(), '/404'],
    onFinished() {
      const outDir = fileURLToPath(new URL('./dist', import.meta.url))
      const today = new Date().toISOString().slice(0, 10)
      writeFileSync(resolve(outDir, 'sitemap.xml'), buildSitemap(today))
    },
  },
})
