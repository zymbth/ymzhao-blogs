---
description: Vue异步组件与懒加载组件使用示例，分析在性能优化上的作用
head:
  - - meta
    - name: keywords
      content: vue,组件,异步,懒加载,动态导入
created: '2026-01-28'
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

参数类型有两种，一种是异步加载函数，另一种是包含异步加载函数、加载提示组件的属性的对象，类型定义查看[官方文档](https://cn.vuejs.org/api/general#defineasynccomponent)

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

如果使用了 `onError` 参数，则loader异常时会调用该函数，此时 `errorComponent` 会被忽略

:::

### 性能相关

- 动态导入

由于ES模块的动态导入返回一个promise，可以很好的同defineAsyncComponent结合使用。

在性能优化中，经常会利用动态导入来实现组件的懒加载，动态导入的组件还会**自动分包**，生成一个对应的chunk文件。

SPA的首屏加载、大组件的加载都可以使用动态导入优化。父组件立即渲染，缩短关键路径、减少CPU阻塞；多chunk文件并行下载，减少整体等待时间。但要注意浏览器请求存在并行上限，分包过多可能是个反优化！

> 参考：
>
> - [import()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import)
> - [vite - 动态导入](https://cn.vite.dev/guide/features#dynamic-import)

- 条件渲染

有另一种容易常见的性能优化：使用 `v-if` **条件渲染**“重”组件，代码其实已经被**下载**下来了（同步引入，打包到当前页面的JS文件中），只是没渲染到页面上，也没有执行该组件内的js逻辑而已。条件渲染优化在于延迟“重”组件的DOM渲染及组件内的逻辑执行。

当然，条件渲染可以同异步组件结合使用，仅在需要时下载该异步组件：

::: code-group

```vue [同步引用]
<script setup>
import HeavyChild from './HeavyChild.vue'
</script>
<template>
  <div>
    <p>组件内容</p>
    <HeavyChild />
  </div>
</template>
```

```vue [同步引用+条件渲染]
<script setup>
import { ref } from 'vue'
import HeavyChild from './HeavyChild.vue'

const show = ref(false)
</script>
<template>
  <div>
    <p>组件内容</p>
    <HeavyChild v-if="show" />
  </div>
</template>
```

```vue [异步组件+条件渲染]
<script setup>
import { defineAsyncComponent, ref } from 'vue'

// 动态导入：只有在需要时才加载
const HeavyChild = defineAsyncComponent(() => import('./HeavyChild.vue'))

const show = ref(false)
</script>
<template>
  <div>
    <p>组件内容</p>
    <HeavyChild v-if="show" />
  </div>
</template>
```

:::

如果是**多组件选择渲染**的话，每个组件都很“重”，如何优化呢？

::: code-group

```vue [同步引入]
<script setup lang="jsx">
import { shallowRef } from 'vue'
import HeavyChild1 from './HeavyChild1.vue'
import HeavyChild2 from './HeavyChild2.vue'
import HeavyChild3 from './HeavyChild3.vue'

const TmplComp = shallowRef(null)
const tmplMap = {
  1: HeavyChild1,
  2: HeavyChild2,
  3: HeavyChild3
}

const handleClick = no => TmplComp.value = tmplMap[no]
</script>

<template>
  <button @click="handleClick(1)">模板1</button>
  <button @click="handleClick(2)">模板2</button>
  <button @click="handleClick(3)">模板3</button>
  <component :is="TmplComp" />
</template>
```

```vue [异步组件]
<script setup>
import { defineAsyncComponent, shallowRef } from 'vue'

const HeavyChild1 = defineAsyncComponent(() => import('./HeavyChild1.vue'))
const HeavyChild2 = defineAsyncComponent(() => import('./HeavyChild2.vue'))
const HeavyChild3 = defineAsyncComponent(() => import('./HeavyChild3.vue'))

const TmplComp = shallowRef(null)
const tmplMap = {
  1: HeavyChild1,
  2: HeavyChild2,
  3: HeavyChild3
}

const handleClick = no => TmplComp.value = tmplMap[no]
</script>

<template>
  <button @click="handleClick(1)">模板1</button>
  <button @click="handleClick(2)">模板2</button>
  <button @click="handleClick(3)">模板3</button>
  <component :is="TmplComp" />
</template>
```

:::

### 实例

假设有需要按照接口响应的数据条件选择对应的模板组件，每个模板组件都很“重”

#### 实现

[在线示例](https://play.vuejs.org/#eNq9VF+LI0UQ/yrFIMzsEieb6L0MSc5V9kFBPXTfdhauL1OT6dxM99Ddk9kl5EXuQe5QDxQUUVfRFREOOZBFXA+/zCV7H8Pqnk02We720Zekp6p+9e9XVVNvtyzDSYVe5PX0UPHSgEZTlZAzMerH3lgfxd4gFrwopTIwBYVpCxJMucBdfSyG70jSCBQGZpAqWYBP3vxYxGIohTaQMMOgb2HB1pV0vyhziyTNy3wF01gA5JIlqCJgVgfBFvQH4BTgvIYTlldIHljNOKXNiypnBndLbiNZK54Ga4ahkNDv96GzRdmYSgloigr8sG3z6djwthf+jfDuK+Dd63CTKVmDwBr2lJIquLv47veLk9OLbx8sfvtp8f2/F0/P5z88iuC16VUUCjK76/Cz1rIFXIxWjYku29BL+GQwf/jji2fPnv/1JAzDXttKHAZttHUECRqQLpkAbY5zJGaHMpcqUpgQv42n+S9PX/x5GsGUAKHzEhaoNRvhrNe2WOt/5lhsb29TqG2wlTw6WXx+Ov/iZyd4q2SKFTC9J2WOTMzggOuPUMt8gocw//Kz+d9fLb75Y/7418Wnj+cPTzYwoiruoSJIgjk7JvPzs8XXZ9akHYu0EkPDJeW/xvPKN02BURXaySQofXVu7exsNdNyyZYl4g4NKNcYBKqBtUg5xqFZH62NsX2fmSxUTCSyoMYPYCe81VgB3KZlEDKCTgsMNzlG4De8dnybRrNMlDDJ00RnnElIs4pjTY8R8rHkI0hrzHjGSaCMHJMMaqxI4MNsGYbocGG618N0KUzONRF84I/IWwoZrySOFNQp8oy0viRxnULFx1ymNWTjGsfS+T9cBqBl3+cFysqsNfM2taV5RZcNumws/VFfmvmkX/JBg+EKpRNBHwZpEYgb+gLoZZ3B/J9PFk9OL84fPD8/67VJ4BSr7Y9cm9sk7bXXsF7LM5p4SPkoHGsp6Dg5cuzQFiXPUX3oWqtjj9rTFBJ7LM9l/Z6TuVlYyocZDu+/RO5OW0SPO1QtqgnG3kpnmBqhadR7H3+AR/ReKQuZVDlZ36B0naxsjo3Z25VIKO01O5ftu+6C0ILv670jg0Ivi7KJXl2B2KOzYhv2qtKv0n0jfNPhiBzq4sZZu37iqdHN7aWtKHVw4Fsy/EPi9UZSu4PptLm/bh5hRseBhE5ZrnRrC+AsbLTrHG9czf8huyp3//TKOUxeT6WiMxhw8tACTtGOtuivAdvFij2I7uMx2TglnUlyba2d05w3TtvO62Zps/8AE7acag==)

::: code-group

```vue{1,6-15} [App.vue]
<script setup lang="jsx">
import { ref, defineAsyncComponent } from 'vue'

const data = ref()

const TmplComp = defineAsyncComponent({
  loader: async () => {
    data.value = await simulateApi()
    if(data.value.no === 1) return import('./Tmpl1Comp.vue')
    if(data.value.no === 2) return import('./Tmpl2Comp.vue')
    throw new Error(`未知的模板类型: ${data.value.no}`)
  },
  loadingComponent: () => <div>加载中...</div>,
  errorComponent: (err) => <span style="color:red">加载失败: {err.error.message}</span>,
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

#### 手动控制异步组件的加载时机

- `Promise.withResolvers`实现

这里使用了 `Promise.withResolvers` 来手动控制异步组件的加载时机，能实现但**不推荐**。

这种写法存在**耦合度过高**的问题（`loader` 的控制权在外部），也不**规范**（`defineAsyncComponent` 的初衷是处理“网络资源加载”）

```js{2,6,20,22}
const data = ref()
const { promise: reqPromise, resolve: reqResolve, reject: reqReject } = Promise.withResolvers()

const TmplComp = defineAsyncComponent({
  loader: async () => {
    const data = await reqPromise
    if(data.no === 1) return import('./Tmpl1Comp.vue')
    if(data.no === 2) return import('./Tmpl2Comp.vue')
    throw new Error(`未知的模板类型: ${data.value.no}`)
  },
  loadingComponent: () => <div>加载中...</div>,
  errorComponent: (err) => <span style="color:red">加载失败: {err.error.message}</span>,
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

- 策略模式 + 动态组件

将“数据获取”和“组件加载”解耦，先定义（defineAsyncComponent）好所需异步组件，数据获取后再指向（shallowRef）组件

但数据获取的loading效果就需要父组件控制显示了

> 虽然这种方案更规范，但从个人直观感受上更喜欢前两种方案😂

```vue {6,19-22,30,32,40,41}
<script setup lang="jsx">
import { onMounted, ref, shallowRef, defineAsyncComponent } from 'vue'

const data = ref()
const loading = ref(false)
const TmplComp = shallowRef(null)

const LoadingComp = () => <div>加载中...</div>
const ErrorComp = ({ error }) => <span style="color:red">加载失败: {error.message}</span>
// 工厂函数：统一配置异步组件选项，减少重复代码
const createAsyncComp = loader => defineAsyncComponent({
  loader,
  loadingComponent: LoadingComp,
  errorComponent: ErrorComp,
  delay: 200,
  timeout: 10000
})

const tmplMap = {
  1: createAsyncComp(() => import('./Tmpl1Comp.vue')),
  2: createAsyncComp(() => import('./Tmpl2Comp.vue')),
}

onMounted(async () => {
  loading.value = true
  try {
    data.value = await simulateApi()
    const tmpl = tmplMap[data.value.no]
    if (!tmpl) throw new Error(`未知的模板类型: ${data.value.no}`)
    TmplComp.value = tmpl
  } catch (err) {
    TmplComp.value = () => <ErrorComp error={err} />
  }
  loading.value = false
})
// ... simulateApi 同上 ...
</script>

<template>
  <LoadingComp v-if="loading" />
  <component v-else :is="TmplComp" :data />
</template>
```

::: details 使用 `Suspense` 组件替换 `defineAsyncComponent`

这种方案就更不喜欢了，仅供参考

App.vue:

```vue
<script setup>
import TmplLoader from './TmplLoader.vue'
</script>

<template>
  <h1>异步组件</h1>
  <Suspense>
    <TmplLoader />
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

TmplLoader.vue:

```vue
<script setup>
// script setup 中直接使用 await 会使该组件成为一个异步 setup 组件，这正是 Suspense 能捕获的
const data = await simulateApi()

let compModule
if (data.no === 1) {
  compModule = await import('./Tmpl1Comp.vue')
} else if (data.no === 2) {
  compModule = await import('./Tmpl2Comp.vue')
} else {
  throw new Error(`未知的模板类型: ${data.no}`)
}
const TmplComp = compModule.default
// ... simulateApi 同上 ...
</script>

<template>
  <TmplComp :data />
</template>
```

Suspense 组件本身不处理异常。它只有两个插槽：`#default`（成功/加载完）和 `#fallback`（加载中）。

```vue
<script setup lang="jsx">
let data, TmplComp
try {
  data = await simulateApi()
  if (data.no === 1) {
    TmplComp = (await import('./Tmpl1Comp.vue')).default
  } else if (data.no === 2) {
    TmplComp = (await import('./Tmpl2Comp.vue')).default
  } else {
    TmplComp = (props) => <span style="color:red">未知的模板类型: {props.data?.no}</span>
  }
} catch (err) {
  TmplComp = () => <span style="color:red">加载失败: {err.message}</span>
}
// ... simulateApi 同上 ...
</script>

<template>
  <TmplComp :data />
</template>
```

:::

#### 小结

vue太灵活了，光vue3的组件就有多种写法，各种API及特殊组件 `defineAsyncComponent`、`Suspense`、`component`...

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

## 总结

异步组件及懒加载组件是不错的性能优化、用户体验优化方法，但不是必须的，需要结合具体情况分析选用
