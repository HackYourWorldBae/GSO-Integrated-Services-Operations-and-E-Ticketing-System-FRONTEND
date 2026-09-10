<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Director Dashboard</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Executive Unit Oversight & Reports</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in pb-12">
        <!-- ================================================================= -->
        <!-- EXECUTIVE ANALYTICS SUMMARY & OFFICIAL REPORTS SECTION           -->
        <!-- ================================================================= -->
        <div class="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-slate-200/80 shadow-sm space-y-6">
          
          <!-- Section Header & Export Toolbar -->
          <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-black uppercase tracking-wider">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Official BSU Executive Document
              </div>
              <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Performance Overview &amp; Reports
              </h3>
              <p class="text-sm sm:text-base text-slate-500 font-medium max-w-3xl leading-relaxed">
                Generate and download official performance reports across all GSO units — covering ticket completion, service breakdown, and client satisfaction ratings.
              </p>
            </div>

            <!-- PDF Action Button -->
            <div class="flex items-center gap-3 shrink-0">
              <button
                @click="handleDownloadReport"
                :disabled="isGeneratingPdf || !executiveAnalytics"
                class="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-3 transition-all shadow-md shadow-slate-900/10 hover:shadow-emerald-700/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Generate and download official PDF report"
              >
                <svg v-if="isGeneratingPdf" class="animate-spin h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{{ isGeneratingPdf ? 'Generating PDF...' : 'Generate & Download Report' }}</span>
              </button>
            </div>
          </div>

          <!-- Interactive Period & Timeframe Selector Bar -->
          <div class="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <!-- Period Tabs -->
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-sm font-bold text-slate-600 mr-1">Report Period:</span>
              <div class="inline-flex p-1.5 rounded-xl bg-white border border-slate-200 shadow-xs gap-1">
                <button
                  v-for="p in periodOptions"
                  :key="p.key"
                  @click="changePeriod(p.key)"
                  class="px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer"
                  :class="selectedPeriod === p.key ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Dynamic Selectors (Year, Month, Quarter) -->
            <div class="flex flex-wrap items-center gap-3">
              <!-- Year Selector -->
              <div v-if="selectedPeriod !== 'all'" class="relative">
                <select
                  v-model="selectedYear"
                  @change="fetchExecutiveAnalytics"
                  class="appearance-none pl-4 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs cursor-pointer"
                >
                  <option v-for="yr in availableYears" :key="yr" :value="yr">
                    Year {{ yr }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Month Selector -->
              <div v-if="selectedPeriod === 'month'" class="relative">
                <select
                  v-model="selectedMonth"
                  @change="fetchExecutiveAnalytics"
                  class="appearance-none pl-4 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs cursor-pointer"
                >
                  <option v-for="m in monthOptions" :key="m.value" :value="m.value">
                    {{ m.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Quarter Selector -->
              <div v-if="selectedPeriod === 'quarter'" class="relative">
                <select
                  v-model="selectedQuarter"
                  @change="fetchExecutiveAnalytics"
                  class="appearance-none pl-4 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs cursor-pointer"
                >
                  <option v-for="q in quarterOptions" :key="q.value" :value="q.value">
                    {{ q.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Refresh / Reload Button -->
              <button
                @click="fetchExecutiveAnalytics"
                class="p-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition-all cursor-pointer shadow-xs"
                title="Refresh Report Data"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Executive KPI Cards Grid (Consolidated Overview) -->
          <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 lg:gap-6">
            <!-- 1. Total Requests Filed -->
            <div class="p-6 sm:p-7 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col justify-between min-h-[160px]">
              <div class="flex items-center justify-between gap-2 mb-4">
                <span class="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">Total Requests Filed</span>
                <span class="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">{{ executiveAnalytics?.filter?.label || 'All' }}</span>
              </div>
              <div class="text-4xl sm:text-5xl font-black tracking-tight tabular-nums mb-2">
                {{ executiveAnalytics?.summary?.total_requests ?? 0 }}
              </div>
              <p class="text-xs sm:text-sm text-slate-400 font-medium">
                Consolidated across FGMU, LEAU, &amp; SSU
              </p>
            </div>

            <!-- 2. Resolved & Completed -->
            <div class="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-sm flex flex-col justify-between min-h-[160px]">
              <div class="flex items-center justify-between gap-2 mb-4">
                <span class="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-600">Resolved &amp; Completed</span>
                <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-black">
                  {{ executiveAnalytics?.summary?.completion_rate ?? 0 }}% Rate
                </span>
              </div>
              <div class="text-4xl sm:text-5xl font-black tracking-tight tabular-nums text-slate-900 mb-2">
                {{ executiveAnalytics?.summary?.total_resolved ?? 0 }}
                <span class="text-sm font-bold text-slate-400">resolved</span>
              </div>
              <div>
                <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-600 rounded-full transition-all duration-500" :style="{ width: `${executiveAnalytics?.summary?.completion_rate || 0}%` }"></div>
                </div>
              </div>
            </div>

            <!-- 3. Declined / Out of Scope -->
            <div class="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-sm flex flex-col justify-between min-h-[160px]">
              <div class="flex items-center justify-between gap-2 mb-4">
                <span class="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-600">Declined / Out of Scope</span>
                <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                  Disapproved
                </span>
              </div>
              <div class="text-4xl sm:text-5xl font-black tracking-tight tabular-nums text-slate-900 mb-2">
                {{ executiveAnalytics?.summary?.total_declined ?? 0 }}
                <span class="text-sm font-bold text-slate-400">declined</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-500 font-medium">
                Non-compliant or out of administrative scope
              </p>
            </div>

            <!-- 4. Client Satisfaction Rating -->
            <div class="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-sm flex flex-col justify-between min-h-[160px]">
              <div class="flex items-center justify-between gap-2 mb-4">
                <span class="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-600">Client Satisfaction Score</span>
                <span class="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 text-xs font-black">
                  Out of 5.0
                </span>
              </div>
              <div class="flex items-baseline gap-2 mb-2">
                <span class="text-4xl sm:text-5xl font-black tracking-tight tabular-nums text-slate-900">
                  {{ executiveAnalytics?.summary?.overall_ratings?.overall_avg ? parseFloat(executiveAnalytics.summary.overall_ratings.overall_avg).toFixed(2) : '5.00' }}
                </span>
                <span class="text-base font-bold text-slate-400">/ 5.00</span>
              </div>
              <div class="flex items-center gap-1.5 text-amber-500">
                <svg v-for="i in 5" :key="i" class="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-xs sm:text-sm font-semibold text-slate-500 ml-1">
                  ({{ executiveAnalytics?.summary?.overall_ratings?.total_feedbacks || 0 }} surveys)
                </span>
              </div>
            </div>
          </div>

          <!-- Cross-Unit Performance Matrix Table -->
          <div class="space-y-4 pt-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 class="text-sm sm:text-base font-black uppercase tracking-wider text-slate-800 flex items-center gap-2.5">
                <span class="w-2 h-4 rounded-full bg-slate-900"></span>
                Sub-Unit Performance Matrix ({{ executiveAnalytics?.filter?.label || 'Current Period' }})
              </h4>
              <span class="text-xs sm:text-sm font-bold text-slate-400">By Unit</span>
            </div>

            <div class="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-xs">
              <table class="min-w-[650px] w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-100/70 text-slate-700 text-xs sm:text-sm font-black uppercase tracking-wider border-b border-slate-200">
                    <th class="py-4 px-6">Sub-Unit</th>
                    <th class="py-4 px-4 text-center">Total Requests</th>
                    <th class="py-4 px-4 text-center">Resolved</th>
                    <th class="py-4 px-4 text-center">Declined</th>
                    <th class="py-4 px-4 text-center">Completion Rate</th>
                    <th class="py-4 px-6 text-center">Client Rating</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-sm sm:text-base">
                  <!-- FGMU -->
                  <tr class="hover:bg-slate-50/70 transition-colors">
                    <td class="py-4 sm:py-5 px-6 font-bold text-slate-900">
                      <div class="text-base sm:text-lg font-bold">Facilities Management (FGMU)</div>
                      <span class="text-xs sm:text-sm text-slate-400 font-normal">Electrical, Plumbing, Carpentry, HVAC</span>
                    </td>
                    <td class="py-4 sm:py-5 px-4 text-center font-bold tabular-nums text-slate-900 text-base sm:text-lg">{{ executiveAnalytics?.units?.FGMU?.total ?? 0 }}</td>
                    <td class="py-4 sm:py-5 px-4 text-center font-black text-emerald-700 tabular-nums text-base sm:text-lg">{{ executiveAnalytics?.units?.FGMU?.resolved ?? 0 }}</td>
                    <td class="py-4 sm:py-5 px-4 text-center font-semibold text-slate-600 tabular-nums text-base sm:text-lg">{{ executiveAnalytics?.units?.FGMU?.declined ?? 0 }}</td>
                    <td class="py-4 sm:py-5 px-4 text-center font-black text-slate-900 tabular-nums text-base sm:text-lg">{{ executiveAnalytics?.units?.FGMU?.completion_rate ?? 0 }}%</td>
                    <td class="py-4 sm:py-5 px-6 text-center font-black text-slate-800 tabular-nums text-base sm:text-lg">
                      {{ executiveAnalytics?.units?.FGMU?.avg_ratings?.overall_avg ? `${executiveAnalytics.units.FGMU.avg_ratings.overall_avg} ★` : 'N/A' }}
                    </td>
                  </tr>

                  <!-- LEAU -->
                  <tr class="hover:bg-slate-50/70 transition-colors">
                    <td class="py-4 sm:py-5 px-6 font-bold text-slate-900">
                      <div class="text-base sm:text-lg font-bold">Landscaping &amp; Environment (LEAU)</div>
                      <span class="text-xs sm:text-sm text-slate-400 font-normal">Grounds, Campus Ecology, Tree Pruning</span>
                    </td>
                    <td class="py-4 sm:py-5 px-4 text-center font-bold tabular-nums text-slate-900 text-base sm:text-lg">{{ executiveAnalytics?.units?.LEAU?.total ?? 0 }}</td>
                    <td class="py-4 sm:py-5 px-4 text-center font-black text-emerald-700 tabular-nums text-base sm:text-lg">{{ executiveAnalytics?.units?.LEAU?.resolved ?? 0 }}</td>
                    <td class="py-4 sm:py-5 px-4 text-center font-semibold text-slate-600 tabular-nums text-base sm:text-lg">{{ executiveAnalytics?.units?.LEAU?.declined ?? 0 }}</td>
                    <td class="py-4 sm:py-5 px-4 text-center font-black text-slate-900 tabular-nums text-base sm:text-lg">{{ executiveAnalytics?.units?.LEAU?.completion_rate ?? 0 }}%</td>
                    <td class="py-4 sm:py-5 px-6 text-center font-black text-slate-800 tabular-nums text-base sm:text-lg">
                      {{ executiveAnalytics?.units?.LEAU?.avg_ratings?.overall_avg ? `${executiveAnalytics.units.LEAU.avg_ratings.overall_avg} ★` : 'N/A' }}
                    </td>
                  </tr>

                  <!-- SSU -->
                  <tr class="hover:bg-slate-50/70 transition-colors">
                    <td class="py-4 sm:py-5 px-6 font-bold text-slate-900">
                      <div class="text-base sm:text-lg font-bold">Security Services (SSU)</div>
                      <span class="text-xs sm:text-sm text-slate-400 font-normal">Campus Safety, Security Services</span>
                    </td>
                    <td class="py-4 sm:py-5 px-4 text-center font-bold tabular-nums text-slate-900 text-base sm:text-lg">{{ executiveAnalytics?.units?.SSU?.total ?? 0 }}</td>
                    <td class="py-4 sm:py-5 px-4 text-center font-black text-emerald-700 tabular-nums text-base sm:text-lg">{{ executiveAnalytics?.units?.SSU?.resolved ?? 0 }}</td>
                    <td class="py-4 sm:py-5 px-4 text-center font-semibold text-slate-600 tabular-nums text-base sm:text-lg">{{ executiveAnalytics?.units?.SSU?.declined ?? 0 }}</td>
                    <td class="py-4 sm:py-5 px-4 text-center font-black text-slate-900 tabular-nums text-base sm:text-lg">{{ executiveAnalytics?.units?.SSU?.completion_rate ?? 0 }}%</td>
                    <td class="py-4 sm:py-5 px-6 text-center font-black text-slate-800 tabular-nums text-base sm:text-lg">
                      {{ executiveAnalytics?.units?.SSU?.avg_ratings?.overall_avg ? `${executiveAnalytics.units.SSU.avg_ratings.overall_avg} ★` : 'N/A' }}
                    </td>
                  </tr>

                  <!-- Consolidated Total -->
                  <tr class="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-200">
                    <td class="py-5 px-6 text-sm sm:text-base font-black tracking-wider text-slate-900">GSO Overall Total</td>
                    <td class="py-5 px-4 text-center text-slate-900 tabular-nums text-base sm:text-lg font-black">{{ executiveAnalytics?.summary?.total_requests ?? 0 }}</td>
                    <td class="py-5 px-4 text-center text-emerald-800 tabular-nums text-base sm:text-lg font-black">{{ executiveAnalytics?.summary?.total_resolved ?? 0 }}</td>
                    <td class="py-5 px-4 text-center text-slate-700 tabular-nums text-base sm:text-lg font-black">{{ executiveAnalytics?.summary?.total_declined ?? 0 }}</td>
                    <td class="py-5 px-4 text-center text-slate-900 tabular-nums text-base sm:text-lg font-black">{{ executiveAnalytics?.summary?.completion_rate ?? 0 }}%</td>
                    <td class="py-5 px-6 text-center text-slate-900 tabular-nums text-base sm:text-lg font-black">
                      {{ executiveAnalytics?.summary?.overall_ratings?.overall_avg ? `${executiveAnalytics.summary.overall_ratings.overall_avg} ★` : 'N/A' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Operational Insights (Service Distribution & SLA Health) -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 pt-4">
            <!-- Left: Service Workload Share -->
            <div class="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 space-y-5 shadow-xs">
              <h4 class="text-sm sm:text-base font-black uppercase tracking-wider text-slate-800 flex items-center gap-2.5">
                <span class="w-2 h-4 rounded-full bg-slate-900"></span>
                Top Service Categories &amp; Distribution
              </h4>

              <div v-if="executiveAnalytics?.service_breakdown?.length" class="space-y-4">
                <div v-for="item in executiveAnalytics.service_breakdown" :key="item.name" class="space-y-1.5">
                  <div class="flex items-center justify-between text-sm sm:text-base font-bold text-slate-800">
                    <span class="truncate">{{ item.name }}</span>
                    <span class="tabular-nums text-slate-500 font-extrabold text-xs sm:text-sm">{{ item.count }} tickets ({{ item.percent }}%)</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-slate-800 rounded-full" :style="{ width: `${item.percent}%` }"></div>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-slate-400 font-medium py-6 text-center">
                No service categories recorded for this period.
              </p>
            </div>

            <!-- Right: SLA Compliance & Quality Dimensions -->
            <div class="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 space-y-5 shadow-xs">
              <h4 class="text-sm sm:text-base font-black uppercase tracking-wider text-slate-800 flex items-center gap-2.5">
                <span class="w-2 h-4 rounded-full bg-slate-900"></span>
                Service Completion Overview
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center">
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">On-Time</span>
                  <span class="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">{{ executiveAnalytics?.completion_health?.on_time ?? 0 }}</span>
                  <span class="text-xs sm:text-sm font-bold text-emerald-700 block mt-1">{{ executiveAnalytics?.completion_health?.on_time_percent ?? 0 }}%</span>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Beyond-Time</span>
                  <span class="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">{{ executiveAnalytics?.completion_health?.beyond_time ?? 0 }}</span>
                  <span class="text-xs sm:text-sm font-bold text-amber-700 block mt-1">{{ executiveAnalytics?.completion_health?.beyond_time_percent ?? 0 }}%</span>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Incomplete</span>
                  <span class="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">{{ executiveAnalytics?.completion_health?.not_completed ?? 0 }}</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-500 block mt-1">{{ executiveAnalytics?.completion_health?.not_completed_percent ?? 0 }}%</span>
                </div>
              </div>

              <!-- Quality Dimensions Grid -->
              <div class="pt-3 border-t border-slate-100 space-y-3">
                <span class="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider block">Client Rating Dimensions (out of 5.0)</span>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center sm:text-left">
                    <span class="text-xs font-semibold text-slate-400 block mb-0.5">Quality</span>
                    <span class="text-lg sm:text-xl font-extrabold text-slate-900">{{ executiveAnalytics?.summary?.overall_ratings?.avg_quality ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_quality).toFixed(2) : '5.00' }}</span>
                  </div>
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center sm:text-left">
                    <span class="text-xs font-semibold text-slate-400 block mb-0.5">Efficiency</span>
                    <span class="text-lg sm:text-xl font-extrabold text-slate-900">{{ executiveAnalytics?.summary?.overall_ratings?.avg_efficiency ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_efficiency).toFixed(2) : '5.00' }}</span>
                  </div>
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center sm:text-left">
                    <span class="text-xs font-semibold text-slate-400 block mb-0.5">Timeliness</span>
                    <span class="text-lg sm:text-xl font-extrabold text-slate-900">{{ executiveAnalytics?.summary?.overall_ratings?.avg_timeliness ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_timeliness).toFixed(2) : '5.00' }}</span>
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
import { downloadDirectorReportPdf } from '@/utils/directorReportPdfGenerator';
import { toast } from 'vue3-toastify';
import api from '@/api/client';

// Executive Analytics State
const executiveAnalytics = ref(null);
const isGeneratingPdf = ref(false);

// Date / Period Controls
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentQuarter = Math.ceil(currentMonth / 3);

const selectedPeriod = ref('month');
const selectedYear = ref(currentYear);
const selectedMonth = ref(currentMonth);
const selectedQuarter = ref(currentQuarter);
const selectedUnitScope = ref('ALL');

const periodOptions = [
  { key: 'month',   label: 'Monthly Report' },
  { key: 'quarter', label: 'Quarterly Report' },
  { key: 'year',    label: 'Annual Report' },
  { key: 'all',     label: 'All-Time' },
];

const availableYears = computed(() => {
  const years = executiveAnalytics.value?.available_years;
  if (Array.isArray(years) && years.length > 0) {
    return years;
  }
  return [currentYear];
});

const quarterOptions = [
  { value: 1, label: 'Q1 (Jan - Mar)' },
  { value: 2, label: 'Q2 (Apr - Jun)' },
  { value: 3, label: 'Q3 (Jul - Sep)' },
  { value: 4, label: 'Q4 (Oct - Dec)' },
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
  { value: 12, label: 'December' },
];

const changePeriod = (key) => {
  selectedPeriod.value = key;
  fetchExecutiveAnalytics();
};

const fetchExecutiveAnalytics = async () => {
  try {
    const params = {
      period: selectedPeriod.value,
      year: selectedYear.value,
      unit: selectedUnitScope.value,
    };
    if (selectedPeriod.value === 'month') {
      params.month = selectedMonth.value;
    } else if (selectedPeriod.value === 'quarter') {
      params.quarter = selectedQuarter.value;
    }

    const res = await api.get('director/analytics', { params });
    if (res.data?.data) {
      executiveAnalytics.value = res.data.data;
    }
  } catch (error) {
    console.error('Failed to load executive analytics:', error);
  }
};

const handleDownloadReport = async () => {
  if (!executiveAnalytics.value) {
    toast.error('Analytics summary data is still loading.');
    return;
  }
  isGeneratingPdf.value = true;
  try {
    await downloadDirectorReportPdf(executiveAnalytics.value);
    toast.success('Official BSU Report downloaded successfully.');
  } catch (error) {
    console.error('Failed to download report PDF:', error);
    toast.error('Failed to download official report PDF.');
  } finally {
    isGeneratingPdf.value = false;
  }
};

onMounted(() => {
  fetchExecutiveAnalytics();
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
