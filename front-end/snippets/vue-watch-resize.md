---
description: vue中监听window.resize事件
head:
  - - meta
    - name: keywords
      content: svg,导出,export,image,图片
created: '2024-07-17'
---

# vue中监听window.resize事件

提取监听的添加与移除逻辑，封装成hook使用

::: code-group

```js [@/use/useResizeListener.js]
import { onMounted, onBeforeUnmount } from 'vue'

export default cb => {
  if (typeof cb !== 'function') return

  const resizeDebounceHandler = debounce(cb)

  onMounted(() => {
    window.addEventListener('resize', resizeDebounceHandler)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeDebounceHandler) // 监听事件解绑
  })
}

function debounce(fn, delay = 200) {
  let timer
  return function () {
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn(...args)
    }, delay)
  }
}
```

```vue [@/**/sfc.vue]
<script setup>
import useResizeListener from '@/use/useResizeListener'

const resizeHandler = () => console.log('do something')

useResizeListener(resizeHandler)
</script>
```

:::
