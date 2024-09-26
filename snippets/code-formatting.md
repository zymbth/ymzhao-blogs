---
description: 使用 ESLint & Prettier 进行代码检测与格式化
head:
  - - meta
    - name: keywords
      content: ESLint,Prettier,静态代码分析,格式化
created: '2024-08-13'
---

# 快速应用静态代码分析

快速应用 ESLint & Prettier 规范代码，详细配置说明参考文章[实践：新手使用 ESLint 进行项目代码检测与格式化](/front-end/engineering/uniform-code-style)

## 安装

::: code-group

```bash [npm]
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-only-warn
```

```bash [yarn]
yarn add -D eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-only-warn
```

```bash [pnpm]
pnpm add -D eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-only-warn
```

:::

## 配置

::: code-group

```js [.eslintrc.js]
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

```json [.prettierrc]
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

```json [.vscode/settings.json]
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

```json [.vscode/extensions.json]
{
  "recommendations": ["esbenp.prettier-vscode"],
  "unwantedRecommendations": ["HookyQR.beautify"]
}
```

:::

## CLI

```json
{
  "scripts": {
    "lint": "eslint --max-warnings=0 \"src/**/*.{js,ts,jsx,tsx,vue,css,scss,html,htm}\" --fix",
    "format": "prettier --write \"src/**/*.{js,ts,jsx,tsx,vue,css,scss,html,htm}\"",
  }
}
```

## 换行符处理

`gitattributes`:

```yaml
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
