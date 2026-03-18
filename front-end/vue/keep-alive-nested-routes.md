---
description: Vue KeepAlive 在中后台多级嵌套路由下经常出现缓存失效、状态错乱或内存膨胀等问题。本文深入剖析 KeepAlive 仅缓存第一层组件的底层机制，结合实战场景，全方位探讨“动态路由扁平化”、“多级 KeepAlive 状态同步”、“抽离 Layout 降维打击”以及“状态级缓存降级”等架构级解决方案。无论你的系统是多标签页（Tabs）还是传统导航架构，都能在此找到最优的缓存管理策略。
head:
  - - meta
    - name: keywords
      content: Vue3,KeepAlive,嵌套,多级,扁平化,nested,route,flattening
created: '2026-03-18'
---

# Vue 进阶：破解嵌套路由 KeepAlive 缓存失效的架构级指南

## 前言

Vue [KeepAlive](https://cn.vuejs.org/guide/built-ins/keep-alive.html) 新手经常出现缓存失效的状况，常规的命名或配置引发的失效可参考 [vue3 KeepAlive 组件缓存失效 bug 分析](./keep-alive-bug)。

除了上文提到的几点外，有研究过的就会知道对于[嵌套路由](https://router.vuejs.org/zh/guide/essentials/nested-routes.html)，缓存也往往是不生效的。这不是bug，是 KeepAlive 的特性决定的，它只缓存它的直接子（第一层）组件。一旦父级 `<router-view>` 因为路由切换被卸载，其内部子组件缓存都会被卸载。

嵌套路由在实际应用中分很多种情景，下面按情景分析。

嵌套路由示例：

::: code-group

```text [结构]
/user/johnny/profile                   /user/johnny/posts
┌──────────────────┐                  ┌──────────────────┐
│ User             │                  │ User             │
│ ┌──────────────┐ │                  │ ┌──────────────┐ │
│ │ Profile      │ │  ────────────>   │ │ Posts        │ │
│ │              │ │                  │ │              │ │
│ └──────────────┘ │                  │ └──────────────┘ │
└──────────────────┘                  └──────────────────┘
```

```js [router.js]
import User from './User.vue'
// ...

const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        path: 'profile',
        component: UserProfile,
      },
      {
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```

```vue [App.vue]
<template>
  <router-view />
</template>
```

```vue [User.vue]
<template>
  <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    <router-view />
  </div>
</template>
```

:::

面对这个痛点，最常见的回答是“把路由拍平”。然而，真实的项目远比按教程写 Demo 复杂：

- 如果中间层路由不仅是中转，还带有专属的 DOM 结构（如侧边栏）怎么办？
- 如果强行套娃多级 KeepAlive，该如何避免废弃组件长久驻留引发的“内存膨胀”？
- 如果系统没有多标签页（Tabs）来让用户显式关闭缓存，又该如何进行精准的生命周期管理？

本文根据**“中间层路由是否纯中转”**这一核心业务场景探索架构级 KeepAlive 缓存解决方案。

## 一、中间层路由纯中转

项目公用一个布局（Layout），嵌套路由（中间层）纯中转，无任何实际DOM。放上例中，也就是 `User.vue` 为：

```vue
<template>
  <router-view />
</template>
```

既然Layout一致，嵌套无视图层上的意义，那么能不能将嵌套路由展平呢？下面以一个实例演示

### 实例背景

某中后台系统，采用嵌套路由，相关代码如下：

- `@/router/index.js`

routes 中按模块定义了很多嵌套路由，中间层路由上使用了 `redirect` 或 `children` 默认路由语法

meta 属性中添加了 `breadcrumb: false`，表示该路由在面包屑中不显示；`activeMenu: 'parent-1'` 表示菜单中高亮哪级上级路由

```js{29-79}
import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'

/**
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set. 'parent-2': 高亮上两级路由
  }
 */
const routes = [
  { path: '/login', component: () => import('@/views/login/index') },
  { path: '/404', component: () => import('@/views/404') },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: 'Home' },
      },
    ],
  },
  {
    path: '/compound',
    component: Layout,
    redirect: '/compound/summary',
    name: 'Compound',
    meta: { title: 'Compound' },
    children: [
      {
        path: 'summary',
        name: 'CompoundSummary',
        component: () => import('@/views/compound/overview/index.vue'),
        meta: { title: 'Compound Summary' },
      },
      {
        path: 'database',
        name: 'CompoundDatabaseIndex',
        component: () => import('@/views/compound/database/index.vue'),
        meta: { title: 'Compound Database' },
        children: [
          {
            path: '',
            name: 'CompoundDatabase',
            component: () => import('@/views/compound/database/list'),
            meta: { breadcrumb: false, activeMenu: 'parent-1' },
          },
          {
            path: ':id',
            name: 'CompoundDatabaseDetailIndex',
            component: () => import('@/views/compound/database/detail/index'),
            meta: { title: 'ReviR Compound', activeMenu: 'parent-1' },
            children: [
              {
                path: '',
                name: 'CompoundDatabaseDetail',
                component: () => import('@/views/compound/database/detail/home'),
                meta: { breadcrumb: false, activeMenu: 'parent-2' },
                props: true,
              },
              {
                path: 'ADME',
                name: 'CompoundDatabaseDetailADME',
                component: () => import('@/views/compound/database/detail/ADME'),
                meta: { title: 'ADME', activeMenu: 'parent-2' },
                props: true,
              },
            ],
          },
        ],
      }
    ]
  },
  // ...
  { path: '/:pathMatch(.*)*', redirect: '/404' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
```

除登录与404页外，所有页面共用一个布局，中间层纯中转，无实际 DOM

- `@/components/Breadcrumb/index.vue`

面包屑导航中读取 `route.matched` 获取嵌套层级，生成面包屑导航

```vue{9}
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 读取 route.matched 获取嵌套层级
const breadcrumbItems = computed(() => {
  return route.matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
})
</script>
```

- `@/layout/components/AppMain.vue`

KeepAlive 缓存生效的页面：`component` 属性为 `Layout` 组件的路由 `children` 直接子路由对应的页面

```vue{3-7}
<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <KeepAlive :max="30">
        <component :is="Component" />
      </KeepAlive>
    </router-view>
  </section>
</template>
```

- `@/layout/components/Sidebar/index.vue`

侧边栏中根据 `meta.activeMenu` 以及 `route.matched` 嵌套层级，高亮侧边栏导航

```vue{14}
<script setup>
import { compile } from 'path-to-regexp'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeMenu = computed(() => {
  const { meta, path, matched, params } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    // 指定高亮路径
    if (meta.activeMenu.startsWith('parent-')) {
      const target = matched[matched.length - 1 - meta.activeMenu.split('-')[1]]
      if (!target) return path
      const toPath = compile(target.path)
      return toPath(params)
    }
    return meta.activeMenu
  }
  return path
})
</script>
```

### 分析

KeepAlive 无法缓存嵌套路由是由该组件的特性决定的，如果撤销中间层路由，将嵌套路由转换为一级路由，KeepAlive 就能对所有页面生效了。

但“展平”后，嵌套层级丢失了，依赖于这个层级（`route.matched`）的面包屑导航、侧边栏导航等逻辑要如何处理？

如果我们在转换的同时，将层级关系存储在路由 meta 中不就行了吗？

### 思路：动态路由扁平化 + Meta注入

在开发配置时，依然写多级嵌套的路由配置（保持逻辑层级）；但在注入到 Vue Router 之前，写一个拦截/转换函数，将多级路由“展平”为一维数组（打平视图层级）。同时，在展平的过程中，手动保留层级映射关系。

拦截函数核心逻辑：保留一级路由（如包含 `Layout` 的路由），递归地将其内部嵌套的所有的二、三、四级子路由全部提取出来，变为一级路由的直接 `children`，同时计算好绝对路径，并将原有的嵌套层级关系以数组的形式注入到 `meta.matchedList` 中

### 实现

- 路由改造

::: code-group

```js [@/router/index.js]
import { createRouter, createWebHashHistory } from 'vue-router'
import { flattenRoutes } from './utils/routeFlatten' // [!code ++]

// 原始配置保持多级嵌套树结构不变
const routes = [
  // ...
]

const router = createRouter({
  history: createWebHashHistory(),
  // 在注入前进行“拍平”编译
  routes, // [!code --]
  routes: flattenRoutes(routes), // [!code ++]
})

export default router
```

```js [@/router/utils/routeFlatten.js]
/**
 * 将多级嵌套路由“拍平”为一维数组，并注入路由层级数据
 * @param {Array} routes 原始路由配置数组
 * @returns {Array} 拍平后的路由配置数组
 */
export function flattenRoutes(routes) {
  const result = []

  routes.forEach((route) => {
    // 浅拷贝当前路由对象，避免污染原始配置
    const topRoute = { ...route }

    // 通常只针对包含 children 且作为 Layout 容器的一级路由进行拍平
    if (topRoute.children && topRoute.children.length > 0) {
      // 构造顶级节点的路由信息
      const topMatched = {
        path: topRoute.path,
        name: topRoute.name,
        meta: topRoute.meta || {},
        redirect: topRoute.redirect
      }

      // 递归拍平所有子路由，将其全部提升为一级路由的直接子节点
      topRoute.children = flattenChildren(topRoute.children, topRoute.path, [topMatched])
    }

    result.push(topRoute)
  })

  // console.log('result: ', result)
  return result
}

/**
 * 递归处理子节点，收集所有叶子节点
 * @param {Array} children 当前子路由数组
 * @param {string} basePath 父级完整路径
 * @param {Array} matched 祖先路由链路数组
 * @returns {Array} 拍平后的一维子路由数组
 */
function flattenChildren(children, basePath, matched) {
  let flatRoutes = []

  children.forEach((child) => {
    // 1. 计算当前节点的完整绝对路径
    const fullPath = resolvePath(basePath, child.path)

    // 2. 构建包含当前节点的路由信息
    const currentMatched = {
      path: fullPath,
      name: child.name,
      meta: child.meta || {},
      redirect: child.redirect
    }
    const newMatched = [...matched, currentMatched]

    // 3. 构造拍平后的当前路由节点
    const flatChild = { ...child }
    flatChild.path = fullPath // 使用绝对路径，Vue Router 支持子路由使用绝对路径
    flatChild.meta = {
      ...flatChild.meta,
      matchedList: newMatched // 【核心】将完整的层级链路注入 meta
    }

    // 4. 判断是否为中间嵌套层
    if (child.children && child.children.length > 0) {
      // 针对中间嵌套层节点（比如：:tid, database）：
      // 如果它自身带有 redirect，说明它承担了跳转任务，我们需将其保留在扁平路由表中
      if (child.redirect) {
        flatRoutes.push({
          path: fullPath,
          name: child.name,
          redirect: child.redirect,
          meta: flatChild.meta
          // 注意：去掉了 component，因为它只作为重定向节点，避免渲染空的 <router-view>
        })
      }
      // （如果中间节点没有 redirect，通常说明它依靠 path: '' 的子节点渲染，我们直接丢弃该中间节点即可）

      // 递归处理它的子节点，并将结果拼接到当前平级数组中
      flatRoutes = flatRoutes.concat(flattenChildren(child.children, fullPath, newMatched))
    } else {
      // 如果是叶子节点（实际渲染的页面），直接推入扁平数组
      flatRoutes.push(flatChild)
    }
  })

  return flatRoutes
}

/**
 * 辅助函数：拼接并格式化绝对路径
 */
function resolvePath(basePath, routePath) {
  let path = routePath
  if (!path.startsWith('/')) {
    path = `${basePath}/${path}`
  }
  // 替换多个连续斜杠为单个，并去除末尾斜杠 (除非路径就是 '/')
  path = path.replace(/\/+/g, '/')
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1)
  }
  return path
}
```

:::

- 面包屑导航组件更新

```js
import { useRoute } from 'vue-router'
const route = useRoute()

// 以前是读取 matched
const breadcrumbItems = computed(() => {
  return route.matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false) // [!code --]
  const matchedList = route.meta.matchedList || [] // [!code ++]
  return matchedList.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false) // [!code ++]
})
```

- 侧边栏更新

侧边栏中根据 `meta.activeMenu` 以及 `route.matched` 嵌套层级，高亮侧边栏导航

```vue
<script setup>
import { compile } from 'path-to-regexp'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeMenu = computed(() => {
  const { meta, path, matched, params } = route
  const matchedList = meta?.matchedList || [] // [!code ++]
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    if (meta.activeMenu.startsWith('parent-')) {
      const target = matched[matched.length - 1 - meta.activeMenu.split('-')[1]] // [!code --]
      const target = matchedList[matchedList.length - 1 - meta.activeMenu.split('-')[1]] // [!code ++]
      if (!target) return path
      const toPath = compile(target.path)
      return toPath(params)
    }
    return meta.activeMenu
  }
  return path
})
</script>
```

- 嵌套 RouterView

本场景中，中间层路由就是个中转：

```vue
<template>
  <router-view />
</template>
```

但有些模块需要进行局部的状态管理或者逻辑处理，天然就适合放在该组件中。

在进行路由“展平”后，该组件就无用了，所含的状态管理或者逻辑处理就自然不会被执行，可以将相关逻辑移动到独立js中，在所有子页面中引入。

::: code-group

```vue [@/views/compound/database/index.vue]
<template>
  <router-view />
</template>

<script setup>
import { onMounted, watch } from 'vue' // [!code --]
import { useRoute } from 'vue-router' // [!code --]
import { replaceBreadcrumbTitle } from '@/utils' // [!code --]

const route = useRoute() // [!code --]
onMounted(() => { // [!code --]
  watch( // [!code --]
    () => route.params?.id, // [!code --]
    val => val && replaceBreadcrumbTitle('currGene', val), // [!code --]
    { immediate: true } // [!code --]
  ) // [!code --]
}) // [!code --]
</script>
```

```js [@/views/compound/database/use/useSubPageInit.js]
import { useRoute } from 'vue-router'
import { replaceBreadcrumbTitle } from '@/utils'

export default () => {
  const route = useRoute()

  if (!route.params.id) return

  replaceBreadcrumbTitle('currGene', route.params.id)
}
```

```vue [@/views/compound/database/detail/index.vue]
<script setup>
import useSubPageInit from './use/useSubPageInit.js'

useSubPageInit()
</script>
```

:::

- 其他

其他还有一些vue钩子的改动与补充调整，某些逻辑需要额外考虑 `onActivated`、`onDeactivated` 这两个钩子。

### 小结

对于中间层无实际DOM的路由表，仅需添加一个转换函数，展平并记录层级。无需改动现有路由配置，即可实现多级路由的缓存。

本例中采用的粗放式的缓存管理，仅设置了 `max` 参数，精细化的缓存管理则需要额外的逻辑（页面名称、`include/exclude`），可参考下一节。

## 二、中间层路由存在实际DOM

假如中间层本身就是一个包含复杂 UI（如侧边栏、搜索区）的组件，扁平化会丢失这些 UI。

### 方案一：多级 KeepAlive

直接应用多级 `KeepAlive` 会如何？这是常规解法，但需要精细化管理(`include/exclude`)，否则极易出现内存膨胀（内存占用过大乃至浏览器崩溃）的状况。

::: code-group

```vue{4-6} [根级Layout]
<template>
  <router-view v-slot="{ Component, route }">
    <!-- 必须把父页面也纳入全局缓存 -->
    <keep-alive :include="globalCachedViews">
      <component :is="Component" :key="route.name" />
    </keep-alive>
  </router-view>
</template>
```

```vue{10-12} [模块级父组件]
<template>
  <div class="compound-module-container">
    <!-- 模块专属的侧边栏 -->
    <aside class="compound-sidebar">
      <CompoundMenu />
    </aside>
    <main class="compound-content">
      <router-view v-slot="{ Component, route }">
        <!-- 缓存具体的子页面 -->
        <keep-alive :include="moduleCachedViews">
          <component :is="Component" :key="route.name" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>
```

:::

状态管理是个重难点，需要通过 `Vuex/Pinia` 维护至少两个 cachedViews 数组。

::: warning 粗放式管理
仅靠 `max` 会如何？

- 无法手动移除缓存
- 多级路由下，上级缓存未移除时，下级缓存将被保留
- ...

只适合轻量级 C 端项目
:::

#### 精细化管理方案

::: tip
本小节含 AI 生成内容
:::

##### 1. 多标签架构

很多中后台系统（[vue-element-admin](https://panjiachen.github.io/vue-element-admin)）都包括标签页系统，标签页系统存在“关闭”、“关闭其它”、“关闭所有”等功能。

标签页系统天然就适合缓存的精细化管理，“关闭”标签就意味着用户不再需要该页面，可移除该缓存。缓存树中，无用的上级缓存也需要检测出来并移除。

反之，在多标签架构中使用max进行粗放管理会产生无法同步业务UI的问题。

##### 2. 无标签架构

Tabs 本质上只是赋予了用户“显式操控缓存生命周期的开关”，如果没有 Tabs，我们就必须根据“业务直觉”和“路由行为”来隐式地推断何时应该销毁缓存。

对于无 Tabs 的系统，精细化管理通常有以下三种经典策略：

👉**策略 1**：基于路由层级深度（栈导航逻辑）—— 最适用于“列表 -> 详情”场景

规则直觉： “前进刷新，后退缓存”

- 从 List（层级1）点击进入 Detail（层级2）：List 应该被缓存
- 从 Detail（层级2）返回到 List（层级1）：Detail 应该被立刻销毁

实现思路：在路由的 `meta` 中定义 `depth`（层级深度）。在全局的 `router.beforeEach` 中判断

```js
router.beforeEach((to, from) => {
  if (to.meta.depth < from.meta.depth) {
    // “后退”：主动从 include 数组中剔除 from.name (销毁详情页)
    store.removeCache(from.name) 
  } else {
    // “前进”或“平级”跳转：将 to.name 加入 include 数组 (准备缓存)
    store.addCache(to.name)
  }
})
```

👉**策略 2**：基于“菜单栏点击”的强制重置 —— 适用于传统后台管理系统

如果没有 Tabs，用户通常通过左侧的 Menu 菜单栏来切换大的业务模块。

规则直觉：只要用户是从“左侧主菜单”点击进入某个页面的，就代表他想开启一个全新的业务流程

实现思路：拦截 Menu 组件的点击事件（或者监听对应的一级路由跳转）。一旦发生跨模块或点击菜单的行为，强行清空所有的 `include` 缓存

👉**策略 3**：基于业务生命周期钩子

规则直觉：组件的任务完成了，就自我销毁

实现思路：利用 Vue Router 的 `onBeforeRouteLeave` 钩子

例如，在一个“新建表单页”中，只有当用户点击了“提交成功”后，才销毁缓存；如果是误触离开了，就保留缓存。

```js
// 在新建表单页组件内
import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave((to, from, next) => {
  if (isSubmitSuccess.value) {
    // 业务办理完毕，通知全局 store 销毁自己的缓存
    store.removeCache('CreateFormPage')
  }
  next()
})
```

### 方案二：抽离“模块Layout”

上一节中，对于中间层组件的js逻辑进行了抽离，再在子页面中引入。中间层的DOM是否也可以抽离呢？

中间层的DOM其实就是该模块的Layout，放在中间层组件中恰恰是嵌套路由结构的优势。既然要展平路由，那再将该布局抽离出来就是了：

- 提取模块Layout（比如叫 `CompoundLayout.vue`）
- 路由扁平化（参考上节）
- 在子页面中引入该模块Layout并包裹原页面内容

::: code-group

```vue [根级Layout]
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="globalCachedViews">
      <component :is="Component" :key="route.name" />
    </keep-alive>
  </router-view>
</template>
```

```vue{10} [Compound模块Layout组件]
<!-- @/components/CompoundLayout.vue -->
<template>
  <div class="compound-module-container">
    <!-- 模块专属的侧边栏 -->
    <aside class="compound-sidebar">
      <CompoundMenu />
    </aside>
    <!-- 核心：用 slot 替代原先的 <router-view> -->
    <main class="compound-content">
      <slot></slot> 
    </main>
  </div>
</template>
```

```vue{2-6,10} [模块子页面]
<template>
  <CompoundLayout>
    <div class="database-page-content">
      <!-- 原本子页面的所有业务代码 -->
    </div>
  </CompoundLayout>
</template>

<script setup>
import CompoundLayout from '@/components/CompoundLayout.vue'
// ...
</script>
```

:::

这样改造后，只有一级 KeepAlive，缓存就好管理了。

::: warning
**副作用**：每个子页面都持有一个独立的 `CompoundLayout` 实例，即，模块内页面跳转时，`CompoundLayout` 的状态会丢失。可以通过状态管理来掩盖实例切换时的重绘痕迹（状态提升至 `Vue/Pinia`）。
:::

#### 动态布局

上面将模块布局抽离，再在模块的所有子页面中引入使用。如果页面过多，那挺繁琐的。那么是否可以根据模块定义多个全局布局，在根布局中就决定使用哪个布局呢？

- 在扁平化路由时，给路由的 meta 加上一个 layout 字段，声明这个页面需要什么外壳
- 在根布局组件中，拦截路由，并使用 Vue 的 `<component :is="...">` 动态组件来渲染对应的 Layout

```vue{3,29-32}
<template>
  <!-- 动态匹配布局组件 -->
  <component :is="layoutComponent">
    <!-- 内部依然渲染具体的路由页面 -->
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="globalCachedViews">
        <component :is="Component" :key="route.name" />
      </keep-alive>
    </router-view>

  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CompoundLayout from '@/layouts/CompoundLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()

// Layout 映射表
const layoutMap = {
  CompoundLayout,
  DefaultLayout
}

// 根据当前路由的 meta.layout 动态计算出要使用的布局组件
const layoutComponent = computed(() => {
  const layoutName = route.meta?.layout || 'DefaultLayout'
  return layoutMap[layoutName]
})
</script>
```

这样，相对于嵌套路由结构来说，模块内的子页面无需做任何改动。

::: danger
这种结构存在**致命缺陷**，模块内页面切换，正常缓存页面。跨模块后，上一模块的页面缓存会被移除，因为布局组件切换后，内部的 KeepAlive 实例被销毁了。
:::

那如果将 KeepAlive 放在外面呢？错误更加离谱了，KeepAlive 只会缓存它的直接子节点。

相比之下，前者在子页面中重复引入模块布局只是多了三行代码而已，它保证了整个应用 DOM 树在 KeepAlive 看来是绝对扁平的一层结构。无论用户跨多少个模块跳转，都不会触发外层容器的整体销毁。

::: code-group

```html [布局切换后缓存失效]
<Layout>
  <KeepAlive>
    <Page />
  </KeepAlive>
</Layout>
```

```html [错误缓存]
<KeepAlive :include="globalCachedViews">
  <Layout>
    <Page />
  </Layout>
</KeepAlive>
```

:::

### 方案三：放弃DOM级缓存

降级为“数据级缓存”

大型应用中，过度依赖 `KeepAlive` 往往会引发内存膨胀或生命周期混乱（比如 `onMounted` 不触发了，必须用 `onActivated`，导致逻辑割裂）。

对于极其复杂的嵌套模块，可能放弃缓存更合适（权衡实现与性能），使用 `Vuex/Pinia` 存储核心状态(搜索条件、表单数据、滚动位置、分页信息等)即可，再次进入页面时读取缓存数据。

## 总结

`KeepAlive` 缓存页面，对缓存的要求越精细，就越是需要一套完善的管理策略与实现方案。

项目有扁平化路由的条件是最简单的，可绕开 Vue 嵌套缓存机制的 Bug，将多维问题降为一维。

项目不合适将嵌套路由扁平化的话，采用多级 `KeepAlive` 缓存就需要配套多级状态管理进行精细化管理。

`KeepAlive` 缓存管理策略：

- 仅使用 `max` 属性限制缓存页面上限
- 精细化管理，使用 `include/exclude`, `max` 属性精准控制缓存页面
  - 多标签架构：通过用户“关闭标签页”的行为显式操控缓存，多级 `KeepAlive` 需要多级状态管理进行同步
  - 其它：采用诸如基于栈（前进后退）、基于业务行为（表单提交、菜单点击）的隐式推断等策略管理缓存
