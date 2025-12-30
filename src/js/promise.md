# Promise

Promise（承诺）是一个对象，代表了一个异步操作的最终完成（或失败）及其结果值。

## Promise 的三种状态
一个 Promise 对象在其生命周期中，只会处于以下三种状态之一：
1. 待定（pending）：初始状态，既没有成功，也没有失败。
2. 已兑现/已成功（fulfilled）：意味着操作成功完成。
3. 已拒绝/已失败（rejected）：意味着操作失败。
已敲定（settled）：当 Promise 变为 fulfilled 或 rejected 状态时，就称为已敲定。一旦敲定，状态就不会再改变。


## example

::: code-group
```js [1]
// 1. 定义状态常量，这是 Promise 的三种互斥状态
const PENDING = 'pending';      // 初始等待中
const FULFILLED = 'fulfilled';  // 已成功
const REJECTED = 'rejected';    // 已失败

class MyPromise {
    // 构造函数，在 new MyPromise(...) 时立即执行
    constructor(executor) {
        // 1.1. 初始化状态
        this.status = PENDING;
        this.value = undefined;     // 存储成功时的值
        this.reason = undefined;    // 存储失败时的原因

        // 1.2. 存储回调（发布/订阅模式需要）
        // 为什么需要数组？因为一个 Promise 可能被多次 then()
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        // 1.3. 确保 resolve 和 reject 中的 this 指向当前 Promise 实例
        // 否则在 executor 外部调用它们时，this 可能会丢失
        const resolve = this.resolve.bind(this);
        const reject = this.reject.bind(this);

        // 1.4. 立即执行传入的 executor 函数
        try {
            executor(resolve, reject);
        } catch (error) {
            // 如果 executor 函数执行过程中出错，直接标记为拒绝状态
            reject(error);
        }
    }

    // 2. 占位：resolve 和 reject 方法将在下一步实现
    resolve() {}
    reject() {}

    // 3. 占位：then 方法将在第三步实现
    then() {}
}
```

```js [2]
// ... (MyPromise 类的构造函数和常量保持不变) ...

class MyPromise {
    // ... (constructor, status, value, reason, callbacks 保持不变) ...

    // 2.1. 成功方法
    resolve(value) {
        // 必须确保状态是 PENDING 才能改变 (状态不可逆)
        if (this.status === PENDING) {
            this.status = FULFILLED; // 改变状态
            this.value = value;      // 存储结果值

            // 发布：执行所有已订阅的成功回调
            this.onFulfilledCallbacks.forEach(callback => {
                // Promise 规范要求回调必须异步执行，这里用 setTimeout(fn, 0) 模拟
                setTimeout(() => callback(this.value), 0);
            });
        }
    }

    // 2.2. 失败方法
    reject(reason) {
        // 必须确保状态是 PENDING 才能改变
        if (this.status === PENDING) {
            this.status = REJECTED; // 改变状态
            this.reason = reason;    // 存储失败原因

            // 发布：执行所有已订阅的失败回调
            this.onRejectedCallbacks.forEach(callback => {
                // Promise 规范要求回调必须异步执行
                setTimeout(() => callback(this.reason), 0);
            });
        }
    }
    
    // 3. 占位：then 方法将在下一步实现
    then() {} 
}
```

```js [3]
// ... (MyPromise 类的所有内容保持不变) ...

class MyPromise {
    // ... (constructor, resolve, reject 保持不变) ...

    // 3. then 方法
    then(onFulfilled, onRejected) {
        // 3.1. 处理 PENDING 状态：订阅 (异步操作时)
        if (this.status === PENDING) {
            // 将回调函数推入数组中等待 resolve/reject 调用
            this.onFulfilledCallbacks.push(onFulfilled);
            this.onRejectedCallbacks.push(onRejected);
        }

        // 3.2. 处理 FULFILLED 状态：立即执行 (同步操作或 then 在 resolve 后调用)
        if (this.status === FULFILLED) {
            // 规范要求必须异步执行
            setTimeout(() => {
                onFulfilled(this.value);
            }, 0);
        }

        // 3.3. 处理 REJECTED 状态：立即执行 (同步操作或 then 在 reject 后调用)
        if (this.status === REJECTED) {
            // 规范要求必须异步执行
            setTimeout(() => {
                onRejected(this.reason);
            }, 0);
        }
        
        // 🚨 警告：此简易版没有实现链式调用 (then 必须返回 new MyPromise)
    }
}
```

```js [4]
class MyPromise {
    // ... (constructor, status, value, reason, callbacks 保持不变) ...
    // ... (resolve, reject 方法保持不变) ...

    then(onFulfilled, onRejected) {
        // --- 1. 默认值穿透和错误穿透处理 ---
        // 如果 onFulfilled/onRejected 没有传，需要提供默认函数实现值和错误的向下传递
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

        // --- 2. 关键：then 必须返回一个新的 Promise (promise2) ---
        const promise2 = new MyPromise((resolve, reject) => {
            // 核心目标：根据上一个 then 的执行结果 x，调用 promise2 的 resolve(x) 或 reject(e)

            // 封装回调处理逻辑
            const handleCallback = (callback, data) => {
                // 确保异步执行，规范要求
                setTimeout(() => {
                    try {
                        // 1. 执行上一个 Promise 的回调，获取返回值 x
                        const x = callback(data);

                        // 2. 根据 x 的值来决定 promise2 的状态 (这是最复杂的一步)
                        resolvePromise(promise2, x, resolve, reject); 

                    } catch (e) {
                        // 3. 如果执行回调时出错，直接拒绝 promise2
                        reject(e);
                    }
                }, 0);
            };

            // --- 3. 处理三种状态 ---

            if (this.status === PENDING) {
                // 订阅：将带有链式逻辑的 handleCallback 推入回调数组
                this.onFulfilledCallbacks.push(() => { handleCallback(onFulfilled, this.value); });
                this.onRejectedCallbacks.push(() => { handleCallback(onRejected, this.reason); });
            }

            if (this.status === FULFILLED) {
                // 立即执行成功逻辑
                handleCallback(onFulfilled, this.value);
            }

            if (this.status === REJECTED) {
                // 立即执行失败逻辑
                handleCallback(onRejected, this.reason);
            }
        });

        return promise2; // 返回新的 Promise
    }
}
```

```js
/**
 * Promise 解决过程 (Promises/A+ 规范 2.3)
 * 根据 x 的类型和值，决定 promise2 应该 resolve 还是 reject
 */
function resolvePromise(promise2, x, resolve, reject) {
    // 2.3.1 规则：防止循环引用，如 return promise2;
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise'));
    }

    let called = false; // 用于确保 resolve 或 reject 只被调用一次

    // 2.3.3 规则：如果 x 是对象或函数（可能是另一个 Promise）
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        try {
            // 尝试获取 x.then 方法
            let then = x.then;

            // 如果 x 是一个 thenable 对象 (有 then 方法)
            if (typeof then === 'function') {
                // 调用 x.then，并将 promise2 的 resolve/reject 传递给它
                then.call(x, (y) => {
                    if (called) return;
                    called = true;
                    // 递归处理 y，直到它是一个普通值
                    resolvePromise(promise2, y, resolve, reject);
                }, (r) => {
                    if (called) return;
                    called = true;
                    reject(r);
                });
            } else {
                // x 是普通对象或函数，但没有 then 方法，则直接用 x 解决 promise2
                resolve(x);
            }
        } catch (e) {
            // 如果获取 then 或执行 then.call 报错，则拒绝 promise2
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        // 2.3.4 规则：x 是普通值（非对象、非函数），直接用 x 解决 promise2
        resolve(x);
    }
}
```
:::
