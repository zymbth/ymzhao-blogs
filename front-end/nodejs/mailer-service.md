# 基于 nodejs 的邮件服务

实现一个接口用于发送邮件

## 一、基本功能实现

### 本地开发

依赖：nodemailer

```bash
mkdir mailer
cd mailer
npm init -y
npm i nodemailer express
```

根目录下创建 `index.js`:

```js
// 导入Express
const express = require('express')
const nodemailer = require('nodemailer')
// 创建一个Nodemailer传输器
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: '66666666@qq.com', // 邮箱账号
    pass: 'uijhnlkjfdshu', //邮箱 SMTP 授权码
  },
})
let isReady // 启动标识
transporter.verify(function (error, success) {
  isReady = !error
  if (!error) console.log('Mailer is ready')
  else console.error('Failed to create email transporter:', error)
})

// 创建Express app
const app = express()

// 解析JSON请求体
app.use(express.json())

app.get('/api/test', (req, res) => {
  const { body, query, params } = req
  res.json({
    code: 2000,
    data: { body, query, params, url: '/api/test' },
    message: 'Success',
  })
})
// 定义接口
app.post('/api/send-email', (req, res) => {
  if (!isReady) return res.json({ code: 3003, data: null, message: 'Mailer not ready' })
  const { body, query, params } = req
  let infos = {}
  // 邮件内容验证
  try {
    const { name, company, phone, email, request, message } = body
    if (!name || !company || !phone || !email || !request) throw new Error('邮件内容缺失')
    infos = { name, company, phone, email, request, message }
  } catch (error) {
    return res.json({ code: 3001, data: null, message: error.message || error })
  }
  // setup e-mail data with unicode symbols
  const mailOptions = {
    from: '66666666@qq.com',
    to: 'reciever@qq.com',
    subject: body.subject || '客户联系 —— 官网',
    // text: 'Hello world ?', // plaintext body(内容)
    // html body
    html: `<div>
      <div><label>姓名：</label><span>${infos.name}</span></div>
      <div><label>公司：</label><span>${infos.company}</span></div>
      <div><label>电话：</label><span>${infos.phone}</span></div>
      <div><label>邮箱：</label><span>${infos.email}</span></div>
      <div><label>产品需求类别：</label><span>${infos.request}</span></div>
      <div><label>需求描述：</label><span>${infos.message}</span></div>
    </div>`,
  }
  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) return res.json({ code: 3001, data: null, message: error.message || error })
    res.json({ code: 2000, data: null, message: '发送成功' })
  })
})

// 启动服务器
app.listen(9092, () => {
  console.log('Server listening on port 9092')
})
```

**运行**：`node index.js`

### 使用 webpack 构建

可使用 webpack 等构建工具完成打包压缩等构建任务

`npm i webpack webpack-cli -D`

`index.js` 移至 `/src/index.js`

创建文件 `webpack.config.js`

```js
import path from 'path'
import { fileURLToPath } from 'url'

const __filenameNew = fileURLToPath(import.meta.url)
const __dirnameNew = path.dirname(__filenameNew)

export default {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: path.resolve(__dirnameNew, 'dist'),
    filename: 'mailer.cjs',
  },
}
```

更新 package.json npm 脚本：

```json
{
  "type": "module",
  "scripts": {
    "dev": "node ./src/index.js",
    "build": "webpack build --mode production",
    "start": "node ./dist/mailer.cjs"
  }
}
```

使用 esm 规范引入

```js
import express from 'express'
import { createTransport } from 'nodemailer'
const transporter = createTransport({
  // ...
})
// ...
```

本地开发：`npm run dev`
打包: `npm run build`
运行构建后的接口项目: `npm run start`

## 二、其它功能

生产环境部署需考虑安全性等问题，限制异常行为、防范恶意攻击

### 访问频率限制

依赖：`express-rate-limit`

`npm i express-rate-limit`

引入：

```js
import rateLimit from 'express-rate-limit'

/**
 * 限流，基于express-rate-limit
 * @see https://express-rate-limit.mintlify.app/overview
 *
 * 一个IP，每分钟最多发送2次
 */
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 2, // limit each IP to 2 requests per windowMs
  message: { code: 4001, data: null, message: '请求过多请稍候再试' },
})

app.post('/api/send-email', limiter, (req, res) => {
  // ...
})
```

### 日志

### 定时任务
