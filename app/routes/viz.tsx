import type { MetaFunction } from '@remix-run/node'
import { useState } from 'react'
import { Square, Circle, Area, Anchor, FillSquare } from './Areas'
import Slider from '~/Slider'
import { Counter } from '~/Counter'
import { AnchorButtons } from '../AnchorButtons'
import { Link } from '@remix-run/react'
import { usePlayTapSound } from '~/use-play-tap-sound'

export const meta: MetaFunction = () => {
  return [{ title: 'Relative Area Quiz' }, { name: 'description', content: 'A quiz about relative areas' }]
}

export default function Index() {
  const [playTap] = usePlayTapSound()
  const [currentPercentage, setCurrentPercentage] = useState(50)
  const [anchor, setAnchor] = useState<Anchor>('center')

  return (
    <>
      <h2 className="text-left text-2xl mb-2 mt-6">Visualizer</h2>
      <div className="flex gap-[10px] flex-wrap">
        <Area size={145}>
          <Square percentage={currentPercentage} anchor={anchor} />
        </Area>
        <Area size={145}>
          <Circle percentage={currentPercentage} anchor={anchor} />
        </Area>
        <Area size={145}>
          <FillSquare percentage={currentPercentage} anchor={anchor} />
        </Area>
        <AnchorButtons onChange={setAnchor} className="self-end mx-auto" anchor={anchor} />
      </div>
      <div className="flex mt-8 mb-4 font-bold justify-center">
        <Counter value={currentPercentage} />
      </div>
      <Slider initialValue={currentPercentage} onChange={setCurrentPercentage} />
      <p className="text-sm mb-8">Drag the slider to change the black area size</p>
      <Link
        to="/"
        onClick={playTap}
        className="bg-white text-black border-2 border-black rounded p-2 mt-4 hover:scale-105 active:scale-100 transition-transform"
      >
        Back to start
      </Link>
      <Link
        to="/random"
        onClick={playTap}
        className="bg-white text-black border-2 border-black rounded p-2 mt-4 hover:scale-105 active:scale-100 transition-transform"
      >
        Play with random areas
      </Link>
      <Link
        to="/custom"
        onClick={playTap}
        className="bg-white text-black border-2 border-black rounded p-2 mt-4 hover:scale-105 active:scale-100 transition-transform"
      >
        Create your own
      </Link>
    </>
  )
}
