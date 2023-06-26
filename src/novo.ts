import { API, createAPI } from "@novorender/webgl-api";

const api = createAPI({
  // Path to where the files previously copied from node_modules are hosted
  scriptBaseUrl: `${window.location.origin}/novorender/webgl-api/`,
});
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
main(api, canvas);

async function main(api: API, canvas: HTMLCanvasElement) {
  // create a view
  const view = await api.createView(
    { background: { color: [0, 0, 0, 0] } }, // transparent
    canvas
  );

  // provide a camera controller
  view.camera.controller = api.createCameraController({ kind: "turntable" });

  // load the Condos demo scene
  //   WellKnownSceneUrls.condos
  view.scene = await api.loadScene(
    "https://api.novorender.com/assets/scenes/18f56c98c1e748feb8369a6d32fde9ef/"
  );

  // create a bitmap context to display render output
  const ctx = canvas.getContext("bitmaprenderer");

  // main render loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // handle canvas resizes
    const { clientWidth, clientHeight } = canvas;
    view.applySettings({
      display: { width: clientWidth, height: clientHeight },
    });

    // render frame
    const output = await view.render();
    {
      // finalize output image
      const image = await output.getImage();
      if (image) {
        // display in canvas
        ctx?.transferFromImageBitmap(image);
        image.close();
      }
    }
  }
}
