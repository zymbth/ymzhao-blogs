---
description: 优化 Webpack 打包流程：打包完成后再删除旧文件，确保网站访问稳定
head:
  - - meta
    - name: keywords
      content: webpack,构建后移除,网站访问
---

# 优化 Webpack 打包流程：打包完成后再删除旧文件，确保网站访问稳定

## 前言

想法源于某个基于 `vue-cli` 的实际项目的部署方式是在服务器拉取最新代码，在服务器本地打包。

三种打包对比：

1. `webpack` 本身并不会自动删除旧的打包文件
2. `vue-cli` 在打包前会直接清空输出目录
3. `vite` 打包过程不会直接删除输出目录，在打包过程中，dist 目录中可能存在旧的打包文件，但它们会被新的打包文件所覆盖。因此，打包完成后，dist 目录中只包含最新的打包文件，旧的打包文件会被替换或删除

假设打包耗时三分钟，以上三种打包方式，在打包的三分钟内，网站都是无法访问的。生产环境下，影响太大。

在生产环境下，为了确保网站的稳定性和一致性，通常建议在打包完成后再部署新的打包文件，以确保网站始终可访问。因此，想到一个手动操作文件系统的方案: 将项目打包到临时文件夹下，完毕后，删除原 dist 文件夹，再将临时文件夹重命名为 dist。

下面以 `vue-cli` 为例

## 一、思路一，配置 webpack

### 示例

vue.config.js 相关配置如下：

```javascript
const path = require('path')
const rimraf = require('rimraf')
const fs = require('fs')

module.exports = {
  outputDir: 'dist-temp',
  configureWebpack: {
    plugins: [
      {
        apply: compiler => {
          compiler.hooks.done.tap('optimize-build', () => {
            rimraf(path.resolve(__dirname, 'dist'), err => {
              if (err) {
                console.error('Failed to delete dist folder:', err)
              } else {
                fs.renameSync(path.resolve(__dirname, 'dist-temp'), path.resolve(__dirname, 'dist'))
              }
            })
          })
        },
      },
    ],
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.plugin('optimize-build').use(require('webpack/lib/NormalModuleReplacementPlugin'), [
        /(.*)dist-temp(.*)/,
        resource => {
          resource.request = resource.request.replace(/dist-temp/g, 'dist')
        },
      ])
    })
  },
}
```

> 这段配置的作用如下：
>
> 1. 设置输出目录为 dist-temp：
>    - outputDir: 'dist-temp' 配置项指定了打包输出的目录为 dist-temp。
> 2. 在打包完成后进行优化：
>    - configureWebpack 配置项中的插件会在 Webpack 的构建过程中插入一个钩子函数。
>    - 钩子函数通过 rimraf 模块删除 dist 目录，然后使用 fs.renameSync 方法将 dist-temp 目录重命名为 dist。
>    - 这样做的目的是在打包完成后，将输出目录从 dist-temp 改为 dist，以替换旧的打包文件。
> 3. 根据环境配置 Webpack 插件：
>    - chainWebpack 配置项中的方法根据当前环境变量 NODE_ENV 的值判断是否为生产环境。
>    - 如果是生产环境，使用 webpack/lib/NormalModuleReplacementPlugin 插件将所有匹配 /dist-temp/ 的模块请求替换成 /dist/，从而确保正确引用新的打包文件。
>
> 总体来说，这段配置的作用是在打包完成后，将输出目录从 dist-temp 改为 dist，并通过插件确保在生产环境下正确引用新的打包文件。

### 分模式打包

想兼具普通打包与上面的打包方式，可通过脚本区分。

安装开发依赖 `cross-env`

`npm install -D cross-env` OR `yarn add -D cross-env`

增加打包命令"build-replace"，命令中定义了 VUE 变量 “VUE_APP_BUILD_MODE”

```json
{
  "scripts": {
    "dev": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "build-replace": "cross-env VUE_APP_BUILD_MODE=replace vue-cli-service build"
  }
}
```

vue.config.js 相关配置:

```javascript
const path = require('path')
const rimraf = require('rimraf')
const fs = require('fs')
const fse = require('fs-extra')

const isProdENV = process.env.NODE_ENV === 'production'
const deleteAfterBuild = process.env.VUE_APP_BUILD_MODE === 'replace'

module.exports = {
  outputDir: deleteAfterBuild ? 'dist-temp' : 'dist',
  configureWebpack: {
    plugins:
      isProdENV && deleteAfterBuild
        ? [
            {
              apply: compiler => {
                compiler.hooks.done.tap('optimize-build', () => {
                  rimraf(path.resolve(__dirname, 'dist'), err => {
                    if (err) {
                      console.error('Failed to delete dist folder:', err)
                    } else {
                      try {
                        // dist-temp 重命名为 dist
                        fs.renameSync(
                          path.resolve(__dirname, 'dist-temp'),
                          path.resolve(__dirname, 'dist')
                        )
                      } catch (err) {
                        // 重命名异常
                        console.error('Failed to rename file:', err)
                        // 异常处理：复制 dist-temp 到 dist
                        fse.copySync(
                          path.resolve(__dirname, 'dist-temp'),
                          path.resolve(__dirname, 'dist')
                        )
                      }
                    }
                  })
                })
              },
            },
          ]
        : [],
  },
  chainWebpack: config => {
    config.when(isProdENV && deleteAfterBuild, config => {
      config.plugin('optimize-build').use(require('webpack/lib/NormalModuleReplacementPlugin'), [
        /(.*)dist-temp(.*)/,
        resource => {
          resource.request = resource.request.replace(/dist-temp/g, 'dist')
        },
      ])
    })
  },
}
```

### 问题

如果出现无权重命名文件夹的 bug (文件权限不足或被其它进程占用)，临时文件夹无法被删除。需手动删除 dist-temp 文件夹，即使不删除，后续打包时，也会被新的临时文件夹覆盖。

此 bug 在 vscode 编辑器终端上出现，其它条件下不清楚。

### 完整代码

vue.config.js

```javascript
const path = require('path')
const rimraf = require('rimraf')
const fs = require('fs')
const fse = require('fs-extra')

const isProdENV = process.env.NODE_ENV === 'production'
const deleteAfterBuild = process.env.VUE_APP_BUILD_MODE === 'replace'

module.exports = {
  /**
   * 打包优化 (通过 vue环境变量 VUE_APP_BUILD_MODE === 'replace' 开启)
   *
   * 默认打包过程：删除 dist 文件夹，将项目打包至 dist 文件夹下。打包过程中，网站无法访问
   * 优化打包过程：
   * - 将项目打包至临时文件夹(dist-temp)下
   * - 打包完成后，删除旧版本文件(dist)
   * - 临时文件夹重命名为 dist
   */
  outputDir: deleteAfterBuild ? 'dist-temp' : 'dist',
  configureWebpack: {
    plugins:
      isProdENV && deleteAfterBuild
        ? [
            {
              // 通过 apply 方法注册插件“optimize-build”
              apply: compiler => {
                // compiler.hooks.done：Webpack 编译器对象的钩子函数，在编译完成后触发回调函数
                // tap('optimize-build', () => {})：注册钩子函数“optimize-build”
                compiler.hooks.done.tap('optimize-build', () => {
                  // 删除 dist 文件夹
                  rimraf(path.resolve(__dirname, 'dist'), err => {
                    // 删除失败
                    if (err) {
                      console.error('Failed to delete dist folder:', err)
                    } else {
                      // 删除成功
                      try {
                        // dist-temp 重命名为 dist
                        fs.renameSync(
                          path.resolve(__dirname, 'dist-temp'),
                          path.resolve(__dirname, 'dist')
                        )
                      } catch (err) {
                        // 重命名异常
                        console.error('Failed to rename file:', err)
                        // 异常处理：复制 dist-temp 到 dist
                        fse.copySync(
                          path.resolve(__dirname, 'dist-temp'),
                          path.resolve(__dirname, 'dist')
                        )
                      }
                    }
                  })
                })
              },
            },
          ]
        : [],
  },
  chainWebpack: config => {
    config.when(isProdENV && deleteAfterBuild, config => {
      // 使用 Webpack 时，通过 NormalModuleReplacementPlugin 插件来替换所有文件中的 dist-temp 字符串为 dist 字符串
      // 获取一个 Webpack 配置对象，并使用 plugin 方法添加一个插件，该插件的名称为 optimize-build
      config.plugin('optimize-build').use(
        // 加载 NormalModuleReplacementPlugin 插件。这个插件可以用于替换模块的请求路径
        require('webpack/lib/NormalModuleReplacementPlugin'),
        [
          /(.*)dist-temp(.*)/, // 匹配所有包含 dist-temp 字符串的模块请求路径
          // 在匹配到符合条件的模块请求路径时，将被调用
          resource => {
            // 当前模块的请求路径
            resource.request = resource.request.replace(/dist-temp/g, 'dist')
          },
        ]
      )
    })
  },
}
```

package.json

```json
{
  ...
  scripts: {
    "dev": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "build-replace": "cross-env VUE_APP_BUILD_MODE=replace vue-cli-service build",
  },
  ...
}
```

这样，可以通过 build 脚本正常打包，也可以选择 build-replace 脚本进行优化后的打包

由于存在名为 dist-temp 的临时打包文件夹，需要将它添加到 `.gitignore` 中

```text
node_modules
/dist
/dist-temp
```

### 小结

请亲自调试测试，vite 项目或其它基于 webpack 的项目也类似

## 二、思路二，脚本形式

打包完成后，使用 `fs` 模块将临时文件夹对旧文件夹的替换操作放在一个脚本文件中，假设为 replace.js。

### 示例

添加 npm 脚本命令：

```json
{
  ...
  scripts: {
    "dev": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "build-replace": "cross-env VUE_APP_BUILD_MODE=replace vue-cli-service build && node replace.js",
  },
  ...
}
```

安装开发依赖 `cross-env` ，兼容两种打包方式，同思路一一样，也需要配置 `webpack` 打包输出路径

```javascript
const isProdENV = process.env.NODE_ENV === 'production'
const deleteAfterBuild = process.env.VUE_APP_BUILD_MODE === 'replace'

module.exports = {
  outputDir: deleteAfterBuild ? 'dist-temp' : 'dist',
  // ...
}
```

### 小结

两种方案其实进行的操作是一样的，区别在于，后者将对文件的操作放在独立的脚本文件中，打包完成后执行

## 总结

本文内容仅为个人经验总结，目的是避免构建过程中对网站访问的影响，优化仅在特定应用场景下有效。

方案实现细节可依据项目需求更改，比如“删除 dist”、“重命名 dist-temp”的错误处理，对旧文件的备份等等。

除了在 vscode 终端内遇到的文件占用 bug，可能还存在其它潜在 bug，期待更安全、高效的方案。
