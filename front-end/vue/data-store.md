# vue3局部状态管理

vue3父子组件通信能满足大部分的需求，无需应用状态管理。但某功能模块间有数据管理的需求时，在模块内应用状态管理也是必要的。

## vuex / pinia

暂空

## store模式

在线查看：[js store模式实现局部状态管理](https://play.vuejs.org/#eNrNVU9v2jAU/ypWdgAkmgDrLllA66pq6g7t1O005WISh7p1bMt2gBblu+/ZTgJMZF2rHXZA+P3xez//3p/sggspw3VFgjhIdKaoNEgTU8lFymkphQLRCEVQoUSJBmHkpPBBDzr7pSjltLM7yQY8dpgdOcwahyTyKSEZCIaUkmFDQEIoyekaZQxrPU+DjcIyDZweLPcfFgA6ieC/0YBvcwSB4SVhixtckjiJvNDZKJeVQeuzUuSEQWD/Gm0ga8jhRhqgqA0a7aMm/o2dyb/Ii61fEh3gT7R5YvYQWuhoZx2XQuVExVO5RVowmqN3k8nk495ypnBOKx2jc7l1aonznPJVPJ00ihKrFeXxdAYh7M3aMegyBePA6Ezwgq6gOIJDOV3SNMgAK2VE3UpDBddpEHs41oYZE5uvTmdURcatPrsn2eMJ/YPeWl0afFNEE7UGvjqbAXDEePPV9xuyhXNnBL4rBt5/MN4RYKWyGL3b54rnAPvAz6G9dj0FtPzQV1tDuG4fZYFaz9r5pwF0mC1T39P3cN+H5+4e8Akstv0NBDbtu0OK4MzQNRnDqUB108quhRV0LvzI1rnmpMAVgytWh2ByoBvi7vqwUSNkWy1Gg5/Pz4Nxq6O8EIAP4DtFPWoOMI3XYBrm2OBRGxnci6F5kkQUyBrQfD5HA7F8IJkZjNCtO4QwPHTFh+ae6qbHbZKxuzFq0tg/++5ubvsXwSERRtzhzREV0I8vLYyUQ4dq456K5oe8ABK8Akp4xZir34pwOyxOAQBHKS8qDt6CI9flqhxaMhzJboQblhyuoU0wgjt+QF6xYiAaTBOIzUhmggkVrxR+Olo/jqw3LSAtMV/sdi3qbvGgugak1nhi+5yIfgFsvbjdLA0h8Nq31U7E/eJ5/7vQvkh90ZeVMVCuTxmj2SNcaeoGRF76UxJ5l/412vSl+1y84QP1b6q/VGIDO+m38s/+v/KfCt62wGsT9PVBbw7fC/1pTte3/gWTssmM)

`store.js`:

```js
import { reactive, ref } from 'vue'

export default {
  state: reactive({
    name: 'Zzz',
    info: {},
  }),
  setInfo(data) {
    if(typeof data === 'object') Object.assign(this.state.info, data)
  }
}
```

使用：

```vue
<script setup>
import { reactive, toRaw } from 'vue';
import store from './store.js'

const info = reactive({ age: null, gender: null })
function confirm() {
  store.setInfo(toRaw(info))
}
</script>

<template>
  <div class="wrap" style="border-color:gray">
    <h5>Comp1</h5>
    <div>
      <label>Name:</label>
      <span>{{ store.state.name }}</span>
    </div>
    <div>
      <label>Age:</label>
      <input v-model="info.age" />
    </div>
    <div>
      <label>Gender:</label>
      <input v-model="info.gender" />
    </div>
    <button @click="confirm">Confirm</button>
  </div>
</template>
```
