import { describe, expect, it } from 'vitest'

import {
  advance,
  initialState,
  isSewing,
  type MachinePlan,
  needleHeight,
  RATE,
  restart,
  stitchesShown,
} from './machine'
import { monogramStitches, RUNNING, SATIN } from './stitchPath'

const stitches = monogramStitches()
const plan: MachinePlan = {
  ends: stitches.map((s) => s.to),
  satinCount: stitches.filter((s) => s.kind === 'satin').length,
  reducedMotion: false,
}

/** Run the machine for `seconds` in 60 fps steps. */
function run(seconds: number, from = initialState(plan), p = plan) {
  let state = from
  for (let t = 0; t < seconds; t += 1 / 60) state = advance(state, 1 / 60, p)
  return state
}

describe('monogramStitches', () => {
  it('sews the satin C first, then the running stitch around it', () => {
    expect(plan.satinCount).toBe(SATIN.points - 1)
    expect(stitches).toHaveLength(SATIN.points - 1 + RUNNING.count)
    expect(stitches.findIndex((s) => s.kind === 'running')).toBe(plan.satinCount)
  })

  it('chains satin stitches: each starts where the last one ended', () => {
    for (let i = 1; i < plan.satinCount; i++) expect(stitches[i]!.from).toEqual(stitches[i - 1]!.to)
  })
})

describe('the machine', () => {
  it('starts with nothing sewn and the head down', () => {
    const state = initialState(plan)
    expect(stitchesShown(state, plan)).toBe(0)
    expect(state.headLift).toBe(0)
  })

  it('sews satin at its own pace', () => {
    expect(stitchesShown(run(1), plan)).toBe(RATE.satin)
  })

  it('moves the frame so the last stitch sits under the needle', () => {
    const state = run(2)
    const end = plan.ends[stitchesShown(state, plan) - 1]!
    // The frame chases a moving target, so it trails by about a stitch.
    expect(Math.hypot(state.frameX + end[0], state.frameY + end[1])).toBeLessThan(0.15)
  })

  it('moves the needle once per stitch while sewing', () => {
    expect(needleHeight({ ...initialState(plan), progress: 10 }, plan)).toBeCloseTo(1)
    expect(needleHeight({ ...initialState(plan), progress: 10.5 }, plan)).toBeCloseTo(0)
  })

  it('finishes, parks the needle at the top, lifts the head and centres the frame', () => {
    const state = run(20)
    expect(isSewing(state, plan)).toBe(false)
    expect(needleHeight(state, plan)).toBe(1)
    expect(state.headLift).toBeGreaterThan(0.95)
    expect(Math.hypot(state.frameX, state.frameY)).toBeLessThan(0.01)
  })

  it('starts again from the first stitch on restart', () => {
    expect(stitchesShown(restart(run(20), plan), plan)).toBe(0)
  })

  it('shows the finished piece at once with reduced motion', () => {
    const reduced = { ...plan, reducedMotion: true }
    const state = advance(initialState(reduced), 1 / 60, reduced)
    expect(stitchesShown(state, reduced)).toBe(plan.ends.length)
    expect(state.headLift).toBe(1)
    expect(state.frameX).toBe(0)
  })

  it('does not depend on the frame rate', () => {
    let slow = initialState(plan)
    for (let t = 0; t < 3; t += 1 / 30) slow = advance(slow, 1 / 30, plan)
    const fast = run(3)
    expect(stitchesShown(slow, plan)).toBeCloseTo(stitchesShown(fast, plan), -1)
    expect(slow.frameX).toBeCloseTo(fast.frameX, 0)
  })
})
