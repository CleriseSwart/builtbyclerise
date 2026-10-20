import { type Point, satinArc } from '@/utils/satin'

// The monogram as an embroidery machine would sew it: a satin-stitch "C", then a running stitch
// around it. Units are hoop units (the inner hoop ring has a radius of 2.1).

export interface Stitch {
  from: Point
  to: Point
  kind: 'satin' | 'running'
}

export const SATIN = { points: 151, radius: 1.15, width: 0.42 } as const
export const RUNNING = { count: 60, radius: 1.78, length: 0.6 } as const

export function monogramStitches(): Stitch[] {
  const satin = satinArc(SATIN)
  const stitches: Stitch[] = satin
    .slice(1)
    .map((to, i) => ({ from: satin[i]!, to, kind: 'satin' as const }))

  const step = (Math.PI * 2) / RUNNING.count
  for (let i = 0; i < RUNNING.count; i++) {
    const a = i * step
    const b = a + RUNNING.length * step
    stitches.push({
      from: [Math.cos(a) * RUNNING.radius, Math.sin(a) * RUNNING.radius],
      to: [Math.cos(b) * RUNNING.radius, Math.sin(b) * RUNNING.radius],
      kind: 'running',
    })
  }
  return stitches
}
