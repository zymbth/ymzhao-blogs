import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Corner Blog",
  description: "这是我的小角落，记录个人工作中琐碎的技术总结与分享。",
  // base: '/ymzhao-blogs/',
  cleanUrls: true,
  head: [
    // ['link', { rel: 'icon', href: '/ymzhao-blogs/icon.svg' }],
    ['link', { rel: 'icon', href: 'icon.svg' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/icon.svg',
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
      },
      {
        text: 'Element Plus 使用',
        items: [
          { text: '虚拟化表格组件的使用(排序、筛选、自定义单元格渲染)', link: '/article/element-plus/tablev2' },
          // { text: '优化Webpack打包流程：打包完成后再删除旧文件，确保网站访问稳定', link: '/article/engineering/package-optimize' },
        ]
      }
    ],

    outline: 'deep',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zymbth/ymzhao-blogs' }
    ]
  }
})
