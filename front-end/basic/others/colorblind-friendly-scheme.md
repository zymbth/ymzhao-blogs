---
description: 选择色盲友好配色方案
head:
  - - meta
    - name: keywords
      content: colorblind-friendly,scheme,palette,色盲友好,配色
created: '2025-04-18'
---

# 色盲友好配色方案

> [色盲 - Wiki](https://zh.wikipedia.org/zh-cn/%E8%89%B2%E7%9B%B2)

色盲对颜色的辨别能力低于常人，网站中数据可视化比较多时，色盲友好配色方案有助于提高色盲用户的使用体验。

## 模拟色盲

如何查看配色在色盲模式下的表现？

火狐浏览器调试模式下，选择“无障碍环境(Accessibility)”，点击“模拟(Simulate)”即可模拟各种色盲

谷歌浏览器可安装浏览器插件[Let's get color blind](https://chromewebstore.google.com/detail/bkdgdianpkfahpkmphgehigalpighjck?utm_source=item-share-cb)模拟

## 配色方案

> 参考
>
> - [Coloring for Colorblindness](https://davidmathlogic.com/colorblind/)
> - [Color Universal Design (CUD)](https://jfly.uni-koeln.de/color/)
> - [Data Visualization with Flying Colors](https://thenode.biologists.com/data-visualization-with-flying-colors/research/)
> - [IBM Color Blind Safe Palette](https://lospec.com/palette-list/ibm-color-blind-safe)
> - [IBM Color Blind Safe Palette](https://www.color-hex.com/color-palette/1044488)

<script setup>
import { shining, copyText } from '../../../.vitepress/theme/utils.js'

const colorBlindSafePalette = {
  IBM: [
    'rgb(100, 143, 255)',
    'rgb(120, 94, 240)',
    'rgb(220, 38, 127)',
    'rgb(254, 97, 0)',
    'rgb(255, 176, 0)',
  ],
  Wong: [
    'rgb(0, 0, 0)',
    'rgb(230, 159, 0)',
    'rgb(86, 180, 233)',
    'rgb(0, 158, 115)',
    'rgb(240, 228, 66)',
    'rgb(0, 114, 178)',
    'rgb(213, 94, 0)',
    'rgb(204, 121, 167)',
  ],
  Tol: [
    'rgb(51, 34, 136)',
    'rgb(17, 119, 51)',
    'rgb(68, 170, 153)',
    'rgb(136, 204, 238)',
    'rgb(221, 204, 119)',
    'rgb(204, 102, 119)',
    'rgb(170, 68, 153)',
    'rgb(136, 34, 85)',
  ],
}

function copyToClipboard(colors) {
  const txt = Array.isArray(colors) && colors.length > 0 && `[${colors.map(c => `'${c}'`).join(',')}]`
  if(!txt) return
  copyText(txt)
  shining('已复制')
}
</script>

<ClientOnly>
  <div class="flex flex-col items-center gap-3">
    <div
      class="p-2 shadow-md hover:shadow-lg inline-block"
      v-for="(palette, name) in colorBlindSafePalette"
      :key="name"
      @click="copyToClipboard(palette)">
      <h4 class="text-center !mt-0">{{ name }}</h4>
      <div class="flex flex-wrap justify-center cursor-copy">
        <div class="w-16 h-16" v-for="c in palette" :key="c" :style="{ background: c }" />
      </div>
    </div>
  </div>
</ClientOnly>
