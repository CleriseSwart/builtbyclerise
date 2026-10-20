// Fails the build when af.json is missing (or has extra) keys compared to en.json, and when a
// source file uses a literal t('some.key') that neither file defines.
// Usage: node scripts/check-i18n.mjs   (wired into `npm run build` and `npm run i18n:check`)
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const load = (name) => JSON.parse(readFileSync(resolve(root, 'src/i18n', name), 'utf8'))

function flatten(obj, prefix = '', out = new Map()) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) flatten(value, path, out)
    else out.set(path, value)
  }
  return out
}

const en = flatten(load('en.json'))
const af = flatten(load('af.json'))

const missing = [...en.keys()].filter((k) => !af.has(k))
const extra = [...af.keys()].filter((k) => !en.has(k))
const empty = [...af.entries()]
  .filter(([, v]) => typeof v === 'string' && v.trim() === '')
  .map(([k]) => k)
const params = (s) =>
  [...String(s).matchAll(/\{(\w+)\}/g)]
    .map((m) => m[1])
    .sort()
    .join(',')
const placeholderMismatch = [...en.entries()]
  .filter(([k, v]) => typeof v === 'string' && af.has(k) && params(v) !== params(af.get(k)))
  .map(([k]) => k)

// Literal keys used in source: t('a.b.c') / t("a.b.c") / $t('a.b.c'). Template literals are skipped.
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(vue|ts)$/.test(entry)) out.push(full)
  }
  return out
}
const usedMissing = new Set()
const keyPattern = /\b\$?t\(\s*['"]([a-z0-9_.]+)['"]/g
for (const file of walk(resolve(root, 'src'))) {
  const source = readFileSync(file, 'utf8')
  for (const match of source.matchAll(keyPattern)) {
    if (!en.has(match[1]))
      usedMissing.add(`${match[1]}  (${file.replace(root, '').replace(/\\/g, '/')})`)
  }
}

let failed = false
const report = (label, list) => {
  if (list.length) {
    failed = true
    console.error(`\n${label} (${list.length}):\n  ${list.join('\n  ')}`)
  }
}
report('af.json is missing keys', missing)
report('af.json has keys not in en.json', extra)
report('af.json has empty strings', empty)
report('af.json interpolation params differ from en.json', placeholderMismatch)
report('keys used in src/ but not defined in en.json', [...usedMissing].sort())

if (failed) {
  console.error('\ni18n check failed.')
  process.exit(1)
}
console.log(`i18n check passed: ${en.size} keys in en.json and af.json.`)
