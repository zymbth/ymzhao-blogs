---
description: Vue深度选择器使用总结
head:
  - - meta
    - name: keywords
      content: vue,deep,v-deep,:deep(),深度选择器
created: '2025-07-03'
---

# Vue深度选择器使用总结

## 简介

deep语法经过几次更新，官方最新推荐使用伪类 `:deep()`

## Vue局部样式

讲深度选择器就绕不开Vue的局部样式的问题，先来看看Vue的局部样式

Vue组件在渲染后，它所有的同步生成的元素都会携带上一个唯一的属性标识，例如：`data-v-442d71db`

::: code-group

```vue [vue组件]
<template>
  <div class="root-el">
    <span>TEST</span>
    <!-- 异步插入一个元素 -->
    <span>异步插入</span>
  </div>
</template>
<style scoped>
span {
  color: red;
}
</style>
```

```html [渲染后的组件元素]
<div class="root-el" data-v-442d71db>
  <span data-v-442d71db>TEST</span>
  <!-- 异步插入一个元素 -->
  <span>异步插入</span>
</div>
```

```css [实际生成的样式]
span[data-v-442d71db] {
  color: red;
}
```

:::

`scoped` 通过组件属性选择器将样式限制在组件内。父组件、子组件以及其他外部生成的元素都不属于该组件，未被添加组件属性标识。

`:deep()` 深度选择器可以将样式应用于子组件，具体用法看下面。

## 深度选择器

接上一节示例，假设vue组件的属性标识为 `data-v-442d71db`，下面的示例中省去具体样式，"->" 表示编译

- `span` -> `span[data-v-442d71db]`
- `:deep(span)` -> `[data-v-442d71db] span`

局部样式要求css选择器对应的元素**本身**含组件属性标识；而 `:deep()` 可近似看作是目标元素的**上级**选择器。使用一个多级选择器示范：

- `.root-el span` -> `.root-el span[data-v-442d71db]`
- `.root-el :deep(span)` -> `.root-el[data-v-442d71db] span`

上节示例中包含两个 `span` 元素，一个是外部生成的。`.root-el span` 仅能应用于第一个 `span` 而 `.root-el :deep(span)` 可以应用于两个 `span` 。

## 更多示例

- `.any-el :deep(span)` -> `.any-el[data-v-442d71db] span`：`:deep()`前面的空格 ≠ css选择器的空格，有没有都不影响编译结果
- `.any-el :deep(>span)` -> `.any-el[data-v-442d71db] > span`: `:deep()`参数可以是后代选择器等，例如 `:deep(> p:not(:last-of-type))`
- `.any-el > :deep(span)` -> `.any-el[data-v-442d71db] >  span`: 跟上面一样，但**不推荐**这种写法

## 错误示例

- 多个选择器只有**第一个**生效：

`.any-el :deep(>span, >svg)` -> `.any-el[data-v-442d71db] > span`

- 将根元素加入深度选择器，编译出的样式是无意义的：

`:deep(.root-el .target-el)` -> `[data-v-442d71db] .root-el .target-el`

- 深度选择器要分开写：

`.any-el:deep(span), .any-el:deep(p) {color:red}`

↓↓↓

`[data-v-442d71db]:is(.any-el:deep(span), .any-el:deep(p)) {color:red}`

此例的编译结果为无效的css（`:deep()`伪类非css原生伪类，需经过 PostCSS 转换）

- 深度选择器目标元素与根元素同级：

由于Vue3允许组件无根元素，当目标元素与根元素同级时，深度选择器无效（平级无深度）。可以包裹一个根元素以添加深度；或者移出组件，在父组件中分别引入使用并设置样式。

### Sass示例

深度选择器样式内部可嵌套多级选择器，但不可使用多个选择器

::: code-group

```scss [✅有效]
:deep(.class1) {
  .class2 {color:red}
  .class3 {color:red}
}
```

```scss [❌无效]
:deep(.class1) {
  .class2, .class3 {color:red}
}
```

:::

可使用`&`, `mixin`

::: code-group

```scss [scoped styles]
@mixin color-red {
  color: red;
}

:deep(.class1) {
  @include color-red;
  &.class2 {
    color: yellow;
  }
  &:not(:last-child) {
    margin-right: 3px;
  }
  .class3 {
    color: green;
  }
  > .class4 {
    color: blue;
  }
}
```

```css [编译输出]
[data-v-442d71db] .class1 {
  color: red;
}
[data-v-442d71db] .class1.class2 {
  color: yellow;
}
[data-v-442d71db] .class1:not(:last-child) {
  margin-right: 3px;
}
[data-v-442d71db] .class1 .class3 {
  color: green;
}
[data-v-442d71db] .class1 > .class4 {
  color: blue;
}
```

:::
