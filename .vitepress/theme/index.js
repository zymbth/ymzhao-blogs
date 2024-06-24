// import Theme from 'vitepress/theme'
import DefaultTheme from 'vitepress/theme-without-fonts'
import Layout from './Layout.vue'
import './font/font.css'
import './style/custom.css'

export default {
  ...DefaultTheme,
  Layout,
}
