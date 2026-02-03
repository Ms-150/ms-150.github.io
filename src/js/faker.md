# faker

生成大量虚假（但真实）的数据用于测试和开发。

[https://fakerjs.dev/](https://fakerjs.dev/)

## install

```bash
npm i @faker-js/faker
```

## usage

::: code-group

```js
import { faker } from '@faker-js/faker';

const randomName = faker.person.fullName(); // Rowan Nikolaus
const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
```

```js [本地化]
import { fakerZH_CN as faker } from '@faker-js/faker';

// or
import { Faker, zh_CN } from '@faker-js/faker';

// 这里的 zh_CN 就是包含了中文定义的数据对象
const faker = new Faker({
  locale: [zh_CN],
});
```

:::

### 常用 API 速查

| 模块       | 方法             | 示例说明          |
| ---------- | ---------------- | ----------------- |
| `person`   | fullName()       | 张三 / John Doe   |
| `location` | city()           | 上海市 / New York |
| `phone`    | number()         | 电话号码          |
| `internet` | email()          | 电子邮件          |
| `number`   | int({ min: 10 }) | 随机整数          |
| `string`   | uuid()           | 通用唯一识别码    |

## 进阶配置

### 固定随机种子 (Seed)

::: code-group

```js [seed]
import { faker } from '@faker-js/faker';

faker.seed(123);
// 只要种子是 123，下面生成的结果永远固定
console.log(faker.string.uuid());
```

:::