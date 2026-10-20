export type Point = readonly [x: number, y: number]

export interface SatinOptions {
  /** Number of needle points (stitches = points - 1). */
  points: number
  /** Radius of the column's centre line. */
  radius: number
  /** Column width at its widest; it tapers towards both ends. */
  width: number
  /** Start and end angle in radians. The default leaves the opening of a "C" on the right. */
  from?: number
  to?: number
}

/**
 * Needle points for a satin-stitch column bent into an arc, like a digitised "C".
 * The needle alternates between the inner and outer edge, so consecutive points form the stitches.
 * Coordinates are centred on (0, 0) with y pointing up.
 */
export function satinArc({
  points,
  radius,
  width,
  from = Math.PI / 4,
  to = (Math.PI * 7) / 4,
}: SatinOptions): Point[] {
  if (points < 2) throw new RangeError('A satin column needs at least two needle points')

  return Array.from({ length: points }, (_, i) => {
    const t = i / (points - 1)
    const angle = from + t * (to - from)
    // Thin at the ends, full width in the middle.
    const w = width * (0.28 + 0.72 * Math.sqrt(Math.sin(Math.PI * t)))
    const r = i % 2 ? radius + w / 2 : radius - w / 2
    return [Math.cos(angle) * r, Math.sin(angle) * r] as const
  })
}

/** SVG `points` attribute for a polyline through the needle points (y flipped for screen space). */
export function toSvgPoints(points: readonly Point[]): string {
  return points.map(([x, y]) => `${+x.toFixed(3)},${+(-y).toFixed(3)}`).join(' ')
}
