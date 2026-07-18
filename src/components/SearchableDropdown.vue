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
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const searchQuery = ref('');
const dropdownRef = ref(null);

// Sync query with modelValue initially if needed, or clear it
watch(() => props.modelValue, (newVal) => {
  if (newVal !== searchQuery.value) {
    searchQuery.value = newVal;
  }
}, { immediate: true });

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  
  const query = searchQuery.value.toLowerCase();
  
  return props.options.map(group => {
    return {
      ...group,
      items: group.items.filter(item => item.toLowerCase().includes(query))
    };
  }).filter(group => group.items.length > 0);
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && props.modelValue === searchQuery.value) {
    // Optionally clear search on open to see all options
    searchQuery.value = '';
  }
};

const selectOption = (item) => {
  searchQuery.value = item;
  emit('update:modelValue', item);
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
    // Reset search query to modelValue if they click away without selecting
    if (searchQuery.value !== props.modelValue) {
      searchQuery.value = props.modelValue;
    }
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
  const map = {
    emerald: 'focus:border-emerald-500',
    amber: 'focus:border-amber-500',
    blue: 'focus:border-blue-500'
  };
  return map[props.theme] || 'focus:border-emerald-500';
});

const groupTextClass = computed(() => {
  const map = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    blue: 'text-blue-600'
  };
  return map[props.theme] || 'text-emerald-600';
});
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <div class="relative">
      <input
        type="text"
        v-model="searchQuery"
        @focus="isOpen = true"
        :placeholder="placeholder"
        class="w-full h-14 px-6 pr-12 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:bg-white text-sm font-bold outline-none transition-all shadow-sm text-slate-700"
        :class="focusBorderClass"
      />
      <div 
        @click="toggleDropdown" 
        class="absolute inset-y-0 right-2 w-10 flex items-center justify-center cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200" :class="isOpen ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen" 
      class="absolute z-50 w-full mt-2 bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden animate-fade-in"
    >
      <div class="max-h-64 overflow-y-auto p-3 scrollbar-thin">
        <template v-if="filteredOptions.length > 0">
          <div v-for="category in filteredOptions" :key="category.group" class="mb-3 last:mb-0">
            <div class="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-slate-50 rounded-xl mb-1" :class="groupTextClass">
              {{ category.group }}
            </div>
            <div 
              v-for="loc in category.items" 
              :key="loc"
              @click="selectOption(loc)"
              class="px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl cursor-pointer transition-colors"
            >
              {{ loc }}
            </div>
          </div>
        </template>
        <div v-else class="p-6 text-center">
          <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <p class="text-sm font-bold text-slate-400">No matches found</p>
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
