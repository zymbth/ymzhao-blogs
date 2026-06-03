---
description: 介绍在Vue3项目中或纯JS调用TinyMCE，该工具提供高性能、插件丰富的免费版本
head:
  - - meta
    - name: keywords
      content: vue,tinymce,rtf,富文本编辑器,free
created: '2026-6-3'
---

# Vue3或纯JS调用TinyMCE

## 简介

> 相关链接
>
> - [TinyMCE官网](https://www.tiny.cloud)
> - [TinyMCE官方文档](https://www.tiny.cloud/docs/tinymce/latest/)
> - [TinyMCE仓库地址](https://github.com/tinymce/tinymce)

TinyMCE 是 github 上 star 超 16k 的富文本编辑器

- 提供足够丰富且功能强大的免费版
- 可定制性强、可拓展性高
- 支持集成到 React/Vue/Angular 中

本文旨在快速应用，详细配置参阅官方文档

## 使用

官方提供了 TinyMCE Vue 组件，易于集成到 Vue3 项目中。推荐第二种方式

### 方式一：下载完整 TinyMCE 包作为静态资源

[官网文档](https://www.tiny.cloud/docs/tinymce/latest/vue-pm/)

安装依赖：`pnpm add tinymce @tinymce/tinymce-vue`

参照上面的文档或者手动将 `/node_modules/tinymce/` 拷贝至 `/public/tinymce/`

语言包可从 [Tiny - Language Packages](https://www.tiny.cloud/get-tiny/language-packages/) 下载，保存至 `/public/tinymce/langs/`，例如：`'/public/tinymce/langs/zh-CN.js'`

```vue {3,10,17,23-28}
<script setup>
import { ref } from 'vue'
import Editor from '@tinymce/tinymce-vue'

// 富文本内容
const reportContent = ref('<p>Hello!</p>')

// TinyMCE 配置
const config = {
  base_url: '/tinymce',
  suffix: '.min',
  // anchor charmap insertdatetime visualblocks help wordcount
  plugins: 'anchor lists advlist autolink charmap code media help',
  toolbar: 'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  height: 500,
  language: 'zh-CN',
  language_url: '/tinymce/langs/zh-CN.js',
}
</script>

<template>
  <div class="editor-container" element-loading-text="初始化编辑器...">
    <Editor
      v-model="reportContent"
      licenseKey="gpl"
      tinymce-script-src="/tinymce/tinymce.min.js"
      :init="config"
    />
  </div>
</template>

<style scoped>
.editor-container {
  overflow: auto;
}
.editor-container :deep(>textarea) {
  position: absolute;
  opacity: 0;
  visibility: hidden;
  overflow: hidden;
  z-index: -1;
}
.editor-container :deep(.tox .tox-edit-area::before) {
  border-color: var(--el-color-primary);
}
.editor-container :deep(.tox .tox-toolbar__primary) {
  justify-content: center;
}
</style>
```

### 方式二：正常引入

相比于第一种，版本更新方便，但需要手动配置这些功能：

- 手动引入工具类
- 引入**主题样式**文件并处理**样式隔离**
- 引入所需**编辑器插件**
- 安装 `tinymce-i18n` 应用中文翻译

::: code-group

```js [editor.js]
/**
 * TinyMCE 富文本编辑工具类
 * @see https://www.tiny.cloud/docs/tinymce/latest/vue-pm-bundle/
 */

// Add the @tinymce/tinymce-vue wrapper to the bundle
import Editor from '@tinymce/tinymce-vue'

// Content styles as inline strings (applied inside editor iframe via content_style)
import contentCss from 'tinymce/skins/content/default/content.min.css?inline'
import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css?inline'
// Editor skin CSS - imported as string to avoid global pollution
import skinCss from 'tinymce/skins/ui/oxide/skin.min.css?inline'
// Ensure TinyMCE is imported to register the global variable required by other components
import 'tinymce/tinymce'

// DOM model
import 'tinymce/models/dom/model'

// Theme
import 'tinymce/themes/silver'
// Toolbar icons
import 'tinymce/icons/default'
// Import plugins
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/table'
import 'tinymce/plugins/link'

import 'tinymce/plugins/lists'
import 'tinymce/plugins/searchreplace'

// Language pack (side-effect import registers zh-CN locale)
import 'tinymce-i18n/langs8/zh-CN.js'

export { contentCss, contentUiCss, skinCss }

// Export Editor component for use in Vue components
export default Editor
```

```vue {2,5-18,23,55-58,66,83-87} [Editor.vue]
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Editor, { contentCss, contentUiCss, skinCss } from './editor.js'

// 动态注入 skin CSS（仅作用于 .tox 前缀选择器，组件卸载时移除）
let skinStyleEl = null
onMounted(() => {
  skinStyleEl = document.createElement('style')
  skinStyleEl.setAttribute('data-tinymce-skin', '')
  skinStyleEl.textContent = skinCss
  document.head.appendChild(skinStyleEl)
})
onUnmounted(() => {
  if (skinStyleEl) {
    skinStyleEl.remove()
    skinStyleEl = null
  }
})

// 富文本内容
const reportContent = ref('<p>Hello!</p>')
// TinyMCE 内容样式（content CSS 注入 iframe 内部，不污染全局）
const contentStyle = `${contentCss}${contentUiCss}`

// TinyMCE 工具栏
const toolbar = [
  ['undo', 'redo'],
  ['styles'],
  ['bold', 'italic', 'underline', 'forecolor', 'backcolor', 'more_format', 'removeformat'],
  ['align_group', 'bullist', 'numlist'],
  ['link', 'image', 'table', 'hr'],
  ['code', 'fullscreen']
].map(g => g.filter(Boolean).join(' ')).join(' | ')
// TinyMCE Icons
const tinyMCEIcons = {
  'more-txt-icon': `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><path fill="currentColor" d="M10.672 2.611a1 1 0 0 0-1.843 0l-6.75 16a1 1 0 0 0 1.843.778L5.773 15h7.954l1.286 3.047q.237-.046.487-.047c.818 0 1.544.393 2 1a1 1 0 0 0-.078-.389zM12.884 13H6.617L9.75 5.573zM10.5 22a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m6.5-1.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m5 0a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"/></svg>`,
  'paragram-icon': `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><path fill="currentColor" d="M20 19a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm0-4a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm0-4a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2zm0-4a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2zm0-4a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2zm-13.735.089q.332-.054.68-.071a10 10 0 0 1 1.202 0q.315.018.654.071L12 12.742a2 2 0 0 1-.613.196q-.364.062-.622.062q-.406 0-.746-.17q-.33-.168-.53-.854l-1.26-4.052l-.257-.953l-.265-1.05q-.124-.525-.232-.97h-.091l-.373 1.424q-.2.792-.373 1.38l-1.6 5.111a4.5 4.5 0 0 1-.936.098a3.6 3.6 0 0 1-.563-.044a1.8 1.8 0 0 1-.456-.125L3 12.671zm.066 7.836h-.256a5 5 0 0 0-.307-.009a5 5 0 0 0-.257-.009H4.55l.688-1.852h1.069q.15-.009.29-.009q.15-.009.24-.009h1.21q.099 0 .224.01q.132 0 .257.008h1.118l.622 1.852h-.995a4 4 0 0 0-.248.01q-.15 0-.298.008H6.33Z"/></svg>`
}
// TinyMCE Group Buttons
const tinyMCEGroupToolbars = {
  more_format: {
    icon: 'more-txt-icon',
    tooltip: '更多格式',
    items: 'fontsize strikethrough superscript subscript'
  },
  align_group: {
    icon: 'paragram-icon',
    tooltip: '段落排版',
    items: 'alignleft aligncenter alignright alignjustify | lineheight | outdent indent'
  }
}

// TinyMCE 配置
const config = {
  // base_url: '/tinymce',
  // suffix: '.min',
  skin: false,
  content_css: false,
  // anchor charmap insertdatetime visualblocks help wordcount
  plugins: 'advlist autolink code fullscreen image table link lists searchreplace',
  menubar: false,
  statusbar: false,
  toolbar,
  height: 500,
  language: 'zh-CN',
  // language_url: '/tinymce/langs/zh-CN.js',
  content_style: contentStyle,
  setup: (editor) => {
    // 注册图标
    for (const [iconName, opt] of Object.entries(tinyMCEIcons)) {
      editor.ui.registry.addIcon(iconName, opt)
    }
    // 注册分组按钮
    for (const [gName, opt] of Object.entries(tinyMCEGroupToolbars)) {
      editor.ui.registry.addGroupToolbarButton(gName, opt)
    }
  }
}
</script>

<template>
  <div class="editor-container" element-loading-text="初始化编辑器...">
    <Editor
      v-model="reportContent"
      licenseKey="gpl"
      :init="config"
    />
  </div>
</template>

<style scoped>
.editor-container {
  overflow: auto;
}
.editor-container :deep(>textarea) {
  position: absolute;
  opacity: 0;
  visibility: hidden;
  overflow: hidden;
  z-index: -1;
}
.editor-container :deep(.tox .tox-edit-area::before) {
  border-color: var(--el-color-primary);
}
.editor-container :deep(.tox .tox-toolbar__primary) {
  justify-content: center;
}
</style>
```

:::

## 图片上传配置

默认的图片上传需要输入指定url的图片，粘贴本地图片只会显示一个临时的 blob 链接。

TinyMCE 提供自定义上传处理，一般分两种，一是项目有自己的图床，对拷贝以及手动上传的图片，先上传到图床，然后将响应的url返回给编辑器。二是将图片转换成base64。这是官方文档 [TinyMCE - Image and file options](https://www.tiny.cloud/docs/tinymce/latest/file-image-upload/)，扔给AI让它帮你写吧。。。

::: details demo：图片压缩后转base64

接方法二示例，以下仅粘贴新增部分的配置

```js {1,9}
import Compressor from 'compressorjs'

const config = {
  image_title: true,
  image_dimensions: false,
  automatic_uploads: false,
  paste_data_images: true,
  file_picker_types: 'image',
  file_picker_callback: filePickerCallback,
}

/**
 * 图片选择处理
 * @see https://www.tiny.cloud/docs/tinymce/latest/image/#file_picker_callback
 */
function filePickerCallback(cb, _value, _meta) {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')

  input.addEventListener('change', async (e) => {
    const file = e.target.files[0]

    try {
      // 压缩图片
      const { file: compressedFile, base64 } = await getCompressedImg(file)
      /*
        Note: Now we need to register the blob in TinyMCEs image blob
        registry. In the next release this part hopefully won't be
        necessary, as we are looking to handle it internally.
      */
      const uri = registerImageBlob(compressedFile, base64.split(',')[1])
      // call the callback and populate the Title field with the file name
      cb(uri, { title: compressedFile.name })
    } catch (err) {
      console.error(err)
    }
  })

  input.click()
}

/**
 * 压缩图片
 * @param {File} file 图片文件
 * @returns {Promise<{file: File, base64: string}>}
 */
function getCompressedImg(file) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 1920,
      strict: true,
      success(compressedResult) {
        // 压缩失败，则直接读取图片
        getFileAndBase64(compressedResult.size >= file.size ? file : compressedResult).then(resolve, reject)
      },
      error(err) {
        reject(new Error(`图片处理失败: ${err?.message || err}`))
      }
    })
  })
}

/**
 * 读取文件
 * @param {File} file 文件
 * @returns {Promise<{file: File, base64: string}>}
 */
function getFileAndBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve({ file, base64: reader.result })
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsDataURL(file)
  })
}
```

图片上传相关配置项

- `image_title`: 设置图片title(enable title field in the Image dialog)
- `image_dimensions`: 设置图片宽高(disable the image dimensions input field in the image dialog)
- `automatic_uploads`: 图片自动上传(enable automatic uploads of images represented by blob or data URIs)
- `paste_data_images`: 开启拖拽图片上传和本地图片选择
- `file_picker_types`: 文件上传类型
- `file_picker_callback`: 自定义文件上传处理

:::

## 扩展

[注册工具栏按钮](https://www.tiny.cloud/docs/tinymce/latest/apis/tinymce.editor.ui.registry/#addButton)

[注册工具栏分组按钮](https://www.tiny.cloud/docs/tinymce/latest/apis/tinymce.editor.ui.registry/#addGroupToolbarButton)

[Create a plugin for TinyMCE](https://www.tiny.cloud/docs/tinymce/latest/creating-a-plugin/#registering-a-custom-plugin-with-tinymce)

## JS调用

去除 TinyMCE Vue组件外壳，直接引入js包，使用全局变量 `tinymce` 即可：

使用[init](https://www.tiny.cloud/docs/tinymce/latest/apis/tinymce.root/#init)方法携带config参数（需指定`selector`作为实例的css选择器）创建RTF实例
