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

[源码](https://github.com/developit/mitt/blob/main/src/index.ts)非常精简，不过，为了方便阅读，下面提供了js源码及类型声明：

::: code-group

```js [index.ts]
export type EventType = string | symbol;

// An event handler can take an optional event argument
// and should not return a value
export type Handler<T = unknown> = (event: T) => void;
export type WildcardHandler<T = Record<string, unknown>> = (
  type: keyof T,
  event: T[keyof T]
) => void;

// An array of all currently registered event handlers for a type
export type EventHandlerList<T = unknown> = Array<Handler<T>>;
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<
  WildcardHandler<T>
>;

// A map of event types and their corresponding event handlers.
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
  keyof Events | '*',
  EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>;

export interface Emitter<Events extends Record<EventType, unknown>> {
  all: EventHandlerMap<Events>;

  on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
  on(type: '*', handler: WildcardHandler<Events>): void;

  off<Key extends keyof Events>(
    type: Key,
    handler?: Handler<Events[Key]>
  ): void;
  off(type: '*', handler: WildcardHandler<Events>): void;

  emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
  emit<Key extends keyof Events>(
    type: undefined extends Events[Key] ? Key : never
  ): void;
}

/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * @name mitt
 * @returns {Mitt}
 */
export default function mitt<Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>
): Emitter<Events> {
  type GenericEventHandler =
    | Handler<Events[keyof Events]>
    | WildcardHandler<Events>;
  all = all || new Map();

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
    on<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
      if (handlers) {
        handlers.push(handler);
      } else {
        all!.set(type, [handler] as EventHandlerList<Events[keyof Events]>);
      }
    },

    /**
     * Remove an event handler for the given type.
     * If `handler` is omitted, all handlers of the given type are removed.
     * @param {string|symbol} type Type of event to unregister `handler` from (`'*'` to remove a wildcard handler)
     * @param {Function} [handler] Handler function to remove
     * @memberOf mitt
     */
    off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        } else {
          all!.set(type, []);
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
    emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
      let handlers = all!.get(type);
      if (handlers) {
        (handlers as EventHandlerList<Events[keyof Events]>)
          .slice()
          .map((handler) => {
            handler(evt!);
          });
      }

      handlers = all!.get('*');
      if (handlers) {
        (handlers as WildCardEventHandlerList<Events>)
          .slice()
          .map((handler) => {
            handler(type, evt!);
          });
      }
    }
  };
}
```

```js{2,5,13,23} [index.js(去除ts及注释)]
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

```js [DTS]
export type EventType = string | symbol
export type Handler<T = unknown> = (event: T) => void
export type WildcardHandler<T = Record<string, unknown>> = (
  type: keyof T,
  event: T[keyof T]
) => void
export type EventHandlerList<T = unknown> = Array<Handler<T>>
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
  keyof Events | '*',
  EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>
export interface Emitter<Events extends Record<EventType, unknown>> {
  all: EventHandlerMap<Events>
  on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void
  on(type: '*', handler: WildcardHandler<Events>): void
  off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void
  off(type: '*', handler: WildcardHandler<Events>): void
  emit<Key extends keyof Events>(type: Key, event: Events[Key]): void
  emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void
}
/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * @name mitt
 * @returns {Mitt}
 */
export default function mitt<Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>
): Emitter<Events>
```

:::

### 分析

- all

源码中可以清晰地看到，mitt 方法利用闭包，使用一个 `Map` 对象存储事件及对应处理方法列表（`type => handlers`，`handlers: [handler1,handler2,...]`）

- on & off
  
`on`, `off` 就是一个按事件名**添加**/**移除** `handler`。

需要注意的是调用 `off` 而不指定 `handler` 时会移除该事件所有的 `handler`。

另外，`*` 事件 `handler` 参数有所不同，它多了一个参数 `type`。

- emit

**触发**事件，除了执行该事件的 `handlers` 外，还会执行 `*` 事件的 `handlers`（如果存在）。

需要注意的是，`emit('*', evt)` 是毫无意义的，参考源码，`*` 的 `handlers` 会执行两次，且两次都是错误的传参。

- all.clear()

使用 `all.clear()` 清空所有事件的事件监听，通过源码可以知道，由于 `all` 是直接暴露出来的 `Map` 对象，`all.clear()` 实际上就是 `Map.prototype.clear()` 方法。（完全可以使用 `all.has()`, `all.get()`, `all.keys()` 方法读取事件相关信息。通过 `all.delete(type)` 移除事件虽然可行，却是不规范的。）

### 演练

在vue中跨组件使用时，需要注意它的作用域

下面提供一个简单的hook, `useEventBus.js`:

```js
import mitt from 'mitt'

const emitter = mitt()

export const useEventBus = () => {
  return {
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
    all: emitter.all
  }
}
```

使用：

```js
import { useEventBus } from 'path/to/useEventBus.js'

const { on, off, all, emit } = useEventBus()
```

[在线练习一下吧](https://play.vuejs.org/#eNq1V81y2zYQfhUMe5DckSlbSS+spCZxfWinTjpNegp7oMilxZgCOQQoy6Po3fstwB/QlpO0jjUjAdg/7C6+BVZ773VZ+tuavMCbq7jKSi0U6bpchjLblEWlxV5UlIqDSKtiI0YQHTmsWtHllqR+U6tOxJ86VP+T6uUvik153kmZFe89FJgNBGaNQCjjQirespATUaTpRER5PhG0yTR2XriejE9YvpDj0Y+jiRjru5IguNUnYrEU+1AKwbaKnPy8uB6PCilYbi86QXGABf7OpzYnyAYWmjZlHmnCSoh5km1FnEdKLULvtorK0DN0cNY/LZHV+RRjQ7GBT93lrFnOpzCE2XzqmJ8rfZfzxGfL1udVUSVUBeflTsD3LBE/nJ2d/dxzTqsoyWoViJflzpDLKEkyeR2cnzWETVRdZzI4n8EEax5MgGYnb+Jphayk2TVOrJCAg9k09GL4muVUvSt1hqyFXmDdYR5OoLj93dB0VdOkpcdrim+O0D+pHdNC78+KFFVbCr2Op+Ecacu+fP+Wdph3zE2R1Dmkv8D8i5CVmn20Ym9qmcBtR854+5sBGtLyQV3uNEnVBsWOsuTByIceYMfH9Fjovbsv/JdGD/lEFgFHjQwif7QzkE4ojepci7SWMZsRLDGGLycwVrEm5sAv/37+LCTdiquoBIQNr0ItVrKVNLKTdg6AW8SuIxNqZ5A/tloajrL2fXhsVBrj/MlSMW6lBgZEp+yXtVq3Qo7qQVCuaKjDu+D+aBz72Cj942q1UyS6DSRNnzcSh3WP40SpyjyLqTPhZzKh3bu0V1wul+JsIs6dPY8n4UEa3PidDBxNBl9o7pXlWM7pe52oMqGe+BsgrQ/Q3I7HkjNmTwYhHDvQ3r7jHK7gZ/atz9VXPWwmZuBiHb5TqNnmGeIS7V6hpqJHrMRfi0c+Jk0VIjX1bHbjb1P1Vsh9HRdi7EZxv7ALGbQ2fbxwTmk4dLx6Lkx6Do8dC6nvOVi4QfMPAu+e3q88+3hp5VVRS00JT99QWlT0t9ww6YktwX9/0K18nuFnwc6NP3JceyGLQJxPkPKEAjGKomjUXOKW9aJjxXE8ZM061mq1siyUqukdmqjH7aFBhxuKirbAKP0BJ7i1MA9vL/GwsRjKI1ZWMO2FKWiQ/W2U14SI+oWvi/fIJe8eTVau+fY2xPPJNebLQpyKFYaW3cDKbrNYLJAPhaB/MRqBOMXQlIJxoe1zOOLB4Q7ixvU8CPypzZFBn9selUu2G8ynjD9DYf3tKRyCfikyabITeiK4oTsm+XxunVEo5NGK8uVbHOp8audzVUZSLPd7UXKeDocJWEy7r3RhIHBMjTeB4kCt7dce6dya4jJt6/P21P+3gBpsmAoa8VmGsutN7J16geGaxsQ3NOI0L9I95AOjpgGygGVADOxoUhpdzBXpdZFgd2toOjXPQkJ4yOgBpAzfrR+WXUfqnuBjkuax+SZJQAguWZ+fhOGZi+EWFQ6w2A2bbjSOXe0DTg3SVlX7jwAqmSxrbf6CYDtu5QvAPUuwQAVjahLdr07R9VKOtbEKyqvYnBoo7iGC4exh9hW2qoyd5WsVt+58gycJDVxpl0/2xRpa/oph6E1fbJivaq2BrVcxGoQbaA1BBv0PIHDzLBrSfGpVvlCth38B2bHcYg==)

### 总结

实际上事件监听(`handler`)的添加就是定义回调函数，以便在未来触发(`emit`)时找到并执行它们。

通过 on 添加监听，off 移除监听(一个或全部)，emit 触发事件，all.clear 清空所有事件监听。
