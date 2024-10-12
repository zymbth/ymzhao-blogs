// import Theme from 'vitepress/theme'
import DefaultTheme from 'vitepress/theme-without-fonts'
// import VPBadge from 'vitepress/dist/client/theme-default/components/VPBadge.vue'
import { TypographyLayout as Layout } from './Layouts'
import './font/font.css'
import './Layouts/Typography/style/index.scss'
import useViewer from './useViewer'
import 'virtual:uno.css'
import AchiveComp from './Layouts/Typography/Achive.vue'
import CategoryComp from './Layouts/Typography/Category.vue'

export default {
  ...DefaultTheme,
  Layout,
  extends: DefaultTheme,
  enhanceApp({ app }) {
    useViewer(app)
    // app.component('Badge', VPBadge)
    app.component('AchiveComp', AchiveComp)
    app.component('CategoryComp', CategoryComp)
  },
}
