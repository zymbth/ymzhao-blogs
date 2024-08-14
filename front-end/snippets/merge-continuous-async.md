---
description: 使用新方法Promise.withResolvers实现合并连续请求
head:
  - - meta
    - name: keywords
      content: 合并请求,Promise,withResolvers
---

# 合并连续请求

使用 `Promise.withResolvers()` 合并连续请求

::: code-group

```js [merge-continuous-async.js]
/**
 * 合并相同请求（连续调用包装后的请求方法，前一次调用未完成时，后一次调用返回前一次调用的结果）
 *
 * @param {Function} request
 * @returns {Object} { mergedAsyncRequest: 合并后的异步请求方法 }
 * @example
 * import useMergeContinuousAsync from '@/use/merge-continuous-async'
 *
 * const originalRequestFunction = (...args) => axios.get(...args)
 * const { mergedAsyncRequest } = useMergeContinuousAsync(originalRequestFunction)
 * mergedAsyncRequest(111)
 * setTimeout(mergedAsyncRequest, 200, 222)
 */
export default request => {
  if (!(request instanceof Function)) throw new Error('request must be a function')
  let promise, resolve, reject

  function mergedAsyncRequest(...args) {
    if (promise) return promise
    ;({ promise, resolve, reject } = Promise.withResolvers())
    request(...args)
      .then(resolve, reject)
      .finally(() => {
        promise = undefined
      })
    return promise
  }

  return { mergedAsyncRequest }
}
```

```vue [App.vue]
<script setup>
import { ref } from 'vue'
import useMergeContinuousAsync from './merge-continuous-async'

const reqs = ref([])

const { mergedAsyncRequest } = useMergeContinuousAsync(testApi)

async function addAsyncReq() {
  const timestamp = +new Date()
  reqs.value.push({
    timestamp,
    loaded: false,
    resFlag: ''
  })
  let currReq
  try {
    const res = await mergedAsyncRequest(timestamp)
    currReq = reqs.value.find(r => r.timestamp === timestamp)
    currReq.resFlag = res.data[0]
  } catch (err) { }
  if (currReq) currReq.loaded = true
}

function testApi(...args) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, { data: args })
  })
}
</script>

<template>
  <h1>Merge continuous async</h1>
  <button @click="addAsyncReq">Add async request</button>
  <hr />
  <label>Async request list:</label>
  <div v-for="item in reqs" :key="item.timestamp">
    <label>Flag: {{ item.timestamp }}, </label>
    <span>{{ item.loaded ? 'loaded' : 'loading' }}; </span>
    <span>resFlag:{{ item.resFlag }}</span>
  </div>
</template>
```

:::

[演练场调试](https://play.vuejs.org/#eNp9VUtv00AQ/iuDL7FF6hTBKSSBAkUCiYeAG+awtcfJtvba3UfSKvJ/Z/bhR9W0OUS7M9/MfDsvH6OLtk33BqNltFK55K0Ghdq0m0zwum2khiNILKGDUjY1zAg6G1RG4TeUW/zYCM2FaYy6UPciD9B0UVvlWT5oz5hVk30mSKg0eb5VsLYB4r//klF+BGdaOHe/8NYgCTtCPhEx1gS4aLlz4YJAaUSueSOAFYObOIFjJgB8EM1rsmJ1S35fCjzAJ6YxJhfgeKV7VhlMW6N2sbOC0WLu71XDCiyWULJKYZBJVJ8rtl3CjN4J0Dl/FWrIjZTEwV61vPdEeipkRCTYgXF94uXxENc5IyPvymVuIFpyUcQS1huQ6eRp6/VI+6F5Gqg6NyotmGZ/z/850pAzne8gRikpZdBZIS8hDpbJ4MJngDxoaTATBMzEkPlQlDhNUya3KiRfUntJATbhP6lPuMI4pvhNtcc5Ka8x14l9RUgQdeMf4t8YPaJenZ+fz4mXpbwE6zvk2f4Th9XCtzI1MV001m1FpaUbwGr3auM6CBSrEVyvrBYkdMorozURf59XPL9ZZ9Gkd7Joc1EU3sCm3RZmtfAGwbOEhT9V7AqrjZ+FAIWKK71cLbzKoQq+h/1Z2UgKxIkkcOHqmUWwvMH7IB1rSQx8SoJ/32bHIzyEQdfNYRqIDFTLxKZHhpq9g5k/zYCa1R652M7I+i1ZO4Opcd/WvZO+d7puAl4t6E10Wi0mOY/mkVbU5iXfpteqEbRpXGmzKG/qllcof7S2Xejd9BofkzJfVc3hq5PZ1grDRTY7zG9OyK/VnZVl0U9ihnKPWTToNHUIaq++/P0d7+g8KOumMBWhn1H+sn1nLEcP+2BEQbQnOMf2i1uKlMQ/6vJOo1D9o/xsUHc6fBbRDv34zNNHuq/TN86OmpqyeHqbUk4po3jnFnKBJTOV26uu6dwYyX56X9AEeTmnpcNEjk0Jn8O0JgnonWwObjAvpWxkPOvhtaG/K5qWYavOEu/WLrbWT7Ed3gdTbBEeNWyEE7ttshwc1lMNPpN+W4R7D3kbH58M674TYbOkB653rnx7lCpOAmu34B9E7+UAqd6heLSQJnras1Tu+5g+JmN6/S9Qst8pQaXgAotRTbtpCP74Td2YraA+/Q20kC7q/gO9j6In)
