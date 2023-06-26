import { quat, vec3 } from 'gl-matrix'
import { View } from '@novorender/webgl-api'
import { ButtonDataTuple } from '../App.tsx'

interface IButtonsComponent {
  view: View
  buttonData: ButtonDataTuple
  setButtonData: (buttonData: ButtonDataTuple) => void
}
export const Buttons = (props: IButtonsComponent) => {
  const { view, buttonData, setButtonData } = props
  const saveButtonData = (i: 0 | 1 | 2) => {
    console.log('save button data', i + 1)
    const position = [...view.camera.position] as vec3
    const rotation = [...view.camera.rotation] as quat
    const initialized = true
    const newButtonData: ButtonDataTuple = [buttonData[0], buttonData[1], buttonData[2]]
    newButtonData[i] = { position, rotation, initialized }
    setButtonData(newButtonData)
  }

  const moveCamera = (i: 0 | 1 | 2) => {
    console.log('move camera to ', i + 1)
    const currentButtonData = buttonData[i]
    if (!currentButtonData.initialized) return
    view.camera.controller.moveTo(currentButtonData.position, currentButtonData.rotation)
  }

  const handleClick = (i: 0 | 1 | 2) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.shiftKey) {
      saveButtonData(i)
    } else {
      moveCamera(i)
    }
  }

  const buttonIndices = [0, 1, 2] as const
  return (
    <div className="flex gap-4">
      {buttonIndices.map((i) => (
        <button onClick={handleClick(i)} key={i}>
          Button {i + 1}
        </button>
      ))}
    </div>
  )
}
