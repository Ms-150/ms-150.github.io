# UNI-APP

[https://www.dcloud.io](https://www.dcloud.io)

## HBuilder X

[https://www.dcloud.io/hbuilderx.html](https://www.dcloud.io/hbuilderx.html)

## 语法

### CSS 变量

[https://uniapp.dcloud.net.cn/tutorial/syntax-css.html#css-%E5%8F%98%E9%87%8F](https://uniapp.dcloud.net.cn/tutorial/syntax-css.html#css-%E5%8F%98%E9%87%8F)

| CSS 变量              | 描述                   |
| --------------------- | ---------------------- |
| `--status-bar-height` | 系统状态栏高度         |
| `--window-top`        | 内容区域距离顶部的距离 |
| `--window-bottom`     | 内容区域距离底部的距离 |

## 编译器

[https://uniapp.dcloud.net.cn/tutorial/compiler.html](https://uniapp.dcloud.net.cn/tutorial/compiler.html)

### 条件编译

以 `#ifdef` 或 `#ifndef` 加 `%PLATFORM% `开头，以 `#endif` 结尾。

#### 基本语法结构

+ `#ifdef`：if defined 仅在某平台存在
+ `#ifndef`：if not defined 除了某平台均存在
+ `%PLATFORM%`：平台名称
  
  还支持 `&&` `||` `!`

###### 常用平台识别码 (`%PLATFORM%`)

| 识别码        | 生效条件                                     | 备注        |
| ------------- | -------------------------------------------- | ----------- |
| `VUE3`        | 特殊标记：仅在 Vue3 环境下生效               |             |
| `APP-PLUS`    | App 端（包含 iOS 和 Android）                |             |
| `H5`          | H5 端（浏览器/移动端网页）                   |             |
| `MP-WEIXIN`   | 微信小程序                                   |             |
| `MP-ALIPAY`   | 支付宝小程序                                 |             |
| `MP`          | 所有小程序平台（微信、支付宝、百度、头条等） |             |
| `APP-IOS`     | 仅 iOS App                                   | 仅 uts 支持 |
| `APP-ANDROID` | 仅 Android App                               | 仅 uts 支持 |

::: code-group

```js [APP-PLUS]
// #ifdef APP-PLUS

// #endif
```

```js [H5]
// #ifdef H5

// #endif
```

```js [MP-WEIXIN || MP-ALIPAY]
// #ifdef MP-WEIXIN || MP-ALIPAY
// 仅在微信或支付宝小程序中执行（例如：小程序专用的登录逻辑）

// #endif
```

```js [!H5]
/* #ifdef !H5 */
/* 除了 H5 平台以外，其他所有平台都生效的样式 */
/* 用于屏蔽浏览器环境，保留 App 和小程序环境 */
.page-container {
  padding-top: var(--status-bar-height);
}
/* #endif */
```
:::

## Build 打包

- Android 设置

1. 包名 com.xxx.xxx

2. 打包类型

- 打包正式
- 打自定义调试基座

3. 打包方式

- 传统打包 上传代码及证书
- 快速安心打包 不上传代码及证书

## 制作自定义调试基座

# 1. 自定义调试基座打包完成的路径

`/unpackage/debug/android_debug.apk`
菜单运行-手机或模拟器-制作自定义调试基座


## UNI PUSH

UniApp 提供的一项推送服务，允许你在应用中实现消息推送。

左侧菜单栏 - uni-push
[https://dev.dcloud.net.cn/pages/app/push/info](https://dev.dcloud.net.cn/pages/app/push/info)

## UNI 插件

### 支付宝原生扫码插件 mpaas

[https://ext.dcloud.net.cn/plugin?id=2636](https://ext.dcloud.net.cn/plugin?id=2636)

[https://help.aliyun.com/product/49548.html?spm=a2c4g.11186623.0.0.7f623f64M1elTb](https://help.aliyun.com/product/49548.html?spm=a2c4g.11186623.0.0.7f623f64M1elTb)

::: code-group

```json [Andriod manifest.json]
{
  "nativePlugins": {
    "Mpaas-Scan": {
      "AppId": "ALIPUB_xxx",
      "WorkspaceId": "your_WorkspaceId",
      "License": "your_License",
      "__plugin_info__": {
        "name": "支付宝原生扫码插件",
        "description": "支付宝原生扫码组件，包体积仅0.7MB，15分钟即可完成接入。同时，mPaaS提供「扫码分析」大盘，",
        "platforms": "Android,iOS",
        "url": "",
        "android_package_name": "",
        "ios_bundle_id": "",
        "isCloud": false,
        "bought": -1,
        "pid": "",
        "parameters": {
          "AppId": {
            "des": "Android平台的AppId，请填写Android的config文件中的appId对应的值",
            "key": "mobilegw.appid",
            "value": ""
          },
          "WorkspaceId": {
            "des": "Android平台的WorkspaceId，请填写Android的config文件中的workspaceId对应的值",
            "key": "workspaceId",
            "value": ""
          },
          "License": {
            "des": "Android平台的License,，请填写Android的config文件中的mpaasConfigLicense对应的值",
            "key": "mpaasConfigLicense",
            "value": ""
          }
        }
      }
    }
  }
}
```

```md [IOS meta.config]
Ant-mpaas-ALIPUB_xxx-xxx-iOS-3.config >>> nativeplugins/Mpaas-Scan/ios/meta.config
```

:::

## 服务空间

[https://unicloud.dcloud.net.cn](https://unicloud.dcloud.net.cn)

## 离线打包 IOS

### 准备工作

+	`Xcode`: 从 App Store 下载最新稳定版。
+	App 离线 `SDK`: 从 DCloud 官网 下载与你 HBuilderX 版本对应的 iOS SDK。
+	Apple 开发者证书: 需要 `.mobileprovision` 配置文件和 `.p12` 证书用于真机运行或发布。

### 流程

#### 第一步：导出离线打包资源

在 HBuilderX 中打开你的项目：
1. 点击菜单栏：发行 -> 原生 App-本地打包 -> 生成本地打包 App 资源。
2. 导出成功后，你会得到一个以 __UNI__XXXXXXX 命名的文件夹。

#### 第二步：配置 Xcode 工程

1. 解压下载的 iOS SDK，在目录中找到 HBuilder-Hello 示例工程并用 Xcode 打开。
2. 替换资源：将第一步生成的 __UNI__XXXXXXX 文件夹，拷贝到 Xcode 工程的 Pandora/apps/ 目录下。
3. 修改配置文件：打开工程中的 control.xml，将 appid 修改为你的 __UNI__XXXXXXX 名称。

#### 第三步：Xcode 编译设置

1. `Bundle Identifier`: 设置为你自己的包名（需与苹果开发者后台一致）。
2. `Signing` & `Capabilities`: 配置你的开发者证书和描述文件。
3. `Info.plist`: 如果你的 App 需要调用摄像头、定位等，需在此配置对应的权限声明。

### 原生工程 配置

[https://nativesupport.dcloud.net.cn/AppDocs/usesdk/ios.html](https://nativesupport.dcloud.net.cn/AppDocs/usesdk/ios.html)

 + 配置Appkey

### 模块/三方SDK 配置

[https://nativesupport.dcloud.net.cn/AppDocs/usemodule/iOSModuleConfig/geolocation.html](https://nativesupport.dcloud.net.cn/AppDocs/usemodule/iOSModuleConfig/geolocation.html)

::: code-group

``` [配置 Library]
工程根目录 > TARGETS > Build Phases > Link Binary With Libraries

点击“+”可以添加，选中 .a 库
点击“-”可以删除
```

``` [配置 framework]
工程根目录 > TARGETS > Build Phases > Link Binary With Libraries

点击”+“可以添加，选中 .framework 库
点击“-”可以删除
```

:::

::: warning
HTML5+ Runtime
打包时未添加Camera模块，请参考
https://ask.dcloud.net.cn/article/283
:::

+ Camera(摄像头)/Gallery(图片选择)

 | SDK中的依赖库  | 系统依赖库                                                       | 资源文件                                                                                                             | 权限描述                                                                                                               |
 | -------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
 | liblibCamera.a | DCTZImagePickerController.bundle DCMediaEditingController.bundle | AssetsLibrary.framework Accelerate.framework Photos.framework CoreMedia.framework MetalKit.framework GLKit.framework | NSCameraUsageDescription NSPhotoLibraryUsageDescription NSPhotoLibraryAddUsageDescription NSMicrophoneUsageDescription |
