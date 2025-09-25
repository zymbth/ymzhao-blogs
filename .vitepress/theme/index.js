// import Theme from 'vitepress/theme'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { TypographyLayout as Layout } from './Layouts'
import DemoIframe from './Layouts/components/DemoIframe.vue'
import FullScreen from './Layouts/components/FullScreen.vue'
import WDocTitleMeta from './Layouts/Typography/components/WDocTitleMeta.vue'
import useViewer from './useViewer'
import './font.css'
import './common.scss'
import './Layouts/Typography/style/index.scss'
import 'virtual:uno.css'

export default {
  ...DefaultTheme,
  Layout,
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoIframe', DemoIframe)
    app.component('FullScreen', FullScreen)
    app.component('weiz-title-meta', WDocTitleMeta)
    useViewer(app)
  },
}
