---
description: vue组件中监听、拦截窗口关闭事件
head:
  - - meta
    - name: keywords
      content: vue,beforeunload,窗口关闭,页面关闭,监听
created: '2024-09-05'
---


# vue组件中监听或拦截窗口关闭事件

参考：[Window：beforeunload 事件 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/beforeunload_event)

应用场景：

有时我们希望在页面关闭时做些事情，比如更新状态。vue提供的生命周期钩子无法在关闭/刷新浏览器窗口时触发。

## 解决方案

::: code-group

```vue [监听]
<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  window.addEventListener('beforeunload', updateStatus)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', updateStatus)
  updateStatus()
})

function updateStatus() {
  // 执行操作，如更新状态
}
</script>
```

```vue [监听并拦截]
<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  window.addEventListener('beforeunload', updateStatus)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', updateStatus)
})

function updateStatus($event) {
  // 拦截窗口关闭事件
  $event.preventDefault()
  $event.returnValue = '确定要刷新页面吗？'
  return '确定要刷新页面吗？'
}
</script>
```

:::
