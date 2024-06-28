---
description: Mitt源码学习
head:
  - - meta
    - name: keywords
      content: mitt,eventbus,事件总线,源码
---

# Mitt源码学习

## 介绍

> [mitt](https://github.com/developit/mitt): Tiny 200b functional event emitter / pubsub.

- Microscopic: weighs less than 200 bytes gzipped
- Useful: a wildcard `"*"` event type listens to all events
- Familiar: same names & ideas as [Node's EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)
- Functional: methods don't rely on this
- Great Name: somehow [mitt](https://npm.im/mitt) wasn't taken

Mitt was made for the browser, but works in any JavaScript runtime. It has no dependencies and supports IE9+.

简单地说，`mitt` 是一个轻量级的JavaScript事件总线库，拥有简单而强大的API，总体大小仅为200字节。它具有与Node.js的EventEmitter类似的API和命名约定，并且没有依赖项。它支持IE9+以及任何JavaScript运行时环境。

## 使用示例

::: details

```js
import mitt from 'mitt'

const emitter = mitt()

// listen to an event
emitter.on('foo', e => console.log('foo', e) )

// listen to all events
emitter.on('*', (type, e) => console.log(type, e) )

// fire an event
emitter.emit('foo', { a: 'b' })

// clearing all events
emitter.all.clear()

// working with handler references:
function onFoo() {}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten
```

:::

## 源码

源码非常精简：

::: code-group

```js [index.js]
/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * @name mitt
 * @returns {Mitt}
 */
export default function mitt(all) {
  all = all || new Map()
  return {
    /**
     * A Map of event names to registered handler functions.
     */
    all,
    /**
     * Register an event handler for the given type.
     * @param {string|symbol} type Type of event to listen for, or `'*'` for all events
     * @param {Function} handler Function to call in response to given event
     * @memberOf mitt
     */
    on(type, handler) {
      const handlers = all.get(type)
      if (handlers) {
        handlers.push(handler)
      } else {
        all.set(type, [handler])
      }
    },
    /**
     * Remove an event handler for the given type.
     * If `handler` is omitted, all handlers of the given type are removed.
     * @param {string|symbol} type Type of event to unregister `handler` from (`'*'` to remove a wildcard handler)
     * @param {Function} [handler] Handler function to remove
     * @memberOf mitt
     */
    off(type, handler) {
      const handlers = all.get(type)
      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1)
        } else {
          all.set(type, [])
        }
      }
    },
    /**
     * Invoke all handlers for the given type.
     * If present, `'*'` handlers are invoked after type-matched handlers.
     *
     * Note: Manually firing '*' handlers is not supported.
     *
     * @param {string|symbol} type The event type to invoke
     * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
     * @memberOf mitt
     */
    emit(type, evt) {
      let handlers = all.get(type)
      if (handlers) {
        handlers.slice().map((handler) => {
          handler(evt)
        })
      }
      handlers = all.get('*')
      if (handlers) {
        handlers.slice().map((handler) => {
          handler(type, evt)
        })
      }
    }
  }
}
```

```js{2,5,13,23} [index.js(去除注释)]
export default function mitt(all) {
  all = all || new Map()
  return {
    all,
    on(type, handler) {
      const handlers = all.get(type)
      if (handlers) {
        handlers.push(handler)
      } else {
        all.set(type, [handler])
      }
    },
    off(type, handler) {
      const handlers = all.get(type)
      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1)
        } else {
          all.set(type, [])
        }
      }
    },
    emit(type, evt) {
      let handlers = all.get(type)
      if (handlers) {
        handlers.slice().map((handler) => {
          handler(evt)
        })
      }
      handlers = all.get('*')
      if (handlers) {
        handlers.slice().map((handler) => {
          handler(type, evt)
        })
      }
    }
  }
}
```

:::

源码中可以清晰地看到，闭包中的 all 存储了事件对应的处理方法

```js
{
  
}
```
