---
description: 总结记录个人在Vue前端开发中使用Echarts的技巧，包含按需引入、分包、resize监听、实例自动销毁、保存图片等
head:
  - - meta
    - name: keywords
      content: echarts,util,usage,tips
created: '2025-08-21'
---

# Echarts使用tips

## 前言

总结记录个人在Vue前端开发中使用Echarts的技巧，其他框架也可参考实现。

## 按需引入+分包

按需引入Echarts包，可以减少包大小，尤其是涉及的功能组件不多时。

```js [src/utils/echarts.js]
import * as echarts from 'echarts/core'
import {
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  TransformComponent
} from 'echarts/components'
import { ScatterChart, LineChart } from 'echarts/charts'
import { UniversalTransition, LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  TransformComponent,
  ScatterChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  LabelLayout
])

import ecStat from 'echarts-stat'

// See https://github.com/ecomfe/echarts-stat
echarts.registerTransform(ecStat.transform.regression)

export default echarts
```

按需引入可在官方示例的“完整代码”-“按需引入”中查看。

官方还提供了一个[在线定制](https://echarts.apache.org/zh/builder.html)下载Echarts包的方式

- 分包

vite, webpack, vue-cli 都支持分包，自行搜索配置

## resize监听+自动销毁

实例可能会需要根据容器尺寸调整大小

::: code-group

```vue [src/views/demo.vue]
<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import echarts from '@/utils/echarts.js'
import { useResizeListener } from '@/use/useResizeListener.js'

const chartRef = ref()
let echartsInstance

const resizeEcharts = () => echartsInstance?.resize()
useResizeListener(resizeEcharts)

onMounted(() => {
  echartsInstance = echarts.init(chartRef.value)
  drawChart()
})

onBeforeMount(() => {
  echartsInstance?.dispose()
})

function drawChart() {
  const options = {
    // ...
  }
  echartsInstance.setOption(options)
}
</script>
<template>
  <div class="chart-wrap" ref="chartRef"></div>
</template>
<style scoped>
.chart-wrap {
  width: 500px;
  height: 500px;
}
</style>
```

```js{2,15-19} [src/use/useResizeListener.js]
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { store } from '@/store'

export function useResizeListener(cb) {
  if (!(cb instanceof Function)) return

  const resizeDebounceHandler = debounce(cb)

  onMounted(() => {
    window.addEventListener('resize', resizeDebounceHandler)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeDebounceHandler) // 监听事件解绑
  })
  // !NOTE: 根据实际需求添加，这里监听侧边栏的展开/收起
  watch(
    () => store.getters.sidebar,
    () => setTimeout(cb, 800)
  )
}

// 防抖函数
function debounce(fn, delay = 300, _this) {
  let timer // 计时器
  return function (...args) {
    timer && clearTimeout(timer) // 清除delay延时内存在的计时器
    // 延时执行fn
    timer = setTimeout(() => {
      _this ? fn.call(_this, ...args) : fn(...args)
    }, delay)
  }
}

```

:::

## 保存图片

对于canvas/svg元素，浏览器支持右键保存图片。但Echarts图表生成的canvas/svg元素往往会像图层一样包含多个元素叠加在一起，浏览器右键默认保存图片功能仅能保存最顶层。

Echarts实例上存在`getDataURL`方法（[echartsInstance.getDataURL](https://echarts.apache.org/zh/api.html#echartsInstance.getDataURL)），可以导出图表图片，返回一个 base64 的 URL，可以统一封装一下。

::: code-group

```vue{5,30,32} [src/views/demo.vue]
<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import echarts from '@/utils/echarts.js'
import { useResizeListener } from '@/use/useResizeListener.js'
import EchartContextMenu from '@/components/ContextMenu/EchartsContextMenu.vue'

const chartRef = ref()
let echartsInstance

const resizeEcharts = () => echartsInstance?.resize()
useResizeListener(resizeEcharts)

onMounted(() => {
  echartsInstance = echarts.init(chartRef.value)
  drawChart()
})

onBeforeMount(() => {
  echartsInstance?.dispose()
})

function drawChart() {
  const options = {
    // ...
  }
  echartsInstance.setOption(options)
}
</script>
<template>
  <EchartContextMenu :echarts-dom="chartRef">
    <div class="chart-wrap" ref="chartRef"></div>
  </EchartContextMenu>
</template>
<style scoped>
.chart-wrap {
  width: 500px;
  height: 500px;
}
</style>
```

```vue [src/components/ContextMenu/EchartsContextMenu.vue]
<script setup>
import ContextMenuComp from './index.vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { getInstanceByDom } from 'echarts/core'

/**
 * 右键菜单：导出 Echarts 图表为图片，浏览器默认保存图片功能在多个“图层”下无效
 *
 * !NOTE: 需将 Echarts 容器放置在本组件的默认插槽中：
 */

const props = defineProps(['echartsDom'])

const handleDownload = (type = 'png', specifyOpts = {}) => {
  const opts = { type, ...specifyOpts }
  if (type === 'jpeg') opts.backgroundColor = '#fff'
  const url = getInstanceByDom(props.echartsDom)?.getDataURL?.(opts)
  if (!url) return ElMessage.error('Failed to find the chart')
  // 下载图片
  const aLink = document.createElement('a')
  aLink.style.display = 'none'
  aLink.href = url
  aLink.download = 'chart'
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
}

const showMenu = ref(false),
  contextMenuRef = ref()
const handleContextMenu = event => {
  contextMenuRef.value.setPosition(event)
  showMenu.value = true
}
</script>
<template>
  <div class="ctx-menu-wrap" @contextmenu.prevent="handleContextMenu">
    <slot></slot>
    <!-- 右键菜单框 -->
    <ContextMenuComp v-model="showMenu" ref="contextMenuRef">
      <div class="menu-item" @click="handleDownload('jpeg')">Download jpeg</div>
      <div class="menu-item" @click="handleDownload('png')">Download png</div>
    </ContextMenuComp>
  </div>
</template>
<style lang="scss" scoped>
.ctx-menu-wrap {
  position: relative;
}
</style>
```

```vue [src/components/ContextMenu/index.vue]
<script setup>
import { ref, computed } from 'vue'

/**
 * 右键菜单，菜单内容放在插槽中
 */

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const showMenu = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const contextmenu = ref()

function setPosition(event) {
  contextmenu.value.style.top = event.layerY - 5 + 'px'
  contextmenu.value.style.left = event.layerX - 5 + 'px'
  if (window.innerWidth - 200 < event.clientX) {
    contextmenu.value.style.left = 'unset'
    contextmenu.value.style.right = 0
  }
}
defineExpose({ setPosition })
</script>
<template>
  <div v-show="showMenu" id="contextmenu" ref="contextmenu" @mouseleave="showMenu = false">
    <span class="close" @click="showMenu = false">+</span>
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
#contextmenu {
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  width: 160px;
  padding: 10px 0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 1px 3px 4px 4px rgba(0, 0, 0, 0.2);
  transition: display 0.3s ease;
  z-index: 3000;
  &:deep(.menu-item) {
    font-size: 14px;
    padding: 8px 20px;
    cursor: pointer;
    &:hover {
      background-color: #f2f2f2;
    }
  }
}
.close {
  position: absolute;
  top: 2px;
  right: 8px;
  font-size: 26px;
  transform: rotate(45deg);
  cursor: pointer;
}
</style>
```

:::
