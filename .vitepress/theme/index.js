// import Theme from 'vitepress/theme'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { TypographyLayout as Layout } from './Layouts'
import DemoIframe from './Layouts/components/DemoIframe.vue'
import DocTitleMeta from './Layouts/Typography/components/DocTitleMeta.vue'
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
    app.component('doc-title-meta', DocTitleMeta)
    useViewer(app)
  },
}
