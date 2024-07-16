---
description: 导出svg为图片，可设置导出格式与图片质量
head:
  - - meta
    - name: keywords
      content: svg,导出,export,image,图片
---

# 导出svg为图片

```js
/**
 * @param {string|Element} val css选择器或元素
 * @param {string} [filename] 文件名
 * @param {Object} [configs] { imageType, quality }
 * @param {string} [configs.imageType] 导出图片MIME类型，['image/png'|'image/jpeg'|'image/gif'|'image/bmp'|'image/webp']
 * @param {number} [configs.quality] 图片质量
 * @example
 * import useExportSvgToImg from '@/utils/export-svg-to-image'
 *
 * useExportSvgToImg('.heatmap-chart svg', '', { imageType: 'image/jpeg' })
 */
export default (val, filename, { imageType, quality, fillStyle = 'white' } = {}) => {
  let svgEl
  switch (myTypeof(val)) {
    case 'string':
      svgEl = document.querySelector(val)
      break
    case 'element':
      svgEl = val
      break
    default:
      throw new Error('Failed to download svg as png, please input css selector or certain element')
  }
  if (!['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp'].includes(imageType))
    imageType = 'image/png'
  let imageQuality = 0.92
  if (myIsNumber(quality) && quality > 0 && quality <= 1) imageQuality = Number(quality)

  const svgData = new XMLSerializer().serializeToString(svgEl)
  // btoa: deprecated — Use buf.toString('base64') instead.
  // const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)))
  const svgDataBase64 = Buffer.from(svgData, 'utf-8').toString('base64')

  const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`

  const img = new Image()
  img.src = svgDataUrl
  img.onload = function () {
    const width = svgEl.getAttribute('width')
    const height = svgEl.getAttribute('height')
    const canvas = document.createElement('canvas')
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)

    const context = canvas.getContext('2d')
    if (imageType !== 'image/png' && fillStyle) {
      context.fillStyle = fillStyle
      context.fillRect(0, 0, width, height) // 填充整个画布
    }
    context.drawImage(img, 0, 0, width, height)

    var aLink = document.createElement('a')
    aLink.style.display = 'none'
    // aLink.href = canvas.toDataURL('image/png', 1.0)
    aLink.href = canvas.toDataURL(imageType, imageQuality)
    aLink.download = filename ? String(filename) : generateUUID()
    document.body.appendChild(aLink)
    aLink.click()
    document.body.removeChild(aLink)
  }
}

function myTypeof(data) {
  return data instanceof Element
    ? 'element'
    : Object.prototype.toString
        .call(data)
        .replace(/\[object\s(.+)\]/, '$1')
        .toLowerCase()
}
function myIsNumber(val) {
  if (isNaN(val) || val === true) return false
  if (!val && val !== 0) return false
  if (String(val).trim().length === 0) return false
  return true
}
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
```
