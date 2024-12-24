---
description: Mitt源码学习
head:
  - - meta
    - name: keywords
      content: mitt,eventbus,事件总线,源码
created: '2024-06-28'
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

### 小结

实际上事件监听(`handler`)的添加就是定义回调函数，以便在未来触发(`emit`)时找到并执行它们。

通过 on 添加监听，off 移除监听(一个或全部)，emit 触发事件，all.clear 清空所有事件监听。

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

在线练习一下吧：

<ClientOnly>
  <FullScreen>
    <DemoIframe title="Demo Title" src="https://play.vuejs.org/#eNq1V81y2zYQfhUMe5DckSlbSS+spCZxfWinTjpNegp7oMilxZgCOQQoy6Po3fstwB/QlpO0jjUjAdg/7C6+BVZ773VZ+tuavMCbq7jKSi0U6bpchjLblEWlxV5UlIqDSKtiI0YQHTmsWtHllqR+U6tOxJ86VP+T6uUvik153kmZFe89FJgNBGaNQCjjQirespATUaTpRER5PhG0yTR2XriejE9YvpDj0Y+jiRjru5IguNUnYrEU+1AKwbaKnPy8uB6PCilYbi86QXGABf7OpzYnyAYWmjZlHmnCSoh5km1FnEdKLULvtorK0DN0cNY/LZHV+RRjQ7GBT93lrFnOpzCE2XzqmJ8rfZfzxGfL1udVUSVUBeflTsD3LBE/nJ2d/dxzTqsoyWoViJflzpDLKEkyeR2cnzWETVRdZzI4n8EEax5MgGYnb+Jphayk2TVOrJCAg9k09GL4muVUvSt1hqyFXmDdYR5OoLj93dB0VdOkpcdrim+O0D+pHdNC78+KFFVbCr2Op+Ecacu+fP+Wdph3zE2R1Dmkv8D8i5CVmn20Ym9qmcBtR854+5sBGtLyQV3uNEnVBsWOsuTByIceYMfH9Fjovbsv/JdGD/lEFgFHjQwif7QzkE4ojepci7SWMZsRLDGGLycwVrEm5sAv/37+LCTdiquoBIQNr0ItVrKVNLKTdg6AW8SuIxNqZ5A/tloajrL2fXhsVBrj/MlSMW6lBgZEp+yXtVq3Qo7qQVCuaKjDu+D+aBz72Cj942q1UyS6DSRNnzcSh3WP40SpyjyLqTPhZzKh3bu0V1wul+JsIs6dPY8n4UEa3PidDBxNBl9o7pXlWM7pe52oMqGe+BsgrQ/Q3I7HkjNmTwYhHDvQ3r7jHK7gZ/atz9VXPWwmZuBiHb5TqNnmGeIS7V6hpqJHrMRfi0c+Jk0VIjX1bHbjb1P1Vsh9HRdi7EZxv7ALGbQ2fbxwTmk4dLx6Lkx6Do8dC6nvOVi4QfMPAu+e3q88+3hp5VVRS00JT99QWlT0t9ww6YktwX9/0K18nuFnwc6NP3JceyGLQJxPkPKEAjGKomjUXOKW9aJjxXE8ZM061mq1siyUqukdmqjH7aFBhxuKirbAKP0BJ7i1MA9vL/GwsRjKI1ZWMO2FKWiQ/W2U14SI+oWvi/fIJe8eTVau+fY2xPPJNebLQpyKFYaW3cDKbrNYLJAPhaB/MRqBOMXQlIJxoe1zOOLB4Q7ixvU8CPypzZFBn9selUu2G8ynjD9DYf3tKRyCfikyabITeiK4oTsm+XxunVEo5NGK8uVbHOp8audzVUZSLPd7UXKeDocJWEy7r3RhIHBMjTeB4kCt7dce6dya4jJt6/P21P+3gBpsmAoa8VmGsutN7J16geGaxsQ3NOI0L9I95AOjpgGygGVADOxoUhpdzBXpdZFgd2toOjXPQkJ4yOgBpAzfrR+WXUfqnuBjkuax+SZJQAguWZ+fhOGZi+EWFQ6w2A2bbjSOXe0DTg3SVlX7jwAqmSxrbf6CYDtu5QvAPUuwQAVjahLdr07R9VKOtbEKyqvYnBoo7iGC4exh9hW2qoyd5WsVt+58gycJDVxpl0/2xRpa/oph6E1fbJivaq2BrVcxGoQbaA1BBv0PIHDzLBrSfGpVvlCth38B2bHcYg==" />
  </FullScreen>
</ClientOnly>

> **mitt VS vue$emit**
>
> vue父子组件通信中，emit是非常重要的方法之一。父组件内调用子组件时绑定方法/事件，子组件内使用 $emit 调用/触发。
>
> 对比之下，和 mitt 的 on/emit 是否很相似呢？最大的不同之处在于vue只能在父子组件上使用
>
> mitt无需同组件绑定，使用起来要方便得多。但代价就是项目中大量使用时，你需要花更多的时间理清依赖关系

- via mitt

::: code-group

```js [useEventBus.js]
import mitt from 'mitt'
import { onBeforeUnmount } from 'vue'

const emitter = mitt()

export const useEventBus = (option) => {
  if (Array.isArray(option)) {
    option.forEach((item) => {
      emitter.on(item.name, item.callback)
    })
    onBeforeUnmount(() => {
      option.forEach((item) => {
        emitter.off(item.name)
      })
    })
  } else if (option) {
    emitter.on(option.name, option.callback)
    onBeforeUnmount(() => {
      emitter.off(option.name)
    })
  }

  return {
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
    all: emitter.all
  }
}
```

```vue [App.vue]
<script setup>
import { useEventBus } from './useEventBus'
import Grandson from './Grandson.vue'

useEventBus({
  name: 'nameChange',
  callback: handleNameChange
})

function handleNameChange(val) {
  console.log('Name changed:', val)
}
</script>
<template>
  <div>
    <!-- import Grandson somewhere -->
    <Grandson />
  </div>
</template>
```

```vue [Grandson.vue]
<script setup>
import { ref } from 'vue'
import { useEventBus } from './useEventBus'

const { emit } = useEventBus()

const name = ref('abc')
</script>
<template>
  <input v-model="name" @input="emit('nameChange', name)">
</template>
```

:::

在线演示：

<ClientOnly>
  <FullScreen>
    <DemoIframe title="Mitt 演练" src="https://play.vuejs.org/#eNq1Vm1v2jAQ/iteviRMEDZtnxCgrRWaNmnttJdPyz6k4QJpEzuyHUpF+e+7cxLHBEY3aUUKcXzPnZ97fH7Zee/LMtxU4E28qUpkVmqmQFflPOJZUQqp2Y5VChYb4PqiUmzPUikK5odjp9e34A8y5ksluEW1HTQGwiLuuAW7iDPG4wImzKfX5TrmK/CH1J3EeX4TJ3cThp3LHK6sPeL7AUVKK57oDMfqA4JNnA+YCZ4IrkQOYS5WgU8IlhjIcuIPGcEwWMSn4zp1THqqoSjzWAO2GZsus41pYPPFaMT6WSpRwP0aJLDRqMVZ47gOMa5jTMc2sjf0tEJmabYKbxGJ2huykZeIosxykNclJaYib1KnQTbUQ9x/Mn1aVmBEMj5rSO5O9N+qLfVF3hcJCuQGIs/adCxXoGvz4tsVbLFtjYVYVjmizxi/AqpaEccadlHRDEgHZ9h+NHJlfPVdLbYauGqTIqKE3Bt85GFxXJ5JvaP7Jnxr/HDaUMUi0xoVRP1gayZmCWlc5ZrZ0iBEgFyoHCR5YpvNzP/jI+Nwzz7HZTCobRILX/IWabDDti14oB9KGDbFJm1A+lGV6dai6vghMjYuTXD6ZSkLWtRBAGadw7JS6xbkuO4Z5AoOfWgUXKwNsZ+N0y/Xq22i0G0iafq8mTimnsXJUpV5loANEWZ8CdvrtHOcz+fs1ZC9dsY8LcKRDG7+jgInxQCsj8YPNvqAbg7/a0aVSXUQFlhpXYKz+R/ECYjJQQqnJrSL75DzX/rPzK3T6kmGTcO8aLE6G3+9ZpvNlJaoPS6aFe2Tkz1/BL+AVEj4wQtRcW3PIHOkIJCeunBpPjVIlMQsfEOLnmZ7qEHucTZjgTAbjps0CfdeyvghzJR5txhHxbonRFqLOFkHQYa7e1+4hk2IeweZQzrihsw029PNCtdJ2Ms2CPph/2ZoZ3Bc73Z0d56Ohm5WF2XfamIjOqk0w9fJNB9H6TyZhEvPiXhMqp3C4+1Z8InDy93gnP40PVjsnYXe1oT0Owt+9ErXvcScuyhJSA+L89/uUG0V7wwVhM1cN6xmiyCp0IrjBX58k+CqP3OHyXhZabYZ4dEN+SzyyDny2DvTj99mEzy4f5n4g8jrXVv2vwGZG1Hv" />
  </FullScreen>
</ClientOnly>

- without mitt

::: code-group

```vue [App.vue]
<script setup>
import { ref, provide, watch } from 'vue'
import Grandson from './Grandson.vue'

const name = ref()
provide('changeName', val => name.value = val)

watch(name, handleNameChange)

function handleNameChange(val) {
  console.log('Name changed:', val)
}
</script>
<template>
  <div>
    <!-- import Grandson somewhere -->
    <Grandson />
  </div>
</template>
```

```vue [Grandson.vue]
<script setup>
import { ref, inject } from 'vue'

const changeName = inject('changeName', val => {})

const name = ref('abc')
</script>
<template>
  <input v-model="name" @input="changeName(name)">
</template>
```

:::

在线演示：

<ClientOnly>
  <FullScreen>
    <DemoIframe title="without mitt | mitt usage" src="https://play.vuejs.org/#eNqFUsuO2zAM/BVWF3sBPw7tKXAWbReLoj1si7ZHXVybcZTKkiDJToDA/15KXjuLdB8n05whOaTmzD4ZU4wDsg2rXGOF8eDQD+aWK9EbbT2cweIuA2P1KFrM4Fj7Zg8T7KzuIaHSZKV+sbVqnVaPWFEuiTCBaFw1WjkPqu4RtqFvesPVY+c0afa16vCBwCSDsZawvY3UguIhFNCX+FxFCWmAMqCaVsaiu1geCbtBNV6QkGs0DS3gzBVAkKIlFlJ3aRIYMM9vN/N0ajRxVZXzVegelcfeyNojxQBVK8YYUPguz+H6BE73eNyjRcjzhbeC5dyinHtU5dqZZcw7UrYTXXEgJj1LFMtZo3sjJNrvJizmONvMawSsllIfv8WctwNmS77ZY/P3mfzBnUKOsx8WHdoROVsxX9sO/Qzf/3rAE8Ur2Ot2kMR+BfyJdNUhaJxpn4fwAvYJL6r9Gs8lVPfb3Z88KrcsFYQG5hT5nJFz7l5Z/SL3ffEh1tGz0RWfOu9Nbwt1wMZfeXox68WV5MCZ+bxVz1P03n8WT+o/TULQy1YSygwexpwuiHLLWSjmDD7GPP1fpkXT33B25ZrpH3t9R5Q=" />
  </FullScreen>
</ClientOnly>