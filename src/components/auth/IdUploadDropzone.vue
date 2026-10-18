<template>
  <div>
    <label class="block text-slate-700 text-xs font-bold mb-1.5">
      {{ label }} <span v-if="required" class="text-rose-500">*</span>
    </label>

    <!-- Empty Upload State -->
    <div
      v-if="!preview"
      @click="emit('select')"
      class="min-h-[120px] border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/80 hover:bg-emerald-50/30 rounded-xl p-3 text-center cursor-pointer transition-all group flex flex-col items-center justify-center active:scale-[0.99]"
    >
      <slot name="icon">
        <svg class="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </slot>
      <p class="text-[11px] font-bold text-slate-600 group-hover:text-emerald-700">{{ promptText }}</p>
      <p class="text-[10px] text-slate-400 mt-0.5">{{ hint }}</p>
    </div>

    <!-- Preview State -->
    <div v-else class="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-2xs">
      <div class="h-28 bg-slate-900 relative">
        <img :src="preview" :alt="label" class="w-full h-full object-cover" />
      </div>
      <div class="p-2 flex items-center justify-between">
        <p class="text-[10px] text-slate-600 font-medium truncate flex-1 mr-2">{{ file?.name }}</p>
        <div class="flex gap-2">
          <button type="button" @click="emit('select')" class="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer">
            Change
          </button>
          <button type="button" @click="emit('remove')" class="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer">
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <p v-if="error" class="mt-1 text-xs text-rose-500 font-medium">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  promptText: { type: String, default: 'Click to Upload' },
  hint: { type: String, default: 'or drag and drop file here' },
  required: { type: Boolean, default: true },
  preview: { type: String, default: null },
  file: { type: Object, default: null },
  error: { type: String, default: null },
});

const emit = defineEmits(['select', 'remove']);
</script>
