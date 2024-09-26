---
description: 使用TextEncoder实现含中文字符串的base64编码、解码
head:
  - - meta
    - name: keywords
      content: base64,中文,TextEncoder,utf8
created: '2024-06-25'
---

# 中文字符串base64编码、解码

> [Base64](https://developer.mozilla.org/zh-CN/docs/Glossary/Base64)

## btoa / atob

> [Window：btoa() 方法](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/btoa): 将一个二进制字符串（例如，将字符串中的每一个字节都视为一个二进制数据字节）编码为 Base64 编码的 ASCII 字符串。
>
> [Window：atob() 方法](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/atob): 对经过 Base64 编码的字符串进行解码。

编码：`btoa(stringToEncode)`

解码：`atob(encodedData)`

但当编码的字符串中包含中文字符时，会报异常

`btoa('abc:上下')`:

::: danger
Uncaught DOMException: Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.
:::
_“根据设计，Base64 仅将二进制数据作为其输入。而在 JavaScript 字符串中，这意味着每个字符只能使用**一个字节**表示。所以，如果你将一个字符串传递给 btoa()，而其中包含了需要使用超过一个字节才能表示的字符，你就会得到一个错误，因为这个字符串不能被看作是二进制数据”_

## unescape

> [unescape()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/unescape): 是由浏览器实现的非标准函数，可能存在兼容性问题

编码：`btoa(unescape(encodeURIComponent('abc:上下')))`

解码：`decodeURIComponent(escape(atob(encodedData)))`

## TextEncoder / TextDecoder

> [Base64#Unicode_问题](https://developer.mozilla.org/zh-CN/docs/Glossary/Base64#unicode_%E9%97%AE%E9%A2%98)
>
> [TextEncoder](https://developer.mozilla.org/zh-CN/docs/Web/API/TextEncoder): TextEncoder 接受码位流作为输入，并提供 UTF-8 字节流作为输出。
>
> [TextDecoder](https://developer.mozilla.org/zh-CN/docs/Web/API/TextDecoder): TextDecoder 接口表示一个文本解码器，一个解码器只支持一种特定文本编码，例如 UTF-8、ISO-8859-2、KOI8-R、GBK，等等。解码器将字节流作为输入，并提供码位流作为输出。
>
> [兼容性](https://caniuse.com/?search=TextEncoder)

```js
// 中文base64编码
function base64ZhEncode(stringToEncode) {
  // 将字符串转换为UTF-8编码的二进制数据
  const utf8Bytes = new TextEncoder().encode(stringToEncode)
  // 将二进制数据转换为Base64编码的字符串
  return btoa(String.fromCharCode.apply(null, utf8Bytes))
}

// 中文base64解码
function base64ZhDecode(encodedData) {
  // 将Base64编码的字符串转换为二进制数据
  const binaryData = atob(encodedData)
  // 将二进制数据转换为Uint8Array类型
  const uint8Array = Uint8Array.from(binaryData, (m) => m.codePointAt(0))
  // 将Uint8Array类型的数据转换为字符串
  return new TextDecoder().decode(uint8Array)
}
```
