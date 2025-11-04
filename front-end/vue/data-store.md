---
description: vue3 局部状态管理，父子组件通讯、provide/inject、store模式、状态管理
head:
  - - meta
    - name: keywords
      content: vue,组件通讯,provide,store,状态管理,eventbus
created: '2024-06-20'
---

# vue3 局部状态管理

vue3 父子组件通信能满足大部分的需求，无需应用状态管理。但某功能模块内组件多、层级深时，就可能有状态管理的需求。

## Provide / Inject

若仅需要在某个模块内管理状态，完全可以使用 vue3 的 `provide` / `inject` api，在模块的根组件上定义数据，后代组件中注入依赖

在线演示：

<DemoIframe title="Provide / Inject |vue3 局部状态管理" src="https://play.vuejs.org/#eNrdVb1yEzEQfhVxFHZm4nMSoDkcQwiZTCgSJqFirpHvFEeJLN3odI4TjwtmQsdfEShIQ8MMDTQwTDLh52WMQ8crsJLuHNvYxslQ0dgn7Wr30+63n5rOQhS59YQ4nlOKA0kjhWKikqjsc1qLhFSoiSTBgaJ1Mo0iKeo0hA/YCgVne6iFNqWooRyEyN3snlkUtWg2tbhFs9JJcj73eSB4rFCIFUbz3dD5ps8R4rhGPJR7uL+fm9ZryjeFh4wJIVwFG08YMyaEqoSHRPZsteC3NeXzFGQ+p3PkzrHm9Xqq1wFuugopwaeOGZovG1SuRgHQYGvAdwXggK9GpZ0NrrXKNgmUi+OYVrnJ4Gq79YLzGlCpaCsLNYWFIrWIYUVghVAppHUUMDg+7zu7Eke+Y/bBsnWjDL0pFeE/3QHf9BMWDFcIK2v4XqloF10b5VGiUL1QEyFhELh7Ld9BxSxa8TzcsMgLUO4/AscR5uVm09ZJ39CFrqBWC26oLZNFXraNmyC4bfHY+JZp9lKZoVTsqXEpVntMf7i6vLZpFSE1gtmogWLBaIiuzszMAHszS0HikCaxh65HDbMd4TCkvOrNzqQbNSyrlHuzcxBCn2yZLptMzrSjYiD5Jq2627HgMFkmqe8EgJUyItciRWEIfKfLbd/BjInde2ZPyYSkHIczWyTYGbK/HTf0nu/clyQmsg6t7doUgCPKmpc2VkkDvrtG4ETCwHuMcZ1AVRKN0brdSXgIsHv8DNoVM+tQlgfxUkMRHmeX0kCzgdTeMPm6TaOufg73mnvdnIN6QhW7sjFOmyjX82eGPNUoJdbx7hhdmuvTpbnhumTDphICI2yNqQb02DNVAJfMKUikvDtM3foFbEC+tE5sJhzcBUeGPbKWn7JFSpPccvPmbvksg9YyS7wLyAsyLIVlSvVAMCG9qsR7fdKzISDuJaSnb4iNkl5QHYbqzqCgZRXQ8nMBTRulPCPD2yaNylBJlIJu3Q4YDXb0Mds2qOOi/SoVrUuvWM2NE6uU9YaUk7BeK0qiSDhI90nZrHvYz2bzHg6wOfXKklk2w8h6CBja+2oaYkMQL3tP04DAXPuaapb/G8JWpNgFeeph7LLEPAS9vRRtrxQKqH389MfjRz8/HJ8dfeo8e9s5PPn15Un76/ezw3edNydnpwft08/t4/ed5y/a347OXh90Xp10Pr5EhUJ/mL+8vn3+w4inAf5n7/Rwrrd+A3lXfKc=" />

模块根组件中定义数据及管理方法

```js
const data = reactive({
  name: 'Zzz',
  info: { age: null, gender: null },
})
provide('data', readonly(data))
provide('setName', val => (data.name = val))
provide('setInfo', info => {
  Object.assign(data.info, info)
})
```

后代组件中注入使用

```js
const data = inject('data')
const setName = inject('setName')
const setInfo = inject('setInfo')
```

注意，注入后，直接更改引用类型内部数据会增加管理上的混乱，是需要避免的。因为多个组件可能会同时修改和访问同一个状态，导致难以追踪和理解状态的变化。

为了避免管理上的混乱，在设计状态管理时：

- 明确定义状态的作用域和职责，确保每个状态只被相关的组件使用和修改。
- 使用明确的操作来更新状态。建议使用具有明确目的的方法来更新状态，而不是直接修改引用类型状态的内部值。这样可以更容易地跟踪和理解状态的变化。

## vuex / pinia

> [pinia](https://pinia.vuejs.org/)
>
> [vuex](https://vuex.vuejs.org/)

参照官方文档

`pinia` 示例：

`store.js`:

选项式风格

```js
import { defineStore } from 'pinia'

export const usePatientStore = defineStore('patient', {
  state: () => ({
    name: 'Zzz',
    info: { age: null, gender: null },
  }),
  actions: {
    setName(val) {
      this.name = val
    },
    setInfo(data) {
      if (typeof data === 'object') {
        Object.assign(this.info, data)
      }
    },
  },
})
```

组合式风格

```js
import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const usePatientStore = defineStore('patient', () => {
  const name = ref('Zzz')
  const info = reactive({ age: null, gender: null })

  const setName = (val) => {
    name.value = val
  }
  const setInfo = (data) => {
    if (typeof data === 'object') {
      Object.assign(info, data)
    }
  }
  return { name, info, setName, setInfo }
})

```

使用：

```js
import { usePatientStore } from './store.js'

const patientStore = usePatientStore()

// 读取
console.log(patientStore.name)
// actions
function handleSetInfo() {
  patientStore.setInfo({ age: 18, gender: 'male' })
}
```

## store 模式

对于简单的需求，完全可以使用 store 模式实现局部状态管理

在线查看[示例](https://play.vuejs.org/#eNrtVk1v2jAY/iuvsgMgsfCx7pIBW1dVU3dop26nKReTmNStsSPbAVrEf99rOwmhCl2ZNGmHHVDs9/vzMdvgPM/DVUGDKJjoRLHcgKamyGexYMtcKgNbSOQyLwxNYQcLJZfQQflOzddGKloywoG7hfd6z79A7VHNdzfr8FBgfCAwLgVikUihDSSFUtdkSWFax9LdxgIgoyaCbg+mMx9GqA0xNBQo27d8TCWCFeENAWqspY9hF8m9WOzwNxn4zDFnvBi6zDlawRvAJGUrSDjRehoHa0XyOHB05Ny9n2HtJgP8lhSULY944WRO+cz6iiYDf6l5TGAOsHq7lCnlaLjKLw5gUBkb7K21GT7PWuzqnIjZdntQCyYWMiQZhd0O87QCr3PwhYqUqhN8ZE7hRTd+FOoUfeP9tZKbDBr1n2jzyO0htKUH1/K5VDauUb4BLTlL4c1wOPyw57xVJGWFjuAs3zhyTtKUiSwaDUvCkqiMiWg0RhNWc+cmwHkK+oHROHMLluEMS4Fb4ZxiizBWxqm6yQ3DmYyDyIdjeYRzuf7qaEYVfvKczh1NHlro93pjaXHwTVFN1Qr7XvMMBkeNZ19+v6YbPNdMnJeCo/QLzFuKVSlsjF7scyFSDLsh56K9cquHZfmhLzeGCl0lZQO1kjsnHwe4iLZNx1Lfh/suPHN6WE+sYgUDWMAaRhQliWErnMQmjChcOvzRjZNK6YIUHKUtDffXjldUa+LSOzKA3fAIOj+fnjr9imanEEPDyB1h1ysP5cq7ha8MA5g7phtwgdCC/FJzr3iFNrspMaShyRZd85hTuQDLgOl0Ch05v6eJ6fTgxh1CBAyWiW7DiY2u7zR6pRf7sbWqIfElDK5K0Acjb8n6oIY4w7/D4gpJbRSYaqOgGAmiQwSi4Nz13O+xJ3h8XBQCpaVA8MXNUEsEXKdXI6qrkourax30LK6eCqtoDTcQr+UaJ5JLFWWKPB5ArivWH4FuG3C5zp8IjK3I+xzRK9Q9AdGPAW6rad+kY9bnhTHYrk8JZ8mDfV9837CQF/40GXiR49BbzqV7if/Cf4N/8mVvH8G5kmsE02czOP7/8L/24W+fr90vGP5wwg==)

`store.js`:

```js
import { reactive } from 'vue'

export default {
  state: reactive({
    name: 'Zzz',
    info: { age: null, gender: null },
  }),
  setInfo(data) {
    if (typeof data === 'object') Object.assign(this.state.info, data)
  },
}
```

使用：

```js
import store from './store.js'

function handleSetInfo() {
  store.setInfo({ age: 18, gender: 'male' })
}
```

## EventBus

组件间通信利器

> [mitt](https://github.com/developit/mitt): `mitt` 是一个轻量级的JavaScript事件总线库，拥有简单而强大的API，总体大小仅为200字节。它具有与Node.js的EventEmitter类似的API和命名约定，并且没有依赖项。它支持IE9+以及任何JavaScript运行时环境。

::: details 使用示例

```js
import mitt from 'mitt'

const emitter = mitt()

// listen to an event
emitter.on('foo', e => console.log('foo', e) )

// listen to all events
emitter.on('*', (type, e) => console.log(type, e) )

// fire an event
emitter.emit('foo', { a: 'b' })

// clearing all events
emitter.all.clear()

// working with handler references:
function onFoo() {}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten
```

:::

有时间可以看看它的[源码](https://github.com/developit/mitt/blob/main/src/index.ts)，非常精简，几分钟就能看完

或者查看另一篇文章[Mitt源码学习](/study/source-code/mitt)
