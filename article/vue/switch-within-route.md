# vue相同的组件实例间跳转页面不刷新的问题分析

vue相同的组件实例间跳转，即路径参数更改，但页面未刷新

## 项目场景

设置了路径参数的路由，其映射的页面间相互跳转

例如：

from `/user/1` to `/user/2`

路由：

```js
{
 name: 'user',
 path: ':id',
 // ...
}
```

## 问题描述

路由成功跳转，但页面不会刷新

`created()`, `mounted()`均不会触发

## 原因分析

官网有解释

> [vue-router：响应路由参数的变化](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E5%93%8D%E5%BA%94%E8%B7%AF%E7%94%B1%E5%8F%82%E6%95%B0%E7%9A%84%E5%8F%98%E5%8C%96)

*“使用带有参数的路由时需要注意的是，当用户从 /users/johnny 导航到 /users/jolyne 时，**相同的组件实例将被重复使用**。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。**不过，这也意味着组件的生命周期钩子不会被调用**。”*

## 解决方案

### 1、watch $route 对象上的任意属性

```javascript
  watch: {
    '$route.params.id': function (newVal, oldVal) {
      this.initFunc()
    },
  },
```

直接监听`$route`、`$route.params`都是可行的

### 2、使用 beforeRouteUpdate 导航守卫

> [组件内守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E7%BB%84%E4%BB%B6%E5%86%85%E7%9A%84%E5%AE%88%E5%8D%AB)

```javascript
export default {
  name: 'Article',
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
    // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
    this.initFunc()
  },
}
```

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

## 注意

上述解决方案实际上是将组件需重新执行的初始化代码(`created()`、`mounted()`)放进初始化方法中，通过两类监听方式，手动执行组件的初始化方法

实际上，组件并不是被“刷新”了。需要额外注意**目标参数**的更改和再次读取的**时序**。否则，会导致读取到“上一页”老数据，刷新失败

### 实例一

beforeRouteUpdate函数内，**同步获取**路由参数，获取到的是`from`的值

```javascript
  beforeRouteUpdate(to, from) {
    console.log('to:', to.path, to.query)
    console.log('from:', from.path, from.query)
    this.initFunc()
  },
  methods: {
    initFunc() {
      console.log('initFunc queryStr:', this.$route.query.query)
      // ...
    }
  }
```

`/search?query=aaaa` → `/search?query=bbbb`

打印结果：

```text
to: /search {query: 'bbbb'}
from: /search {query: 'aaaa'}
initFunc queryStr: aaaa
```

可以看到，刷新页面后，在钩子函数`beforeRouteUpdate`内同步执行初始化方法`initFunc()`，其获取的路由参数是跳转前的

异步执行则可正确获取跳转后的路由信息

```js
setTimeout(() => {
  this.initFunc()
},0)
```

如果直接监听路由（本例中，监听`$route.query.query`），也不会出现这个问题

### 实例二

监听路由并不能保证“上一页”的老数据不被读取

用户页面路由如下：

```javascript
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: ':id',
        name: 'User',
        component: () => import('@/views/user/index'),
        props: true
      }
    ]
  }
```

[Vue Router - 路由组件传参](https://router.vuejs.org/zh/guide/essentials/passing-props.html#%E5%B8%83%E5%B0%94%E6%A8%A1%E5%BC%8F)

>*“当 props 设置为 true 时，route.params 将被设置为组件的 props”*

user.vue：通过**组件参数id**从后台获取用户信息

```javascript
<script>
export default {
  props: {
    id: { type: [Number, String] }
  },
  beforeRouteUpdate(to, from) {
    console.log('beforeRouteUpdate')
  },
  watch: {
    '$route.params.id'(newVal, oldVal) {
      console.log('route.params.id changed', newVal, oldVal)
      this.initFunc()
    },
    id(newVal, oldVal) {
      console.log('prop: id changed', newVal, oldVal)
    }
  },
  methods: {
    initFunc() {
      console.log('initFunc:', this.id)
      // ...
    }
  }
</script>
```

`user/1` → `user/2`

打印的结果是：

```text
beforeRouteUpdate
route.params.id changed 2 1
initFunc: 1
prop: id changed 2 1
```

钩子函数`beforeRouteUpdate`最先触发，其次是监听到路由参数变化，然后监听到组件参数变化。尽管后两者都指路由参数`id`，但上述示例中的监听方式仍然会导致初始化方法读取到旧`id`的问题。可以选择直接监听`id`，或者使用 `this.$route.params.id` 获取用户详情

```javascript
<script>
export default {
  props: {
    id: { type: [Number, String] }
  },
  watch: {
    id(newVal, oldVal) {
      this.initFunc()
    }
  },
  methods: {
    initFunc() {
      // ...
    }
  }
```
