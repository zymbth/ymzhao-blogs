---
description: vue组件中监听键盘/按键事件
head:
  - - meta
    - name: keywords
      content: vue,keyup
created: '2021-09-06'
---

# vue组件中监听键盘/按键事件

## 问题描述

组件监听键盘事件，vue提供的按键修饰器无法监听到组件整体上。
将监听事件绑定在document上是可行的，但在组件销毁时，该事件依旧存在。

## 解决方案

创建组件时，将事件绑定在document上，销毁组件时，再移除该事件

::: code-group

```js [vue2及vue3选项式API]
created() {
  document.addEventListener('keyup', this.escEvent)
},
methods: {
  escEvent(){
    if(window?.event?.keyCode == 27) this.closeComp()
  },
  closeComp() {
    // ...
  }
}
beforeUnmount() {
  document.removeEventListener('keyup', this.escEvent)
},
```

```js [vue3组合式API]
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  document.addEventListener('keyup', escEvent)
})

onBeforeUnmount(() => {
  document.removeEventListener('keyup', escEvent)
})

function escEvent () {
  if(window?.event?.keyCode == 27) closeComp()
}

function closeComp () {
  // ...
}
```

:::

需要注意的时，addEventListener，removeEventListener的第二个参数需指向同一function。否则，后者将不会生效。

另外，如果使用`document.onkeyup()`监听，将会替换此前的onkeyup监听事件
