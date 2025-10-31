---
description: Vue异步组件与懒加载组件在性能优化上的作用
head:
  - - meta
    - name: keywords
      content: vue,异步,懒加载,组件
created: '2025-10-30'
---

# Vue异步/懒加载组件

vue允许你定义异步组件，具体查看[官方文档](https://cn.vuejs.org/guide/components/async.html)。

## 准备

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

## 异步组件示例

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
    if(data.value .no === 1) return import('./Tmpl1Comp.vue')
    if(data.value .no === 2) return import('./Tmpl2Comp.vue')
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

当然，完全可以将异步组件内的“接口请求-条件选择”逻辑抽离出来

```vue{4,5,9,17-26}
<script setup lang="jsx">
import { ref, defineAsyncComponent, onMounted } from 'vue'

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

## 懒加载组件

<ClientOnly>
  <FullScreen>
    <DemoIframe title="懒加载组件" src="https://play.vuejs.org/#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" />
  </FullScreen>
</ClientOnly>

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
  <div ref="target" class="lazy-wrapper">
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
