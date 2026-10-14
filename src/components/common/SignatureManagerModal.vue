<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      @click.self="handleClose"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col my-auto transition-all transform duration-200"
      >
        <!-- Modal Header -->
        <div class="px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">Official Digital Signature</h3>
              <p class="text-xs text-slate-500 font-medium">Applied automatically to Job Orders and official documents</p>
            </div>
          </div>
          <button
            type="button"
            @click="handleClose"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mode Tabs -->
        <div class="px-5 sm:px-7 pt-4 border-b border-slate-100 flex items-center gap-2 bg-white">
          <button
            type="button"
            @click="activeMode = 'draw'"
            class="pb-3 px-3 text-xs sm:text-sm font-black tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2"
            :class="activeMode === 'draw' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Draw Signature</span>
          </button>

          <button
            type="button"
            @click="activeMode = 'upload'"
            class="pb-3 px-3 text-xs sm:text-sm font-black tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2"
            :class="activeMode === 'upload' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Upload Image (Auto-Remove Background)</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-5 sm:p-7 space-y-4">
          <!-- MODE 1: DRAW SIGNATURE -->
          <div v-show="activeMode === 'draw'" class="space-y-3">
            <!-- Canvas Controls -->
            <div class="flex items-center justify-between flex-wrap gap-2 text-xs">
              <!-- Color and Width Options -->
              <div class="flex items-center gap-3">
                <span class="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Ink:</span>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click="inkColor = '#0f172a'"
                    class="w-6 h-6 rounded-full bg-slate-900 border-2 transition-transform cursor-pointer"
                    :class="inkColor === '#0f172a' ? 'scale-110 border-emerald-500 ring-2 ring-emerald-500/30' : 'border-transparent hover:scale-105'"
                    title="Midnight Black Ink"
                  ></button>
                  <button
                    type="button"
                    @click="inkColor = '#1e3a8a'"
                    class="w-6 h-6 rounded-full bg-blue-900 border-2 transition-transform cursor-pointer"
                    :class="inkColor === '#1e3a8a' ? 'scale-110 border-emerald-500 ring-2 ring-emerald-500/30' : 'border-transparent hover:scale-105'"
                    title="Official Navy Blue Ink"
                  ></button>
                </div>

                <div class="h-4 w-px bg-slate-200 mx-1"></div>

                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    @click="lineWidth = 2"
                    class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors"
                    :class="lineWidth === 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                  >
                    Fine
                  </button>
                  <button
                    type="button"
                    @click="lineWidth = 3"
                    class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors"
                    :class="lineWidth === 3 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    @click="lineWidth = 4.5"
                    class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors"
                    :class="lineWidth === 4.5 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                  >
                    Bold
                  </button>
                </div>
              </div>

              <!-- Clear & Undo -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="undoLastStroke"
                  :disabled="strokes.length === 0"
                  class="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  <span>Undo</span>
                </button>

                <button
                  type="button"
                  @click="clearCanvas"
                  class="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <!-- Canvas Container -->
            <div class="relative w-full h-56 sm:h-64 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 overflow-hidden shadow-inner touch-none cursor-crosshair select-none">
              <canvas
                ref="canvasRef"
                class="w-full h-full block touch-none"
                @pointerdown="startDrawing"
                @pointermove="draw"
                @pointerup="stopDrawing"
                @pointercancel="stopDrawing"
              ></canvas>

              <!-- Watermark Guide Line -->
              <div
                v-if="strokes.length === 0"
                class="absolute inset-x-8 bottom-12 pointer-events-none flex flex-col items-center justify-center opacity-60 select-none"
              >
                <div class="w-full border-b border-slate-300 border-dashed mb-1.5"></div>
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Sign above with finger, stylus, or mouse
                </span>
              </div>
            </div>
          </div>

          <!-- MODE 2: UPLOAD IMAGE WITH AUTO BACKGROUND REMOVAL -->
          <div v-show="activeMode === 'upload'" class="space-y-4">
            <!-- Upload Box (if no image yet) -->
            <div
              v-if="!uploadedRawImage"
              @click="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              class="w-full h-56 sm:h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer"
              :class="isDragging ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-300 hover:border-emerald-400 bg-slate-50/70 hover:bg-white'"
            >
              <input
                ref="fileInputRef"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                class="hidden"
                @change="handleFileSelect"
              />
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h4 class="text-sm font-black text-slate-900 mb-1">Upload a photo of your signature</h4>
              <p class="text-xs text-slate-500 font-medium max-w-sm mb-3">
                Sign on clean paper, snap a photo, and upload. The paper background will be removed automatically!
              </p>
              <span class="inline-flex items-center px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-bold">
                PNG, JPG, or WebP up to 3MB
              </span>
            </div>

            <!-- Uploaded Image & Auto-Removed Background Preview -->
            <div v-else class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                    ✓ Background Removed
                  </span>
                  <span class="text-xs text-slate-500 font-medium">Clean transparent ink</span>
                </div>
                <button
                  type="button"
                  @click="resetUploadedImage"
                  class="text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Choose another image
                </button>
              </div>

              <!-- Checkerboard Container (Standard for transparency) -->
              <div
                class="w-full h-52 sm:h-56 rounded-2xl border border-slate-300 flex items-center justify-center p-4 relative overflow-hidden shadow-inner"
                :style="{
                  backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f8fafc 1px)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 8px 8px'
                }"
              >
                <img
                  v-if="processedSignatureDataUrl"
                  :src="processedSignatureDataUrl"
                  alt="Processed Transparent Signature"
                  class="max-h-full max-w-full object-contain filter drop-shadow-sm"
                />
                <div v-else class="text-xs font-bold text-slate-400">
                  Processing background removal...
                </div>
              </div>

              <!-- Ink Tone Selector for Upload -->
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span class="font-bold text-slate-700">Signature Ink Tone:</span>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click="setUploadInkStyle('original')"
                    class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    :class="uploadInkStyle === 'original' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
                  >
                    Natural Ink
                  </button>
                  <button
                    type="button"
                    @click="setUploadInkStyle('black')"
                    class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    :class="uploadInkStyle === 'black' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
                  >
                    Deep Black
                  </button>
                  <button
                    type="button"
                    @click="setUploadInkStyle('blue')"
                    class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    :class="uploadInkStyle === 'blue' ? 'bg-blue-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
                  >
                    Navy Blue
                  </button>
                </div>
              </div>

              <!-- Sensitivity Adjustment Slider -->
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div class="flex items-center justify-between text-xs font-bold text-slate-700">
                  <label for="sensitivity-slider" class="flex items-center gap-1.5 cursor-pointer">
                    <span>Background Cleanup Level:</span>
                    <span class="text-emerald-700 font-black">{{ Math.round(removalSensitivity * 100) }}%</span>
                  </label>
                  <span class="text-[10px] text-slate-400">Higher level cleans faint shadows</span>
                </div>
                <input
                  id="sensitivity-slider"
                  type="range"
                  min="0.55"
                  max="0.95"
                  step="0.02"
                  v-model.number="removalSensitivity"
                  @input="reprocessUploadedImage"
                  class="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-5 sm:px-7 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            @click="handleClose"
            :disabled="isSaving"
            class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px]"
          >
            Cancel
          </button>

          <button
            type="button"
            @click="handleSaveSignature"
            :disabled="isSaving || !hasValidSignature"
            class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed min-h-[44px]"
          >
            <svg v-if="!isSaving" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSaving ? 'Saving Signature...' : 'Save Official Signature' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import api from '@/api/client';
import { useAuthStore } from '@/stores/auth';
import { removeSignatureBackground, clearSignatureCache } from '@/utils/signatureUtils';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:isOpen', 'saved']);

const authStore = useAuthStore();

const activeMode = ref('draw'); // 'draw' | 'upload'
const isSaving = ref(false);

// Canvas & Drawing State
const canvasRef = ref(null);
const inkColor = ref('#0f172a');
const lineWidth = ref(3);
const isDrawing = ref(false);
const strokes = ref([]);
let currentStroke = null;
let currentWidth = 3;

// Image Upload State
const fileInputRef = ref(null);
const isDragging = ref(false);
const uploadedRawImage = ref(null);
const processedSignatureDataUrl = ref(null);
const removalSensitivity = ref(0.80);
const uploadInkStyle = ref('original'); // 'original' | 'black' | 'blue'

const setUploadInkStyle = (style) => {
  uploadInkStyle.value = style;
  reprocessUploadedImage();
};

const hasValidSignature = computed(() => {
  if (activeMode.value === 'draw') {
    return strokes.value.length > 0;
  }
  return !!processedSignatureDataUrl.value;
});

// Setup canvas with high DPI for retina rendering
const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  redrawAllStrokes();
};

watch(() => props.isOpen, (open) => {
  if (open) {
    nextTick(() => {
      initCanvas();
    });
  } else {
    resetState();
  }
});

const resetState = () => {
  strokes.value = [];
  currentStroke = null;
  uploadedRawImage.value = null;
  processedSignatureDataUrl.value = null;
  uploadInkStyle.value = 'original';
  activeMode.value = 'draw';
};

const handleClose = () => {
  if (isSaving.value) return;
  emit('update:isOpen', false);
};

// -------------------------------------------------------------
// Smooth Drawing Logic (Quadratic Bezier Interpolation + Dynamic Tapering)
// -------------------------------------------------------------
const getCanvasPos = (event) => {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

const startDrawing = (event) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  try {
    if (event.pointerId !== undefined && typeof canvas.setPointerCapture === 'function') {
      canvas.setPointerCapture(event.pointerId);
    }
  } catch (err) {}

  isDrawing.value = true;
  const pos = getCanvasPos(event);
  const now = performance.now();
  currentWidth = lineWidth.value;

  currentStroke = {
    color: inkColor.value,
    baseWidth: lineWidth.value,
    points: [{ ...pos, time: now, width: currentWidth }],
  };
  strokes.value.push(currentStroke);

  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
};

const draw = (event) => {
  if (!isDrawing.value || !canvasRef.value || !currentStroke) return;

  const pos = getCanvasPos(event);
  const now = performance.now();
  const points = currentStroke.points;
  const prevPoint = points[points.length - 1];

  // Ignore negligible sub-pixel jitters for buttery smoothness
  const dist = Math.hypot(pos.x - prevPoint.x, pos.y - prevPoint.y);
  if (dist < 1.2) return;

  const dt = Math.max(1, now - (prevPoint.time || now));
  const velocity = Math.min(3, dist / dt);

  // Pressure support (stylus pen / tablet)
  let targetWidth = lineWidth.value;
  if (event.pressure && event.pressure > 0.05) {
    targetWidth = lineWidth.value * (0.6 + event.pressure * 0.8);
  } else {
    // Dynamic calligraphy velocity tapering: fast strokes taper gently up to 25%
    targetWidth = lineWidth.value * (1 - Math.min(0.25, velocity * 0.1));
  }

  // Smooth width with exponential moving average
  currentWidth = currentWidth * 0.65 + targetWidth * 0.35;

  const newPoint = { ...pos, time: now, width: currentWidth };
  points.push(newPoint);

  const ctx = canvasRef.value.getContext('2d');
  ctx.strokeStyle = currentStroke.color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (points.length >= 3) {
    const p0 = points[points.length - 3];
    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];

    const mid1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
    const mid2 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

    ctx.beginPath();
    ctx.moveTo(mid1.x, mid1.y);
    ctx.quadraticCurveTo(p1.x, p1.y, mid2.x, mid2.y);
    ctx.lineWidth = currentWidth;
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineWidth = currentWidth;
    ctx.stroke();
  }
};

const stopDrawing = (event) => {
  if (!isDrawing.value) return;
  isDrawing.value = false;

  const canvas = canvasRef.value;
  if (canvas && event?.pointerId !== undefined && typeof canvas.releasePointerCapture === 'function') {
    try {
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    } catch (err) {}
  }

  // Single tap / dot support: draw a clean circle
  if (currentStroke && currentStroke.points.length <= 2 && canvas) {
    const ctx = canvas.getContext('2d');
    const p = currentStroke.points[0];
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(1.5, (currentStroke.baseWidth || 3) / 2), 0, Math.PI * 2);
    ctx.fillStyle = currentStroke.color;
    ctx.fill();
  }

  currentStroke = null;
};

const undoLastStroke = () => {
  if (strokes.value.length === 0) return;
  strokes.value.pop();
  redrawAllStrokes();
};

const clearCanvas = () => {
  strokes.value = [];
  currentStroke = null;
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const redrawAllStrokes = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

  strokes.value.forEach((stroke) => {
    const pts = stroke.points;
    if (!pts || pts.length === 0) return;

    if (pts.length <= 2) {
      // Tap or dot
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, Math.max(1.5, (stroke.baseWidth || 3) / 2), 0, Math.PI * 2);
      ctx.fillStyle = stroke.color;
      ctx.fill();
      return;
    }

    ctx.strokeStyle = stroke.color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];

      ctx.lineWidth = p1.width || stroke.baseWidth || 3;

      if (p2) {
        const mid1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
        const mid2 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        ctx.beginPath();
        ctx.moveTo(mid1.x, mid1.y);
        ctx.quadraticCurveTo(p1.x, p1.y, mid2.x, mid2.y);
        ctx.stroke();
      } else {
        const mid1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
        ctx.beginPath();
        ctx.moveTo(mid1.x, mid1.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
    }
  });
};

// -------------------------------------------------------------
// Image Upload & Auto-Background Removal
// -------------------------------------------------------------
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) processRawImageFile(file);
};

const handleFileDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) processRawImageFile(file);
};

const processRawImageFile = (file) => {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
    toast.error('Please upload a valid JPG, PNG, or WebP image.');
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    toast.error('Image size must be less than 3MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      uploadedRawImage.value = img;
      reprocessUploadedImage();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

const reprocessUploadedImage = () => {
  if (!uploadedRawImage.value) return;
  try {
    processedSignatureDataUrl.value = removeSignatureBackground(
      uploadedRawImage.value,
      removalSensitivity.value,
      uploadInkStyle.value
    );
  } catch (err) {
    console.error('Failed to auto-remove signature background:', err);
    toast.error('Failed to process image background.');
  }
};

const resetUploadedImage = () => {
  uploadedRawImage.value = null;
  processedSignatureDataUrl.value = null;
  uploadInkStyle.value = 'original';
  if (fileInputRef.value) fileInputRef.value.value = '';
};

// -------------------------------------------------------------
// Save Signature to Backend
// -------------------------------------------------------------
const handleSaveSignature = async () => {
  let finalDataUrl = '';

  if (activeMode.value === 'draw') {
    if (strokes.value.length === 0) {
      toast.error('Please draw a signature first.');
      return;
    }
    const canvas = canvasRef.value;
    if (!canvas) return;

    // Create trimmed copy
    const tempImg = new Image();
    tempImg.onload = () => {
      // Auto-crop empty margins and preserve drawing ink
      finalDataUrl = removeSignatureBackground(tempImg, 0.95, inkColor.value === '#1e3a8a' ? 'blue' : 'black');
      uploadSignaturePayload(finalDataUrl);
    };
    tempImg.src = canvas.toDataURL('image/png');
    return;
  } else {
    if (!processedSignatureDataUrl.value) {
      toast.error('Please upload an image first.');
      return;
    }
    finalDataUrl = processedSignatureDataUrl.value;
    uploadSignaturePayload(finalDataUrl);
  }
};

const uploadSignaturePayload = async (dataUrl) => {
  isSaving.value = true;
  try {
    const res = await api.post('/auth/signature', {
      signature_base64: dataUrl,
    });

    if (res.data?.data?.user) {
      authStore.user = res.data.data.user;
    }

    clearSignatureCache();
    toast.success('Official digital signature saved successfully!');
    emit('saved', res.data?.data?.signature_url || dataUrl);
    handleClose();
  } catch (err) {
    console.error('Failed to save signature:', err);
    toast.error(err.response?.data?.message || 'Failed to save official signature.');
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
</style>
