---
description: JS红宝书(Professional Javascript for Web Developers)第11章期约与异步函数11.2期约学习笔记，供个人复习使用
head:
  - - meta
    - name: keywords
      content: js,红宝书,学习笔记,Promise,期约
created: '2023-04-18'
---

# 第11章 第2节 期约

期约是对尚不存在结果的一个替身，是一种异步程序执行的机制。

## 11.2.1 Promises/A+规范

早期的期约机制在 jQuery 和 Dojo 中是以 Deferred API 的形式出现的。到了 2010 年，CommonJS 项目实现的 Promises/A 规范日益流行起来。Q 和 Bluebird 等第三方 JavaScript 期约库也越来越得到社区认可，虽然这些库的实现多少都有些不同。为弥合现有实现之间的差异，2012 年 Promises/A+组织分叉（fork）了 CommonJS 的 Promises/A 建议，并以相同的名字制定了 Promises/A+规范。这个规范最终成为了ECMAScript 6 规范实现的范本。

ECMAScript 6 增加了对 Promises/A+规范的完善支持，即 Promise 类型。一经推出，Promise 就大受欢迎，成为了主导性的异步编程机制。所有现代浏览器都支持 ES6 期约，很多其他浏览器 API（如fetch()和 Battery Status API）也以期约为基础。

## 11.2.2 期约基础

> 关键词：期约、执行器函数

ECMAScript 6新增的引用类型Promise，可以通过new操作符来实例化。创建新期约时，需要传入执行器（executor）函数作为参数

```javascript
let p = new Promise(() => {});
setTimeout(console.log, 0, p); // Promise <pending>
```

> Promise() 和 new Promise() 没有区别，它们是完全相同的。都是调用 Promise 构造函数创建 Promise 对象并返回。但出于语法上的习惯，更推荐使用 new Promise() 的写法。

### 1. 期约状态机

> 关键词：状态机、待定、兑现、解决、拒绝、落定

期约是一个有状态的对象：

- 待定（pending）
- 兑现（fulfilled，也称为“解决”，resolved）
- 拒绝（rejected）

待定为最初始状态，期约可以从待定状态落定为解决/拒绝，然后不再改变。也可能永远处于待定状态。

期约的状态是私有的，不能直接通过js检测到，也不能被外部js代码修改

### 2. 解决值、拒绝理由及期约用例

> 关键词：解决值、拒绝理由、期约用例

期约主要有两大用途：

首先是抽象地表示一个异步操作。某些情况下，这个状态机就是期约可以提供的最有用的信息；

在另一些情况下，期约封装的异步操作会实际生成某个值，而程序期待期约状态改变时可以访问这个值（解决后返回的值，或拒绝后返回的理由）

为了支持这两种用例，每个期约只要状态切换为兑现，就会有一个私有的内部值（value）。类似地，每个期约只要状态切换为拒绝，就会有一个私有的内部理由（reason）。无论是值还是理由，都是包含原始值或对象的不可修改的引用。二者都是可选的，而且默认值为 undefined。在期约到达某个落定状态时执行的异步代码始终会收到这个值或理由。

> "在期约到达某个落定状态时执行的异步代码始终会收到这个值或理由。"
>
> 这句话意味着一个期约如果处于某个落定状态（fulfilled/rejected），它可以反复去获取(then/catch)对应的值或理由

### 3. 通过执行函数控制期约状态
>
> 关键词：执行器函数

由于期约的状态是私有的，所以只能在内部进行操作。内部操作在期约的执行器函数中完成。执行器函数主要有两项职责：初始化期约的异步行为和控制状态的最终转换。

控制期约状态的转换是通过调用它的两个函数参数实现的，通常命名为 resolve() 和 reject()。

调用 reject()也会抛出错误（后面会讨论这个错误）。

```javascript
let p1 = new Promise((resolve,reject) => resolve());
setTimeout(console.log, 0, p1); // Promise <resolved>

let p2 = new Promise((resolve,reject) => reject());
setTimeout(console.log, 0, p2); // Promise <rejected>
// Uncaught error (in promise)
```

例子中，没有什么异步操作，因为在初始化期约时，执行器函数已经改变了每个期约的状态。这里的关键在于，执行器函数是同步执行的。这是因为执行器函数是期约的初始化程序。

> 下面是我提供的示例，展示执行器函数的同步执行：

```javascript
let p1 = new Promise((resolve, reject) => {
  console.log('promise initialized')
  resolve()
}); 
console.log(p1)
setTimeout(console.log, 0, p1);

// promise initialized
// Promise <resolved>
// Promise <resolved>
```

无论 resolve()和 reject()中的哪个被调用，状态转换都不可撤销了。于是继续修改状态会静默失败（不生效）

### 4. Promise.resolve()

> 关键词：静态方法、空包装、幂等性

期约并非一开始就必须处于待定状态，然后通过执行器函数才能转换为落定状态。通过调用 `Promise.resolve()` 静态方法，可以实例化一个解决的期约。下面两个期约实例实际上是一样的：

```javascript
let p1 = new Promise((resolve,reject) => resolve());
let p2 = Promise.resolve();
```

> 上例中，
>
> p1是使用构造函数 Promise 实例化一个期约，然后执行器函数初始化期约，将它落定为已解决状态；
>
> p2是使用静态方法 Promise.resolve() 实例化的一个解决的期约。
>
> 他们的结果相同但过程不同。
>
> p2（解决）的期约的值对应着静态方法的第一个参数

使用这个静态方法，实际上可以把任何值转换为一个期约：

```javascript
setTimeout(console.log, 0, Promise.resolve()); // Promise <resolved>: undefined
setTimeout(console.log, 0, Promise.resolve(3, 4, 5)); // Promise <resolved>: 3
```

对这个静态方法而言，如果传入的参数本身是一个期约，那它的行为就类似于一个空包装。因此，Promise.resolve() 可以说是一个幂等方法。

```javascript
let p = Promise.resolve(7)
setTimeout(console.log, 0, Promise.resolve(p)); // Promise <resolved>: 7
setTimeout(console.log, 0, p === Promise.resolve(p)); // true
setTimeout(console.log, 0, p === Promise.resolve(Promise.resolve(p))); // true
```

这个幂等性会保留传入期约的状态：

```javascript
let p = new Promise(() => {});
setTimeout(console.log, 0, p); // Promise <pending>
setTimeout(console.log, 0, Promise.resolve(p)); // Promise <pending>
setTimeout(console.log, 0, p === Promise.resolve(p)); // true
```

> 还能保存 rejected 状态

注意，这个静态方法能够包装任何非期约值，包括错误对象，并将其转换为解决的期约。因此，也可能导致不符合预期的行为：

```javascript
let p = Promise.resolve(new Error('foo'));
setTimeout(console.log, 0, p); // Promise <resolved>: Error: foo
```

### 5. Promise.reject()

与 Promise.resolve() 类似，Promise.reject() 会实例化一个拒绝的期约并抛出一个异步的错误（这个错误不能通过 try/catch 捕获，而只能通过拒绝处理程序捕获）。

> 期约的解决、拒绝是两种落定（处理方式），解决会对应一个解决值，拒绝会对应一个拒绝理由，这两者都是期约对象内部私有的。拒绝处理程序后面再讲
>
> try/catch 的功能是捕获代码块内同步执行时产生的异常
>
> 以下是个 try/catch 的示例

```javascript
try {
  throw new Error('Throw error')
  console.log('success')
} catch(err) {
  console.log('Caught error:', err.message)
}
// Caught error: Throw error

try {
  setTimeout(() => {
    throw new Error('Throw error')
  }, 0)
  console.log('success')
} catch(err) {
  console.log('Caught error:', err.message)
}
// success
// Uncaught Error: Throw error
```

下面的两个期约实例实际上是一样的：

```javascript
let p1 = new Promise((resolve,reject) => reject());
let p2 = Promise.reject();
```

这个拒绝的期约的理由就是传给 Promise.reject() 的第一个参数。这个参数也会传给后续的拒绝处理程序（then/catch）:

```javascript
let p = Promise.reject(3);
p.then(null, (e) => setTimeout(console.log, 0, e)); // 3
p.catch(e => setTimeout(console.log, 0, e)); // 3
```

> Promise的处理程序之后再讲
>
> 这里先对比下 Promise.resolve() 与 Promise.reject()

Promise.reject() 没有前者的幂等性，也不会保留传入期约的状态

```javascript
setTimeout(console.log, 0, Promise.resolve(Promise.resolve('foo')));
// Promise <resolved>: foo
setTimeout(console.log, 0, Promise.reject(Promise.resolve('foo')));
// Promise <rejected>: Promise
setTimeout(console.log, 0, Promise.reject(Promise.reject('foo')));
// Promise <rejected>: Promise
```

### 6. 同步/异步执行的二元性

> 关键词：二元性

Promise的设计很大程度上会导致一种完全不同于JavaScript的计算模式。下面的例子完美地展示了这一点：

```javascript
try {
  Promise.reject(new Error('bar'));
} catch(e) {
  console.log(e)
}
// Uncaught (in promise) Error: bar
```

代码中同步创建了一个拒绝的期约实例，而这个实例也抛出了包含拒绝理由的错误。这里的同步代码之所以没有捕获期约抛出的错误，是因为它没有通过异步模式铺货错误。从这里就可以看出期约的真正的异步特性：它们是同步对象（在同步执行模式中使用），但也是异步执行模式的媒介。

上例中，拒绝期约的错误没有抛到执行同步代码的线程里，而是通过浏览器异步消息队列来处理的。代码一旦开始以异步模式执行，则唯一与之交互的方式就是使用异步结构——更具体的说，就是期约的方法。

> 前面第三小节我们有学习到，期约的执行器函数是同步执行的
>
> 我们在第五小节学习到，Promise.reject() 静态方法会抛出一个不被 try/catch 捕获的异步错误。执行器函数中的reject 方法也一样。（这也意味着，需要使用Promise的错误捕捉函数，以避免该错误的抛出）
>
> 文中的示例可能不够明显，下面这个示例能更清楚它为什么会让人疑惑：

```javascript
try {
  new Promise((resolve,reject) => {
      throw new Error('foo')
      reject('bar')
  });
} catch(e) {
  console.log(e)
}
```

> 上例中，即便在执行器函数中我们先手动抛出一个异常，而不是通过执行器函数的reject函数参数拒绝，它也不会被 try/catch 捕捉。原因也是文中所说的“异步模式执行”

> 小结：
>
> 本节我们学习了实例化期约的方法，可以通过Promise构造函数或者Promise.resolve()/Promise.reject()静态方法
>
> 学习了Promise的执行器函数及其职责（初始化期约的异步行为和控制状态的最终转换），以及两个函数参数
>
> 学习了两个静态方法的使用及其特性，分别实例化成它们各自对应状态的期约实例
>
> 最后，学习了期约的同步/异步执行的二元性

## 11.2.3 期约的实例方法

期约的实例方法是连接外部同步代码与内部异步代码之间的桥梁。这些方法可以访问异步操作返回的数据，处理成期约成功和失败的结果。

### 1. 实现 Thenable 接口

在 ECMAScript 暴露的异步结构中，任何对象都有一个 then()方法。这个方法被认为实现了Thenable 接口。

ECMAScript 的 Promise 类型实现了 Thenable 接口，设定了 Thenable 接口更具体的形式。

本章后面再介绍异步函数时还会再谈到 Thenable 接口的用途和目的。

### 2. Promise.prototype.then()

> 关键词：处理程序、onResolved、onRejected

Promise.prototype.then() 是为期约实例添加处理程序的主要方法，接收最多两个参数：onResolved 和 onRejected 处理程序。这两个参数都是可选的，分别在期约进入“兑现”和“拒绝”状态时执行。

> 定义在原型上的方法，Promise实例可调用

```javascript
function onResolved(id) {
  setTimeout(console.log, 0, id, 'resolved')
}
function onRejected(id) {
  setTimeout(console.log, 0, id, 'rejected')
}
let p1 = new Promise((resolve,reject) => setTimeout(resolve, 3000));
let p2 = new Promise((resolve,reject) => setTimeout(reject, 3000));

p1.then(() => onResolved('p1'), () => onRejected('p1'));
p2.then(() => onResolved('p2'), () => onRejected('p2'));

// (3秒后)
// p1 resolved
// p2 rejected
```

因为期约只能转换为最终状态一次，所以这两个操作一定是互斥的。

传给 then() 的任何非函数类型的参数都会被静默忽略。如果只想提供 onRejected 参数，那 onResolved 参数可以传 undefined。这样有助于避免在内存中创建多余的对象，对期约函数参数的类型系统也是一个交代。

Promise.prototype.then() 方法返回一个新的期约实例：

```javascript
let p1 = new Promise(() => {});
let p2 = p1.then();
setTimeout(console.log, 0, p1);        // Promise <pending>
setTimeout(console.log, 0, p2);        // Promise <pending>
setTimeout(console.log, 0, p1 === p2); // false
```

> 注意，这里利用原型方法then的特性创建了一个新的期约。then的功能是为期约实例添加处理程序，但它自身的返回值是一个新的期约实例

这个新期约实例基于 onResolved 处理程序的返回值构建。换句话说，该处理程序的返回值会通过 Promise.resolve() 包装来生成新期约。

如果没有提供这个处理程序，则 Promise.resolve() 就会包装上一个期约解决之后的值。如果没有显示的返回语句，则 Promise.resolve() 会包装默认的返回值 undefined。

> 情况有点复杂，会通过静态方法 Promise.resolve() 包装一个值生成新实例。首先判断有没有提供 onResolved 处理程序，有则再判断该处理程序有没有显示的返回值。后一步还有两种特殊情况需注意，下面的示例中有展示

```javascript
let p1 = Promise.resolve('foo');
// 1）不传处理程序 —— 原样向后传
setTimeout(console.log, 0, p1.then()); // Promise <resolved>: foo

// 2）无显示的返回值 —— Promise.resolve() 包装默认的返回值 undefined
setTimeout(console.log, 0, p1.then(() => undefined));         // Promise <resolved>: undefined
setTimeout(console.log, 0, p1.then(() => {}));                // Promise <resolved>: undefined
setTimeout(console.log, 0, p1.then(() => Promise.resolve())); // Promise <resolved>: undefined

// 3）有显示的返回值 —— Promise.resolve() 包装这个值
setTimeout(console.log, 0, p1.then(() => 'bar'));                  // Promise <resolved>: bar
// 幂等性
setTimeout(console.log, 0, p1.then(() => Promise.resolve('bar'))); // Promise <resolved>: bar
// 状态传递
setTimeout(console.log, 0, p1.then(() => Promise.reject('bar')));  // Promise <rejected>: bar

// 4）抛出异常会返回拒绝的期约
setTimeout(console.log, 0, p1.then(() => { throw 'baz' })); // Promise <rejected>: baz
// Unught (in promise) baz
// 注意，返回错误值不会触发上面的拒绝行为，而会把错误对象包装在一个解决的期约中
setTimeout(console.log, 0, p1.then(() => Error('qux')));  // Promise <resolved>: Error: qux
```

onRejected 处理程序类似：onRejected 处理程序返回的值也会被 Promise.resolve() 包装。

乍一看这可能有点违反直觉，但是想一想，onRejected 处理程序的任务不就是捕获异步错误吗？

因此，拒绝处理程序在捕获错误后不抛出异常是符合期约的行为，应该返回一个解决期约。

> 打个比方，catch 后 then ？

```javascript
let p1 = Promise.reject('foo');

// 1）不传处理程序 —— 原样向后传
setTimeout(console.log, 0, p1.then()); // Promise <rejected>: foo

// 2）无显示的返回值 —— Promise.resolve() 包装默认的返回值 undefined
setTimeout(console.log, 0, p1.then(null, () => undefined));         // Promise <resolved>: undefined
setTimeout(console.log, 0, p1.then(null, () => {}));                // Promise <resolved>: undefined
setTimeout(console.log, 0, p1.then(null, () => Promise.resolve())); // Promise <resolved>: undefined

// 3）有显示的返回值 —— Promise.resolve() 包装这个值
setTimeout(console.log, 0, p1.then(null, () => 'bar'));                  // Promise <resolved>: bar
// 幂等性
setTimeout(console.log, 0, p1.then(null, () => Promise.resolve('bar'))); // Promise <resolved>: bar
// 状态传递
setTimeout(console.log, 0, p1.then(null, () => new Promise(() => {})));  // Promise <pending>

// 4）抛出异常会返回拒绝的期约
setTimeout(console.log, 0, p1.then(null, () => { throw 'baz' })); // Promise <rejected>: baz
// Unught (in promise) baz
// 注意，返回错误值不会触发上面的拒绝行为，而会把错误对象包装在一个解决的期约中
setTimeout(console.log, 0, p1.then(null, () => Error('qux')));  // Promise <resolved>: Error: qux
```

> 如果两个处理程序都不为空，执行哪个取决于期约的状态。Promise实例的then方法是用来定义解决/拒绝的处理程序的，只是它的返回值是一个新的Promise实例。而新的实例的状态、状态值会被两个处理程序影响。

```javascript
let p1 = Promise.resolve('foo'); // Promise <resolved>: foo
let p2 = Promise.reject('bar');  // Promise <rejected>: bar
let p3 = new Promise(() => {});  // Promise <pending>

function onResolved(id) {
  console.log('resolved', id)
  return 'resolved ' + id
}
function onRejected(id) {
  console.log('rejected', id)
  return 'rejected ' + id
}

setTimeout(console.log, 0, p1.then(() => onResolved('p1'), () => onRejected('p1')))
setTimeout(console.log, 0, p2.then(() => onResolved('p2'), () => onRejected('p2')))
setTimeout(console.log, 0, p3.then(() => onResolved('p3'), () => onRejected('p3')))
setTimeout(console.log, 0, p3 === p3.then(() => onResolved('p3'), () => onRejected('p3')))

// resolved p1
// rejected p2
// Promise <resolved>: resolved p1
// Promise <rejected>: rejected p2
// Promise <pending>
// false
```

> 上例中，p3的状态是pending，then 中两个处理程序都没有被执行
>
> 之所以要搞清楚 then 的返回值，可能是为了理解后面的期约实例方法的链式调用。
>
> 反过来，当知道链式调用，带着这个应用场景，是不是就更容易理解 then 的返回值了呢？（为什么无处理程序的将期约实例状态原样向后传；为什么无显示返回的，Promise.resolve() 包装 undefined；为什么显示返回的，用 Promise.resolve() 包装返回值；为什么抛出异常了，会返回拒绝的期约）

### 3. Promise.prototype.catch()

Promise.prototype.catch() 方法用于给期约添加拒绝处理程序，只接收一个参数：onRejected 处理程序。实际上，它就是一个语法糖，相当于 Promise.prototype.then(null, onRejected)。

Promise.prototype.catch() 也会返回一个新的期约实例，它的行为与 Promise.prototype.then() 的 onRejected 处理程序是一样的。

```javascript
let p = new Promise(() => {});
setTimeout(console.log, 0, p.catch()); // Promise <pending>
setTimeout(console.log, 0, p === p.catch()); // false
```

### 4. Promise.prototype.finally()

> 关键词：onFinally 处理程序、原样后传

Promise.prototype.finally() 方法用于给期约添加 onFinally 处理程序，这个处理程序在期约转换为解决或拒绝状态时都会执行。

这个方法可以避免 onResolved 和 onRejected 处理程序中出现冗余代码。onFinally 处理程序没有办法知道期约的状态是解决还是拒绝，所以这个方法主要用于添加清理代码。

```javascript
let p1 = Promise.resolve();
let p2 = Promise.reject();
function onFinally() {
  setTimeout(console.log, 0, 'Finally')
}

p1.finally(onFinally); // Finally
p2.finally(onFinally); // Finally
```

Promise.prototype.finally() 方法返回一个期约实例。这个新期约实例不同于 then()或 catch()方式返回的实例。因为 onFinally 被设计为一个状态无关的方法，所以在大多数情况下它将表现为父期约的传递。对于已解决状态和被拒绝状态都是如此。

```javascript
let p1 = Promise.resolve('foo');

// 以下都会原样后传
// Promise <resolved>: foo
setTimeout(console.log, 0, p1.finally());
setTimeout(console.log, 0, p1.finally(() => undefined));
setTimeout(console.log, 0, p1.finally(() => {}));
setTimeout(console.log, 0, p1.finally(() => Promise.resolve()));
setTimeout(console.log, 0, p1.finally(() => 'bar'));
setTimeout(console.log, 0, p1.finally(() => Promise.resolve('bar')));
setTimeout(console.log, 0, p1.finally(() => Error('qux')));
```

如果返回的是一个待定的期约，或者 onFinally 处理程序抛出了错误（显示抛出或者返回了一个拒绝期约），则会返回相应的期约（待定或拒绝）

> 注意，上例中说到，“大多数情况下它将表现为父期约的传递。对于已解决状态和被拒绝状态都是如此”，这里说的是父期约 p1 的状态是已解决/被拒绝状态时，大多会传递。
>
> (上例中 p1 = Promise.reject('foo') 时，打印的结果就都是 `Promise <rejected>: foo`)
>
> 下面这个例子，说的是 onFinally 处理程序返回了一个拒绝期约或抛异常

```javascript
let p1 = Promise.resolve('foo');

setTimeout(console.log, 0, p1.finally(() => new Promise(() => {}))); // Promise <pending>
setTimeout(console.log, 0, p1.finally(() => Promise.reject())); // Promise <rejected>: undefined
setTimeout(console.log, 0, p1.finally(() => { throw 'baz' })); // Promise <rejected>: baz
// Uncaught (in promise) baz
```

返回待定期约的情形并不常见，这是因为只要期约一解决，新期约仍然会原样后传初始的期约

```javascript
let p1 = Promise.resolve('foo'); 
// 忽略解决的值
let p2 = p1.finally( 
 () => new Promise((resolve, reject) => setTimeout(() => resolve('bar'), 100))
); 
setTimeout(console.log, 0, p2); // Promise <pending> 
setTimeout(() => setTimeout(console.log, 0, p2), 200); 
// 200 毫秒后：
// Promise <resolved>: foo
```

> onFinally 处理程序中返回待定状态，导致新期约为待定状态时，新期约的状态后续可能会被自动落定

### 5. 非重入期约方法

> 关键词：排期、非重入

当期约进入落定状态时，与该状态相关的处理程序仅仅会被**排期**，而非立即执行。跟在添加这个处理程序的代码之后的同步代码一定会在处理程序之前先执行。这个特性由 JavaScript 运行时保证，被称为“非重入”（non-reentrancy）特性。

```javascript
// 创建解决的期约
let p = Promise.resolve();
// 添加解决处理程序
// 直觉上，这个处理程序会等期约一解决就执行
p.then(() => console.log('onResolved handler'));
// 同步输出，证明 then()已经返回
console.log('then() returns');

// 实际的输出：
// then() returns 
// onResolved handler
```

在这个例子中，在一个解决期约上调用 then()会把 onResolved 处理程序推进消息队列。但这个处理程序在当前线程上的同步代码执行完成前不会执行。因此，跟在 then()后面的同步代码一定先于处理程序执行。

如果添加处理程序后，同步代码才改变期约状态，那么处理程序仍然会基于该状态变化表现出非重入特性。

> 先 then 后 resolve，then 的 onResolved 处理程序依旧后于同步代码

```javascript
let synchronousResolve;
// 创建一个期约并将解决函数保存在一个局部变量中
let p = new Promise((resolve) => {
  synchronousResolve = function() {
    console.log('1: invoking resolve()');
    resolve();
    console.log('2: resolve() returns');
  };
});
p.then(() => console.log('4: then() handler executes'));
synchronousResolve();
console.log('3: synchronousResolve() returns');
// 实际的输出：
// 1: invoking resolve() 
// 2: resolve() returns 
// 3: synchronousResolve() returns 
// 4: then() handler executes
```

非重入适用于 onResolved/onRejected 处理程序、catch()处理程序和 finally()处理程序。

### 6. 邻近处理程序的执行顺序

如果给期约添加了多个处理程序，当期约状态变化时，相关处理程序会按照添加它们的顺序依次执行。无论是 then()、catch()还是 finally()添加的处理程序都是如此。

> 有点类似于监听程序，触发多个监听，按定义顺序执行监听处理程序

### 7. 传递解决值和拒绝理由

到了落定状态后，期约会提供其解决值（如果兑现）或其拒绝理由（如果拒绝）给相关状态的处理程序。

> 应用场景包括执行函数、Promise.resolve() 和 Promise.reject()

### 8. 拒绝期约与拒绝错误处理

> 关键词：异步错误、拒绝错误处理

拒绝期约类似于 throw()表达式，因为它们都代表一种程序状态，即需要中断或者特殊处理。在期约的执行函数或处理程序中抛出错误会导致拒绝，对应的错误对象会成为拒绝的理由。

```javascript
let p1 = new Promise((resolve, reject) => reject(Error('foo'))); 
let p2 = new Promise((resolve, reject) => { throw Error('foo'); }); 
let p3 = Promise.resolve().then(() => { throw Error('foo'); }); 
let p4 = Promise.reject(Error('foo')); 

setTimeout(console.log, 0, p1); // Promise <rejected>: Error: foo 
setTimeout(console.log, 0, p2); // Promise <rejected>: Error: foo 
setTimeout(console.log, 0, p3); // Promise <rejected>: Error: foo 
setTimeout(console.log, 0, p4); // Promise <rejected>: Error: foo

// 也会抛出 4 个未捕获错误
```

期约可以以任何理由拒绝，包括 undefined，但最好统一使用错误对象。这样做主要是因为创建错误对象可以让浏览器捕获错误对象中的栈追踪信息，而这些信息对调试是非常关键的。

异步错误有意思的副作用：在期约中抛出错误时，因为错误实际上是从消息队列中异步抛出的，所以并不会阻止运行时继续执行同步指令

```javascript
Promise.reject(Error('foo')); 
console.log('bar'); 

// bar 
// Uncaught (in promise) Error: foo
```

如本章前面的 Promise.reject()示例所示，异步错误只能通过异步的 onRejected 处理程序捕获

```javascript
// 正确 
Promise.reject(Error('foo')).catch((e) => {}); 
// 不正确
try { 
  Promise.reject(Error('foo')); 
} catch(e) {}
```

then()和 catch()的 onRejected 处理程序在语义上相当于 try/catch。出发点都是捕获错误之后将其隔离，同时不影响正常逻辑执行。为此，onRejected 处理程序的任务应该是在捕获异步错误之后返回一个解决的期约。

```javascript
new Promise((resolve, reject) => {
  console.log('begin asynchronous execution');
  reject(Error('bar'));
}).catch((e) => {
  console.log('caught error', e);
}).then(() => {
  console.log('continue asynchronous execution');
});

// begin asynchronous execution 
// caught error Error: bar 
// continue asynchronous execution
```

> 结合之前 then/catch 方法的返回特性，可以在上例的期约异常捕获程序中返回想要的解决值给新创建的期约实例，以便在紧邻的 then 程序中使用

> 上一节我们学习了期约执行函数，它可以初始化期约实例、控制期约状态的落定
>
> 本节我们学习了期约实例的三个方法，包括他们的功能以及返回特性：
>
> then：定义解决处理程序，可以接收期约实例解决后的值；可定义拒绝处理程序，可接收实例的拒绝理由；
>
> catch：then 定义拒绝处理程序的语法糖；
>
> finally：定义期约实例解决/拒绝时的处理程序
>
> 上面三个期约实例方法都会返回新期约实例，其状态不一。必须熟练掌握

## 11.2.4 期约连锁与期约合成
