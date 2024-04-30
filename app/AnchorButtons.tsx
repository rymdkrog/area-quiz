import { Anchor } from './routes/Areas'
import { useSoundSetting } from './sound-context'
import { useSound } from './use-sound'
import { cn } from './utils'

export function AnchorButtons({
  onChange,
  anchor,
  className,
}: {
  className?: string
  anchor: Anchor
  onChange: (anchor: Anchor) => void
}) {
  const soundEnabled = useSoundSetting()
  const [playSelect] = useSound('/sounds/select.wav', { soundEnabled })

  const handleClick = (anchor: Anchor) => {
    playSelect()
    onChange(anchor)
  }

  return (
    <div className={className}>
      <p className="text-left font-bold mb-2">Anchor</p>
      <div className="grid grid-cols-3 w-fit">
        <button
          onClick={() => handleClick('top-left')}
          className={cn('rounded', {
            'bg-gray-200': anchor === 'top-left',
          })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 19.5-15-15m0 0v11.25m0-11.25h11.25" />
          </svg>
        </button>
        <button
          onClick={() => handleClick('top-center')}
          className={cn('rounded', {
            'bg-gray-200': anchor === 'top-center',
          })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>
        </button>
        <button
          onClick={() => handleClick('top-right')}
          className={cn('rounded', {
            'bg-gray-200': anchor === 'top-right',
          })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </button>
        <button
          onClick={() => handleClick('center-left')}
          className={cn('rounded', {
            'bg-gray-200': anchor === 'center-left',
          })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <button
          onClick={() => handleClick('center')}
          className={cn('text-xl rounded', {
            'bg-gray-200': anchor === 'center',
          })}
        >
          ⦿
        </button>
        <button
          onClick={() => handleClick('center-right')}
          className={cn('rounded', {
            'bg-gray-200': anchor === 'center-right',
          })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
        <button
          onClick={() => handleClick('bottom-left')}
          className={cn('rounded', {
            'bg-gray-200': anchor === 'bottom-left',
          })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25" />
          </svg>
        </button>
        <button
          onClick={() => handleClick('bottom-center')}
          className={cn('rounded', {
            'bg-gray-200': anchor === 'bottom-center',
          })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>
        </button>
        <button
          onClick={() => handleClick('bottom-right')}
          className={cn('rounded', {
            'bg-gray-200': anchor === 'bottom-right',
          })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25" />
          </svg>
        </button>
      </div>
    </div>
  )
}
