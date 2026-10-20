import { describe, expect, it } from 'vitest'

import { satinArc, toSvgPoints } from './satin'

describe('satinArc', () => {
  const points = satinArc({ points: 41, radius: 1, width: 0.5 })

  it('returns one needle point per requested point', () => {
    expect(points).toHaveLength(41)
  })

  it('alternates between the inner and outer edge of the column', () => {
    const radii = points.map(([x, y]) => Math.hypot(x, y))
    radii.forEach((r, i) => {
      if (i % 2) expect(r).toBeGreaterThan(1)
      else expect(r).toBeLessThan(1)
    })
  })

  it('is widest in the middle and tapers towards the ends', () => {
    const width = (i: number) => Math.abs(Math.hypot(...points[i + 1]!) - Math.hypot(...points[i]!))
    expect(width(20)).toBeGreaterThan(width(0))
    expect(width(20)).toBeGreaterThan(width(39))
    expect(width(20)).toBeLessThanOrEqual(0.5 + 1e-9)
  })

  it('leaves the opening of the C on the right', () => {
    // Nothing is stitched in the right-hand wedge between -45deg and +45deg.
    const inOpening = points.filter(([x, y]) => x > 0 && Math.abs(y) < x * 0.99)
    expect(inOpening).toHaveLength(0)
  })

  it('rejects a column without at least two points', () => {
    expect(() => satinArc({ points: 1, radius: 1, width: 0.5 })).toThrow(RangeError)
  })
})

describe('toSvgPoints', () => {
  it('flips y for screen space and rounds to three decimals', () => {
    expect(
      toSvgPoints([
        [0.12345, 1],
        [-1, -0.5],
      ]),
    ).toBe('0.123,-1 -1,0.5')
  })
})
