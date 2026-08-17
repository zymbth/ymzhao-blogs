---
description: vitepress静态站点生成，学习路线，使用经验
head:
  - - meta
    - name: keywords
      content: vitepress,blogs,markdown,学习路线
created: '2024-06-27'
---

# vitepress静态站点生成

## 介绍

[vitepress](https://vitepress.dev/zh/) 是一个静态站点生成器，专为构建快速、以内容为中心的站点而设计。

它能基于markdown文件生成静态网页！

现在，它已经有完善的中文文档了，可以快速上手构建，以编写markdown文档的形式，构建以内容为中心的网站。例如 vite, vue 等官方文档。

::: tip
vitepress 使用 [Markdown-it](https://github.com/markdown-it/markdown-it) 作为解析器，使用 [Shiki](https://github.com/shikijs/shiki) 来高亮不同语言语法。让文章内容更加“随心所欲”。

还可以[在 Markdown 使用 Vue](https://vitepress.dev/zh/guide/using-vue)，除了html，vue插值语法及指令，还可以在 markdown 中嵌入组件、样式、脚本，使用css预处理器！把静态的markdown变成了vue sfc！
:::

比方说，在文章中，你可以写着写着，突然插入一个demo:

<ClientOnly>
  <DemoIframe height="300" title="CSS-only Custom range slider with motion" src="https://codepen.io/t_afif/embed/preview/MWdmZPL?default-tab=html%2Cresult&editable=true" />
</ClientOnly>

## 学习路线

### 快速上手

浏览官网的[快速上手](https://vitepress.dev/zh/guide/getting-started)部分，先创建一个demo，本地运行查看效果。

### 基本概念

了解以下基本概念

- 路由

VitePress 使用基于文件的路由：每个 `.md` 文件将在相同的路径被编译成为 `.html` 文件

了解[路由](https://vitepress.dev/zh/guide/routing)

- 主题

可以简单理解为网站布局，不改布局的话先直接跳过吧，有了全面的了解后再来研究如何[自定义主题](https://vitepress.dev/zh/guide/custom-theme)

### 配置

#### 1. 站点配置

[站点配置](https://vitepress.dev/zh/reference/site-config)可以定义站点的全局设置，如根目录、lang、title、head等

其它的配置优先级往后放，后面再浏览选用，如 `cleanUrls: true` 可以删除url中的`.html`后缀

#### 2. frontmatter配置

[frontmatter配置](https://vitepress.dev/zh/reference/frontmatter-config)是页面配置，可以用在页面中覆盖站点配置。除此之外，还有很多页面配置，例如，它可以选择页面的布局，默认生成的 `index.md` 中，使用了 `hero` 布局，其它页面默认使用 `doc` 布局。其它的辅助功能都可以快速浏览下。

#### 3. 主题配置

关于如何组织分类内容，[主题配置](https://vitepress.dev/zh/reference/default-theme-config)是首要学习的：

- 导航栏

[导航栏](https://vitepress.dev/zh/reference/default-theme-nav)：需要注意导航栏的嵌套语法

- 侧边栏

[侧边栏](https://vitepress.dev/zh/reference/default-theme-sidebar)：侧边栏更复杂一点。它可以是页面链接组成的一维数组，体现在页面上就是所有链接顺序展示在侧边栏上。可以将链接嵌套(最多6层)实现多级分组，还可以设置多侧边栏，搭配菜单使用。

::: code-group

```js [一级]
export default {
  cleanUrls: true,
  themeConfig: {
    sidebar: [
      { text: 'Page 1', link: '/route/path/page1' },
      { text: 'Page 2', link: '/route/path/page2' },
      // ...
    ]
  }
}
```

```js [多级(最多嵌套6层)]
export default {
  cleanUrls: true,
  themeConfig: {
    sidebar: [
      {
        text: 'Page 1',
        items: [
          { text: 'Page 1-1', link: '/route/path/page1-1' },
          { text: 'Page 1-2', link: '/route/path/page1-2' },
          // ...
        ]
      },
      { text: 'Page 2', link: '/route/path/page2' },
      // ...
    ]
  }
}
```

```js [多侧边栏]
export default {
  cleanUrls: true,
  themeConfig: {
    sidebar: {
      '/front-end/js/': [
        {
          text: 'Page 1',
          items: [
            { text: 'Page 1-1', link: '/front-end/js/page1-1' },
            { text: 'Page 1-2', link: '/front-end/js/page1-2' },
            // ...
          ]
        },
        { text: 'Page 2', link: '/front-end/js/page2' },
        // ...
      ],
      '/front-end/css/': [
        { text: 'Page 3', link: '/front-end/css/page3' },
        // ...
      ],
      '/back-end/': [
        { text: 'Page 4', link: '/back-end/page4' },
        // ...
      ],
      // ...
    }
  }
}
```

:::

#### 4. 写作

- [Markdown 扩展](https://vitepress.dev/zh/guide/markdown)

vitepress 内置了丰富的 Markdown 扩展，例如代码块、代码组、容器、代码高亮等等。你甚至可以在 markdown 文件中导入其它文件内容、包含其它 markdown 文件。

- [在 Markdown 中使用 Vue](https://vitepress.dev/zh/guide/using-vue)

除了上面的 markdown 扩展，vitepress 允许你在 markdown 中直接使用任何 Vue 功能，包括动态模板、使用 Vue 组件或通过添加 `<script>` 标签为页面的 Vue 组件添加逻辑。

#### 5. 其它配置

其它的还有社交链接、深色模式等等，选配方便

## 案例分析

记录一些实践中遇到的功能场景

### 1. Markdown 中使用 Vue 组件

<div class="code-JetBrains" />

```text {3-4}
.vitepress
├─ theme
│  ├─ components
│  │   └─ DemoIframe.vue  # Demo 组件
│  └─ index.js
└─ config.js
```

创建 DemoIframe 组件并全局声明

```js {2,6-8}
import DefaultTheme from 'vitepress/theme'
import DemoIframe from './components/DemoIframe.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoIframe', DemoIframe)
  },
}
```

::: details DemoIframe.vue

> 这里使用 vitepress 提供的引入语法引入代码
>
> `<<< @/.vitepress/theme/components/DemoIframe.vue`

<<< @/.vitepress/theme/Layouts/components/DemoIframe.vue

:::

正文在此处下插入了组件`DemoIframe`：

`<DemoIframe title="Demo Title" src="https://play.vuejs.org/" />`

效果如下:

<DemoIframe title="Demo Title" src="https://play.vuejs.org/" />

### 2. Markdown 内容替换

> markdown扩展 VS markdown内组件 VS markdown内容替换
>
> - Vitepress 提供的 Markdown 扩展会解析指定格式的 md 内容
> - Vitepress 在解析 markdown 文件时，文件内使用的 Vue 组件也会被它编译
> - 在 markdown 渲染器中更改 markdown 内容

有时，我们希望批量得对 Markdown (渲染后的)内容做些自定义更改或替换，例如：

1. 文章页标题默认为 markdown 的一级标题，如何在标题后添加自定义的标签呢？
2. 如何在标题下批量插入一行文章元数据信息呢？（发布时间、字数、点击数等等）
3. 如何统一为文章内的图片添加图片查看器？

这类自定义需求下，如果还通过前两种方式：

一方面书写繁琐，只能是通过手动添加 Vue 组件，添加在每个需要的 markdown 文件中。

另一方面，只能是“插入”，无法“更改”、“替换”，且无法插入到 markdown 渲染单元内部。

::: code-group

```js [.vitepress/config.js]{11,13,18}
export default {
  // ...
  markdown: {
    // 对markdown中的内容进行替换或者批量处理
    config: (md) => {
      // 创建 markdown-it 插件
      md.use((md) => {
        // 重写标题关闭标签的渲染规则
        md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
          if (tokens[idx].tag !== 'h1') return slf.renderToken(tokens, idx, options)
          // REQ1：标题内追加标签组件（TitleBadge）
          let htmlResult = '<TitleBadge />' + slf.renderToken(tokens, idx, options)
          // REQ2：标题下添加文章元数据组件（DocTitleMeta）
          htmlResult += `<doc-title-meta />`
          return htmlResult
        }

        // REQ3：自动为所有图片添加 v-viewer 查看器支持
        const defaultImageRender = md.renderer.rules.image
        md.renderer.rules.image = (tokens, idx, options, env, slf) => {
          const imgHtml = defaultImageRender
            ? defaultImageRender(tokens, idx, options, env, slf)
            : slf.renderToken(tokens, idx, options)
          // 用 ClientOnly 和 v-viewer 容器包装图片
          return `<ClientOnly><div v-viewer>${imgHtml}</div></ClientOnly>`
        }
      })
    }
  }
}
```

```js [.vitepress/theme/index.js]
import DefaultTheme from 'vitepress/theme'
import DocTitleMeta from './components/DocTitleMeta.vue'
import TitleBadge from './components/TitleBadge.vue'
import useViewer from './useViewer'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('DocTitleMeta', DocTitleMeta)
    app.component('TitleBadge', TitleBadge)
    useViewer(app)
  },
}
```

:::

### 3. 字体更换

> [扩展默认主题 - 使用自定义字体](https://vitepress.dev/zh/guide/extending-default-theme#using-different-fonts)

::: code-group

```js [theme/index.js]
import DefaultTheme from 'vitepress/theme' // [!code --]
import DefaultTheme from 'vitepress/theme-without-fonts' // [!code ++]
import './styles/fonts.css' // [!code ++]
import './styles/custom.css' // [!code ++]

export default DefaultTheme
```

```css [theme/styles/fonts.css]
@font-face {
  font-family: 'ComicShannsMono Regular';
  src: url(./ComicShannsMono-Regular.ttf);
}
```

```css [theme/styles/custom.css]
:root {
  --vp-font-family-base: 'ComicShannsMono Regular', '思源黑体', '微软雅黑'; /* normal text font */
  --vp-font-family-mono: 'ComicShannsMono Regular'; /* code font */
}
```

:::

其实也就是简单的样式更改，关键在于规范引入样式

### 4. 深色主题样式补充

基于上一小节，添加样式及深色样式。以滚动条样式为例：

::: code-group

```js [theme/index.js]
import DefaultTheme from 'vitepress/theme-without-fonts'
import Layout from './Layout.vue'
import './font/font.css'
import './style/custom.css'
import './style/scrollbar.css' // [!code ++]

export default {
  ...DefaultTheme,
  Layout,
}
```

```css [theme/style/custom.css]
:root {
  /* 代码高亮bg */
  --vp-code-line-highlight-color: rgb(96, 215, 255, 0.2);
  /* 滚动条 */
  --scrollbar-bg: rgb(239, 239, 239);
  --scrollbar-thumb-bg: rgba(144, 147, 153, 0.3);
  --scrollbar-thumb-hover-bg: rgba(144, 147, 153, 0.5);
  --scrollbar-thumb-active-bg: rgba(144, 147, 153, 0.4);
  --scrollbar-thumb-border-color: rgba(255, 255, 255, 0.4);
  --scrollbar-corner-bg: rgba(255, 255, 255, 0.3);
  --scrollbar-corner-hover-bg: rgba(144, 147, 153, 0.15);
}
.dark {
  --vp-code-line-highlight-color: rgb(0, 110, 146, 0.2);
  --scrollbar-bg: rgb(66, 66, 66);
  --scrollbar-thumb-bg: rgba(192, 192, 192, 0.3);
  --scrollbar-thumb-hover-bg: rgba(192, 192, 192, 0.5);
  --scrollbar-thumb-active-bg: rgba(192, 192, 192, 0.4);
  --scrollbar-thumb-border-color: rgba(0, 0, 0, 0.4);
  --scrollbar-corner-bg: rgba(192, 192, 192, 0.3);
  --scrollbar-corner-hover-bg: rgba(192, 192, 192, 0.15);
}
```

```css [theme/style/scrollbar.css]
/* scrollbar */
::-webkit-scrollbar-track-piece {
  background: var(--scrollbar-bg);
}
::-webkit-scrollbar {
  width: 12px !important;
  height: 12px !important;
  background: transparent;
}
::-webkit-scrollbar:hover {
  background: rgba(128, 128, 128, 0.2);
}
/* thumb */
::-webkit-scrollbar-thumb {
  border: 1px solid var(--scrollbar-thumb-border-color) !important;
  background-color: var(--scrollbar-thumb-bg) !important;
  z-index: 2147483647;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  background-clip: content-box;
  transition: 0.3s background-color;
  cursor: pointer;
}
::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover-bg) !important;
}
::-webkit-scrollbar-thumb:active {
  background-color: var(--scrollbar-thumb-active-bg) !important;
}
/* corner */
::-webkit-scrollbar-corner {
  background-color: var(--scrollbar-corner-bg);
  border: 1px solid transparent;
}
::-webkit-scrollbar-corner:hover {
  background-color: var(--scrollbar-corner-hover-bg) !important;
}
```

:::

常见适配方案均可

### 5. 接入评论

> [utterances](https://utteranc.es/)：A lightweight comments widget built on GitHub issues. Use GitHub issues for blog comments, wiki pages and more!

接入很方便，选择好选项后，将 `script` 拷贝至页面中即可。vitepress需要多做一点，因为页面是对应markdown文件的，不会有人愿意在每个markdown中添加上面的 `script` 吧？

这里就需要稍微更改下vitepress的默认主题了([扩展默认主题](https://vitepress.dev/zh/guide/extending-default-theme))

初始目录结构：

<div class="code-JetBrains" />

```text
.vitepress
├─ theme
│  └─ index.js   # 主题入口
└─ config.js     # 配置文件
```

下面从上至下展示如何更改

`index.js`中如下覆盖默认主题的布局：

```js
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue' // [!code ++]

export default {
  ...DefaultTheme,
  Layout, // [!code ++]
}
```

::: code-group

```vue [Layout.vue]
<script setup>
import { useData } from 'vitepress'
import Theme from 'vitepress/theme'
import Comment from './Comment.vue'

const { Layout } = Theme
const { page } = useData()
</script>
<template>
  <Layout>
    <template #doc-after>
      <Comment :key="page.relativePath" />
    </template>
  </Layout>
</template>
```

```vue [Comment.vue]
<script setup>
import { onMounted, watch } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://utteranc.es/client.js'
  script.setAttribute('repo', 'owner/repo')
  script.setAttribute('issue-term', 'pathname')
  script.setAttribute('theme', isDark.value ? 'github-dark' : 'github-light')
  script.setAttribute('label', 'comment')
  script.async = true
  script.crossOrigin = 'anonymous'
  document.querySelector('#comment').appendChild(script)

  watch(isDark, updUtteranceTheme)
})

function updUtteranceTheme(isDark) {
  const utterances = document.querySelector('#comment iframe')
  if (!utterances) return
  utterances.contentWindow.postMessage(
    { type: 'set-theme', theme: isDark ? 'github-dark' : 'github-light' },
    'https://utteranc.es'
  )
}
</script>
<template>
  <div id="comment"></div>
</template>
```

:::

实际上，`Layout.vue` 中并没有重写 `Layout`，仅仅只是通过其插槽渲染评论组件而已。当然，你完全可以重写以完全自定义。更多插槽参见官网[扩展默认主题-布局插槽](https://vitepress.dev/zh/guide/extending-default-theme#layout-slots)

最终的目录结构：

<div class="code-JetBrains" />

```text {3-4}
.vitepress
├─ theme
│  ├─ Comment.vue # 评论组件
│  ├─ Layout.vue  # 扩展的默认主题布局
│  └─ index.js    # 主题入口
└─ config.js      # 配置文件
```

### 6. PWA

> 相关链接：
>
> [渐进式 Web 应用（PWA）](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)
>
> [vite-pwa](https://vite-pwa-org.netlify.app/)
>
> [vite-pwa/vitepress](https://github.com/vite-pwa/vitepress)
>
> [Learn PWA](https://web.dev/learn/pwa/)

::: details install

```bash
npm i @vite-pwa/vitepress -D 

# yarn 
yarn add @vite-pwa/vitepress -D

# pnpm 
pnpm add @vite-pwa/vitepress -D
```

:::

::: details usage

```js
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'

export default withPwa(defineConfig({
  /* your VitePress options */
  /* Vite PWA Options */
  pwa: {}
}))
```

:::

> [生成 sitemap](https://vitepress.dev/zh/guide/sitemap-generation#sitemap-generation)

```js
export default defineConfig({
  sitemap: {
    hostname: 'https://example.com'
  }
})
```
