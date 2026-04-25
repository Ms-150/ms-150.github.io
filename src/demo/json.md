---
title: JSON 工具箱
aside: false
---

# JSON 工具箱

本页面提供常用的 JSON 处理工具，包括格式化和差异对比。

## JSON 格式化与压缩

用于快速格式化混淆的 JSON 数据或压缩 JSON 文本。

<script setup>
import JsonFormat from './JsonFormat.vue'
import JsonDiff from './JsonDiff.vue'
</script>

<JsonFormat />

## JSON 差异对比

对比两个 JSON 对象之间的键值差异。

<JsonDiff />