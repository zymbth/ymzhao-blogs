---
description: 使用新方法Promise.withResolvers实现合并连续请求
head:
  - - meta
    - name: keywords
      content: 合并请求,Promise,withResolvers
---

# 合并连续请求

使用 `Promise.withResolvers()` 合并连续请求。

## 方案一：返回最早的未落定期约

策略：存在未落定的请求时，后续请求返回该期约。该策略思路简明，实现也非常简单。

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

[演练场调试](https://play.vuejs.org/#eNp9VUtv20YQ/itTXkShMuWgPSmyXDd1gBZoG6S5hTmsyaG0Nrlk9iHZUPjfOzu7fARRooNAznzznvl4Tu66Ljs6TDbJ1hRadhYMWtftciWbrtUWzqCxgh4q3TawIOhiVDmDf6Pe45tWWalc68ydeVFFhGbrxiuvilF7Jbya7HNFQmPJ82cDNz5A+vHTcpKfgU1LdvcePzskYU/I70RMLQHuOskuOAhUThVWtgpEObpJl3DOFUAIYmVDVqLpyO/PCk/wh7CYkgvgvLKjqB1mnTOH9DyBV1C3osRyA5WoDa4Ia97WYr+BxQJ6tq7RV2ZWgFr7d6tfQlzv2NcrTkLaCyWmYxT200MhbHGAFGPe4D2SPbJ2qqRwWpML7uSYeCVVmRJ6BzqblXpzM9XCUaJxFsoiH1Y7DjAoYoHs3cCt/89KYcXH60+woeS0vs3IoRF7hC9ffIrkl7LL1TiDOJ40yzKh9yaWo2nRtALf+ne0MdJgmpLztj5yWx+xsEuff6yd9vIDZd46O6FeXV9fr2hdfD4b8L7jDPw/5bBdh6WmdaYXi01X05DpDWB7eLXjXQIjGgTemu2ahKx8cNZS4r8VtSyebvJktkV5srsry2DgG+4nt10Hg+hZwzo81eIB6124igiFWhq72a6DilGlPMLxqmo1BZKUJEjFk8wT2DzhS5ROU6QMQkui/7B/5zN8DYO+X8E8EBmYTqjdgIwjv4VFeFrQPPlRqj0tc/+arNlgbjzs++BkWI++n4G3a6qJnrbrWc+TVWINbWwl99mjaRVxDo82T4q26WSN+t/OrwvVTdWEmNT5um5Pf7HMb+ZqkBcHLJ4uyB/Ns5flyTvKDPUR82TUWdoQtEF9/98/+EzPo7JpS1cT+gfK937vnM8xwH53qqS0ZzjO9k+mR2riB3P/bFGZoajhtHrG5wmx6ZsflD6l+0v2a7z5nrp4mVepp9RRfGZqLrESrmaG5aXjM2I2khWkP9EFBbkk/hCqwLaCt/Fal0uwB92e+DDvtW51uhjgjaO/B7qWkV8Xy+DWk14Xrpg5cX7FHhFQIyNcIL8ZOTA2pBp9Lge2iO8D5DVx8/fC8hcjMkt2kvbA4zuiNukyZs1U/1X0QQ6Q2QOqbwhppieGpXG/pPRZmdobfjEl/8VSNAqpsJzUxE1j8G9r6qduRfXlr6GH9En/P0QXpiE=)

## 方案二：取消旧的请求

参考连续接口请求，处理方案可以是取消所有旧的请求，仅保留最新的请求。

```js {7,10}
export default request => {
  if (!(request instanceof Function)) throw new Error('request must be a function')
  let promise, resolve, reject

  function mergedAsyncRequest(...args) {
    if (promise) {
      reject(new Error('Cancalled'))
    }
    ;({ promise, resolve, reject } = Promise.withResolvers())
    request(...args).then(resolve, reject)
    return promise
  }

  return { mergedAsyncRequest }
}
```

第7行存在一个无效取消的问题，但拒绝一个已落定的期约不会生效也不会报错

[演练场调试](https://play.vuejs.org/#eNqVVU1v20YQ/StTXkShMumgPSmyXNd1gBZoG6S5hTmsyaG0Nrlk9kOyofC/d3Z2RbKNEyAXYbnz5u2bT52Sm77PDg6TdbIxpZa9BYPW9dtCybbvtIUTaKxhgFp3LSwIuihUnkO0OoN/ot7hbaesVK5z5sY8qzKis7z1xotytF4IbyaK7/I3osXRs1BEZyzJ+mTgyqtLP3xcTvcnYKeKid7hJ4d0ORDyK2+llgA3vWQKfgRqp0orOwWiGmnSJZwKBRAesbIlL9H2xPujwiP8JiymRAGsKzuIxmHWO7NPTxN4BU0nKqzWUIvG4Iqw5k0jdmtYLGBg7wZ9ZGYFqLX/tvo5vOuJfbziKKR9IcR0fIV5BiiFLfeQYtQNnpH8ka1TJKXTmig4k6PwWqoqJfQWdDYL9epqioVfic5ZCIs4rHb8wNkQA2R2A9f+N6uEFR8uP8KaxGl9nRGhETuEz5+9ROIldYUaaxDLk2ZZJvTOxHA0dalW4FP/lnpFGkxTIu+aA6f1AUu79Ppj7NTU70l55+yEenV5ebmidvF61uC5Yw38L2nY5GEiaBbow2LbN1Rk+gLY7F9tuZfAtyZw12xyumTjvbOWhP9SNrJ8vCqSWRcVyfamqoKDT7iv3CYPDpFZQx5OjbjHZhvmIUKhkcauN3kwMaqSBzhc1J2mhySJBKm4kkUC60d8jrdTFUlBSEnkD/13OsF/YTAMK5g/RA6mF2p7RsaSX8MinBZUTz5KtaNmHl6TNzvMnc/9fiY5t8cwzMCbnGKi0yaf5TxZJdZQx9Zylz2YTtHC4tIWSdm1vWxQ/937dqG4KZrwJmW+abrjH3znO3N1vi/3WD6+cP9gnvxdkbwlZagPWCSjzVKHoA3mu3/+wic6j8a2q1xD6G8Y3/m+c15jgP3qVEWyZzhW+zsvRkrie3P3ZFGZc1Dn0RoYXyS0im+/Efok96fs5zjzA2Xx/xuVskm5xCdexxXWwjW8W7ndeIB4D8ka0h9odsK9pM0hVIldDW/inC6XYPe6O/JI3mnd6XRxhreOfu5pTsbNulgGWr/u+jC/vA3n8+sRATXughfW3mwtMDZIjZyzW78yPGs603dLMVDSqXmXUY9PUzy8ps39NWn8fxL3TnaUds/FPaA26cQUox8VZnaP6oslNaF5ocUXwy1rCcdofvnPzUOGZPgX7cGtcw==)

## 方案三：返回最后的未落定期约

如果希望实现的是合并，但以最新请求的落定为准，情况可能会有点复杂，需要将未落定的期约保持与最新的期约一致。
