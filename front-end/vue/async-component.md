---
description: Vue异步组件与懒加载组件在性能优化上的作用
head:
  - - meta
    - name: keywords
      content: vue,异步,懒加载,组件
created: '2025-11-04'
isDraft: 't'
---

# Vue异步/懒加载组件

## 异步组件

vue允许你定义异步组件，具体查看[官方文档](https://cn.vuejs.org/guide/components/async.html)。

### 准备

- 基础用法

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器获取组件
    resolve(/* 获取到的组件 */)
  })
})
// ... 像使用其他一般组件一样使用 `AsyncComp`
```

- 结合ES模块动态导入

```js
const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

参数除了定义一个异步加载函数，还可以定义是一个对象，对象中包含加载函数、加载提示组件等，类型定义查看[官方文档](https://cn.vuejs.org/api/general#defineasynccomponent)

::: details 类型

```ts
function defineAsyncComponent(
  source: AsyncComponentLoader | AsyncComponentOptions
): Component

type AsyncComponentLoader = () => Promise<Component>

interface AsyncComponentOptions {
  loader: AsyncComponentLoader
  loadingComponent?: Component
  errorComponent?: Component
  delay?: number
  timeout?: number
  suspensible?: boolean
  onError?: (
    error: Error,
    retry: () => void,
    fail: () => void,
    attempts: number
  ) => any
}
```

:::

### 示例

假设有需要按照接口响应的数据条件选择对应的模板组件：

[在线示例](https://play.vuejs.org/#eNq9VE+P20QU/ypPvjhZBXsT6MVKUhbUA0hABXtb72EaP8eTjmes8TjeVZQDiAMqAiqBBBdUECziUiEktEJsK75Mk/bWr9A34ySbbNs99pKM35/fe+/3/sy8g6IIphV6kdcvR5oXBko0VQGCyfEg9iblSewNY8nzQmkDM9CYdiDBlEs8KE/l6H1FGonSwBxSrXLwCc2PZSxHSpYGEmYYDKxbq30pPcwLYT1J8yqs1iyWAEKxBHUEzOqg1YbBEJwCHGowZaJCQmA145Q2zyvBDB4U3EayVjxtbRkGUsFgMIBum7IxlZbQFNXyg9Dm07XhLRf+te6917j3dt3nnXUJXI43hUWrMvoJnw4X93559vjxk38fBkHQD63E+aDWSr/sURZMQmlOBVJbRkooHWlMqDkNzOL3v5/9c/b80ef90FpaqLkjPNzbI9Q9WP756/LrB8tvzxbf/eYE7xZMsxxmd5QSyOQcjnj5KZZKTPEYFt9/s/jvh+VPfy3u/7H86v7i3oMdH1nld1CTS4KCnZL5xfnyx3NrEsYyreTIcEXZbrVkg00NM7pCO0TkSl/dG/v77aaxK2Il1nCbZomX2Grpxq1DygmOzPYU7EzYR8xkgWYyUTkxNoT94EZjBXCT5laqCLodMNwIjMC3bPz8f9e3aTRzTwmTPE3KjDMFaVZxrOkxRj5RfAxpjRnPOAm0UROSQY0VCXyYr8NEqzC9q2F6FEbwknp55I8JLYWMVwrHGuoUeUZaX5G4TqHiE67SGrJJjRPl8I/XAWgvD3mOqjJbZN4kWppXtCJoRSz9ES/NKNIvYdBguEJpm+nDIM0s9Ya+APpZd7h49MXy4dnTiy+fXJz3QxI4xWZRI0dzSNJ+uOXrdTxTUh9SPg4mpZJ0R1xz7IjmBReoP3HUlrFH9DSFxB4TQtUfOpmbhbV8lOHo7ivk7gpF9LhN1aKeYuxtdIbpMZpGfeuzj/GE3htlrpJKkPU1SsdkZXNszN6rZEJpb9m5bD9wy067fFjeOjEoy3VRNtHLhY89ugCWsNeVfpnu28E7zo+aQyzuXKCr15iIbs4kbUVRto582wz/mPp6bVN7w9msOZVuHmE+p8b2GmWx0W0tgLOw0a72eOfAvYHsKuH+6SU4TN9Klaaj1+KE0AFO0U7a9Nc428WKPYju4inZOCUdRYK21g5U8AY0dKi7pc1fALKQd5A=)

::: code-group

```vue{1,6-14} [App.vue]
<script setup lang="jsx">
import { ref, defineAsyncComponent } from 'vue'

const data = ref()

const TmplComp = defineAsyncComponent({
  loader: async () => {
    data.value = await simulateApi()
    if(data.value.no === 1) return import('./Tmpl1Comp.vue')
    if(data.value.no === 2) return import('./Tmpl2Comp.vue')
  },
  loadingComponent: () => <div>加载中...</div>,
  errorComponent: () => <span style="color:red">加载失败！</span>,
})

/**
 * 模拟接口
 * @param {boolean} [isResolve] 响应是否成功
 * @param {number} [delay] 延时
 */
function simulateApi(isResolve = true, delay = 1500) {
  return new Promise((resolve, reject) => {
    const data = Math.random() > 0.5
      ? { no: 1, title: '模板1', description: 'fdshiao fhuiewao geijoig fwehihio grtojijo weuihi' }
      : { no: 2, title: '模板2', list: ['gjoif hiuoegr wfeih', 'ojoiwf uijiofw hjwejouihi'] }
    setTimeout(isResolve ? resolve : reject, delay, data)
  })
}
</script>

<template>
  <h1>异步组件</h1>
  <TmplComp :data />
</template>
```

```vue [Tmpl1Comp.vue]
<script setup>
defineProps(['data'])
</script>

<template>
  <h2>{{ data.title }}</h2>
  <p>{{ data.description }}</p>
</template>
```

```vue [Tmpl2Comp.vue]
<script setup>
defineProps(['data'])
</script>

<template>
  <h2>{{ data.title }}</h2>
  <ul>
    <li v-for="(item, index) in data.list" :key="index">{{ item }}</li>
  </ul>
</template>
```

:::

::: warning

如果使用了 `onError` 参数，则loader异常时会调用该函数，此时 `errorComponent` 会被忽略

:::

::: details 抽离异步组件内的“接口请求”逻辑

```js{2,6,19,21}
const data = ref()
const { promise: reqPromise, resolve: reqResolve, reject: reqReject } = Promise.withResolvers()

const TmplComp = defineAsyncComponent({
  loader: async () => {
    const data = await reqPromise
    if(data.no === 1) return import('./Tmpl1Comp.vue')
    if(data.no === 2) return import('./Tmpl2Comp.vue')
  },
  loadingComponent: () => <div>加载中...</div>,
  errorComponent: () => <span style="color:red">加载失败!</span>,
})

onMounted(() => show())

async function show() {
  try {
    data.value = await simulateApi()
    reqResolve(data.value)
  } catch (err) {
    reqReject(err)
  }
}
```

:::

以上示例仅用于展示异步组件的使用，这种根据接口响应数据选择加载组件的需求，规范的做法是将其与异步组件解耦，仅供参考：

::: code-group

```vue [App.vue]
<script setup>
import AsyncTmplComp from './AsyncTmplComp.vue'
</script>

<template>
  <h1>异步组件</h1>
  <Suspense>
    <AsyncTmplComp />
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>

```

```vue{8,15} [AsyncTmplComp.vue]
<script setup>
import { ref, shallowRef } from 'vue'
import Tmpl1Comp from './Tmpl1Comp.vue'
import Tmpl2Comp from './Tmpl2Comp.vue'

const data = ref()

const comp = shallowRef()
async function getData() {
  data.value = await simulateApi()
  if(data.value.no === 1) comp.value = Tmpl1Comp
  if(data.value.no === 2) comp.value = Tmpl2Comp
}

await getData() // <script setup> 中直接使用 await 会使该组件成为一个异步 setup 组件，这正是 <Suspense> 能捕获的

// 模拟接口
function simulateApi(isResolve = true, delay = 1500) {
  // ...
}
</script>

<template>
  <component :is="comp" :data />
</template>
```

:::

## 懒加载组件

相比于异步组件，有时处于性能方面的考虑，会希望某些组件在可视时再加载。

### 示例

就像原生支持 `loading="lazy"` 的 `img`/`iframe` 标签一样，思路就是使用 [IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver) API 监听组件是否在可视区域，在的话则加载(`v-if`)组件，否则显示骨架屏。把这个逻辑封装一下，具体业务组件放在默认插槽中。

<DemoIframe title="懒加载组件" src="https://play.vuejs.org/#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" />

::: code-group

```vue [App.vue]
<script setup lang="jsx">
import TestComp from './Comp.vue'
import LazyLoadWrapper from './LazyLoadWrapper.vue'

</script>

<template>
  <h1>懒加载组件</h1>
  <div class="flex-wrap">
    <LazyLoadWrapper
      v-for="p in 30"
      :key="p"
      :style="{ height: '200px', width: '200px' }"
    >
      <TestComp />
    </LazyLoadWrapper>
  </div>
</template>

<style scoped>
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
</style>
```

```vue [Comp.vue]
<script setup>
function formatTimeWithMs() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}
</script>

<template>
  <div class="block">创建时间: {{ formatTimeWithMs() }}</div>
</template>

<style scoped>
.block {
  width: 200px;
  height: 200px;
  background-color: cadetblue;
}
</style>
```

```vue [LazyLoadWrapper.vue]
<template>
  <div ref="target" class="lazy-wrapper" :class="{ loaded: inView }">
    <slot v-if="inView" />
    <!-- 可选：在加载前显示骨架屏 -->
    <div v-else class="placeholder" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const target = ref()
const inView = ref(false) // 状态：是否已进入视口

let observer = null

onMounted(() => {
  // 创建 IntersectionObserver 实例
  observer = new IntersectionObserver(
    ([entry]) => {
      // 当元素与视口交叉时，entry.isIntersecting 将为 true
      if (entry.isIntersecting) {
        inView.value = true // 更新状态，触发组件加载
        observer.unobserve(target.value) // 停止观察
        observer.disconnect() // 完全断开观察器
      }
    },
    {
      // rootMargin: '0px', // 可以在视口边缘扩展或收缩交叉区域
      threshold: 0.1, // 元素可见度达到10%时触发
    }
  )

  // 开始观察目标元素
  if (target.value) {
    observer.observe(target.value)
  }
})

// 组件卸载时，清理观察器，防止内存泄漏
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.lazy-wrapper {
  /* 可以根据需要设置样式 */
  position: relative;
}
.lazy-wrapper.loaded {
  height: initial;
  width: initial;
}
.placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.01) 33%, rgba(0, 0, 0, 0.04) 50%, rgba(0, 0, 0, 0.01) 66%) #f2f2f2;
  background-size: 300% 100%;
  animation: loading 1s infinite linear;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: right;
  }
}
</style>
```

:::
