# File 入门

在 JavaScript 中，`File` 接口是基于 `Blob` 接口的。这意味着 `File` 对象继承了 `Blob` 的所有属性和方法。简单来说，`File` 就是一种特殊的 `Blob`。

它们之间的主要区别在于：

- **Blob**：代表了一个不可变、原始数据的类文件对象，可以由 JavaScript 代码创建，包含任意类型的数据。
- **File**：代表了用户设备上的文件。它通常通过用户输入（例如 `<input type="file">` 元素）或拖放操作获得。`File` 对象除了继承 `Blob` 的 `size` 和 `type` 属性外，还额外包含了文件特有的属性，如 `name`（文件名）和 `lastModified`（文件最后修改时间）。

### 示例：从文件输入获取 File 对象

```html
<input type="file" id="fileInput" />
<script>
  document
    .getElementById("fileInput")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        console.log("文件名:", file.name);
        console.log("文件大小:", file.size, "字节");
        console.log("文件类型:", file.type);
        console.log("最后修改时间:", new Date(file.lastModified));

        // File 对象也是 Blob，所以可以使用 Blob 的方法，例如 slice
        const slicedFile = file.slice(0, 100);
        console.log("切片文件大小:", slicedFile.size, "字节");
      }
    });
</script>
```

总结来说，所有 `File` 对象都是 `Blob`，但并非所有 `Blob` 对象都是 `File`。`File` 对象是 `Blob` 的一个更具体、更丰富的数据类型，专门用于表示文件系统中的文件。

# Blob 入门

Blob（Binary Large Object）是 JavaScript 中用于处理二进制数据的一种对象。它代表了一个不可变、原始数据的类文件对象。Blob 可以包含任意类型的数据，例如文本、图像、音频或视频文件。

## Blob 的用途

Blob 在 Web 开发中有很多应用场景，例如：

1.  **文件上传**：在不将文件内容加载到内存中的情况下，直接将 Blob 对象作为文件上传。
2.  **文件下载**：通过创建 Blob URL，允许用户下载由 JavaScript 生成的文件。
3.  **图像处理**：读取图像文件为 Blob，然后进行处理（如缩放、裁剪）并显示。
4.  **数据存储**：将大量二进制数据存储在客户端（如 IndexedDB）。
5.  **媒体流**：处理音视频数据流。

## 创建 Blob 对象

你可以使用 `Blob()` 构造函数来创建一个 Blob 对象。它接受两个参数：

1.  `array`：一个由 `ArrayBuffer`、`ArrayBufferView`、`Blob`、`DOMString` 对象组成的数组。这些数据会按顺序连接起来，形成 Blob 的内容。
2.  `options`（可选）：一个对象，可以包含 `type`（MIME 类型）和 `endings`（如何处理包含换行符的字符串）属性。

### 示例：创建文本 Blob

```javascript
const textBlob = new Blob(["Hello, Blob!"], { type: "text/plain" });
console.log(textBlob.size); // 输出 Blob 的字节大小
console.log(textBlob.type); // 输出 Blob 的 MIME 类型：text/plain
```

### 示例：创建 JSON Blob

```javascript
const json = { name: "Alice", age: 30 };
const jsonBlob = new Blob([JSON.stringify(json)], { type: "application/json" });
console.log(jsonBlob.type); // 输出：application/json
```

## Blob 的属性

Blob 对象有两个只读属性：

- `size`：Blob 对象中数据的字节数。
- `type`：Blob 对象的 MIME 类型。如果类型未知，则为空字符串。

## Blob 的方法

- `slice([start[, end[, contentType]]])`：返回一个新的 Blob 对象，其中包含原始 Blob 中指定范围的数据。这对于分块上传大文件非常有用。

  ```javascript
  const originalBlob = new Blob(["abcdefghijklmnopqrstuvwxyz"], {
    type: "text/plain",
  });
  const slicedBlob = originalBlob.slice(0, 5); // 包含 'abcde'
  console.log(slicedBlob.size); // 5
  ```

## Blob 与 URL

### `URL.createObjectURL()`

这个方法可以创建一个 DOMString，其中包含一个 URL，该 URL 可以表示 Blob 或 File 对象的内容。这个 URL 是一个特殊的内部 URL，只能在当前文档的生命周期内使用。

```javascript
const imageBlob = new Blob(
  [
    '<svg><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>',
  ],
  { type: "image/svg+xml" }
);
const imageUrl = URL.createObjectURL(imageBlob);

const img = document.createElement("img");
img.src = imageUrl;
document.body.appendChild(img);

// 当不再需要时，释放 URL 资源
// URL.revokeObjectURL(imageUrl);
```

### `URL.revokeObjectURL()`

当你不再需要通过 `URL.createObjectURL()` 创建的 URL 时，应该调用 `URL.revokeObjectURL()` 来释放它。这会告诉浏览器不再需要这个 URL，从而允许垃圾回收机制释放内存。

## 读取 Blob 内容

要读取 Blob 的内容，通常会使用 `FileReader` 对象。

### 示例：将 Blob 读取为文本

```javascript
const textBlob = new Blob(["Hello, FileReader!"], { type: "text/plain" });
const reader = new FileReader();

reader.onload = function () {
  console.log(reader.result); // 输出：Hello, FileReader!
};

reader.readAsText(textBlob);
```

### 示例：将 Blob 读取为 ArrayBuffer

```javascript
const binaryBlob = new Blob([new Uint8Array([1, 2, 3, 4])], {
  type: "application/octet-stream",
});
const reader = new FileReader();

reader.onload = function () {
  const arrayBuffer = reader.result;
  const uint8Array = new Uint8Array(arrayBuffer);
  console.log(uint8Array); // 输出：Uint8Array [1, 2, 3, 4]
};

reader.readAsArrayBuffer(binaryBlob);
```

## 总结

Blob 是 JavaScript 处理二进制数据的重要工具，它在文件操作、数据传输和多媒体处理方面提供了强大的能力。理解 Blob 的创建、属性、方法以及如何与 URL 和 FileReader 结合使用，是进行现代 Web 开发的基础。
