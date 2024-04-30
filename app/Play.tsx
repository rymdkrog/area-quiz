import { useState } from 'react'
import { gameMachine } from './routes/gameMachine'
import { Area } from './routes/Areas'
import Slider from '~/Slider'
import { cn } from '~/utils'
import { Counter } from '~/Counter'
import { motion } from 'framer-motion'
import { Actor, Prop, SnapshotFrom } from 'xstate'
import { usePlayTapSound } from './use-play-tap-sound'

// Square 25 top left
// Square 50 center
// Square 25 center
// Square 75 center
// Circle 50 center
// Circle 25 center
// Circle 75 center
// Triangle 50 bottom
export function Play({
  state,
  send,
}: {
  state: SnapshotFrom<typeof gameMachine>
  send: Prop<Actor<typeof gameMachine>, 'send'>
}) {
  const [playTap] = usePlayTapSound()
  const [currentPercentage, setCurrentPercentage] = useState(50)

  const currentQuestion = state.context.questions[state.context.currentQuestionIndex]
  const isLastQuestion = state.context.currentQuestionIndex >= state.context.questions.length - 1

  const onClick = () => {
    if (state.matches('question')) {
      send({ type: 'GUESS', value: currentPercentage })
    }
    if (state.hasTag('result') || state.matches('end')) {
      playTap()
      send({ type: 'NEXT' })
    }
  }

  const Fill = currentQuestion.component

  const exit = { opacity: 0, scale: 0.4 }

  return (
    <>
      <motion.p className="mb-4 mt-1 text-lg" exit={exit} transition={{ delay: 0.75 }} key="subtitle">
        How much is black?
      </motion.p>
      <motion.div exit={exit} transition={{ delay: 0.6 }} key="area">
        <Area>
          <Fill percentage={currentQuestion.answer} anchor={currentQuestion.anchor} />
        </Area>
        <p className="text-right text-xs text-gray-400">
          {state.context.currentQuestionIndex + 1}/{state.context.questions.length}
        </p>
      </motion.div>
      <motion.div
        className="justify-center grid-cols-[1fr_auto_1fr] grid mt-4"
        key="info"
        exit={exit}
        transition={{ delay: 0.45 }}
      >
        <p
          className={cn('content-center text-right tabular-nums invisible', {
            visible: state.hasTag('result') && !state.matches('correct'),
          })}
        >
          {currentQuestion.answer}%
        </p>
        <div
          className={cn('text-2xl tabular-nums font-bold', {
            'text-red-600': state.matches('incorrect'),
            'text-yellow-400': state.matches('close'),
            'text-green-600': state.matches('correct'),
          })}
        >
          <Counter value={currentPercentage} />
        </div>
        <p
          className={cn('text-left tabular-nums invisible content-center', {
            visible: state.hasTag('result') && !state.matches('correct'),
          })}
        >
          {currentQuestion.answer - currentPercentage < 0 ? '+' : '-'}
          {Math.abs(currentQuestion.answer - currentPercentage)}
        </p>
      </motion.div>
      <motion.p
        className="text-sm min-h-5 text-gray-500 mb-1"
        key="distance-text"
        exit={exit}
        transition={{ delay: 0.3 }}
      >
        {state.matches('incorrect') && 'Nope :('}
        {state.matches('close') && 'So close..'}
        {state.matches('correct') && 'Correct!'}
      </motion.p>
      <motion.div exit={exit} transition={{ delay: 0.15 }}>
        <Slider
          onChange={(value) => setCurrentPercentage(value)}
          disabled={!state.matches('question')}
          initialValue={currentPercentage}
        />
      </motion.div>
      <motion.button
        onClick={onClick}
        className="bg-black text-white rounded p-3 text-xl mt-4 hover:scale-105 active:scale-100 transition-transform"
        exit={exit}
        transition={{ delay: 0 }}
        key="main-button"
      >
        {state.matches('question') && 'Guess'}
        {state.hasTag('result') && !isLastQuestion && 'Next'}
        {state.hasTag('result') && isLastQuestion && 'Show my score..'}
      </motion.button>
    </>
  )
}
