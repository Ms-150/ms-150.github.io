# class-validator class-transformer

+ `class-validator`  // 负责验证
+ `class-transformer` // 负责把普通对象变成 class 实例

## install

```bash
npm install class-validator class-transformer
```

## class-validator 

### 常用装饰器

::: code-group

```js [字符串]
@IsString()
@Length(2, 20)
@IsEmail()
@IsUrl()
```

```js [数字]
@IsInt()
@Min(1)
@Max(100)
```

```js [布尔]
@IsBoolean()
```

```js [数组]
@IsArray()
@ArrayMinSize(1)
```

```js [可选字段]
@IsOptional()
``` 

```js [条件验证]
@ValidateIf(o => o.type === 'email')
@IsEmail()
email?: string;
```

:::

## class-transformer

允许你将纯对象转换为某个类实例，反之亦然。它还允许基于条件进行对象序列化/反序列化。

| 能力              | 解释                  |
| ----------------- | --------------------- |
| `plainToInstance` | 普通对象 → Class 实例 |
| `instanceToPlain` | Class 实例 → 普通对象 |
| `@Type`           | 嵌套对象转换          |
| `@Expose`         | 控制返回包含字段      |
| `@Exclude`        | 控制返回排除字段      |
| `@Transform`      | 自定义字段转换        |

### usage

::: code-group

```ts [plainToInstance 基础转换]
// 纯对象变成可以调用方法的类实例
import { plainToInstance } from 'class-transformer';

class User {
  id: number;
  name: string;
  sayHi() { return `我是 ${this.name}`; }
}

const data = { id: 1, name: 'xxx' };
const user = plainToInstance(User, data);

console.log(user instanceof User); // true
console.log(user.sayHi());         // "我是 xxx"
```

```ts [@Type 嵌套对象/数组]
// 处理“对象里套对象”或“对象里套数组”。没有它，嵌套部分无法转成类。
import { Type } from 'class-transformer';

class Tag {
  label: string;
}

class Post {
  title: string;

  @Type(() => Tag) // 关键：告知数组里每一项都要转成 Tag 类
  tags: Tag[];
}

const data = { title: 'NestJS 教程', tags: [{ label: '后端' }, { label: 'TS' }] };
const post = plainToInstance(Post, data);

console.log(post.tags[0] instanceof Tag); // true
```

```ts [@Expose 白名单/重命名]
// 前端传来的字段名很难看，或者你只想保留特定的几个字段
import { Expose } from 'class-transformer';

class UserDto {
  @Expose({ name: 'user_name' }) // 把 JSON 里的 user_name 映射到这里的 username
  username: string;

  @Expose() // 只保留标记了 Expose 的字段（需开启策略）
  email: string;
}

const data = { user_name: 'ms_dev', email: 'test@test.com', secret: '123' };
// 注意：在 NestJS 中通常配合转换选项使用，这里展示手动转换
const user = plainToInstance(UserDto, data, { excludeExtraneousValues: true });

console.log(user); // { username: 'ms_dev', email: 'test@test.com' } (secret 被丢弃了)
```

```ts [@Exclude 黑名单/隐藏字段]
// 防止敏感信息（如密码）被意外返回给前端
import { Exclude, instanceToPlain } from 'class-transformer';

class User {
  id: number;

  @Exclude({ toPlainOnly: true }) // 当转回普通 JSON 发送给前端时，隐藏此字段
  password: string;
}

const user = new User();
user.id = 1;
user.password = 'secret123';

const plain = instanceToPlain(user);
console.log(plain); // { id: 1 } (password 消失了)
```

```ts [@Transform 自定义逻辑]
// 数据清洗。比如把后端传的 0/1 转成布尔，或者把日期字符串转成 Date 对象。
import { Transform } from 'class-transformer';

class Product {
  name: string;

  @Transform(({ value }) => value === 1 ? '上架' : '下架')
  status: string;

  @Transform(({ value }) => new Date(value))
  createdAt: Date;
}

const data = { name: '手机', status: 1, createdAt: '2026-04-01' };
const product = plainToInstance(Product, data);

console.log(product.status);    // "上架"
console.log(product.createdAt); // Date 对象
```
:::