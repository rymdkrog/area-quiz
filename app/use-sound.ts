/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// from https://github.com/joshwcomeau/use-sound
// doesn't seem to work with esm so just copy pasted the code here

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Howl } from 'howler'

export type SpriteMap = {
  [key: string]: [number, number]
}

export type HookOptions<T = any> = T & {
  id?: string
  volume?: number
  playbackRate?: number
  interrupt?: boolean
  soundEnabled?: boolean
  sprite?: SpriteMap
  onload?: () => void
}

export interface PlayOptions {
  id?: string
  forceSoundEnabled?: boolean
  playbackRate?: number
}

export type PlayFunction = (options?: PlayOptions) => void

export interface ExposedData {
  sound: Howl | null
  stop: (id?: string) => void
  pause: (id?: string) => void
  duration: number | null
}

export type ReturnedValue = [PlayFunction, ExposedData]

function useSound<T = any>(
  src: string | string[],
  {
    id,
    volume = 1,
    playbackRate = 1,
    soundEnabled = true,
    interrupt = false,
    onload,
    ...delegated
  }: HookOptions<T> = {} as HookOptions
) {
  const HowlConstructor = React.useRef<HowlStatic | null>(null)
  const isMounted = React.useRef(false)

  const [duration, setDuration] = React.useState<number | null>(null)

  const [sound, setSound] = React.useState<Howl | null>(null)

  const handleLoad = function () {
    if (typeof onload === 'function') {
      // @ts-ignore
      onload.call(this)
    }

    if (isMounted.current) {
      // @ts-ignore
      setDuration(this.duration() * 1000)
    }

    // @ts-ignore
    setSound(this)
  }

  // We want to lazy-load Howler, since sounds can't play on load anyway.
  useOnMount(() => {
    import('howler').then((mod) => {
      if (!isMounted.current) {
        // Depending on the module system used, `mod` might hold
        // the export directly, or it might be under `default`.
        HowlConstructor.current = mod.Howl ?? mod.default.Howl

        isMounted.current = true

        new HowlConstructor.current({
          src: Array.isArray(src) ? src : [src],
          volume,
          rate: playbackRate,
          onload: handleLoad,
          ...delegated,
        })
      }
    })

    return () => {
      isMounted.current = false
    }
  })

  // When the `src` changes, we have to do a whole thing where we recreate
  // the Howl instance. This is because Howler doesn't expose a way to
  // tweak the sound
  React.useEffect(() => {
    if (HowlConstructor.current && sound) {
      setSound(
        new HowlConstructor.current({
          src: Array.isArray(src) ? src : [src],
          volume,
          onload: handleLoad,
          ...delegated,
        })
      )
    }
    // The linter wants to run this effect whenever ANYTHING changes,
    // but very specifically I only want to recreate the Howl instance
    // when the `src` changes. Other changes should have no effect.
    // Passing array to the useEffect dependencies list will result in
    // ifinite loop so we need to stringify it, for more details check
    // https://github.com/facebook/react/issues/14476#issuecomment-471199055
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(src)])

  // Whenever volume/playbackRate are changed, change those properties
  // on the sound instance.
  React.useEffect(() => {
    if (sound) {
      sound.volume(volume)
      sound.rate(playbackRate)
    }
    // A weird bug means that including the `sound` here can trigger an
    // error on unmount, where the state loses track of the sprites??
    // No idea, but anyway I don't need to re-run this if only the `sound`
    // changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, playbackRate])

  const play: PlayFunction = React.useCallback(
    (options?: PlayOptions) => {
      if (typeof options === 'undefined') {
        options = {}
      }

      if (!sound || (!soundEnabled && !options.forceSoundEnabled)) {
        return
      }

      if (interrupt) {
        sound.stop()
      }

      if (options.playbackRate) {
        sound.rate(options.playbackRate)
      }

      sound.play(options.id)
    },
    [sound, soundEnabled, interrupt]
  )

  const stop = React.useCallback(
    (id: any) => {
      if (!sound) {
        return
      }
      sound.stop(id)
    },
    [sound]
  )

  const pause = React.useCallback(
    (id: any) => {
      if (!sound) {
        return
      }
      sound.pause(id)
    },
    [sound]
  )

  const returnedValue: ReturnedValue = [
    play,
    {
      sound,
      stop,
      pause,
      duration,
    },
  ]

  return returnedValue
}

export { useSound }

function useOnMount(callback: React.EffectCallback) {
  React.useEffect(callback, [])
}
