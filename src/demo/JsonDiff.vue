<template>
  <div class="tool-box">
    <div class="actions-bar space-between">
      <div class="left">
        <button @click="compare" class="btn-flat primary">对比差异</button>
        <label class="radio-label"><input type="radio" v-model="type" value="keys" /> 仅对比键</label>
        <label class="radio-label"><input type="radio" v-model="type" value="full" /> 完整对比</label>
      </div>
      <button @click="clearAll" class="btn-flat">全部清空</button>
    </div>
    <div class="editor-area multi">
      <div v-for="idx in [1, 2]" :key="idx" class="diff-panel">
        <div class="panel-tag">JSON {{ idx }}</div>
        <textarea v-model="jsons[idx - 1]" class="raw-input min-h" placeholder="输入内容..."></textarea>
        <div class="panel-tag sub">预览</div>
        <div class="preview-side mini">
          <JsonTree v-if="parsedJsons[idx - 1]" :data="parsedJsons[idx - 1]" />
        </div>
      </div>
    </div>
    <div v-if="result" class="result-area syntax-hl">
      <div class="panel-tag">对比结果</div>
      <pre class="res-view" v-html="processedResult"></pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import JsonTree from './JsonTree.vue'

const jsons = reactive(['', ''])
const result = ref('')
const type = ref('keys')

const parsedJsons = computed(() => jsons.map(j => { try { return j.trim() ? JSON.parse(j) : null } catch (e) { return null } }))

const processedResult = computed(() => {
  return result.value
    .replace(/\[removed\](.*?)\[\/removed\]/g, '<span class="diff-removed">$1</span>')
    .replace(/\[added\](.*?)\[\/added\]/g, '<span class="diff-added">$1</span>')
    .replace(/\[changed\](.*?)\[\/changed\]/g, '<span class="diff-changed">$1</span>')
})

function compare() {
  try {
    const o1 = JSON.parse(jsons[0] || '{}'), o2 = JSON.parse(jsons[1] || '{}')
    result.value = type.value === 'keys' ? getKeysDiff(o1, o2) : getFullDiff(o1, o2)
  } catch (e) { alert('解析失败: ' + e.message) }
}

function clearAll() { jsons[0] = ''; jsons[1] = ''; result.value = '' }

function getKeysDiff(a, b) {
  const d = []
  for (const k in a) if (!(k in b)) d.push(`[removed]- 缺失: ${k}[/removed]`)
  for (const k in b) if (!(k in a)) d.push(`[added]+ 新增: ${k}[/added]`)
  return d.length ? d.join('\n') : '键完全一致'
}

function getFullDiff(a, b, p = '') {
  if (a === b) return ''
  if (typeof a !== typeof b) return `[changed]${p || 'root'}: 类型不同[/changed]`
  if (typeof a === 'object' && a && b) {
    const d = [], keys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const k of keys) {
      const r = getFullDiff(a[k], b[k], p ? `${p}.${k}` : k)
      if (r) d.push(r)
    }
    return d.join('\n')
  }
  return `[changed]${p}: 值不同[/changed]`
}
</script>

<style scoped>
@import "./json-theme.css";

.space-between {
  justify-content: space-between;
}

.left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.radio-label {
  font-size: 12px;
  cursor: pointer;
}

.multi {
  height: 800px;
}

.diff-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.diff-panel:first-child {
  border-right: 1px solid var(--vp-c-divider);
}

.panel-tag {
  padding: 4px 12px;
  font-size: 11px;
  font-weight: bold;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.panel-tag.sub {
  border-top: 1px solid var(--vp-c-divider);
}

.min-h {
  flex: 1;
}

.mini {
  flex: 1;
  border-left: none;
  padding: 8px;
}

.result-area {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.res-view {
  padding: 12px;
  font-size: 13px;
  font-family: var(--vp-font-family-mono);
  white-space: pre;
  margin: 0;
  max-height: 200px;
  overflow: auto;
}
</style>