---
description: vue项目中使用ts
head:
  - - meta
    - name: keywords
      content: vue,typescript
created: '2024-10-31'
isDraft: 't'
---

# vue 项目中使用 ts

官方文档

> [TypeScript 工具类型](https://cn.vuejs.org/api/utility-types.html)
>
> [TypeScript 与选项式 API](https://cn.vuejs.org/guide/typescript/options-api#typing-component-props)

## vue 官方定义的 TypeScript 工具类型

### `PropType<T>`

类型定义可查阅[源码](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/componentProps.ts#L70-L81)

```ts
export type PropType<T> = PropConstructor<T> | (PropConstructor<T> | null)[]

type PropConstructor<T = any> =
  | { new (...args: any[]): T & {} }
  | { (): T }
  | PropMethod<T>

type PropMethod<T, TConstructor = any> = [T] extends [
  ((...args: any) => any) | undefined,
] // if is function with args, allowing non-required functions
  ? { new (): TConstructor; (): T; readonly prototype: TConstructor } // Create Function like constructor
  : never
```

::: details [AI问答：解释PropType及其在vue defineProps宏中的作用]

- `PropType<T>`:
  - 这个类型代表Vue.js中prop的类型。
  - 它可以是`PropConstructor<T>`或`PropConstructor<T> | null`的数组。
  - `PropConstructor<T>`是一个表示prop类型构造函数的类型。
  - `| (PropConstructor<T> | null)[]`部分允许prop可以是单个构造函数或构造函数(或`null`)的数组,这在prop可以接受多种类型时很有用。

- `PropConstructor<T>`:
  - 这个类型代表prop类型的构造函数。
  - 它可以是以下三种之一:
    - `{ new (...args: any[]): T & {} }`: 一个类构造函数,接受任意数量的参数,并返回一个扩展自`T`的对象。
    - `{ (): T }`: 一个返回`T`类型值的函数。
    - `PropMethod<T>`: 一个用于处理prop是函数的特殊类型。

- `PropMethod<T, TConstructor>`:
  - 这个类型用于处理prop是函数的情况。
  - 如果prop是一个带参数的函数(即`((...args: any) => any) | undefined`),那么`PropMethod<T>`表示一个函数式构造函数,其中`TConstructor`类型是函数prop的构造函数。
  - 如果prop不是一个函数,`PropMethod<T>`的值为`never`,意味着类型无效。

在`defineProps`宏中,你可以使用这些类型来定义Vue.js组件接受的prop类型。例如:

```ts
interface Props {  
  myProp: PropType<string>;  
  myOptionalProp?: PropType<number | null>;  
  myFunctionProp?: PropType<(arg: string) => number>;  
}  

const { myProp, myOptionalProp, myFunctionProp } = defineProps<Props>();  
```

在这个例子中,`myProp`是一个必填的`string`类型prop,`myOptionalProp`是一个可选的`number`或`null`类型prop,`myFunctionProp`是一个可选的接受`string`参数并返回`number`的函数类型prop。

`PropType<T>`和`PropConstructor<T>`类型帮助TypeScript确保传递给Vue.js组件的props具有正确的类型,提供更好的类型安全性,并在编译时捕获潜在的错误。

:::
