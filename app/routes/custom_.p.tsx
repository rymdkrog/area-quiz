import type { MetaFunction } from '@remix-run/node'
import { useMachine } from '@xstate/react'
import { gameMachine } from './gameMachine'
import { AnimatePresence, motion } from 'framer-motion'
import { Play } from '../Play'
import { Result } from '../Result'
import { customQuestionToComponentMap } from '~/utils'
import { useSearchParams } from '@remix-run/react'
import { useSoundSetting } from '~/sound-context'
import { useSound } from '~/use-sound'

export const meta: MetaFunction = () => {
  return [{ title: 'Guess the area' }, { name: 'description', content: 'A quiz about areas' }]
}

function parseCustomQuestions(qs: string) {
  const parsed = JSON.parse(atob(qs)) as { s: 1 | 2 | 3; a: 'top-left' | 'center' | 'top-right'; p: number }[]
  return parsed.map((q) => ({ answer: q.p, component: customQuestionToComponentMap[q.s], anchor: q.a }))
}

export default function CustomGame() {
  const soundEnabled = useSoundSetting()
  const [playCelebration] = useSound('/sounds/celebration.wav', { soundEnabled })
  const [playDisabled] = useSound('/sounds/disabled.wav', { soundEnabled })
  const [playNotification] = useSound('/sounds/notification.wav', { soundEnabled })
  const [searchParams] = useSearchParams()

  const qParam = searchParams.get('q')
  if (!qParam) {
    window.location.href = '/'
  }

  const nParam = searchParams.get('n')
  if (nParam) {
    window.history.replaceState({}, '', '/custom/p?q=' + qParam)
  }

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
        questions: parseCustomQuestions(qParam!),
      },
    }
  )

  return (
    <>
      {nParam && (
        <div className="rounded bg-gray-200 mt-4 mb-4 px-4 py-2 text-left">
          This is your custom quiz. Copy the url and send it to your friends.
        </div>
      )}
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
              href={window.location.href}
              className="bg-black text-white rounded p-3 text-xl mt-12 hover:scale-105 active:scale-100 transition-transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.45 + state.context.questions.length * 0.2 }}
            >
              Try again
            </motion.a>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.75 + state.context.questions.length * 0.2 }}
              className="border-t-2 mt-8 mb-2 border-black text-xl relative"
            >
              <span className="-mt-[17px] block w-fit mx-auto px-2 bg-white">or</span>
            </motion.div>
            <motion.a
              href="/random"
              className="bg-white text-black border-2 border-black rounded p-2 mt-4 hover:scale-105 active:scale-100 transition-transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 + state.context.questions.length * 0.2 }}
            >
              Try again with random areas
            </motion.a>
            <motion.a
              href="/custom"
              className="bg-white text-black border-2 border-black rounded p-2 mt-4 hover:scale-105 active:scale-100 transition-transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.9 + state.context.questions.length * 0.2 }}
            >
              Create your own
            </motion.a>
            <motion.a
              href="/viz"
              className="bg-white text-black border-2 border-black rounded p-2 mt-4 hover:scale-105 active:scale-100 transition-transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 + state.context.questions.length * 0.2 }}
            >
              Explore the visualizer
            </motion.a>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
