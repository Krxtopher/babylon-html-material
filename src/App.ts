import { Engine } from '@babylonjs/core';
// We must import the loaders module to support dynamic loading of glTF and
// other 3D model formats.
import '@babylonjs/loaders';
import DemoScene from './DemoScene';

class App {
  constructor() {
    // Initialize the BabylonJS engine.
    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    const engine = new Engine(canvas, true);

    // Resize the renderer if the window is resized.
    window.addEventListener('resize', () => engine.resize());

    // Create the main scene.
    const scene = new DemoScene(engine);

    // Set up the scene's render loop.
    engine.runRenderLoop(() => scene.render());
  }
}

export default App;
