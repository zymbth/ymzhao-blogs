import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

export default app => {
  const defaultOptions = {
    zIndex: 3000,
    inline: false, // Default: false. Enable inline mode.
    button: true, // Show the button on the top-right of the viewer.
    navbar: true, // Specify the visibility of the navbar.
    title: false, // Specify the visibility and the content of the title.
    toolbar: false, // Specify the visibility and layout of the toolbar its buttons.
    tooltip: true, // Show the tooltip with image ratio (percentage) when zooming in or zooming out.
    movable: true, // Enable to move the image.
    zoomable: true, // Enable to zoom the image.
    rotatable: false, // Enable to rotate the image.
    scalable: true, // Enable to scale the image.
    transition: true, // Enable CSS3 Transition for some special elements.
    fullscreen: false, // Enable to request full screen when play.
    keyboard: true, // Enable keyboard support.
    loading: true, // Indicate if showing a loading spinner when loading the image or not.
    url: 'src', // Default: 'src'. Define where to get the original image URL for viewing.
  }

  app.use(VueViewer, { defaultOptions })
}
