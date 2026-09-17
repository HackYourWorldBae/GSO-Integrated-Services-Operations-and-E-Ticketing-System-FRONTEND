<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">LEAU Analytics</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Landscaping & Environmental Aesthetics Oversight</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Outcome & Throughput Overview (Top 3 Cards + Historical Drilldown Filter) -->
        <div class="space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-1">
            <div class="flex flex-wrap items-center gap-3">
              <div>
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span class="w-2 h-4 rounded-full bg-slate-900"></span>
                  Throughput &amp; Outcome Analytics
                </h3>
                <p class="text-[11px] text-slate-400 font-medium">Outcome metrics with multi-year, periodic, and daily drilldown capability</p>
              </div>

              <!-- Today's Daily Pulse Quick Filter Button -->
              <button 
                type="button"
                @click="selectToday" 
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold hover:bg-teal-100 transition-all cursor-pointer shadow-xs"
                :class="selectedPeriod === 'day' && selectedDate === todayDateString ? 'ring-2 ring-teal-500 ring-offset-1 bg-teal-100/90' : ''"
                title="Click to view Today's Daily analytics"
              >
                <span class="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Today: <strong class="tabular-nums">{{ stats.daily_total ?? 0 }}</strong> Requests &bull; <strong class="tabular-nums">{{ stats.daily_resolved ?? 0 }}</strong> Completed</span>
              </button>
            </div>

            <!-- Filter Controls (Historical Multi-Year + Period + Daily) -->
            <div class="flex flex-wrap items-center gap-2">
              <!-- Period Type Tabs -->
              <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner w-full sm:w-auto">
                <button
                  v-for="p in periodOptions"
                  :key="p.key"
                  @click="changePeriod(p.key)"
                  class="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[40px] touch-manipulation flex items-center justify-center"
                  :class="selectedPeriod === p.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
                >
                  {{ p.label }}
                </button>
              </div>

              <!-- Day Date Picker (shown when selectedPeriod === 'day') -->
              <div v-if="selectedPeriod === 'day'" class="flex flex-wrap items-center gap-1.5 animate-fade-in">
                <input
                  type="date"
                  v-model="selectedDate"
                  :max="todayDateString"
                  @change="fetchStats"
                  class="px-3 py-2 min-h-[40px] bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer"
                />
                <div class="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 shadow-inner">
                  <button
                    type="button"
                    @click="selectToday"
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer"
                    :class="selectedDate === todayDateString ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    @click="selectYesterday"
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer text-slate-600 hover:text-slate-900"
                  >
                    Yesterday
                  </button>
                </div>
              </div>

              <!-- Year Selector (visible when selectedPeriod !== 'all' && selectedPeriod !== 'day') -->
              <div v-if="selectedPeriod !== 'all' && selectedPeriod !== 'day'" class="relative flex-1 sm:flex-none">
                <select
                  v-model="selectedYear"
                  @change="fetchStats"
                  class="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-base sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer min-h-[44px]"
                >
                  <option v-for="yr in availableYears" :key="yr" :value="yr">
                    Year {{ yr }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Month Selector (shown when selectedPeriod === 'month') -->
              <div v-if="selectedPeriod === 'month'" class="relative flex-1 sm:flex-none">
                <select
                  v-model="selectedMonth"
                  @change="fetchStats"
                  class="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-base sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer min-h-[44px]"
                >
                  <option v-for="m in monthOptions" :key="m.value" :value="m.value">
                    {{ m.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Quarter Selector (shown when selectedPeriod === 'quarter') -->
              <div v-if="selectedPeriod === 'quarter'" class="relative flex-1 sm:flex-none">
                <select
                  v-model="selectedQuarter"
                  @change="fetchStats"
                  class="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-base sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer min-h-[44px]"
                >
                  <option v-for="q in quarterOptions" :key="q.value" :value="q.value">
                    {{ q.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Top 3 Cards Grid: Total, Resolved, Declined -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <!-- 1. Total Requests / Daily Total Requests -->
            <div class="group p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="p-3 rounded-2xl bg-slate-900 text-white shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span class="text-[10px] font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">
                  {{ selectedPeriod === 'day' ? 'Daily Requests' : 'Total Requests' }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.total || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                  {{ selectedPeriod === 'day' ? 'Daily Total Requests' : timeframeLabel }}
                </p>
                <p v-if="selectedPeriod === 'day'" class="text-[10px] text-slate-400 font-medium mt-0.5">
                  {{ timeframeLabel }}
                </p>
              </div>
            </div>

            <!-- 2. Resolved Tickets / Daily Completed Jobs -->
            <div class="group p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="p-3 rounded-2xl bg-teal-50 text-teal-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <span class="text-[10px] font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">
                  {{ selectedPeriod === 'day' ? 'Daily Completed' : 'Completed' }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.resolved || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                  {{ selectedPeriod === 'day' ? 'Daily Completed Jobs' : timeframeLabel }}
                </p>
                <p v-if="selectedPeriod === 'day'" class="text-[10px] text-slate-400 font-medium mt-0.5">
                  {{ timeframeLabel }}
                </p>
              </div>
            </div>

            <!-- 3. Declined Requests / Daily Declined Requests -->
            <div class="group p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="p-3 rounded-2xl bg-rose-50 text-rose-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                </div>
                <span class="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">
                  {{ selectedPeriod === 'day' ? 'Daily Declined' : 'Declined' }}
                </span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.declined || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                  {{ selectedPeriod === 'day' ? 'Daily Declined Requests' : timeframeLabel }}
                </p>
                <p v-if="selectedPeriod === 'day'" class="text-[10px] text-slate-400 font-medium mt-0.5">
                  {{ timeframeLabel }}
                </p>
              </div>
            </div>
          </div>

          <!-- 7-Day Recent Daily Performance Activity Breakdown -->
          <div v-if="stats.daily_breakdown && stats.daily_breakdown.length > 0" class="p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
              <div>
                <h4 class="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-teal-500"></span>
                  Daily Performance &amp; Activity Tracker (Last 7 Days)
                </h4>
                <p class="text-[11px] text-slate-400 font-medium mt-0.5">
                  Click any day below to filter throughput analytics for that specific date
                </p>
              </div>
              <span class="text-[10px] font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                7-Day Overview
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              <button
                v-for="day in stats.daily_breakdown"
                :key="day.date"
                type="button"
                @click="selectBreakdownDay(day.date)"
                class="p-3 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer group hover:scale-[1.02]"
                :class="selectedPeriod === 'day' && selectedDate === day.date
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900 ring-offset-2'
                  : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-800'"
              >
                <div>
                  <div class="flex items-center justify-between gap-1 mb-1">
                    <span 
                      class="text-xs font-black uppercase tracking-wider"
                      :class="selectedPeriod === 'day' && selectedDate === day.date ? 'text-teal-400' : (day.is_today ? 'text-teal-600' : 'text-slate-500')"
                    >
                      {{ day.day_name }}
                    </span>
                    <span 
                      v-if="day.is_today" 
                      class="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tight"
                      :class="selectedPeriod === 'day' && selectedDate === day.date ? 'bg-teal-400/20 text-teal-300' : 'bg-teal-100 text-teal-700'"
                    >
                      Today
                    </span>
                  </div>
                  <p 
                    class="text-xs font-bold"
                    :class="selectedPeriod === 'day' && selectedDate === day.date ? 'text-slate-300' : 'text-slate-600'"
                  >
                    {{ day.label }}
                  </p>
                </div>

                <div class="mt-3 pt-2.5 border-t" :class="selectedPeriod === 'day' && selectedDate === day.date ? 'border-slate-800' : 'border-slate-200/70'">
                  <div class="flex items-center justify-between text-[11px] mb-0.5">
                    <span :class="selectedPeriod === 'day' && selectedDate === day.date ? 'text-slate-300' : 'text-slate-500'">Requests</span>
                    <span class="font-black tabular-nums" :class="selectedPeriod === 'day' && selectedDate === day.date ? 'text-white' : 'text-slate-800'">{{ day.total_requests }}</span>
                  </div>
                  <div class="flex items-center justify-between text-[11px]">
                    <span :class="selectedPeriod === 'day' && selectedDate === day.date ? 'text-teal-300' : 'text-teal-600'">Completed</span>
                    <span class="font-black tabular-nums" :class="selectedPeriod === 'day' && selectedDate === day.date ? 'text-teal-400' : 'text-teal-700'">{{ day.completed_jobs }}</span>
                  </div>

                  <!-- Mini completion bar -->
                  <div class="w-full h-1.5 rounded-full overflow-hidden mt-1.5" :class="selectedPeriod === 'day' && selectedDate === day.date ? 'bg-slate-800' : 'bg-slate-200'">
                    <div 
                      class="h-full bg-teal-500 rounded-full transition-all duration-300" 
                      :style="{ width: (day.total_requests > 0 ? Math.min(100, Math.round((day.completed_jobs / day.total_requests) * 100)) : (day.completed_jobs > 0 ? 100 : 0)) + '%' }"
                    ></div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Live Operations & Queue Status (Bottom 3 Cards) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <div>
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span class="w-2 h-4 rounded-full bg-amber-600"></span>
                Live Operations &amp; Queue Status
              </h3>
              <p class="text-[11px] text-slate-400 font-medium">Real-time in-flight tickets awaiting action or currently under service</p>
            </div>
          </div>


          <!-- Bottom 3 Cards Grid: Pending, Dispatched, Active -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <!-- 1. Pending -->
            <div class="group p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between">
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="p-3 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Pending</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.pending || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Awaiting Approval</p>
              </div>
            </div>

            <!-- 2. Dispatched & Scheduled -->
            <div class="group p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between">
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Dispatched</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.scheduled || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Scheduled Jobs</p>
              </div>
            </div>

            <!-- 3. Active Dispatches -->
            <div class="group p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between">
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="p-3 rounded-2xl bg-emerald-100 text-emerald-700 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-tight shrink-0 whitespace-nowrap">Active</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tabular-nums">{{ stats.active_working || 0 }}</h3>
                <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Work In Progress</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Evaluation Averages & Job Completion Health (Words & Numbers) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Performance Evaluation Averages -->
          <div class="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col min-h-[350px]">
            <h4 class="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 italic">
              <div class="w-2 h-6 bg-teal-500 rounded-full"></div>
              Evaluation Averages
            </h4>
            <div class="flex-1 flex flex-col justify-center space-y-6">
              <div v-for="(metric, idx) in [
                { label: 'Quality', val: safeVal(stats?.feedback_averages?.avg_quality) },
                { label: 'Efficiency', val: safeVal(stats?.feedback_averages?.avg_efficiency) },
                { label: 'Timeliness', val: safeVal(stats?.feedback_averages?.avg_timeliness) }
              ]" :key="idx" class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-slate-700 uppercase tracking-widest">{{ metric.label }}</span>
                  <span class="text-xl font-black text-slate-900">{{ metric.val.toFixed(1) }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <div class="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-400 rounded-full" :style="{ width: (metric.val / 5 * 100) + '%' }"></div>
                  </div>
                  <div class="flex gap-0.5 text-amber-400">
                    <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= Math.round(metric.val) ? 'fill-current' : 'text-slate-200 fill-current'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Job Completion Health (Words & Numbers) -->
          <div class="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-6">
                <h4 class="text-lg font-black text-slate-900 flex items-center gap-2 italic">
                  <div class="w-2 h-6 bg-slate-800 rounded-full"></div>
                  Job Completion Health
                </h4>
                <span class="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black rounded-full uppercase tracking-wider">
                  {{ completionStats.total }} Evaluated Jobs
                </span>
              </div>

              <!-- 4 Metric Cards Breakdown -->
              <div class="space-y-3.5">
                <!-- Early / Ahead of Schedule -->
                <div class="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                      <span class="text-xs font-black text-slate-800 uppercase tracking-wider">Early / Ahead of Schedule</span>
                    </div>
                    <div class="flex items-baseline gap-1.5">
                      <span class="text-xl font-black text-sky-700 tabular-nums">{{ completionStats.earlyFinished }}</span>
                      <span class="text-xs font-bold text-sky-600">({{ completionStats.earlyFinishedPercent }}%)</span>
                    </div>
                  </div>
                  <div class="w-full h-2 bg-sky-200/50 rounded-full overflow-hidden">
                    <div class="h-full bg-sky-500 rounded-full transition-all duration-500" :style="{ width: completionStats.earlyFinishedPercent + '%' }"></div>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium">Jobs completed ahead of designated target schedule</p>
                </div>

                <!-- On-Time -->
                <div class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span class="text-xs font-black text-slate-800 uppercase tracking-wider">On-Time Completion</span>
                    </div>
                    <div class="flex items-baseline gap-1.5">
                      <span class="text-xl font-black text-emerald-700 tabular-nums">{{ completionStats.onTime }}</span>
                      <span class="text-xs font-bold text-emerald-600">({{ completionStats.onTimePercent }}%)</span>
                    </div>
                  </div>
                  <div class="w-full h-2 bg-emerald-200/50 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full transition-all duration-500" :style="{ width: completionStats.onTimePercent + '%' }"></div>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium">Jobs completed strictly within scheduled timeframe</p>
                </div>

                <!-- Beyond Time / Delayed -->
                <div class="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span class="text-xs font-black text-slate-800 uppercase tracking-wider">Completed Beyond Time</span>
                    </div>
                    <div class="flex items-baseline gap-1.5">
                      <span class="text-xl font-black text-amber-700 tabular-nums">{{ completionStats.beyondTime }}</span>
                      <span class="text-xs font-bold text-amber-600">({{ completionStats.beyondTimePercent }}%)</span>
                    </div>
                  </div>
                  <div class="w-full h-2 bg-amber-200/50 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-500 rounded-full transition-all duration-500" :style="{ width: completionStats.beyondTimePercent + '%' }"></div>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium">Finished with reported timeline extensions or delays</p>
                </div>

                <!-- Not Completed / Halted -->
                <div class="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span class="text-xs font-black text-slate-800 uppercase tracking-wider">Not Completed / Halted</span>
                    </div>
                    <div class="flex items-baseline gap-1.5">
                      <span class="text-xl font-black text-rose-700 tabular-nums">{{ completionStats.notCompleted }}</span>
                      <span class="text-xs font-bold text-rose-600">({{ completionStats.notCompletedPercent }}%)</span>
                    </div>
                  </div>
                  <div class="w-full h-2 bg-rose-200/50 rounded-full overflow-hidden">
                    <div class="h-full bg-rose-500 rounded-full transition-all duration-500" :style="{ width: completionStats.notCompletedPercent + '%' }"></div>
                  </div>
                  <p class="text-[11px] text-slate-500 font-medium">Work stalled or unfulfilled due to site constraints</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Delay & Barrier Root Cause Analysis (Ranked Words & Numbers) -->
          <div class="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col lg:col-span-2 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h4 class="text-lg font-black text-slate-900 flex items-center gap-2 italic">
                  <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
                  Root Cause Analysis (Why Delays & Barriers Happen)
                </h4>
                <p class="text-xs text-slate-500 font-medium mt-0.5">Top reported operational factors causing timeline extensions or work stoppages</p>
              </div>
              <span class="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-100">
                Improvement Focus
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              
              <!-- Delay Reasons List -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                    Completed Beyond Time (Delay Factors)
                  </p>
                  <span class="text-[11px] font-bold text-slate-400">{{ delayReasonsList.length }} Reasons</span>
                </div>

                <div v-if="delayReasonsList.length === 0" class="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <p class="text-xs font-bold text-slate-500">No Delay Reasons Reported</p>
                  <p class="text-[11px] text-slate-400 mt-1">All recorded jobs were finished on-time without reported delay factors.</p>
                </div>

                <div v-else class="space-y-3">
                  <div 
                    v-for="(item, idx) in delayReasonsList" 
                    :key="item.code"
                    class="p-4 rounded-2xl bg-amber-50/40 border border-amber-100/80 flex flex-col gap-2 hover:bg-amber-50 transition-colors"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2.5">
                        <span class="w-5 h-5 rounded-full bg-amber-200/80 text-amber-800 text-[10px] font-black flex items-center justify-center">
                          {{ idx + 1 }}
                        </span>
                        <span class="text-xs font-black text-slate-800">{{ item.name }}</span>
                      </div>
                      <div class="flex items-baseline gap-1 shrink-0">
                        <span class="text-sm font-black text-amber-700 tabular-nums">{{ item.count }}</span>
                        <span class="text-[10px] font-bold text-slate-500">{{ item.count === 1 ? 'ticket' : 'tickets' }}</span>
                      </div>
                    </div>
                    <div class="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
                      <div class="h-full bg-amber-500 rounded-full" :style="{ width: item.percent + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Non-Completion Barriers List -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    Not Completed / Performed (Barriers)
                  </p>
                  <span class="text-[11px] font-bold text-slate-400">{{ nonCompletionList.length }} Barriers</span>
                </div>

                <div v-if="nonCompletionList.length === 0" class="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <p class="text-xs font-bold text-slate-500">No Non-Completion Barriers Reported</p>
                  <p class="text-[11px] text-slate-400 mt-1">No tasks were left uncompleted or halted due to barriers.</p>
                </div>

                <div v-else class="space-y-3">
                  <div 
                    v-for="(item, idx) in nonCompletionList" 
                    :key="item.code"
                    class="p-4 rounded-2xl bg-rose-50/40 border border-rose-100/80 flex flex-col gap-2 hover:bg-rose-50 transition-colors"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2.5">
                        <span class="w-5 h-5 rounded-full bg-rose-200/80 text-rose-800 text-[10px] font-black flex items-center justify-center">
                          {{ idx + 1 }}
                        </span>
                        <span class="text-xs font-black text-slate-800">{{ item.name }}</span>
                      </div>
                      <div class="flex items-baseline gap-1 shrink-0">
                        <span class="text-sm font-black text-rose-700 tabular-nums">{{ item.count }}</span>
                        <span class="text-[10px] font-bold text-slate-500">{{ item.count === 1 ? 'ticket' : 'tickets' }}</span>
                      </div>
                    </div>
                    <div class="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden">
                      <div class="h-full bg-rose-500 rounded-full" :style="{ width: item.percent + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Approval Delay Reasons List -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                    Approval Delay Reasons (Pre-Work)
                  </p>
                  <span class="text-[11px] font-bold text-slate-400">{{ approvalDelayList.length }} Reasons</span>
                </div>

                <div v-if="approvalDelayList.length === 0" class="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <p class="text-xs font-bold text-slate-500">No Approval Delays Reported</p>
                  <p class="text-[11px] text-slate-400 mt-1">All tickets were approved directly without deferred holds.</p>
                </div>

                <div v-else class="space-y-3">
                  <div 
                    v-for="(item, idx) in approvalDelayList" 
                    :key="item.name"
                    class="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/80 flex flex-col gap-2 hover:bg-blue-50 transition-colors"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2.5">
                        <span class="w-5 h-5 rounded-full bg-blue-200/80 text-blue-800 text-[10px] font-black flex items-center justify-center">
                          {{ idx + 1 }}
                        </span>
                        <span class="text-xs font-black text-slate-800 break-words">{{ item.name }}</span>
                      </div>
                      <div class="flex items-baseline gap-1 shrink-0">
                        <span class="text-sm font-black text-blue-700 tabular-nums">{{ item.count }}</span>
                        <span class="text-[10px] font-bold text-slate-500">{{ item.count === 1 ? 'ticket' : 'tickets' }}</span>
                      </div>
                    </div>
                    <div class="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                      <div class="h-full bg-blue-500 rounded-full" :style="{ width: item.percent + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import api from '@/api/client';

const stats = ref({});

const safeVal = (val) => parseFloat(val) || 0;

const formatReason = (code) => {
  if (!code) return 'None';
  const map = {
    personnelAbsent: "Personnel Absent",
    extendedBreak: "Extended Break Period",
    additionalWork: "Additional Work Requested",
    lackWorkingDays: "Lack of Working Days",
    lackMaterials: "Lack of Materials / Tools",
    lackSkills: "Lack of Skills / Expertise"
  };
  return map[code] || code.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const completionStats = computed(() => {
  const health = stats.value?.completion_health || [];
  const earlyFinished = parseInt(health.find(h => h.completion_status === 'early')?.count || 0);
  const onTime = parseInt(health.find(h => h.completion_status === 'on-time')?.count || 0);
  const beyondTime = parseInt(health.find(h => h.completion_status === 'beyond-time')?.count || 0);
  const notCompleted = parseInt(health.find(h => h.completion_status === 'not-completed')?.count || 0);
  const total = earlyFinished + onTime + beyondTime + notCompleted;
  
  const getPercent = (count) => total > 0 ? Math.round((count / total) * 100) : 0;
  
  return {
    earlyFinished,
    onTime,
    beyondTime,
    notCompleted,
    total,
    earlyFinishedPercent: getPercent(earlyFinished),
    onTimePercent: getPercent(onTime),
    beyondTimePercent: getPercent(beyondTime),
    notCompletedPercent: getPercent(notCompleted)
  };
});

const approvalDelayList = computed(() => {
  const items = stats.value?.approval_delay_reasons || [];
  const total = items.reduce((acc, r) => acc + parseInt(r.count || 0), 0);
  return items.map(r => ({
    name: r.reason_text || r.reason || 'General Delay',
    count: parseInt(r.count || 0),
    percent: total > 0 ? Math.round((parseInt(r.count || 0) / total) * 100) : 0
  })).sort((a, b) => b.count - a.count);
});

const delayReasonsList = computed(() => {
  const items = stats.value?.delay_reasons || [];
  const total = items.reduce((acc, r) => acc + parseInt(r.count || 0), 0);
  return items.map(r => ({
    code: r.reason_code,
    name: formatReason(r.reason_code),
    count: parseInt(r.count || 0),
    percent: total > 0 ? Math.round((parseInt(r.count || 0) / total) * 100) : 0
  })).sort((a, b) => b.count - a.count);
});

const nonCompletionList = computed(() => {
  const items = stats.value?.non_completion || [];
  const total = items.reduce((acc, r) => acc + parseInt(r.count || 0), 0);
  return items.map(r => ({
    code: r.reason_code,
    name: formatReason(r.reason_code),
    count: parseInt(r.count || 0),
    percent: total > 0 ? Math.round((parseInt(r.count || 0) / total) * 100) : 0
  })).sort((a, b) => b.count - a.count);
});

const formatDateToYMD = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const currentYear = new Date().getFullYear();
const todayDateString = formatDateToYMD(new Date());

const selectedPeriod = ref('all');
const selectedYear = ref(currentYear);
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedQuarter = ref(Math.ceil((new Date().getMonth() + 1) / 3));
const selectedDate = ref(todayDateString);

const periodOptions = [
  { key: 'all', label: 'All Time' },
  { key: 'year', label: 'Annually' },
  { key: 'quarter', label: 'Quarterly' },
  { key: 'month', label: 'Monthly' },
  { key: 'day', label: 'Daily' }
];

const availableYears = computed(() => {
  const years = stats.value?.available_years;
  if (Array.isArray(years) && years.length > 0) {
    return years;
  }
  return [currentYear];
});

const quarterOptions = [
  { value: 1, label: 'Q1 (Jan - Mar)' },
  { value: 2, label: 'Q2 (Apr - Jun)' },
  { value: 3, label: 'Q3 (Jul - Sep)' },
  { value: 4, label: 'Q4 (Oct - Dec)' }
];

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

const timeframeLabel = computed(() => {
  if (selectedPeriod.value === 'day') {
    return stats.value?.filter?.label || (selectedDate.value === todayDateString ? `Today (${selectedDate.value})` : selectedDate.value);
  }
  if (selectedPeriod.value === 'all') return 'All-Time Historical';
  if (selectedPeriod.value === 'year') return `Full Year ${selectedYear.value}`;
  if (selectedPeriod.value === 'quarter') return `Q${selectedQuarter.value} ${selectedYear.value}`;
  if (selectedPeriod.value === 'month') {
    const m = monthOptions.find(opt => opt.value === selectedMonth.value);
    return `${m ? m.label : 'Month'} ${selectedYear.value}`;
  }
  return 'Filtered Period';
});

const changePeriod = (key) => {
  selectedPeriod.value = key;
  fetchStats();
};

const selectToday = () => {
  selectedPeriod.value = 'day';
  selectedDate.value = todayDateString;
  fetchStats();
};

const selectYesterday = () => {
  selectedPeriod.value = 'day';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  selectedDate.value = formatDateToYMD(yesterday);
  fetchStats();
};

const selectBreakdownDay = (dayDate) => {
  selectedPeriod.value = 'day';
  selectedDate.value = dayDate;
  fetchStats();
};

const fetchStats = async () => {
  try {
    const params = {
      period: selectedPeriod.value
    };
    if (selectedPeriod.value !== 'all' && selectedPeriod.value !== 'day') {
      params.year = selectedYear.value;
    }
    if (selectedPeriod.value === 'quarter') {
      params.quarter = selectedQuarter.value;
    } else if (selectedPeriod.value === 'month') {
      params.month = selectedMonth.value;
    } else if (selectedPeriod.value === 'day') {
      params.date = selectedDate.value;
    }

    const response = await api.get('tickets/stats/LEAU', { params });
    if (response.data?.data?.stats) {
      stats.value = response.data.data.stats;
    }
  } catch (error) {
    console.error('Failed to fetch LEAU stats:', error);
  }
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
