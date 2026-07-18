<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  label: { type: String, default: 'Signature' },
  modelValue: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'clear']);

const canvasRef = ref(null);
const isDrawing = ref(false);
let ctx = null;

const initCanvas = () => {
  const canvas = canvasRef.value;
  ctx = canvas.getContext('2d');
  
  // Set display size
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  
  ctx.strokeStyle = '#0f172a'; // slate-900
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
};

const startDrawing = (e) => {
  isDrawing.value = true;
  draw(e);
};

const stopDrawing = () => {
  if (isDrawing.value) {
    isDrawing.value = false;
    ctx.beginPath();
    const dataUrl = canvasRef.value.toDataURL();
    emit('update:modelValue', dataUrl);
  }
};

const draw = (e) => {
  if (!isDrawing.value) return;
  
  const rect = canvasRef.value.getBoundingClientRect();
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  const clientY = e.clientY || (e.touches && e.touches[0].clientY);
  
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const clearPad = () => {
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  emit('update:modelValue', '');
  emit('clear');
};

onMounted(() => {
  initCanvas();
  window.addEventListener('resize', initCanvas);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', initCanvas);
});
</script>

<template>
  <div class="space-y-3">
    <div class="flex justify-between items-end">
      <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{{ label }}</label>
      <button 
        type="button"
        @click="clearPad" 
        class="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
        Clear Pad
      </button>
    </div>
    <div class="relative group">
      <canvas
        ref="canvasRef"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart.prevent="startDrawing"
        @touchmove.prevent="draw"
        @touchend.prevent="stopDrawing"
        class="w-full h-40 bg-slate-50 border-2 border-slate-100 rounded-2xl cursor-crosshair group-hover:border-emerald-500/30 transition-colors touch-none shadow-inner"
      ></canvas>
      <div v-if="!modelValue" class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p class="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Sign Here</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
canvas {
  image-rendering: -webkit-optimize-contrast;
}
</style>
