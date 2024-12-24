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

<ClientOnly>
  <FullScreen>
    <DemoIframe title="js实现并发请求控制" src="https://play.vuejs.org/#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" />
  </FullScreen>
</ClientOnly>

源码：

::: code-group

```js [utils.js]
export function concurrencyRequest(limit = 5) {
  const tasks = [] // 待请求队列、任务列表
  const queue = [] // 正在请求的队列
  let qId = 0 // 请求id标识
  let qIndex = -1 // 待请求索引

  /**
   * 封装请求函数
   *
   * @param {Function} fn 源异步请求函数
   * @returns {Promise} 返回一个应用并发控制后的promise
   */
  function limitedReqWrap(fn, ...args) {
    const { promise, resolve, reject } = Promise.withResolvers()
    tasks.push({ id: qId++, pending: true, fn, args, resolve, reject })
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
      if (!req.pending) continue
      req.pending = false
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
  // 清空待请求队列（tasks）
  function clearTasks() {
    tasks.length = 0
    qIndex = -1
    // 如果支持，可以在这里中断已发起的异步请求（queue）
  }

  return { limitedReqWrap, clearTasks }
}

/**
 * 模拟接口
 *
 * @param {*} res 返回值
 * @param {number} delay 延迟时间
 */
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
const { limitedReqWrap, clearTasks } = concurrencyRequest()
// 添加异步请求
function addRequest() {
  const currReq = { status: 'pending', id: requestId++, res: null, err: null }
  const delay = Math.floor(Math.random() * 500 + 100)
  requestList.value.push(currReq)
  // 模拟请求，延时100ms~600ms响应，小概率失败
  limitedReqWrap(simulateApi, delay < 160 ? false : delay, delay)
    .then((val) => {
      const target = requestList.value.find(v => v.id === currReq.id)
      // console.log('success ', currReq.id)
      if (!target) return
      target.status = 'resolved'
      target.res = val
    })
    .catch((err) => {
      const target = requestList.value.find(v => v.id === currReq.id)
      // console.log('failed: ', currReq.id)
      if (!target) return
      target.status = 'rejected'
      target.err = err
    })
}
function add20Requests() {
  for (let i = 0; i < 20; i++) addRequest()
}
function clear() {
  requestList.value = []
  clearTasks()
}
</script>

<template>
  <!-- <h1>测试：并发请求控制</h1> -->
  <button @click="addRequest">点击添加异步请求</button>
  <button @click="add20Requests">点击添加二十个异步请求</button>
  <button @click="clear">清空</button>
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
