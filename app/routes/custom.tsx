import type { MetaFunction } from '@remix-run/node'
import { useState } from 'react'
import { Area, Anchor } from './Areas'
import Slider from '~/Slider'
import { Counter } from '~/Counter'
import { AnchorButtons } from '~/AnchorButtons'
import { cn, customQuestionToComponentMap } from '~/utils'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import { useSound } from '~/use-sound'
import { useSoundSetting } from '~/sound-context'

export const meta: MetaFunction = () => {
  return [{ title: 'Relative Area Quiz' }, { name: 'description', content: 'A quiz about relative areas' }]
}

export type CustomQuestion = {
  s: 1 | 2 | 3
  a: Anchor
  p: number
}
export default function Index() {
  const soundEnabled = useSoundSetting()
  const [playTransitionUp] = useSound('/sounds/transition_up.wav', { soundEnabled })
  const [playTransitionDown] = useSound('/sounds/transition_down.wav', { soundEnabled })
  const [questions, setQuestions] = useState<(CustomQuestion & { id: string })[]>([])

  const addQuestion = () => {
    setQuestions((qs) => [...qs, { s: 1, a: 'center', p: 50, id: nanoid() }])
    playTransitionUp()
  }
  const removeQuestion = (index: number) => {
    setQuestions((qs) => qs.filter((_, i) => i !== index))
    playTransitionDown()
  }

  const base64 = btoa(JSON.stringify(questions.map((x) => ({ s: x.s, a: x.a, p: x.p }))))

  const url = new URL(window.location.href)
  const customPlayUrl = new URL('/custom/p', url)
  customPlayUrl.searchParams.set('q', base64)
  customPlayUrl.searchParams.set('n', 't')

  return (
    <>
      <h2 className="text-left text-2xl mb-4 mt-6">Create custom quiz</h2>
      <motion.div layout layoutRoot>
        <LayoutGroup>
          <motion.div layout className="flex flex-col gap-8 mb-8 min-h-4 relative">
            <AnimatePresence>
              {questions.map((q, i) => (
                <Question
                  question={q}
                  key={q.id}
                  onChange={(q) => setQuestions((qs) => qs.map((qq, j) => (i === j ? q : qq)))}
                  onRemove={() => removeQuestion(i)}
                />
              ))}
              {questions.length === 0 && (
                <motion.p
                  key="empty-state"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-500 text-center text-sm absolute"
                >
                  Click &quot;Add question&quot; to create a custom quiz
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div layout>
            <motion.button
              key="main-button"
              onClick={addQuestion}
              disabled={questions.length >= 12}
              className={cn(
                'bg-black text-white rounded p-3 text-lg w-full hover:scale-105 active:scale-100 transition-transform disabled:opacity-50'
              )}
            >
              {questions.length < 12 ? 'Add question' : 'Max 12 questions'}
            </motion.button>
            <motion.p key="area-info" layout className="text-sm text-gray-500 text-left mt-1">
              Click area to change shape
            </motion.p>
            <motion.a
              href={questions.length < 4 ? undefined : customPlayUrl.toString()}
              className={cn(
                'bg-white block text-black mt-6 border-2 border-black rounded p-2 w-full active:scale-100 transition-transform',
                {
                  'opacity-50': questions.length < 4,
                  'text-xl hover:scale-105': questions.length > 3,
                  'bg-black text-white': questions.length === 12,
                }
              )}
            >
              {questions.length < 4 ? 'Add at least 4 questions to share' : 'Open quiz'}
            </motion.a>
          </motion.div>
        </LayoutGroup>
      </motion.div>
    </>
  )
}

function Question({
  question,
  onChange,
  onRemove,
}: {
  question: CustomQuestion & { id: string }
  onChange: (q: CustomQuestion & { id: string }) => void
  onRemove: () => void
}) {
  const Fill = customQuestionToComponentMap[question.s]

  const onAnchorUpdate = (anchor: Anchor) => onChange({ ...question, a: anchor })

  const onPercentageUpdate = (percentage: number) => onChange({ ...question, p: percentage })
  const onNextShape = () => onChange({ ...question, s: ((question.s % 3) + 1) as 1 | 2 | 3 })

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        x: -50,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
      }}
    >
      <motion.div layout className="flex gap-2 justify-between">
        <button onClick={onNextShape} aria-label="Change shape">
          <Area size={108}>
            <Fill percentage={question.p} anchor={question.a} />
          </Area>
        </button>
        <AnchorButtons onChange={onAnchorUpdate} anchor={question.a} />
        <div className="flex flex-col justify-between">
          <button className="ml-auto text-gray-400 hover:text-black" onClick={onRemove}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span className="sr-only">Remove question</span>
          </button>
          <div className="-mb-2 font-bold">
            <Counter value={question.p} />
          </div>
        </div>
      </motion.div>
      <motion.div layout className="mt-3">
        <Slider initialValue={question.p} onChange={onPercentageUpdate} />
      </motion.div>
    </motion.div>
  )
}
