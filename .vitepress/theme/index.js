// import Theme from 'vitepress/theme'
import DefaultTheme from 'vitepress/theme-without-fonts'
// import Layout from './Layout.vue'
import Layout from './LayoutTypography/index.vue'
import './font/font.css'
// import './style/custom.scss'
import './LayoutTypography/style/custom.scss'
import './style/scrollbar.css'
import useViewer from './useViewer'
import 'virtual:uno.css'

// import { onMounted } from 'vue'
// import { createRouter, createWebHistory } from 'vue-router'
// import generatedRoutes from '~pages'
// import { useRouter as useVitePressRouter } from 'vitepress'

export default {
  ...DefaultTheme,
  Layout,
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    useViewer(app)

    // onMounted(() => {
    //   // 获取 VitePress 的路由
    //   // const vitePressRouter = useVitePressRouter()
    //   const vitePressRouter = router.getRoutes?.()
    //   console.log('vitePressRouter: ', vitePressRouter)

    //   // 合并自定义路由和 VitePress 路由
    //   const combinedRoutes = [...generatedRoutes, ...vitePressRouter.options.routes]
    //   console.log('combinedRoutes: ', combinedRoutes);

    //   // 创建新的路由实例
    //   const newRouter = createRouter({
    //     history: createWebHistory(),
    //     routes: combinedRoutes,
    //   })

    //   // 使用新的路由实例
    //   app.use(newRouter)
    // })
  },
}
