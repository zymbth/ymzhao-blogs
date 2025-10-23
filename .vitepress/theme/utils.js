/**
 * 将指定文本复制到系统剪贴板（通过创建临时 input 元素实现）
 *
 * @param {string} text - 要复制的文本内容
 * @returns {boolean} 复制是否成功。成功返回 `true`，失败（如浏览器不支持或权限限制）返回 `false`
 */
export function copyText(text) {
  const textarea = document.createElement('input') // 创建input对象
  const currentFocus = document.activeElement // 当前获得焦点的元素
  document.body.appendChild(textarea) // 添加元素
  textarea.value = text
  textarea.focus()
  if (textarea.setSelectionRange)
    textarea.setSelectionRange(0, textarea.value.length) // 获取光标起始位置到结束位置
  else textarea.select()
  let flag
  try {
    flag = document.execCommand('copy') // 执行复制
  } catch {
    flag = false
  }
  document.body.removeChild(textarea) // 删除元素
  currentFocus.focus()
  return flag
}

/**
 * 文字提示
 *
 * @description 调用js函数在页面中央显示一个带有淡出动画、内联样式的醒目提示文字。内联样式自行调整，相关元素用后即删
 * @param {string} message - 要显示的文本内容
 * @param {string} [color] - 文字颜色，支持任意 CSS 颜色值（如 hex、rgb、rgba、颜色关键字等）。
 * @param {string} [fontSize] - 文字大小，支持任意 CSS font-size 值（如 '24px'、'large'、'xxx-large' 等）。
 * @returns {void}
 */
export function shining(message, color = 'rgb(50, 177, 108)', fontSize = 'xxx-large') {
  if (!message) return
  const msgEl = document.createElement('span')
  msgEl.textContent = message
  msgEl.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    color: ${color};
    font-size: ${fontSize};
    font-weight: bold;
    transform: translate(-50%, -50%);
    user-select: none;
    z-index: 2002;
  `
  msgEl.setAttribute('role', 'alert')
  msgEl.setAttribute('aria-live', 'assertive')
  document.body.appendChild(msgEl)
  const duration = 2500
  msgEl.animate(
    [
      { top: '50%', opacity: 1 },
      { top: '30%', opacity: 0 }
    ],
    { duration, fill: 'forwards' }
  )
  setTimeout(() => msgEl.remove(), duration)
}

/**
 * 消息弹出提示（Toast）
 *
 * @description 调用js函数弹出显示一个内联样式的消息提示（Toast）。内联样式自行调整，相关元素用后即删
 * @param {object} options - 消息配置选项。
 * @param {string} options.message - 要显示的消息文本内容。
 * @param {('info'|'primary'|'success'|'warning'|'error')} [options.type] - 消息类型
 * @param {number} [options.duration] - 消息自动关闭的延迟时间（毫秒）
 * @param {string} [options.customClass] - 自定义 CSS 类名
 * @param {boolean} [options.showClose] - 是否显示关闭按钮
 * @param {number} [options.offset] - 消息距离顶部的偏移量（px）
 * @param {HTMLElement|string} [options.appendTo] - 消息容器的挂载目标，可以是 DOM 元素或 CSS 选择器字符串
 * @returns \{ close: () => void } close: 关闭消息的函数
 */
export function message(options) {
  if (!(typeof options === 'object' && !!options && 'message' in options)) return
  const { message, type = 'info', duration = 3000, customClass, showClose = false, offset = 20, appendTo } = options
  // color处理
  const color = { info: '#909399', primary: '#409EFF', success: '#67C23A', warning: '#E6A23C', error: '#F56C6C' }[type] || '#909399'
  // appendTo处理
  let msgRootEl = document.body
  if (appendTo instanceof HTMLElement) {
    msgRootEl = appendTo
  } else if (typeof appendTo === 'string') {
    try {
      const qryEl = document.querySelector(appendTo)
      if (qryEl instanceof HTMLElement) msgRootEl = qryEl
    } catch {
      console.warn('"appendTo"无效')
    }
  }
  // 生成message元素
  const wrapEl = document.createElement('div')
  if (customClass && typeof customClass === 'string') wrapEl.className = `msg-js ${customClass}`
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
  wrapEl.setAttribute('role', 'alert')
  wrapEl.setAttribute('aria-live', 'assertive')
  const msgEl = document.createElement('span')
  msgEl.textContent = message
  wrapEl.appendChild(msgEl)
  msgRootEl.appendChild(wrapEl)
  // 进场动画
  wrapEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 100, fill: 'forwards' })

  // 定时移除 & 点击移除，hover重置计时
  const removeFn = () => {
    wrapEl.onmouseenter = null
    wrapEl.onmouseleave = null
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
  const close = () => {
    clearTimeout(timer)
    removeFn()
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
    closeEl.setAttribute('aria-label', '关闭消息')
    closeEl.onclick = close
    wrapEl.appendChild(closeEl)
  }

  return { close }
}
