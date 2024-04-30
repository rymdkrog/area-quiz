import { createContext, useContext } from 'react'

export const SoundContext = createContext<{ enabled: boolean }>({
  enabled: true,
})

export const useSoundSetting = () => {
  return useContext(SoundContext).enabled
}
