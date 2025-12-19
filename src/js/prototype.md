# 原型 `prototype` 原型链 `__proto__`

- 原型 prototype 函数特有

  用于定义构造函数的原型对象。

- 原型链 _proto_ | [[prototype]]

  用于指向该对象的原型对象。

```md
NUll
  ^
  |  __proto__
        		prototype
Object.prototype    <-   Object (构造函数)
                    ->
        		constructor
  ^
  |  __proto__
                    prototype
Function.prototype    <-    Function (构造函数)
                      ->
                    constructor
  ^
  |  __proto__
                    prototype
Person.prototype      <-     Person (构造函数)
(实例原型)             ->
                    constructor
  ^
  |  __proto__
                    new
实例对象 p1    ↙️
```
