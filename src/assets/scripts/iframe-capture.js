/**
 When this script is added to the head of an HTML page that is used in an iframe
 it will send a PNG image capture of itself to the parent HTML page via a call
 to `document.postMessage()`. The value that is passed will be a base 64 image
 URL.

 You must use a <script> tag to include the "htmlToImage" library in the head of
 your HTML document before calling the renderPageAsImage() function. Here's a
 typical usage example...

<script src="https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.9.0/html-to-image.js"></script>
<script type="module">
  import { renderPageAsImage } from "./assets/scripts/iframe-capture.js";
  renderElementAsImage(document.body);
</script>
 */

// eslint-disable-next-line import/prefer-default-export
export function renderElementAsImage(element) {
  const sourceUrl = window.location.href;
  console.log(`Rendering ${element} as image. ${sourceUrl}`);

  // eslint-disable-next-line no-undef
  htmlToImage.toPng(element)
    .then((dataUrl) => {
      const message = {
        sourceUrl,
        imageData: dataUrl,
      };
      window.parent.postMessage(message, '*');
    })
    .catch((error) => {
      console.error('There was a problem turning the HTML content into a PNG image.', error);
    });
}
