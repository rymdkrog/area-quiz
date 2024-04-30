import { assign, setup } from 'xstate'
import { Anchor, FillSquare } from './Areas'

const context = {
  currentQuestionIndex: 0,
  questions: [{ answer: 50, component: FillSquare, anchor: 'center' as Anchor }],
  results: [] as { diff: number; result: 'incorrect' | 'close' | 'correct' }[],
}

export const gameMachine = setup({
  types: {
    input: {} as {
      questions: (typeof context)['questions']
    },
    context: {} as typeof context,
    events: {} as { type: 'GUESS'; value: number } | { type: 'NEXT' },
  },
  actions: {
    incrementQuestionIndex: assign({
      currentQuestionIndex: ({ context }) => context.currentQuestionIndex + 1,
    }),
    updateResult: assign({
      results: ({ context, event }) => {
        const currentQuestion = context.questions[context.currentQuestionIndex]
        if (event.type !== 'GUESS') return context.results

        return [
          ...context.results,
          {
            diff: (currentQuestion.answer - event.value) * -1,
            result: getResult(event.value, currentQuestion.answer),
          } as const,
        ]
      },
    }),
    playCelebrationSound: () => {},
    playIncorrectSound: () => {},
    playCloseSound: () => {},
  },
}).createMachine({
  id: 'game',
  initial: 'question',
  context: ({ input }) => ({
    ...context,
    questions: input.questions,
  }),
  states: {
    question: {
      on: {
        GUESS: [
          {
            guard: ({ context, event }) => {
              return event.value === context.questions[context.currentQuestionIndex].answer
            },
            target: 'correct',
            actions: ['updateResult'],
          },
          {
            guard: ({ context, event }) => {
              return Math.abs(event.value - context.questions[context.currentQuestionIndex].answer) <= 5
            },
            target: 'close',
            actions: ['updateResult'],
          },
          {
            target: 'incorrect',
            actions: ['updateResult'],
          },
        ],
      },
    },
    incorrect: {
      entry: ['playIncorrectSound'],
      tags: ['result'],
      on: {
        NEXT: [
          {
            guard: ({ context }) => context.currentQuestionIndex < context.questions.length - 1,
            actions: ['incrementQuestionIndex'],
            target: 'question',
          },
          {
            target: 'end',
          },
        ],
      },
    },
    close: {
      entry: ['playCloseSound'],
      tags: ['result'],
      on: {
        NEXT: [
          {
            guard: ({ context }) => context.currentQuestionIndex < context.questions.length - 1,
            actions: ['incrementQuestionIndex'],
            target: 'question',
          },
          {
            target: 'end',
          },
        ],
      },
    },
    correct: {
      entry: ['playCelebrationSound'],
      tags: ['result'],
      on: {
        NEXT: [
          {
            guard: ({ context }) => context.currentQuestionIndex < context.questions.length - 1,
            actions: ['incrementQuestionIndex'],
            target: 'question',
          },
          {
            target: 'end',
          },
        ],
      },
    },
    end: {
      type: 'final',
    },
  },
})

function getResult(value: number, answer: number) {
  if (value === answer) return 'correct'
  if (Math.abs(value - answer) <= 5) return 'close'
  return 'incorrect'
}
