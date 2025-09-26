import { withPwa } from '@vite-pwa/vitepress'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'
import scanPostPlugin from '../_plugins/vitepress-plugin-scan-post'
import { pwa } from './pwa'

const root = process.cwd()

// https://vitepress.dev/reference/site-config
export default withPwa(
  defineConfig({
    lang: 'zh-Hans',
    title: 'Corner Blog',
    description: '欢迎来到我的角落，记录琐碎的技术思考与经验分享。',
    // base: '/ymzhao-blogs/',
    cleanUrls: true,
    head: [
      ['link', { rel: 'icon', href: '/icon.svg' }],
      ['meta', { name: 'author', content: 'Yuemin Zhao' }],
      // https://wiki.whatwg.org/wiki/MetaExtensions
      // ['link', { rel: 'schema.dc', href: 'http://purl.org/dc/elements/1.1/' }],
      // Google Analytics
      [
        'script',
        { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-JVS3K26YMP' }
      ],
      [
        'script',
        {},
        `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-JVS3K26YMP');`
      ]
    ],
    themeConfig: {
      siteTitle: 'Corner Blog',
      logo: '/icon.svg',
      // 📖📚📓📔📃📜📝💾📋🛠🐞

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

      // docFooter: {
      //   prev: '上一篇',
      //   next: '下一篇',
      // },
      darkModeSwitchLabel: '切换模式',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',
      sidebarMenuLabel: '菜单',
      returnToTopLabel: '回到顶部',
      externalLinkIcon: true,

      search: {
        provider: 'local',
      },
    },
    lastUpdated: true,
    lastUpdatedText: '最后更新于',
    markdown: {
      lineNumbers: true,
      /**
       * 代码高亮主题
       *
       * @see https://shiki.tmrs.site/themes
       * 备选：
       * - { light: 'material-theme-lighter', dark: 'material-theme-darker' }
       * - { light: 'min-light', dark: 'min-dark' }
       * - { light: 'slack-ochin', dark: 'slack-dark' }
       * - dark: monokai, night-owl, material-theme, nord, tokyo-night, dracula, houston
       */
      theme: { light: 'min-light', dark: 'min-dark' },
      image: {
        lazyLoading: true,
      },
      // 对markdown中的内容进行替换或者批量处理
      config: (md) => {
        // 创建 markdown-it 插件
        md.use((md) => {
          // 组件插入h1标题下
          md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
            if (tokens[idx].tag !== 'h1') return slf.renderToken(tokens, idx, options)
            let htmlResult = slf.renderToken(tokens, idx, options)
            htmlResult += `<doc-title-meta />`
            return htmlResult
          }
        })
      }
    },
    vite: {
      resolve: {
        extensions: ['.mjs', '.cjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less', '.css'],
        alias: [
          {
            find: /@\//,
            replacement: `${root}/`,
          },
        ],
      },
      plugins: [vueJsx(), UnoCSS(), scanPostPlugin({ flag: process.env.UPD_POST })],
      server: {
        port: 5200,
        host: '0.0.0.0',
      },
      build: {
        target: 'esnext',
      },
    },
    /* Vite PWA Options */
    pwa,
    sitemap: {
      hostname: 'https://blog.ymzhao.work',
    },
  })
)
