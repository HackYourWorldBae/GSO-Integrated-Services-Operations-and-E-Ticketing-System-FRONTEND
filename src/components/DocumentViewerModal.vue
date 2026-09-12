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
                <!-- PDF icon -->
                <svg v-if="isPdf" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <!-- Image icon -->
                <svg v-else-if="isImage" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <!-- Generic file icon -->
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
              <!-- Re-generate Button (Fallback & Refresh with fresh data) -->
              <button 
                v-if="allowRegenerate"
                @click="emitRegenerate" 
                :disabled="isLoading || isRegenerating"
                class="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                title="Re-generate this document with fresh ticket data"
              >
                <svg :class="{ 'animate-spin': isRegenerating }" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{{ isRegenerating ? 'Regenerating...' : 'Re-generate' }}</span>
              </button>

              <!-- Print Button (PDF/Docx/Image) -->
              <button 
                v-if="isPdf || isDocx || isImage"
                @click="printDocument" 
                class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="Print document directly"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print</span>
              </button>

              <!-- Open in New Tab (PDF/Image) -->
              <button 
                v-if="isPdf || isImage"
                @click="openInNewTab" 
                class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="Open document in a new browser tab"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span class="hidden sm:inline">New Tab</span>
              </button>

              <!-- Download PDF button (when viewing Word docx) -->
              <button 
                v-if="isDocx"
                @click="downloadDocxAsPdf" 
                :disabled="isConvertingPdf"
                class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                title="Download as official PDF document"
              >
                <svg v-if="!isConvertingPdf" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <svg v-else class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isConvertingPdf ? 'Exporting...' : 'Save PDF' }}</span>
              </button>

              <!-- Primary Download Button -->
              <button 
                @click="downloadFile" 
                class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
                :title="isDocx ? 'Download Word (.docx) file' : 'Download file'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{{ isDocx ? 'Download .DOCX' : 'Download' }}</span>
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
          <div class="flex-1 overflow-hidden relative bg-slate-200">

            <!-- Loading State -->
            <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-100/80 z-10">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <svg class="animate-spin h-6 w-6 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p class="text-sm font-bold text-slate-700">Rendering document preview...</p>
              <p class="text-xs text-slate-400 font-medium">Please wait while the document is processed.</p>
            </div>

            <!-- Error State with Fallback Re-generate Action -->
            <div v-else-if="renderError" class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6 bg-slate-50">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 class="text-base font-black text-slate-900">Preview Not Available</h4>
              <p class="text-xs text-slate-500 max-w-sm">{{ renderError }}</p>
              <div class="flex items-center gap-2 mt-2">
                <button 
                  v-if="allowRegenerate"
                  @click="emitRegenerate" 
                  :disabled="isRegenerating"
                  class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
                >
                  <svg :class="{ 'animate-spin': isRegenerating }" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{{ isRegenerating ? 'Re-generating...' : 'Re-generate Document' }}</span>
                </button>
                <button @click="downloadFile" class="px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                  Download File Directly
                </button>
              </div>
            </div>

            <!-- PDF Viewer — native browser iframe, full fidelity -->
            <iframe
              v-show="!isLoading && !renderError && isPdf"
              ref="pdfIframeRef"
              :src="pdfBlobUrl"
              class="w-full h-full border-0"
              title="PDF Document Viewer"
              type="application/pdf"
            />

            <!-- Docx Preview Paper Canvas -->
            <div 
              v-show="!isLoading && !renderError && isDocx" 
              class="w-full h-full overflow-y-auto p-3 sm:p-8 bg-slate-300 flex justify-center custom-scrollbar"
            >
              <div 
                ref="docxContainerRef" 
                class="docx-render-paper w-full max-w-[880px] my-2"
              ></div>
            </div>

            <!-- Image Preview -->
            <div v-if="!isLoading && !renderError && isImage" class="w-full h-full flex items-center justify-center p-6 overflow-auto bg-slate-200">
              <img :src="imageUrl" :alt="fileName" class="max-h-full max-w-full object-contain rounded-xl shadow-xl border border-slate-300" />
            </div>

          </div>

          <!-- Footer Status -->
          <div class="px-6 py-3 bg-white border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between font-bold shrink-0">
            <span>Benguet State University • Document Viewer</span>
            <span class="text-[10px] uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {{ isPdf ? 'PDF' : isDocx ? 'Word (.docx)' : isImage ? 'Image' : 'File' }} Preview
            </span>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import { toast } from 'vue3-toastify';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Document Preview',
  },
  fileName: {
    type: String,
    default: '',
  },
  /**
   * A Blob for the file to display.
   * Can be a PDF blob (from pdfmake), a Word (.docx) blob, an image blob, or any other file blob.
   */
  fileBlob: {
    type: [Blob, Object, null],
    default: null,
  },
  /**
   * A direct URL to a file to fetch and display.
   */
  fileUrl: {
    type: String,
    default: '',
  },
  /**
   * Enables the Re-generate fallback button in the header and error state.
   */
  allowRegenerate: {
    type: Boolean,
    default: false,
  },
  /**
   * Loading state for active document re-generation.
   */
  isRegenerating: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:isOpen', 'close', 'download', 'regenerate']);

const emitRegenerate = () => {
  emit('regenerate');
};

const pdfIframeRef     = ref(null);
const docxContainerRef = ref(null);
const isLoading        = ref(false);
const isConvertingPdf  = ref(false);
const renderError      = ref('');
const imageUrl         = ref('');
const pdfBlobUrl       = ref('');

/** Revokes all object URLs to avoid memory leaks. */
const revokeUrls = () => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
    imageUrl.value = '';
  }
  if (pdfBlobUrl.value) {
    URL.revokeObjectURL(pdfBlobUrl.value);
    pdfBlobUrl.value = '';
  }
};

onBeforeUnmount(revokeUrls);

// ─────────────────────────────────────────────────────────────────────────────
// File type detection
// ─────────────────────────────────────────────────────────────────────────────

const isPdf = computed(() => {
  const name = (props.fileName || '').toLowerCase();
  const type = (props.fileBlob?.type || '');
  return name.endsWith('.pdf') || type === 'application/pdf' || type.includes('pdf');
});

const isDocx = computed(() => {
  const name = (props.fileName || '').toLowerCase();
  const type = (props.fileBlob?.type || '');
  return (
    name.endsWith('.docx') ||
    name.endsWith('.doc') ||
    type.includes('wordprocessingml') ||
    type.includes('msword')
  );
});

const isImage = computed(() => {
  const name = (props.fileName || '').toLowerCase();
  const type = (props.fileBlob?.type || '');
  return (
    name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') ||
    name.endsWith('.webp') || name.endsWith('.gif') || type.startsWith('image/')
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Preview rendering
// ─────────────────────────────────────────────────────────────────────────────

const renderPreview = async () => {
  renderError.value = '';
  revokeUrls();

  if (!props.isOpen) return;

  if (!props.fileBlob && !props.fileUrl) {
    isLoading.value = true;
    return;
  }

  isLoading.value = true;

  try {
    let blob = props.fileBlob;

    // If only a URL was given, fetch the blob first
    if (!blob && props.fileUrl) {
      const resp = await fetch(props.fileUrl);
      if (!resp.ok) throw new Error(`HTTP ${resp.status} — could not load file from URL.`);
      blob = await resp.blob();
    }

    if (isPdf.value) {
      await nextTick();
      // Create an object URL and bind it to the iframe — browsers render PDFs natively
      pdfBlobUrl.value = URL.createObjectURL(blob);
    } else if (isDocx.value) {
      await nextTick();
      if (docxContainerRef.value) {
        docxContainerRef.value.innerHTML = '';
        const { renderAsync } = await import('docx-preview');
        await renderAsync(blob, docxContainerRef.value, undefined, {
          className: 'docx-preview',
          inWrapper: false,
          ignoreWidth: false,
          ignoreHeight: true,
          breakPages: true,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          renderEndnotes: true,
        });

        // Ensure all rendered section and article elements expand dynamically without clipping
        const sections = docxContainerRef.value.querySelectorAll('section');
        sections.forEach(s => {
          s.style.minHeight = 'auto';
          s.style.height = 'auto';
          s.style.overflow = 'visible';
        });
      }
    } else if (isImage.value) {
      imageUrl.value = URL.createObjectURL(blob);
    } else {
      renderError.value = 'In-browser preview is available for PDF, Word (.docx), and image files. Use the Download button to open this file type locally.';
    }
  } catch (err) {
    console.error('Failed to render document preview:', err);
    renderError.value = 'Failed to generate document preview. You can still download the file directly.';
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
      revokeUrls();
      isLoading.value = false;
    }
  },
  { immediate: true }
);

// ─────────────────────────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────────────────────────

const emitClose = () => {
  emit('update:isOpen', false);
  emit('close');
};

const printDocxContainer = () => {
  if (!docxContainerRef.value) return;
  const printIframe = document.createElement('iframe');
  printIframe.style.position = 'fixed';
  printIframe.style.right = '0';
  printIframe.style.bottom = '0';
  printIframe.style.width = '0';
  printIframe.style.height = '0';
  printIframe.style.border = '0';
  document.body.appendChild(printIframe);

  // Extract all inline style elements rendered by docx-preview
  const styleTags = docxContainerRef.value.querySelectorAll('style');
  let inlineStyles = '';
  styleTags.forEach(s => { inlineStyles += s.innerHTML + '\n'; });

  const doc = printIframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${props.title || 'Job Order'}</title>
        <style>
          @page { size: A4 portrait; margin: 8mm; }
          body { 
            font-family: Arial, Helvetica, sans-serif; 
            margin: 0; 
            padding: 0; 
            color: #000; 
            background: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          table { border-collapse: collapse; width: 100%; margin: 4px 0; }
          th, td { border: 1px solid #334155; padding: 4px 6px; font-size: 9pt; }
          p { margin: 2px 0; font-size: 9pt; line-height: 1.3; }
          img { max-width: 100%; height: auto; }
          section { width: 100% !important; min-height: auto !important; height: auto !important; padding: 0 !important; margin: 0 !important; overflow: visible !important; }
          article { width: 100% !important; overflow: visible !important; }
          ${inlineStyles}
        </style>
      </head>
      <body>
        ${docxContainerRef.value.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  printIframe.contentWindow.focus();
  setTimeout(() => {
    try {
      printIframe.contentWindow.print();
    } catch (e) {
      console.warn('Print iframe error:', e);
    } finally {
      setTimeout(() => {
        if (printIframe.parentNode) {
          document.body.removeChild(printIframe);
        }
      }, 60000);
    }
  }, 400);
};

const printDocument = () => {
  if (isDocx.value) {
    printDocxContainer();
    return;
  }

  // 1. Try printing via the embedded iframe for PDF
  try {
    if (pdfIframeRef.value && pdfIframeRef.value.contentWindow) {
      pdfIframeRef.value.contentWindow.focus();
      pdfIframeRef.value.contentWindow.print();
      return;
    }
  } catch (iframeErr) {
    console.warn('Direct iframe print blocked or failed, falling back to print window:', iframeErr);
  }

  // 2. Fallback: Open in popup window and trigger print
  try {
    let url = pdfBlobUrl.value || imageUrl.value;
    if (!url && props.fileBlob) {
      url = URL.createObjectURL(props.fileBlob);
    } else if (!url && props.fileUrl) {
      url = props.fileUrl;
    }
    if (url) {
      const printWin = window.open(url, '_blank');
      if (printWin) {
        printWin.focus();
        setTimeout(() => {
          try {
            printWin.print();
          } catch (err) {
            console.warn('Auto print error in new window:', err);
          }
        }, 500);
      }
    }
  } catch (e) {
    console.error('Print failed:', e);
    openInNewTab();
  }
};

const downloadDocxAsPdf = async () => {
  if (!docxContainerRef.value) return;
  isConvertingPdf.value = true;
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    
    // Create an isolated clone container to prevent scroll offsets and Tailwind v4 stylesheet conflicts
    const sourceEl = docxContainerRef.value;
    const clone = sourceEl.cloneNode(true);
    clone.style.width = '800px';
    clone.style.maxWidth = '800px';
    clone.style.margin = '0 auto';
    clone.style.padding = '24px 32px';
    clone.style.background = '#ffffff';
    clone.style.color = '#000000';
    clone.style.boxSizing = 'border-box';
    clone.style.overflow = 'visible';
    clone.style.height = 'auto';

    // Normalize all sections inside the clone
    const sections = clone.querySelectorAll('section');
    sections.forEach(s => {
      s.style.width = '100%';
      s.style.minHeight = 'auto';
      s.style.height = 'auto';
      s.style.padding = '0';
      s.style.margin = '0';
      s.style.overflow = 'visible';
    });

    const tables = clone.querySelectorAll('table');
    tables.forEach(t => {
      t.style.width = '100%';
      t.style.maxWidth = '100%';
      t.style.tableLayout = 'auto';
    });

    const offscreenContainer = document.createElement('div');
    offscreenContainer.style.position = 'fixed';
    offscreenContainer.style.left = '0';
    offscreenContainer.style.top = '0';
    offscreenContainer.style.width = '800px';
    offscreenContainer.style.zIndex = '-99999';
    offscreenContainer.style.background = '#ffffff';
    offscreenContainer.style.opacity = '1';
    offscreenContainer.appendChild(clone);
    document.body.appendChild(offscreenContainer);

    try {
      const filename = (props.fileName || 'FGMU_Job_Request_Form').replace(/\.docx?$/i, '') + '.pdf';
      const opt = {
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
          windowWidth: 800,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
        pagebreak: { mode: ['css', 'legacy'] },
      };

      await html2pdf().set(opt).from(clone).save();
      toast.success('Official PDF exported and downloaded!');
    } finally {
      if (offscreenContainer.parentNode) {
        document.body.removeChild(offscreenContainer);
      }
    }
  } catch (err) {
    console.error('Failed to convert docx to PDF via html2pdf, falling back to print dialog:', err);
    printDocxContainer();
    toast.info('Opening Print dialog — select "Save as PDF" to save.');
  } finally {
    isConvertingPdf.value = false;
  }
};

const openInNewTab = () => {
  try {
    let url = pdfBlobUrl.value || imageUrl.value;
    if (!url && props.fileBlob) {
      url = URL.createObjectURL(props.fileBlob);
    } else if (!url && props.fileUrl) {
      url = props.fileUrl;
    }
    if (url) {
      const win = window.open(url, '_blank');
      if (!win) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    }
  } catch (e) {
    console.error('Failed to open document in new tab:', e);
    toast.error('Could not open in new tab.');
  }
};

const downloadFile = () => {
  try {
    const blob = props.fileBlob;
    const name = props.fileName || `${props.title || 'document'}.pdf`;

    if (blob) {
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Document downloaded!');
    } else if (props.fileUrl) {
      const link = document.createElement('a');
      link.href  = props.fileUrl;
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
</script>

<style>
/* ── Modal transition ───────────────────────────────────────────────────────── */
.doc-modal-enter-active,
.doc-modal-leave-active {
  transition: opacity 0.25s ease;
}

.doc-modal-enter-from,
.doc-modal-leave-to {
  opacity: 0;
}

/* ── Docx Paper Canvas ─────────────────────────────────────────────────────── */
.docx-render-paper {
  background-color: #ffffff !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid #cbd5e1 !important;
  border-radius: 6px !important;
  padding: 32px 40px 48px 40px !important;
  min-height: auto !important;
  height: auto !important;
  overflow: visible !important;
  box-sizing: border-box !important;
  margin: 16px auto !important;
}

/* Override docx-preview internal styles that cause clipping and overflows */
.docx-render-paper section.docx-preview,
.docx-render-paper section.docx,
.docx-render-paper section {
  background: transparent !important;
  box-shadow: none !important;
  width: 100% !important;
  max-width: 100% !important;
  min-height: auto !important;
  height: auto !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: visible !important;
  display: block !important;
}

.docx-render-paper section.docx-preview > article,
.docx-render-paper section > article {
  width: 100% !important;
  max-width: 100% !important;
  overflow: visible !important;
  display: block !important;
}

.docx-render-paper section.docx-preview > header,
.docx-render-paper section > header {
  width: 100% !important;
  max-width: 100% !important;
  margin-top: 0 !important;
  margin-bottom: 12px !important;
  min-height: auto !important;
  overflow: visible !important;
}

/* Ensure tables fit nicely without horizontal or vertical clipping */
.docx-render-paper table {
  width: 100% !important;
  max-width: 100% !important;
  border-collapse: collapse !important;
  margin-bottom: 8px !important;
}

.docx-render-paper td,
.docx-render-paper th {
  word-break: break-word !important;
  overflow-wrap: break-word !important;
}

/* Ensure images, shapes and drawings stay inside the paper */
.docx-render-paper img,
.docx-render-paper svg {
  max-width: 100% !important;
  height: auto !important;
}
</style>
