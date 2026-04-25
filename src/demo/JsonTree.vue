<template>
  <div class="json-tree-node syntax-hl" :class="{ 'is-root': isRoot }">
    <!-- 对象类型 -->
    <div v-if="isObject" class="node-wrapper">
      <span @click="toggle" class="toggle-btn" :class="{ 'collapsed': collapsed }"></span>
      <span class="bracket">{</span>
      <div v-show="!collapsed" class="node-children">
        <div v-for="(value, key, index) in data" :key="key" class="node-item">
          <span class="key">"{{ key }}"</span><span class="sep">: </span>
          <JsonTree :data="value" :is-last="index === Object.keys(data).length - 1" :is-root="false" />
        </div>
      </div>
      <span v-show="collapsed" class="collapsed-placeholder" @click="toggle">...</span>
      <span class="bracket">}</span><span v-if="!isLast" class="sep">,</span>
    </div>

    <!-- 数组类型 -->
    <div v-else-if="isArray" class="node-wrapper">
      <span @click="toggle" class="toggle-btn" :class="{ 'collapsed': collapsed }"></span>
      <span class="bracket">[</span>
      <div v-show="!collapsed" class="node-children">
        <div v-for="(item, index) in data" :key="index" class="node-item">
          <JsonTree :data="item" :is-last="index === data.length - 1" :is-root="false" />
        </div>
      </div>
      <span v-show="collapsed" class="collapsed-placeholder" @click="toggle">...</span>
      <span class="bracket">]</span><span v-if="!isLast" class="sep">,</span>
    </div>

    <!-- 基础类型 -->
    <span v-else class="node-value-wrap">
      <span class="node-value" :class="valueClass">{{ formatValue(data) }}</span><span v-if="!isLast" class="sep">,</span>
    </span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  data: [Object, Array, String, Number, Boolean, null],
  isLast: { type: Boolean, default: true },
  isRoot: { type: Boolean, default: true }
})

const collapsed = ref(false)
const toggle = () => collapsed.value = !collapsed.value

const isObject = computed(() => props.data !== null && typeof props.data === 'object' && !Array.isArray(props.data))
const isArray = computed(() => Array.isArray(props.data))

const valueClass = computed(() => {
  if (props.data === null) return 'val-null'
  if (typeof props.data === 'string') return 'val-str'
  if (typeof props.data === 'number') return 'val-num'
  if (typeof props.data === 'boolean') return 'val-bool'
  return ''
})

const formatValue = (val) => {
  if (val === null) return 'null'
  if (typeof val === 'string') return `"${val}"`
  return String(val)
}
</script>

<style scoped>
.json-tree-node {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.6;
  display: inline-block;
  vertical-align: top;
}

.json-tree-node.is-root {
  display: block;
}

.node-wrapper {
  position: relative;
  display: inline-block;
  vertical-align: top;
  padding-left: 12px;
}

.node-children {
  display: block;
  padding-left: 20px;
  border-left: 1px solid var(--vp-c-divider);
  margin: 2px 0 2px 4px;
}

.node-item {
  display: block;
  white-space: nowrap;
}

.toggle-btn {
  position: absolute;
  left: -4px;
  top: 6px;
  width: 12px;
  height: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn::before {
  content: "";
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 0 4px 6px;
  border-color: transparent transparent transparent var(--vp-c-text-3);
  transition: transform 0.2s;
  transform: rotate(90deg);
}

.toggle-btn.collapsed::before {
  transform: rotate(0deg);
}

.collapsed-placeholder {
  background: var(--vp-c-bg-soft);
  padding: 0 2px;
  border-radius: 3px;
  cursor: pointer;
  color: var(--vp-c-text-3);
  margin: 0 2px;
  font-size: 12px;
}

.bracket, .sep {
  color: var(--vp-c-text-2);
}

.key {
  color: var(--js-key, #cf222e);
}

.node-value-wrap {
  display: inline-block;
  white-space: nowrap;
}
</style>