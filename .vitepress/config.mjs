import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Yuemin Zhao's Blog",
  description: "A VitePress Site of blogs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Articles', link: '/article/basic/js-doc' }
    ],

    sidebar: [
      {
        text: '基础',
        items: [
          { text: 'js 文档注释规范', link: '/article/basic/js-doc' },
          { text: 'axios 封装', link: '/article/basic/encapsulate-axios' },
          // { text: '正则表达式', link: '/article/basic/regex' },
          { text: 'vue项目中使用svg组件', link: '/article/basic/vue-svg-comp' },
        ]
      },
      {
        text: '前端工程',
        items: [
          { text: '实践：新手使用 ESLint 进行项目代码检测与格式化', link: '/article/engineering/uniform-code-style' },
          { text: '优化Webpack打包流程：打包完成后再删除旧文件，确保网站访问稳定', link: '/article/engineering/package-optimize' },
        ]
      }
    ],

    outline: 'deep',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zymbth/ymzhao-blogs' }
    ]
  }
})
