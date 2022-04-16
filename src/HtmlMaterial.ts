import {
  Color3,
  Nullable,
  Scene,
  StandardMaterial,
  Texture,
} from '@babylonjs/core';

/**
 * A material that will render a webpage on a surface. The webpage is captured
 * as a texture and used as the emissive texture for the material. The webpage
 * itself must use the ./assets/scripts/iframe-capture.js script to signal
 * when it's contents should be rendered.
 */
class HtmlMaterial extends StandardMaterial {
  iframe: Nullable<HTMLIFrameElement> = null;

  constructor(name: string, resolutionWidth: number, resolutionHeight: number, scene?: Scene) {
    super(name, scene);

    this.createIFrame(resolutionWidth, resolutionHeight);

    this.diffuseColor = Color3.Black();

    // Configure a method to be called each time new image data is received
    // via the window's "message" event.
    window.addEventListener('message', (message) => this.handleWindowMessage(message));
  }

  public loadUrl(url: string): void {
    this.iframe!.src = url;
  }

  createIFrame(width: number, height: number): void {
    this.iframe = document.createElement('iframe');
    this.iframe.id = this.id;
    const { style } = this.iframe;
    style.width = `${width}px`;
    style.height = `${height}px`;

    // Comment out the line below if you would like the iframe to be displayed
    // as an overlay. This can be useful for debugging.
    style.visibility = 'hidden';

    // The following CSS properties are only used to aid debugging. You may update these without
    // impacting the core behavior of this class.
    style.transform = 'scale(0.5, 0.5)'; // Controls the display size of the iframe when debugging
    style.transformOrigin = 'top left';
    style.position = 'absolute';
    style.top = '0';
    style.left = '0';

    document.body.appendChild(this.iframe);
  }

  private handleWindowMessage(message: { data: any }): void {
    const { sourceUrl, imageData } = message.data;
    // Update only if the change is coming from this material's iframe.
    if (sourceUrl === this.iframe?.src) {
      this.emissiveTexture = new Texture(imageData, this.getScene(), true, true);
    }
  }
}

export default HtmlMaterial;
