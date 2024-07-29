---
description: XMLSerializer序列化的dom树中包含style元素时，存在转译bug
head:
  - - meta
    - name: keywords
      content: XMLSerializer,style,转译,bug,serializeToString
---

# XMLSerializer序列化style元素时存在转译bug <Badge type="danger" text="BUG" />

如题，某个需求需要将document对象装换成blob对象

## 问题描述

> 相关文档：
>
> [XMLSerializer](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLSerializer)
>
> [XMLSerializer.serializeToString](https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer/serializeToString)

选择使用 `XMLSerializer` 接口的 `serializeToString` 方法将 DOM 树转换成字符串时，发现样式出现了问题，关键在于将css的后代选择器“>”转译成了“\&gt;”。

::: details 示例

```js{12}
function convertDocToBlob() {
  // 创建一个新的 Document 对象
  const doc = document.implementation.createHTMLDocument('My Document')
  // 在文档中添加一些内容和样式
  const style = doc.createElement('style')
  style.textContent = `body>h1{color:red}`
  const body = doc.body
  body.innerHTML = '<h1>Hello, World!</h1><p>This is a sample document.</p>'
  // 将 style 标签添加到 Document 中
  doc.head.appendChild(style)
  // 将 Document 转换为 Blob
  const htmlString = new XMLSerializer().serializeToString(doc)
  // 创建 Blob 对象
  const blob = new Blob([htmlString], { type: 'text/html' })
  consoleBlob(blob)
  return blob
}

async function consoleBlob(blob) {
  const text = await blob.text()
  console.log(text)
}
```

打印结果：

`<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>My Document</title><style>body&gt;h1{color:red}</style></head><body><h1>Hello, World!</h1><p>This is a sample document.</p></body></html>`

:::

## 分析

`XMLSerializer.serializeToString` 方法用于将 DOM 树序列化为字符串，style标签内的一些特殊字符会被转译。

## 解决方案

使用其它 api 获取 document 内容

```js
function convertDocToBlob() {
  // 创建一个新的 Document 对象
  const doc = document.implementation.createHTMLDocument('My Document')
  // 在文档中添加一些内容和样式
  const style = doc.createElement('style')
  style.textContent = `body>h1{color:red}`
  const body = doc.body
  body.innerHTML = '<h1>Hello, World!</h1><p>This is a sample document.</p>'
  // 将 style 标签添加到 Document 中
  doc.head.appendChild(style)
  // 将 Document 转换为 Blob
  const htmlString = new XMLSerializer().serializeToString(doc) // [!code --]
  const htmlString = doc.documentElement.outerHTML // [!code ++]
  // 创建 Blob 对象
  return new Blob([htmlString], { type: 'text/html' })
}
```
