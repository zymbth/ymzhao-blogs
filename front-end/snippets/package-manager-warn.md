---
description: 处理packageManager不匹配导致的异常中断
head:
  - - meta
    - name: keywords
      content: packageManager,ERR_PNPM_BAD_PM_VERSION,pnpm,package-manager-strict,engines
---

# 处理packageManager的异常

> [packageManager](https://nodejs.cn/api/packages/packagemanager.html)："packageManager" 字段定义了在处理当前项目时预期使用的包管理器。 它可以设置为任何支持的包管理器，并且将确保您的团队使用完全相同的包管理器版本，而无需安装除 Node.js 以外的任何其他东西。
>
> [package-json#engines](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#engines)

相关错误讨论详见：[ERR_PNPM_BAD_PM_VERSION](https://github.com/pnpm/pnpm/issues?q=ERR_PNPM_BAD_PM_VERSION)

- 方案一，不要使用 `packageManager`，改用 `engines`

```json
{
  "packageManager": "pnpm@8.1.0", // [!code --]
  "engines": { // [!code ++]
    "node": ">=18.0.0", // [!code ++]
    "pnpm": ">=8.1.0" // [!code ++]
  } // [!code ++]
}
```

- 方案二，将错误更改为警告

::: code-group

```json [package.json]
{
  "packageManager": "pnpm@8.1.0"
}
```

```yaml [.npmrc]
package-manager-strict=false
```

:::

当然，`packageManager` 可以与 `engines` 一同使用

除了功能上的不同外，在版本检测上：

- 前者只能使用特定版本号，后者可以设定范围
- 版本不符时，前者默认进行异常中断，后者则默认警告
