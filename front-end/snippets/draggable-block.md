---
description: js实现可拖拽移动框
head:
  - - meta
    - name: keywords
      content: draggable,移动框,拖拽,js
---

# js实现可拖拽移动框

[codepen 演示](https://codepen.io/zymbth/pen/MWqyOZV)

::: code-group

```js [useDraggableBlock.js]
/**
 * 创建可拖拽移动框
 *
 * @param {string|Element} targetEl target element
 * @param {string|Element} parentEl parent element
 * @returns
 * @example
 * import useDraggableBlock from '@/use/useDraggableBlock'
 * movableBlockUtil('#demo', '.container')
 */
export default function (targetEl, parentEl) {
  // 可拖拽框元素
  let el
  // 定位信息
  let posiInfo = {
    enablemove: false,
    x: undefined,
    y: undefined,
  }
  // 拖拽事件监听中
  let onlistenning = false
  // 初始化方法，未做错误提示
  function init() {
    if (!targetEl) return
    if (typeof targetEl === 'string') targetEl = document.querySelector(targetEl)
    if (!targetEl) {
      if (!parentEl) return
      if (typeof parentEl === 'string') parentEl = document.querySelector(parentEl)
      targetEl = document.createElement('div')
      parentEl.append(targetEl)
    }
    el = targetEl
    enable()
  }

  function handleStartGrab() {
    // console.log('handleStartGrab')
    posiInfo.enablemove = true
    el.style.cursor = 'grabbing'
  }

  function handleEndGrab() {
    // console.log('handleEndGrab')
    posiInfo = {
      enablemove: false,
      x: undefined,
      y: undefined,
    }
    el.style.cursor = 'grab'
  }

  function handleGrabbing(event) {
    // console.log('handleGrabbing')
    if (!posiInfo.enablemove) return
    let tx, ty // 待移动距离
    const { x, y } = event // 当前鼠标位置
    // 计算鼠标距上一次移动的距离
    if (posiInfo.x) tx = x - posiInfo.x
    if (posiInfo.y) ty = y - posiInfo.y
    // 更新鼠标位置
    posiInfo.x = x
    posiInfo.y = y
    if ((tx || tx === 0) && (ty || ty === 0)) {
      const tmp = getComputedStyle(el)
      const prevLeft = tmp.getPropertyValue('left')
      const prevTop = tmp.getPropertyValue('top')
      // 移动
      el.style.left = `calc(${prevLeft} + ${tx}px)`
      el.style.top = `calc(${prevTop} + ${ty}px)`
    }
  }

  // 重置位置记录
  function resetGrabPosi() {
    posiInfo.x = undefined
    posiInfo.y = undefined
  }

  function enable() {
    if (onlistenning || !el) return
    onlistenning = true
    // 点击开启拖动
    el.addEventListener('mousedown', handleStartGrab)
    // 松开/退出拖动
    el.addEventListener('mouseup', handleEndGrab)
    el.addEventListener('mouseleave', handleEndGrab)
    // 拖动
    el.addEventListener('mousemove', handleGrabbing)
  }

  function disable() {
    if (!onlistenning || !el) return
    onlistenning = false
    el.removeEventListener('mousedown', handleStartGrab)
    el.removeEventListener('mouseup', handleEndGrab)
    el.removeEventListener('mouseleave', handleEndGrab)
    el.removeEventListener('mousemove', handleGrabbing)
    el.style.cursor = 'default'
  }

  init()
  return {
    targetEl: el,
    resetGrabPosi,
    enable,
    disable,
    destory: disable,
  }
}
```

```vue [App.vue]
<script setup>
import { ref, onMounted } from 'vue'
import useDraggableBlock from '@/use/useDraggableBlock'

const trumbRef = ref()
const wrapRef = ref()

let resetGrabPosi

onMounted(() => {
  ;({ resetGrabPosi } = useDraggableBlock(trumbRef.value, wrapRef.value))
})
</script>
<template>
  <div class="trumb-container" ref="wrapRef">
    <div class="trumb" ref="trumbRef"></div>
  </div>
</template>
<style scoped>
.trumb-container {
  position: relative;
  overflow: hidden;
}
.trumb {
  position: absolute;
  left: 12px;
  top: 50%;
}
</style>
```

:::
