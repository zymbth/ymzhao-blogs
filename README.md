# 个人博客

使用 [vitepress](https://vitepress.dev/) 搭建，Cloudflare 部署，[Cornor Blog](https://ymzhao-blog.pages.dev/)

## 项目框架

### 核心框架
- **VitePress 2.0.0** (alpha) - Vue 驱动的静态网站生成器，VuePress 的继任者
- **Vue 3.5.27** - 前端框架

### 样式方案
- **UnoCSS 66.6.0** - 原子化 CSS 引擎
- **@iconify-json/mdi** - Material Design 图标集
- **Sass 1.97.3** - CSS 预处理器

### 功能插件
- **vite-plugin-pwa** (@vite-pwa/vitepress) - PWA 支持
- **VueUse** - Vue 组合式 API 工具库
- **v-viewer** + **viewerjs** - 图片预览组件

### 代码质量与工具
- **ESLint** (@antfu/eslint-config, @unocss/eslint-plugin)
- **Commitlint** - 提交信息规范
- **Husky** + **lint-staged** - Git hooks
- **Commitizen** - 提交信息规范工具

### 构建工具
- Node.js v22.21.1 / PNPM 10.15.0 (通过 Volta 锁定版本)
- 使用 **rimraf** 实现跨平台 rm -rf 操作

### 项目性质
该博客为技术文档站或个人博客站点，配有完整的代码规范和 PWA 支持，适合技术分享和文档编写。

## 本地开发调试

环境：node v18

`npm i` / `pnpm i`

## TODO

- [ ] Demo 组件替换
- [ ] 全屏显示组件
