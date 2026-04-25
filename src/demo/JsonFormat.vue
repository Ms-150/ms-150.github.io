<template>
  <div class="tool-box">
    <div class="actions-bar">
      <button @click="handleFormat" class="btn-flat primary">格式化</button>
      <button @click="handleMinify" class="btn-flat">压缩</button>
      <button @click="handleClear" class="btn-flat">清空</button>
      <button @click="copyText" class="btn-flat">复制</button>
    </div>
    <div class="editor-area">
      <div class="input-side">
        <textarea v-model="input" class="raw-input" placeholder="在此输入或粘贴 JSON..." spellcheck="false"></textarea>
      </div>
      <div class="preview-side">
        <JsonTree v-if="parsedData" :data="parsedData" />
        <div v-else class="empty-tip">等待输入内容...</div>
      </div>
    </div>
    <div v-if="error" class="error-footer">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import JsonTree from './JsonTree.vue'

const input = ref('')
const error = ref('')

const parsedData = computed(() => {
  try { return input.value.trim() ? JSON.parse(input.value) : null } catch (e) { return null }
})

function handleFormat() {
  try {
    if (!input.value.trim()) return
    input.value = JSON.stringify(JSON.parse(input.value), null, 2)
    error.value = ''
  } catch (e) { error.value = '语法错误: ' + e.message }
}

function handleMinify() {
  try {
    input.value = JSON.stringify(JSON.parse(input.value))
    error.value = ''
  } catch (e) { error.value = '压缩失败' }
}

function handleClear() { input.value = ''; error.value = '' }

function copyText() {
  if (!input.value) return
  navigator.clipboard.writeText(input.value).then(() => alert('已复制'))
}
</script>

<style scoped>
@import "./json-theme.css";

.empty-tip {
  color: var(--vp-c-text-3);
  font-size: 13px;
  font-style: italic;
}

.error-footer {
  padding: 8px 16px;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger);
  font-size: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

@media (max-width: 768px) {
  .editor-area {
    flex-direction: column !important;
    height: auto !important;
  }

  .input-side {
    height: 400px !important;
    flex: none !important;
    border-bottom: 1px solid var(--vp-c-divider) !important;
  }

  .preview-side {
    border-left: none !important;
    min-height: 400px !important;
    flex: none !important;
  }
}
</style>