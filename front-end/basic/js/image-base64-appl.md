---
description: 图片base64编码、解码、下载，介绍图片base64编码解码，Blob/File 的URL创建、访问与下载
head:
  - - meta
    - name: keywords
      content: image,图片,base64,blob,download
created: '2024-06-20'
---

# 图片base64编码、解码、下载

> 参考：
>
> [js - 图片base64转file文件的两种方式](https://blog.csdn.net/qq_43886365/article/details/126729188)
>
> [一文掌握：图片转Base64编码的原理、实践（自定义图片本地缓存等）以及优化事项](https://blog.csdn.net/u012347650/article/details/139339767)

<ClientOnly>
  <iframe height="500" style="width: 100%;" scrolling="no" title="image-base64-and-download" src="https://codepen.io/zymbth/embed/preview/mdYXWbq?default-tab=result&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href="https://codepen.io/zymbth/pen/mdYXWbq">
    image-base64-and-download</a> by zymbth (<a href="https://codepen.io/zymbth">@zymbth</a>)
    on <a href="https://codepen.io">CodePen</a>.
  </iframe>
</ClientOnly>

## base64 编码

使用 `FileReader` 进行图片 base64 编码

> 相关 API:
>
> [FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)
>
> FileReader 接口允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 或 [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象指定要读取的文件或数据。
>
> [FileReader.readAsDataURL()](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsDataURL): 开始读取指定的 Blob 中的内容。一旦完成，result 属性中将包含一个表示文件数据的 data: URL。

```js
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function () {
      resolve(reader.result)
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.readAsDataURL(file)
  })
}
```

异步返回编码结果，使用 Promise 处理下。

`reader.result` 返回的结果示例：
`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8BAMAAADI0sRBAAAAMFBMVEUAAAA6jf85gOU4gOY5geg4geg5f+U5gOVDhek4f+Y5gOU5gOY4gOY5f+Y5gOY4f+WrWTliAAAAD3RSTlMACLuEYTHu7RfWqdSaeG1d0WnXAAAA1UlEQVQ4y+3NMQ4BURjEcYJEJGTjBk5gb0CvoFK5g0qvdQMdN9C4gt4RnGFJhGZkd4rx3u5UotuveZn888tr1PfHu3yPVVx7z4VGZ32M8gkbjSXeYe0D5MTANcjNMciJkSUhH+ZceKQibrC4sOPCZS5suHAVF67kFpMTW05sObHjxJZbnJBnfOPaPZMTz7ZR3mFasAK3sY/wAQ+tOV4hHwDkxMAt5BOQE+Me/d3KuXCqIm6wuLDjwmUubDix4xaTE1tObDmx48SWE1tO7Dmx5Wmjvp/vAyEMu6yym5PNAAAAAElFTkSuQmCC`

上例中，file 为明确选择或请求的图片，不能按路径名或 url 读取文件

## base64 解码

> 相关 API:
>
> [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob): Blob 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取
>
> [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File): File 对象是一种特定类型的 Blob，并且可以在 Blob 可以使用的任何上下文中使用。
>
> [atob()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/atob): Window 接口的 atob() 函数会对经过 Base64 编码的字符串进行解码
>
> [Uint8Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array): 数组类型表示一个 8 位无符号整型数组，创建时内容被初始化为 0。创建完后，可以以对象的方式或使用数组下标索引的方式引用数组中的元素。原型为 [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

将图片 base64 解码为 Blob/File 对象：

```js
function base64ToFile(base64Data, fileName) {
  const [_, type = 'image/png', base64Str] = base64Data.match(/^data:(image\/\w+);base64,(.+)/)
  if (!base64Str) throw 'Invalid base64 data'
  let byteCharacters = atob(base64Str)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type })
  return new File([blob], fileName + type.split('/')[1], { type })
}
```

先从图片 base64 中提取图片类型、base64 字符串，再对 base64 字符串进行解码，再将解码后的字符串转换成 Unicode 数组以便 Blob 构造函数生成 Blob 对象。Blob 对象转换成 File 对象就很方便了。

## Blob 转换 URL

> 相关 API:
>
> [URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL): `URL` 接口用于解析，构造，规范化和编码 URL。如果浏览器尚不支持 `URL()` 构造函数，则可以使用 Window 中的 Window.URL 属性。确保检查你的任何目标浏览器是否要求对此添加前缀。
>
> [createObjectURL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL_static): `URL` 接口的静态方法，创建一个用于表示参数中给出的对象的 URL 的字符串。URL 的生命周期与其创建时所在窗口的 document 绑定在一起。新对象 URL 代表指定的 File 对象或 Blob 对象。要释放对象 URL，请调用 `revokeObjectURL()`。
>
> [revokeObjectURL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/revokeObjectURL_static): `URL` 接口静态方法，用于释放之前通过调用 `URL.createObjectURL()` 创建的现有对象 URL。当你完成对对象 URL 的使用后，请调用此方法，让浏览器知道无需再保持对文件的引用。

创建 Blob 对象或 File 对象的 URL：

```js
function getObjectURL(file) {
  let url
  if (window.createObjectURL != undefined) {
    url = window.createObjectURL(file)
  } else if (window.URL != undefined) {
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL != undefined) {
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}
```

可用于在页面上显示上面 Blob/File 类型的图片而无需进行 base64 编码处理

### URL 应用-显示图片

```vue
<script setup>
  import { ref, onMounted } from 'vue'

  const file = ref()
  function handleFileUpdload(e) {
    file.value = e.target.files[0]
  }
  function getObjectURL(file) {
    let url
    if (window.createObjectURL != undefined) {
      url = window.createObjectURL(file)
    } else if (window.URL != undefined) {
      url = window.URL.createObjectURL(file)
    } else if (window.webkitURL != undefined) {
      url = window.webkitURL.createObjectURL(file)
    }
    return url
  }
</script>
<template>
  <input type="file" accept="image/*" @change="handleFileUpdload" />
  <div v-if="file">
    <label>Image:</label>
    <img :src="getObjectURL(file)" />
  </div>
</template>
```

### URL 应用-下载图片

通过创建 URL，下载 Blob/File 类型的文件：

```js
function downloadViaFile(file) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(file)
  link.download = 'unknown-file-name'
  link.click()
  URL.revokeObjectURL(file)
}
```

base64 图片需先调用 `base64ToFile` 方法转换后再下载

### URL 应用-查看图片

```js
function openInWindow(file) {
  window.open(URL.createObjectURL(file), '_blank')
}
```
