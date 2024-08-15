---
description: 使用 crypto-js 加密
head:
  - - meta
    - name: keywords
      content: crypto-js,加密,encrypt
---

# crypto-js 加密

使用 crypto-js 加密

> 开源地址：
>
> [crypto-js repo](https://github.com/brix/crypto-js)

## 安装

```sh
# npm
npm install crypto-js
# yarn
yarn add crypto-js
# pnpm
pnpm add crypto-js
```

## hook 封装使用

::: code-group

```js [encrypt.js]
import { encrypt, decrypt } from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'
import Hex from 'crypto-js/enc-hex'
import Base64 from 'crypto-js/enc-base64'
import CBC from 'crypto-js/mode-cfb'
import Pkcs7 from 'crypto-js/pad-pkcs7'

const aesKey = Utf8.parse('dm95YWdlcg==')
const iv = Utf8.parse('1234567887654321')

export function encryptData(word) {
  const srcs = Utf8.parse(word)
  const encrypted = encrypt(srcs, aesKey, {
    iv: iv,
    mode: CBC,
    padding: Pkcs7,
  })
  const hexStr = encrypted.ciphertext.toString().toUpperCase()
  //这里根据需求返回 base64Str 或 hexStr (解密时有小小差别)
  return hexStr
}

export function decryptData(word) {
  // 如果加密返回的 base64Str
  // const srcs = word
  // 若上面加密返回的 hexStr
  const encryptedHexStr = Hex.parse(word)
  const srcs = Base64.stringify(encryptedHexStr)
  const decrypted = decrypt(srcs, aesKey, {
    iv: iv,
    mode: CBC,
    padding: Pkcs7,
  })
  const decryptedStr = decrypted.toString(Utf8)
  return decryptedStr.toString()
}
```

```js [usage.js]
import { encryptData, decryptData } from '@/utils/encrypt'

// ...
```

:::
