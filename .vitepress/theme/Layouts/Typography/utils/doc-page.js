/**
 * 滚动到页面中指定锚点的位置
 * 如果 URL 中存在锚点，则会平滑滚动到该锚点对应的元素位置
 */
export function jumpToHash(id) {
  if (!id) id = window.location.hash.split('#')[1]
  const heading = document.getElementById(decodeURIComponent(id))
  if (!heading) return
  heading.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
