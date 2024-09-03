---
description: 实现 element-plus 表格多选时按 shift 进行连选的功能
head:
  - - meta
    - name: keywords
      content: elementplus,表格,连选,多选,shift
---

# 实现 element-plus 表格多选时按 shift 进行连选的功能

## 前言

element-plus表格提供了多选功能，可单击勾选一条数据，可全选。

现在有个很合理的需求，希望实现类似于文件系统中shift连续选择功能，并且在表格排序后，依照排序后的顺序连选。

::: details 在线演示

[在线演示](https://codepen.io/zymbth/pen/YzOzVxw) （示例基于 element-plus@2.2.9, vue@3.2.37）

<ClientOnly>
  <iframe height="500" style="width: 100%;" scrolling="no" title="[Demo] el-table shift 连选功能" src="https://codepen.io/zymbth/embed/preview/YzOzVxw?default-tab=result&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href="https://codepen.io/zymbth/pen/YzOzVxw">
    [Demo] el-table shift 连选功能</a> by zymbth (<a href="https://codepen.io/zymbth">@zymbth</a>)
    on <a href="https://codepen.io">CodePen</a>.
  </iframe>
</ClientOnly>

:::

## 一、el-table 多选表格基本使用

### 1. el-table 相关事件、方法

- 插入多选项

`<el-table-column type="selection" />`

- 表格事件

| 事件名 | 说明 | 回调参数 |
| :-------- | :----- | :----- |
| select | 当用户手动勾选数据行的 Checkbox 时触发的事件 | selection, row |
| select-all | 当用户手动勾选全选 Checkbox 时触发的事件 | selection |
| selection-change | 当选择项发生变化时会触发该事件 | selection |

- 表格方法

| 方法名 | 说明 | 参数 |
| :-------- | :----- | :----- |
| clearSelection | 用于多选表格，清空用户的选择 | - |
| getSelectionRows | 返回当前选中的行 |  |
| toggleRowSelection | 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否 | row, selected |
| toggleAllSelection | 用于多选表格，切换全选和全不选 | - |

- table-column 属性

`selectable`: 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选。（类型：`function(row, index)`）

### 2. el-table 多选表格示例

```html
<template>
  <el-table
    :data="tableData"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" />
    <!-- other columns -->
  </el-table>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getTableData } from '@/api/demo.js'

const tableData = ref([])
const selectedRows = ref([])

onMounted(() => {
  getData()
})

const getData = () => {
  getTableData().then(res => {
    tableData.value = res.data ?? []
  })
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}
</script>
```

## 二、实现

由于该功能可能会应用到很多页面中，最好是提供一个统一的公共方法，在页面中引入使用

### 1. 分析

基本过程：

\> 记录上一次点击的数据；记录 shift 状态
\> 组件挂载后，监听 shift 键的 `keydown`, `keyup` 事件，更新 shift 状态；组件销毁前取消相关监听
\> 监听 el-table@select 事件，对比上一次点击与本次点击，计算待连选数据列表后，使用 `toggleRowSelection` 方法进行连续勾选

细节依据需求调整

### 2. 实现

根据分析，初步创建方法
==注意==: 为了方便理解思路，下面的示例中仅包含关键代码，完整代码在最后

el-table-multi-select.js:

```js
import { ref, readonly, watch, onMounted, onBeforeUnmount } from 'vue'

export function elTableMultiSelect(tableEl) {
  // 表格数据
  const tableData = ref([])
  // 选中数据列表
  const selectedRows = ref([])
  // 下标记录
  const lastIdx = ref(-1)
  // shift标识
  const shiftFlag = ref(false)
  
  onMounted(() => {
    // el-table 表格排序不会体现在绑定的数据列表上
    // 监听 el-table 组件内部状态存储中的表格数据(避免表格排序后连选不连续的bug)
    watch(tableEl.store?.states?.data, (newVal) => {
      tableData.value = newVal.map((item,idx) => {
        item._index = idx
        return item
      })
    }, { immediate: true })
      
    // Shift监听/取消监听
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
  })
  // 取消Shift监听
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
  })
  // Shift事件处理
  function handleKeyDown({ key }) {
    if(key !== 'Shift') return
    if(shiftFlag.value) return
    shiftFlag.value = true
  }
  function handleKeyUp({ key }) {
    if(key !== 'Shift') return
    if(!shiftFlag.value) return
    shiftFlag.value = false
    lastIdx.value = -1
  }
  // el-table@select
  function handleTbSelect(selection, row) {
    updateSelection(selection)
    
    // 若未按 shift，更新 lastIdx
    if(!shiftFlag.value) {
      if(selection.find(r => r._index === row._index)) lastIdx.value = row._index
      return
    }
    // 若 lastIdx 无有效值，记录本次下标
    if(lastIdx.value === -1) {
      lastIdx.value = row._index
      return
    }

    // 若 lastIdx 有值，自动勾选中间rows
    let [start, end] = [lastIdx.value, row._index]
    if(start > end) [start, end] = [end, start]
    
    // TODO: toggleRowSelection
    // ...
  }
  // el-table@selection-change
  function handleTbSelectionChange(selection) {
    updateSelection(selection)
  }
  // 更新 selectedRows
  function updateSelection(selection) {
    selectedRows.value = selection
  }
  
  return {
    selectedRows: readonly(selectedRows),
    handleTbSelect,
    handleTbSelectionChange
  }
}
```

组件中引入使用

demo.vue:

```html
<template>
  <el-table
    :data="tableData"
    @select="handleTbSelect"
    @selection-change="handleTbSelectionChange"
    ref="demoTable"
  >
    <el-table-column type="selection" />
    <!-- other columns -->
  </el-table>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getTableData } from '@/api/demo.js'
import { elTableMultiSelect } from '@/use/el-table-multi-select'

const demoTable = ref()
const tableData = ref([])
// const selectedRows = ref([]) // 从公共方法中导出

const {
  selectedRows,
  handleTbSelect,
  handleTbSelectionChange
} = elTableMultiSelect(demoTable)

onMounted(() => {
  getData()
})

const getData = () => {
  getTableData().then(res => {
    tableData.value = res.data ?? []
  })
}

// 从公共方法中导出
// const handleSelectionChange = (selection) => {
//   selectedRows.value = selection
// }
```

### 3. 小结

==注意==：在下面的完整代码中，本人监听了 el-table 组件内部状态存储信息（`tableEl.store.states.data`），未公布在官网。随着版本的更新，有失效的风险。建议锁定 element-plus 版本号或者确定所使用的版本仍有效。

不监听表格绑定的数据本身，是因为el-table排序后，不会体现在绑定的数据上，也就是说，排序后，连选功能还是按照排序前的顺序来进行连选的，连选就毫无意义了。

## 三、代码与演示

[在线演示](https://codepen.io/zymbth/pen/YzOzVxw)

完整代码中兼容了 vue3 的两种代码风格，用法在注释中。

工具方法完整代码：

```js
import { ref, readonly, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * 工具类: el-table 可多选表格，增加shift连选功能
 * 
 * @param {string|Element} tableRef 选项式API中，传表格ref字符串；setup中，传表格对象
 * @param {Function} [checkRowSelectable] 禁选方法(可选)，对应el-table-column selectable属性值
 * @returns {Object} {
 *   selectedRows: 多选结果列表,
 *   handleTbSelect: el-table@select,
 *   handleTbSelectionChange: el-table@selection-change,
 *   clearSelection: 清空多选结果列表
 * }
 * @example
 * // 一、引入
 * 
 * import { elTableMultiSelect } from '@/use/el-table-multi-select'
 * 
 * // 二、template
 * 
 * // el-table 相关属性方法
 *   @select="handleTbSelect"
 *   @selection-change="handleTbSelectionChange"
 *   ref="multiSelectTable"
 * 
 * // 三、方法调用：
 * 
 * ------------------------1. 选项式API：------------------------
 * 
 * // data() 相关变量声明:
 * selectedRows: [],
 * handleTbSelect: undefined,
 * handleTbSelectionChange: undefined
 * 
 * // created() 中解构赋值:
 * ;({
 *   selectedRows: this.selectedRows,
 *   handleTbSelect: this.handleTbSelect,
 *   handleTbSelectionChange: this.handleTbSelectionChange
 * } = elTableMultiSelect.call(this, 'multiSelectTable', this.enableSelection)) // 传表格ref字符串
 * // methods:
 * enableSelection(row, rowIndex) {
 *   return !row.suspected_detection_seq
 * }
 * 
 * ------------------------2. 组合式API：------------------------
 * 
 * const multiSelectTable = ref()
 * const {
 *   selectedRows, handleTbSelect, handleTbSelectionChange
 * } = elTableMultiSelect(multiSelectTable, enableSelection) // 传表格ref对象
 * 
 * function enableSelection(row, rowIndex) {
 *   return !row.suspected_detection_seq
 * }
 */
export function elTableMultiSelect(tableRef, checkRowSelectable) {

  // 表格数据
  const tableData = ref([])
  // 选中数据列表
  const selectedRows = ref([])
  // 下标记录
  const lastIdx = ref(-1)
  // shift标识
  const shiftFlag = ref(false)

  let tableEl                    // 表格对象
  const tbFlag = ref(false)      // 标识:表格挂载完毕
  const mountedFlag = ref(false) // 标识:组件挂载完毕

  const isSetup = typeof(tableRef) !== 'string'
  isSetup && watch(tableRef, (newVal) => {
    if(newVal) {
      tableEl = newVal
      tbFlag.value = true
    }
  }, { deep: true, immediate: true })

  onMounted(() => {
    mountedFlag.value = true
    if(!isSetup) {
      tbFlag.value = true
      tableEl = this.$refs[tableRef]
    }

    // Shift监听/取消监听
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
  })
  // 取消Shift监听
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
  })
  // Shift事件处理
  function handleKeyDown({ key }) {
    if(key !== 'Shift') return
    if(shiftFlag.value) return
    shiftFlag.value = true
  }
  function handleKeyUp({ key }) {
    if(key !== 'Shift') return
    if(!shiftFlag.value) return
    shiftFlag.value = false
    lastIdx.value = -1
  }

  // 表格挂载 & 组件挂载 后, 添加 tableData 监听事件
  const tbMountedWatcher = watch([tbFlag, mountedFlag], ([tf, mf]) => {
    if(tf && mf) {
      // el-table 表格排序不会体现在绑定的数据列表上
      // 监听 el-table 组件内部状态存储中的表格数据(避免表格排序后连选不连续的bug)
      watch(tableEl.store?.states?.data, (newVal) => {
        // console.log('watch el-table store', newVal.length)
        tableData.value = newVal.map((item,idx) => {
          item._index = idx
          return item
        })
      }, { immediate: true })
      tbMountedWatcher() // 取消监听
    }
  })

  // toggleRowSelection 会触发 handleTbSelectionChange
  // onprogress 控制shift多选时，只触发一次 handleTbSelectionChange
  // (handleTbSelectionChange 为同步执行方法)
  const onprogress = ref(false)

  /**
   * 当选择项发生变化时会触发该事件
   * @param {Array} selection selected rows
   */
  function handleTbSelectionChange(selection) {
    if(!onprogress.value) updateTbSelection(selection)
  }

  /**
   * 当用户手动勾选数据行的 Checkbox 时触发的事件
   * @param {Array} selection selected rows
   * @param {Object} row table row data
   * @returns 
   */
  function handleTbSelect(selection, row) {
    updateTbSelection(selection)

    if(!shiftFlag.value) {
      if(selection.find(r => r._index === row._index)) lastIdx.value = row._index
      return
    }
    // lastIdx为-1时，记录本次下标
    if(lastIdx.value === -1) {
      lastIdx.value = row._index
      return
    }

    // lastIdx 有值，自动勾选中间rows
    let [start, end] = [lastIdx.value, row._index]
    if(start > end) [start, end] = [end, start]
    nextTick(() => {
      const temp = []
      for(let i = start; i <= end; i++) {
        const tmp = tableData.value[i]
        if(selectedRows.value.find(r => r._index=== tmp._index)) continue
        if(!checkRowSelectable1(tmp)) continue
        temp.push(tmp)
      }
      onprogress.value = true
      for(let i = 0, len = temp.length; i < len; i++) {
        if(i === len - 1) onprogress.value = false
        tableEl.toggleRowSelection(temp[i], true)
      }
    })
  }

  // 更新 selectedRows
  function updateTbSelection(selection) {
    // selectedRows.value = selection
    // keep sequence
    selectedRows.value = selection.slice(0).sort((a, b) => a._index - b._index)
  }

  // 清空 selectedRows
  function clearSelection() {
    selectedRows.value = []
  }

  function checkRowSelectable1(row, rowIndex) {
    return typeof(checkRowSelectable) === 'function'
      ? checkRowSelectable(row, rowIndex)
      : true
  }

  return {
    selectedRows: readonly(selectedRows),
    handleTbSelect,
    handleTbSelectionChange,
    clearSelection
  }
}
```
