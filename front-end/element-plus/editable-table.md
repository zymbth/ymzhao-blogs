# vue3 + Element Plus动态生成表格，并实现内容可编辑

## 前言

第一个思路得自于网友的讨论，将单元格数据转对象，通过添加控制属性实现编辑状态与显示状态的切换。尽管思路简单，但实现的过程有些看着头大，不够简洁优美。采用这种方法的话，建议浏览了解后自行理清思路实现。

前段时间看到同事在类似问题上找了一个插件，简单得通过一个输入框就实现了对所有数据的编辑。仔细想想，只要能实现数据的“定位”，这种思路显然更加友好。

注意，示例基于 vue3 & element-plus@1.1.0-beta.12，高版本的element-plus中图标引入方式不同

## 一、思路一：单元格数据转对象

将单元格数据转换成对象，添加show属性，控制/切换显示与编辑模式

最终效果如下，可自由编辑表头、数据单元格，增删行列，并保持数据绑定

![在这里插入图片描述](./assets/82c382fd10354a6c871bf1d66f11c7c6.png)
![在这里插入图片描述](./assets/ea781fa8dcb5460882ae7db8f82ba9db.png)

### 1.1 首先最基本的，根据数据生成固定表项的表格

从官网摘个Demo过来：

```javascript
tableData: [
	{date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄'},
	{date: '2016-05-04', name: '王小虎', address: '上海市普陀区金沙江路 1517 弄'}
]
```

```html
<el-table :data="tableData" style="width: 100%">
  <el-table-column prop="date" label="日期" width="180"></el-table-column>
  <el-table-column prop="name" label="姓名" width="180"></el-table-column>
  <el-table-column prop="address" label="地址"></el-table-column>
</el-table>
```

![在这里插入图片描述](./assets/20200307161118973.png)

### 1.2 动态生成表项

常用的写法：

```javascript
columnList: [
  { prop: "name", label: '姓名' },
  { prop: "age", label: '年龄' },
  { prop: "city", label: '城市' },
  { prop: "tel", label: '电话' }
],
testDatas: [
  {No: 1, name: '张三', age: 24, city: '广州', tel: '13312345678'},
  {No: 2, name: '李四', age: 25, city: '九江', tel: '18899998888'},
  {No: 3, name: '王五', age: 26, city: '六盘水', tel: '13600001111'},
  {No: 4, name: '赵二', age: 27, city: '菏泽', tel: '13145209420'},
]
```

```html
<el-table :data="testDatas" border stripe style="width: 100%">
  <el-table-column type="index" label="No." :width="50"/>
  <el-table-column
    v-for="col in columnList"
    :prop="col.prop"
    :label="col.label"
    :key="col.prop"
  />
</el-table>
```

![在这里插入图片描述](./assets/811176be80564343be08b81186234b56.png)

### 1.3 单元格可编辑

网上早有网友讨论过这个功能，这里采用的是将单元格数据转换成对象，添加属性show来控制其在文字与输入框间切换。听起来就不想下手，又要转换数据格式了。。
  
```javascript
// 表项（头），以键(prop)值(label)存储表头，值可改变，键不变用以绑定数据
columnList: [
  { prop: "name", label: 'name', show: true },
  { prop: "age", label: 'age', show: true },
  { prop: "city", label: 'city', show: true },
  { prop: "tel", label: 'tel', show: true }
],
// 数据
testDatas: [{
  name: { content: '张三', show: true },
  age: { content: 24, show: true },
  city: { content: '广州', show: true },
  tel: { content: '13312345678', show: true }
},{
  name: { content: '李四', show: true },
  age: { content: 25, show: true },
  city: { content: '九江', show: true },
  tel: { content: '18899998888', show: true }
}],
```

```html
<el-table :data="testDatas" border style="width: 100%">
  <!-- 额外添加的编号项（可删除） -->
  <el-table-column v-if="columnList.length > 0" type="index" :label="'编号'" :width="50"></el-table-column>
  <!-- 自定义表项 -->
  <el-table-column v-for="column in columnList" :key="column.prop">
    <!-- 自定义表头 -->
    <template #header>
      <!-- 段落：show为true -->
      <p v-show="column.show" @dblclick="column.show = false">
        {{column.label}} 
        <i class="el-icon-edit-outline" @click="column.show = false"></i>
      </p>
      <!-- 输入框：show为false -->
      <el-input
        size="mini"
        v-show="!column.show"
        v-model="column.label"
        @blur="column.show = true">
      </el-input>
    </template>

    <!-- 自定义表项/单元格内容 -->
    <template #default="scope">
      <!-- 双击文字或点击修改图标以更改"show"属性 -->
      <!-- scope.row为元数据，column.col为该列的'键' -->
      <p v-show="scope.row[column.prop].show" @dblclick="scope.row[column.prop].show = false">
        {{scope.row[column.prop].content}} 
        <i class="el-icon-edit-outline" @click="scope.row[column.prop].show = false"/>
      </p>
      <!-- 失去焦点时更改"show"属性，显示文本 -->
      <el-input
        type="textarea"
        :autosize="{minRows:2,maxRows:4}"
        v-show="!scope.row[column.prop].show"
        v-model="scope.row[column.prop].content"
        @blur="scope.row[column.prop].show=true"
      />
    </template>
  </el-table-column>
</el-table>
```

![在这里插入图片描述](./assets/ea781fa8dcb5460882ae7db8f82ba9db.png)

### 1.4 插入、删除一行或一列数据

做到第三点，这一步就没什么难度了，无非就是更改数组
想要实现对每一行每一列的操作，要用到Element表格插件提供的一些属性方法

- 行的 className 的回调方法：`row-class-name`给行加下标（非常关键，“定位”单元格的基础）
- 列的`index`属性（非常关键，“定位”单元格的基础）
- 编辑框的控制与数据绑定
  - `@header-contextmenu`：表头右键事件
  - `@row-contextmenu`：数据行右键事件

```html
<!-- 表格 -->
<el-table
  :data="testDatas"
  @header-contextmenu="(column, event) => rightClick(null, column, event)"
  @row-contextmenu="rightClick"
  :row-class-name="tableRowClassName"
>
  <el-table-column v-if="columnList.length > 0" type="index" :label="'编号'" :width="50"></el-table-column>
  <el-table-column v-for="(column, idx) in columnList" :key="idx" :index="idx">
    <!-- ... -->
  </el-table-column>
</el-table>

<!-- 表头右键菜单 -->
<div v-show="showMenu" id="contextmenu">
  <i class="el-icon-circle-close hideContextMenu" @click="showMenu = false"></i>
  <el-button size="mini" type="primary">功能</el-button>
</div>
```

```javascript
// 添加表格行下标
tableRowClassName({row, rowIndex}) {
  row.row_index = rowIndex
},
rightClick(row, column, event) {
  // 阻止浏览器自带的右键菜单弹出
  event.preventDefault() // window.event.returnValue = false
  if(column.index == null) return
  // 定位菜单
  let ele = document.getElementById('contextmenu')
  ele.style.top = event.clientY - 25 + 'px'
  ele.style.left = event.clientX - 25 + 'px'
  this.showMenu = true
},
```

![在这里插入图片描述](./assets/82c382fd10354a6c871bf1d66f11c7c6.png)

### 1.5 完整代码

[Git链接](https://github.com/zymbth/Editable_table/blob/master/src/views/editable-table.vue)

[在线演示](https://codepen.io/zymbth/full/BaJpvoO)

### 1.6 vue2的坑：“列”变化出现的监听问题

**vue3可跳过**

vue2开发中，新增列的时候，要为所有行添加新的对象，通过一般的添加对象属性是无法被vue监听到的。具体参考这篇文章：[关于vue无法侦听数组及对象属性的变化的解决方案](https://www.cnblogs.com/sue7/p/11088696.html)

```javascript
addColumn(idx) { // 新增列
  var obj = {col: 'col_' + this.count_col++, txt: '', show: true} // 新增列对象
  this.testDatas.map(p => {
    _this.$set(p, obj.col, {content: '', show: true})
    //	p[obj.col] = {content: '', show: true}
  })
}
```

## 二、思路二：精准定位编辑数据

双击修改数据：
![在这里插入图片描述](./assets/4c7903df47184a69aa1b6204405ae9eb.png)

右键编辑行列：
![在这里插入图片描述](./assets/b5831f46bcae40dc9e4ea173d5d8e930.png)

这个思路的实现代码很简洁清晰，就不像上一个那么详细写了

相关要点：

- el-table的单元格双击事件`cell-dblclick`
- 行的 className 的回调方法：`row-class-name`给行加下标（非常关键，“定位”单元格的基础）
- 列的`index`属性（非常关键，“定位”单元格的基础）
- 编辑框的控制与数据绑定
  - `@header-contextmenu`：表头右键事件
  - `@row-contextmenu`：数据行右键事件
  - `@cell-dblclick`：单元格双击事件

```html
<!-- 表格 -->
<el-table
  :data="testDatas"
  @cell-dblclick="cellDblclick"
  @header-contextmenu="(column, event) => rightClick(null, column, event)"
  @row-contextmenu="rightClick"
  :row-class-name="tableRowClassName"
>
  <el-table-column v-if="columnList.length > 0" type="index" :label="'编号'" :width="50"></el-table-column>
  <el-table-column v-for="(column, idx) in columnList" :key="idx" :index="idx">
    <!-- ... -->
  </el-table-column>
</el-table>

<!-- 右键菜单框 -->
<div v-show="showMenu" id="contextmenu" @mouseleave="showMenu = false">
  <i class="el-icon-circle-close hideContextMenu" @click="showMenu = false"></i>
  <el-button size="mini" type="primary">功能</el-button>
</div>

<!-- 单元格/表头内容编辑框 -->
<div v-show="showEditInput" id="editInput" @mouseleave="showEditInput = false">
  <el-input v-model="'单元格/表头内容'">
    <template #prepend>表项名称</template>
  </el-input>
</div>
```

- `cellDblclick()`：单元格双击事件 - 更改单元格数值

-> 双击显示输入框（`#editInput`）

-> 找到双击的单元格数据

-> 输入框赋初值

-> 失焦或enter后将输入框的值赋给选中的单元格数据

- `rightClick()`：单元格/表头右击事件 - 打开菜单

-> 右击显示菜单（`#contextmenu`）

-> 根据表头、表格显示对应菜单

-> 点击调用对应的功能方法

- `tableRowClassName()`：添加表格行下标

### 完整代码

[Git链接](https://github.com/zymbth/Editable_table/blob/master/src/views/editable-table-v2.vue)

[在线演示](https://codepen.io/zymbth/full/gOogZMK)

## 三、组件复用

如果vue项目中需大量运用到此功能，可以通过生成组件来复用。需要注意父子组件间数据的双向绑定。
