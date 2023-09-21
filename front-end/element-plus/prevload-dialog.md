# 预加载 Element Plus 的 Dialog 组件

对于 Element Plus 的 Dialog 组件，浏览器调试发现，正常使用 Dialog 组件时，它的蒙层和模态框元素会随页面初始加载完毕，但模态框内部的元素却只有在首次显示时浏览器再去渲染。

如果 Dialog 组件的内容较多，首次加载比较耗时（3 秒以上），那交互体验必定不好。如果我们在恰当的时机去提前加载该组件，那么用户首次打开时，浏览器就不用才开始渲染 Dialog 组件内容。

## 分析

最直接的方案就是在页面挂载并拿到数据后，手动显示 Dialog 组件，然后再关闭隐藏。但此次显示需要“悄悄”进行

## 思路

- Dialog 组件先设置为不可见(`display:none !important`)
- 监听 Dialog 组件的绑定变量 visible，首次显示后，标记已加载状态
- 再次显示后，移除上一步的监听，并将 Dialog 组件设置为可见

尝试过在首次显示后执行第三步，精简流程。但“隐藏组件”与“设置组件可见”的时序不好控制，会导致手动加载的 dialog 闪现。

## 方案

上代码，演练场试下：[preload dialog](https://element-plus.run/#eyJzcmMvQXBwLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgeyByZWYsIG9uTW91bnRlZCwgd2F0Y2gsIG5leHRUaWNrIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBkYXRhID0gcmVmKCcnKVxuY29uc3QgdmlzaWJsZSA9IHJlZihmYWxzZSlcblxub25Nb3VudGVkKGFzeW5jICgpID0+IHtcbiAgZGF0YS52YWx1ZSA9IGF3YWl0IGdldERhdGEoKVxuICBwcmV2bG9hZENvbXAoKVxufSlcblxuZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgLy8gZmV0Y2ggZGF0YVxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVzb2x2ZShNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqOTAwMDAwKzEwMDAwMCkudG9TdHJpbmcoMTYpKVxuICAgIH0sIDUwMClcbiAgfSlcbn1cblxubGV0IHByZXZsb2FkZWQgPSBmYWxzZVxuY29uc3QgcHJldmxvYWRXYXRjaGVyID0gd2F0Y2godmlzaWJsZSwgbmV3VmFsID0+IHtcbiAgaWYgKG5ld1ZhbCkge1xuICAgIGlmICghcHJldmxvYWRlZCkge1xuICAgICAgcHJldmxvYWRlZCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgLy8g5a6M5oiQ6aKE5Yqg6L295Lu75Yqh77yM5LiN5YaN55uR5ZCsXG4gICAgICByZXNvbHZlZFByZXZsb2FkKClcbiAgICAgIHByZXZsb2FkV2F0Y2hlcigpXG4gICAgfVxuICB9XG59KVxuXG4vLyDlrozmiJDpooTliqDovb3ku7vliqFcbmZ1bmN0aW9uIHJlc29sdmVkUHJldmxvYWQoKSB7XG4gIC8vIOenu+mZpOexu1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJldmxvYWQtYmxvY2snKS5jbGFzc0xpc3QucmVtb3ZlKCdwcmV2bG9hZC1ibG9jaycpXG59XG5mdW5jdGlvbiBwcmV2bG9hZENvbXAoKSB7XG4gIHZpc2libGUudmFsdWUgPSB0cnVlXG4gIG5leHRUaWNrKCgpID0+IHtcbiAgICB2aXNpYmxlLnZhbHVlID0gZmFsc2VcbiAgfSlcbn1cbjwvc2NyaXB0PlxuPHRlbXBsYXRlPlxuICA8IS0tIHBhZ2UgY29udGVudCAtLT5cbiAgPGRpdj5URVNUPC9kaXY+XG4gIDxlbC1idXR0b24gQGNsaWNrPVwidmlzaWJsZSA9IHRydWVcIj5TaG93IERpYWxvZzwvZWwtYnV0dG9uPlxuICA8IS0tIERpYWxvZyAtLT5cbiAgPGVsLWRpYWxvZyB0aXRsZT1cIkhlYXZ5IERpYWxvZ1wiIHYtbW9kZWw9XCJ2aXNpYmxlXCIgd2lkdGg9XCI1NTBweFwiIG1vZGFsLWNsYXNzPVwicHJldmxvYWQtYmxvY2tcIj5cbiAgICA8c3Bhbj5UaGlzIGlzIGEgbWVzc2FnZTwvc3Bhbj5cbiAgICA8ZGl2PkRhdGE6IHt7IGRhdGEgfX08L2Rpdj5cbiAgPC9lbC1kaWFsb2c+XG48L3RlbXBsYXRlPlxuPHN0eWxlPlxuLnByZXZsb2FkLWJsb2NrIHtcbiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xufVxuPC9zdHlsZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7fVxufSIsInRzY29uZmlnLmpzb24iOiJ7XG4gIFwiY29tcGlsZXJPcHRpb25zXCI6IHtcbiAgICBcImFsbG93SnNcIjogdHJ1ZSxcbiAgICBcImNoZWNrSnNcIjogdHJ1ZSxcbiAgICBcImpzeFwiOiBcInByZXNlcnZlXCIsXG4gICAgXCJ0YXJnZXRcIjogXCJFU05leHRcIixcbiAgICBcIm1vZHVsZVwiOiBcIkVTTmV4dFwiLFxuICAgIFwibW9kdWxlUmVzb2x1dGlvblwiOiBcIkJ1bmRsZXJcIixcbiAgICBcImFsbG93SW1wb3J0aW5nVHNFeHRlbnNpb25zXCI6IHRydWUsXG4gICAgXCJ0eXBlc1wiOiBbXCJlbGVtZW50LXBsdXMvZ2xvYmFsLmQudHNcIl1cbiAgfSxcbiAgXCJ2dWVDb21waWxlck9wdGlvbnNcIjoge1xuICAgIFwidGFyZ2V0XCI6IDMuM1xuICB9XG59XG4iLCJfbyI6e319)

```vue
<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const data = ref('')
const visible = ref(false)

onMounted(async () => {
  data.value = await getData()
  prevloadComp()
})

function getData() {
  // fetch data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random()*900000+100000).toString(16))
    }, 500)
  })
}

let prevloaded = false
const prevloadWatcher = watch(visible, newVal => {
  if (newVal) {
    if (!prevloaded) {
      prevloaded = true
    } else {
      // 完成预加载任务，不再监听
      resolvedPrevload()
      prevloadWatcher()
    }
  }
})

// 完成预加载任务
function resolvedPrevload() {
  // 移除类
  document.querySelector('.prevload-block').classList.remove('prevload-block')
}
function prevloadComp() {
  visible.value = true
  nextTick(() => {
    visible.value = false
  })
}
</script>
<template>
  <!-- page content -->
  <div>TEST</div>
  <el-button @click="visible = true">Show Dialog</el-button>
  <!-- Dialog -->
  <el-dialog title="Heavy Dialog" v-model="visible" width="550px" modal-class="prevload-block">
    <span>This is a message</span>
    <div>Data: {{ data }}</div>
  </el-dialog>
</template>
<style>
.prevload-block {
  display: none !important;
}
</style>
```

通过 `modal-class` 属性给 Dialog 添加类，设置初始不可见。然后如上一节一样，在页面挂载并获取到数据后，预加载 Dialog，完成后移除类 `prevload-block`。不影响后续使用。

这种实现方案要求必须执行手动加载方法一次，否则类 `prevload-block` 永远不会被移除，dialog组件一直不可见。
