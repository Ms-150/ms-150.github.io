# node-schedule

一个灵活的定时任务调度库，允许你在特定的时间或周期性地执行任务。

::: code-group

```bash [install]
npm i node-schedule
```

```js [start]
const schedule = require("node-schedule");

// 创建一个任务计划，每分钟的第30秒执行一次
const job = schedule.scheduleJob("30 * * * * *", function () {
  console.log("每分钟的第30秒执行一次任务");
});

// 取消任务计划
job.cancel();
```

:::

::: tip

`*` 代表所有可能的值，例如 `* * * * *` 表示每分钟执行一次。

`30 * * * * *` 是一个 Cron 风格的时间表达式，用于调度任务。它的各个字段含义如下：

1. 秒（0 - 59） : `30` 表示在每分钟的第 30 秒执行。
2. 分（0 - 59） : `*` 表示每分钟都执行。
3. 时（0 - 23） : `*` 表示每小时都执行。
4. 日（1 - 31） : `*` 表示每天都执行。
5. 月（1 - 12） : `*` 表示每月都执行。
6. 星期（0 - 7，星期天为 0 或 7） : `*` 表示每周的每一天都执行。

:::

## Cron 表达式

Cron 表达式是一个用于指定任务调度时间的字符串，它由 6 个字段组成，分别表示秒、分、时、日、月、星期。

- `*` 表示所有可能的值。
- `,` 用于分隔多个值。
- `-` 用于指定一个范围。
- `/` 用于指定步长。

例如：

- `0 0 * * * *` 表示每天的 0 点整执行。
- `0 0 8,16 * * *` 表示每天的 8 点和 16 点整执行。
- `0 */10 * * * *` 表示每隔 10 分钟执行一次。
- `0 0 8-17 * * *` 表示每天 8 点到 17 点之间每隔一小时执行一次。
- `0 0 0 1 * *` 表示每月的第一天的 0 点整执行。



```js
import schedule from 'node-schedule'
import axios from 'axios'
import config from './config.js'
schedule.scheduleJob('0 30 0 * * *', async () => {
    try {
        const response = await axios.post(config.check_url, {}, {
            headers: {
                Referer: config.url,
                Cookie: config.cookie
            }
        })
        console.log(response.data)
    } catch (error) {
        console.error('请求失败：', error)
    }
})
```
