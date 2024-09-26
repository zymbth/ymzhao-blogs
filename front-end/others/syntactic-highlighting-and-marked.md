---
description: 代码语法高亮 + markdown解析
head:
  - - meta
    - name: keywords
      content: syntax,highlight,markdown
created: '2024-04-30'
---

# 代码语法高亮 + markdown解析

目的：vue项目页面中显示语法高亮的代码，解析渲染 markdown 格式文本

## 代码语法高亮

依赖：highlight.js

> [highlight.js](https://github.com/highlightjs/highlight.js)
> [highlight.js Website](https://highlightjs.org/)
> [highlight.js docs](https://highlightjs.readthedocs.io/)

> vue项目也可以使用 [vue-highlight.js](https://github.com/gluons/vue-highlight.js)

### 1）安装

`npm install highlight.js`

### 2）引入

```js
// 样式文件，可采用喜欢的样式
import 'highlight.js/styles/stackoverflow-light.css'
// import hljs from 'highlight.js' // 引入全部语言
import hljs from 'highlight.js/lib/core'
// import 'highlight.js/lib/common'
// 手动引入代码语言
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'

// 注册语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
```

### 3）使用

具体参考[官网](https://github.com/highlightjs/highlight.js#basic-usage)

主要就是四个方法：highlight, highlightAuto, highlightElement, highlightAll。语法参考[官方文档](https://highlightjs.readthedocs.io/en/latest/api.html#highlight)

## markdown 解析

> [marked](https://github.com/markedjs/marked)

目的：解析 markdown 内容，显示在页面上

### 1）安装

`npm install marked`

### 2）使用示例

```vue
<script setup>
import { marked } from 'marked'
import rawData from './test.md?raw'
</script>
<template>
  <div v-html="marked.parse(rawData)" />
</template>
```

### 3）样式更换

`marked` 可以很快速得解析 markdown 格式的文本。但它不会提供解析后的html样式，需自行编写样式，或引入开源的样式来美化，例如 [github-markdown-css](https://github.com/sindresorhus/github-markdown-css)：

`npm install github-markdown-css`

main.js 中引入样式: `import 'github-markdown-css/github-markdown.css'`

此样式库要求给 markdown 渲染容器添加类 “markdown-body”

## 结合

`marked` 解析后的html文本渲染后，即便编写/引入了样式来美化它，代码块样式仍然不会包含语法高亮，可以结合 `highlight.js` 使用

### 1）示例

组件 md-viewer.vue:

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'

const props = defineProps(['rawData'])

const mdViewerRef = ref()

onMounted(() => {
  mdViewerRef.value.querySelectorAll('pre code').forEach(el => {
    hljs.highlightElement(el)
  })
})
</script>
<template>
  <div ref="mdViewerRef" class="markdown-body" v-html="marked.parse(rawData)" />
</template>
```

vue页面中使用：

```vue
<script setup>
import rawData from './intro.md?raw'
import MDViewer from '@/components/md-viewer.vue'
</script>
<template>
  <MDViewer :raw-data="rawData" />
</template>
```

## 总结

1. `marked` 将 md 格式文本解析为 html 文本

无样式，可在demo中打开浏览器调试验证（[Marked Demo](https://marked.js.org/demo/)）

2. 编写/引入样式

包含对各类常见网页元素的样式美化

3. 代码高亮

代码的语法高亮不同于上一步，`marked` 解析后，代码存放在 `code` 元素内：

\`\`\`js
function func(val) {
  console.log('val:', val)
}
\`\`\`

👇

```html
<pre><code class="language-js">function func(val) {
  console.log('val:', val)
}
</code></pre>
```

`highlight.js` 做的是解析目标代码块内代码，再按它的样式进行“高亮”

👇

```html
<pre><code class="language-js hljs language-javascript" data-highlighted="yes"><span class="hljs-keyword">function</span> <span class="hljs-title function_">func</span>(<span class="hljs-params">val</span>) {
  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">'val:'</span>, val)
}
</code></pre>
```
