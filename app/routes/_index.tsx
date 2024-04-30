import type { MetaFunction } from '@remix-run/node'
import { useMachine } from '@xstate/react'
import { gameMachine } from './gameMachine'
import { AnimatePresence, motion } from 'framer-motion'
import { Play } from '../Play'
import { Result } from '../Result'
import { Circle, FillSquare, Square } from './Areas'
import { useSound } from '~/use-sound'
import { useSoundSetting } from '~/sound-context'
import { Link } from '@remix-run/react'
import { usePlayTapSound } from '~/use-play-tap-sound'
import { cn } from '~/utils'

export const meta: MetaFunction = () => {
  return [{ title: 'Guess the area' }, { name: 'description', content: 'A quiz about areas' }]
}

const MotionLink = motion(Link)

export default function Index() {
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
        questions: [
          { answer: 25, component: Square, anchor: 'top-left' },
          { answer: 50, component: FillSquare, anchor: 'bottom-center' },
          { answer: 100, component: Circle, anchor: 'center' },
          { answer: 25, component: FillSquare, anchor: 'center-right' },
          { answer: 50, component: Square, anchor: 'center' },
          { answer: 25, component: Circle, anchor: 'top-center' },
          { answer: 75, component: Square, anchor: 'center' },
          { answer: 33, component: FillSquare, anchor: 'center' },
          { answer: 50, component: Circle, anchor: 'center' },
          { answer: 5, component: FillSquare, anchor: 'center-left' },
          { answer: 5, component: Square, anchor: 'bottom-center' },
          { answer: 80, component: Circle, anchor: 'center' },
        ],
      },
    }
  )

  const isFirstQuestion = state.context.currentQuestionIndex === 0

  return (
    <>
      <AnimatePresence>
        {!state.matches('end') && (
          <>
            <Play state={state} send={send} />
            <motion.div
              animate={{
                opacity: isFirstQuestion ? 1 : 0,
              }}
              className={cn('mt-4 text-left text-sm text-gray-600', {
                'pointer-events-none select-none': !isFirstQuestion,
              })}
            >
              You can also{' '}
              <Link to="/random" className={'underline text-gray-800 hover:text-black'}>
                play with random values
              </Link>
              ,{' '}
              <Link to="/viz" className={'underline text-gray-800 hover:text-black'}>
                visualize areas
              </Link>{' '}
              or{' '}
              <Link to="/custom" className={'underline text-gray-800 hover:text-black'}>
                create your own quiz
              </Link>
              .
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state.matches('end') && (
          <>
            <Result state={state} />
            <motion.a
              href="/"
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
              Try again with random areas
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
