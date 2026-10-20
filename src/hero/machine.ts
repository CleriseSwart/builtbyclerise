import type { Point } from '@/utils/satin'

// The embroidery machine's behaviour as plain state, so it can be tested without WebGL.
// The needle head stays over the origin; the hoop frame moves so the next needle point sits under it.
// Once every stitch is in, the head lifts away and the frame eases back to the centre.

export interface MachineState {
  /** Stitches sewn so far, fractional: the fraction is the needle's progress through one stroke. */
  progress: number
  frameX: number
  frameY: number
  /** 0 = head down on the fabric, 1 = lifted away. */
  headLift: number
}

export interface MachinePlan {
  /** End point of every stitch, in order, already scaled to frame units. */
  ends: readonly Point[]
  /** The first `satinCount` stitches are satin, the rest running stitch. */
  satinCount: number
  reducedMotion: boolean
}

/** Stitches per second. Real machines are faster; this pace is meant to be watched. */
export const RATE = { satin: 22, running: 40 } as const

// Per-frame easing factors (tuned at 60 fps) made frame-rate independent below.
const FOLLOW = 0.45
const SETTLE = 0.06
const LIFT = 0.04

const ease = (k: number, dt: number) => 1 - Math.pow(1 - k, dt * 60)

export function initialState(plan: MachinePlan): MachineState {
  return restart({ progress: 0, frameX: 0, frameY: 0, headLift: 0 }, plan)
}

/** Start sewing again from the first stitch (or show the finished piece when motion is reduced). */
export function restart(state: MachineState, plan: MachinePlan): MachineState {
  return { ...state, progress: plan.reducedMotion ? plan.ends.length : 0 }
}

export function stitchesShown(state: MachineState, plan: MachinePlan): number {
  return Math.min(plan.ends.length, Math.floor(state.progress))
}

export function isSewing(state: MachineState, plan: MachinePlan): boolean {
  return stitchesShown(state, plan) < plan.ends.length
}

/** Needle height in one stroke: 1 at the top, 0 through the fabric. Parked at the top when idle. */
export function needleHeight(state: MachineState, plan: MachinePlan): number {
  if (!isSewing(state, plan) || plan.reducedMotion) return 1
  return 0.5 + 0.5 * Math.cos((state.progress % 1) * Math.PI * 2)
}

/** Advance the machine by `dt` seconds. */
export function advance(state: MachineState, dt: number, plan: MachinePlan): MachineState {
  const total = plan.ends.length
  let { progress } = state
  if (progress < total) progress += dt * (progress < plan.satinCount ? RATE.satin : RATE.running)
  const next = { ...state, progress: Math.min(progress, total) }

  const shown = stitchesShown(next, plan)
  const sewing = shown < total
  const end = sewing ? plan.ends[Math.max(0, shown - 1)]! : null
  const k = plan.reducedMotion ? 1 : ease(sewing ? FOLLOW : SETTLE, dt)
  next.frameX += ((end ? -end[0] : 0) - next.frameX) * k
  next.frameY += ((end ? -end[1] : 0) - next.frameY) * k
  next.headLift += ((sewing ? 0 : 1) - next.headLift) * (plan.reducedMotion ? 1 : ease(LIFT, dt))
  return next
}
