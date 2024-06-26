# 实用 js 工具方法

## JS

### 获取数据类型

```js
function mTypeof(value) {
  return value instanceof Element
    ? 'element'
    : Object.prototype.toString
        .call(value)
        .replace(/\[object\s(.+)\]/, '$1')
        .toLowerCase()
}
```

可根据需要排除对 `Element` 类型的判断

### 节流函数

```js
function throttle(fn, interval = 300, _this) {
  let prev = +new Date() // 开始时间 ms
  return function (...args) {
    let curr = +new Date() // 当前时间 ms
    if (curr - prev > interval) {
      // 超出间隔，执行
      prev = curr
      _this ? fn.call(_this, ...args) : fn(...args)
    }
  }
}
```

### 防抖函数

```js
function debounce(fn, delay = 300, _this) {
  let timer // 计时器
  return function (...args) {
    timer && clearTimeout(timer) // 清除delay延时内存在的计时器
    // 延时执行fn
    timer = setTimeout(() => {
      _this ? fn.call(_this, ...args) : fn(...args)
    }, delay)
  }
}
```

### 简单对象深拷贝

```js
function simpleDeepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
```

::: details 缺陷

- 无法复制 Symbol、函数、undefined、NaN、正则表达式和 Map/Set 等特殊值，会丢失；
- 无法复制对象的原型链；
- 性能较低；
- 无法处理函数和正则表达式的属性，会转换为字符串。

:::

### 对象深拷贝

递归地拷贝，不同类型自定义不同的拷贝方法

```js
function mTypeof(value) {
  return value instanceof Element
    ? 'element'
    : Object.prototype.toString
        .call(value)
        .replace(/\[object\s(.+)\]/, '$1')
        .toLowerCase()
}

function deepClone(val) {
  switch (mTypeof(val)) {
    case 'array':
      return val.map(v => deepClone(v))
    case 'object':
      return Object.keys(val).reduce((prev, curr) => {
        prev[curr] = deepClone(val[curr])
        return prev
      }, {})
    case 'map':
      const tmpMap = new Map()
      val.forEach((v, k) => tmpMap.set(k, deepClone(v)))
      return tmpMap
    case 'set':
      const tmpSet = new Set()
      for (let v of val.values()) tmpSet.add(deepClone(v))
      return tmpSet
    case 'regexp':
      return new RegExp(val)
    case 'date':
      return new Date(val.valueOf())
    case 'function':
      return new Function('return ' + val.toString()).call(this)
    case 'string':
    case 'number':
    case 'boolean':
    case 'null':
    case 'undefined':
    default:
      return val
  }
}
```

### 数组去重

```js
function removeDuplicates(arr) {
  if (!arr || !(arr instanceof Array)) return arr
  return [...new Set(arr)]
}
```

### `async...await...` 异常捕捉封装

```js
function asyncFuncWrapper(fn, ...args) {
  try {
    const resp = await fn(...args)
    return({ resp })
  } catch (err) {
    return { err }
  }
}
```

详见[async...await...异常捕捉封装](/front-end/basic/js/encapsulate-async.md)

### 生成随机字符串

```js
const randomString = (len) => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789'
  const strLen = chars.length
  let randomStr = ''
  for (let i = 0; i < len; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * strLen))
  }
  return randomStr
}

/**
 * 生成UUID类型随机字符串
 *
 * 格式：xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * x表示任意十六进制数字，y表示(8, 9, A, 或 B)这四个十六进制数字之一
 * 根据 UUID 规范，第 13 位必须是固定的数字 4，而第 17 位必须是 8、9、A 或 B 中的一个
 * @returns {string}
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // r                : 随机数 0-15
    // "r & 0x3"        : 只保留 r 后两位，[0000,0011]
    // "(r & 0x3) | 0x8": 第四位设置为 1，[1000,1011]
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
```

### 字符串首字母大写

```js
const firstLetterUpper = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
```

### 生成指定范围内的随机数 [min,max]

```js
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
```

### 打乱数组顺序

```js
const shuffleArray = (arr) => {
  return arr.sort(() => 0.5 - Math.random())
}
```

### 格式化货币，千分位数字

```js
const formatMoney = (money) => {
  return money.toLocaleString()
}
```

正则表达式实现

```js
const formatMoneyReg = (money) => {
  money = String(money)
  return money.replace(new RegExp(`(?!^)(?=(\\d{3})+${money.includes('.') ? '\\.' : '$'})`, 'g'), ',')  
}
```

### 手动延时

```js
function manualDelay(val, delay = 2000) {
  return new Promise((resolve, reject) => {
    setTimeout(val ? resolve : reject, delay, val)
  })  
}
```

### base64编码、解码(含中文)

[中文的字符串base64编码、解码](/front-end/basic/js/base64-zh)

## DOM

### 滚动到页面顶部

```js
function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}
```

### 滚动到页面底部

```js
function scrollToBottom() {
  window.scrollTo({
    top: document.documentElement.offsetHeight,
    left: 0,
    behavior: 'smooth'
  })
}
```

### 全屏显示元素

```js
function goToFullScreen(element) {
  element = element || document.body
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  }
}
```

### 退出浏览器全屏状态

```js
function goExitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
```

### 设备类型判断

```js
const isMobile = () => {
  return !!navigator.userAgent.match(
    /(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i
  )
}

const isAndroid = () => {
  return /android/i.test(navigator.userAgent.toLowerCase())
}

const isIOS = () => {
  let reg = /iPhone|iPad|iPod|iOS|Macintosh/i
  return reg.test(navigator.userAgent.toLowerCase())
}
```

### 复制字符串至剪切板

```js
function copyText(text) {
  const textarea = document.createElement('input') //创建input对象
  const currentFocus = document.activeElement //当前获得焦点的元素
  document.body.appendChild(textarea) //添加元素
  textarea.value = text
  textarea.focus()
  if (textarea.setSelectionRange)
    textarea.setSelectionRange(0, textarea.value.length) //获取光标起始位置到结束位置
  else textarea.select()
  let flag
  try {
    flag = document.execCommand('copy') //执行复制
  } catch (err) {
    flag = false
  }
  document.body.removeChild(textarea) //删除元素
  currentFocus.focus()
  return flag
}
```
