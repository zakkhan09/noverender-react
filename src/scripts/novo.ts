import { API, RenderOutput, View } from '@novorender/webgl-api'
import { createAPI } from '@novorender/data-js-api'

interface RenderOutputWithDispose extends RenderOutput {
  dispose: () => void
}
function startResizeObserver(view: View, canvas: HTMLCanvasElement) {
  // Handle canvas resizes
  new ResizeObserver((entries) => {
    for (const entry of entries) {
      canvas.width = entry.contentRect.width
      canvas.height = entry.contentRect.height
      view.applySettings({
        display: { width: canvas.width, height: canvas.height },
      })
    }
  }).observe(canvas)
}

async function run(view: View, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('bitmaprenderer')

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Render frame
    const output = (await view.render()) as RenderOutputWithDispose

    // Finalize output image
    const image = await output.getImage()
    if (image) {
      // Display the given ImageBitmap in the canvas associated with this rendering context.
      ctx?.transferFromImageBitmap(image)
      // release bitmap data
      image.close()
    }

    output.dispose()
  }
}

export async function novo(api: API, canvas: HTMLCanvasElement, sceneID: string) {
  const dataApi = createAPI({
    serviceUrl: 'https://data.novorender.com/api',
  })

  const sceneData = await dataApi
    // Condos scene ID, but can be changed to any public scene ID
    .loadScene(sceneID)
    .then((res) => {
      if ('error' in res) {
        throw res
      } else {
        return res
      }
    })

  const { url, db, settings, camera: cameraParams } = sceneData

  const scene = await api.loadScene(url, db)

  const view = await api.createView(settings, canvas)

  const flightControllerParams = { kind: 'flight' } as any
  const camera = cameraParams ?? flightControllerParams
  view.camera.controller = api.createCameraController(camera, canvas)
  view.scene = scene

  startResizeObserver(view, canvas)
  run(view, canvas)
  return view
}
