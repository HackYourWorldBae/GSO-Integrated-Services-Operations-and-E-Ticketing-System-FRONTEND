<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  theme: {
    type: String,
    default: 'emerald' // allows emerald, amber, blue
  },
  hasError: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'blur']);

const isOpen = ref(false);
const searchQuery = ref('');
const dropdownRef = ref(null);

// Sync query with modelValue initially if needed, or when modelValue changes externally
watch(() => props.modelValue, (newVal) => {
  if (newVal !== searchQuery.value) {
    searchQuery.value = newVal || '';
  }
}, { immediate: true });

// Check if options are grouped [{ group: '...', items: [...] }] or flat strings ['...', '...']
const isGrouped = computed(() => {
  return Array.isArray(props.options) &&
    props.options.length > 0 &&
    typeof props.options[0] === 'object' &&
    props.options[0] !== null &&
    'items' in props.options[0];
});

const filteredGroupedOptions = computed(() => {
  if (!isGrouped.value) return [];
  if (!searchQuery.value) return props.options;

  const query = searchQuery.value.toLowerCase().trim();

  return props.options.map(group => {
    return {
      ...group,
      items: (group.items || []).filter(item => String(item).toLowerCase().includes(query))
    };
  }).filter(group => group.items.length > 0);
});

const filteredFlatOptions = computed(() => {
  if (isGrouped.value) return [];
  if (!searchQuery.value) return props.options || [];

  const query = searchQuery.value.toLowerCase().trim();
  return (props.options || []).filter(item => String(item).toLowerCase().includes(query));
});

const totalMatchesCount = computed(() => {
  if (isGrouped.value) {
    return filteredGroupedOptions.value.reduce((acc, g) => acc + g.items.length, 0);
  }
  return filteredFlatOptions.value.length;
});

// Check if current search query exactly matches an existing option
const hasExactMatch = computed(() => {
  const query = (searchQuery.value || '').toLowerCase().trim();
  if (!query) return false;

  if (isGrouped.value) {
    return props.options.some(g => (g.items || []).some(item => String(item).toLowerCase().trim() === query));
  }
  return (props.options || []).some(item => String(item).toLowerCase().trim() === query);
});

const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
};

const selectOption = (item) => {
  const finalValue = (item || '').trim();
  searchQuery.value = finalValue;
  emit('update:modelValue', finalValue);
  emit('blur');
  isOpen.value = false;
};

const handleInput = () => {
  emit('update:modelValue', searchQuery.value);
  isOpen.value = true;
};

const clearValue = () => {
  searchQuery.value = '';
  emit('update:modelValue', '');
  emit('blur');
  isOpen.value = false;
};

const handleEnter = () => {
  if (searchQuery.value) {
    selectOption(searchQuery.value);
  }
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
    if (searchQuery.value !== props.modelValue) {
      emit('update:modelValue', (searchQuery.value || '').trim());
    }
    emit('blur');
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Dynamic theme classes
const focusBorderClass = computed(() => {
  if (props.hasError) {
    return 'border-red-500 focus:border-red-500 text-red-900 bg-red-50/20';
  }
  const map = {
    emerald: 'border-slate-50 focus:border-emerald-500 text-slate-700',
    amber: 'border-slate-50 focus:border-amber-500 text-slate-700',
    blue: 'border-slate-50 focus:border-blue-500 text-slate-700'
  };
  return map[props.theme] || 'border-slate-50 focus:border-emerald-500 text-slate-700';
});

const groupTextClass = computed(() => {
  const map = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    blue: 'text-blue-600'
  };
  return map[props.theme] || 'text-emerald-600';
});

const itemHoverClass = computed(() => {
  const map = {
    emerald: 'hover:bg-emerald-50 hover:text-emerald-800',
    amber: 'hover:bg-amber-50 hover:text-amber-800',
    blue: 'hover:bg-blue-50 hover:text-blue-800'
  };
  return map[props.theme] || 'hover:bg-emerald-50 hover:text-emerald-800';
});
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <div class="relative">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        @focus="isOpen = true"
        @keydown.enter.prevent="handleEnter"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full min-h-[48px] h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-slate-50 border-2 focus:bg-white text-base sm:text-sm font-bold outline-none transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[focusBorderClass, searchQuery ? 'pr-20' : 'pr-12']"
      />

      <!-- Clear button: visible when there is a value -->
      <button
        v-if="searchQuery"
        type="button"
        @click.stop="clearValue"
        class="absolute inset-y-0 right-10 w-9 flex items-center justify-center cursor-pointer text-slate-300 hover:text-rose-500 transition-colors"
        title="Clear selection"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Chevron toggle -->
      <div
        @click="toggleDropdown"
        class="absolute inset-y-0 right-1 w-9 flex items-center justify-center cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200" :class="isOpen ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen && !disabled" 
      class="absolute z-50 w-full mt-2 bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden animate-fade-in"
    >
      <div class="max-h-64 overflow-y-auto p-2 sm:p-3 scrollbar-thin">
        
        <!-- Grouped Options (e.g. Colleges, Admin, Auxiliary) -->
        <template v-if="isGrouped && filteredGroupedOptions.length > 0">
          <div v-for="category in filteredGroupedOptions" :key="category.group" class="mb-2 sm:mb-3 last:mb-0">
            <div class="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-50 rounded-lg sm:rounded-xl mb-1" :class="groupTextClass">
              {{ category.group }}
            </div>
            <div 
              v-for="loc in category.items" 
              :key="loc"
              @click="selectOption(loc)"
              class="px-3.5 py-2.5 sm:py-3 min-h-[44px] flex items-center text-xs sm:text-sm font-bold text-slate-600 rounded-lg sm:rounded-xl cursor-pointer transition-colors active:bg-slate-100"
              :class="itemHoverClass"
            >
              {{ loc }}
            </div>
          </div>
        </template>

        <!-- Flat Options (e.g. Predefined 3 Rooms for a building) -->
        <template v-else-if="!isGrouped && filteredFlatOptions.length > 0">
          <div 
            v-for="loc in filteredFlatOptions" 
            :key="loc"
            @click="selectOption(loc)"
            class="px-3.5 py-2.5 sm:py-3 min-h-[44px] flex items-center text-xs sm:text-sm font-bold text-slate-600 rounded-lg sm:rounded-xl cursor-pointer transition-colors active:bg-slate-100"
            :class="itemHoverClass"
          >
            {{ loc }}
          </div>
        </template>

        <!-- Use Custom Typed Value (When query doesn't match list exactly) -->
        <div v-if="searchQuery.trim().length > 0 && !hasExactMatch" class="pt-2" :class="totalMatchesCount > 0 ? 'mt-2 border-t border-slate-100' : ''">
          <div v-if="totalMatchesCount === 0" class="text-center py-2">
            <p class="text-[11px] font-bold text-slate-400 mb-2">Not in the predefined list?</p>
          </div>
          <button 
            type="button"
            @click="selectOption(searchQuery)"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-colors w-full flex items-center justify-between gap-2"
          >
            <span class="truncate">Use typed: "{{ searchQuery.trim() }}"</span>
            <span class="text-[9px] font-black uppercase tracking-widest bg-white text-slate-500 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">Custom</span>
          </button>
        </div>

        <!-- Empty state when no options exist at all -->
        <div v-else-if="totalMatchesCount === 0 && searchQuery.trim().length === 0" class="p-4 text-center">
          <p class="text-xs font-bold text-slate-400">No options available. Type to enter a custom value.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform-origin: top;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scaleY(0.95); }
  to { opacity: 1; transform: scaleY(1); }
}

/* Custom Scrollbar for the dropdown */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
