---
description: 使用 compressorjs 压缩图片，并使用 Promise 封装，方便链式调用。
head:
  - - meta
    - name: keywords
      content: compressorjs,压缩,图片,promise
created: '2024-09-06'
---

# 使用 compressorjs 压缩图片

> [compressorjs - repo](https://github.com/fengyuanchen/compressorjs)
>
> [compressorjs - Website](https://fengyuanchen.github.io/compressorjs)

官方提示：

> JavaScript image compressor. Uses the Browser's native [canvas.toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) API to do the compression work, which means it is **lossy compression**, **asynchronous**, and has **different compression effects in different browsers**. Generally use this to precompress a image on the client side before uploading it.

## 安装

::: code-group

```sh [npm]
npm install compressorjs
```

```sh [yarn]
yarn add compressorjs
```

```sh [pnpm]
pnpm add compressorjs
```

:::

## 示例

```js
import axios from 'axios'
import Compressor from 'compressorjs'

document.getElementById('file').addEventListener('change', e => {
  const file = e.target.files[0]

  if (!file) return

  new Compressor(file, {
    quality: 0.6,

    // The compression process is asynchronous,
    // which means you have to access the `result` in the `success` hook function.
    success(result) {
      const formData = new FormData()

      // The third parameter is required for server
      formData.append('file', result, result.name)

      // Send the compressed image file to server with XMLHttpRequest.
      axios.post('/path/to/upload', formData).then(() => {
        console.log('Upload success')
      })
    },
    error(err) {
      console.log(err.message)
    },
  })
})
```

## 封装

compressorjs 使用的是回调函数处理结果，这里使用 Promise 简单封装下，方便使用。

::: code-group

```js [/src/utils/compressor.js]
import Compressor from 'compressorjs'

export function getCompressedImage(file, options = {}) {
  return new Promise((resolve, reject) => {
    new Compressor(file, { ...options, success: resolve, error: reject })
  })
}
```

```vue [/src/App.vue]
<script setup>
import axios from 'axios'
import { getCompressedImage } from '@/utils/compressor.js'

document.getElementById('file').addEventListener('change', async e => {
  const file = e.target.files[0]

  if (!file) return

  try {
    const result = await getCompressedImage(file, { quality: 0.6 })
    const formData = new FormData()

    formData.append('file', result, result.name)

    axios.post('/path/to/upload', formData).then(() => {
      console.log('Upload success')
    })
  } catch (err) {
    console.log(err.message)
  }
})
</script>
<template>
  <input type="file" id="file" />
</template>
```

:::

## 实例-图片转 base64

使用 Promise 封装后，可方便得进行链式调用

::: code-group

```vue [comp.vue]
<script setup>
import headerImgPath from './assets/report_yemei.png'
import fetchImgBase64 from '@/use/fetchImgBase64'

const headerImg = ref('')

onMounted(async () => {
  headerImg = await fetchImgBase64(headerImgPath)
})
</script>
<template>
  <div>{{ headerImg }}</div>
</template>
```

```js [/src/use/fetchImgBase64.js]
import { fileToBase64 } from '@/utils/file.js'
import { getCompressedImage } from '@/utils/compressor.js'

// 图片转 base64
export default imgPath => {
  return new Promise((resolve, reject) => {
    fetch(imgPath)
      .then(response => response.blob())
      .then(blob => getCompressedImage(blob))
      .then(blob => fileToBase64(blob, true))
      .then(base64Str => resolve(base64Str))
      .catch(err => reject(err))
  })
}
```

```js [/src/use/file.js]
// 文件转 base64
export function fileToBase64(file, saveType = false) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function () {
      const res = reader.result
      resolve(saveType ? res : res.split(',')[1])
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.readAsDataURL(file)
  })
}
```

:::
