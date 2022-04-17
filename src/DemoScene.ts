import {
  Angle,
  ArcRotateCamera,
  Color4,
  DirectionalLight,
  Engine,
  Mesh,
  MeshBuilder,
  Nullable,
  PickingInfo,
  PointerEventTypes,
  Scene,
  ShadowGenerator,
  StandardMaterial,
  Texture,
  Vector3,
} from '@babylonjs/core';
import HtmlMaterial from './HtmlMaterial';

class DemoScene extends Scene {
  private ground: Nullable<Mesh> = null;

  private shadowGenerator: Nullable<ShadowGenerator> = null;

  private instanceCount: number = 0;

  constructor(engine: Engine) {
    super(engine);

    this.setUpEnvironment();
    this.setUpLighting();
    this.setupCamera();
    this.setUpInteraction();
  }

  setUpEnvironment(): void {
    this.clearColor = new Color4(0, 0, 0, 1);

    this.ground = MeshBuilder.CreateGround('Ground', { width: 20, height: 20 });
    this.ground.receiveShadows = true;

    const groundMaterial = new StandardMaterial('GroundMaterial');
    groundMaterial.opacityTexture = new Texture('./assets/images/ground-fade.png');
    const diffuseTexture = new Texture('./assets/images/grey-grid.png');
    diffuseTexture.uScale = 12;
    diffuseTexture.vScale = 12;
    groundMaterial.diffuseTexture = diffuseTexture;

    this.ground!.material = groundMaterial;
  }

  setUpLighting(): void {
    // Create a shadow casting light.
    const shadowLight = new DirectionalLight('ShadowLight', new Vector3(-0.8, -2, 1), this);
    shadowLight.intensity = 1;

    // Create shadow generator.
    this.shadowGenerator = new ShadowGenerator(1024, shadowLight);

    // Configure for soft shadows.
    this.shadowGenerator.useBlurExponentialShadowMap = true;
    this.shadowGenerator.useKernelBlur = true;
    this.shadowGenerator.blurKernel = 16;
    this.shadowGenerator.blurScale = 4;
    this.shadowGenerator.darkness = 0.8;
  }

  setupCamera(): void {
    this.createDefaultCamera(true, true, true);

    const camera = this.activeCamera as ArcRotateCamera;
    camera.radius = 4;
    camera.beta = Angle.FromDegrees(70).radians(); // Elevation angle
    camera.alpha = Angle.FromDegrees(-95).radians();
    camera.target.y = 1; // Raise the target point up a  bit.
    camera.wheelDeltaPercentage = 0.01; // Slows zoom speed.
    camera.minZ = 0.01; // Allows camera to get very close to object without clipping.
  }

  private setUpInteraction() : void {
    // Trigger our pick handler whenever the user double-clicks on a pickable mesh.
    window.addEventListener('dblclick', () => {
      const pickInfo = this.pick(this.pointerX, this.pointerY);
      if (pickInfo) {
        this.pointerPickHandler(pickInfo);
      }
    });
  }

  /**
   * Triggered whenever the user double-clicks on a pickable mesh.
   * @param pickInfo
   */
  pointerPickHandler(pickInfo: PickingInfo): void {
    const groundWasPicked = pickInfo.hit && pickInfo.pickedMesh === this.ground;
    if (groundWasPicked) {
      const placementPosition = pickInfo.pickedPoint!;
      this.spawnHtmlPlane(placementPosition);
    }
  }

  /**
   * Creates a new HTML plane at the specified position. The HTML page displayed
   * is automatically chosen from a hard-coded list in this method.
   * @param position The point at which to place the plane
   */
  spawnHtmlPlane(position: Vector3): void {
    const options = {
      width: 1,
      height: 1.5,
      contentWidth: 500,
      doubleSided: true,
    };

    // Choose an HTML page to display by cycling through our sample sample pages.
    const message = encodeURIComponent('Hello, world!');
    const contentPages = [
      'content1.html',
      `content2.html?message=${message}`,
    ];
    this.instanceCount += 1;
    const index = (this.instanceCount - 1) % contentPages.length;
    const url = contentPages[index];

    const plane = DemoScene.CreateHtmlPlane(url, options);
    const offsetPosition = position.clone();
    offsetPosition.y += 1;
    plane.position = offsetPosition;

    // Rotate the placed object so that it faces the camera.
    const target = this.activeCamera!.position;
    DemoScene.RotateMeshToFaceTarget(plane, target);

    // Enable shadows for the plane.
    this.shadowGenerator?.addShadowCaster(plane);
  }

  /**
   *
   * @param url The webpage to be displayed.
   * @param options
   * @param options.width The width of the plane.
   * @param options.height The height of the plane.
   * @param options.contentWidth Controls the resolution/scale of the webpage content.
   * @param options.doubleSided Whether to mirror the HTML content on the
   * back of the plane. Otherwise, the back of the plane will be transparent.
   * @returns The created mesh.
   */
  static CreateHtmlPlane(url:string, {
    width = 1, height = 1, contentWidth = 600, doubleSided = false,
  }): Mesh {
    const aspectRatio = width / height;
    const iframeWidth = contentWidth;
    const iframeHeight = contentWidth / aspectRatio;

    const card = MeshBuilder.CreatePlane('', { width, height });
    const material = new HtmlMaterial('iframe', iframeWidth, iframeHeight);

    material.backFaceCulling = !doubleSided;

    card.material = material;

    material.loadUrl(url);

    return card;
  }

  /**
   * Rotates a mesh about its Y axis to face a target point.
   * @param mesh The mesh to rotate
   * @param target The point to face towards
   */
  static RotateMeshToFaceTarget(mesh: Mesh, target: Vector3) {
    const meshPosition = mesh.position;
    const targetPoint = target.clone();
    targetPoint.y = meshPosition.y;

    const directionToTarget = meshPosition.subtract(targetPoint).normalize();
    mesh.setDirection(directionToTarget);
  }
}

export default DemoScene;
