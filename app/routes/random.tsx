import type { MetaFunction } from '@remix-run/node'
import { useMachine } from '@xstate/react'
import { gameMachine } from './gameMachine'
import { AnimatePresence, motion } from 'framer-motion'
import { Play } from '~/Play'
import { Result } from '~/Result'
import { Anchor, Circle, FillSquare, Square } from './Areas'
import { useSoundSetting } from '~/sound-context'
import { useSound } from '~/use-sound'
import { Link } from '@remix-run/react'
import { usePlayTapSound } from '~/use-play-tap-sound'

export const meta: MetaFunction = () => {
  return [{ title: 'Guess the area' }, { name: 'description', content: 'A quiz about areas' }]
}

const MotionLink = motion(Link)

const availableShapes = [FillSquare, Square, Circle]
function generateRandomQuiz() {
  const questions = []
  for (let i = 0; i < 12; i++) {
    const shape = availableShapes[Math.floor(Math.random() * availableShapes.length)]
    questions.push({ answer: Math.floor(Math.random() * 100), component: shape, anchor: 'center' as Anchor })
  }

  return questions
}

export default function Random() {
  const soundEnabled = useSoundSetting()
  const [playTap] = usePlayTapSound()
  const [playCelebration] = useSound('sounds/celebration.wav', { soundEnabled })
  const [playDisabled] = useSound('sounds/disabled.wav', { soundEnabled })
  const [playNotification] = useSound('sounds/notification.wav', { soundEnabled })
  const [state, send] = useMachine(
    gameMachine.provide({
      actions: {
        playCelebrationSound: () => playCelebration(),
        playCloseSound: () => playNotification(),
        playIncorrectSound: () => playDisabled(),
      },
    }),
    {
      input: {
        questions: generateRandomQuiz(),
      },
    }
  )

  return (
    <>
      <AnimatePresence>
        {!state.matches('end') && (
          <>
            <Play state={state} send={send} />
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state.matches('end') && (
          <>
            <Result state={state} />
            <motion.a
              href="/random"
              className="bg-black text-white rounded p-3 text-xl mt-12 hover:scale-105 active:scale-100 transition-transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.5 }}
            >
              Try again
            </motion.a>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.75 }}
              className="border-t-2 mt-8 mb-2 border-black text-xl relative"
            >
              <span className="-mt-[17px] block w-fit mx-auto px-2 bg-white">or</span>
            </motion.div>
            <MotionLink
              to="/random"
              onClick={playTap}
              className="bg-white text-black border-2 border-black rounded p-2 mt-4 hover:scale-105 active:scale-100 transition-transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.8 }}
            >
              Back to start
            </MotionLink>
            <MotionLink
              to="/custom"
              onClick={playTap}
              className="bg-white text-black border-2 border-black rounded p-2 mt-4 hover:scale-105 active:scale-100 transition-transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.9 }}
            >
              Create your own
            </MotionLink>
            <MotionLink
              to="/viz"
              onClick={playTap}
              className="bg-white text-black border-2 border-black rounded p-2 mt-4 hover:scale-105 active:scale-100 transition-transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5 }}
            >
              Explore the visualizer
            </MotionLink>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
