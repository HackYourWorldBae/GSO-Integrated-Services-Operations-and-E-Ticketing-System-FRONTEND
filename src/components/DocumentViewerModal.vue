<template>
  <Teleport to="body">
    <Transition name="doc-modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-hidden"
        @click.self="emitClose"
      >
        <div class="bg-white w-full max-w-5xl h-[92vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 relative animate-scale-up">
          
          <!-- Top Navigation / Toolbar -->
          <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 gap-4">
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black shrink-0">
                <svg v-if="isDocx" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg v-else-if="isImage" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="min-w-0">
                <h3 class="text-sm font-black text-white truncate leading-tight">{{ title || 'Document Preview' }}</h3>
                <p class="text-[11px] text-slate-400 font-bold truncate mt-0.5">{{ fileName || 'attachment' }}</p>
              </div>
            </div>

            <!-- Action Toolbar Buttons -->
            <div class="flex items-center gap-2 shrink-0">
              <button 
                @click="printDocument" 
                class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Print document"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span class="hidden sm:inline">Print</span>
              </button>

              <button 
                @click="downloadFile" 
                class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
                title="Download document file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
              </button>

              <div class="h-6 w-[1px] bg-slate-700 mx-1 hidden sm:block"></div>

              <button 
                @click="emitClose" 
                class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors flex items-center justify-center cursor-pointer"
                title="Close viewer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Document Canvas / Viewer Container -->
          <div class="flex-1 bg-slate-100/90 overflow-y-auto p-4 sm:p-8 custom-scrollbar relative flex flex-col items-center">
            
            <!-- Loading State -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center my-auto py-24 gap-4">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <svg class="animate-spin h-6 w-6 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p class="text-sm font-bold text-slate-700">Rendering document preview...</p>
              <p class="text-xs text-slate-400 font-medium">Please wait while the file is processed.</p>
            </div>

            <!-- Error State -->
            <div v-else-if="renderError" class="flex flex-col items-center justify-center my-auto py-16 gap-3 text-center max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 class="text-base font-black text-slate-900">Preview Not Available</h4>
              <p class="text-xs text-slate-500">{{ renderError }}</p>
              <button @click="downloadFile" class="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                Download File Directly
              </button>
            </div>

            <!-- Docx Preview Paper Canvas -->
            <!-- No extra padding here — docx-preview controls its own page margins/layout -->
            <div 
              v-show="!isLoading && !renderError && isDocx" 
              ref="docxContainerRef" 
              class="docx-render-paper w-full max-w-4xl min-h-[600px]"
            ></div>

            <!-- Image Preview -->
            <div v-if="!isLoading && !renderError && isImage" class="max-w-4xl w-full flex items-center justify-center p-4 bg-white shadow-xl rounded-2xl border border-slate-200">
              <img :src="imageUrl" :alt="fileName" class="max-h-[75vh] w-auto object-contain rounded-lg" />
            </div>

          </div>

          <!-- Footer Status -->
          <div class="px-6 py-3 bg-white border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between font-bold">
            <span>Benguet State University • Document Viewer</span>
            <span class="text-[10px] uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Live Preview</span>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { renderAsync } from 'docx-preview';
import { toast } from 'vue3-toastify';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Document Preview'
  },
  fileName: {
    type: String,
    default: ''
  },
  fileBlob: {
    type: [Blob, Object, null],
    default: null
  },
  fileUrl: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:isOpen', 'close', 'download']);

const docxContainerRef = ref(null);
const isLoading = ref(false);
const renderError = ref('');
const imageUrl = ref('');

const isDocx = computed(() => {
  const name = props.fileName?.toLowerCase() || '';
  const type = props.fileBlob?.type || '';
  return name.endsWith('.docx') || name.endsWith('.doc') || type.includes('wordprocessingml') || type.includes('msword');
});

const isImage = computed(() => {
  const name = props.fileName?.toLowerCase() || '';
  const type = props.fileBlob?.type || '';
  return (
    name.endsWith('.png') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.webp') ||
    type.startsWith('image/')
  );
});

const emitClose = () => {
  emit('update:isOpen', false);
  emit('close');
};

const renderPreview = async () => {
  renderError.value = '';
  if (!props.isOpen || (!props.fileBlob && !props.fileUrl)) return;

  isLoading.value = true;
  try {
    let blob = props.fileBlob;
    if (!blob && props.fileUrl) {
      const resp = await fetch(props.fileUrl);
      blob = await resp.blob();
    }

    if (isImage.value) {
      if (imageUrl.value) URL.revokeObjectURL(imageUrl.value);
      imageUrl.value = URL.createObjectURL(blob);
      isLoading.value = false;
      return;
    }

    if (isDocx.value) {
      await nextTick();
      if (docxContainerRef.value) {
        docxContainerRef.value.innerHTML = '';
        await renderAsync(blob, docxContainerRef.value, undefined, {
          className: 'docx-preview',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          renderEndnotes: true,
          useBase64URL: true,
        });
      }
    } else {
      renderError.value = 'Direct in-browser preview is available for Word (.docx) and Image files.';
    }
  } catch (err) {
    console.error('Failed to render document preview:', err);
    renderError.value = 'Failed to render document preview. You can still download the file directly.';
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => [props.isOpen, props.fileBlob, props.fileUrl],
  () => {
    if (props.isOpen) {
      renderPreview();
    } else {
      if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value);
        imageUrl.value = '';
      }
    }
  },
  { immediate: true }
);

const downloadFile = () => {
  try {
    let blob = props.fileBlob;
    const name = props.fileName || `${props.title || 'document'}.docx`;
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Document downloaded!');
    } else if (props.fileUrl) {
      const link = document.createElement('a');
      link.href = props.fileUrl;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Document downloaded!');
    }
    emit('download');
  } catch (e) {
    console.error('Download error:', e);
    toast.error('Failed to download document.');
  }
};

const printDocument = () => {
  window.print();
};
</script>

<style>
/*
 * Global styles for the docx-preview renderer.
 * docx-preview computes exact table cell borders, column widths, font sizes,
 * and page layouts from OpenXML. We preserve these styles without ad-hoc overrides.
 */

/* ── Outer wrapper ─────────────────────────────────────────────────────── */
.docx-render-paper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.docx-render-paper .docx-wrapper {
  background: transparent !important;
  padding: 1rem 0 !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

/* ── Individual page block ─────────────────────────────────────────────── */
.docx-render-paper .docx-preview {
  background: #ffffff !important;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08);
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

/* ── All images inside the rendered document ───────────────────────────── */
.docx-render-paper .docx-preview img {
  display: inline-block;
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}

/* ── Modal transition ───────────────────────────────────────────────────── */
.doc-modal-enter-active,
.doc-modal-leave-active {
  transition: opacity 0.25s ease;
}

.doc-modal-enter-from,
.doc-modal-leave-to {
  opacity: 0;
}

/* ── Print Media Optimization ───────────────────────────────────────────── */
@media print {
  body * {
    visibility: hidden;
  }
  .docx-render-paper,
  .docx-render-paper * {
    visibility: visible;
  }
  .docx-render-paper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .docx-render-paper .docx-wrapper {
    padding: 0 !important;
    gap: 0 !important;
  }
  .docx-render-paper .docx-preview {
    box-shadow: none !important;
    border: none !important;
    margin: 0 !important;
    page-break-after: always;
  }
}
</style>
