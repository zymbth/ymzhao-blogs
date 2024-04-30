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
    siteTitle: 'Corner Blog',
    logo: '/icon.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '前端', link: '/front-end/basic/encapsulate-axios' },
      { text: '后端', link: '/back-end/mybatis-plus/list-and-json-typehandler' }
    ],

    sidebar: {
      '/front-end/': [
        {
          text: '基础',
          items: [
            { text: 'axios 封装', link: '/front-end/basic/encapsulate-axios' },
            { text: 'async 封装', link: '/front-end/basic/encapsulate-async' },
            { text: 'js 文档注释规范', link: '/front-end/basic/js-doc' },
            { text: 'js 实现图片预加载', link: '/front-end/basic/image-preload' },
            { text: 'CSS 移动端适配', link: '/front-end/basic/style-adaptation' },
            // { text: '正则表达式', link: '/front-end/basic/regex' },
            { text: 'css媒体查询总结', link: '/front-end/basic/css-media' },
            { text: '导入/导出Excel', link: '/front-end/basic/load-and-export-excel' },
          ]
        },
        {
          text: 'VUE',
          items: [
            { text: 'vue3 组合式API要点', link: '/front-end/vue/vue3-grammar' },
            { text: 'vue项目中使用svg组件', link: '/front-end/vue/vue-svg-comp' },
            { text: '基于 vue3 & element-plus 的暗黑模式', link: '/front-end/vue/dark-mode' },
            { text: 'vue相同的组件实例间跳转页面不刷新的问题分析', link: '/front-end/vue/switch-within-route' },
            { text: 'vue组件中监听键盘/按键事件', link: '/front-end/vue/watch-keyup-event' },
          ]
        },
        {
          text: '前端工程',
          items: [
            { text: '实践：新手使用 ESLint 进行项目代码检测与格式化', link: '/front-end/engineering/uniform-code-style' },
            { text: '优化Webpack打包流程：打包完成后再删除旧文件，确保网站访问稳定', link: '/front-end/engineering/package-optimize' },
          ]
        },
        {
          text: 'Element Plus 使用',
          items: [
            { text: 'Element Plus可编辑表格', link: '/front-end/element-plus/editable-table' },
            { text: 'Element Plus表单验证使用 个人总结', link: '/front-end/element-plus/form-validate' },
            { text: '预加载模态框组件', link: '/front-end/element-plus/prevload-dialog' },
            { text: '跟踪表格数据(更新查询、筛选条件下)', link: '/front-end/element-plus/tablev1-track-data' },
            { text: '表格 shift 连选', link: '/front-end/element-plus/tablev1-multi-select' },
            { text: '虚拟化表格组件的使用(排序、筛选、自定义单元格渲染)', link: '/front-end/element-plus/tablev2' },
          ]
        },
        {
          text: '其他',
          items: [
            { text: '代码语法高亮 + markdown解析', link: '/front-end/others/syntactic-highlighting-and-marked' },
          ]
        }
      ],
      '/back-end/': [
        {
          text: 'Mybatis Plus',
          items: [
            { text: 'PgSQL数组及json类型在Mybatis项目中的类型转换', link: '/back-end/mybatis-plus/list-and-json-typehandler' },
            { text: '条件构造器 and/or 嵌套使用', link: '/back-end/mybatis-plus/nested-query' },
            { text: 'MyBatis-Plus自定义分页查询', link: '/back-end/mybatis-plus/custom-paged-query' },
            { text: 'MyBatis-Plus自定义连表分页查询', link: '/back-end/mybatis-plus/custom-paged-query-join' },
            { text: 'MyBatis-Plus自定义连表分页查询-动态sql实现', link: '/back-end/mybatis-plus/custom-paged-query-join-sql' },
          ]
        },
        {
          text: 'Python',
          items: [
            { text: 'python实现用户好友推荐', link: '/back-end/python/friends-recommend' },
            { text: 'python实现话题推荐', link: '/back-end/python/topic-recommend' },
          ]
        },
      ]
    },

    outline: 'deep',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zymbth/ymzhao-blogs' }
    ]
  }
})
