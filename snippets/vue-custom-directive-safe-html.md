---
description: Vue3项目中自定义v-safe-html指令时，防止XSS攻击
head:
  - - meta
    - name: keywords
      content: vue,xss,v-html,safe
created: '2025-11-20'
tag: 'AI'
---

# Vue3项目中自定义v-safe-html指令时，防止XSS攻击

## 简介

> Qwen3-Max生成，实测可用

一个生产级、TypeScript 友好、可配置、带错误兜底的 Vue 3 全局指令 `v-safe-html` 的完整封装方案，基于 [DOMPurify](https://github.com/cure53/DOMPurify) 实现 HTML 净化，并支持自定义配置。

## code snippets

::: code-group

```vue [demo.vue]
<template>
  <!-- 基础用法 -->
  <div v-safe-html="article.body"></div>

  <!-- 带配置（局部覆盖全局） -->
  <div v-safe-html:[config]="article.body"></div>

  <!-- 内联配置，使用对象语法 -->
  <div v-safe-html="{
    html: article.body,
    config: { ALLOWED_TAGS: ['p', 'b', 'i'] }
  }"></div>
</template>

<script setup lang="ts">
const config = 'loose'
const article = {
  body: `<p>Hello <b>World</b>!</p>
         <img src=x onerror="alert('xss')"> 
         <a href="javascript:alert(1)">Click</a>`
}
</script>
```

```bash [安装依赖]
npm install dompurify
npm install --save-dev @types/dompurify
```

```ts [src/directives/safeHtml.ts]
import type { Config as DOMPurifyConfig } from 'dompurify'
import type { Directive, DirectiveBinding } from 'vue'
import DOMPurify from 'dompurify'

// 默认净化配置（可根据项目调整）
/* eslint-disable antfu/consistent-list-newline */
const DEFAULT_CONFIG: DOMPurifyConfig = {
  // 基础白名单（保留常用富文本标签）
  ALLOWED_TAGS: [
    'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'span',
    'div', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
    'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'title',
    'class', 'id', 'style', 'width', 'height'
  ],
  // 禁止危险内容
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'on*'],
  // 允许  图片（如 base64），但禁止  script
  ALLOW_DATA_ATTR: true,
  ADD_ATTR: ['target'],
  ADD_TAGS: [],
  // 防止 rel="noopener" 被删（安全跳转）
  ALLOW_UNKNOWN_PROTOCOLS: false // 严格模式：只允许 http/https/mailto 等
}
/* eslint-enable antfu/consistent-list-newline */

// 全局配置（可后续通过插件选项覆盖）
let globalConfig: DOMPurifyConfig = { ...DEFAULT_CONFIG }

/**
 * 安全渲染 HTML 指令：v-safe-html
 *
 * 用法：
 *   v-safe-html="htmlString"
 *   v-safe-html:[configName]="htmlString"         // 使用预设配置
 *   v-safe-html="{ html: str, config: {...} }"    // 内联配置
 */
const vSafeHtml: Directive<HTMLElement, string | SafeHtmlOptions> = {
  mounted(el, binding) {
    updateContent(el, binding)
  },
  updated(el, binding) {
    updateContent(el, binding)
  }
}

interface SafeHtmlOptions {
  html: string
  config?: DOMPurifyConfig
}

function updateContent(el: HTMLElement, binding: DirectiveBinding<string | SafeHtmlOptions>) {
  try {
    let rawHtml = ''
    let localConfig: DOMPurifyConfig | undefined

    // 解析 binding value
    if (typeof binding.value === 'string') {
      rawHtml = binding.value
      // 支持 v-safe-html:[configKey] 语法
      if (binding.arg && typeof binding.arg === 'string') {
        const preset = PRESET_CONFIGS[binding.arg]
        if (preset) {
          localConfig = preset
        } else {
          console.warn(`[v-safe-html] Unknown config preset: "${binding.arg}"`)
        }
      }
    } else if (typeof binding.value === 'object' && binding.value !== null) {
      // 对象语法：{ html: "...", config: {...} }
      rawHtml = binding.value.html || ''
      localConfig = binding.value.config
    } else {
      rawHtml = String(binding.value)
    }

    // 合并配置：local > global > default
    const finalConfig = { ...globalConfig, ...localConfig }

    // 净化 HTML
    const cleanHtml = DOMPurify.sanitize(rawHtml, finalConfig)

    // 安全渲染
    el.innerHTML = cleanHtml

    // 修复：a 标签自动添加 rel="noopener noreferrer"（防 tabnabbing）
    if (Array.isArray(finalConfig.ADD_ATTR) && finalConfig.ADD_ATTR.includes('target')) {
      const links = el.querySelectorAll('a[target="_blank"]')
      links.forEach((link) => {
        if (!link.hasAttribute('rel')) {
          link.setAttribute('rel', 'noopener noreferrer')
        }
      })
    }
  } catch (error) {
    console.error('[v-safe-html] Error rendering safe HTML:', error)
    el.innerHTML = '' // 安全兜底：清空内容
  }
}

// 预设配置（可扩展）
const PRESET_CONFIGS: Record<string, DOMPurifyConfig> = {
  // 仅文本：完全禁用标签
  plain: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  },
  // 宽松模式（如 CMS 后台预览）
  loose: {
    ALLOWED_TAGS: [...DEFAULT_CONFIG.ALLOWED_TAGS!, 'table', 'thead', 'tbody', 'tr', 'td', 'th'],
    ALLOWED_ATTR: [...DEFAULT_CONFIG.ALLOWED_ATTR!, 'colspan', 'rowspan']
  }
}

// 插件安装函数（支持配置）
export function createSafeHtmlDirective(userConfig?: DOMPurifyConfig) {
  if (userConfig) {
    globalConfig = { ...globalConfig, ...userConfig }
  }
  return vSafeHtml
}

// 默认导出（无配置版）
export default vSafeHtml
```

```ts [main.ts]
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import vSafeHtml, { createSafeHtmlDirective } from '@/directives/safeHtml'

const app = createApp(App)

// 方式 A：使用默认配置
app.directive('safe-html', vSafeHtml)

// 方式 B：自定义全局配置（覆盖默认）
// app.directive('safe-html', createSafeHtmlDirective({
//   ALLOWED_TAGS: ['p', 'b', 'i', 'a'],
//   ALLOWED_ATTR: ['href', 'target']
// }))

app.mount('#app')
```

```js [.eslintrc.js]
rules: {
  // 防止 innerHTML 被全局污染（ESLint 规则）
  'no-restricted-properties': [
    'error',
    { object: 'Element', property: 'innerHTML', message: 'Use v-safe-html instead!' }
  ]
}
```

:::
