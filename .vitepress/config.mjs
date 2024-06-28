import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { pwa } from './pwa'

// https://vitepress.dev/reference/site-config
export default withPwa(
  defineConfig({
    lang: 'zh-Hans',
    title: 'Corner Blog',
    description: '欢迎来到我的角落，记录琐碎的技术思考与经验分享。',
    // base: '/ymzhao-blogs/',
    cleanUrls: true,
    head: [['link', { rel: 'icon', href: '/icon.svg' }]],
    themeConfig: {
      siteTitle: 'Corner Blog',
      logo: '/icon.svg',
      nav: [
        // { text: '首页', link: '/' },
        // { text: '前端', link: '/front-end/basic/encapsulate-axios' },
        {
          text: '前端',
          items: [
            { text: '基础', link: '/front-end/basic/js/utils' },
            { text: 'VUE', link: '/front-end/vue/vue3-grammar' },
            { text: '前端工程', link: '/front-end/engineering/uniform-code-style' },
            { text: 'Element Plus 使用', link: '/front-end/element-plus/editable-table' },
            { text: 'Node.js', link: '/front-end/nodejs/mailer-service' },
            { text: '其他', link: '/front-end/others/syntactic-highlighting-and-marked' },
          ],
        },
        { text: '后端', link: '/back-end/mybatis-plus/list-and-json-typehandler' },
        { text: '笔记', link: '/notes/source-code/mitt' },
      ],

      sidebar: {
        '/front-end/basic/': [
          { text: 'HTML', collapsed: true, items: [] },
          {
            text: 'Javascript',
            collapsed: false,
            items: [
              { text: '实用js工具方法', link: '/front-end/basic/js/utils' },
              { text: 'async 封装', link: '/front-end/basic/js/encapsulate-async' },
              { text: 'js 文档注释规范', link: '/front-end/basic/js/js-doc' },
              { text: '中文字符串base64编码、解码', link: '/front-end/basic/js/base64-zh' },
              { text: '图片base64编码、解码、下载', link: '/front-end/basic/js/image-base64-appl' },
              {
                text: '网页性能优化——图片：压缩、云存储、预加载、懒加载、渐进式图片',
                link: '/front-end/basic/js/performance-optimization-of-image',
              },
              // { text: '正则表达式', link: '/front-end/basic/js/regex' },
              { text: '导入/导出Excel', link: '/front-end/basic/js/load-and-export-excel' },
            ],
          },
          {
            text: 'CSS',
            collapsed: false,
            items: [
              { text: 'CSS 移动端适配', link: '/front-end/basic/css/style-adaptation' },
              { text: 'css媒体查询总结', link: '/front-end/basic/css/css-media' },
            ],
          },
          {
            text: 'Others',
            collapsed: false,
            items: [{ text: 'axios 封装', link: '/front-end/basic/others/encapsulate-axios' }],
          },
        ],
        '/front-end/vue/': [
          { text: 'vue3 组合式API要点', link: '/front-end/vue/vue3-grammar' },
          { text: 'vue项目中使用svg组件', link: '/front-end/vue/vue-svg-comp' },
          { text: '基于 vue3 & element-plus 的暗黑模式', link: '/front-end/vue/dark-mode' },
          { text: 'vue3局部状态管理', link: '/front-end/vue/data-store' },
          {
            text: 'vue相同的组件实例间跳转页面不刷新的问题分析',
            link: '/front-end/vue/switch-within-route',
          },
          { text: 'vue组件中监听键盘/按键事件', link: '/front-end/vue/watch-keyup-event' },
        ],
        '/front-end/engineering/': [
          {
            text: '实践：新手使用 ESLint 进行项目代码检测与格式化',
            link: '/front-end/engineering/uniform-code-style',
          },
          {
            text: '优化Webpack打包流程：打包完成后再删除旧文件，确保网站访问稳定',
            link: '/front-end/engineering/package-optimize',
          },
          {
            text: 'Github Actions 使用记录',
            link: '/front-end/engineering/github-actions',
          },
        ],
        '/front-end/element-plus/': [
          { text: 'Element Plus可编辑表格', link: '/front-end/element-plus/editable-table' },
          {
            text: 'Element Plus表单验证使用 个人总结',
            link: '/front-end/element-plus/form-validate',
          },
          { text: '预加载模态框组件', link: '/front-end/element-plus/prevload-dialog' },
          {
            text: '跟踪表格数据(更新查询、筛选条件下)',
            link: '/front-end/element-plus/tablev1-track-data',
          },
          { text: '表格 shift 连选', link: '/front-end/element-plus/tablev1-multi-select' },
          {
            text: '虚拟化表格组件的使用(排序、筛选、自定义单元格渲染)',
            link: '/front-end/element-plus/tablev2',
          },
        ],
        '/front-end/nodejs/': [
          { text: '基于 nodejs 的邮件服务', link: '/front-end/nodejs/mailer-service' },
        ],
        '/front-end/others/': [
          {
            text: '代码语法高亮 + markdown解析',
            link: '/front-end/others/syntactic-highlighting-and-marked',
          },
          { text: 'vitepress静态站点生成', link: '/front-end/others/vitepress-usage' },
        ],
        '/back-end/': [
          {
            text: 'Mybatis Plus',
            collapsed: false,
            items: [
              {
                text: 'PgSQL数组及json类型在Mybatis项目中的类型转换',
                link: '/back-end/mybatis-plus/list-and-json-typehandler',
              },
              { text: '条件构造器 and/or 嵌套使用', link: '/back-end/mybatis-plus/nested-query' },
              {
                text: 'MyBatis-Plus自定义分页查询',
                link: '/back-end/mybatis-plus/custom-paged-query',
              },
              {
                text: 'MyBatis-Plus自定义连表分页查询',
                link: '/back-end/mybatis-plus/custom-paged-query-join',
              },
              {
                text: 'MyBatis-Plus自定义连表分页查询-动态sql实现',
                link: '/back-end/mybatis-plus/custom-paged-query-join-sql',
              },
            ],
          },
          {
            text: 'Python',
            collapsed: false,
            items: [
              { text: 'python实现用户好友推荐', link: '/back-end/python/friends-recommend' },
              { text: 'python实现话题推荐', link: '/back-end/python/topic-recommend' },
            ],
          },
        ],
        '/notes/source-code/': [{ text: 'Mitt源码学习', link: '/notes/source-code/mitt' }],
      },

      outline: {
        level: 'deep',
        label: '目录',
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/zymbth/' },
        {
          icon: {
            svg: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M512 0c282.784 0 512 229.216 512 512s-229.216 512-512 512S0 794.784 0 512 229.216 0 512 0zm189.952 752l11.2-108.224c-31.904 9.536-100.928 16.128-147.712 16.128-134.464 0-205.728-47.296-195.328-146.304 11.584-110.688 113.152-145.696 232.64-145.696 54.784 0 122.432 8.8 151.296 18.336L768 272.704C724.544 262.24 678.272 256 599.584 256c-203.2 0-388.704 94.88-406.4 263.488C178.336 660.96 303.584 768 535.616 768c80.672 0 138.464-6.432 166.336-16z" fill="#67676c" data-spm-anchor-id="a313x.search_index.0.i4.68503a81hnmfUb" class="selected"/></svg>',
          },
          link: 'https://blog.csdn.net/ymzhaobth',
        },
      ],

      // footer: {
      //   message: 'Released under the MIT License.',
      //   copyright: 'Copyright © 2024 Yuemin Zhao'
      // }
      docFooter: {
        prev: '上一篇',
        next: '下一篇',
      },
      darkModeSwitchLabel: '切换模式',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',
      sidebarMenuLabel: '菜单',
      returnToTopLabel: '回到顶部',

      search: {
        provider: 'local',
      },
    },
    lastUpdated: true,
    /* Vite PWA Options */
    pwa,
    sitemap: {
      hostname: 'https://ymzhao-blog.pages.dev',
    },
  })
)
