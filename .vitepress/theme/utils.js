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
