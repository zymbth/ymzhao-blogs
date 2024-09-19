// import Theme from 'vitepress/theme'
import DefaultTheme from 'vitepress/theme-without-fonts'
// import Layout from './Layout.vue'
import Layout from './LayoutTypography/index.vue'
import './font/font.css'
import './style/custom.scss'
import './style/scrollbar.css'
import useViewer from './useViewer'

export default {
  ...DefaultTheme,
  Layout,
  extends: DefaultTheme,
  enhanceApp({ app }) {
    useViewer(app)
  }
}
