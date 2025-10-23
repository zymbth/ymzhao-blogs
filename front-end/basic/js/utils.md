---
description: 实用 js 工具方法
head:
  - - meta
    - name: keywords
      content: js,util,工具方法
created: '2024-06-25'
---

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
    return { resp }
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

均等概率得生成 min - max 之间的随机整数

### 打乱数组顺序

```js
const shuffleArray = (arr) => {
  arr.sort(() => 0.5 - Math.random())
  // return arr.toSorted(() => 0.5 - Math.random())
}
```

直接更改原数组。也可以选择不更改原数组，返回乱序后的数组。

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

### 生成颜色渐变列表

```js
/**
 * JavaScript 计算两个颜色之间的渐变色值
 *
 * @author kmxz
 * @see https://www.zhihu.com/question/38869928/answer/78527903
 * @param {string} start - 渐变的起始颜色
 * @param {string} end - 渐变的结束颜色
 * @param {number} steps - 渐变中的颜色总数，表示生成几种颜色
 * @param {number} [gamma=1] - 控制颜色渐变的非线性透明度，默认值为 1
 * @returns {string[]} - 返回一个包含渐变颜色的数组，每个颜色的格式为十六进制字符串
 * @example
 * gradientColors('#000', '#fff', 100, 2.2)
 * gradientColors('#0000ff', '#ff0000', 10)
 */
function gradientColors(start, end, steps, gamma = 1) {
  let i, j, ms, me, output = [], so = []
  const normalize = channel => Math.pow(channel / 255, gamma)
  // convert #hex notation to rgb array
  const parseColor = hexStr =>
    hexStr.length === 4
      ? hexStr
          .substr(1)
          .split('')
          .map(function (s) {
            return 0x11 * parseInt(s, 16)
          })
      : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(s => parseInt(s, 16))
  // zero-pad 1 digit to 2
  const pad = s => (s.length === 1 ? '0' + s : s)

  start = parseColor(start).map(normalize)
  end = parseColor(end).map(normalize)
  for (i = 0; i < steps; i++) {
    ms = i / (steps - 1)
    me = 1 - ms
    for (j = 0; j < 3; j++) {
      so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16))
    }
    output.push('#' + so.join(''))
  }
  return output
}
```

### 对象转formdata格式

```js
/**
 * 对象转formdata格式
 *
 * @param {Object} obj
 * @returns
 */
function objToFormData(obj) {
  const formData = new FormData()
  if (typeof obj !== 'object') return formData
  Object.entries(obj).forEach(([k, v]) => {
    switch (mTypeof(v)) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'file':
      case 'blob':
      case 'regexp':
      case 'date':
        formData.append(k, v)
        break
      case 'object':
        formData.append(k, JSON.stringify(v))
        break
      case 'array':
        v.forEach(p => formData.append(k, p))
        break
      case 'set':
        for (let p of v) formData.append(k, p)
        break
      case 'null':
      case 'undefined':
        formData.append(k, '')
        break
      case 'map':
      case 'function':
      default:
        break
    }
  })
  return formData
}

function mTypeof(value) {
  return value instanceof Element
    ? 'element'
    : Object.prototype.toString
        .call(value)
        .replace(/\[object\s(.+)\]/, '$1')
        .toLowerCase()
}
```

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
/**
 * 将指定文本复制到系统剪贴板（通过创建临时 input 元素实现）
 *
 * @param {string} text - 要复制的文本内容
 * @returns {boolean} 复制是否成功。成功返回 `true`，失败（如浏览器不支持或权限限制）返回 `false`
 */
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

### 动画文字提示

```js
/**
 * 在页面中央显示一个带有淡出动画的醒目提示文字
 *
 * @param {string} message - 要显示的文本内容
 * @param {string} [color] - 文字颜色，支持任意 CSS 颜色值（如 hex、rgb、rgba、颜色关键字等）。
 * @param {string} [fontSize] - 文字大小，支持任意 CSS font-size 值（如 '24px'、'large'、'xxx-large' 等）。
 * @returns {void}
 */
function shining(message, color = 'rgb(50, 177, 108)', fontSize = 'xxx-large') {
  if (!message) return
  const i = document.createElement('span')
  i.textContent = message
  i.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    width: 90vw;
    color: ${color};
    font-size: ${fontSize};
    font-weight: bold;
    text-align: center;
    transform: translate(-50%, -50%);
    user-select: none;
    z-index: 2002;
  `
  document.body.appendChild(i)
  const duration = 2500
  i.animate(
    [
      { top: '50%', opacity: 1 },
      { top: '30%', opacity: 0 }
    ],
    { duration, fill: 'forwards' }
  )
  setTimeout(() => i.remove(), duration)
}
```

### js调用消息提示

```js
/**
 * 显示一个自定义样式的消息提示（Toast）
 *
 * @param {object} options - 消息配置选项。
 * @param {string} options.message - 要显示的消息文本内容。
 * @param {('info'|'primary'|'success'|'warning'|'error')} [options.type] - 消息类型
 * @param {number} [options.duration] - 消息自动关闭的延迟时间（毫秒）
 * @param {string} [options.customClass] - 自定义 CSS 类名
 * @param {boolean} [options.showClose] - 是否显示关闭按钮
 * @param {number} [options.offset] - 消息距离顶部的偏移量（px）
 * @param {HTMLElement|string} [options.appendTo] - 消息容器的挂载目标，可以是 DOM 元素或 CSS 选择器字符串
 * @returns {void}
 */
function message(options) {
  if (!(typeof options === 'object' && !!options && 'message' in options)) return
  const { message, type = 'info', duration = 3000, customClass, showClose = false, offset = 20, appendTo } = options

  const color = { info: '#909399', primary: '#409EFF', success: '#67C23A', warning: '#E6A23C', error: '#F56C6C' }[type] || '#909399'

  let msgRootEl = document.body
  if (appendTo instanceof HTMLElement) {
    msgRootEl = appendTo
  } else if (typeof appendTo === 'string') {
    const qryEl = document.querySelector(appendTo)
    if (qryEl instanceof HTMLElement) msgRootEl = qryEl
  }

  const wrapEl = document.createElement('div')
  if (customClass && typeof customClass === 'string') wrapEl.className = customClass
  wrapEl.style.cssText = `
    position: fixed;
    top: ${offset}px;
    left: 50%;
    max-width: 80%;
    padding: 6px 24px 6px 10px;
    color: ${color};
    font-size: 14px;
    line-height: 22px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    opacity: 0;
    transform: translateX(-50%);
    z-index: 2002;
  `
  const i = document.createElement('span')
  i.textContent = message
  wrapEl.appendChild(i)
  msgRootEl.appendChild(wrapEl)
  wrapEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 100, fill: 'forwards' })

  const removeFn = () => {
    wrapEl.animate(
      [
        { top: `${offset}px`, opacity: 1 },
        { top: '-20px', opacity: 0 }
      ],
      { duration: 200, fill: 'forwards' }
    )
    setTimeout(() => wrapEl.remove(), 200)
  }
  let timer = setTimeout(removeFn, duration)
  wrapEl.onmouseenter = () => clearTimeout(timer)
  wrapEl.onmouseleave = () => {
    timer = setTimeout(removeFn, duration)
  }

  if (showClose) {
    const closeEl = document.createElement('span')
    closeEl.textContent = '+'
    closeEl.style.cssText = `
      position: absolute;
      top: 50%;
      right: 8px;
      font-size: 22px;
      line-height: 22px;
      color: #a8abb2;
      transform: translateY(-50%) rotate(45deg);
      cursor: pointer;
    `
    closeEl.onclick = () => {
      clearTimeout(timer)
      removeFn()
    }
    wrapEl.appendChild(closeEl)
  }
}
```
