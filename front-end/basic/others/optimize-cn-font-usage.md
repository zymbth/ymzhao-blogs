---
description: 优化前端项目中文字体包的使用
head:
  - - meta
    - name: keywords
      content: font,chinese,compress,optimize,split
created: '2026-10-12'
---

# 优化前端项目中文字体包的使用

中文字体包动辄10M+，使用上不够灵活，甚至可能会直接影响到网站性能。

## 一、基本概念

引入字体包，创建一个自定义字体并使用：

```css
@font-face {
  font-family: 'Noto Sans SC Regular';
  src: url('./font/SourceHanSansSC-Regular.otf');
}

body {
  font-family: 'Noto Sans SC Regular';
}
```

[@font-face](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/At-rules/@font-face) 定义一个字体，再在需要的地方使用。

### 字体显示时间线（The Font Display Timeline）

当用户代理**首次**尝试在页面上使用某个已下载的字体时，该字体的下载计时器（font download timer）就会开始计时。这个计时器会经历三个阶段，这些阶段决定了使用该字体的元素在渲染时的行为。

- 字体阻塞周期(font block period)：自定义字体尚未加载时，浏览器会构造一个匿名的后备字体。若在此周期内成功加载，则正常使用
- 字体交换周期(font swap period)：自定义字体在上一周期结束时仍未加载，时间轴进入交换周期，浏览器使用真实的后备字体
- 字体失败周期(font failure period)：若自定义字体在进入本周期时仍未加载，任何尝试使用它的元素都将使用后备字体，否则，正常使用此字体。

> 参考文档 [The Font Display Timeline](https://drafts.csswg.org/css-fonts-4/#font-display-timeline)
>
> - 后备字体(fallback font face) 指元素第一后备字体，元素 `font-family` 中第一个已加载、真实可用的字体
> - 匿名的后备字体(invisible fallback font face) 基于元素第一后备字体的度量(metrics)创建，但其字形不可见，只为保留**布局占位**，保持视觉一致性

### 控制字体显示

浏览器加载字体和上面三个周期是独立的两条轴线。实际加载字体的速度取决于字体大小与网络，而三个周期是固定的（用户代理配置）。

`@font-face` 的 [font-display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/At-rules/@font-face/font-display) 属性决定了一个 `@font-face` 在不同的下载时间和可用时间下是如何展示的。font-display 属性值：

- `auto`：默认值，字体显示策略由用户代理定义，一般类似于 block。
- `block`：为字体提供一个短暂的阻塞周期和无限的交换周期。
- `swap`：为字体提供一个非常小的阻塞周期和无限的交换周期。
- `fallback`：为字体提供一个非常小的阻塞周期和短暂的交换周期。
- `optional`：为字体提供一个非常小的阻塞周期，并且没有交换周期。

::: details font-display 策略

font-display 提供的是策略框架，而非精确的时间标准，浏览器可以自行设置每个策略下不同字体显示周期的时间。例如，[font-display-desc](https://drafts.csswg.org/css-fonts-4/#font-display-desc) 中建议 `block` 策略设置 3s 阻塞周期，swap 100ms 阻塞周期，fallback 100ms 阻塞周期 3s 交换周期。

假设字体包很大，加载时间为20秒：

- block 策略下可能会看到最多3秒的无字和17秒的后备字体，之后才替换为该字体
- swap 策略下可能会看到最多100毫秒的无字和20秒的后备字体，之后才替换为该字体
- fallback 策略下可能会看到最多100毫秒的无字，之后一直显示后备字体（20秒远大于3秒交换周期）
- optional 策略下可能会看到最多100毫秒的无字，之后一直显示后备字体（没有交换周期，直接显示后备字体）

由于字体下载计时器是在首次尝试使用字体时开始，理论上应该和页面渲染的起点一致。但 js 执行阻塞或者css复杂计算等因素可能会导致在视觉上，在首屏**可见**时，字体的下载计时器已经开始了，上面示例中的预估时间可能会因这个提前而缩短。

:::

## 二、字体裁剪

对于静态网站等文字固定的场景，全量引入字体包是多余了，完全可以裁剪。

参考工具，如 [font-spider](https://github.com/aui/font-spider/blob/master/README-ZH-CN.md)

也可以使用在线裁剪方式，如 [WebFont 在线字体裁剪](https://webfont.shenzilong.cn/)

> 适合文字固定的场景，不灵活，局限性比较大

## 三、字体分包

[cn-font-split：中文 Web Font 切割工具](https://github.com/Konghayao/cn-font-split)：通过高性能的各种技术将庞大的字体包拆分为适合网络分发的版本。[在线使用](https://chinese-font.netlify.app/zh-cn/online-split/)

一个字体在经过在线字体分包或者代码工具分包后，会得到成品文件夹，里面包含了细分 woff2 文件、CSS 索引文件、reporter.json 等静态文件。保留 woff2 文件与 result.css，拷贝到项目中，引入该样式文件，使用字体“Noto Sans SC Regular”即可。

result.css 示例：

```css
@font-face {
  font-family: "Noto Sans SC Regular";
  src: local("Noto Sans SC Regular"), url("./a71ca8d16cedd3264d65335daca6b4e5.woff2")format("woff2");
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  unicode-range: U+2F840,U+2F846,U+2F852,U+2F862,U+2F86D,U+2F873,U+2F877-2F878,U+2F884,U+2F894,U+2F899-2F89A,U+2F8A6,U+2F8AC,U+2F8B2,U+2F8B6,U+2F8CD,U+2F8D3,U+2F8DB-2F8DC,U+2F8E1,U+2F8E5,U+2F8EA,U+2F8ED,U+2F8FC,U+2F903,U+2F90B,U+2F90F,U+2F91A,U+2F920-2F921,U+2F945,U+2F947,U+2F96C,U+2F994-2F995,U+2F9B2,U+2F9BC,U+2F9D0,U+2F9D4,U+2F9DE-2F9DF,U+2F9F4;
}
@font-face {
  font-family:"Noto Sans SC Regular";
  src:local("Noto Sans SC Regular"),url("./88b38f76deff1674144931f158b49f26.woff2")format("woff2");
  font-style:normal;
  font-display:swap;
  font-weight:400;
  unicode-range:U+2B696,U+2B6AD,U+2B6ED,U+2B746,U+2B751,U+2B753,U+2B75A,U+2B75C,U+2B765,U+2B776-2B777,U+2B77C,U+2B782,U+2B789,U+2B78B,U+2B78E,U+2B794,U+2B7A9,U+2B7AC,U+2B7AF,U+2B7BD,U+2B7C5,U+2B7C9,U+2B7CF,U+2B7D2,U+2B7D8,U+2B7E6,U+2B7F0,U+2B7F9,U+2B7FC,U+2B806,U+2B80A,U+2B80D,U+2B817,U+2B81A,U+2B81C,U+2B8B8,U+2BAC7,U+2BB5F,U+2BB62,U+2BB7C,U+2BB83,U+2BC1B,U+2BD77,U+2BD87,U+2BDF7,U+2BE29,U+2C029-2C02A,U+2C0A9,U+2C0CA,U+2C1D5,U+2C1D9,U+2C1F9,U+2C27C,U+2C288,U+2C2A4,U+2C317,U+2C35B,U+2C361,U+2C364,U+2C488,U+2C494,U+2C497,U+2C542,U+2C613,U+2C618,U+2C621,U+2C629,U+2C62B-2C62D,U+2C62F,U+2C642,U+2C64A-2C64B,U+2C72C,U+2C72F,U+2C79F,U+2C7C1,U+2C7FD,U+2C8D9,U+2C8DE,U+2C8E1,U+2C8F3,U+2C907,U+2C90A,U+2C91D,U+2CA02,U+2CA0E,U+2CA7D,U+2CAA9,U+2CB29,U+2CB2D-2CB2E,U+2CB31,U+2CB38-2CB39,U+2CB3B,U+2CB3F,U+2CB41,U+2CB4A,U+2CB4E,U+2CB5A-2CB5B,U+2CB64,U+2CB69,U+2CB6C,U+2CB6F,U+2CB73,U+2CB76,U+2CB78,U+2CB7C,U+2CBB1,U+2CBBF-2CBC0,U+2CBCE,U+2CC56,U+2CC5F,U+2CCF5-2CCF6,U+2CCFD,U+2CCFF,U+2CD02-2CD03,U+2CD0A,U+2CD8B,U+2CD8D,U+2CD8F-2CD90,U+2CD9F-2CDA0,U+2CDA8,U+2CDAD-2CDAE,U+2CDD5,U+2CE18,U+2CE1A,U+2CE23,U+2CE26,U+2CE2A,U+2CE7C,U+2CE88,U+2CE93,U+2F804,U+2F80F,U+2F815,U+2F818,U+2F81A,U+2F822,U+2F825,U+2F828,U+2F82C,U+2F833,U+2F83B,U+2F83F;
}
@font-face {
  font-family: "Noto Sans SC Regular";
  src: local("Noto Sans SC Regular"), url("./8d27884cc7280d4313874753e5ae1ebc.woff2")format("woff2");
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  unicode-range: U+29810,U+29857,U+298A4,U+298C6,U+298D1,U+298EA,U+298F1,U+298FA,U+29903,U+29905,U+2992F,U+29945,U+29947-29949,U+2995D,U+2996A,U+2999D,U+299C3,U+299C9,U+29A28,U+29A4D,U+29A72,U+29B05,U+29B0E,U+29BD5,U+29C73,U+29CAD,U+29D3E,U+29D4B,U+29D5A,U+29D7C,U+29D98,U+29D9B,U+29DDB,U+29DF6,U+29E06,U+29E15,U+29E2D,U+29E3D,U+29E49,U+29E68,U+29E8A,U+29EAC,U+29EB0,U+29EC3-29EC4,U+29EDB,U+29EE9,U+29EF8,U+29F23,U+29F30,U+29F7E,U+29F83,U+29F8C,U+29FB7,U+29FCE,U+29FD7,U+29FDE,U+2A014,U+2A01A,U+2A02F,U+2A082,U+2A087,U+2A0B9,U+2A0E1,U+2A0ED,U+2A0F3,U+2A0F8-2A0F9,U+2A0FE,U+2A107,U+2A123,U+2A133-2A134,U+2A150,U+2A190,U+2A192-2A193,U+2A1AB,U+2A1B4-2A1B5,U+2A1DF,U+2A1F5,U+2A220,U+2A233,U+2A293,U+2A29F,U+2A2B2,U+2A2B4,U+2A2B6,U+2A2BA,U+2A2BD,U+2A2DF,U+2A2FF,U+2A351,U+2A38C,U+2A3A9,U+2A3ED,U+2A434,U+2A437,U+2A45B,U+2A5C6,U+2A5CB,U+2A5F1,U+2A601-2A602,U+2A61A,U+2A632,U+2A64A,U+2A65B,U+2A6A9,U+2A6B2,U+2A7DD,U+2A8FB,U+2A917,U+2A9E6,U+2AA30,U+2AA36,U+2AA58,U+2ADFF,U+2AFA2,U+2B127-2B128,U+2B137-2B138,U+2B1ED,U+2B300,U+2B363,U+2B36F,U+2B372,U+2B37D,U+2B404,U+2B410,U+2B413,U+2B461,U+2B4E7,U+2B4EF,U+2B4F6,U+2B4F9,U+2B50D-2B50E,U+2B536,U+2B5AE-2B5AF,U+2B5B3,U+2B5E7,U+2B5F4,U+2B61C-2B61D,U+2B626-2B628,U+2B62A,U+2B62C,U+2B695;
}
/* ... */
```

中文分片子集化 + 转 woff2，配合 `unicode-range` 按需加载，实际首屏只需下载几百KB～2MB（浏览器只会下载当前页面实际渲染的文字所命中的分片）。
