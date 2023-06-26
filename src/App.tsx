import { useRef, useState } from 'react'
import './App.css'
import { useWindowSize } from './utils/useWindowSize.ts'
import { useRunOnMount } from './utils/useRunOnMount.ts'
import { createAPI, View } from '@novorender/webgl-api'
import { novo } from './scripts/novo.ts'
import { quat, vec3 } from 'gl-matrix'
import { Buttons } from './components/Buttons.tsx'
import { Search } from './components/Search.tsx'

const SCENE_ID = '3b5e65560dc4422da5c7c3f827b6a77c'

const api = createAPI({
  // Path to where the files previously copied from node_modules are hosted
  scriptBaseUrl: `${window.location.origin}/novorender/webgl-api/`,
})

export type ButtonDataProps = {
  position: vec3
  rotation: quat
  initialized: boolean
}
export type ButtonDataTuple = [ButtonDataProps, ButtonDataProps, ButtonDataProps]

const initialButtonData: ButtonDataProps = {
  position: [0, 0, 0],
  rotation: [0, 0, 0, 1],
  initialized: false,
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [view, setView] = useState<View>(null as unknown as View)
  const { width, height } = useWindowSize()
  const [buttonData, setButtonData] = useState<ButtonDataTuple>([
    initialButtonData,
    initialButtonData,
    initialButtonData,
  ])

  useRunOnMount(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    ;(async () => {
      const novoView = await novo(api, canvas, SCENE_ID)
      setView(novoView)
    })()
  })

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={width} height={height} className="relative" />
      <div className="fixed top-10 left-10 z-10 flex flex-col gap-4 items-start">
        <Buttons view={view} buttonData={buttonData} setButtonData={setButtonData} />
        <Search view={view} />
      </div>
    </div>
  )
}

export default App
