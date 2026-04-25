<template>
  <div class="barcode-generator">
    <div class="input-container">
      <textarea
        v-model="barcodeText"
        placeholder="请输入条形码内容，每行一个…"
        aria-label="条形码内容输入"
        @keydown.ctrl.enter="generateBarcodes"
        @blur="generateBarcodes"
        class="input-field"
        rows="4"
      ></textarea>
      <button class="generate-button" @click="generateBarcodes">
        生成条形码
      </button>
    </div>
    <div class="barcode-container">
      <div
        v-for="(text, index) in barcodeList"
        :key="index"
        class="barcode-item"
      >
        <canvas :ref="(el) => (canvasRefs[index] = el)" class="code"></canvas>
        <div class="barcode-label">{{ text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import JsBarcode from "jsbarcode";

const barcodeText = ref("");
const barcodeList = ref([]);
const canvasRefs = ref([]);

const generateBarcodes = async () => {
  const lines = barcodeText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  barcodeList.value = lines;
  
  await nextTick();
  
  canvasRefs.value.forEach((canvas, index) => {
    if (canvas && barcodeList.value[index]) {
      JsBarcode(canvas, barcodeList.value[index], {
        format: "CODE128",
        displayValue: false,
        fontSize: 14,
        margin: 10,
        height: 60,
      });
    }
  });
};
</script>

<style scoped>
.barcode-generator {
  padding: 10px;
  background-color: var(--vp-code-tab-bg);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* max-width: 800px; */
  margin: 0 auto;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  resize: vertical;
  min-height: 80px;
}

.input-field:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}

.generate-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.generate-button:hover {
  background-color: #0056b3;
}

.barcode-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.barcode-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 120px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.barcode-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.code {
  background-color: white;
}

.barcode-label {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  text-align: center;
  word-break: break-all;
  max-width: 180px;
}
</style>
