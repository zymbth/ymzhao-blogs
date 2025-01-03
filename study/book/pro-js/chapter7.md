---
description: JS红宝书(Professional Javascript for Web Developers)第7章 迭代器与生成器学习笔记，供个人复习使用
head:
  - - meta
    - name: keywords
      content: js,红宝书,学习笔记,迭代器,生成器
created: '2022-04-24'
tag: '摘录'
---

# 第7章 迭代器与生成器

ECMAScript 6 规范新增了两个高级特性：迭代器和生成器。使用这两个特性，能够更清晰、高效、方便地实现迭代。

## 7.1 理解迭代

>*“循环是迭代机制的基础，这是因为它可以指定迭代的次数，以及每次迭代要执行什么操作。每次循环都会在下一次迭代开始之前完成，而每次迭代的顺序都是事先定义好的。<br/>
迭代会在一个**有序集合**上进行。（“有序”可以理解为集合中所有项**都**可以按照既定的顺序被**遍历**到，特别是开始和结束项有明确的定义。）数组是 JavaScript 中有序集合的最典型例子。”*

JavaScript 在 ECMAScript 6 以后也支持了迭代器模式。

## 7.2 迭代器模式

>*“迭代器模式（特别是在 ECMAScript 这个语境下）描述了一个方案，即可以把有些结构称为“**可迭代对象**”（iterable），因为它们实现了正式的 **Iterable 接口**，而且可以通过**迭代器 Iterator** 消费。<br/>
可迭代对象是一种抽象的说法。基本上，可以把可迭代对象理解成数组或集合这样的集合类型的对象。它们包含的元素都是**有限**的，而且都具有**无歧义的遍历顺序**”*

### 7.2.1 可迭代协议

>*“实现 Iterable 接口（可迭代协议）要求同时具备两种能力：支持迭代的自我识别能力和创建实现Iterator 接口的对象的能力。在 ECMAScript 中，这意味着必须暴露一个属性作为“默认迭代器”，而且这个属性必须使用特殊的 **Symbol.iterator** 作为键。这个默认迭代器属性必须引用一个**迭代器工厂函数**，调用这个工厂函数必须**返回一个新迭代器**。”*

很多内置类型都实现了 Iterable 接口：

- **字符串**
- **数组**
- **映射**
- **集合**
- **arguments对象**
- **NodeList等DOM集合类型**

接收可迭代对象的原生语言特性包括：

- **for-of循环** 
- **数组解构** (`let [a,b,c] = 'abc' // a: 'a', b: 'b', c: 'c'`)
- **扩展操作符** (`[...'abc'] // ['a','b','c']`)
- **Array.from()** (`Array.from('abc') // ['a','b','c']`)
- **创建集合** (`new Set('abc') // Set(3) {'a', 'b', 'c'}`)
- **创建映射**

```js
let arr = [...'abc'].map((p, i) => [p, i]) // [["a",0],["b",1],["c",2]]
new Map(arr) // Map(3) {'a' => 0, 'b' => 1, 'c' => 2}
```

- Promise.all()接收由期约组成的可迭代对象
- Promise.race()接收由期约组成的可迭代对象
- yield*操作符，在生成器中使用

如果对象原型链上的父类实现了 Iterable 接口，那这个对象也就实现了这个接口

### 7.2.2 迭代器协议

>*“迭代器是一种**一次性**使用的对象，用于迭代与其关联的可迭代对象。迭代器 API 使用 **next()** 方法在可迭代对象中遍历数据。每次成功调用 next()，都会返回一个 **IteratorResult** 对象，包含两个属性：**done** 和 **value**。done 是一个布尔值，表示是否还可以再次调用 next()取得下一个值；value 包含可迭代对象的下一个值”*

```js
// 可迭代对象
let arr = ['foo', 'bar']
// 迭代器工厂函数
console.log(arr[Symbol.iterator]); // f values() { [native code] }
// 迭代器
let iter = arr[Symbol.iterator]()
console.log(iter); // ArrayIterator {}
// 执行迭代
console.log(iter.next()); // { done: false, value: 'foo' }
console.log(iter.next()); // { done: false, value: 'bar' }
console.log(iter.next()); // { done: true, value: undefined }
```

>*“每个迭代器都表示对可迭代对象的一次性有序遍历。不同迭代器的实例相互之间没有联系<br/>
迭代器并不与可迭代对象某个时刻的快照绑定，而仅仅是使用游标来记录遍历可迭代对象的历程。如果可迭代对象在迭代期间被修改了，那么迭代器也会反映相应的变化”*

## 7.3 生成器

>*“生成器是 ECMAScript 6 新增的一个极为灵活的结构，拥有**在一个函数块内暂停和恢复代码执行**的能力。这种新能力具有深远的影响，比如，使用生成器可以自定义迭代器和实现协程。”*

### 7.3.1 生成器基础

>*“生成器的形式是一个函数，函数名称前面加一个星号（*）表示它是一个生成器。只要是可以定义函数的地方，就可以定义生成器（箭头函数不能用来定义生成器函数）。标识生成器函数的星号不受两侧空格的影响。”*

```js
// 生成器函数声明
function* generatorFn() {} 
// 生成器函数表达式
let generatorFn = function* () {}
```

>*“**调用生成器函数会产生一个生成器对象**。生成器对象一开始处于暂停执行（suspended）的状态。与迭代器相似，**生成器对象也实现了 Iterator 接口**，因此具有 next()方法。调用这个方法会让生成器开始或恢复执行。”*
>
>*“生成器对象实现了 Iterable 接口，它们默认的迭代器是自引用的”*
