# 预加载 Element Plus 的 Dialog 组件

对于 Element Plus 的 Dialog 组件，浏览器调试发现，正常使用 Dialog 组件时，它的蒙层和模态框元素会随页面初始加载完毕，但模态框内部的元素却只有在首次显示时浏览器再去渲染。

如果 Dialog 组件的内容很多，首次加载比较耗时（3 秒以上），那交互体验必定不好。如果我们在恰当的时机去提前加载该组件，那么用户首次打开时，浏览器就不用才开始渲染 Dialog 组件内容。

## 分析

最直接的方案就是在页面挂载并拿到数据后，主动触发渲染但不显示 Dialog 组件，然后再关闭隐藏。这样，用户之后点击打开 Dialog 的时候，无需等待太久。

## 思路

- Dialog 组件先设置为不可见(`display:none !important`)
- 监听 Dialog 组件的绑定变量，首次显示后，标记已预加载过
- 再次显示后，移除上一步的监听，并将 Dialog 组件设置为可见

尝试过在首次显示后执行第三步，精简流程。但“隐藏组件”与“设置组件可见”的时序不好控制，会导致手动加载的 dialog 闪现。

## 方案

上代码，演练场试下：[preload dialog](https://element-plus.run/#eyJzcmMvQXBwLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgeyByZWYsIG9uTW91bnRlZCwgd2F0Y2gsIG5leHRUaWNrIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBkYXRhID0gcmVmKCcnKVxuY29uc3QgdmlzaWJsZSA9IHJlZihmYWxzZSlcblxub25Nb3VudGVkKGFzeW5jICgpID0+IHtcbiAgZGF0YS52YWx1ZSA9IGF3YWl0IGdldERhdGEoKVxuICBwcmVsb2FkQ29tcCgpXG59KVxuXG5mdW5jdGlvbiBnZXREYXRhKCkge1xuICAvLyBmZXRjaCBkYXRhXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZXNvbHZlKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSo5MDAwMDArMTAwMDAwKS50b1N0cmluZygxNikpXG4gICAgfSwgNTAwKVxuICB9KVxufVxuXG5sZXQgcHJlbG9hZGVkID0gZmFsc2VcbmNvbnN0IHByZWxvYWRXYXRjaGVyID0gd2F0Y2godmlzaWJsZSwgbmV3VmFsID0+IHtcbiAgaWYgKG5ld1ZhbCkge1xuICAgIGlmICghcHJlbG9hZGVkKSB7XG4gICAgICBwcmVsb2FkZWQgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOWujOaIkOmihOWKoOi9veS7u+WKoe+8jOS4jeWGjeebkeWQrFxuICAgICAgcmVzb2x2ZWRQcmVsb2FkKClcbiAgICAgIHByZWxvYWRXYXRjaGVyKClcbiAgICB9XG4gIH1cbn0pXG5cbi8vIOWujOaIkOmihOWKoOi9veS7u+WKoVxuZnVuY3Rpb24gcmVzb2x2ZWRQcmVsb2FkKCkge1xuICAvLyDnp7vpmaTnsbtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByZWxvYWQtYmxvY2snKS5jbGFzc0xpc3QucmVtb3ZlKCdwcmVsb2FkLWJsb2NrJylcbn1cbmZ1bmN0aW9uIHByZWxvYWRDb21wKCkge1xuICB2aXNpYmxlLnZhbHVlID0gdHJ1ZVxuICBuZXh0VGljaygoKSA9PiB7XG4gICAgdmlzaWJsZS52YWx1ZSA9IGZhbHNlXG4gIH0pXG59XG48L3NjcmlwdD5cbjx0ZW1wbGF0ZT5cbiAgPGVsLWJ1dHRvbiBAY2xpY2s9XCJ2aXNpYmxlID0gdHJ1ZVwiPlNob3cgUHJldmxvYWQgRGlhbG9nPC9lbC1idXR0b24+XG4gIDwhLS0gUHJlbG9hZCBEaWFsb2cgLS0+XG4gIDxlbC1kaWFsb2cgdGl0bGU9XCJQcmVsb2FkIERpYWxvZ1wiIHYtbW9kZWw9XCJ2aXNpYmxlXCIgd2lkdGg9XCI1NTBweFwiIG1vZGFsLWNsYXNzPVwicHJlbG9hZC1ibG9ja1wiPlxuICAgIDxkaXY+RGF0YToge3sgZGF0YSB9fTwvZGl2PlxuICA8L2VsLWRpYWxvZz5cbjwvdGVtcGxhdGU+XG48c3R5bGU+XG4ucHJlbG9hZC1ibG9jayB7XG4gIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge31cbn0iLCJ0c2NvbmZpZy5qc29uIjoie1xuICBcImNvbXBpbGVyT3B0aW9uc1wiOiB7XG4gICAgXCJhbGxvd0pzXCI6IHRydWUsXG4gICAgXCJjaGVja0pzXCI6IHRydWUsXG4gICAgXCJqc3hcIjogXCJwcmVzZXJ2ZVwiLFxuICAgIFwidGFyZ2V0XCI6IFwiRVNOZXh0XCIsXG4gICAgXCJtb2R1bGVcIjogXCJFU05leHRcIixcbiAgICBcIm1vZHVsZVJlc29sdXRpb25cIjogXCJCdW5kbGVyXCIsXG4gICAgXCJhbGxvd0ltcG9ydGluZ1RzRXh0ZW5zaW9uc1wiOiB0cnVlLFxuICAgIFwidHlwZXNcIjogW1wiZWxlbWVudC1wbHVzL2dsb2JhbC5kLnRzXCJdXG4gIH0sXG4gIFwidnVlQ29tcGlsZXJPcHRpb25zXCI6IHtcbiAgICBcInRhcmdldFwiOiAzLjNcbiAgfVxufVxuIiwiX28iOnt9fQ==)

```vue
<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const data = ref('')
const visible = ref(false)

onMounted(async () => {
  data.value = await getData()
  preloadComp()
})

function getData() {
  // fetch data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random()*900000+100000).toString(16))
    }, 500)
  })
}

let preloaded = false
const preloadWatcher = watch(visible, newVal => {
  if (newVal) {
    if (!preloaded) {
      preloaded = true
    } else {
      // 完成预加载任务，不再监听
      resolvedPreload()
      preloadWatcher()
    }
  }
})

// 完成预加载任务
function resolvedPreload() {
  // 移除类
  document.querySelector('.preload-block').classList.remove('preload-block')
}
function preloadComp() {
  visible.value = true
  nextTick(() => {
    visible.value = false
  })
}
</script>
<template>
  <el-button @click="visible = true">Show Prevload Dialog</el-button>
  <!-- Preload Dialog -->
  <el-dialog title="Preload Dialog" v-model="visible" width="550px" modal-class="preload-block">
    <div>Data: {{ data }}</div>
  </el-dialog>
</template>
<style>
.preload-block {
  display: none !important;
}
</style>
```

通过 `modal-class` 属性给 Dialog 添加类，设置初始不可见。然后如上一节一样，在页面挂载并获取到数据后，预加载 Dialog，完成后移除类 `prevload-block`。不影响后续使用。

这种实现方案要求必须执行手动加载方法一次，否则类 `prevload-block` 永远不会被移除，dialog组件一直不可见。
