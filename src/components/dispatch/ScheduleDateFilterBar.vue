<template>
  <div
    data-tour="scheduled-date-filters"
    class="border-t border-slate-100 px-2.5 py-2 flex flex-col lg:flex-row lg:items-center justify-between gap-2 bg-slate-50/40"
  >
    <div class="flex items-center gap-2 flex-wrap">
      <div class="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500 pl-0.5 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Implementation Date</span>
      </div>

      <div
        role="group"
        aria-label="Filter scheduled tickets by implementation date"
        class="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/70 shadow-inner"
      >
        <button
          v-for="option in filterOptions"
          :key="option.value"
          type="button"
          :aria-pressed="modelValue === option.value"
          :title="option.tooltip"
          @click="selectFilter(option.value)"
          :class="[
            'px-3 py-1.5 min-h-[36px] rounded-lg text-xs transition-all duration-150 ease-in-out inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.98] touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
            focusRingClass,
            modelValue === option.value
              ? activeButtonClass(option.value)
              : 'font-bold text-slate-600 hover:text-slate-900 hover:bg-white/75'
          ]"
        >
          <span>{{ option.label }}</span>
          <span
            :class="[
              'px-1.5 py-0.5 rounded-md text-[11px] font-black leading-none min-w-[22px] text-center tabular-nums transition-colors',
              modelValue === option.value
                ? activeBadgeClass(option.value)
                : 'bg-slate-200/90 text-slate-800'
            ]"
          >
            {{ option.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Active Scope / Date Window Summary -->
    <div class="flex items-center gap-2 flex-wrap text-[11px] font-semibold text-slate-500 pl-0.5 lg:pl-0">
      <template v-if="modelValue === SCHEDULE_DATE_FILTER.THIS_WEEK">
        <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold', summaryPillClass]">
          <span class="tabular-nums">{{ counts.thisWeek }}</span>
          <span>{{ counts.thisWeek === 1 ? singularLabel : pluralLabel }}</span>
          <span class="opacity-70">•</span>
          <span>{{ periodLabels.weekRangeLabel }}</span>
        </span>
        <button
          type="button"
          @click="selectFilter(SCHEDULE_DATE_FILTER.ALL)"
          class="px-2 py-1 min-h-[32px] rounded-lg text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </template>

      <template v-else-if="modelValue === SCHEDULE_DATE_FILTER.THIS_MONTH">
        <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold', summaryPillClass]">
          <span class="tabular-nums">{{ counts.thisMonth }}</span>
          <span>{{ counts.thisMonth === 1 ? singularLabel : pluralLabel }}</span>
          <span class="opacity-70">•</span>
          <span>{{ periodLabels.monthLabel }}</span>
        </span>
        <button
          type="button"
          @click="selectFilter(SCHEDULE_DATE_FILTER.ALL)"
          class="px-2 py-1 min-h-[32px] rounded-lg text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </template>

      <template v-else>
        <span class="hidden sm:inline-flex items-center gap-1.5 text-slate-500">
          <span>Week: <strong class="text-slate-700 font-bold">{{ periodLabels.weekRangeLabel }}</strong></span>
          <span class="text-slate-300">•</span>
          <span>Month: <strong class="text-slate-700 font-bold">{{ periodLabels.monthShortLabel }}</strong></span>
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { SCHEDULE_DATE_FILTER, getSchedulePeriodLabels } from '@/utils/scheduleDateFilter';

const props = defineProps({
  modelValue: {
    type: String,
    default: SCHEDULE_DATE_FILTER.ALL,
  },
  counts: {
    type: Object,
    default: () => ({ all: 0, thisWeek: 0, thisMonth: 0 }),
  },
  accent: {
    type: String,
    default: 'emerald', // 'emerald' | 'amber' | 'indigo'
  },
  singularLabel: {
    type: String,
    default: 'job',
  },
  pluralLabel: {
    type: String,
    default: 'jobs',
  },
  referenceDate: {
    type: [Date, String],
    default: undefined,
  },
});

const emit = defineEmits(['update:modelValue']);

const periodLabels = computed(() => getSchedulePeriodLabels(props.referenceDate));

const filterOptions = computed(() => [
  {
    value: SCHEDULE_DATE_FILTER.ALL,
    label: 'All Dates',
    count: Number(props.counts?.all) || 0,
    tooltip: 'Show all scheduled tickets',
  },
  {
    value: SCHEDULE_DATE_FILTER.THIS_WEEK,
    label: 'This Week',
    count: Number(props.counts?.thisWeek) || 0,
    tooltip: `Implementation dates within ${periodLabels.value.weekRangeLabel} (Mon–Sun)`,
  },
  {
    value: SCHEDULE_DATE_FILTER.THIS_MONTH,
    label: 'This Month',
    count: Number(props.counts?.thisMonth) || 0,
    tooltip: `Implementation dates within ${periodLabels.value.monthLabel}`,
  },
]);

const focusRingClass = computed(() => {
  if (props.accent === 'amber') return 'focus-visible:ring-amber-600';
  if (props.accent === 'indigo') return 'focus-visible:ring-indigo-600';
  return 'focus-visible:ring-emerald-600';
});

const summaryPillClass = computed(() => {
  if (props.accent === 'amber') return 'bg-amber-50 text-amber-900 border-amber-200';
  if (props.accent === 'indigo') return 'bg-indigo-50 text-indigo-900 border-indigo-200';
  return 'bg-emerald-50 text-emerald-900 border-emerald-200';
});

const activeButtonClass = (value) => {
  if (value === SCHEDULE_DATE_FILTER.ALL) {
    return 'bg-white text-slate-900 shadow-xs font-black';
  }
  if (props.accent === 'amber') return 'bg-amber-700 text-white shadow-xs font-black';
  if (props.accent === 'indigo') return 'bg-indigo-600 text-white shadow-xs font-black';
  return 'bg-emerald-700 text-white shadow-xs font-black';
};

const activeBadgeClass = (value) => {
  if (value === SCHEDULE_DATE_FILTER.ALL) {
    return 'bg-slate-100 text-slate-800 border border-slate-200/80';
  }
  if (props.accent === 'amber') return 'bg-white text-amber-950 font-black';
  if (props.accent === 'indigo') return 'bg-white text-indigo-950 font-black';
  return 'bg-white text-emerald-950 font-black';
};

const selectFilter = (value) => {
  emit('update:modelValue', value);
};
</script>

