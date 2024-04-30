import { ReactNode } from 'react'

const defaultSize = 300

export type Anchor =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export function Area({ children, size = defaultSize }: { size?: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  )
}
const squareAnchorMap: Record<Anchor, (size: number) => { x: number; y: number }> = {
  'top-left': () => ({ x: 0, y: 0 }),
  'top-center': (size) => ({ x: 150 - size / 2, y: 0 }),
  'top-right': (size) => ({ x: 300 - size, y: 0 }),
  'center-left': (size) => ({ x: 0, y: 150 - size / 2 }),
  center: (size) => ({ x: 150 - size / 2, y: 150 - size / 2 }),
  'center-right': (size) => ({ x: 300 - size, y: 150 - size / 2 }),
  'bottom-left': (size) => ({ x: 0, y: 300 - size }),
  'bottom-center': (size) => ({ x: 150 - size / 2, y: 300 - size }),
  'bottom-right': (size) => ({ x: 300 - size, y: 300 - size }),
}
export function Square({ percentage, anchor }: { percentage: number; anchor?: Anchor }) {
  const squareSize = Math.sqrt(300 * 300 * (percentage / 100))

  const xy = squareAnchorMap[anchor ?? 'center'](squareSize)

  return (
    <>
      <rect width="300" height="300" fill="#d1d1d1" />
      <rect x={xy.x} y={xy.y} width={squareSize} height={squareSize} fill="#000" />
    </>
  )
}

const fillSquareAnchorMap: Record<
  Anchor,
  (size: number) => { x: number; y: number; height: number; width: number }
> = {
  'top-left': (size) => ({ x: 0, y: 0, height: size, width: 300 }),
  'top-center': (size) => ({ x: 0, y: 0, height: size, width: 300 }),
  'top-right': (size) => ({ x: 0, y: 0, height: size, width: 300 }),

  'center-left': (size) => ({ x: 0, y: 0, height: 300, width: size }),

  center: (size) => ({ x: 0, y: 150 - size / 2, height: size, width: 300 }),

  'center-right': (size) => ({ x: 300 - size, y: 0, height: 300, width: size }),

  'bottom-left': (size) => ({ x: 0, y: 300 - size, height: size, width: 300 }),
  'bottom-center': (size) => ({ x: 0, y: 300 - size, height: size, width: 300 }),
  'bottom-right': (size) => ({ x: 0, y: 300 - size, height: size, width: 300 }),
}
export function FillSquare({ percentage, anchor }: { percentage: number; anchor?: Anchor }) {
  const size = 300 * (percentage / 100)

  const xy = fillSquareAnchorMap[anchor ?? 'bottom-center'](size)

  return (
    <>
      <rect width="300" height="300" fill="#d1d1d1" />
      <rect x={xy.x} y={xy.y} width={xy.width} height={xy.height} fill="#000" />
    </>
  )
}

const circleAnchorMap: Record<Anchor, (size: number) => { x: number; y: number }> = {
  'top-left': (size) => moveByVector({ x: -1, y: -1 }, size),
  'top-center': (size) => moveByVector({ x: 0, y: -1 }, size),
  'top-right': (size) => moveByVector({ x: 1, y: -1 }, size),
  'center-left': (size) => moveByVector({ x: -1, y: 0 }, size),
  center: () => ({ x: 150, y: 150 }),
  'center-right': (size) => moveByVector({ x: 1, y: 0 }, size),
  'bottom-left': (size) => moveByVector({ x: -1, y: 1 }, size),
  'bottom-center': (size) => moveByVector({ x: 0, y: 1 }, size),
  'bottom-right': (size) => moveByVector({ x: 1, y: 1 }, size),
}
function moveByVector(vector: { x: number; y: number }, radius: number) {
  const largerRadius = 150
  const largerCenter = { x: 150, y: 150 }

  // Calculate the magnitude of the vector
  const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2)

  // Calculate the scaling factor to ensure the edges meet
  const scale = largerRadius - radius

  // Scale the vector by the scaling factor
  const scaledVector = {
    x: (vector.x / magnitude) * scale,
    y: (vector.y / magnitude) * scale,
  }

  // Calculate the new cx and cy coordinates for the smaller circle
  const smallerCx = largerCenter.x + scaledVector.x
  const smallerCy = largerCenter.y + scaledVector.y

  return { x: smallerCx, y: smallerCy }
}
export function Circle({ percentage, anchor }: { percentage: number; anchor?: Anchor }) {
  const circleArea = 150 * 150 * Math.PI
  const circleRadius = Math.sqrt((circleArea * (percentage / 100)) / Math.PI)

  const xy = circleAnchorMap[anchor ?? 'center'](circleRadius)

  return (
    <>
      <circle cx="150" cy="150" r="150" fill="#d1d1d1" />
      <circle key="circle" cx={xy.x} cy={xy.y} r={circleRadius} fill="#000" />
    </>
  )
}
