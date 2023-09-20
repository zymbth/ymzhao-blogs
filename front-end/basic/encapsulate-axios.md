# axios 封装

## 前言

axios 是前端开发的基本工具之一，它的封装早就不新鲜了
本文分为两部分：一是 axios 基本封装示例；二是非必要封装，列举个人开发中遇到的一些较为实用的封装需求(自定义方法、监听上传/下载进度、中断请求、接口 loading)。
本文示例基于 `axios@0.21.1`

## 一、基本封装

axios 的基本封装网上有很多，内容大差不差。这里，参考 axios 官方文档以及 GitHub 高星开源项目的 axios 封装：

> [axios - Interceptors - github](https://github.com/axios/axios/tree/v0.x#interceptors)
>
> [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin/blob/master/src/utils/request.js)

```javascript
import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
})

// Add a request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // do something with response data
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      // TODO: Message prompt
      console.error(res.message || 'Error')

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // TODO: to re-login
      }
      // reject
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // do something with response error
    return Promise.reject(error)
  }
)

export default service
```

示例中，`baseURL`、消息提示、消息确认、token 获取需要结合具体项目进行替换。
封装非常简洁，就是创建一个 axios 实例，设置 baseURL/timeout，添加请求拦截器、响应拦截器。
请求拦截器中带上用户登录令牌，响应拦截器中根据响应数据中的 code（同后端约定好）识别特殊响应（登录失效/超时），并作对应的处理
使用封装后的方法：

```javascript
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query,
  })
}
```

上例中，request 就是在 request.js 中创建并导出的 axios 实例，和直接导入并使用 axios 默认实例相比，两者的参数类型是一致的，也可以使用 `.get` `.post` 等别名。
上面的封装完成了最基础且重要的功能，抛出的实例与 axios 用法一样，但每一个使用该实例的，都会自动在请求头中添加登录令牌，自动拦截请求与响应。完美！

### 小结

最基本的封装就是这样，可以理解成：

```javascript
import axios from 'axios'

const service = axios.create(config)
service.interceptors.request.use(requestHandler, requestErrorHandler)
service.interceptors.response.use(responseHandler, responseErrorHandler)

export default service
```

其中，`config`为默认的配置，请求拦截器、响应拦截器中分别设置正确处理与错误处理方法，上面的示例仅供参考，实现细节可根据具体项目需求调整。

> 请参考 axios 官网文档
>
> [axios - Request Config](https://axios-http.com/docs/req_config) > [axios - Interceptors](https://axios-http.com/docs/interceptors)

## 二、其它非必要封装

基本封装上一节就够了，本节的内容都是在基本封装的基础上，对一些非必要的需求作出的补充，而这些非必要的需求在有些项目中可能永远也用不上。实现过程因人而异
使用实例基于 `vue@3.2.37`

### 自定义方法

如果存在某类需要固定添加/调整 axios 配置的接口，可能会造成代码冗余，我们希望方法仅包含与接口相关的 url 和数据。此时，可以如下封装：

```javascript
// ...

const axiosBlob = (url, data, otherConfigs = {}) => {
  otherConfigs.responseType = 'blob'
  otherConfigs.timeout = 5000
  return new Promise((resolve, reject) => {
    service({
      method: 'get',
      url,
      params: data,
      ...otherConfigs,
    }).then(resolve, reject)
  })
}

const axiosPostFormData = (url, data, otherConfigs = {}) => {
  otherConfigs.headers = { 'Content-Type': 'multipart/form-data; charset=UTF-8' }
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url,
      data,
      ...otherConfigs,
    }).then(resolve, reject)
  })
}

export { service, axiosBlob, axiosPostFormData }
export default service
```

使用

```javascript
import request, { axiosBlob } from '@/utils/request'

export function fetchFile1(params) {
  return request({
    url: '/vue-element-admin/article/file',
    method: 'get',
    params,
    responseType: 'blob',
    timeout: 5000,
  })
}

export function fetchFile2(params) {
  return axiosBlob('/vue-element-admin/article/file', params)
}
```

如上，可导出自定义方法，免去特定请求下反复填写固定的配置信息
如果偏好这种风格，可以统一封装 get/post/patch/put/delete 类请求，其它如上例中的两种特殊请求，可自行添加。

```javascript
// ...

const axiosCustomFuncHandler = (method, url, data, otherConfigs = {}) => {
  return new Promise((resolve, reject) => {
    service({
      method,
      url,
      [method === 'get' ? 'params' : 'data']: data ? data : {},
      ...otherConfigs,
    }).then(resolve, reject)
  })
}
const axiosGet = (url, data, otherConfigs) => axiosCustomFuncHandler('get', url, data, otherConfigs)
const axiosPost = (url, data, otherConfigs) =>
  axiosCustomFuncHandler('post', url, data, otherConfigs)
const axiosPut = (url, data, otherConfigs) => axiosCustomFuncHandler('put', url, data, otherConfigs)
const axiosPatch = (url, data, otherConfigs) =>
  axiosCustomFuncHandler('patch', url, data, otherConfigs)
const axiosDelete = (url, otherConfigs) =>
  axiosCustomFuncHandler('delete', url, undefined, otherConfigs)
const axiosPostFormData = (url, data, otherConfigs = {}) => {
  otherConfigs.headers = { 'Content-Type': 'multipart/form-data; charset=UTF-8' }
  return axiosCustomFuncHandler('post', url, data, otherConfigs)
}
const axiosBlob = (url, data, otherConfigs = {}) => {
  otherConfigs.responseType = 'blob'
  otherConfigs.timeout = 5000
  return axiosCustomFuncHandler('get', url, data, otherConfigs)
}

export {
  service,
  axiosGet,
  axiosPost,
  axiosPut,
  axiosPatch,
  axiosDelete,
  axiosBlob,
  axiosPostFormData,
}
export default service
```

请注意自定义方法与实例方法别名的区别：
axios 实例方法：`request(config)`
axios 实例方法别名：`request.get(url[, config])`
自定义方法：`axiosGet(url, params, config)`

#### config 优先级

> [axios - Config Defaults](https://axios-http.com/docs/config_defaults)

在自定义方法中，设置了固定的请求配置到 axios 实例上。axios 默认实例也可以设置默认配置，而 axios 实例方法中，同样可以传递请求配置。他们之间存在优先级：
`Global axios defaults` < `Custom instance defaults` < `Config argument for the request`

### 监听上传/下载进度

axios 提供了监听上传/下载进度的事件: [axios - Request Config](https://axios-http.com/docs/req_config)

```javascript
  // `onUploadProgress` allows handling of progress events for uploads
  // browser only
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` allows handling of progress events for downloads
  // browser only
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },
```

可以看到他们的参数类型是相同的（[ProgressEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/ProgressEvent)）
最直接的使用方式就是导入封装好的 service 实例，定义该监听方法

```vue
<script setup>
import request from '@/utils/request'
import { ref, onMounted } from 'vue'

let progress = ref(0)

onMounted(() => {
  request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query,
    onDownloadProgress: function (progressEvent) {
      if (progressEvent.lengthComputable) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        progress.value = percentCompleted
      } else {
        progress.value = 100
      }
    },
  }).then(res => {
    // ...
  })
})
</script>
<template>
  <div>Loading...{{ progress }}%</div>
</template>
```

那每个需要监听下载进度的都这样写一遍的话，一方面会产生很多冗余代码，另一方面也不方便统一维护监听方法

思路：
将一个响应式变量（下载/上传进度）通过 `request config` 传给 axios 实例，在请求拦截器中绑定监听事件。监听事件会更改响应式变量的值

```javascript
// 下载进度监听事件（更新封装方法传入的响应式变量——进度）
const handleDownloadProcess = (progressEvent, progress) => {
  if (progressEvent.lengthComputable) {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    progress.value = percentCompleted
  } else {
    progress.value = 100
  }
}
// 上传进度监听事件，同 handleDownloadProcess
const handleUploadProcess = handleDownloadProcess

// request interceptor
service.interceptors.request.use(
  config => {
    // ...

    // set download/upload progress' event listeners
    if (config.downloadProgress) {
      config.onDownloadProgress = progressEvent =>
        handleDownloadProcess(progressEvent, config.downloadProgress)
    }
    if (config.uploadProgress) {
      config.onUploadProgress = progressEvent =>
        handleUploadProcess(progressEvent, config.uploadProgress)
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
```

上面的示例中，约定了两个配置名(downloadProgress, uploadProgress)，通过判断各自对应的变量是否存在来绑定监听事件。
比如，想绑定下载进度监听事件，需要在 `request config` 中传递 `downloadProgress` 变量。严谨一点的话，请求拦截器中最好检测下它是否是响应式变量。
由于是在实例的请求拦截器中处理的，无论是直接调用实例还是封装后的方法，都可以实现下载进度监听。同手动绑定监听事件相比，写法如下：

```javascript
request({
  url: '/vue-element-admin/article/list',
  method: 'get',
  params: query,
  downloadProgress: progress,
}).then(res => {
  // ...
})
```

#### 下载大小未知时的处理

如果下载大小未知，那上面的监听方法中，会直接将进度置为100，而实际上并不是，仍在下载中。

可以作假进度。但监听下载进度就是为了知道进度，并在前端页面上作下载进度提示，假进度毫无意义。在服务器未返回大小的情况下，可以将进度置为一个特定值，在对应页面监听到该特定进度值时，不作下载进度提示，转为普通loading提示。

```javascript
// 下载进度监听事件（更新封装方法传入的响应式变量——进度）
const handleDownloadProcess = (progressEvent, progress) => {
  if (progressEvent.lengthComputable) {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    progress.value = percentCompleted
  } else {
    progress.value = -1
  }
}
// response handler
const respHandler = response => {
  if (response.config.downloadProgress) {
    response.config.downloadProgress.value = 100
  }
  // ...
}
```

如果要作假进度提示的话，参考如下：

```js
const handleDownloadProcess = (progressEvent, progress) => {
  if (progressEvent.lengthComputable) {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    progress.value = percentCompleted
  } else {
    let tmp = progress.value + (100 - progress.value) / 50
    tmp = +tmp.toFixed(2)
    if (tmp >= 100) tmp = 99.99
    progress.value = tmp
  }
}
```

注意，都需要在响应完成时，将进度值置为100。仅作参考，具体实现因人而异。

### 接口 loading

掘金上看到的一篇文章，针对接口 loading 状态的一种封装：[axios 和 loading 不得不说的故事](https://juejin.cn/post/7215424335719923772)
它针对的业务场景如下：

```javascript
const loading = ref(false)

function getData() {
  loading.value = true
  axios
    .get('/vue-element-admin/article/list')
    .then(res => {
      // ...
    })
    .finally(() => {
      loading.value = false
    })
}
```

之前从来没想过封装接口 loading，可能是它所能抽离的公共代码很少。
思路：
将一个响应式变量（loading）通过 `request config` 传给 axios 实例，在请求拦截器更改它为 true（表示开始请求接口），在响应拦截器中更改它为 false（表示接口响应完毕）

```javascript
// request interceptor
service.interceptors.request.use(
  config => {
    // ...
    if (config.loading) {
      config.loading.value = true
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  response => {
    if (response.config?.loading) {
      response.config.loading.value = false
    }
    // ...
  },
  error => {
    if (error.config?.loading) {
      error.config.loading.value = false
    }
    return Promise.reject(error)
  }
)
```

使用：

```javascript
const loading = ref(false)

function getData() {
  axios.get('/vue-element-admin/article/list', { loading }).then(res => {
    // ...
  })
}
```

### 中断请求

有时候，出于性能方面的考虑，我们希望能主动中断 axios 正进行的请求，例如路由跳转
axios 提供了两种方法中断请求，详见文档：[axios - Cancellation](https://axios-http.com/docs/cancellation)

- `signal`
- `cancelToken`(deprecated since v0.22.0)

由于本人使用的 axios 版本低于 v0.22.0，这里使用后者进行封装

```javascript
// ...

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    // set cancel token
    if (config.useCancelToken) {
      const CancelToken = axios.CancelToken
      config.cancelToken = new CancelToken(cancel => {
        config.useCancelToken.value = cancel
      })
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
```

在请求拦截器中检测是否存在 `useCancelToken` 属性，存在则添加 `cancelToken` 属性方法到配置中，方法内将响应式变量 `useCancelToken` 的值指向 `cancel` 方法。
使用：

```javascript
const cancelToken = ref()
function getAllData() {
  axios.get('/demo', { useCancelToken: cancelToken })
}

onBeforeUnmount(() => {
  cancelToken.value?.()
})
```

通过 `useCancelToken` 属性开启 axios Cancellation，组件销毁前中断当前组件内的请求。
axios 的中断封装到此结束。

### 手动中断后的提示

当请求被手动中断后，会触发响应拦截器的错误处理方法(`respErrorHandler`)：

```js
import axios from 'axios'
import { ElMessage } from 'element-plus'

// ...

service.interceptors.response.use(
  response => {
    // ...
  },
  error => {
    // do something with response error
    if (error instanceof axios.Cancel) ElMessage(error.message || 'Request cancelled')
    return Promise.reject(error)
  }
)
```

当手动中断时，此error的类型为 `axios.Cancel`，如果有需求，可添加手动中断后的提示

#### 中断功能的使用封装

上例中可以看到使用该中断功能时，有些繁琐，对于组件内的每一个需要使用中断功能的接口，都需要：

- 定义一个响应式中断方法变量
- 添加到请求配置中
- 添加 `onBeforeUnmount` 方法，并在其内调用前面的每个中断方法

这里依据个人风格提供一个 axios 中断功能的使用 hooks，仅供参考：

```javascript
import { ref, onBeforeUnmount } from 'vue'

/**
 * @description: 自动取消axios请求
 * @example
 * // import:
 * import autoCancelAxios from '@/use/auto-cancel-axios'
 *
 * const { addCancelToken } = autoCancelAxios()
 *
 * function getAllData() {
 *   axiosGet('/demo', { useCancelToken: addCancelToken() })
 * }
 */
export default () => {
  // cancelToken 列表
  const cancels = []
  // 添加 cancelToken
  function addCancelToken() {
    const currAxiosCancelToken = ref()
    cancels.push(currAxiosCancelToken)
    return currAxiosCancelToken
  }

  onBeforeUnmount(() => {
    try {
      cancels.forEach(cancelToken => {
        cancelToken.value?.()
      })
    } catch (error) {
      console.error('Failed to cancel axios', error)
    }
  })

  return { addCancelToken }
}
```

使用示例：

```javascript
import autoCancelAxios from '@/use/auto-cancel-axios'

const { addCancelToken } = autoCancelAxios()

function getAllData() {
  axios.get('/demo', { useCancelToken: addCancelToken() })
}
function getData1() {
  axios.get('/demo1', { useCancelToken: addCancelToken() })
}
function getData2() {
  axios.get('/demo2', { useCancelToken: addCancelToken() })
}
```

## 总结

封装的目的在于方便自己使用，较少代码冗余、方便维护、提高开发效率，所以并不存在标准答案。
本文仅供参考，如有错误，望指正！
