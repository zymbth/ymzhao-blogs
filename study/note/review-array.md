---
description: Array 查缺补漏，陈列新增/错漏/不熟悉的知识点，反复翻阅复习
head:
  - - meta
    - name: keywords
      content: array,javascript,基础,复习,查缺补漏
created: '2024-09-04'
tag: '摘录'
---

# Array 查缺补漏

> 温习一遍 Array 类型及方法，查缺补漏，过于基础的简要带过
>
> 复习参考：[Array-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)

1. 迭代方法

迭代方法都接受一个回调函数作为参数。回调函数按顺序为数组中的每个元素调用，且最多调用一次，并且回调函数的返回值用于确定方法的返回值。它们都具有相同的方法签名：`method(callbackFn, thisArg)`，具体参考[Array-迭代方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array#%E8%BF%AD%E4%BB%A3%E6%96%B9%E6%B3%95)

其中 callbackFn 接受三个参数：

- `element`：数组中当前正在处理的元素
- `index`：正在处理的元素在数组中的索引
- `array`：调用该方法的数组

`thisArg` 参数（默认为 undefined）将在调用 callbackFn 时用作 this 值。

2. 通用数组方法

数组方法总是通用的——它们不访问数组对象的任何内部数据。它们只通过 length 属性和索引访问数组元素。这意味着它们也可以在类数组对象上调用。具体参考[通用数组方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array#%E9%80%9A%E7%94%A8%E6%95%B0%E7%BB%84%E6%96%B9%E6%B3%95)

```js
const arrayLike = { 0: 'a', 1: 'b', length: 2 }
Array.prototype.join.call(arrayLike, '+') // 'a+b'

const arrayLike1 = { length: 2 }
Array.prototype.fill.call(arrayLike1, 1) // { '0': 1, '1': 1, length: 2 }
```

3. 空槽

空槽与 `undefined` 不同，数组的不同方法在更改数组时对空槽的处理也各不相同。某些迭代处理会跳过空槽。具体参考[Array-数组方法和空槽](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array#%E6%95%B0%E7%BB%84%E6%96%B9%E6%B3%95%E5%92%8C%E7%A9%BA%E6%A7%BD)

4. 下标

数组实例方法中，参数有起(start)止(end)下标的都是左闭右开，即，包含 start，不包含 end。大多都可使用负数进行“倒数”

## 构造函数

Array() 构造函数用于创建 Array 对象。调用 Array() 时可以使用或不使用 new。两者都会创建一个新的 Array 实例。

::: code-group

```js [语法]
Array()
Array(element0)
Array(element0, element1)
Array(element0, element1, /* … ,*/ elementN)
Array(arrayLength)
```

```js [示例]
Array('3') // ['3']
Array(3) // [empty × 3]
Array.from({ length: 3 }) // [undefined, undefined, undefined]
```

:::

传入一个数字作为参数时，将返回一个新的 JavaScript 数组，其 length 属性设置为该数字（注意：这意味着一个由 arrayLength 个空槽组成的数组，而不是具有实际 undefined 值的槽——参见[稀疏数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#%E7%A8%80%E7%96%8F%E6%95%B0%E7%BB%84)）。

## 静态方法

初学者记得区分静态方法与实例方法

### Array.from()

Array.from() 静态方法从[可迭代](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#%E5%8F%AF%E8%BF%AD%E4%BB%A3%E5%8D%8F%E8%AE%AE)或[类数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#%E4%BD%BF%E7%94%A8%E7%B1%BB%E6%95%B0%E7%BB%84%E5%AF%B9%E8%B1%A1)对象创建一个新的浅拷贝的数组实例。

::: code-group

```js [语法]
Array.from(arrayLike)
Array.from(arrayLike, mapFn)
Array.from(arrayLike, mapFn, thisArg)
```

```js [示例]
// 从字符串构建数组
Array.from('foo') // ["f", "o", "o"]
Array.from([1, 2, 3], x => x + x) // [2, 4, 6]
// 从 Set 构建数组
const set = new Set(['foo', 'bar', 'baz', 'foo'])
Array.from(set) // [ "foo", "bar", "baz" ]
// 从 Map 构建数组
const map = new Map([
  [1, 2],
  [2, 4],
  [4, 8],
])
Array.from(map) // [[1, 2], [2, 4], [4, 8]]
// 从 NodeList 构建数组
const images = document.querySelectorAll('img')
const sources = Array.from(images, image => image.src)
// 从类数组构建数组
Array.from({ length: 3 }) // [undefined, undefined, undefined]
```

:::

### Array.fromAsync()

es2022 新方法

语法：

```js
Array.fromAsync(arrayLike)
Array.fromAsync(arrayLike, mapFn)
Array.fromAsync(arrayLike, mapFn, thisArg)
```

Array.fromAsync() 可以处理异步可迭代对象，返回一个会兑现为数组实例的 Promise。

Array.fromAsync() 会依次等待对象中产生的每个值兑现。Promise.all() 会并行等待所有值兑现。

更多使用细节参照[官网](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fromAsync)

### Array.isArray()

Array.isArray() 检查传递的值是否为 Array。它不检查值的原型链，也不依赖于它所附加的 Array 构造函数。对于使用数组字面量语法或 Array 构造函数创建的任何值，它都会返回 true。

语法：

```js
Array.isArray(value)
```

### Array.of()

通过可变数量的参数创建一个新的 Array 实例，而不考虑参数的数量或类型

::: code-group

```js [语法]
Array.of()
Array.of(element0)
Array.of(element0, element1)
Array.of(element0, element1, /* … ,*/ elementN)
```

```js [示例]
Array.of(1) // [1]
Array.of(1, 2, 3) // [1, 2, 3]
Array.of(undefined) // [undefined]
```

:::

## 实例方法

定义在 Array 原型上的方法，Array 实例可直接调用。

这里按功能分为几个类型，高频及重要的方法高亮标记。

::: code-group

```text{1-10} [修改、转换数组]
Array.prototype.push()
Array.prototype.pop()
Array.prototype.shift()
Array.prototype.unshift()
Array.prototype.splice()
Array.prototype.toSpliced()
Array.prototype.sort()
Array.prototype.toSorted()
Array.prototype.reverse()
Array.prototype.toReversed()
Array.prototype.flat()
Array.prototype.fill()
Array.prototype.with()
Array.prototype.copyWithin()
```

```text{1-8} [查询检索]
Array.prototype.includes()
Array.prototype.indexOf()
Array.prototype.lastIndexOf()
Array.prototype.find()
Array.prototype.findIndex()
Array.prototype.findLast()
Array.prototype.findLastIndex()
Array.prototype.at()
```

```text{1-6} [遍历和迭代]
Array.prototype.forEach()
Array.prototype.map()
Array.prototype.filter()
Array.prototype.every()
Array.prototype.some()
Array.prototype.reduce()
Array.prototype.reduceRight()
Array.prototype.flatMap()
```

```text{1-3} [其它]
Array.prototype.slice()
Array.prototype.concat()
Array.prototype.join()
Array.prototype.toString()
Array.prototype.toLocaleString()
Array.prototype[Symbol.iterator]()
Array.prototype.keys()
Array.prototype.values()
Array.prototype.entries()
```

:::

### push

追加元素到数组末尾(可以添加多个)，返回新数组长度，会改变原数组

### pop

从数组中删除最后一个元素，并返回该元素的值，会改变原数组

### shift

从数组中删除第一个元素，并返回该元素的值，会改变原数组

### unshift

将指定元素添加到数组的开头(可以添加多个)，并返回数组的新长度，会改变原数组

### splice

就地移除或者替换已存在的元素和/或添加新的元素，返回删除的元素数组，会改变原数组。

可以理解为先删除，再插入(如有必要)。

语法：

```js
splice(start)
splice(start, deleteCount)
splice(start, deleteCount, item1)
splice(start, deleteCount, item1, item2)
splice(start, deleteCount, item1, item2, /* …, */ itemN)
```

`start`：必填，开始删除的位置，可使用负数进行“倒数”

`deleteCount`：删除的元素数量，未设置时删除 start 之后的所有元素

`items`: 从 start 开始要加入到数组中的元素，不设置则只作删除操作

### toSpliced

`Array.prototype.splice()` 的复制版本，不改变原数组

### sort

就地对数组的元素进行排序，并返回对相同数组的引用。默认排序是将元素转换为字符串，然后按照它们的 UTF-16 码元值升序排序。会改变原数组

语法：

```js
sort()
sort(compareFn)
```

示例：

```js
const arr = [3, 1, 4, 8, 2]
arr.sort((a, b) => a - b) // [1, 2, 3, 4, 8]
```

### toSorted

`Array.prototype.sort()` 的复制版本，不改变原数组

### reverse

就地反转数组中的元素，并返回同一数组的引用，会改变原数组

### toReversed

`Array.prototype.reverse()` 的复制版本，不改变原数组

### flat

创建一个新的数组，并根据指定深度递归地将所有子数组元素拼接到新的数组中，也即展平数组。不改变原数组

语法：

```js
flat()
flat(depth)
```

`depth`: 递归层数，默认为 1

示例：

```js
const arr1 = [1, 2, [3, 4]]
arr1.flat() // [1, 2, 3, 4]

const arr2 = [1, 2, [3, 4, [5, 6]]]
arr2.flat() // [1, 2, 3, 4, [5, 6]]
arr2.flat(2) // [1, 2, 3, 4, 5, 6]

const arr3 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]]
arr3.flat(Infinity) // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

### fill

用一个固定值填充一个数组中从起始索引（默认为 0）到终止索引（默认为 array.length）内的全部元素。它返回修改后的数组。会改变原数组

::: code-group

```js [语法]
fill(value)
fill(value, start)
fill(value, start, end)
```

```js [示例]
console.log([1, 2, 3].fill(4)) // [4, 4, 4]
console.log([1, 2, 3].fill(4, 1)) // [1, 4, 4]
console.log([1, 2, 3].fill(4, 1, 2)) // [1, 4, 3]
console.log([1, 2, 3].fill(4, -3, -2)) // [4, 2, 3]
console.log(Array(3).fill(4)) // [4, 4, 4]

// 一个简单的对象，被数组的每个空槽所引用
const arr = Array(3).fill({}) // [{}, {}, {}]
arr[0].hi = 'hi' // [{ hi: "hi" }, { hi: "hi" }, { hi: "hi" }]

const arrayLike = { length: 2 }
Array.prototype.fill.call(arrayLike, 1) // { '0': 1, '1': 1, length: 2 }
```

:::

`start`, `end` 可使用负数进行“倒数”

### with

使用方括号表示法修改指定索引值的复制方法版本。它会返回一个新数组，不会改变原数组

::: code-group

```js [语法]
arrayInstance.with(index, value)
```

```js [示例]
const arr = [1, 2, 3, 4, 5]
arr.with(2, 6) // [1, 2, 6, 4, 5]

const arr1 = [1, , 3, 4, , 6]
arr1.with(0, 2) // [2, undefined, 3, 4, undefined, 6]
```

:::

`index` 可使用负数进行“倒数”

通过组合使用 with() 和 at() 函数，可分别地写入和读取数组，索引使用正数负数均可。

with() 方法永远不会产生稀疏数组。如果原数组是稀疏的，新数组对应的空白索引位置会替换为 undefined。

### copyWithin

浅复制数组的一部分到同一数组中的另一个位置，并返回它，会改变原数组。

::: code-group

```js [语法]
copyWithin(target)
copyWithin(target, start)
copyWithin(target, start, end)
```

```js [示例]
console.log([1, 2, 3, 4, 5].copyWithin(-2)) // [1, 2, 3, 1, 2]
console.log([1, 2, 3, 4, 5].copyWithin(0, 3, 4)) // [4, 2, 3, 4, 5]
```

:::

参数：

- `target`: 序列开始替换的目标位置
- `start`: 要复制的元素序列的起始位置，默认为 0
- `end`: 要复制的元素序列的结束位置，默认为数组长度

序列在一次中操作被复制和粘贴：

- 先复制指定的区段 `[start, end)`（根据 start,end 的默认值，默认的复制区段为整个序列）
- 然后从 `target` 处开始粘贴（复制区段“用完”或者粘贴到序列最后结束）

### includes

判断一个数组是否包含一个指定的值

::: code-group

```js [语法]
includes(searchElement)
includes(searchElement, fromIndex)
```

```js [示例]
console.log([1, 2, 3].includes(2)) // true
console.log([1, 2, 3].includes(3, 3)) // false
console.log([1, 2, 3].includes(3, -1)) // true
console.log([1, 2, NaN].includes(NaN)) // true
console.log(['1', '2', '3'].includes(3)) // false
// 可以在稀疏数组中搜索 undefined
console.log([1, , 3].includes(undefined)) // true
```

:::

注意：

- includes() 方法使用零值相等算法，NaN 可以被正确搜索到。
- 当在稀疏数组上使用时，includes() 方法迭代空槽，就像它们的值是 undefined 一样

### indexOf

返回数组中第一次出现给定元素的下标，如果不存在则返回 -1

::: code-group

```js [语法]
indexOf(searchElement)
indexOf(searchElement, fromIndex)
```

```js [示例]
const array = [2, 9, 9]
array.indexOf(2) // 0
array.indexOf(7) // -1
array.indexOf(9, 2) // 2
array.indexOf(2, -3) // 0
// 不能使用 indexOf() 来搜索 NaN
console.log([NaN].indexOf(NaN)) // -1
// 不能使用 indexOf() 在稀疏数组中搜索空槽
console.log([1, , 3].indexOf(undefined)) // -1
```

:::

注意：

- indexOf() 使用严格相等（与 === 运算符使用的算法相同）。NaN 值永远不会被比较为相等，因此当 searchElement 为 NaN 时 indexOf() 总是返回 -1。
- indexOf() 方法会跳过稀疏数组中的空槽。

### lastIndexOf

返回数组中给定元素最后一次出现的索引，如果不存在则返回 -1。该方法从 fromIndex 开始向前搜索数组。

语法和要点类似 `indexOf`

### find

返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。

::: code-group

```js [语法]
find(callbackFn)
find(callbackFn, thisArg)
```

```js [示例]
const inventory = [
  { name: 'apples', quantity: 2 },
  { name: 'bananas', quantity: 0 },
  { name: 'cherries', quantity: 5 },
]

const result = inventory.find(({ name }) => name === 'cherries')

console.log(result) // { name: 'cherries', quantity: 5 }
```

:::

find() 不会改变被调用的数组，但是提供给 callbackFn 的函数可能会改变它。但需要注意的是，在第一次调用 callbackFn 之前，数组的长度会被保存。

### findLast

反向迭代数组，并返回满足提供的测试函数的第一个元素的值。如果没有找到对应元素，则返回 undefined。

语法和要点类似 `find`

### findIndex

返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回 -1。

语法和要点类似 `find`

### findLastIndex

反向迭代数组，并返回满足所提供的测试函数的第一个元素的索引。若没有找到对应元素，则返回 -1。

语法和要点类似 `find`

### at

接收一个整数值并返回该索引对应的元素，允许正数和负数。负整数从数组中的最后一个元素开始倒数。

::: code-group

```js [语法]
at(index)
```

```js [示例]
console.log(['apple', 'banana', 'pear'].at(-1)) // pear
```

:::

### forEach

对数组的每个元素执行一次给定的函数

::: code-group

```js [语法]
forEach(callbackFn)
forEach(callbackFn, thisArg)
```

```js [示例]
const logArrayElements = (element, index /*, array */) => console.log(`a[${index}] = ${element}`)

// 不会为空槽调用回调函数
;[2, 5, , 9].forEach(logArrayElements)
// logs:
// a[0] = 2
// a[1] = 5
// a[3] = 9
```

:::

forEach() 方法是一个**迭代方法**。它按索引升序地为数组中的每个元素调用一次提供的 callbackFn 函数。与 map() 不同，forEach() 总是返回 undefined。

同 `find` 类似，第一次调用 callbackFn 之前，**数组的长度已经被保存**。

::: details 个人理解

调用 callbackFn 期间对数组后续元素的更改会影响后续的迭代，主要体现在长度及访问时元素的值上。可以简单的理解为：

```js
for (let i = 0, len = arr.length; i < len; i++) {
  // ...
}
```

哪怕在迭代中删除了部分元素，迭代次数仍然是原数组长度

前次迭代中更改了后续元素，迭代至该元素时，访问的是更改后的值

:::

### map

创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成

### every

### some

### reduce

### reduceRight

### flatMap

### slice

### concat

### join

### toString

### toLocaleString
