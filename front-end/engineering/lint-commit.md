---
description: 使用 husky、lint-staged、commitlint 规范代码提交
head:
  - - meta
    - name: keywords
      content: husky,commitlint,lint-staged,提交规范
created: '2024-11-11'
---

# 使用 husky、lint-staged、commitlint 规范代码提交

> 参考
>
> [husky](https://github.com/typicode/husky)：Git钩子管理工具。允许在Git钩子（如pre-commit, commit-msg等）执行自定义脚本，可以在代码提交的不同阶段自动运行预设的检查或操作
>
> [lint-staged](https://github.com/lint-staged/lint-staged): 只对暂存区（staged）的文件运行代码检查工具，可以在提交前自动运行代码格式化和代码检查
>
> [commitlint](https://github.com/conventional-changelog/commitlint): 检查提交信息是否符合特定规范，可强制使用统一的提交信息格式，并支持自定义提交信息规则

完整的协作流程示例：

1. 开发者准备提交代码

```sh
git add .
git commit -m "feat: 添加新功能"
```

2. `husky`触发Git钩子：
   - `pre-commit`钩子运行`lint-staged`
   - `commit-msg`钩子运行`commitlint`

3. `lint-staged`执行：
   - 对暂存文件运行ESLint检查
   - 自动修复可以自动修复的代码风格问题
   - 如有无法自动修复的问题，阻止提交

4. `commitlint`执行：
   - 检查提交信息是否符合预设规范
   - 如不符合规范，阻止提交

## 安装依赖

**环境**：node18

`yarn add -D husky lint-staged @commitlint/cli @commitlint/config-conventional`

## 配置

### 安装 husky

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

添加并执行 `prepare` 脚本，安装 husky

### 配置 lint-staged

添加文件 `.husky/lintstagedrc.js`，用于配置 lint-staged，例如：

::: code-group

```js [.husky/lintstagedrc.js]
module.exports = {
  '*.{js,jsx,ts,tsx,vue}': ['eslint --fix']
}
```

```json [package.json]
{
  "scripts": {
    "lint:lint-staged": "lint-staged -c ./.husky/lintstagedrc.js",
    "prepare": "husky"
  }
}
```

:::

> `eslint`, `prettier` 等代码格式化及检查工具需自行安装配置

### 配置 commitlint

添加文件 `commitlint.config.js`:

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能(feature)
        'fix', // 修补bug
        'docs', // 文档(documentation)
        'style', // 格式、样式(不影响代码运行的变动)
        'refactor', // 重构(即不是新增功能，也不是修改BUG的代码)
        'perf', // 优化相关，比如提升性能、体验
        'test', // 添加测试
        'ci', // 持续集成修改
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚到上一个版本
        'workflow', // 工作流改进
        'mod', // 不确定分类的修改
        'wip', // 开发中
        'types', // 类型修改
        'release' // 版本发布
      ]
    ],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never']
  }
}
```

具体配置内容按项目需求自定义

### 配置 husky

- pre-commit hook

添加文件 `.husky/pre-commit`:

```sh
# Format and submit code according to lintstagedrc.js configuration
npm run lint:lint-staged
```

> 这里在提交前运行 lint-staged（上面的 `.husky/lintstagedrc.js` 示例文件中进行了代码格式化）

- commit-msg hook

添加文件 `.husky/commit-msg`

```sh
npx --no -- commitlint --edit $1
```

> 这里在提交时运行 commitlint（上面的 `commitlint.config.js` 示例文件中进行了提交信息检查）
>
> - npx --no --: `--no`选项确保不会在当前项目中安装 `commitlint`，`--`分隔`npx`的选项和传递给`commitlint`的参数。
> - commitlint --edit $1: 打开默认文本编辑器，并编辑正在提交的消息。`$1` 是一个环境变量，代表 Git 提交消息的路径。

## 其它node版本

`node@16` 指定安装以下版本：

`yarn add -D husky@8.0.3 lint-staged@14.0.1 @commitlint/cli@17.8.1 @commitlint/config-conventional@17.8.1`

husky的安装命令为 `husky install`

husky脚本区别，例如 `pre-commit`:

```sh {1-2}
#!/usr/bin/env sh
. "$(dirname -- "$0")/\_/husky.sh"
npm run lint:lint-staged
```

> `#!/usr/bin/env sh`: 指定运行脚本的解释器(husky@9+无需指定)
>
> `. "$(dirname -- "$0")/\_/husky.sh"`: 加载必要的配置

更早版本兼容性参考各仓库release说明
