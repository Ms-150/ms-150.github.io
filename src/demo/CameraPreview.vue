<template>
  <div class="container">
    <h1>摄像头视频预览</h1>
    <div class="video-container">
      <video ref="video" autoplay muted playsinline class="video"></video>
      <div class="button-group">
        <button @click="startRecording" :disabled="isRecording || isStarting" class="btn">
          {{ isStarting ? '正在请求权限…' : '开始录制' }}
        </button>
        <button @click="stopRecording" :disabled="!isRecording" class="btn">停止录制</button>
      </div>
    </div>
    <div class="preview-container">
      <video ref="preview" controls v-show="previewVisible" class="video"></video>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";

const video = ref(null);
const preview = ref(null);
const isRecording = ref(false);
const previewVisible = ref(false);
let mediaRecorder = null;
let recordedChunks = [];
let localStream = null;

const startRecording = async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.value.srcObject = localStream;
    mediaRecorder = new MediaRecorder(localStream);

    recordedChunks = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      preview.value.src = url;
      previewVisible.value = true;
      recordedChunks = [];
      stopCamera();
    };

    mediaRecorder.start();
    isRecording.value = true;
  } catch (err) {
    console.error("摄像头访问失败:", err);
  }
};

const stopRecording = () => {
  if (mediaRecorder) mediaRecorder.stop();
  isRecording.value = false;
};

const stopCamera = () => {
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }
};

onUnmounted(stopCamera);
</script>

<style scoped>
.container {
  /* max-width: 600px; */
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.video-container {
  position: relative;
  margin-bottom: 20px;
}

.video {
  width: 100%;
  height: auto;
  border: 2px solid #007bff;
  border-radius: 8px;
}

.button-group {
  margin-top: 10px;
}

.btn {
  padding: 10px 15px;
  margin: 5px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn:not(:disabled):hover {
  background-color: #0056b3;
}

.preview-container {
  margin-top: 20px;
}

.preview-container .video {
  border: 2px solid #28a745;
  border-radius: 8px;
}
</style>
e>
