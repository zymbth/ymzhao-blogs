---
description: 梳理一下将typescript应用到项目中的步骤和关键点
head:
  - - meta
    - name: keywords
      content: typescript,ts,项目应用
created: '2025-05-09'
isDraft: 't'
---

# TS项目应用梳理

> 文档
>
> - [TypeScript 官网 v5](https://www.typescriptlang.org/zh/)：官方文档，含部分中文翻译。
> - [TypeScript 中文网 v5](https://ts.nodejs.cn/)：中文翻译，有广告，还有全屏广告。这里推荐一个[油猴](https://www.tampermonkey.net/)脚本[TypeScript中文网广告隐藏](https://greasyfork.org/zh-CN/scripts/536028-typescript%E4%B8%AD%E6%96%87%E7%BD%91%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F)

本文不是ts教程或学习路线，而是从应用的角度梳理一下将typescript应用到项目中的步骤和关键点。不适合无独立项目经验的新手。

下面以一个最小化配置实现vue项目的typescript具体应用为例。

## 安装

`npm install -D typescript @vue/tsconfig`

`typescript`是必要依赖，后者是是vue官方提供的ts配置文件，我们可以在下一步中继承该配置以快速应用于vue项目。除此之外ts官方提供了一些配置[TSConfig bases - Table of TSConfigs](https://github.com/tsconfig/bases?tab=readme-ov-file#table-of-tsconfigs)

::: details @vue/tsconfig/tsconfig.json

```json
{
  "compilerOptions": {
    "noEmit": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "moduleDetection": "force",
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "noImplicitThis": true,
    "strict": true,
    "verbatimModuleSyntax": true,
    "target": "ESNext",
    "useDefineForClassFields": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
  }
}
```

:::

## ts配置

> 参考
>
> - [What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
> - [tsconfig.json - 旧版中文文档](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
> - [tsconfig - 配置选项](https://www.typescriptlang.org/tsconfig/)

上一步中如果有合适的tsconfig，可在项目的tsconfig中继承它

```json
{
  "extends": "@vue/tsconfig/tsconfig.json",
  "include": ["src/**/*.ts", "src/**/*.vue", "src/**/*.tsx", "types/**/*.d.ts"],
  "exclude": ["node_modules", "**/*.spec.ts"],
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

这里的`@vue/tsconfig/tsconfig.json`即`./node_modules/@vue/tsconfig/tsconfig.json`

上面的属性值是ts最基本的配置：

- `include`：决定哪些文件会被 TypeScript 编译器处理，使用 glob 模式匹配文件路径。
- `exclude`：决定哪些文件不会被 TypeScript 编译器处理，使用 glob 模式匹配文件路径。

::: details files，include，exclude

`"files"`指定一个包含相对或绝对文件路径的列表。 `"include"`和`"exclude"`属性指定一个文件glob匹配模式列表。 支持的glob通配符有：

- `*` 匹配0或多个字符（不包括目录分隔符）
- `?` 匹配一个任意字符（不包括目录分隔符）
- `**/` 递归匹配任意子目录

如果一个glob模式里的某部分只包含*或.*，那么仅有支持的文件扩展名类型被包含在内（比如默认.ts，.tsx，和.d.ts， 如果 allowJs设置能true还包含.js和.jsx）。

更多细节及优先级查看[tsconfig.json - 旧版中文文档](https://www.tslang.cn/docs/handbook/tsconfig-json.html)

:::

`compilerOptions`是ts的编译选项，其中：

- `baseUrl`：指定了ts的基础目录，用于解析没有提供完整路径的模块名称
- `paths`：指定ts对于某些引用的路径
- `typeRoots`：指定了包含类型声明文件的**目录**列表
- `types`：指定类型声明**文件**列表

::: details @types，typeRoots和types

默认所有*可见的*"@types"包会在编译过程中被包含进来。 `node_modules/@types`文件夹下以及它们子文件夹下的所有包都是*可见的*； 也就是说， `./node_modules/@types/`，`../node_modules/@types/`和`../../node_modules/@types/`等等。

如果指定了`typeRoots`，只有`typeRoots`下面的包才会被包含进来。

如果指定了`types`，只有被列出来的包才会被包含进来。

指定`"types": []`来禁用自动引入`@types`包。

注意，自动引入只在你使用了全局的声明（相反于模块）时是重要的。 如果你使用 `import "foo"`语句，TypeScript仍然会查找`node_modules`和`node_modules/@types`文件夹来获取`foo`包。

:::
