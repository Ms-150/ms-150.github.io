# decimal.js

一个用于 任意精度十进制算术 的 JavaScript 库。简单来说，它能让你在 JavaScript 中进行非常精确的浮点数计算，避免了标准 JavaScript 浮点数运算中常见的精度问题。

[https://www.npmjs.com/package/decimal.js](https://www.npmjs.com/package/decimal.js)

## install

```bash
npm install decimal.js
```

### 常用方法

1. 创建 `Decimal` 实例
   用于创建一个新的 Decimal 对象。value 可以是数字、字符串或另一个 Decimal 对象。

```js
new Decimal(0.1); // 不太推荐，可能已有精度问题
new Decimal("0.1"); // 推荐，直接精确表示
```

2. 数学运算
   这些方法都会返回一个新的 Decimal 实例，不会修改原有的实例（不可变性）。

- 加法 `.plus(value)`
- 减法 `.minus(value)`
- 乘法 `.times(value)`
- 除法 `.dividedBy(value)`
- 取模（余数） `.modulo(value)` / `.mod(value)`
- 幂运算 `.pow(exponent)`
- 平方根 `.sqrt()`
- 绝对值 `.abs()`
- 取负数（符号取反） `.neg()`

```js
new Decimal(0.1).plus(0.2);
new Decimal(0.3).minus(0.1);
new Decimal(2.5).times(3);
new Decimal(10).dividedBy(3);
new Decimal(10).modulo(3);
new Decimal(2).pow(10);
new Decimal(9).sqrt();
new Decimal(-5).abs();
new Decimal(5).neg();
```

3. 比较方法

这些方法返回布尔值（true 或 false）。

- `.equals(value)` / `.eq(value)`: 判断是否相等。
- `.greaterThan(value)` / `.gt(value)`: 判断是否大于。
- `.greaterThanOrEqualTo(value)` / `.gte(value)`: 判断是否大于或等于。
- `.lessThan(value)` / `.lt(value)`: 判断是否小于。
- `.lessThanOrEqualTo(value)` / `.lte(value)`: 判断是否小于或等于。
- `.comparedTo(value)` / `.cmp(value)`: 比较两个值。
  - 返回 1 如果 this > value
  - 返回 -1 如果 this < value
  - 返回 0 如果 this == value
  - 返回 null 如果 this 或 value 是 NaN

```js
new Decimal(0.1).plus(0.2).equals(0.3);
new Decimal(5).gt(3);
new Decimal(5).gte(5);
new Decimal(3).lt(5);
new Decimal(3).lte(3);
```

4. 舍入和精度控制

- `.toDecimalPlaces(decimalPlaces, roundingMode) / .toDP(decimalPlaces, roundingMode)`: 将数字四舍五入到指定的小数位数。
  - `decimalPlaces`: 要保留的小数位数。
  - `roundingMode` (可选): 舍入模式，可以使用 Decimal.ROUND_UP, Decimal.ROUND_DOWN, Decimal.ROUND_HALF_UP (默认) 等。
- `.toSignificantDigits(significantDigits, roundingMode)` / `.toSD(significantDigits, roundingMode)`: 将数字四舍五入到指定的有效数字位数。
- `.floor()`: 向下取整。
- `.ceil()`: 向上取整。
- `.round()`: 四舍五入到最接近的整数。

```js
new Decimal("1.23456").toDP(2, Decimal.ROUND_HALF_UP); // 结果是 '1.23'
new Decimal("123.456").toSD(3); // 结果是 '123'
new Decimal("3.7").floor(); // 结果是 '3'
new Decimal("3.2").ceil(); // 结果是 '4'
new Decimal("3.5").round(); // 结果是 '4'
```

5. 转换方法

- `.toString()`
  将 Decimal 对象转换为字符串。这是最常用的输出方法，确保精度不丢失。
- `.toNumber()`
  将 Decimal 对象转换为 JavaScript 的原生 number 类型。注意：这可能会导致精度丢失！ 只有在确定不会有精度问题或精度要求不高时才使用。
- `.toFixed(decimalPlaces, roundingMode)`
  类似于 Number.prototype.toFixed()，返回一个字符串，包含指定小数位数的固定点表示。
- `.toPrecision(significantDigits, roundingMode)`
  类似于 Number.prototype.toPrecision()，返回一个字符串，包含指定有效数字位数的固定点或指数表示。

```js
new Decimal(0.1).plus(0.2).toString(); // "0.3"
new Decimal("0.3").toNumber(); // 0.3
new Decimal(123.456).toFixed(2); // "123.46"
new Decimal(123.456).toPrecision(4); // "123.5"
```

### usage

```js
import Decimal from "decimal.js";

const a = new Decimal(0.1);
const b = new Decimal(0.2);
const c = a.plus(b);

console.log(c.toString()); // 0.3
```
