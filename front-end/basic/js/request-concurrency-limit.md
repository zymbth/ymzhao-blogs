---
description: 使用js实现并发请求控制
head:
  - - meta
    - name: keywords
      content: 并发请求,控制,concurrency,promise,asynchronous
created: '2024-11-25'
---

# js实现并发请求控制

## 批量请求

先想想如何批量请求？

这里创建一个模拟接口的方法供后续示例使用：

```js
function simulateApi(res, delay = 500) {
  return new Promise((resolve, reject) => {
    setTimeout(res ? resolve : reject, delay, res || new Error('Manual error'))
  })
}
```

- `for...of`

```js
async function processItemsSequentially() {
  const result = []
  for (const id of [1, 2, 3, 4, 5]) {
    const data = await simulateApi(id)
    result.push(data)
  }
  console.log(result) // [1, 2, 3, 4, 5]
}

processItemsSequentially()
```

上例是使用for...of实现的顺序请求。

- `Promise.all`

使用数组的 `map` 方法无法返回异步结果，但 [Promise.all](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 可以：

```js
let result = []
Promise.all([1, 2, 3, 4, 5].map(id => simulateApi(id)))
  .then(res => result = res)
  .catch(err => console.error(err))
```

[Promise.allSettled](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) 也可以用于批量请求，其异同这里不再赘述。

## 控制并发请求

某些场景下，我们需要控制页面内并发请求数，而不是一股脑的抛给浏览器

### 工具库

> 相关库：
>
> - [p-limit](https://github.com/sindresorhus/p-limit): Run multiple promise-returning & async functions with limited concurrency
> - [p-queue](https://github.com/sindresorhus/p-queue): Useful for rate-limiting async (or sync) operations.
> - [p-all](https://github.com/sindresorhus/p-all): Run promise-returning & async functions concurrently with optional limited concurrency
> - [p-map](https://github.com/sindresorhus/p-map): Map over promises concurrently

### 自行实现

思路：

- 设置并发上限，记录正在请求的数量
- 当请求数量未达上限时，直接发起请求，更新计数
- 有请求完成时，更新计数
- 当请求数量达到上限时，等待请求完成再发起新的请求

简单来说，就是一个排队等柜台叫号的过程，柜台数也就是并发上限。🤣

以下，仅供参考

[在线演示](https://play.vuejs.org/#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)

::: code-group

```js [utils.js]
export function concurrencyRequest(limit = 5) {
  const tasks = [] // 待请求队列，任务列表
  const queue = [] // 正在请求的队列
  let qId = 0 // 请求id标识
  let qIndex = -1 // 待请求索引

  // 封装请求函数，返回一个控制并发后的promise
  function limitedReqWrap(fn, ...args) {
    const { promise, resolve, reject } = Promise.withResolvers()
    tasks.push({ id: qId++, fn, args, resolve, reject })
    checkQueue()
    return promise
  }
  // 叫号：检查请求队列，从任务列表中添加新的请求
  function checkQueue() {
    if (queue.length >= limit) return // 请求队列已满
    if (!tasks[qIndex + 1]) return // 任务列表已空
    // 从任务列表中添加请求
    queue.push(tasks[++qIndex])
    execReqsInQueue()
  }
  // 执行请求队列中未开始的请求
  function execReqsInQueue() {
    for (const req of queue) {
      if (req.pending) continue
      req.pending = true
      const { id, fn, args, resolve, reject } = req
      fn(...args)
        .then(resolve, reject)
        .finally(() => handleRequestSettled(id))
    }
  }
  // 请求完成。从正在请求队列中移除，尝试添加下一个请求
  function handleRequestSettled(currId) {
    const index = queue.findIndex(p => p.id === currId)
    if (index > -1) {
      queue.splice(index, 1)
      checkQueue()
    }
  }

  return limitedReqWrap
}

export function simulateApi(res, delay = 500) {
  return new Promise((resolve, reject) => {
    setTimeout(res ? resolve : reject, delay, res || new Error('Manual error'))
  })
}
```

```vue [App.vue]
<script setup>
import { ref } from 'vue'
import { simulateApi, concurrencyRequest } from './utils'

const requestList = ref([])
let requestId = 0
const limitedReqWrap = concurrencyRequest()
// 点击添加异步请求
function testFn() {
  const randomNum = Math.random() + 1
  const currReq = { status: 'pending', id: requestId++, res: null, err: null }
  limitedReqWrap(simulateApi, randomNum < 1.16 ? false : randomNum, 1000)
    .then((val) => {
      const target = requestList.value.find(v => v.id === currReq.id)
      target.status = 'resolved'
      target.res = val
    })
    .catch((err) => {
      const target = requestList.value.find(v => v.id === currReq.id)
      target.status = 'rejected'
      target.err = err
    })
  requestList.value.push(currReq)
}
</script>

<template>
  <div>TEST</div>
  <button @click="testFn">
    Request
  </button>
  <hr />
  <ol>
    <li
      v-for="item in requestList"
      :key="item.id"
      :style="{ color: { pending: 'orange', resolved: 'green', rejected: 'red' }[item.status] }"
    >
      Status: {{ item.status }}
      <template v-if="item.status !== 'pending'">
        (
        <span v-if="item.res">Result: {{ item.res || '' }}</span>
        <span v-if="item.err">Error: {{ item.err?.message || item.err || '' }}</span>
        )
      </template>
    </li>
  </ol>
</template>
```

:::
