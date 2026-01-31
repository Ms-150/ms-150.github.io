# Ali-OSS

OSS（Object Storage Service）

阿里云对象存储 OSS（Object Storage Service）是一款海量、安全、低成本、高可靠的云存储服务，可提供 99.9999999999%（12 个 9）的数据持久性，99.995%的数据可用性。多种存储类型供选择，全面优化存储成本。

[https://help.aliyun.com/zh/oss/](https://help.aliyun.com/zh/oss/)


## usage

1. 安装 SDK
2. 创建 Bucket 并设置权限
3. 获取 AccessKey
    访问控制 RAM → 用户 → 创建用户 → 获取 AccessKeyId / AccessKeySecret
    建议创建专用子账号，并授予最小权限（如 AliyunOSSFullAccess 或自定义策略）。

## oss-browser2 浏览器

[https://help.aliyun.com/zh/oss/developer-reference/installing-the-ossbrowser-2-0?spm=a2c4g.11186623.0.0.223346efeSN7xA](https://help.aliyun.com/zh/oss/developer-reference/installing-the-ossbrowser-2-0?spm=a2c4g.11186623.0.0.223346efeSN7xA)

ossbrowser 2.0是一款用于管理OSS的免费图形化桌面客户端。

## 权限

Bucket 权限开启 公共读

## 使用
::: code-group

```bash [install]
npm i ali-oss
```

```js [upload]
const OSS = require('ali-oss');

const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: '你的KeyId',
  accessKeySecret: '你的KeySecret',
  bucket: '你的Bucket名称'
});

async function put() {
  try {
    const result = await client.put('test/hello.txt', './hello.txt');
    console.log(result.url);
  } catch (err) {
    console.error(err);
  }
}

put();

// 上传成功后，你会得到一个 URL：
// https://your-bucket.oss-cn-hangzhou.aliyuncs.com/test/hello.txt
```

### 客户端直传

[https://help.aliyun.com/zh/oss/user-guide/python-1?spm=a2c4g.11186623.0.0.15db5d03oLk0cl&userCode=okjhlpr5#c5d7a5a048tns](https://help.aliyun.com/zh/oss/user-guide/python-1?spm=a2c4g.11186623.0.0.15db5d03oLk0cl&userCode=okjhlpr5#c5d7a5a048tns)

跨域访问
安全授权

```text
┌──────────────────────┐
│        前端浏览器      │
└──────────┬───────────┘
           │ ① 选择文件
           ▼
┌──────────────────────┐
│  请求后端获取签名       │
│  GET /signature      │
└───────────┬──────────┘
            │ ② 请求签名
            ▼
  ┌────────────────────┐
  │      后端服务        │
  │ 生成 OSS V4 签名     │
  │ 返回 policy 等字段   │
  └──────────┬─────────┘
             │ ③ 返回签名 JSON
             ▼
┌──────────────────────────┐
│ 前端构造 FormData 表单     │
│ key / policy / signature │
│ x-oss-credential / file  │
└───────────┬─────────────┘
            │ ④ POST 上传
            ▼
  ┌──────────────────────┐
  │        OSS 服务       │
  │ 校验签名 & 保存文件     │
  └──────────┬───────────┘
             │ ⑤ 返回 204
             ▼
┌──────────────────────────┐
│ 前端拼接文件 URL           │
│ https://bucket.region/   │
│         + key            │
└──────────────────────────┘
```

```js [签名 密钥]
import OSS from 'ali-oss';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

// OSS 基础配置（使用固定 AK，不含 STS）
const config = {
  region: 'oss-cn-beijing',
  accessKeyId: 'XXXXXXXX',
  accessKeySecret: 'XXXXXXXX',
  bucket: 'nodejs-oss'
};

const client = new OSS(config);

app.get('/', async (req, res) => {
  // -------------------------------
  // 1. 设置签名过期时间（10 分钟）
  // -------------------------------
  const expire = new Date(Date.now() + 10 * 60 * 1000);
  const isoExpire = expire.toISOString();

  // -------------------------------
  // 2. 生成 V4 所需 credential
  //    格式：<AccessKeyId>/<Date>/<Region>/oss/request
  // -------------------------------
  const dateStr = isoExpire.split('T')[0];
  const credential = OSS.getCredential(
    dateStr,
    OSS.getStandardRegion(config.region),
    config.accessKeyId
  );

  // -------------------------------
  // 3. 构造 V4 policy
  //    必须包含：
  //    - bucket
  //    - x-oss-credential
  //    - x-oss-signature-version
  //    - x-oss-date
  //    - 文件大小限制（可选）
  // -------------------------------
  const policy = {
    expiration: isoExpire,
    conditions: [
      { bucket: config.bucket },
      { 'x-oss-credential': credential },
      { 'x-oss-signature-version': 'OSS4-HMAC-SHA256' },
      { 'x-oss-date': isoExpire },
      ['content-length-range', 0, 1048576000] // 限制最大 1GB
    ]
  };

  // -------------------------------
  // 4. 使用 OSS SDK 生成 V4 签名
  // -------------------------------
  const signature = client.signPostObjectPolicyV4(policy, new Date());

  // -------------------------------
  // 5. 拼接上传 host
  // -------------------------------
  const host = `https://${config.bucket}.${config.region}.aliyuncs.com`;

  // -------------------------------
  // 6. 返回前端直传所需字段
  // -------------------------------
  res.json({
    host, // 上传地址
    policy: Buffer.from(OSS.policy2Str(policy)).toString('base64'), // Base64 编码后的 policy
    signature, // V4 签名
    x_oss_credential: credential, // V4 credential
    x_oss_signature_version: 'OSS4-HMAC-SHA256', // 固定值
    x_oss_date: isoExpire, // ISO 格式时间
    dir: 'user-dir/' // 上传文件前缀（前端需自行拼接 key）
  });
});

app.listen(3000, () => {
  console.log('server is running on port 3000');
});
```

```js
document.getElementById('fileInput').addEventListener('change', async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    // 1. 获取服务端签名
    const res = await fetch("http://localhost:3000/");
    const data = await res.json();
    console.log("Fetched signature:", data);

    const {
        host,
        policy,
        signature,
        x_oss_credential,
        x_oss_signature_version,
        x_oss_date,
        dir
    } = data;

    // 2. 生成文件名（避免覆盖）
    const filename = Date.now() + "_" + file.name;
    const objectKey = dir + filename;

    // 3. 构造 V4 表单数据
    const formData = new FormData();
    formData.append("key", objectKey); // 必须字段
    formData.append("policy", policy);
    formData.append("signature", signature);
    formData.append("x-oss-credential", x_oss_credential);
    formData.append("x-oss-signature-version", x_oss_signature_version);
    formData.append("x-oss-date", x_oss_date);
    formData.append("file", file);

    // 4. 上传到 OSS
    const uploadRes = await fetch(host, {
        method: "POST",
        body: formData
    });

    if (uploadRes.ok) {
        const fileUrl = `${host}/${objectKey}`;
        console.log("Upload success:", fileUrl);
        alert("上传成功：" + fileUrl);
    } else {
        console.error("Upload failed:", uploadRes.statusText);
        alert("上传失败");
     }
    });
```

:::


