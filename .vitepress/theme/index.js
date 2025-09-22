// import Theme from 'vitepress/theme'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { TypographyLayout as Layout } from './Layouts'
import DemoIframe from './Layouts/components/DemoIframe.vue'
import FullScreen from './Layouts/components/FullScreen.vue'
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
    useViewer(app)
  },
}
