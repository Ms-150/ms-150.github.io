# UNI-APP

[https://www.dcloud.io](https://www.dcloud.io)

## HBuilder X

[https://www.dcloud.io/hbuilderx.html](https://www.dcloud.io/hbuilderx.html)

## Build 打包

- Android 设置

1. 包名 com.example.app

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

### 传统打包

```bash

```

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
      "AppId": "ALIPUB2516601311823",
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

日志

## 服务空间

[https://unicloud.dcloud.net.cn](https://unicloud.dcloud.net.cn)
