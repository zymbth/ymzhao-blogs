---
description: 实践：新手使用 ESLint 进行项目代码检测与格式化
head:
  - - meta
    - name: keywords
      content: ESLint,prettier,代码分析,格式化,换行符
created: '2023-09-12'
---

# 实践：新手使用 ESLint 进行项目代码检测与格式化

## 前言

::: warning

本文展示 ESLint / Prettier 的基本配置与应用，甚至未包括 ts 相关规则。

最小化的代码风格与格式化实践请参考[@antfu/eslint-config](https://github.com/antfu/eslint-config)，大佬整合的 ESLint 配置，可零配置使用（默认风格）。项目需要诸如 ts, vue, unocss 等规则的支持可在配置中启用，无需手动安装相关插件。当然，它允许自定义规则以覆盖默认规则。

不仅如此，大佬还提供了一个[在线配置查询工具](https://eslint-config.antfu.me/configs)以及[配置可视化工具](https://github.com/eslint/config-inspector)。

:::

不使用 ESLint 可能的原因：部分新手对代码风格没有概念，又或者是被繁多的配置劝退；满屏的错误。

统一代码风格与格式化是一个开头难，但一次配置永久享受的事情。

初接触时，疑问是非常多的，例如，如何安装使用？有哪些规则？如何配置？海量的错误与警告报告如何处理？如何在已有项目下安全应用？等等

> 本文远非对 ESLint / Prettier 的深度使用与剖析，而是讲述新手以最小代价、最快、最高效地应用为目的，借助 ESLint & Prettier 实现项目代码自动检测与格式化的过程。
>
> 具体配置因人而异，示例仅作参考。

## 一、简介

本文使用 ESLint & Prettier 进行代码检测与格式化

> 参考
>
> [ESLint 中文官网](https://zh-hans.eslint.org/)
>
> [ESLint 英文官网](https://eslint.org/)
>
> [Prettier 中文官网](https://www.prettier.cn/)
>
> [Prettier 英文官网](https://prettier.io/)

如果你对这两个工具尚很陌生，请花点时间访问下它们的官网，了解下它们的功能、核心概念及基本配置。

先了解下 ESLint 吧，官网超大号字体告诉你，它的作用是“检测并修复 JavaScript 代码中的问题”，更详细一点的描述是

> “ESLint 是一个根据方案识别并报告 ECMAScript/JavaScript 代码问题的工具，其目的是使代码风格更加一致并避免错误。”

这句话非常到位，请细读。目的和作用我们知道了，复杂的是**方案**。

新手一般也不会需要复杂的方案。ESLint 可以使用第三方格式化工具，这里我们选择最常用的 Prettier。除了 Prettier 外，ESLint 还可以使用其它的格式化工具。

::: details ESLint VS Prettier

ESLint 和 Prettier 都是用于改善代码质量和统一代码风格的工具,但它们的作用和侧重点有所不同。下面是它们的简要介绍和对比:

- ESLint:
  - 是一个 JavaScript 代码检查工具,可以帮助开发者发现和修复代码中的语法错误、风格问题和潜在的问题。
  - ESLint 通过一系列的规则来检查代码,并且可以自定义这些规则。它支持插件来扩展规则集,并且可以集成到许多编辑器和构建工具中。
  - ESLint 主要关注于代码的语法和潜在的逻辑问题,可以帮助开发者编写更加健壮和可维护的代码。
- Prettier:

  - 是一个代码格式化工具,它可以自动格式化代码,使其符合一致的风格。
  - Prettier 专注于代码的格式化,如缩进、换行、引号等,而不会检查代码的语法和逻辑。
  - Prettier 的目标是让所有开发者的代码都遵循相同的风格规范,从而提高代码的可读性和可维护性。

- 对比:
  - 作用侧重点不同: ESLint 主要关注代码质量和潜在问题,而 Prettier 关注代码格式化和风格统一。
  - 使用方式不同: ESLint 需要定义规则,Prettier 则是自动格式化,不需要特殊配置。
  - 集成能力不同: ESLint 可以集成到更多的工具和编辑器中,而 Prettier 的集成相对较少。
  - 解决问题不同: ESLint 可以发现和修复代码中的错误和问题,而 Prettier 只能格式化代码,不能修复问题。

通常情况下,开发团队会同时使用 ESLint 和 Prettier 来确保代码的质量和风格统一。ESLint 负责代码质量,Prettier 负责代码格式化,两者相互配合,共同提高代码的可维护性。

:::

## 二、安装

可以按照官网指引安装。我们目的明确，可以直接安装相应的包：

`eslint`

`prettier`

`eslint-config-prettier`

`eslint-plugin-prettier`

`eslint-plugin-only-warn`：可以使用 ESLint 插件 [eslint-plugin-only-warn](https://github.com/bfanger/eslint-plugin-only-warn) 让代码不会因为 ESLint 报告错误。等待完成配置后再移除它。

使用 npm/yarn/pnpm 或其他包管理器安装上述开发依赖：

`npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-only-warn`

## 三、配置

本文配置分为两类：一是代码格式化，一是行尾符规范。行尾符平时不起眼，一旦与方案不符，它会影响代码的每一行，逼死强迫症。

### 配置 ESLint

参考 [配置 ESLint](https://zh-hans.eslint.org/docs/latest/use/configure/)

> 你可以根据你的情况定制 ESLint，它十分灵活且具可配置性。你可以关闭全部规则，只运行基本的语法验证，或者也可以根据项目需要，一起使用合适的捆绑规则与自定义规则。主要有两个配置 ESLint 的方法：
>
> 1. 配置注释 - 在文件中使用 JavaScript 注释直接嵌入配置信息
> 2. 配置文件 - 使用 JavaScript、JSON 或 YAML 文件指定整个目录及其所有子目录的配置信息。可以是 [.eslintrc.\*](https://zh-hans.eslint.org/docs/latest/use/configure/configuration-files#%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F) 文件，也可以是 [package.json](https://docs.npmjs.com/files/package.json) 文件中的 eslintConfig 字段，ESLint 都会自动寻找并读取这两处的配置，或者还可以用[命令行](https://zh-hans.eslint.org/docs/latest/use/command-line-interface)上指定配置文件。

在项目根目录下添加 eslint 配置文件 .eslintrc.js

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['only-warn'],
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'linebreak-style': ['warn', 'unix'],
  },
}
```

::: details 示例解析

- env：指定代码将在哪个环境下运行。在这个例子中，browser: true 表示代码将在浏览器环境下运行，es2021: true 表示代码将使用 ECMAScript 2021 的语法特性。
- plugins：指定要使用的插件。在这个例子中，only-warn 插件用于将所有 ESLint 警告转换为错误，以便在构建过程中更严格地检查代码。
- extends：指定要使用的扩展。在这个例子中，plugin:prettier/recommended 扩展启用了与 Prettier 格式化工具兼容的规则集。
- parserOptions：指定 ESLint 解析器的选项。在这个例子中，ecmaVersion 指定要使用的 ECMAScript 版本（在这里是最新版本），sourceType 指定代码是使用模块还是脚本语法。
- ignorePatterns：指定哪些文件或目录应该被忽略。在这个例子中，.eslintrc.js 文件被排除在检查范围之外，以避免 ESLint 规则递归地应用于自己。
- rules：指定要应用的规则及其选项。在这个例子中，linebreak-style 规则用于检查行尾符号（CRLF 或 LF）是否符合 Unix 标准，并将不符合标准的行视为警告级别。

:::

### 配置 Prettier

参考 [Prettier - Configuration File](https://www.prettier.cn/docs/configuration.html)

> Prettier uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for configuration file support. This means you can configure Prettier via (in order of precedence):
>
> - A "prettier" key in your package.json file.
> - A .prettierrc file written in JSON or YAML.
> - A .prettierrc.json, .prettierrc.yml, .prettierrc.yaml, or .prettierrc.json5 file.
> - A .prettierrc.js, .prettierrc.cjs, prettier.config.js, or prettier.config.cjs file that exports an object using module.exports.
> - A .prettierrc.toml file.

Prettier 的配置非常简单，参照[官网](https://www.prettier.cn/docs/options.html)自定义你想要的配置项就好了

添加 prettier 配置文件 .prettierrc

```json
{
  "endOfLine": "lf",
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "printWidth": 100,
  "semi": false,
  "singleQuote": true,
  "bracketSameLine": true,
  "jsxSingleQuote": true,
  "trailingComma": "es5"
}
```

::: details 示例解析

- endOfLine：指定行尾符号的类型，可以是 lf、crlf 或 auto。在这个例子中，lf 表示行尾符号使用 Unix 风格的换行符。
- tabWidth：指定使用制表符时的缩进宽度。
- useTabs：指定是否使用制表符进行缩进。
- arrowParens：指定箭头函数的参数是否使用括号。在这个例子中，avoid 表示单参数箭头函数不使用括号，但多参数箭头函数使用括号。
- printWidth：指定每行代码的最大宽度。
- semi：指定是否在语句末尾添加分号。
- singleQuote：指定是否使用单引号代替双引号。
- bracketSameLine：指定是否将对象的左括号放在同一行上。
- jsxSingleQuote：指定是否在 JSX 属性中使用单引号。
- trailingComma：指定是否在对象和数组的最后一个元素后添加逗号。在这个例子中，es5 表示只在 ES5 支持的语法中添加拖尾逗号。

:::

## 四、编辑器

统一代码编辑器，推荐 vscode

可以在项目中添加 vscode 配置文件，进一步统一代码风格

项目根目录下创建 .vscode 文件夹

.vscode/extensions.json：项目插件配置，将“esbenp.prettier-vscode”设置为推荐的代码美化插件。此插件可在 vscode 内根据项目 prettier 配置格式化代码

```json
{
  "recommendations": ["esbenp.prettier-vscode"],
  "unwantedRecommendations": ["HookyQR.beautify"]
}
```

.vscode/settings.json：编辑器配置，避免 vscode 的行为与项目代码风格不符。vscode 的配置项在“文件 - 首选项 - 设置”中，或者通过快捷键“ctrl + ,”打开

```json
{
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.formatOnSaveMode": "file",
  "editor.tabSize": 2,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.eol": "\n",
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

上面的示例中设置了格式化工具为编辑器插件“esbenp.prettier-vscode”，换行符，保存、粘贴时格式化等等。

此配置只作用于本项目，优先级大于 vscode 的全局配置。

## 五、CLI

> 参考：
>
> [ESLint - CLI](https://zh-hans.eslint.org/docs/latest/use/command-line-interface)
>
> [Prettier - CLI](https://www.prettier.cn/docs/cli.html)

### 添加 npm 命令脚本

可添加 npm 命令脚本，使用 ESLint CLI / Prettier CLI 执行检查/格式化任务

```json
{
  "scripts": {
    "dev": "vue-cli-service serve",
    "lint": "eslint --max-warnings=0 \"src/**/*.{js,ts,jsx,tsx,vue,css,scss,html,htm}\" --fix",
    "format": "prettier --write \"src/**/*.{js,ts,jsx,tsx,vue,css,scss,html,htm}\"",
    "build": "vue-cli-service build"
  }
}
```

#### ESLint 检查任务

`"lint": "eslint --max-warnings=0 \"src/**/*.{js,ts,jsx,tsx,vue,css,scss,html,htm}\" --fix"`

::: details 脚本详解

- eslint：指定要运行的 ESLint 命令。
- --max-warnings=0：指定最大警告数为 0，表示如果代码中有任何警告，ESLint 将报告错误并停止运行。
- \"src/\*_/_.{js,ts,jsx,tsx,vue,css,scss,html,htm}\"：指定要检查的文件或文件夹的路径。在这个例子中，它是一个 glob 模式，匹配所有在 src 文中以 .js、.ts、.jsx、.tsx、.vue、.css、.scss、.html 或 .htm 为扩展名的文件。
- --fix：指定 ESLint 尝试自动修复尽可能多的问题。

因此，这个 npm 命令脚本将运行 ESLint，检查指定的源代码文件中的语法错误和潜在问题，并尝试自动修复它们。如果代码中有任何警告，则 ESLint 将报告错误并停止运行。

:::

#### Prettier 格式化任务

`"format": "prettier --write \"src/**/*.{js,ts,jsx,tsx,vue,css,scss,html,htm}\""`

::: details 脚本详解

- prettier：指定要运行的 Prettier 命令。
- --write：指定 Prettier 将直接在源代码文件中修改并保存格式化后的代码。
- \"src/\*_/_.{js,ts,jsx,tsx,vue,css,scss,html,htm}\"：指定要格式化的文件或文件夹的路径。在这个例子中，它是一个 glob 模式，匹配所有在 src 文件夹中以 .js、.ts、.jsx、.tsx、.vue、.css、.scss、.html 或 .htm 为扩展名的文件。

因此，这个 npm 命令脚本将运行 Prettier，格式化指定的源代码文件并将其保存回源文件中。

:::

### 执行 npm 命令脚本

```bash
## via npm
npm run format
npm run lint
## via yarn
yarn format
yarn lint
```

第四部分中对于编辑器的配置是可选的，只是，如果代码编辑器无法自动/手动格式化代码，则必须定期执行格式化命令脚本以保障代码风格一致。

## 六、配置 git 换行符转换

我们前面已经在 ESLint / Prettier / VSCode 配置文件中规范了行尾符号为 LF（\n），避免取 CRLF（\r\n）。但 Windows 系统下，git 检出文件到工作目录时，换行符默认为 CRLF。

### 更改 git 全局配置

`git config --global core.autocrlf  [true | input | false]`

不建议使用，会影响所有本地项目的所有文件

### 项目中添加 gitattributes 文档

该文档的作用、语法与生效时间请自行查阅，这里仅使用它设置特定类型文件的行尾符

> gitattributes 文档
>
> [git-scm - gitattributes](https://www.git-scm.com/docs/gitattributes)

根目录下创建 .gitattributes 文件

```text
*.html   text eol=lf
*.htm    text eol=lf
*.css    text eol=lf
*.scss   text eol=lf
*.js     text eol=lf
*.jsx    text eol=lf
*.vue    text eol=lf
*.json   text eol=lf
*.md     text eol=lf
*.yml    text eol=lf
*.config text eol=lf

```

::: details 第一行解析

- \*.html：指定要匹配的文件名模式，这里是所有以 .html 为扩展名的文件。
- text：指定文件应该被视为文本文件，而不是二进制文件。
- eol=lf：指定 LF（\n）作为行尾符号，而不是 Windows 风格的 CRLF（\r\n）。

:::

## 总结

顺利应用并熟练之后，再调整代码风格及其它 ESLint 检测方案吧。
