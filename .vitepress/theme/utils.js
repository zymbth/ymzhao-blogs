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

export function shining(message, color = 'rgb(50, 177, 108)', fontSize = 'xxx-large') {
  if (!message) return
  const i = document.createElement('span')
  i.textContent = message
  i.style.cssText = `
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

export function message(message, type = 'info', duration = 3000) {
  if (!message) return
  const color = { info: '#909399', primary: '#409EFF', success: '#67C23A', warning: '#E6A23C', error: '#F56C6C' }[type] || '#909399'
  const wrapEl = document.createElement('div')
  wrapEl.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    max-width: 80%;
    padding: 6px 24px 6px 10px;
    color: ${color};
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid ${color};
    background-color: ${color}33;
    opacity: 0
    transform: translateX(-50%);
    z-index: 2002;
  `
  const i = document.createElement('span')
  i.textContent = message
  wrapEl.appendChild(i)
  document.body.appendChild(wrapEl)
  wrapEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 100, fill: 'forwards' })

  const removeFn = () => {
    wrapEl.animate(
      [
        { top: '20px', opacity: 1 },
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

  const closeEl = document.createElement('span')
  closeEl.textContent = '+'
  closeEl.style.cssText = `
    position: absolute;
    top: 50%;
    right: 8px;
    font-size: 20px;
    transform: translateY(-50%) rotate(45deg);
    cursor: pointer;
  `
  closeEl.onclick = () => {
    clearTimeout(timer)
    removeFn()
  }
  wrapEl.appendChild(closeEl)
}
