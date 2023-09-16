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
      { text: 'Articles', link: '/article/basic/encapsulate-axios' }
    ],

    sidebar: [
      {
        text: '基础',
        items: [
          { text: 'axios 封装', link: '/article/basic/encapsulate-axios' },
          { text: 'async 封装', link: '/article/basic/encapsulate-async' },
          { text: 'js 文档注释规范', link: '/article/basic/js-doc' },
          { text: 'js 实现图片预加载', link: '/article/basic/image-preload' },
          { text: 'CSS 移动端适配', link: '/article/basic/style-adaptation' },
          // { text: '正则表达式', link: '/article/basic/regex' },
          { text: 'css媒体查询总结', link: '/article/basic/css-media' },
        ]
      },
      {
        text: 'VUE',
        items: [
          { text: 'vue3 组合式API要点', link: '/article/vue/vue3-grammar' },
          { text: 'vue项目中使用svg组件', link: '/article/vue/vue-svg-comp' },
          { text: '基于 vue3 & element-plus 的暗黑模式', link: '/article/vue/dark-mode' },
          { text: 'vue相同的组件实例间跳转页面不刷新的问题分析', link: '/article/vue/switch-within-route' },
          { text: 'vue组件中监听键盘/按键事件', link: '/article/vue/watch-keyup-event' },
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
          { text: 'Element Plus可编辑表格', link: '/article/element-plus/editable-table' },
          { text: 'Element Plus表单验证使用 个人总结', link: '/article/element-plus/form-validate' },
          { text: '跟踪表格数据(更新查询、筛选条件下)', link: '/article/element-plus/tablev1-track-data' },
          { text: '表格 shift 连选', link: '/article/element-plus/tablev1-multi-select' },
          { text: '虚拟化表格组件的使用(排序、筛选、自定义单元格渲染)', link: '/article/element-plus/tablev2' },
        ]
      }
    ],

    outline: 'deep',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zymbth/ymzhao-blogs' }
    ]
  }
})
