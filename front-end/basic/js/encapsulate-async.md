---
description: 封装async...await...语法糖的异常捕捉，避免try...catch...影响代码可读性，形成块级作用域
head:
  - - meta
    - name: keywords
      content: async,await,封装,trycatch
created: '2022-03-04'
---

# async...await...异常捕捉封装

## 前言

async...await...简化了Promise的写法，尤其是后者多次嵌套的情况下，代码可读性很差。但前者的异常捕获却没那么方便

## async...await...异常捕获

```javascript
function func(val) {
  return new Promise((resolve, reject) => {
    if(val) resolve(val)
    else reject('Invalid value')
  })
}
async function test(val) {
  try {
    const resp = await func(val)
    console.log(resp)
  } catch (err) {
    console.error(err)
  }
}
```

`try...catch...` 让 `async...await...` 的代码既不美观又繁琐

## 封装异常捕获

::: code-group

```javascript [common-methods.js]
export async function asyncFuncWrapper(func, ...args) {
  try {
    const resp = await func(...args)
    return { resp }
  } catch (err) {
    return { err }
  }
}
```

```javascript [demo.vue]
<script>
import { asyncFuncWrapper } from '@/utils/common-methods'

export default {
  methods: {
    func(val) {
      return new Promise((resolve, reject) => {
        if(val) resolve(val)
        else reject('Invalid value')
      })
    }
    async test(val) {
      const { resp, err } = await asyncFuncWrapper(this.func, val)
      if(err) {
        console.error(err)
        return
      }
      console.log(resp)
    }
  }
}
</script>
```

:::

**注意：** 本文封装了Promise的异常捕捉，就像，`try...catch...` 一样，异常 `err` 已经被捕捉了，需自行处理异常。

处理异常时，需考虑到是否有依赖本方法，且也需要捕捉该异常的方法。有则需要手动抛出异常
