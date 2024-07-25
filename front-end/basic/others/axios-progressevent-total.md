---
description: axios下载进度监听中，无法获取响应大小，导致进度监听无意义
head:
  - - meta
    - name: keywords
      content: axios,onDownloadProgress,progressEvent,total,0
---

# axios下载进度api无法获取响应大小 <Badge type="danger" text="BUG" />

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

## 问题分析

> 参考：
>
> [onDownloadProgress has progressEvent.total property with zero value](https://github.com/axios/axios/issues/1591#issuecomment-431400903)
>
> [axios的onDownloadProgress返回参数的total为0](https://segmentfault.com/q/1010000021489598)
>
> [axios ondownloadprogress中total总为零，content-length不返回](https://www.cnblogs.com/kaibo520/p/15380988.html)

### content-length首部缺失

第一种可能，响应头中的 `content-length` 缺失，后端没有返回，可在上面的监听方法中打印 `progressEvent.srcElement.getResponseHeader('content-length')` 验证。

解决方案：让后端补上

### gzip

第二种可能，`content-length` 有返回，但响应经过了gzip编码(`content-encoding: gzip`)。在上面的监听方法中打印 `progressEvent.loaded` 会发现下载完成后，loaded值可能会远大于 `content-length`。

解决方案：

1. 关闭gzip
2. 后端把文件大小存储到其它响应首部字段上，例如：`x-content-length`，axios封装中，使用该值作为total计算进度。
