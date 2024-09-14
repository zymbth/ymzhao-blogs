---
description: vue-router 在新的标签页打开链接/路由，由于官方没有提供对链接target属性的配置，要实现这个需求，需要自行实现，这里提供几个方案供参考。
head:
  - - meta
    - name: keywords
      content: vue,vue-router,target,router-link,resolve,新的标签页
---

# vue-router 在新的标签页打开链接/路由

## 调用 API

vue-router 的路由实例除了常见的 push, replace, go 等接口，还提供了一个很好用的接口 [resolve](https://router.vuejs.org/zh/api/interfaces/Router.html#Methods-resolve)，可用于解析路由，第一个参数类型与 push/replace 一致。

```js{6,10}
import { useRouter } from 'vue-router'

const router = useRouter()

function handleGoEditReport({ no }) {
  const target = router.resolve({
    name: 'ReportDetail',
    params: { rid: no },
  })
  window.open(target.href, '_blank')
}
```

与 push 的使用差别不大

## RouterView 组件

vue-router 的 RouterView 组件是在当前页面内跳转路由，有些场景下会要求在新标签页中打开。

RouterView 组件实际上还是渲染成 `<a>` 标签，参考[源码](https://github.com/vuejs/router/blob/main/packages/router/src/RouterLink.ts#L309-L327)

::: details RouterView renderer 源码片段

```js{5-7,9,20}
// ...
setup(props, { slots }) {
  // ...
  return () => {
    const children = slots.default && slots.default(link)
    return props.custom
      ? children
      : h(
          'a',
          {
            'aria-current': link.isExactActive
              ? props.ariaCurrentValue
              : null,
            href: link.href,
            // this would override user added attrs but Vue will still add
            // the listener, so we end up triggering both
            onClick: link.navigate,
            class: elClass.value,
          },
          children
        )
  }
},
// ...
```

:::

该组件属性中也没有关于 target 的属性([源码](https://github.com/vuejs/router/blob/main/packages/router/src/RouterLink.ts#L269-L283))。

下面提供几个方案

### 1. 转为调用 API

参照上一部分的方法，弃用 RouterView，转成调用 API

### 2. 自定义链接组件

组合式 API - [useLink](https://router.vuejs.org/zh/guide/advanced/composition-api.html#useLink)

参照官网示例，承接 RouterView 所有属性，使用组合式 API 解析得到所需的链接信息，再按具体需求生成目标路由链接。

### 3. 插槽 + custom 属性

在 RouterLink 的 v-slot 中可以访问与 useLink 组合式函数相同的属性。

基于插槽与 [custom](https://router.vuejs.org/zh/api/interfaces/RouterLinkProps.html#Properties-custom) 属性，可以如下创建一个简单链接满足需求，这一方案同上一方案比较类似，都需要自行处理 isActive, isExactActive 等状态。原因参阅上面的源码片段 👆

```vue
<template>
  <router-link :to="{ name: 'ReportDetail', params: { rid: 'A00000001' } }" :custom="true">
    <template #default="{ href }">
      <a :href="href" target="_blank">GO</a>
    </template>
  </router-link>
</template>
```

### 4. 添加 vue 自定义指令-绑定路由 target

由于 RouterView 组件最终会渲染成 `<a>` 标签，添加一个指令用于绑定链接的 target 属性即可

::: code-group

```js [main.js 注册自定义指令]
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.directive('target', {
  mounted(el, binding) {
    // 将元素的 target 属性设置为绑定值
    const { value: target = '_blank' } = binding
    el.setAttribute('target', target)
  },
})

app.mount('#app')
```

```vue [使用指令]
<template>
  <router-link v-target :to="{ name: 'ReportDetail', params: { rid: 'A00000001' } }"
    >GO</router-link
  >
</template>
```

:::

### 小节

RouterView 组件的“新标签页打开”需求个人更倾向于添加一个自定义指令
