// import Theme from 'vitepress/theme'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { TypographyLayout as Layout } from './Layouts'
import useViewer from './useViewer'
import './font/font.css'
import './Layouts/Typography/style/index.scss'
import 'virtual:uno.css'

export default {
  ...DefaultTheme,
  Layout,
  extends: DefaultTheme,
  enhanceApp({ app }) {
    useViewer(app)
  },
}
