# 中文字符串base64编码、解码

## 常规base64编码、解码

编码：`btoa(str)`

解码：`atob(encodedString)`

但当编码的字符串中包含中文字符时，会报异常

`btoa('abc:上下')`:

::: danger
Uncaught DOMException: Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.
:::

## unescape

> [unescape()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/unescape): 是由浏览器实现的非标准函数，可能存在兼容性问题

编码：`btoa(unescape(encodeURIComponent('abc:上下')))`

解码：`decodeURIComponent(escape(atob(encodedString)))`

## TextEncoder / TextDecoder

> [TextEncoder](https://developer.mozilla.org/zh-CN/docs/Web/API/TextEncoder): TextEncoder 接受码位流作为输入，并提供 UTF-8 字节流作为输出。
>
> [TextDecoder](https://developer.mozilla.org/zh-CN/docs/Web/API/TextDecoder): TextDecoder 接口表示一个文本解码器，一个解码器只支持一种特定文本编码，例如 UTF-8、ISO-8859-2、KOI8-R、GBK，等等。解码器将字节流作为输入，并提供码位流作为输出。
>
> [兼容性](https://caniuse.com/?search=TextEncoder)

```js
// 中文base64编码
function base64ZhEncode(originalString) {
  // 将字符串转换为UTF-8编码的二进制数据
  const utf8Bytes = new TextEncoder().encode(originalString)
  // 将二进制数据转换为Base64编码的字符串
  return window.btoa(String.fromCharCode.apply(null, utf8Bytes))
}

// 中文base64解码
function base64ZhDecode(encodedString) {
  // 将Base64编码的字符串转换为二进制数据
  const binaryData = window.atob(encodedString)
  // 将二进制数据转换为Uint8Array类型
  const uint8Array = new Uint8Array(binaryData.length)
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i)
  }
  // 将Uint8Array类型的数据转换为字符串
  return new TextDecoder().decode(uint8Array)
}
```
