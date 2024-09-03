---
description: Array 查缺补漏，陈列新增/错漏/不熟悉的知识点，反复翻阅复习
head:
  - - meta
    - name: keywords
      content: array,javascript,基础,复习,查缺补漏
---

# Array 查缺补漏

> 温习一遍 Array 类型及方法，查缺补漏，过于基础的简要带过
>
> 复习参考：[Array-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)

## Array 对象

暂空，先复习指向更明确的方法吧

## 静态方法

入门前端，记得区分静态方法与实例方法

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
