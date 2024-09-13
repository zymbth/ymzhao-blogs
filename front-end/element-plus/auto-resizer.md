---
description: 介绍一个 Element Plus 虚拟化表格模块中导出的组件 ElAutoResizer，可以用于作为块级容器，自动计算其宽高，并提供给其内部使用。
head:
  - - meta
    - name: keywords
      content: element-plus,ElAutoResizer,resize,宽度自适应
---

# ElementPlus ElAutoResizer 组件的使用

ElementPlus 的 TableV2(虚拟化表格)模块中提供了一个 ElAutoResizer 组件，可以用于作为块级容器，自动计算其宽高，并提供给其内部(默认插槽)使用。

由于非通用 UI 组件，ElementPlus 官方未提供该组件的文档，但它可以像其它组件一样引入使用

## 引入

显式引入：

```js
import { ElAutoResizer } from 'element-plus'
```

完全引入、自动引入、全局注册组件时无需显式引入。

## 使用

参照官网示例：[虚拟化表格-自动调整大小](https://element-plus.org/zh-CN/component/table-v2.html#%E8%87%AA%E5%8A%A8%E8%B0%83%E6%95%B4%E5%A4%A7%E5%B0%8F)

```vue
<template>
  <div style="height: 400px">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2 :columns="columns" :data="data" :width="width" :height="height" fixed />
      </template>
    </el-auto-resizer>
  </div>
</template>
```

该组件除了省去了给 vue 组件设置 resize 监听外，特别适合内部仅需要对尺寸进行响应式更新的情景。例如 echarts 表格

ElementPlus 官网文档中无该组件文档，TableV2 中的示例比较基础。可以参考其[源码](https://github.com/element-plus/element-plus/blob/dev/packages/components/table-v2/src/components/auto-resizer.tsx)

## ElAutoResizer 源码分析

::: code-group

```ts{5,7-13} [auto-resizer.ts]
import { buildProps, definePropType } from '@element-plus/utils'

import type { ExtractPropTypes } from 'vue'

type AutoResizeHandler = (event: { height: number; width: number }) => void

export const autoResizerProps = buildProps({
  disableWidth: Boolean,
  disableHeight: Boolean,
  onResize: {
    type: definePropType<AutoResizeHandler>(Function),
  },
} as const)

export type AutoResizerProps = ExtractPropTypes<typeof autoResizerProps>
```

```tsx{8,11,20-23} [./components/auto-resizer.tsx]
import { defineComponent } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { autoResizerProps } from '../auto-resizer'
import { useAutoResize } from '../composables'

const AutoResizer = defineComponent({
  name: 'ElAutoResizer',
  props: autoResizerProps,
  setup(props, { slots }) {
    const ns = useNamespace('auto-resizer')
    const { height, width, sizer } = useAutoResize(props)
    const style = {
      width: '100%',
      height: '100%',
    }

    return () => {
      return (
        <div ref={sizer} class={ns.b()} style={style}>
          {slots.default?.({
            height: height.value,
            width: width.value,
          })}
        </div>
      )
    }
  },
})

export default AutoResizer
```

```ts{13,32-37} [./composables/use-auto-resize.ts]
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'

import type { AutoResizerProps } from '../auto-resizer'

const useAutoResize = (props: AutoResizerProps) => {
  const sizer = ref<HTMLElement>()
  const width$ = ref(0)
  const height$ = ref(0)

  let resizerStopper: ReturnType<typeof useResizeObserver>['stop']
  onMounted(() => {
    resizerStopper = useResizeObserver(sizer, ([entry]) => {
      const { width, height } = entry.contentRect
      const { paddingLeft, paddingRight, paddingTop, paddingBottom } =
        getComputedStyle(entry.target)

      const left = Number.parseInt(paddingLeft) || 0
      const right = Number.parseInt(paddingRight) || 0
      const top = Number.parseInt(paddingTop) || 0
      const bottom = Number.parseInt(paddingBottom) || 0

      width$.value = width - left - right
      height$.value = height - top - bottom
    }).stop
  })

  onBeforeUnmount(() => {
    resizerStopper?.()
  })

  watch([width$, height$], ([width, height]) => {
    props.onResize?.({
      width,
      height,
    })
  })

  return {
    sizer,
    width: width$,
    height: height$,
  }
}

export { useAutoResize }
```

:::

## 使用 ElAutoResizer 进行 resize 监听

ElAutoResizer 提供了容器实时尺寸，但有时可能需要监听 resize 事件并处理一些逻辑。下面提供两种使用 ElAutoResizer 组件进行 resize 监听的方法：

### resize 事件监听

- AutoResizer 组件的 resize 事件

参照 `AutoResizerProps` 类型定义，该组件提供了 `resize` 事件。

AutoResizer 组件内部应用 `use-auto-resize.ts` 监听容器尺寸变化并触发组件的 `resize` 事件

```vue
<script setup>
const handleResize = size => console.log(size)
</script>

<template>
  <div style="resize: both; border: 1px solid gray; overflow: auto">
    <ElAutoResizer @resize="handleResize">
      <div>Content</div>
    </ElAutoResizer>
  </div>
</template>
```

- 监听尺寸属性

如果 ElAutoResizer 内部是一个组件，可以将尺寸属性作为 props 传递给内部组件，然后在内部组件内监听尺寸变化。

不过既然组件提供了 resize 事件，没必要重复监听。

### 实例

这里使用 echarts 演示

```vue [App.vue]
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { ElAutoResizer } from 'element-plus'

const chartRef = ref()
let echartInstance

const resizeEcharts = () => echartInstance?.resize()

onMounted(() => {
  echartInstance = echarts.init(chartRef.value)
  // ...
  echartInstance.setOption({ ... })
})
onBeforeUnmount(() => {
  echartInstance?.dispose()
})
</script>
<template>
  <ElAutoResizer @resize="resizeEcharts">
    <div ref="chartRef" style="height: 400px"></div>
  </ElAutoResizer>
</template>
```
