// creds: https://buildui.com/recipes/elastic-slider
import * as RadixSlider from '@radix-ui/react-slider'
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import { ElementRef, useRef, useState } from 'react'
import { cn } from './utils'
import { useSound } from './use-sound'
import { useSoundSetting } from './sound-context'

const MAX_OVERFLOW = 50

export default function Slider({
  initialValue,
  onChange,
  disabled,
}: {
  initialValue: number
  disabled?: boolean
  onChange: (volume: number) => void
}) {
  const soundEnabled = useSoundSetting()
  const [playSnap] = useSound('/sounds/snap.wav', { volume: 0.7, soundEnabled })
  const [playGrab] = useSound('/sounds/grab.mp3', { interrupt: true, volume: 1.2, soundEnabled })
  const [playRelease] = useSound('/sounds/release.mp3', { interrupt: true, volume: 1.2, soundEnabled })
  const [value, setValue] = useState(initialValue)

  const ref = useRef<ElementRef<typeof RadixSlider.Root>>(null)
  const clientX = useMotionValue(0)
  const overflow = useMotionValue(0)
  const scale = useMotionValue(1)

  useMotionValueEvent(clientX, 'change', (latest) => {
    if (ref.current) {
      const { left, right } = ref.current.getBoundingClientRect()
      let newValue

      if (latest < left) {
        newValue = left - latest
      } else if (latest > right) {
        newValue = latest - right
      } else {
        newValue = 0
      }

      overflow.jump(decay(newValue, MAX_OVERFLOW))
    }
  })

  return (
    <motion.div
      onHoverStart={() => !disabled && animate(scale, 1.2)}
      onHoverEnd={() => animate(scale, 1)}
      onTouchStart={() => !disabled && animate(scale, 1.2)}
      onTouchEnd={() => animate(scale, 1)}
      className={'flex w-full touch-none select-none items-center justify-center gap-3'}
    >
      <RadixSlider.Root
        ref={ref}
        value={[value]}
        onValueChange={([v]) => {
          setValue(Math.floor(v))
          onChange(Math.floor(v))
        }}
        onPointerDown={() => !disabled && playGrab()}
        onValueCommit={() => !disabled && playRelease()}
        step={0.01}
        className={cn(
          'relative flex w-full grow cursor-grab touch-none select-none items-center py-2 active:cursor-grabbing',
          {
            'opacity-60 cursor-default': disabled,
          }
        )}
        onPointerMove={(e) => {
          if (e.buttons > 0) {
            clientX.jump(e.clientX)
          }
        }}
        disabled={disabled}
        onLostPointerCapture={(e) => {
          animate(overflow, 0, { type: 'spring', bounce: 0.5 })
          // if lost pointer is outside of the slider, playSnap()
          if (ref.current && e.clientX < ref.current.getBoundingClientRect().left) {
            playSnap()
          }
          if (ref.current && e.clientX > ref.current.getBoundingClientRect().right) {
            playSnap()
          }
        }}
      >
        <motion.div
          style={{
            scaleX: useTransform(() => {
              if (ref.current) {
                const { width } = ref.current.getBoundingClientRect()

                return 1 + overflow.get() / width
              }
            }),
            scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
            transformOrigin: useTransform(() => {
              if (ref.current) {
                const { left, width } = ref.current.getBoundingClientRect()

                return clientX.get() < left + width / 2 ? 'right' : 'left'
              }
            }),
            height: useTransform(scale, [1, 1.2], [18, 24]),
            marginTop: useTransform(scale, [1, 1.2], [0, -3]),
            marginBottom: useTransform(scale, [1, 1.2], [0, -3]),
          }}
          className="flex grow"
        >
          <RadixSlider.Track
            onDragStart={() => playGrab()}
            onDragEnd={() => playRelease()}
            className="relative isolate h-full grow overflow-hidden rounded-full bg-gray-300"
          >
            <RadixSlider.Range className="absolute h-full bg-black" />
          </RadixSlider.Track>
        </motion.div>
        <RadixSlider.Thumb />
      </RadixSlider.Root>
    </motion.div>
  )
}

// Sigmoid-based decay function
function decay(value: number, max: number) {
  if (max === 0) {
    return 0
  }

  const entry = value / max
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5)

  return sigmoid * max
}
