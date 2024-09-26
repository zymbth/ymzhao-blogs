---
description: Element Plus 虚拟化表格组件的使用(排序、筛选、自定义单元格渲染) - 个人使用总结
head:
  - - meta
    - name: keywords
      content: elementplus,虚拟化表格,排序,筛选,自定义
created: '2023-03-13'
---

# Element Plus 虚拟化表格组件的使用(排序、筛选、自定义单元格渲染) - 个人使用总结

## 前言

`element-plus@2.2.0` 后提供虚拟化表格组件，解决表格数据过大导致的卡顿等性能问题。相对于表格组件，用法上区别还是挺大的，尤其是一些附加的功能，例如排序、筛选、自定义单元格/表头渲染等等。

本文参照官网文档、示例，结合个人使用总结，演示虚拟化表格的基本使用，记录上述附加功能的基本实现。除组件的相关接口需要按照官网规范使用外，示例中的其它具体实现的方法**仅作参考**，提供使用思路。

创建了一个项目收纳本文的一些 demos:

[Git Page 演示](https://zymbth.github.io/element-plus-tablev2-demo/)

[element-plus-tablev2-demo](https://github.com/zymbth/element-plus-tablev2-demo)

[element-plus-tablev2-demo (gitee)](https://gitee.com/ymzhao/element-plus-tablev2-demo)

### 官方介绍

_“在前端开发领域，表格一直都是一个高频出现的组件，尤其是在中后台和数据分析场景。 但是，对于 Table V1 来说，当一屏里超过 1000 条数据记录时，就会出现卡顿等性能问题，体验不是很好。
通过虚拟化表格组件，超大数据渲染将不再是一个头疼的问题。”_

### 官方提示

> TIP
>
> 该组件**仍在测试中**，生产环境使用可能有风险。 若您发现了 bug 或问题，请于 [GitHub](https://github.com/element-plus/element-plus/issues) 报告给我们以便修复。 同时，有一些 API 并未在此文档中提及，因为部分还没有开发完全，因此我们不在此提及。
>
> **即使**虚拟化的表格是高效的，但是当数据负载过大时，**网络**和**内存容量**也会成为您应用程序的瓶颈。 因此请牢记，虚拟化表格永远不是最完美的解决方案，请考虑数据分页、过滤器等优化方案。

> TIP
>
> 在 SSR 场景下，您需要将组件包裹在 `<client-only></client-only>` 之中 (如: [Nuxt](https://nuxt.com/v3)) 和 SSG (例如: [VitePress](https://vitepress.vuejs.org/)).

### 实践与性能对比

什么时候需要使用虚拟化表格？它高性能的原因是什么？它真的能满足你的需要吗？等等，这些问题本应在选择使用它之前就搞明白，内容略多，放在结尾吧[👇](./tablev2#八、总结)。

## 一、Element Plus 表格基础

### 属性

详见官网，这里只说几点需要注意的地方

- 表格属性: width, height 必填（可使用 `AutoResizer` 组件使表格自动调整大小，使用方式参照官网）
- 表格属性 columns 为列 column 的配置数组，这是与表格组件最大的差异之一
- column 的配置中，可定义很多之前定义在 column 模板中的属性
- column 的配置属性中，cellRenderer 自定义单元格渲染是最大的差异（模板 ----> js）

### 简单使用

::: code-group

```html [el-table(TableV1)]
<script setup>
  const columns = [
    { prop: 'name', label: 'Name', width: 100 },
    { prop: 'age', label: 'Age', width: 100 },
    { prop: 'gender', label: 'Gender', width: 100 },
    { prop: 'tel', label: 'Tel', width: 100 },
  ]
  const tableData = [
    { name: '', age: '', gender: '', tel: '' },
    // ...
  ]
</script>
<template>
  <el-table :data="tableData">
    <el-table-column v-for="col in columns" :key="col.prop" v-bind="col" />
  </el-table>
</template>
```

```html [el-table-v2(TableV2)]
<script setup>
  const columns = [
    { key: 'name', dataKey: 'name', title: 'Name', width: 100 },
    { key: 'age', dataKey: 'age', title: 'Age', width: 100 },
    { key: 'gender', dataKey: 'gender', title: 'Gender', width: 100 },
    { key: 'tel', dataKey: 'tel', title: 'Tel', width: 100 },
  ]
  const tableData = [
    { name: '', age: '', gender: '', tel: '' },
    // ...
  ]
</script>
<template>
  <el-table-v2 :columns="columns" :data="tableData" :width="700" :height="400" fixed />
</template>
```

:::

后续的示例基于 `element-plus@2.2.17`

## 二、自定义单元格渲染

### jsx/tsx 或 vue 渲染函数

注意，Element Plus 的虚拟化表格组件(TableV2)提供的自定义单元格、表头单元格渲染器都要求返回 `VNode`。需要使用 `jsx/tsx` 或者 `vue 渲染函数` 实现。如无需使用上述两个单元格渲染器，仅作基本数据展示、排序等基本功能的话，可以像 TableV1 一样直接在 vue 单文件组件内使用。

### 准备工作

本文采用 `jsx` 实现， Vue CLI 创建的项目可直接在 vue 单文件组件的 script 标签中添加 lang="jsx" (`<script setup lang="jsx">`)

> _“`create-vue` 和 Vue CLI 都有预置的 JSX 语法支持。如果你想手动配置 JSX，请参阅 [@vue/babel-plugin-jsx](https://github.com/vuejs/jsx-next) 文档获取更多细节。”_

- `jsx` 用法可参考：

> [Vue 3 Babel JSX 插件](https://github.com/vuejs/babel-plugin-jsx/blob/dev/packages/babel-plugin-jsx/README-zh_CN.md)
>
> [vue 官网 - 渲染函数 & JSX - JSX / TSX](https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx)
>
> [element-plus 虚拟化表格组件 el-table-v2 渲染自定义组件的其中两种方式(js 和 jsx)及注意事项](https://blog.csdn.net/Mr_WangGeGe/article/details/127275868)
>
> [在 Vue 中使用 JSX，很 easy 的](https://juejin.cn/post/7018742119082754062)

需掌握最基本的 插值、v-if、v-for、v-on、事件修饰符、组件的 jsx 语法，以及组件的插槽语法

- Element Plus 官方文档：

> [Element Plus - Virtualized Table 虚拟化表格](https://element-plus.gitee.io/zh-CN/component/table-v2.html)

需了解该组件的常用属性方法、Column 属性
本节的重点是单元格自定义渲染，在于 `cellRenderer` 方法，其参数类型如下：

```typescript
type CellRenderProps<T> = {
  cellData: T
  column: Column<T>
  columns: Column<T>[]
  columnIndex: number
  rowData: any
  rowIndex: number
}
```

分别为 单元格值、项、所有项、项下标、行数据、行下标

### 渲染方式对比（el-table vs el-table-v2）

`el-table` 中常用的自定义单元格渲染方式（定义在表格 column 模板中）

`el-table-v2` 中常用的自定义单元格渲染方式（定义在 column 配置列表中）

::: code-group

```html [el-table]
<el-table :data="tableData">
  <el-table-column v-for="col in columns" :key="col.prop" v-bind="col">
    <template #default="{ row }">
      <!-- 自定义单元格渲染 -->
      <el-tag v-if="col.prop === 'tag'">{{ row[col.prop] }}</el-tag>

      <template v-else-if="col.prop === 'link'">
        <router-link
          v-if="!!row.id"
          :to="{ name: 'TargetRouteName', params: { id: row.id } }"
          >{{ row[col.prop] }}</router-link
        >
        <span v-else>{{ row[col.prop] }}</span>
      </template>

      <template v-else>{{ row[col.prop] }}</template>
    </template>
  </el-table-column>
</el-table>
```

```html [el-table-v2]
<script lang="jsx" setup>
  const columns = [
    {
      key: 'link',
      title: 'Link',
      dataKey: 'link',
      width: 100,
      cellRenderer: ({ cellData, rowData }) => (
        <a href={rowData.link} target='_blank'>Go</a>
      ),
    },
    // ...
  ]
</script>
```

:::

**vue 单文件组件需要在 script 中加上`lang="jsx"`**

### 实例列举

为了对照，会分别放上 `el-table` 与 `el-table-v2` 的自定义单元格渲染代码

为了精简代码，下述 `el-table-v2` 的示例均只展示 `cellRenderer` 函数

- 组件

::: code-group

```html [TableV1]
<template v-else-if="col.prop === 'gene'">
  <router-link
    v-if="row.id"
    :to="{ name: 'Target', params: { tid: row.id } }"
    class="gene-text"
    >{{ row[col.prop] || '-' }}</router-link
  >
  <span v-else class="gene-text">{{ row[col.prop] || '-' }}</span>
</template>
```

```js [TableV2]
const cellRenderer = ({ cellData, rowData: row }) => {
  return row.id ? (
    <router-link to={{ name: 'Target', params: { tid: row.id } }} class='gene-text'>
      {cellData ?? '-'}
    </router-link>
  ) : (
    <span class='gene-text'>{cellData ?? '-'}</span>
  )
}
```

:::

包含了插值、v-if、组件。全局注册的组件可直接在 jsx 中使用

- v-for

::: code-group

```html [TableV1]
<template v-if="col.prop === 'result'">
  <router-link
    class="gene-source-tag"
    v-for="tag in row[col.prop]"
    :to="{ name: 'TargetAnalysis', params: { tid: row.id, type: tag } }">
    <el-tag>{{ tag }}</el-tag>
  </router-link>
</template>
```

```js [TableV2]
const cellRenderer = ({ cellData, rowData: row }) => {
  return (
    <>
      {cellData?.map(tag => (
        <router-link
          class='gene-source-tag'
          to={{ name: 'TargetAnalysis', params: { tid: row.id, type: tag } }}>
          <el-tag>{tag}</el-tag>
        </router-link>
      )) ?? ''}
    </>
  )
}
```

:::

包含 v-for、组件、空标签。若并未全局引入 Element Plus，需手动引入相关组件，其它自定义组件同样如此。

## 三、表头分组

> 此前的对官网的表头分组功能理解有误，官网是通过表格属性 `header-height` 来设置多级表头，在新的表头上创建分组
>
> .
>
> 属性：`header-height`
>
> 描述说明：Header 的高度由`height`设置。 如果传入数组，它会使 header row 等于数组长度
>
> 类型：Number/Array\<Number\>
>
> 默认值：50
>
> .
>
> 下面的原demo倒也能实现分组，而且无需通过设置多一级表头来实现
>
> 再说一遍，官网的表头分组demo是真的sao
>
> 下面的两种分组实现均在[Git Page 演示](https://zymbth.github.io/element-plus-tablev2-demo/)中可见

官方文档在 TableV2 上给出的说法是“表头分组”，效果同 TableV1 不大一样。

V1是通过 `<el-table-column>` 嵌套实现，意义明确、实现简单，创建一个嵌套的 `columns` 列表就可以。

V2的实现是通过表格组件提供的 `header` 插槽

```html
<script setup>
const CustomizedHeader  = ({ cells, columns, headerIndex }) => {
  return cells
}
</script>
<template>
  <el-table-v2
    :columns="columns"
    :data="tableData"
    :width="666"
    :height="666"
  >
    <template #header="props">
      <CustomizedHeader v-bind="props" />
    </template>
  </el-table-v2>
</template>
```

类型:

```typescript
type HeaderSlotProps = {
  cells: VNode[]
  columns: Column<any>[]
  headerIndex: number
}
```

### Demo(多一级表头实现表头分组)

官网demo通过新增一级表头来实现分组，`CustomizedHeader` 组件的生成过程非常sao，对理解造成了很大干扰。官方已经把默认生成的表头 VNode 列表提供给我们了，我们自行处理，返回一个VNode列表即可，需要实现表头分级，并保持对齐。

官网的表头分组是根据序号进行的，实际上不实用，这里通过添加一个分组标识来实现

`columns` 中添加 `_group` 属性，标识所属分组，`CustomizedHeader`组件中遍历一遍表头VNode，分组相同的连续表头为一个分组

demo:

el-table-v2: `:header-height="[36, 50]"` (两级表头，高度分别为36px, 50px)

::: code-group

```html [template]
<el-table-v2
  :columns="columns"
  :data="tableData"
  :header-height="[36, 50]"
  :width="666"
  :height="666">
  <template #header="props">
    <CustomizedHeader v-bind="props" />
  </template>
</el-table-v2>
```

```js [js]
const columns = [
  { key: 'no', dataKey: 'no', title: 'No.', width: 60 },
  { key: 'code', dataKey: 'code', title: 'code', width: 80, _group: 'Group 1' },
  { key: 'name', dataKey: 'name', title: 'name', width: 80, _group: 'Group 1' },
  { key: 'age', dataKey: 'age', title: 'Age', width: 60, _group: 'Group 2' },
  { key: 'gender', dataKey: 'gender', title: 'gender', width: 80, _group: 'Group 2' },
  { key: 'city', dataKey: 'city', title: 'City', width: 80 },
]

const CustomizedHeader = ({ cells, columns, headerIndex }) => {
  if (headerIndex === 1) return cells
  const groupCells = []
  let currGroupCell = []
  for (let i = 0, len = columns.length; i < len; i++) {
    currGroupCell.push(cells[i])
    if (!columns[i]._group || columns[i]._group !== columns[i + 1]?._group) {
      const width = currGroupCell.reduce((prev, curr) => prev + curr.props.column.width, 0)
      groupCells.push(
        <div class='cell-group' style={{ width: `${width}px` }}>
          {columns[i]._group ?? ''}
        </div>
      )
      currGroupCell = []
    }
  }
  return groupCells
}
```

:::

注意，在 `headerIndex` 为`1`时直接返回了`cells`，这是因为 `:header-height="[36, 50]" ` 对应了两个表头（`CustomizedHeader`组件），第二个表头不作处理，第一个为分组表头。

### Demo(不增加一级表头)

`CustomizedHeader` 组件属性中提供了原表头VNode列表，你可以以极大自由度地操控这些VNode来改变表头，上面的demo只是官网提供的一种。

同样的 `columns`，表格无需通过`header-height`增加一级表头

::: code-group

```html [template]
<el-table-v2
  :columns="columns"
  :data="tableData"
  :width="666"
  :height="666">
  <template #header="props">
    <CustomizedHeader v-bind="props" />
  </template>
</el-table-v2>
```

```js [js]
const CustomizedHeader = ({ cells, columns, headerIndex }) => {
  const groupCells = []
  let currGroupCell = []
  for (let i = 0, len = columns.length; i < len; i++) {
    currGroupCell.push(cells[i])
    if (!columns[i]._group || columns[i]._group !== columns[i + 1]?._group) {
      const width = currGroupCell.reduce((prev, curr) => prev + curr.props.column.width, 0)
      groupCells.push(
        currGroupCell.length > 1 ? (
          <div class='cell-group' style={{ width: `${width}px` }}>
            <div class='group-title'>{columns[i]._group ?? ''}</div>
            <div class='cells-wrap'>{currGroupCell}</div>
          </div>
        ) : (
          currGroupCell[0]
        )
      )
      currGroupCell = []
    }
  }
  return groupCells
}
```

:::

上例中，`CustomizedHeader`组件中对VNode的处理同上一个demo很类似。但实现了一种“合并单元格”的效果。除了宽度必须为原来两个单元格的宽度之和以保证对齐外，该元素的内容及样式均可自行设置。

## 四、排序

### 介绍

TableV1 组件排序的实现过程：

设置 `el-table-column` 的 `sortable` 属性为 `true` 即可。

多个排序间相互独立

TableV2 排序的实现在我看来是“自由度很高”的，除了根据单项排序表格外，它还提供了一种叫“受控排序”的东西（可以实现多重排序）：

首先，排序值只有两种，升/降序。清空排序需要手动清空记录排序状态的变量；

其次，组件提供了排序监听事件(`@column-sort`)，但具体的排序方法需自行定义；

再次，不同于 TableV1 同时只进行一项排序，TableV2 允许多重排序。它可以记录所有可排序项的排序状态，但如何实现多重排序需要你自己在监听事件中实现。（自由度很高，一方面需要手动实现多重排序方法，另一方面需要通过管理排序状态变量控制表头 UI 上的三种状态: 升/降/无。为了避免 UI 上的疑惑，这两方面需要协调一致）

### 关键属性、事件、方法说明

先放上从官网上粘过来的相关的属性、事件、方法说明，方便对照后续示例参考

- TableV2 属性

| 属性名     | 描述说明 | 类型   | 默认值    |
| ---------- | -------- | ------ | --------- |
| sort-by    | 排序方式 | Object | {}        |
| sort-state | 多个排序 | Object | undefined |

- TableV2 事件

| 事件名      | 描述         | 参数   |
| ----------- | ------------ | ------ |
| column-sort | 列排序时调用 | Object |

- Column 属性

| 属性名   | 描述             | 类型    | 默认值 |
| -------- | ---------------- | ------- | ------ |
| sortable | 设置列是否可排序 | Boolean | -      |

- 相关类型

```typescript
type KeyType = string | number | symbol

type ColumnSortParam<T> = { column: Column<T>; key: KeyType; order: SortOrder }

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

type SortBy = { key: KeyType; Order: SortOrder }
type SortState = Record<KeyType, SortOrder>
```

### 使用示例（属性、事件、方法）

示例只保留了最基本的部分，方便理解如何使用。第三小节提供了完整 demo codepen 链接，可在线调试

#### 单项排序

一般想要的就是表格若干项可以排序，但只进行单项排序

```html
<el-table-v2 :sort-by="sortState" @column-sort="onSort" ... />
```

```javascript
// 自行编写排序事件处理方法
const handleSort = () => {}
// 记录排序状态, key: 排序项的key, order: 升/降序
const sortState = ref({ key: 'no', order: 'asc' })
// 监听排序事件
const onSort = ({ key, order }) => {
  handleSort()
  sortState.value = { key, order }
}
```

#### 多重排序

举个例子，有个人员表，希望按城市排序，同一城市的按性别排序，同一性别的按年龄排序

```html
<el-table-v2 v-model:sort-state="sortState" @column-sort="onSort" ... />
```

```javascript
// 事件处理方法：自行根据 sortState 实现多重排序
const handleSort = () => {}
// 以键值对形式记录排序状态
const sortState = ref({
  city: 'desc',
  gender: 'asc',
  age: 'asc',
})
// 监听排序事件
const onSort = ({ key, order }) => {
  handleSort()
  sortState.value[key] = order
}
```

#### 在线演示

[el-table-v2 单项排序 demo](https://codepen.io/zymbth/pen/jOvBNex)

[el-table-v2 多重排序 demo](https://codepen.io/zymbth/pen/KKxWPOG)

## 五、筛选/过滤器

### 介绍

类似于自定义单元格渲染，实现筛选需要通过自定义表头单元格渲染实现

官方示例是在可筛选的表头单元格中添加显示为筛选图标的弹出框（`el-popover` 组件），弹出框内显示可筛选选项，选项列表需要自行计算好。筛选的执行也需要自行监听实现，和排序一样，自由度非常高~

自定义表头单元格渲染：

```javascript
const columns = [
  {
    // key, dataKey, title, ...
    headerCellRenderer: props => {
      return props.column.title
    },
  },
  // ...
]
```

Column 属性

| 属性名             | 描述             | 类型                                             | 默认值 |
| ------------------ | ---------------- | ------------------------------------------------ | ------ |
| headerCellRenderer | 自定义头部渲染器 | VueComponent/(props: HeaderRenderProps) => VNode | -      |

类型

```typescript
type HeaderRenderProps<T> = {
  column: Column<T>
  columns: Column<T>[]
  columnIndex: number
  headerIndex: number
}
```

通过在 `headerCellRenderer` 方法中返回一个的 VNode 实现自定义表头单元格渲染

### 使用示例

筛选/过滤器的高自由度决定了它的具体实现方式因人而异，以下示例仅作参考。同第二节一样，示例使用的是 jsx

#### 实现过程

首先，需要标识哪些 `column` 需要添加筛选功能，延续个人在 TableV1 中的使用习惯，在 `columns` 数组中添加相关属性，`filterable` 标识该项是否可筛选， `filterMethod` 指定筛选方法

```javascript
import { generalArrFilterHandler } from '@/use/el-table-v2-utils'

const columnData = ref([
  { key: 'no', dataKey: 'no', title: 'No.', width: 60 },
  { key: 'code', dataKey: 'code', title: 'code', width: 80 },
  { key: 'name', dataKey: 'name', title: 'name', width: 80 },
  { key: 'age', dataKey: 'age', title: 'Age', width: 60 },
  { key: 'gender', dataKey: 'gender', title: 'gender', width: 80, filterable: true },
  { key: 'city', dataKey: 'city', title: 'City', width: 80, filterable: true },
  {
    key: 'tags',
    dataKey: 'tags',
    title: 'Tags',
    width: 150,
    filterable: true,
    filterMethod: generalArrFilterHandler,
  },
])
```

为了避免对 TableV2 的潜在影响，表格组件所使用的 columns 数组中过滤掉一些不必要的属性，`headerCellRenderer` 方法也需要定义在此。

示例中，定义了一个弹出框，点击筛选图标显示弹出框，弹出框内是一个多选框组，确定后进行筛选

```js
const columns = columnData.value.map(col => {
  return {
    key: col.dataKey,
    title: col.title,
    dataKey: col.dataKey,
    width: col.width ?? 100,
    headerCellRenderer: props => {
      if (!col.filterable) return props.column.title
      return (
        <div class='tbv2-th-filter'>
          <span class='th-cell'>{props.column.title}</span>
          <el-popover trigger='hover' {...{ width: 200 }}>
            {{
              default: () => (
                <div class='filter-wrapper'>
                  <div class='filter-group'>
                    <el-checkbox-group v-model={filterableCols[col.dataKey].selected}>
                      {filterableCols[col.dataKey].list.map(f => (
                        <el-checkbox key={f.value} label={f.value}>
                          {f.text}
                        </el-checkbox>
                      ))}
                    </el-checkbox-group>
                  </div>
                  <div class='el-table-v2__demo-filter'>
                    <el-button text onClick={onFilter}>
                      Confirm
                    </el-button>
                    <el-button text onClick={() => onReset(col.dataKey)}>
                      Reset
                    </el-button>
                  </div>
                </div>
              ),
              reference: () => (
                <svg
                  viewBox='0 0 1024 1024'
                  xmlns='http://www.w3.org/2000/svg'
                  width='14'
                  height='14'
                  style='cursor:pointer'>
                  <path
                    fill='currentColor'
                    d='M735.086 796.233c0-15.58 12.727-28.818 28.891-28.818h230.4a29.257 29.257 0 0 1 28.818 28.818 28.891 28.891 0 0 1-28.745 28.818H763.977a29.257 29.257 0 0 1-28.818-28.818zm0-127.927c0-15.506 12.727-28.745 28.891-28.745h230.4a29.257 29.257 0 0 1 28.818 28.745 28.891 28.891 0 0 1-28.745 28.819H763.977a29.257 29.257 0 0 1-28.818-28.819zm28.891-156.672h230.4a29.257 29.257 0 0 1 28.818 28.819 28.891 28.891 0 0 1-28.745 28.818H763.977a29.257 29.257 0 0 1-28.818-28.818 29.257 29.257 0 0 1 28.818-28.819zM901.632 0c50.176 0 122.149 49.006 121.051 127.927 1.098 35.694-13.897 66.267-42.642 96.768-216.064 189.586-300.178 227.62-306.468 285.257-5.267 45.495-1.829 472.357-2.926 478.135a39.497 39.497 0 0 1-5.778 22.455c-18.432 18.432-37.45 12.141-47.25 4.023-72.046-58.734-232.741-189.514-251.173-228.133-21.358-41.472-13.24-126.757-13.24-276.48 0-34.085-253.512-235.154-308.296-285.257C31.744 210.285 0 181.54 0 128 0 49.59 63.927 0 134.802 0h766.83zM76.069 164.79c1.682 2.341 4.022 5.12 6.875 8.047l8.63 8.63-3.437-3.437a9235.017 9235.017 0 0 0 147.53 125.074l14.92 12.654c134.29 115.2 167.132 147.456 167.132 194.706 0 27.648 0 51.273-.585 88.137-1.756 114.103 0 145.774 8.045 161.353 3.438 6.876 47.836 49.518 108.325 101.961l17.262 14.41c32.914 27.648 57.051 54.125 57.051 51.273V747.813c0-139.996.585-221.184 3.438-244.298 1.755-13.165 5.193-25.892 10.386-38.034 15.58-35.108 40.96-59.246 105.472-111.689l89.234-72.046c40.375-34.596 81.262-69.12 121.637-104.887l-4.608 4.096c19.017-20.187 25.893-35.181 25.307-53.613C959.27 93.915 926.501 64 901.632 64h-766.83c-41.472 0-70.875 26.478-70.875 63.927 0 14.994 4.023 25.892 12.142 36.864z'
                  />
                </svg>
              ),
            }}
          </el-popover>
        </div>
      )
    },
  }
})
```

别忘了，筛选项可筛选列表也需要自行计算出来。 `filterableCols` 是用来存储可筛选项相关信息的，示例中，定义了默认的筛选方法

```javascript
import { generalFilterHandler } from '@/use/el-table-v2-utils'

const originData = ref([])
const tableData = ref([])

/**
 * 筛选信息列表
 * props:
 * - {Array} list 可筛选值列表
 * - {Array} selected 已勾选列表
 * - {Function} [filterMethod] 筛选方法
 */
const filterableCols = reactive(
  columnData.value
    .filter(c => c.filterable)
    .reduce((prev, curr) => {
      prev[curr.dataKey] = {
        selected: [],
        list: [],
        filterMethod: curr.filterMethod ?? generalFilterHandler,
      }
      return prev
    }, {})
)

// 自动获取各项筛选列表
const getFiltersFromResp = () => {
  for (let dataKey in filterableCols) {
    let list
    if (dataKey === 'tags') {
      // tags 项可筛选列表固定
      list = ['developer', 'Ph.D', 'Bachelor', 'Master', 'CEO', 'HRBP', 'HR'].map(p1 => ({
        text: p1,
        value: p1,
      }))
    } else {
      // 其它项取所有非重复项
      list = originData.value.map(p => p[dataKey]).filter(Boolean)
      // 去重、转对象
      list = [...new Set(list)].map(p1 => ({ text: p1, value: p1 }))
    }
    filterableCols[dataKey].list = list
    filterableCols[dataKey].selected = []
  }
}

// const getTableData = () => { ... }
const getData = total => {
  getTableData(total).then(res => {
    originData.value = res ?? []
    tableData.value = originData.value
    getFiltersFromResp()
  })
}
```

筛选方法需自行定义

```javascript
const onFilter = () => {
  const allFilters = Object.entries(filterableCols).filter(([_, configs]) => {
    return configs.selected?.length > 0
  })
  tableData.value = originData.value.filter(p => {
    return allFilters.every(([dataKey, configs]) => {
      return !configs.filterMethod || configs.filterMethod(p[dataKey], configs.selected)
    })
  })
}
const onReset = dataKey => {
  filterableCols[dataKey].selected = []
  onFilter()
}
```

#### 完整代码

::: details

```html
<script lang="jsx" setup>
  import { ref, reactive, onMounted } from 'vue'
  import { generalFilterHandler, generalArrFilterHandler } from '@/use/el-table-v2-utils'

  onMounted(() => {
    getData()
  })

  const originData = ref([])
  const tableData = ref([])
  const columnData = ref([
    { key: 'no', dataKey: 'no', title: 'No.', width: 60 },
    { key: 'code', dataKey: 'code', title: 'code', width: 80 },
    { key: 'name', dataKey: 'name', title: 'name', width: 80 },
    { key: 'age', dataKey: 'age', title: 'Age', width: 60 },
    { key: 'gender', dataKey: 'gender', title: 'gender', width: 80, filterable: true },
    { key: 'city', dataKey: 'city', title: 'City', width: 80, filterable: true },
    {
      key: 'tags',
      dataKey: 'tags',
      title: 'Tags',
      width: 150,
      filterable: true,
      filterMethod: generalArrFilterHandler,
    },
  ])
  const columns = columnData.value.map(col => {
    return {
      key: col.dataKey,
      title: col.title,
      dataKey: col.dataKey,
      width: col.width ?? 100,
      headerCellRenderer: props => {
        if (!col.filterable) return props.column.title
        return (
          <div class='tbv2-th-filter'>
            <span class='th-cell'>{props.column.title}</span>
            <el-popover trigger='hover' {...{ width: 200 }}>
              {{
                default: () => (
                  <div class='filter-wrapper'>
                    <div class='filter-group'>
                      <el-checkbox-group v-model={filterableCols[col.dataKey].selected}>
                        {filterableCols[col.dataKey].list.map(f => (
                          <el-checkbox key={f.value} label={f.value}>
                            {f.text}
                          </el-checkbox>
                        ))}
                      </el-checkbox-group>
                    </div>
                    <div class='el-table-v2__demo-filter'>
                      <el-button text onClick={onFilter}>
                        Confirm
                      </el-button>
                      <el-button text onClick={() => onReset(col.dataKey)}>
                        Reset
                      </el-button>
                    </div>
                  </div>
                ),
                reference: () => (
                  <svg
                    viewBox='0 0 1024 1024'
                    xmlns='http://www.w3.org/2000/svg'
                    width='14'
                    height='14'
                    style={{
                      cursor: 'pointer',
                      color:
                        filterableCols[col.dataKey].selected?.length > 0 ? '#387FE5' : 'inherit',
                    }}>
                    <path
                      fill='currentColor'
                      d='M735.086 796.233c0-15.58 12.727-28.818 28.891-28.818h230.4a29.257 29.257 0 0 1 28.818 28.818 28.891 28.891 0 0 1-28.745 28.818H763.977a29.257 29.257 0 0 1-28.818-28.818zm0-127.927c0-15.506 12.727-28.745 28.891-28.745h230.4a29.257 29.257 0 0 1 28.818 28.745 28.891 28.891 0 0 1-28.745 28.819H763.977a29.257 29.257 0 0 1-28.818-28.819zm28.891-156.672h230.4a29.257 29.257 0 0 1 28.818 28.819 28.891 28.891 0 0 1-28.745 28.818H763.977a29.257 29.257 0 0 1-28.818-28.818 29.257 29.257 0 0 1 28.818-28.819zM901.632 0c50.176 0 122.149 49.006 121.051 127.927 1.098 35.694-13.897 66.267-42.642 96.768-216.064 189.586-300.178 227.62-306.468 285.257-5.267 45.495-1.829 472.357-2.926 478.135a39.497 39.497 0 0 1-5.778 22.455c-18.432 18.432-37.45 12.141-47.25 4.023-72.046-58.734-232.741-189.514-251.173-228.133-21.358-41.472-13.24-126.757-13.24-276.48 0-34.085-253.512-235.154-308.296-285.257C31.744 210.285 0 181.54 0 128 0 49.59 63.927 0 134.802 0h766.83zM76.069 164.79c1.682 2.341 4.022 5.12 6.875 8.047l8.63 8.63-3.437-3.437a9235.017 9235.017 0 0 0 147.53 125.074l14.92 12.654c134.29 115.2 167.132 147.456 167.132 194.706 0 27.648 0 51.273-.585 88.137-1.756 114.103 0 145.774 8.045 161.353 3.438 6.876 47.836 49.518 108.325 101.961l17.262 14.41c32.914 27.648 57.051 54.125 57.051 51.273V747.813c0-139.996.585-221.184 3.438-244.298 1.755-13.165 5.193-25.892 10.386-38.034 15.58-35.108 40.96-59.246 105.472-111.689l89.234-72.046c40.375-34.596 81.262-69.12 121.637-104.887l-4.608 4.096c19.017-20.187 25.893-35.181 25.307-53.613C959.27 93.915 926.501 64 901.632 64h-766.83c-41.472 0-70.875 26.478-70.875 63.927 0 14.994 4.023 25.892 12.142 36.864z'
                    />
                  </svg>
                ),
              }}
            </el-popover>
          </div>
        )
      },
    }
  })

  /**
   * 筛选信息列表
   * props:
   * - {Array} list 可筛选值列表
   * - {Array} selected 已勾选列表
   * - {Function} [filterMethod] 筛选方法
   */
  const filterableCols = reactive(
    columnData.value
      .filter(c => c.filterable)
      .reduce((prev, curr) => {
        prev[curr.dataKey] = {
          selected: [],
          list: [],
          filterMethod: curr.filterMethod ?? generalFilterHandler,
        }
        return prev
      }, {})
  )

  const onFilter = () => {
    const allFilters = Object.entries(filterableCols).filter(([_, configs]) => {
      return configs.selected?.length > 0
    })
    tableData.value = originData.value.filter(p => {
      return allFilters.every(([dataKey, configs]) => {
        return !configs.filterMethod || configs.filterMethod(p[dataKey], configs.selected)
      })
    })
  }
  const onReset = dataKey => {
    filterableCols[dataKey].selected = []
    onFilter()
  }

  const tagList = ['developer', 'Ph.D', 'Bachelor', 'Master', 'CEO', 'HRBP', 'HR']
  // 自动获取各项筛选列表
  const getFiltersFromResp = () => {
    for (let dataKey in filterableCols) {
      let list
      if (dataKey === 'tags') {
        // tags 项可筛选列表固定
        list = tagList.map(p1 => ({ text: p1, value: p1 }))
      } else {
        // 其它项取所有非重复项
        list = originData.value.map(p => p[dataKey]).filter(Boolean)
        // 去重、转对象
        list = [...new Set(list)].map(p1 => ({ text: p1, value: p1 }))
      }
      filterableCols[dataKey].list = list
      filterableCols[dataKey].selected = []
    }
  }

  const getData = total => {
    getTableData(total).then(res => {
      originData.value = res ?? []
      tableData.value = originData.value
      getFiltersFromResp()
    })
  }

  const getTableData = total => {
    if (!total) total = Math.floor(Math.random() * 2000 + 1000)
    return new Promise((resolve, reject) => {
      resolve(
        Array.from({ length: total }).map((_, idx) => {
          return {
            no: idx + 1,
            code: Math.floor(Math.random() * 100000).toString(16),
            name: Math.floor(Math.random() * 100000).toString(16),
            age: Math.floor(Math.random() * 30 + 18),
            gender: Math.random() > 0.5 ? '男' : '女',
            city: ['北京', '上海', '深圳'][Math.floor(Math.random() * 3)],
            tags: tagList
              .sort((a, b) => Math.random() - 0.5)
              .slice(0, Math.floor(Math.random() * 4)),
          }
        })
      )
    })
  }
</script>

<template>
  <h3>el-table-v2 筛选/过滤器 demo</h3>
  <el-auto-resizer>
    <template #default="{ height, width }">
      <el-table-v2
        :columns="columns"
        :data="tableData"
        :width="width"
        :height="666"
        :fixed="true" />
    </template>
  </el-auto-resizer>
  <div>Total: {{ tableData.length }}</div>
  <el-button @click="getData()">刷新表格数据</el-button>
</template>
```

el-table-v2-utils.js:

```js
/**
 * element-plus TableV2 筛选方法
 * @param {string} value 单元格数值
 * @param {string|Array} filters 已选筛选值或筛选值列表
 * @returns {boolean}
 */
export function generalFilterHandler(value, filters) {
  if (filters instanceof Array) return filterHandler(value, filters)
  return selectFilterHandler(value, filters)
}

/**
 * element-plus TableV2 筛选方法
 * @param {string} value 单元格数值
 * @param {Array} filters 已选筛选值列表
 * @returns {boolean}
 */
function filterHandler(value, filters) {
  return !filters?.length ? true : filters.includes(value)
}

/**
 * element-plus TableV2 筛选方法
 * @param {string} value 单元格数值
 * @param {string} filter 已选中的筛选值
 * @returns {boolean}
 */
function selectFilterHandler(value, filter) {
  return (!filter && filter !== 0) || filter === value
}

/**
 * element-plus TableV2 筛选方法(单元格数值类型为数组)
 * @param {string|Array} value 单元格数值
 * @param {string|Array} filters 已选筛选值或筛选值列表
 * @returns {boolean}
 */
export function generalArrFilterHandler(value, filters) {
  if (!(value instanceof Array)) return generalFilterHandler(value, filters)
  if (filters instanceof Array) return arrayFilterHandler(value, filters)
  return selectArrayFilterHandler(value, filters)
}

/**
 * element-plus TableV2 筛选方法(单元格数值类型为数组)
 * @param {string} value 单元格数值
 * @param {Array} filters 已选筛选值列表
 * @returns {boolean}
 */
function arrayFilterHandler(value, filters) {
  return !filters?.length ? true : filters.some(f => value?.includes(f))
}

/**
 * element-plus TableV2 筛选方法(单元格数值类型为数组)
 * @param {string} value 单元格数值
 * @param {string} filter 已选中的筛选值
 * @returns {boolean}
 */
function selectArrayFilterHandler(value, filter) {
  return (!filter && filter !== 0) || value?.includes(filter)
}
```

:::

**注意：** 对单元格数值的筛选也分为很多种

- 最常见的，就是判断与选中筛选值是否相等(多选时，是否包含在内)。其它常见的判断有包含、以...开头、以...结尾、等等
- 其次，上例中有个特殊的项，tags，其数据类型为数组，需要筛选出存在 tag 包含在选中 tags 列表中的数据（如筛选条件为满足所有选中筛选值，筛选方法又不一样）
- 其它更特殊些的筛选都需要自行拟好筛选方法
- 需要注意，筛选方法参数与 TableV1 中的不同（示例中的自定义筛选方法是遍历一遍表格数据，而 TableV1 提供的筛选方法接口是对选中筛选值列表中的每个值，都遍历一遍表格数据。实质是一样的，只是方法参数类型不同而已）

另外，下一节方案二中，通过给源数据添加 hidden 标识是否通过筛选，无需单独记录筛选数据。改动也很简单，删除 `originData`，`onFilter` 中更新 hidden 属性值，表格绑定数据中进行筛选 hidden 不为 true 的。

#### 其它附加功能

##### 默认筛选值、筛选列表单选

如 TableV1 中提供的功能，有时候，我们需要添加默认筛选值；有些筛选项我们希望做成单选的形式。

接上例，可更新代码如下：

::: details

```javascript
import CustomSelector from '@/components/custom-selector.vue'

const columnData = ref([
  // ...
  {
    key: 'gender',
    dataKey: 'gender',
    title: 'gender',
    width: 80,
    filterable: true,
    filterSingle: true,
    filteredValue: '男',
  },
  // ...
])

/**
 * 筛选信息列表
 * props:
 * - {Array} list 可筛选值列表
 * - {Array} selected 已勾选列表（筛选值多选时使用）
 * - {string} singleSelect 已勾选值（筛选值单选时使用）
 * - {Function} [filterMethod] 筛选方法
 * - {Array} [filteredValue] 默认筛选值
 * - {boolean} [filterSingle] 筛选值单选？
 */
const filterableCols = reactive(
  columnData.value
    .filter(c => c.filterable)
    .reduce((prev, curr) => {
      prev[curr.dataKey] = {
        selected: [],
        list: [],
        singleSelect: undefined,
        filterMethod: curr.filterMethod ?? generalFilterHandler,
        filteredValue: curr.filteredValue,
        filterSingle: curr.filterSingle ?? false,
      }
      return prev
    }, {})
)

const onFilter = () => {
  const allFilters = Object.entries(filterableCols).filter(([_, configs]) => {
    return configs.filterSingle
      ? ![null, undefined].includes(configs.singleSelect)
      : configs.selected?.length > 0
  })
  tableData.value = originData.value.filter(p => {
    return allFilters.every(([dataKey, configs]) => {
      return (
        !configs.filterMethod ||
        configs.filterMethod(
          p[dataKey],
          configs.filterSingle ? configs.singleSelect : configs.selected
        )
      )
    })
  })
}

// 自动获取各项筛选列表
const getFiltersFromResp = () => {
  for (let dataKey in filterableCols) {
    // ...
    // 根据是否多选，获取对应默认排序（值/列表）
    filterableCols[dataKey].selected = !filterableCols[dataKey].filterSingle
      ? filterableCols[dataKey].filteredValue instanceof Array
        ? filterableCols[dataKey].filteredValue
        : []
      : []
    filterableCols[dataKey].singleSelect = filterableCols[dataKey].filterSingle
      ? typeof filterableCols[dataKey].filteredValue !== 'object'
        ? filterableCols[dataKey].filteredValue
        : undefined
      : undefined
  }
}

const columns = columnData.value.map(col => {
  return {
    key: col.dataKey,
    title: col.title,
    dataKey: col.dataKey,
    width: col.width ?? 100,
    headerCellRenderer: props => {
      if (!col.filterable) return props.column.title
      return (
        <div class='tbv2-th-filter'>
          <span class='th-cell'>{props.column.title}</span>
          <el-popover trigger='hover' {...{ width: 200 }}>
            {{
              default: () => {
                return filterableCols[col.dataKey].filterSingle ? (
                  <CustomSelector
                    v-model={filterableCols[col.dataKey].singleSelect}
                    onChange={onFilter}
                    list={filterableCols[col.dataKey].list}
                  />
                ) : (
                  <div class='filter-wrapper'>
                    <div class='filter-group'>
                      <el-checkbox-group v-model={filterableCols[col.dataKey].selected}>
                        {filterableCols[col.dataKey].list.map(f => (
                          <el-checkbox key={f.value} label={f.value}>
                            {f.text}
                          </el-checkbox>
                        ))}
                      </el-checkbox-group>
                    </div>
                    <div class='el-table-v2__demo-filter'>
                      <el-button text onClick={onFilter}>
                        Confirm
                      </el-button>
                      <el-button text onClick={() => onReset(col.dataKey)}>
                        Reset
                      </el-button>
                    </div>
                  </div>
                )
              },
              reference: () => (
                <svg
                  viewBox='0 0 1024 1024'
                  xmlns='http://www.w3.org/2000/svg'
                  width='14'
                  height='14'
                  style={{
                    cursor: 'pointer',
                    color: (
                      filterableCols[col.dataKey].filterSingle
                        ? ![null, undefined].includes(filterableCols[col.dataKey].singleSelect)
                        : filterableCols[col.dataKey].selected?.length > 0
                    )
                      ? '#387FE5'
                      : 'inherit',
                  }}>
                  <path
                    fill='currentColor'
                    d='M735.086 796.233c0-15.58 12.727-28.818 28.891-28.818h230.4a29.257 29.257 0 0 1 28.818 28.818 28.891 28.891 0 0 1-28.745 28.818H763.977a29.257 29.257 0 0 1-28.818-28.818zm0-127.927c0-15.506 12.727-28.745 28.891-28.745h230.4a29.257 29.257 0 0 1 28.818 28.745 28.891 28.891 0 0 1-28.745 28.819H763.977a29.257 29.257 0 0 1-28.818-28.819zm28.891-156.672h230.4a29.257 29.257 0 0 1 28.818 28.819 28.891 28.891 0 0 1-28.745 28.818H763.977a29.257 29.257 0 0 1-28.818-28.818 29.257 29.257 0 0 1 28.818-28.819zM901.632 0c50.176 0 122.149 49.006 121.051 127.927 1.098 35.694-13.897 66.267-42.642 96.768-216.064 189.586-300.178 227.62-306.468 285.257-5.267 45.495-1.829 472.357-2.926 478.135a39.497 39.497 0 0 1-5.778 22.455c-18.432 18.432-37.45 12.141-47.25 4.023-72.046-58.734-232.741-189.514-251.173-228.133-21.358-41.472-13.24-126.757-13.24-276.48 0-34.085-253.512-235.154-308.296-285.257C31.744 210.285 0 181.54 0 128 0 49.59 63.927 0 134.802 0h766.83zM76.069 164.79c1.682 2.341 4.022 5.12 6.875 8.047l8.63 8.63-3.437-3.437a9235.017 9235.017 0 0 0 147.53 125.074l14.92 12.654c134.29 115.2 167.132 147.456 167.132 194.706 0 27.648 0 51.273-.585 88.137-1.756 114.103 0 145.774 8.045 161.353 3.438 6.876 47.836 49.518 108.325 101.961l17.262 14.41c32.914 27.648 57.051 54.125 57.051 51.273V747.813c0-139.996.585-221.184 3.438-244.298 1.755-13.165 5.193-25.892 10.386-38.034 15.58-35.108 40.96-59.246 105.472-111.689l89.234-72.046c40.375-34.596 81.262-69.12 121.637-104.887l-4.608 4.096c19.017-20.187 25.893-35.181 25.307-53.613C959.27 93.915 926.501 64 901.632 64h-766.83c-41.472 0-70.875 26.478-70.875 63.927 0 14.994 4.023 25.892 12.142 36.864z'
                  />
                </svg>
              ),
            }}
          </el-popover>
        </div>
      )
    },
  }
})
```

CustomSelector 组件：单选列表（展开的 el-select ）

```html
<script setup>
  const props = defineProps({
    modelValue: { default: '' },
    list: { type: Array, default: [] },
  })

  const emit = defineEmits(['change', 'update:modelValue'])

  function handleOptionClick(val) {
    if (props.modelValue === val) return
    emit('update:modelValue', val)
    emit('change', val)
  }
</script>
<template>
  <div class="wrap">
    <div
      v-for="option in list"
      :key="option.value"
      :class="['item', { active: modelValue === option.value }]"
      @click="handleOptionClick(option.value)">
      {{ option.text }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .wrap {
    width: 100%;
    font-size: 14px;
    color: #666;
    .item {
      line-height: 32px;
      padding: 0 12px;
      cursor: pointer;
      &.active {
        color: #387fe5;
        font-weight: bold;
      }
      &:hover {
        background-color: #f9f9f9;
      }
    }
  }
</style>
```

:::

##### 多选时，不点击确定

单选组件设置了监听事件，无需点击确定即可触发筛选事件

而多选使用的多选框组，存储选中筛选值的变量是直接绑定到组件上的，示例中通过点击确定按钮手动触发筛选事件，不点击会导致的 UI 与实际筛选不符的问题

想到两种解决方案，一是使用多选框组提供的 `change` 事件，代价是可能会筛选过于频繁。另一种是创建一个变量存储前一次筛选状态，每次执行筛选前与当前筛选状态进行对比，相同则不执行筛选

方案一：更新 `headerCellRenderer`

`<el-checkbox-group v-model={ filterableCols[col.dataKey].selected }>`

↓↓↓↓↓

`<el-checkbox-group v-model={ filterableCols[col.dataKey].selected } onChange={ onFilter }>`

方案二：

```javascript
const prevFilters = ref([])
const compareFilters = currFilters => {
  return (
    prevFilters.value.length === currFilters.length &&
    prevFilters.value.every((f, idx) => {
      let [currDataKey, { selected: currSelected, singleSelect: currSingleSelect }] =
        currFilters[idx]
      currSelected = currSelected.slice(0).sort()
      return (
        f.dataKey === currDataKey &&
        f.singleSelect === currSingleSelect &&
        f.selected
          .slice(0)
          .sort()
          .every((p, idx1) => p === currSelected[idx1])
      )
    })
  )
}

const onFilter = () => {
  // const allFilters = ...
  if (compareFilters(allFilters)) return
  prevFilters.value = allFilters.map(([dataKey, configs]) => ({
    dataKey,
    selected: configs.selected,
    singleSelect: configs.singleSelect,
  }))
  // ...
}
```

## 六、排序、筛选同时使用

按前两节示例，排序、筛选当然可以同时实现，但需要处理数据上冲突

### 问题分析

两部分的示例中，都使用了 originData 记录表格原始数据：

如果不保存源数据，在排序中，不光无法置空排序、回归原顺序，不同排序项的历史排序影响也会持续下去，其实是难以预料的多重排序结果。筛选操作也变成了基于上一次筛选结果的筛选

```javascript
const tableData = ref([])
const originData = ref([])

// handle sort
tableData.value = originData.value.slice(0).sort(sortMethod)
// handle filter
tableData.value = originData.value.filter(filterMethod)
```

两者都是基于源表格数据进行排序、筛选。两个功能同时存在时，就有冲突了，会彼此干扰此前的操作。

### 解决方案

#### 方案一：创建中间变量

额外创建一个变量 `tempData`，用它记录筛选后的数据，tableData 记录排序后的值

`originData` -> `tempData` -> `tableData`

- `originData` 更新时，`tempData`, `tableData` 重置为 `originData`
- 筛选时，基于源数据筛选（`originData` -> `tempData`），`tableData` 重置为 `tempData`
- 排序时，基于 `tempData` 排序（`tempData` -> `tableData`）

看起来有点绕，其实就两条依赖关系，添加两个相应的 `watch` 就可以了

```html
<el-table-v2 :data="tableData" ... />
```

```js {2,6,12}
const tableData = ref([]) // 表格当前数据（排序、筛选后）
const tempData = ref([]) // 中间变量，对源数据的筛选
const originData = ref([]) // 表格源数据

// 源数据更新 -> 更新筛选项各自的可筛选列表, 执行筛选
watch(originData, newVal => {
  getFiltersFromResp()
  onFilter() // 执行筛选会更新 tempData
})
// 排序状态更新 | tempData 更新 -> 执行排序
watch(
  [sortState, tempData],
  ([newState, newData]) => {
    // handle sort ( originData --sort--> tableData )
    const { key, order } = newState ?? {}
    // 数据为空 | 当前无排序，重置 tableData
    if (!newData?.length || !key || !order) {
      tableData.value = newData
      return
    }
    // ...
    tableData.value = newData.slice(0).sort(sortMethod)
  },
  { immediate: true }
)

// handle filter
const onFilter = () => {
  // ...
  tempData.value = originData.value.filter(execFilter)
}
```

#### 方案二：源数据中添加筛选标识

筛选事件处理方法中，标识数据是否通过筛选(例如：添加 hidden 属性)，与方案一相比，代码改动较小：

```js {16}
const tableData = ref([]) // 表格当前数据（排序、筛选后）
// const tempData = ref([])   // 中间变量，对源数据的筛选 // [!code --]
const originData = ref([]) // 表格源数据

// 源数据更新 -> 更新筛选项各自的可筛选列表, 执行筛选
watch(originData, newVal => {
  getFiltersFromResp()
  onFilter()
})
// 排序状态更新 | originData 更新(包括 hidden 更新) -> 执行排序
watch(
  [sortState, originData], // [sortState, tempData],
  ([newState, newData]) => {
    const { key, order } = newState ?? {}
    if (!newData?.length || !key || !order) {
      tableData.value = newData?.filter(p => !p.hidden) ?? [] // newData
      return
    }
    // ...
    // tableData.value = newData.slice(0).sort(sortMethod)
    tableData.value = newData.filter(p => !p.hidden).sort(sortMethod)
  },
  { immediate: true, deep: true } // { immediate: true }
)

const onFilter = () => {
  // ...
  // tempData.value = originData.value.filter(execFilter) // [!code --]
  originData.value.forEach(val => { // [!code ++]
    val.hidden = !execFilter(val) // [!code ++]
  }) // [!code ++]
}
```

无中间变量，originData 添加 hidden 属性

相比之下，少一条依赖，代码简单一点。排序和筛选其实还都是基于源数据，只是使用 hidden 属性过滤 TableV2 的绑定数据

此方法同样可以应用在上一节单独使用筛选功能时，可以做到只使用源数据。

**两种方案对比：**

第二种方案中，为了监听到源数据 hidden 的变化，进行了深层监听。如果具体业务中有其它逻辑需要频繁改动源数据其它属性，将会造成不必要的更新排序、筛选。

tempData、tableData 仅仅是对列表数据内对象引用的拷贝，逻辑处理好就行，不存在对大批量数据的处理耗时问题。

### 其他

为了突出排序已生效，可以加上样式

`.el-table-v2__header-cell .el-table-v2__sort-icon.is-sorting {color:#387FE5}`

## 七、坑

**当设置了动态高度行（`estimated-row-height`）时，可能会发生严重的卡顿现象！（与表格数据总数无关）**

调试发现，目前 TableV2 每滚动一次就重新加载一次表格内及预加载的行数，总单元格过多时，会让体验感在上面的场景下变得极差。

以本人实际生产环境中的一个表格为例，表格一行有 17 个的单元格，一页显示 20 条数据，预先多加载的行数是 2，每一次需要渲染 17\*24=408 个单元格。连续纵向滚动会触发多次表格内容加载，轻微卡顿，有待优化，感觉可以提供一个属性作为连续滚动的节流处理开关。另一方面就是全部重新加载这个策略。

上面说的是正常流程，不正常的是，当设置了动态高度且超出设定高度的行数不少时，一次滚动就会重复触发四五次，再加上连续滚动。假设一个只触发三次的连续滚动，408\*4\*3=4896 个单元格渲染。如果你够年轻，手速够快，轻松破万。再加上，某些自定义渲染的单元格够“大”够“重”，那。。。

这个问题应该是个 bug，希望后续版本能修复

## 八、总结

**你真的需要虚拟化表格吗？**

虚拟化表格不是一个可以无脑使用的方案，`element-plus` 的虚拟化表格甚至官方都不建议在生产环境中使用。

最简单的，如果需求允许分页展示那就不要使用虚拟化表格！一方面，TableV1完全支持后端筛选、排序。另一方面，如果想避免频繁请求，最多就几千条数据，也可以一次请求所有数据，前端表格分页、前端筛选排序。

**表格性能优化：**

当注意到表格渲染耗时过长时，首先要去分析耗时的原因。如果只是纯文字展示，一两千行可能都很快，如果单元格内容过于丰富，一两百条就能让页面卡上几秒。

打个比方，一个表格内，各有一项单元格包含`el-popover`、`el-tooltip`，前者的代价更大，而后者又远不如原生`title`属性方案。表格内有一项调用`el-dialog`，尽管一个相对复杂的模态框耗时远大于弹出框，但整项共用一个。前面提到的两种弹出框却是该项内每个单元格独享一个弹出框组件，此处耗时随表格数量线性增长。可以选择使用原生`title`属性作为替换方案，也可以自定义一个弹出框组件在表格内公用，等等。

**Element Plus 虚拟化表格分析：**

TableV2 只加载可见区域以及前后预加载(可设置)的“行”，纵向滚动后全部重新加载一遍。只要数据拿到了，表格的加载速度很快，对表格的一些响应式操作反应也很快，如果表格数据量可能在几千行及以上，很有必要换掉 TableV1。

TableV2 的问题在于它目前是**全部重新加载**，哪怕是纵向滑动了一像素。

当单元格过重时，尽管使用了虚拟化表格方案，仍然会导致使用体验差，体现为滚动不流畅、肉眼能察觉的闪烁。这种需求场景下，如果无法调整需求，建议换工具。

**其它虚拟化表格：**

已经有很多虚拟化表格工具了，这里列举两个功能完善、性能更强或体验更好的：

[rsuite-table](https://github.com/rsuite/rsuite-table) 方案不同之处在于仍在可视范围内的行保持不变，仅作必要的增删（在使用EP的时候就很疑惑为什么不这么做）。可惜它是 React 表格组件

[ag-grid](https://www.ag-grid.com/): 影响力大且极受欢迎的高性能表格组件，功能完备，支持js原生调用，也支持 vue/react/angular 框架。滚动时同样仅作必要的增删。使用它的代价就是依赖包会比较大。
