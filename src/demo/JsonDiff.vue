<template>
  <div class="json-diff-container">
    <div class="json-panels">
      <div class="json-panel">
        <div class="panel-header">
          <h3>JSON 1</h3>
          <div class="panel-actions">
            <button @click="clearJson(1)" class="action-btn">清空</button>
            <button @click="copyJson(1)" class="action-btn">复制</button>
          </div>
        </div>
        <pre v-if="diffMode" class="json-diff-view" v-html="json1WithDiff"></pre>
        <textarea v-else v-model="json1" rows="15" class="json-textarea" placeholder="请在此输入JSON数据..."></textarea>
        <div class="panel-actions">
          <button @click="formatJson(1)" class="format-btn">格式化</button>
        </div>
      </div>
      <div class="json-panel">
        <div class="panel-header">
          <h3>JSON 2</h3>
          <div class="panel-actions">
            <button @click="clearJson(2)" class="action-btn">清空</button>
            <button @click="copyJson(2)" class="action-btn">复制</button>
          </div>
        </div>
        <pre v-if="diffMode" class="json-diff-view" v-html="json2WithDiff"></pre>
        <textarea v-else v-model="json2" rows="15" class="json-textarea" placeholder="请在此输入JSON数据..."></textarea>
        <div class="panel-actions">
          <button @click="formatJson(2)" class="format-btn">格式化</button>
        </div>
      </div>
    </div>
    <div class="compare-section">
      <button @click="compare" class="compare-btn">对比差异</button>
      <div class="diff-type-selector">
        <label>
          <input type="radio" v-model="diffType" value="keys" /> 仅对比键
        </label>
        <label>
          <input type="radio" v-model="diffType" value="full" /> 完整对比
        </label>
      </div>
    </div>
    <div v-if="diff" class="diff-result">
      <div class="diff-header">
        <h3>差异结果</h3>
        <button @click="copyDiff" class="action-btn">复制结果</button>
      </div>
      <pre v-html="processedDiff"></pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 自定义指令：处理差异标记的转换
// 处理差异标记的转换
const processDiffMarkers = (text) => {
  if (!text) return ''
  return text
    .replace(/\[removed\](.*?)\[\/removed\]/g, '<span class="diff-removed">$1</span>')
    .replace(/\[added\](.*?)\[\/added\]/g, '<span class="diff-added">$1</span>')
    .replace(/\[changed\](.*?)\[\/changed\]/g, '<span class="diff-changed">$1</span>')
    .replace(/\[equal\](.*?)\[\/equal\]/g, '<span class="diff-equal">$1</span>')
}

// 高亮差异的函数
function highlightDiff(text1, text2) {
  const lines1 = text1.split('\n')
  const lines2 = text2.split('\n')
  let result = ''

  // 逐行比较并添加高亮
  for (let i = 0; i < lines1.length; i++) {
    const line1 = lines1[i]
    const line2 = lines2[i]

    if (line1 === line2) {
      result += line1 + '\n'
    } else if (!line2) {
      result += `<span class="diff-removed">${line1}</span>\n`
    } else if (line1 !== line2) {
      result += `<span class="diff-changed">${line1}</span>\n`
    }
  }

  return result.trim()
}

// 处理后的差异结果
const processedDiff = computed(() => processDiffMarkers(diff.value))

const json1 = ref('')
const json2 = ref('')
const diff = ref('')
const diffMode = ref(false)
const json1WithDiff = ref('')
const json2WithDiff = ref('')

const diffType = ref('keys') // 默认只对比键

function formatJson(idx) {
  try {
    if (idx === 1) {
      const parsed = JSON.parse(json1.value)
      json1.value = JSON.stringify(parsed, null, 2)
    } else {
      const parsed = JSON.parse(json2.value)
      json2.value = JSON.stringify(parsed, null, 2)
    }
  } catch (e) {
    showNotification(`JSON ${idx} 格式有误: ${e.message}`)
  }
}

function clearJson(idx) {
  diffMode.value = false
  if (idx === 1) {
    json1.value = ''
    json1WithDiff.value = ''
  } else {
    json2.value = ''
    json2WithDiff.value = ''
  }
}

function copyJson(idx) {
  const text = idx === 1 ? json1.value : json2.value
  if (!text) {
    showNotification('没有内容可复制')
    return
  }
  copyToClipboard(text)
}

function copyDiff() {
  if (!diff.value) {
    showNotification('没有差异结果可复制')
    return
  }
  // 移除HTML标签后复制
  const plainText = diff.value.replace(/<\/?[^>]+(>|$)/g, '')
  copyToClipboard(plainText)
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('已复制到剪贴板')
  }).catch(err => {
    showNotification('复制失败: ' + err)
  })
}

function showNotification(message) {
  // 使用更友好的通知替代alert
  const notification = document.createElement('div')
  notification.className = 'json-notification'
  notification.textContent = message
  document.body.appendChild(notification)

  // 2秒后自动消失
  setTimeout(() => {
    notification.classList.add('fade-out')
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 2000)
}

function compare() {
  try {
    const obj1 = JSON.parse(json1.value || '{}')
    const obj2 = JSON.parse(json2.value || '{}')
    
    if (diffType.value === 'keys') {
      diff.value = getKeysDiff(obj1, obj2)
    } else {
      diff.value = getFullDiff(obj1, obj2)
    }
    
    // 在文本框中显示差异
    diffMode.value = true
    const formatted1 = JSON.stringify(obj1, null, 2)
    const formatted2 = JSON.stringify(obj2, null, 2)
    
    // 为两个文本框添加差异高亮
    json1WithDiff.value = highlightDiff(formatted1, formatted2)
    json2WithDiff.value = highlightDiff(formatted2, formatted1)
  } catch (e) {
    diff.value = `<span class="diff-error">解析错误: ${e.message}</span>`
    showNotification('请确保两侧都是合法 JSON！')
  }
}

function getKeysDiff(a, b) {
  const diffKeys = []
  for (const k in a) {
    if (!(k in b)) diffKeys.push(`[removed]左有右无: ${k}[/removed]`)
  }
  for (const k in b) {
    if (!(k in a)) diffKeys.push(`[added]右有左无: ${k}[/added]`)
  }
  return diffKeys.length ? diffKeys.join('\n') : '[equal]两侧 key 完全一致[/equal]'
}

function getFullDiff(a, b, path = '') {
  // 完全相等的情况，包括两个都是null或undefined
  if (a === b) return ''

  // 处理一个值为null或undefined的情况
  if (a === null || a === undefined || b === null || b === undefined) {
    const displayA = a === null ? 'null' : (a === undefined ? 'undefined' : a);
    const displayB = b === null ? 'null' : (b === undefined ? 'undefined' : b);
    return `[changed]<span class="math-inline">\{path \|\| '根节点'\}\: 值不同 \[</span>{displayA} → ${displayB}][/changed]`
  }

  // 处理不同类型
  if (typeof a !== typeof b) {
    return `[changed]<span class="math-inline">\{path \|\| '根节点'\}\: 类型不同 \[</span>{typeof a} → ${typeof b}][/changed]`
  }

  // 处理数组
  if (Array.isArray(a) && Array.isArray(b)) {
    const diffs = []

    // 长度不同
    if (a.length !== b.length) {
      diffs.push(`[changed]<span class="math-inline">\{path \|\| '根节点'\}\: 数组长度不同 \[</span>{a.length} → ${b.length}][/changed]`)
    }

    // 比较共同长度内的元素
    const minLength = Math.min(a.length, b.length)
    for (let i = 0; i < minLength; i++) {
      const itemPath = path ? `<span class="math-inline">\{path\}\[</span>{i}]` : `[${i}]`
      const itemDiff = getFullDiff(a[i], b[i], itemPath)
      if (itemDiff) diffs.push(itemDiff)
    }

    // 处理额外的元素
    if (a.length > b.length) {
      for (let i = minLength; i < a.length; i++) {
        const itemPath = path ? `<span class="math-inline">\{path\}\[</span>{i}]` : `[${i}]`
        diffs.push(`[removed]${itemPath}: 左侧多余元素[/removed]`)
      }
    } else if (b.length > a.length) {
      for (let i = minLength; i < b.length; i++) {
        const itemPath = path ? `<span class="math-inline">\{path\}\[</span>{i}]` : `[${i}]`
        diffs.push(`[added]${itemPath}: 右侧多余元素[/added]`)
      }
    }

    return diffs.join('\n')
  }

  // 处理对象
  if (typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    const diffs = []

    // 检查是否为空对象
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length === 0 && bKeys.length === 0) {
      return ''; // 两个都是空对象，视为相等
    }

    // 检查a中有但b中没有的键
    for (const k in a) {
      const keyPath = path ? `<span class="math-inline">\{path\}\.</span>{k}` : k
      if (!(k in b)) {
        diffs.push(`[removed]${keyPath}: 左有右无[/removed]`)
      } else {
        const valueDiff = getFullDiff(a[k], b[k], keyPath)
        if (valueDiff) diffs.push(valueDiff)
      }
    }

    // 检查b中有但a中没有的键
    for (const k in b) {
      const keyPath = path ? `<span class="math-inline">\{path\}\.</span>{k}` : k
      if (!(k in a)) {
        diffs.push(`[added]${keyPath}: 右有左无[/added]`)
      }
    }

    return diffs.join('\n')
  }

  // 处理基本类型的差异
  if (a !== b) {
    // 根据不同类型格式化显示
    let displayA, displayB;

    if (typeof a === 'string') {
      displayA = `"${a}"`;
    } else if (typeof a === 'number' || typeof a === 'boolean') {
      displayA = String(a);
    } else {
      displayA = JSON.stringify(a);
    }

    if (typeof b === 'string') {
      displayB = `"${b}"`;
    } else if (typeof b === 'number' || typeof b === 'boolean') {
      displayB = String(b);
    } else {
      displayB = JSON.stringify(b);
    }

    return `[changed]<span class="math-inline">\{path \|\| '根节点'\}\: 值不同 \[</span>{displayA} → ${displayB}][/changed]`
  }

  return ''
}
</script>

<style scoped>
.json-diff-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.json-panels {
  display: flex;
  gap: 5px;
}

.json-panel {
  flex: 1;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  background-color: var(--vp-c-bg-soft, #f9f9f9);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.panel-header h3 {
  margin: 0;
  color: var(--vp-c-text-1, #213547);
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.json-textarea, .json-diff-view {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  font-family: monospace;
  resize: vertical;
  background-color: var(--vp-c-bg, #ffffff);
  min-height: 300px;
  max-height: 600px;
  overflow: auto;
  white-space: pre;
  line-height: 1.5;
}

.action-btn,
.format-btn,
.compare-btn {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: var(--vp-c-bg, #ffffff);
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover,
.format-btn:hover {
  background-color: var(--vp-c-gray-light-3, #f0f0f0);
}

.compare-btn {
  padding: 6px 12px;
  background-color: var(--vp-c-brand, #3eaf7c);
  color: white;
  border: none;
}

.compare-btn:hover {
  background-color: var(--vp-c-brand-dark, #369e6a);
}

.formatted-json {
  margin-top: 8px;
}

.formatted-json pre {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
  padding: 8px;
  background-color: var(--vp-c-bg, #ffffff);
  margin: 0;
}

.compare-section {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.diff-type-selector {
  display: flex;
  gap: 12px;
}

.diff-result {
  margin-top: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  background-color: var(--vp-c-bg-soft, #f9f9f9);
}

.diff-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.diff-header h3 {
  margin: 0;
  color: var(--vp-c-text-1, #213547);
}

.diff-result pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  background-color: var(--vp-c-bg, #ffffff);
  padding: 8px;
  border-radius: 4px;
  overflow: auto;
  max-height: 400px;
}

/* 差异高亮 */
.diff-result pre :deep(.diff-added) {
  color: #22863a !important;
  background-color: #f0fff4 !important;
  padding: 2px 0 !important;
}

.diff-result pre :deep(.diff-removed) {
  color: #d73a49 !important;
  background-color: #ffeef0 !important;
  padding: 2px 0 !important;
}

.diff-result pre :deep(.diff-changed) {
  color: #6f42c1 !important;
  background-color: #f5f0ff !important;
  padding: 2px 0 !important;
}

.diff-result pre :deep(.diff-equal) {
  color: #0366d6 !important;
}

.diff-result pre :deep(.diff-error) {
  color: #d73a49 !important;
  font-weight: bold !important;
}

/* 通知样式 */
:global(.json-notification) {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

:global(.json-notification.fade-out) {
  animation: fadeOut 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(10px);
  }
}
</style>