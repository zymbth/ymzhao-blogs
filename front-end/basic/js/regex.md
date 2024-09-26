---
description: 正则表达式使用
head:
  - - meta
    - name: keywords
      content: javascript,正则表达式
created: '2022-06-09'
isDraft: 't'
---

# 正则表达式使用

> 依据 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp) 整理下正则表达式相关使用、方法定义、正则语法

## 一、字符串是否匹配

### 1、[RegExp.test()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test)

执行一个检索，用来查看正则表达式与指定的字符串是否匹配。

**语法：**

`regexObj.test(str)`

**参数：**

str：用来与正则表达式匹配的字符串

**返回值：**

如果正则表达式与指定的字符串匹配 ，返回 true；否则 false。

**示例：**

```js
;/^hello/.test('hello world')
// true
```

### 2、[String.prototype.search()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/search)

执行正则表达式和 String 对象之间的一个搜索匹配。

**语法：**

`str.search(regexp)`

**参数：**

regexp：正则表达式对象。如果传入一个非正则表达式对象 regexp，则会使用 new RegExp(regexp) 隐式地将其转换为正则表达式对象。

**返回值：**

如果匹配成功，则 search() 返回正则表达式在字符串中**首次**匹配项的索引；否则，返回 -1。

**示例：**

```js
'hey JudE'.search(/[A-Z]/g)
// 4
```

## 二、字符串匹配结果

### 1、[String.prototype.match()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match)

检索/匹配，返回一个字符串匹配正则表达式的结果

**语法：**

`str.match(regexp)`

**参数：**

regexp: 正则表达式对象。如果传入一个非正则表达式对象，则会隐式地使用 new RegExp(obj) 将其转换为一个 RegExp 。

**返回值：**

正则表达式使用了 g 标志：返回匹配结果列表；
否则，返回第一个匹配（完整匹配及其相关的捕获组）

**示例：**

![demo](https://img-blog.csdnimg.cn/a17beed36da647d287415219521c2334.png#pic_left#id=C455d&originHeight=175&originWidth=576&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 2、[RegExp.prototype.exec()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)

在一个指定字符串中执行一个搜索匹配，可通过设置 global 或 sticky 标志对单个字符串中的多次匹配结果进行逐条的遍历。`match()`只会返回匹配到的结果

**语法：**

`regexObj.exec(str)`

**参数：**

str：要匹配正则表达式的字符串

**返回值：**

如果匹配成功，返回一个数组（包含额外的属性 index 和 input），并更新正则表达式对象的 lastIndex 属性。完全匹配成功的文本将作为返回数组的第一项，从第二项起，后续每项都对应正则表达式内捕获括号里匹配成功的文本。

如果匹配失败，exec() 方法返回 null，并将 lastIndex 重置为 0 。

**示例：**
![demo](https://img-blog.csdnimg.cn/e593455572ed45fbba01f583d5c451ea.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeW16aGFvYnRo,size_18,color_FFFFFF,t_70,g_se,x_16#pic_left#id=GKDcA&originHeight=386&originWidth=577&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
上图示例中，reg 为完全匹配，是有状态的。反复执行`reg.exec(str)`会接着上一次匹配(lastIndex)向后执行匹配，直到匹配失败返回 null 为止

reg1 对象无状态，每一次匹配都是从头开始的，每次匹配返回的结果都一样

#### match() 与 exec() 返回值类型对比

匹配失败时，均返回 null

|                | 匹配                   | 完全匹配     |
| -------------- | ---------------------- | ------------ |
| match() 返回值 | 匹配结果（字符串）列表 | 第一个匹配项 |
| exec() 返回值  | 第一个匹配项           | 匹配项       |

**匹配项（完整的匹配信息）**：类型为数组，第一个元素为匹配成功的字符串，其它为被捕获括号匹配的子字符串

除数组元素外，还包含以下附加特性：

- groups：一个捕获组数组 或 undefined（如果没有定义命名捕获组）
- index：匹配的结果的开始位置
- input：搜索的字符串

示例：
![demo](https://img-blog.csdnimg.cn/e57bd61e8df24f899de335b48616e307.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeW16aGFvYnRo,size_19,color_FFFFFF,t_70,g_se,x_16#pic_left#id=AibvV&originHeight=219&originWidth=602&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
上图示例中，返回的数组为["foo bar foo","foo","bar"]，"foo bar foo"为匹配成功的字符串，"foo"、"bar"为正则表达式中的捕获括号所匹配到的字符串。groups、index、input 为附加特性

### 3、[String.prototype.matchAll()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll)

返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器

**语法：**

`str.matchAll(regexp)`

**参数：**

regexp: 正则表达式对象。如果传入一个非正则表达式对象，则会隐式地使用 new RegExp(obj) 将其转换为一个 RegExp 。(必须是设置了全局模式 g 的形式，否则会抛出异常 TypeError)

**返回值：**

一个迭代器（不可重用，结果耗尽需要再次调用方法，获取一个新的迭代器）。

#### Regexp.exec() 和 matchAll()

在 matchAll 出现之前，通过在**循环**中调用 regexp.exec() 来获取**所有**匹配项信息

如果使用 matchAll ，就可以不必使用循环加 exec 方式。使用 matchAll 会得到一个迭代器的返回值，配合 `for...of` , `array spread` , 或者 `Array.from()` 可以更方便实现功能

两种方法，正则表达式都需使用 /g 标志

```javascript
const regexp = RegExp('(foo).?(bar).?\\1', 'g')
const str = 'foo bar foo foobarfoo'
const matches = str.matchAll(regexp)
console.log([...matches])
```

## 三、其它属性

最常用的是 g、i 标志

[RegExp.prototype.dotAll](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/dotAll)：只读。是否在正则表达式中一起使用"s"修饰符（引入/s 修饰符，使得.可以匹配任意单个字符），使用时，特殊字符"."应另外匹配字符串中的下述行终结符（line terminator characters），否则将会失配

[RegExp.prototype.flags](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/flags)：返回一个字符串，由当前正则表达式对象的标志组成

[RegExp.prototype.global](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global)：只读。正则表达式是否使用了"g"标志，使用时，应该测试字符串中所有可能的匹配

[RegExp.prototype.hasIndices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/hasIndices)：只读。是否在正则表达式中一起使用"d"修饰符

[RegExp.prototype.ignoreCase](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/ignoreCase)：只读。正则表达式是否使用了"i"标志，使用时，字符串进行匹配应该忽略大小写

[RegExp.prototype.multiline](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/multiline)：只读。正则表达式是否使用了"m"标志，使用时，一个多行输入字符串被看作多行

[RegExp.prototype.source](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/source)：返回一个值为当前正则表达式对象的模式文本的字符串，该字符串不会包含正则字面量两边的斜杠以及任何的标志字符。

[RegExp.prototype.sticky](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky)：只读。正则表达式是否使用了"y"标志，使用时，仅从正则表达式的 lastIndex 属性表示的索引处为目标字符串匹配（并且不会尝试从后续索引匹配）。如果一个表达式同时指定了 sticky 和 global，其将会忽略 global 标志。

[RegExp.prototype.unicode](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode)：只读。正则表达式是否使用了"u"标志，使用时，开启了多种 Unicode 相关的特性。使用 "u" 标志，任何 Unicode 代码点的转义都会被解释。

## 四、正则表达式特殊字符

### 1、[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)

### 2、[运算符优先级](https://www.runoob.com/regexp/regexp-operator.html)

_“正则表达式从左到右进行计算，并遵循优先级顺序，这与算术表达式非常类似。
相同优先级的从左到右进行运算，不同优先级的运算先高后低。下表从最高到最低说明了各种正则表达式运算符的优先级顺序：”_

```text
运算符 | 描述
-------- | -----
\ | 转义符
(), (?: ), (?=), [] | 圆括号和方括号
*, +, ?, {n}, {n,}, {n,m} | 限定符
^, $, \任何元字符、任何字符 | 定位点和序列（即：位置和顺序）
\| | 替换，"或"操作字符具有高于替换运算符的优先级，使得"m\|food"匹配"m"或"food"。若要匹配"mood"或"food"，请使用括号创建子表达式，从而产生"(m\|f)ood"。
```

## 五、杂

```js
(foo) (?:bar) \1 (bar) (x) \3/.test('foo bar foo bar x x')
//true

(foo) (bar) \1 (bar) (x) \4/.test('foo bar foo bar x x')
//true

(foo) (bar) \1 \2 (x) \3/.test('foo bar foo bar x x')
//true
```

`(foo) (bar) \1 \2 (x) \3/.exec('foo bar foo bar x x')`:
![demo](https://img-blog.csdnimg.cn/fd7d5e298f2c4e84aa3c35660768232f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeW16aGFvYnRo,size_12,color_FFFFFF,t_70,g_se,x_16#pic_left#id=aghDZ&originHeight=214&originWidth=396&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
`/(foo) (?:bar) \1 \w+ (x) \2/.exec('foo bar foo bar x x')`:
![demo](https://img-blog.csdnimg.cn/4a2ca0ab66be40f5bf1b370c607ca5d9.png#pic_left#id=vdJOJ&originHeight=199&originWidth=428&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```javascript
.replaceAll(/"(\w+)\{/g, function () {
  return '"' + arguments[1] + '":{'
})
```
