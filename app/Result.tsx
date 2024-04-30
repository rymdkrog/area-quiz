import { gameMachine } from './routes/gameMachine'
import { Area } from './routes/Areas'
import { cn } from '~/utils'
import { motion } from 'framer-motion'
import { SnapshotFrom } from 'xstate'
import { useSound } from './use-sound'
import { useEffect } from 'react'
import { useSoundSetting } from './sound-context'
import confetti from 'canvas-confetti'

export function Result({ state }: { state: SnapshotFrom<typeof gameMachine> }) {
  const soundEnabled = useSoundSetting()
  const [playButton] = useSound('/sounds/button.wav', { soundEnabled })
  const [playConfetti] = useSound('/sounds/confetti.mp3', { soundEnabled })

  useEffect(() => {
    // For some reason sounds don't play in onAnimationStart so we have to do this
    for (let i = 0; i < state.context.questions.length; i++) {
      setTimeout(
        () => {
          playButton({ playbackRate: 1.2 + i * 0.2 })
        },
        1000 + i * 200
      )
    }
  }, [playButton, state.context.questions.length])

  const showConfetti = () => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    playConfetti()
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })
    fire(0.2, {
      spread: 60,
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }

  return (
    <>
      <motion.p
        className="text-2xl mt-4 mr-auto mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.25 }}
      >
        Results
      </motion.p>
      <div className="flex flex-wrap gap-[9px]">
        {state.context.results.map((r, i) => {
          const question = state.context.questions[i]
          const Fill = question.component

          return (
            <motion.div
              key={i}
              // onAnimationStart={() => playButton()}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ delay: 1.25 + i * 0.2 }}
              className="relative"
            >
              <Area size={68}>
                <Fill percentage={question.answer} />
              </Area>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.95 + i * 0.15 }}
                className={cn('absolute inset-0 text-3xl font-bold [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]', {
                  'text-red-600': r.result === 'incorrect',
                  'text-yellow-400': r.result === 'close',
                  'text-green-600 text-4xl': r.result === 'correct',
                })}
              >
                <div className="hover:opacity-0 h-full w-full flex items-center justify-center transition-opacity">
                  {r.diff > 0 ? '+' : r.diff < 0 ? '-' : ''}
                  {Math.abs(r.diff)}
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
      <motion.div
        className="mt-8 text-left w-fit"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.95 + state.context.questions.length * 0.2 }}
        onAnimationComplete={showConfetti}
      >
        <p className="text-2xl flex items-end gap-1">
          <span>Your score:</span>
          <span className="text-4xl font-bold">
            {state.context.results.reduce((acc, r) => acc + Math.abs(r.diff), 0)}
          </span>
        </p>
        <p className="text-sm text-gray-500">(Lower is better)</p>
      </motion.div>
    </>
  )
}
