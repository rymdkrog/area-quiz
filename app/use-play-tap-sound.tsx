import { useSoundSetting } from './sound-context'
import { useSound } from './use-sound'

export function usePlayTapSound() {
  const soundEnabled = useSoundSetting()
  const [playTap01] = useSound('/sounds/tap_01.wav', { soundEnabled, volume: 0.5 })
  const [playTap03] = useSound('/sounds/tap_03.wav', { soundEnabled, volume: 0.5 })
  const [playTap04] = useSound('/sounds/tap_04.wav', { soundEnabled, volume: 0.5 })
  const [playTap05] = useSound('/sounds/tap_05.wav', { soundEnabled, volume: 0.5 })

  const taps = [playTap01, playTap03, playTap04, playTap05]

  const playTap = () => {
    const random = Math.floor(Math.random() * 4)
    taps[random]()
  }

  return [playTap] as const
}
