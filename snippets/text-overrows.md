---
description: 文本多行溢出样式
head:
  - - meta
    - name: keywords
      content: text,overflow,多行,line-clamp,-webkit-box
created: '2024-07-29'
---

# 文本多行溢出样式

文本溢出样式很简单：

```css
.demo {
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

多行溢出样式如何设置呢？

::: code-group

```scss [mixin.scss]
@mixin limit-rows($lines, $line-height) {
  @supports (display: -webkit-box) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: $lines;
    overflow: hidden;
  }
  @supports not (display: -webkit-box) {
    height: calc($line-height * $lines);
    overflow: hidden;
  }
}
```

```scss [index.scss]
@import './mixin.scss';

.limit-row-2 {
  @include limit-rows(2, 1.15em);
  font-size: 14px;
  line-height: 1.15em;
}
```

:::

使用了 `@supports` 查询浏览器是否支持 `display: -webkit-box`，不支持时仅做隐藏处理，也可使用js优化。
