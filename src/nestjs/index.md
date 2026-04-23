# Nestjs

一个渐进式 Node.js 框架，用于构建高效、可靠且可扩展的服务器端应用。

[https://nestjs.com/](https://nestjs.com/)

## install

```bash
npm i -g @nestjs/cli

nest -h
```

## 核心

+ Module（模块）： 代码的组织单元（像一个盒子，把相关的代码打包）。
+ Controller（控制器）： 处理 HTTP 请求（负责路由、接收参数）。
+ Provider/Service（提供者/服务）： 处理业务逻辑（通过 DI 注入到 Controller 中）。

## start

::: code-group

```bash
nest new my-nest-app
```

```bash
nest g mo user  # 创建 模块
nest g co user  # 创建 控制器
nest g s user   # 创建 服务

# or
nest g res user
```
:::

### usage

#### 跨域

::: code-group

```bash [session]
npm install express-session
npm install -D @types/express-session
```

```diff [main.js]
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. 配置跨域 (CORS)
+  app.enableCors({
+    origin: true, // 允许所有源，或者写 ['https://apifox.com']
+    credentials: true, // 关键：如果使用 session/cookie，必须设为 true
+  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

:::

#### session

::: code-group

```bash
npm install express-session
npm install -D @types/express-session
```

```diff [main.js]
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // 允许所有源，或者写 ['https://apifox.com']
    credentials: true, // 关键：如果使用 session/cookie，必须设为 true
  });

  // 2. 配置 Session 中间件
+  app.use(
+    session({
+      name: 'token',           // 自定义 Cookie 的名字
+      secret: 'my-secret-key', // 用于签名 Cookie 的密钥
+      resave: false,           // 强制保存 session，即使没修改
+      saveUninitialized: false, // 建议设为 false，防止产生大量空 session
+      cookie: {
+        maxAge: 3600000,       // 过期时间（1小时）
+        httpOnly: true,        // 安全：前端 JS 无法通过 document.cookie 读取
+        secure: false,         // 本地 http 环境设为 false，生产 https 环境设为 true
+      },
+    }),
+  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

:::


## middleware

::: code-group

```bash
nest g mi logger
```

```js [logger.middleware.ts]
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  }
}
```

```diff [app.module.ts]
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
+ import { LoggerMiddleware } from './logger/logger.middleware';

@Module({
  controllers: [AppController],
  providers: [AppService],
})

+ export class AppModule implements NestModule {
+  configure(consumer: MiddlewareConsumer) {
+    consumer.apply(LoggerMiddleware).forRoutes('*');
+  }
}
```

:::

### 静态目录

1. `ServeStaticModule`
2. `useStaticAssets`

::: code-group

```bash [1. ServeStaticModule]
pnpm install @nestjs/serve-static
mkdir uploads # 穿创建静态目录
```

```diff [app.module.ts]
import { Module } from '@nestjs/common';
+ import { ServeStaticModule } from '@nestjs/serve-static';
+ import { join } from 'path';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
+    ServeStaticModule.forRoot({
+      rootPath: join(__dirname, '..', 'uploads'), // 静态目录
+      serveRoot: '/uploads', // URL 前缀
+    }),
  ],
})

export class AppModule {}
```

```js [2. app.module.ts]
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
+ import { NestExpressApplication } from '@nestjs/platform-express';
+ import { join } from 'path';

async function bootstrap() {
+  const app = (await NestFactory.create(AppModule)) as NestExpressApplication;

+  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
+    prefix: '/uploads', // 访问 URL 前缀
+  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

:::

### 文件上传 

::: code-group


```bash
mkdir uploads # 创建 uploads 目录

nest g module upload
nest g controller upload
```

```js [upload.module.ts]
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';

@Module({
  controllers: [UploadController]
})
export class UploadModule {}
```

```js [upload.controller.ts]
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import type { Response } from 'express';

@Controller('upload')
export class UploadController {
    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: join(__dirname, '..', '..', 'uploads'),
                filename: (req, file, callback) => {
                    const ext = file.originalname.split('.').pop();
                    const filename = `${Date.now()}.${ext}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    upload(@UploadedFile() file: any) {
        return {
            filename: file.filename,
            url: `/uploads/${file.filename}`,
        };
    }

    // 文件流下载
    @Get('stream')
    downloadStream(@Res() res: Response) {
        const filePath = join(__dirname, '..', '..', 'uploads', 'big.zip');
        const stream = createReadStream(filePath);

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=big.zip');

        stream.pipe(res);
    }

}
```
:::

## 拦截器 interceptor

::: code-group


```ts [response.interceptor.ts]
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => ({
                code: 200,
                message: 'success',
                data
            }))
        );
    }
}
```


```diff [app.module.ts]
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
+ import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  providers: [
+    {
+      provide: APP_INTERCEPTOR,
+      useClass: ResponseInterceptor,
+    },
  ],
})
export class AppModule {}

```

:::

## 过滤器 filter


::: code-group

```ts [common/filter/http.filter.ts]
import { Catch, ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const status = exception.getStatus();
        response.status(status).json({
            code: status,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url
        });
    }
}   
```

```diff [main.ts]
+ import { HttpFilter } from './common/filter/http.filter';

+ app.useGlobalFilters(new HttpFilter());
```

:::

## 管道 Pipes

在进入 Controller 之前，对参数进行“转换”或“验证”的工具。


| 类型                  | 管道               | 作用                               |
| --------------------- | ------------------ | ---------------------------------- |
| 校验类 Validation     | `ValidationPipe`   | 校验 DTO（字段类型、必填、格式等） |
| 转换类 Transformation | `ParseIntPipe`     | 字符串 → number                    |
|                       | `ParseBoolPipe`    | 字符串 → boolean                   |
|                       | `ParseUUIDPipe`    | 字符串 → UUID（也带一点校验）      |
|                       | `DefaultValuePipe` | 无值 → 默认值                      |
|                       | `ParseArrayPipe`   | 字符串 → 数组                      |

### 转换类 Transformation

::: code-group

```ts [xxx.controller.ts]
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';

  //  ParseIntPipe
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof (id), "typeof id");
    return this.pipesService.findOne(+id);
  }

  // ParseUUIDPipe
  // @Get(':id')
  // findOne(@Param('id', ParseUUIDPipe) id: string) {
  //   console.log(typeof (id), "typeof id");
  //   return this.pipesService.findOne(+id);
  // }
```

:::

### 校验类 Validation

[详见class-validator class-transformer](../js/class-validator.md#class-validator-class-transformer)

::: code-group

```bash
npm install class-validator class-transformer
```

```ts [create-user.dto.ts]
import { IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'name 必须是字符串类型' })
  name!: string;

  @IsInt({ message: 'age 必须是整数' })
  age!: number;
}
```

```ts [create-user.controller.ts]
import { CreateUserDto } from './create-user.dto';

@Post()
create(@Body() dto: CreateUserDto) {
  return dto;
}
```

```ts [main.ts]
import { ValidationPipe } from '@nestjs/common';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,   // 过滤 DTO 里没有的字段
      transform: true,   // 自动类型转换
    }),
  );

```
:::

## 守卫 guard

执行时机

```
Middleware → Guard → Interceptor → Pipe → Controller → Service
```

::: code-group

```bash
nest g gu auth
```

```ts [auth.guard.ts]
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // 简单示例：检查 header 是否带 token
    const token = request.headers['token'];

    if (token === '123456') {
      return true; // 放行
    }

    return false; // 拦截
  }
}

```

```ts [user.controller.ts]
// 局部守卫
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Controller('user')
export class UserController {
  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return '用户列表';
  }
}

```

```ts [main.ts]
// 全局 守卫
app.useGlobalGuards(new AuthGuard());
```
:::
