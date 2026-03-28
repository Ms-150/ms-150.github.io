# multer

一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件。

```bash
npm install multer
```

::: code-group

```js [upload/multer.config.js]
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 限制文件大小 2MB
    // 限制文件类型（只允许图片）
    fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('只允许上传图片'));
    }
    cb(null, true);
  },
});

module.exports = upload;
```

```js [main.js]
const express = require('express');
const upload = require('./upload/multer.config');
const path = require('path');

const app = express();

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3000, () => console.log('Server running on 3000'));
```

:::

