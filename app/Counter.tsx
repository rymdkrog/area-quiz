// creds: https://buildui.com/recipes/animated-counter
import { MotionValue, motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

const fontSize = 30
const padding = 15
const height = fontSize + padding

export function Counter({ value }: { value: number }) {
  return (
    <div style={{ fontSize }} className="flex rounded overflow-hidden bg-white px-2 leading-none pr-[1ch]">
      <Digit place={100} value={value} visible={value === 100} />
      <Digit place={10} value={value} visible={value >= 10} />
      <Digit place={1} value={value} visible={true} />
      <span className="relative w-[1ch] content-center">%</span>
    </div>
  )
}

function Digit({ place, value, visible }: { place: number; value: number; visible: boolean }) {
  const valueRoundedToPlace = Math.floor(value / place)
  const animatedValue = useSpring(valueRoundedToPlace, { stiffness: 200, damping: 25 })

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace)
  }, [animatedValue, valueRoundedToPlace])

  return (
    <motion.div
      style={{ height }}
      className="relative w-[1ch] tabular-nums"
      initial={{ opacity: visible ? 1 : 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
    >
      {[...Array(10).keys()].map((i) => (
        <Number key={i} mv={animatedValue} number={i} />
      ))}
    </motion.div>
  )
}

function Number({ mv, number }: { mv: MotionValue; number: number }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10
    const offset = (10 + number - placeValue) % 10

    let memo = offset * height

    if (offset > 5) {
      memo -= 10 * height
    }

    return memo
  })

  return (
    <motion.span style={{ y }} className="absolute inset-0 flex items-center justify-center">
      {number}
    </motion.span>
  )
}
