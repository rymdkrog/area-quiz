import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Circle, FillSquare, Square } from './routes/Areas'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const customQuestionToComponentMap = {
  1: Square,
  2: FillSquare,
  3: Circle,
} as const
