import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  CylinderGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  QuadraticBezierCurve3,
  RepeatWrapping,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector3,
} from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

import type { Stitch } from './stitchPath'

// The Three.js objects for the hero: a hoop with fabric on a frame that slides under a fixed machine
// head. All stitches of one kind are merged into a single mesh; showing "n stitches" is just a draw
// range, so the whole monogram costs two draw calls.

/** Hoop size relative to the machine bed. */
export const FRAME_SCALE = 1.22
/** Resting tilt of the machine bed towards the viewer (radians). */
export const BASE_TILT = -0.95

const COLOURS = {
  fabric: '#18213a',
  hoop: '#d8cfc0',
  steel: '#c4cad6',
  head: '#2b3550',
  fog: '#a3acc4',
}

function fabricTexture(): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = COLOURS.fabric
  ctx.fillRect(0, 0, 512, 512)
  // A loose weave: faint light weft, darker warp.
  for (let i = 0; i < 512; i += 3) {
    ctx.fillStyle = `rgba(255,255,255,${0.02 + Math.random() * 0.035})`
    ctx.fillRect(0, i, 512, 1)
    ctx.fillStyle = `rgba(0,0,0,${0.08 + Math.random() * 0.1})`
    ctx.fillRect(i, 0, 1, 512)
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.repeat.set(3, 3)
  return texture
}

function stitchGeometry(stitch: Stitch): BufferGeometry {
  const lift = stitch.kind === 'satin' ? 0.05 : 0.025
  const radius = stitch.kind === 'satin' ? 0.026 : 0.018
  const from = new Vector3(stitch.from[0], stitch.from[1], 0.03)
  const to = new Vector3(stitch.to[0], stitch.to[1], 0.03)
  const mid = from.clone().add(to).multiplyScalar(0.5)
  mid.z += lift
  return new TubeGeometry(new QuadraticBezierCurve3(from, mid, to), 8, radius, 6, false)
}

/** One mesh for a run of stitches, plus the index count after each stitch (for draw ranges). */
function mergedStitches(stitches: Stitch[], material: MeshStandardMaterial) {
  const parts = stitches.map(stitchGeometry)
  const offsets = [0]
  for (const part of parts) offsets.push(offsets.at(-1)! + part.index!.count)
  const geometry = mergeGeometries(parts)!
  parts.forEach((p) => p.dispose())
  const mesh = new Mesh(geometry, material)
  geometry.setDrawRange(0, 0)
  return { mesh, offsets }
}

const vertical = <T extends Mesh>(mesh: T, z: number): T => {
  mesh.rotation.x = Math.PI / 2
  mesh.position.z = z
  return mesh
}

export function buildMachine(stitches: Stitch[]) {
  const tilt = new Group()
  tilt.rotation.x = BASE_TILT
  const bed = new Group()
  bed.scale.setScalar(0.72)
  tilt.add(bed)

  // Frame: fabric, two hoop rings, clamp screw, bracket. This is what moves.
  const frame = new Group()
  frame.scale.setScalar(FRAME_SCALE)
  bed.add(frame)

  const texture = fabricTexture()
  const hoopMat = new MeshStandardMaterial({ color: COLOURS.hoop, roughness: 0.5 })
  const steel = new MeshStandardMaterial({ color: COLOURS.steel, metalness: 0.85, roughness: 0.3 })
  const headMat = new MeshStandardMaterial({ color: COLOURS.head, roughness: 0.45 })
  const threadMat = new MeshStandardMaterial({ roughness: 0.36, metalness: 0.05 })
  const fogMat = new MeshStandardMaterial({ color: COLOURS.fog, roughness: 0.6 })
  const lineMat = new LineBasicMaterial()

  frame.add(
    new Mesh(
      new CircleGeometry(2.08, 96),
      new MeshStandardMaterial({ map: texture, roughness: 1 }),
    ),
  )
  for (const [radius, tube] of [
    [2.1, 0.07],
    [2.24, 0.075],
  ] as const) {
    const ring = new Mesh(new TorusGeometry(radius, tube, 16, 140), hoopMat)
    ring.position.z = 0.02
    frame.add(ring)
  }
  const clamp = new Mesh(new BoxGeometry(0.42, 0.26, 0.18), hoopMat)
  clamp.position.set(-2.36, 0, 0.02)
  clamp.rotation.z = Math.PI / 2
  const screw = new Mesh(new CylinderGeometry(0.05, 0.05, 0.7, 12), steel)
  screw.position.set(-2.36, 0, 0.02)
  const bracket = new Mesh(new BoxGeometry(1.6, 0.5, 0.08), hoopMat)
  bracket.position.set(0, -2.55, 0.03)
  frame.add(clamp, screw, bracket)

  const satin = mergedStitches(
    stitches.filter((s) => s.kind === 'satin'),
    threadMat,
  )
  const running = mergedStitches(
    stitches.filter((s) => s.kind === 'running'),
    fogMat,
  )
  frame.add(satin.mesh, running.mesh)
  const satinCount = satin.offsets.length - 1

  // Head: fixed over the origin. Needle bar, needle, presser foot, and the thread going up.
  const head = new Group()
  head.scale.setScalar(0.6)
  bed.add(head)
  const housing = new Mesh(new BoxGeometry(1.5, 1.0, 1.7), headMat)
  housing.position.z = 3.6
  const nose = vertical(new Mesh(new CylinderGeometry(0.28, 0.34, 0.5, 24), headMat), 2.55)
  const needleBar = new Group()
  needleBar.add(
    vertical(new Mesh(new CylinderGeometry(0.05, 0.05, 1.6, 12), steel), 1.55),
    vertical(new Mesh(new CylinderGeometry(0.018, 0.004, 0.75, 8), steel), 0.4),
  )
  const foot = new Mesh(new TorusGeometry(0.14, 0.022, 8, 24), steel)
  foot.position.z = 0.08
  const footRod = vertical(new Mesh(new CylinderGeometry(0.02, 0.02, 2.2, 8), steel), 1.2)
  footRod.position.x = 0.14
  const threadGeometry = new BufferGeometry().setFromPoints([new Vector3(), new Vector3()])
  head.add(housing, nose, needleBar, foot, footRod, new Line(threadGeometry, lineMat))

  return {
    root: tilt,

    setThreadColour(hex: string) {
      const colour = new Color(hex)
      threadMat.color.copy(colour)
      lineMat.color.copy(colour)
    },

    /** Show the first `n` stitches (satin first, then running stitch). */
    showStitches(n: number) {
      const s = Math.min(n, satinCount)
      satin.mesh.geometry.setDrawRange(0, satin.offsets[s]!)
      running.mesh.geometry.setDrawRange(0, running.offsets[Math.max(0, n - satinCount)]!)
    },

    /** Place the moving parts: frame offset, needle height (0-1) and head lift (0-1). */
    pose(frameX: number, frameY: number, needle: number, headLift: number) {
      frame.position.set(frameX, frameY, 0)
      needleBar.position.z = needle * 0.42
      head.position.z = headLift * 0.9
      const thread = threadGeometry.attributes.position!
      thread.setXYZ(0, 0, 0, 0.78 + needleBar.position.z)
      thread.setXYZ(1, 0.1, 0, 3.1)
      thread.needsUpdate = true
    },

    /** Lean the machine towards the pointer (-1..1 on both axes); `ease` is 0-1 per frame. */
    lean(x: number, y: number, ease: number) {
      tilt.rotation.y += (x * 0.3 - tilt.rotation.y) * ease
      tilt.rotation.x += (BASE_TILT + y * 0.12 - tilt.rotation.x) * ease
    },

    dispose() {
      tilt.traverse((object) => {
        if (object instanceof Mesh || object instanceof Line) object.geometry.dispose()
      })
      for (const material of [hoopMat, steel, headMat, threadMat, fogMat, lineMat]) {
        material.dispose()
      }
      texture.dispose()
    },
  }
}

export type Machine = ReturnType<typeof buildMachine>
