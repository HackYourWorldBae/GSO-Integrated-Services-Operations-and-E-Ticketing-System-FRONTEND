<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1">Director's Dashboard</h2>
        <p class="text-xs text-emerald-700 font-extrabold tracking-wider uppercase">Executive Unit Oversight &amp; Reports</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 sm:space-y-8 animate-fade-in pb-12 max-w-[1600px] mx-auto">
        <!-- ================================================================= -->
        <!-- EXECUTIVE ANALYTICS SUMMARY & OFFICIAL REPORTS SECTION           -->
        <!-- ================================================================= -->
        <div class="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6 sm:space-y-8">
          
          <!-- Section Header & Export Toolbar -->
          <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-slate-100">
            <div class="space-y-1">
              <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Performance Overview &amp; Reports
              </h3>
            </div>

            <!-- PDF Action Button -->
            <div class="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                @click="handleDownloadReport"
                :disabled="isGeneratingPdf || !executiveAnalytics"
                class="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px] touch-manipulation"
                title="Generate and download official PDF report"
              >
                <svg v-if="isGeneratingPdf" class="animate-spin h-4 w-4 text-emerald-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{{ isGeneratingPdf ? 'Generating PDF...' : 'Generate & Download Report' }}</span>
              </button>
            </div>
          </div>

          <!-- Interactive Period & Timeframe Selector Bar -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <!-- Period Tabs (Segmented Control) -->
            <div class="flex flex-wrap items-center gap-2">
              <div class="inline-flex p-1 rounded-xl bg-slate-200/60 border border-slate-200/80 gap-1 w-full sm:w-auto">
                <button
                  v-for="p in periodOptions"
                  :key="p.key"
                  @click="changePeriod(p.key)"
                  class="flex-1 sm:flex-none px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer min-h-[44px] touch-manipulation flex items-center justify-center"
                  :class="selectedPeriod === p.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                >
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Dynamic Selectors (Year, Month, Quarter) & Refresh -->
            <div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <!-- Year Selector -->
              <div v-if="selectedPeriod !== 'all'" class="relative flex-1 sm:flex-none">
                <select
                  v-model="selectedYear"
                  @change="fetchExecutiveAnalytics"
                  class="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer hover:border-slate-300 transition-colors min-h-[44px]"
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
              <div v-if="selectedPeriod === 'month'" class="relative flex-1 sm:flex-none">
                <select
                  v-model="selectedMonth"
                  @change="fetchExecutiveAnalytics"
                  class="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer hover:border-slate-300 transition-colors min-h-[44px]"
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
              <div v-if="selectedPeriod === 'quarter'" class="relative flex-1 sm:flex-none">
                <select
                  v-model="selectedQuarter"
                  @change="fetchExecutiveAnalytics"
                  class="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer hover:border-slate-300 transition-colors min-h-[44px]"
                >
                  <option v-for="q in quarterOptions" :key="q.value" :value="q.value">
                    {{ q.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Refresh Button -->
              <button
                @click="fetchExecutiveAnalytics"
                class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-600 rounded-xl transition-all cursor-pointer shadow-sm group touch-manipulation shrink-0"
                title="Refresh Report Data"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:rotate-180 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Executive KPI Cards Grid (Consolidated Overview) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <!-- 1. Total Requests Filed -->
            <div class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-slate-900 text-white shadow-md flex flex-col justify-between gap-4 group hover:shadow-xl transition-all duration-200">
              <div class="flex items-center justify-between gap-2">
                <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <span
                  class="px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-slate-700/60 text-xs font-black tracking-wider shrink-0 max-w-[150px] truncate text-center"
                  :title="executiveAnalytics?.filter?.label || 'All-Time'"
                >
                  {{ kpiPeriodLabel }}
                </span>
              </div>
              <div>
                <div class="text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-white">{{ executiveAnalytics?.summary?.total_requests ?? 0 }}</div>
                <div class="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 mt-1">Total Requests Filed</div>
              </div>
            </div>

            <!-- 2. Resolved & Completed -->
            <div class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-200/80 text-slate-900 shadow-md flex flex-col justify-between gap-4 hover:border-emerald-300 hover:shadow-xl transition-all duration-200">
              <div class="flex items-center justify-between gap-2">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black tracking-wider shrink-0">Closed</span>
              </div>
              <div>
                <div class="text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-emerald-700">{{ executiveAnalytics?.summary?.total_resolved ?? 0 }}</div>
                <div class="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 mt-1">Resolved &amp; Completed</div>
              </div>
            </div>

            <!-- 3. Declined / Out of Scope -->
            <div class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-200/80 text-slate-900 shadow-md flex flex-col justify-between gap-4 hover:border-slate-300 hover:shadow-xl transition-all duration-200">
              <div class="flex items-center justify-between gap-2">
                <div class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-black tracking-wider shrink-0">Disapproved</span>
              </div>
              <div>
                <div class="text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-slate-900">{{ executiveAnalytics?.summary?.total_declined ?? 0 }}</div>
                <div class="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 mt-1">Declined / Out of Scope</div>
              </div>
            </div>

            <!-- 4. Client Satisfaction Rating -->
            <div class="p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-white border border-slate-200/80 text-slate-900 shadow-md flex flex-col justify-between gap-4 hover:border-amber-300 hover:shadow-xl transition-all duration-200">
              <div class="flex items-center justify-between gap-2">
                <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                </div>
                <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black tracking-wider shrink-0">{{ executiveAnalytics?.summary?.overall_ratings?.total_feedbacks || 0 }} Reviews</span>
              </div>
              <div>
                <div class="text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-slate-900">{{ executiveAnalytics?.summary?.overall_ratings?.overall_avg ? parseFloat(executiveAnalytics.summary.overall_ratings.overall_avg).toFixed(2) : '5.00' }}<span class="text-lg font-bold text-slate-400 ml-1">/5</span></div>
                <div class="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 mt-1">Client Satisfaction</div>
              </div>
            </div>
          </div>

          <!-- Cross-Unit Performance Matrix Table -->
          <div class="space-y-3 pt-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M10 4v16M14 4v16" /></svg>
                <h4 class="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase tracking-wider">Performance by Sub-Unit</h4>
              </div>
              <span class="text-xs sm:text-sm font-bold text-slate-500">{{ executiveAnalytics?.filter?.label || 'Current Period' }}</span>
            </div>

            <!-- Desktop Performance Table -->
            <div class="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80 shadow-sm">
              <table class="min-w-[650px] w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-slate-700 text-xs sm:text-sm font-black uppercase tracking-wider border-b border-slate-200">
                    <th class="py-3 px-5">Sub-Unit</th>
                    <th class="py-3 px-4 text-center">Requests</th>
                    <th class="py-3 px-4 text-center">Resolved</th>
                    <th class="py-3 px-4 text-center">Declined</th>
                    <th class="py-3 px-5 text-center">Rating ★</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-sm">
                  <!-- FGMU -->
                  <tr class="hover:bg-slate-50/80 transition-colors border-l-2 border-l-transparent hover:border-l-blue-400">
                    <td class="py-3.5 px-5">
                      <div class="flex items-center gap-3">
                        <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 text-blue-700 border border-blue-200/60 uppercase shrink-0">FGMU</span>
                        <div>
                          <div class="font-bold text-slate-900 text-sm sm:text-base">Facilities Management</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 text-center font-black tabular-nums text-slate-900 text-sm sm:text-base">{{ executiveAnalytics?.units?.FGMU?.total ?? 0 }}</td>
                    <td class="py-3.5 px-4 text-center font-black text-emerald-700 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.FGMU?.resolved ?? 0 }}</td>
                    <td class="py-3.5 px-4 text-center font-bold text-slate-700 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.FGMU?.declined ?? 0 }}</td>
                    <td class="py-3.5 px-5 text-center font-black text-slate-900 tabular-nums text-sm sm:text-base">
                      <span v-if="executiveAnalytics?.units?.FGMU?.avg_ratings?.overall_avg">{{ executiveAnalytics.units.FGMU.avg_ratings.overall_avg }}</span>
                      <span v-else class="text-slate-400 text-xs font-medium">—</span>
                    </td>
                  </tr>

                  <!-- LEAU -->
                  <tr class="hover:bg-slate-50/80 transition-colors border-l-2 border-l-transparent hover:border-l-emerald-400">
                    <td class="py-3.5 px-5">
                      <div class="flex items-center gap-3">
                        <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase shrink-0">LEAU</span>
                        <div>
                          <div class="font-bold text-slate-900 text-sm sm:text-base">Landscaping &amp; Environment</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 text-center font-black tabular-nums text-slate-900 text-sm sm:text-base">{{ executiveAnalytics?.units?.LEAU?.total ?? 0 }}</td>
                    <td class="py-3.5 px-4 text-center font-black text-emerald-700 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.LEAU?.resolved ?? 0 }}</td>
                    <td class="py-3.5 px-4 text-center font-bold text-slate-700 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.LEAU?.declined ?? 0 }}</td>
                    <td class="py-3.5 px-5 text-center font-black text-slate-900 tabular-nums text-sm sm:text-base">
                      <span v-if="executiveAnalytics?.units?.LEAU?.avg_ratings?.overall_avg">{{ executiveAnalytics.units.LEAU.avg_ratings.overall_avg }}</span>
                      <span v-else class="text-slate-400 text-xs font-medium">—</span>
                    </td>
                  </tr>

                  <!-- SSU -->
                  <tr class="hover:bg-slate-50/80 transition-colors border-l-2 border-l-transparent hover:border-l-rose-400">
                    <td class="py-3.5 px-5">
                      <div class="flex items-center gap-3">
                        <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-50 text-rose-700 border border-rose-200/60 uppercase shrink-0">SSU</span>
                        <div>
                          <div class="font-bold text-slate-900 text-sm sm:text-base">Security Services</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 text-center font-black tabular-nums text-slate-900 text-sm sm:text-base">{{ executiveAnalytics?.units?.SSU?.total ?? 0 }}</td>
                    <td class="py-3.5 px-4 text-center font-black text-emerald-700 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.SSU?.resolved ?? 0 }}</td>
                    <td class="py-3.5 px-4 text-center font-bold text-slate-700 tabular-nums text-sm sm:text-base">{{ executiveAnalytics?.units?.SSU?.declined ?? 0 }}</td>
                    <td class="py-3.5 px-5 text-center font-black text-slate-900 tabular-nums text-sm sm:text-base">
                      <span v-if="executiveAnalytics?.units?.SSU?.avg_ratings?.overall_avg">{{ executiveAnalytics.units.SSU.avg_ratings.overall_avg }}</span>
                      <span v-else class="text-slate-400 text-xs font-medium">—</span>
                    </td>
                  </tr>

                  <!-- Consolidated Total Row -->
                  <tr class="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-200">
                    <td class="py-3.5 px-5 text-xs sm:text-sm font-black tracking-wider text-slate-700 uppercase">GSO Overall</td>
                    <td class="py-3.5 px-4 text-center text-slate-900 tabular-nums text-sm sm:text-base font-black">{{ executiveAnalytics?.summary?.total_requests ?? 0 }}</td>
                    <td class="py-3.5 px-4 text-center text-emerald-700 tabular-nums text-sm sm:text-base font-black">{{ executiveAnalytics?.summary?.total_resolved ?? 0 }}</td>
                    <td class="py-3.5 px-4 text-center text-slate-700 tabular-nums text-sm sm:text-base font-black">{{ executiveAnalytics?.summary?.total_declined ?? 0 }}</td>
                    <td class="py-3.5 px-5 text-center text-slate-900 tabular-nums text-sm sm:text-base font-black">
                      <span v-if="executiveAnalytics?.summary?.overall_ratings?.overall_avg">{{ executiveAnalytics.summary.overall_ratings.overall_avg }}</span>
                      <span v-else class="text-slate-400 text-xs font-medium">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Sub-Unit Cards View -->
            <div class="md:hidden space-y-3">
              <!-- FGMU Mobile Card -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 text-blue-700 border border-blue-200/60 uppercase shrink-0">FGMU</span>
                    <span class="font-bold text-slate-900 text-sm sm:text-base">Facilities Management</span>
                  </div>
                  <span class="text-xs sm:text-sm font-black text-amber-700 flex items-center gap-1 shrink-0">
                    ★ {{ executiveAnalytics?.units?.FGMU?.avg_ratings?.overall_avg || '—' }}
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-center">
                  <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
                    <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Requests</span>
                    <span class="text-base font-black text-slate-900 tabular-nums">{{ executiveAnalytics?.units?.FGMU?.total ?? 0 }}</span>
                  </div>
                  <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
                    <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Resolved</span>
                    <span class="text-base font-black text-emerald-700 tabular-nums">{{ executiveAnalytics?.units?.FGMU?.resolved ?? 0 }}</span>
                  </div>
                  <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
                    <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Declined</span>
                    <span class="text-base font-black text-slate-700 tabular-nums">{{ executiveAnalytics?.units?.FGMU?.declined ?? 0 }}</span>
                  </div>
                </div>
              </div>

              <!-- LEAU Mobile Card -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase shrink-0">LEAU</span>
                    <span class="font-bold text-slate-900 text-sm sm:text-base">Landscaping &amp; Environment</span>
                  </div>
                  <span class="text-xs sm:text-sm font-black text-amber-700 flex items-center gap-1 shrink-0">
                    ★ {{ executiveAnalytics?.units?.LEAU?.avg_ratings?.overall_avg || '—' }}
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-center">
                  <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
                    <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Requests</span>
                    <span class="text-base font-black text-slate-900 tabular-nums">{{ executiveAnalytics?.units?.LEAU?.total ?? 0 }}</span>
                  </div>
                  <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
                    <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Resolved</span>
                    <span class="text-base font-black text-emerald-700 tabular-nums">{{ executiveAnalytics?.units?.LEAU?.resolved ?? 0 }}</span>
                  </div>
                  <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
                    <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Declined</span>
                    <span class="text-base font-black text-slate-700 tabular-nums">{{ executiveAnalytics?.units?.LEAU?.declined ?? 0 }}</span>
                  </div>
                </div>
              </div>

              <!-- SSU Mobile Card -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-50 text-rose-700 border border-rose-200/60 uppercase shrink-0">SSU</span>
                    <span class="font-bold text-slate-900 text-sm sm:text-base">Security Services</span>
                  </div>
                  <span class="text-xs sm:text-sm font-black text-amber-700 flex items-center gap-1 shrink-0">
                    ★ {{ executiveAnalytics?.units?.SSU?.avg_ratings?.overall_avg || '—' }}
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-center">
                  <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
                    <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Requests</span>
                    <span class="text-base font-black text-slate-900 tabular-nums">{{ executiveAnalytics?.units?.SSU?.total ?? 0 }}</span>
                  </div>
                  <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
                    <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Resolved</span>
                    <span class="text-base font-black text-emerald-700 tabular-nums">{{ executiveAnalytics?.units?.SSU?.resolved ?? 0 }}</span>
                  </div>
                  <div class="p-2.5 rounded-xl bg-white border border-slate-200/60">
                    <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Declined</span>
                    <span class="text-base font-black text-slate-700 tabular-nums">{{ executiveAnalytics?.units?.SSU?.declined ?? 0 }}</span>
                  </div>
                </div>
              </div>

              <!-- GSO Overall Summary Card -->
              <div class="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-sm">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-400">GSO Overall Total</span>
                  <span class="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-1 shrink-0">
                    ★ {{ executiveAnalytics?.summary?.overall_ratings?.overall_avg || '5.00' }}
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                  <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Requests</span>
                    <span class="text-base font-black text-white tabular-nums">{{ executiveAnalytics?.summary?.total_requests ?? 0 }}</span>
                  </div>
                  <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Resolved</span>
                    <span class="text-base font-black text-emerald-400 tabular-nums">{{ executiveAnalytics?.summary?.total_resolved ?? 0 }}</span>
                  </div>
                  <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Declined</span>
                    <span class="text-base font-black text-slate-300 tabular-nums">{{ executiveAnalytics?.summary?.total_declined ?? 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Operational Insights (Service Distribution & SLA Health) -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
            <!-- Left: Service Workload Share by Sub-Unit -->
            <div class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-sm flex flex-col">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                  <h4 class="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">Top Service Categories</h4>
                </div>

                <!-- Sub-unit Filter Tabs -->
                <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/70 gap-1 self-start sm:self-auto flex-wrap">
                  <button
                    v-for="tab in serviceTabs"
                    :key="tab.key"
                    type="button"
                    @click="activeServiceTab = tab.key"
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[30px] touch-manipulation flex items-center gap-1.5"
                    :class="activeServiceTab === tab.key ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                  >
                    <span>{{ tab.label }}</span>
                    <span
                      v-if="tab.key !== 'ALL' && executiveAnalytics?.service_breakdown_by_unit?.[tab.key]?.total"
                      class="px-1.5 py-0.2 rounded-full text-[10px] font-black"
                      :class="activeServiceTab === tab.key ? 'bg-slate-100 text-slate-800' : 'bg-slate-200 text-slate-600'"
                    >
                      {{ executiveAnalytics.service_breakdown_by_unit[tab.key].total }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Per-Unit Service Groups -->
              <div v-if="displayedServiceGroups.length" class="space-y-4">
                <div
                  v-for="group in displayedServiceGroups"
                  :key="group.code"
                  class="p-4 rounded-xl border space-y-3"
                  :class="group.code === 'FGMU' ? 'bg-blue-50/40 border-blue-100' : group.code === 'LEAU' ? 'bg-emerald-50/40 border-emerald-100' : 'bg-amber-50/40 border-amber-100'"
                >
                  <!-- Unit Header Bar -->
                  <div class="flex items-center justify-between pb-2 border-b" :class="group.code === 'FGMU' ? 'border-blue-200/60' : group.code === 'LEAU' ? 'border-emerald-200/60' : 'border-amber-200/60'">
                    <div class="flex items-center gap-2">
                      <span
                        class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                        :class="group.code === 'FGMU' ? 'bg-blue-600 text-white' : group.code === 'LEAU' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'"
                      >
                        {{ group.code }}
                      </span>
                      <span class="text-xs font-black text-slate-800">{{ group.name }}</span>
                    </div>
                    <span class="text-xs font-bold text-slate-600 tabular-nums">
                      {{ group.total }} request{{ group.total !== 1 ? 's' : '' }}
                    </span>
                  </div>

                  <!-- Services List -->
                  <div class="space-y-2.5">
                    <div v-for="item in group.services" :key="item.name" class="space-y-1">
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-xs sm:text-sm font-semibold text-slate-800 truncate">{{ item.name }}</span>
                        <span class="tabular-nums text-slate-700 font-bold text-xs sm:text-sm shrink-0">
                          {{ item.count }} <span class="text-slate-500 font-normal">({{ item.percent }}%)</span>
                        </span>
                      </div>
                      <div class="w-full h-1.5 bg-white/80 rounded-full overflow-hidden border border-slate-200/60">
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          :class="group.code === 'FGMU' ? 'bg-blue-500' : group.code === 'LEAU' ? 'bg-emerald-500' : 'bg-amber-500'"
                          :style="{ width: `${item.percent}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Fallback to flat list if by_unit is not present -->
              <div v-else-if="executiveAnalytics?.service_breakdown?.length" class="space-y-3">
                <div v-for="(item, idx) in executiveAnalytics.service_breakdown" :key="item.name" class="space-y-1.5">
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5 truncate">
                      <span v-if="item.unit_code" class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        {{ item.unit_code }}
                      </span>
                      <span class="text-xs sm:text-sm font-bold text-slate-800 truncate">{{ item.name }}</span>
                    </div>
                    <span class="tabular-nums text-slate-600 font-black text-xs sm:text-sm ml-2 shrink-0">{{ item.count }} <span class="text-slate-500 font-semibold">({{ item.percent }}%)</span></span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      :class="idx % 3 === 0 ? 'bg-blue-500' : idx % 3 === 1 ? 'bg-emerald-500' : 'bg-rose-400'"
                      :style="{ width: `${item.percent}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              <p v-else class="text-xs sm:text-sm text-slate-500 font-medium py-6 text-center">No categories recorded for this period.</p>
            </div>

            <!-- Right: SLA Compliance & Quality Dimensions -->
            <div class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-sm">
              <div class="flex items-center gap-2">
                <h4 class="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">Service Completion &amp; Quality</h4>
              </div>

              <!-- 4 Health Tiles -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div class="p-3.5 bg-sky-50/70 rounded-xl border border-sky-200/60 text-center">
                  <span class="text-xl sm:text-2xl font-black text-sky-900 tabular-nums block">{{ executiveAnalytics?.completion_health?.early_finished ?? 0 }}</span>
                  <span class="text-xs font-black text-sky-700 block">{{ executiveAnalytics?.completion_health?.early_finished_percent ?? 0 }}%</span>
                  <span class="text-xs font-black text-sky-800 uppercase tracking-wider block mt-0.5">Early</span>
                </div>
                <div class="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/60 text-center">
                  <span class="text-xl sm:text-2xl font-black text-emerald-900 tabular-nums block">{{ executiveAnalytics?.completion_health?.on_time ?? 0 }}</span>
                  <span class="text-xs font-black text-emerald-700 block">{{ executiveAnalytics?.completion_health?.on_time_percent ?? 0 }}%</span>
                  <span class="text-xs font-black text-emerald-800 uppercase tracking-wider block mt-0.5">On-Time</span>
                </div>
                <div class="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/60 text-center">
                  <span class="text-xl sm:text-2xl font-black text-amber-900 tabular-nums block">{{ executiveAnalytics?.completion_health?.beyond_time ?? 0 }}</span>
                  <span class="text-xs font-black text-amber-700 block">{{ executiveAnalytics?.completion_health?.beyond_time_percent ?? 0 }}%</span>
                  <span class="text-xs font-black text-amber-800 uppercase tracking-wider block mt-0.5">Overdue</span>
                </div>
                <div class="p-3.5 bg-slate-100/70 rounded-xl border border-slate-200/60 text-center">
                  <span class="text-xl sm:text-2xl font-black text-slate-900 tabular-nums block">{{ executiveAnalytics?.completion_health?.not_completed ?? 0 }}</span>
                  <span class="text-xs font-black text-slate-600 block">{{ executiveAnalytics?.completion_health?.not_completed_percent ?? 0 }}%</span>
                  <span class="text-xs font-black text-slate-700 uppercase tracking-wider block mt-0.5">Incomplete</span>
                </div>
              </div>

              <!-- Rating Breakdown Dimensions -->
              <div class="pt-3 border-t border-slate-100 space-y-2.5">
                <span class="text-xs font-black text-slate-500 uppercase tracking-wider block">Client Rating Breakdown</span>
                <div class="grid grid-cols-3 gap-2">
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs font-black text-slate-600 uppercase">Quality</span>
                    </div>
                    <span class="text-base sm:text-lg font-black text-slate-900 tabular-nums">{{ executiveAnalytics?.summary?.overall_ratings?.avg_quality ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_quality).toFixed(2) : '5.00' }}</span>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs font-black text-slate-600 uppercase">Efficiency</span>
                    </div>
                    <span class="text-base sm:text-lg font-black text-slate-900 tabular-nums">{{ executiveAnalytics?.summary?.overall_ratings?.avg_efficiency ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_efficiency).toFixed(2) : '5.00' }}</span>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs font-black text-slate-600 uppercase">Timeliness</span>
                    </div>
                    <span class="text-base sm:text-lg font-black text-slate-900 tabular-nums">{{ executiveAnalytics?.summary?.overall_ratings?.avg_timeliness ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_timeliness).toFixed(2) : '5.00' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- EXECUTIVE PER-UNIT ARCHIVES REPOSITORY SECTION -->
        <div class="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-200/80 p-5 sm:p-8 space-y-6 shadow-sm">
          <!-- Section Title & Meta -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-base sm:text-xl font-black text-slate-900 tracking-tight">Per-Unit Historical Archives</h3>
                  <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider border border-slate-200">
                    {{ totalCombinedArchived }} Total Records
                  </span>
                </div>
                <p class="text-xs text-slate-500 font-medium mt-0.5">
                  Concluded tickets, verified incident dossiers, and fulfilled borrowing histories organized by operating unit
                </p>
              </div>
            </div>

            <!-- Global Action / Refresh -->
            <button
              type="button"
              @click="fetchRecentArchives"
              :disabled="isArchivesLoading"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-50 self-start sm:self-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300" :class="{ 'animate-spin': isArchivesLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Archives</span>
            </button>
          </div>

          <!-- 3 Sub-Unit Archive Gateway Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <!-- 1. FGMU Facilities Archives Card -->
            <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50/50 to-white border border-blue-100/80 shadow-xs flex flex-col justify-between gap-5 group hover:shadow-md hover:border-blue-200 transition-all duration-200">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-600 text-white uppercase tracking-wider">
                    FGMU Unit
                  </span>
                  <span class="text-xs font-bold text-slate-500">Facilities & Maintenance</span>
                </div>
                <div>
                  <h4 class="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">Facilities Management Archives</h4>
                  <p class="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                    Infrastructure repairs, carpentry, electrical wiring, plumbing, air conditioning, and preventative maintenance logs.
                  </p>
                </div>
                <div class="pt-3 border-t border-blue-100/60 flex items-baseline justify-between">
                  <span class="text-xs font-black text-slate-500 uppercase tracking-wider">Resolved Tickets</span>
                  <span class="text-2xl font-black text-blue-700 tabular-nums">
                    {{ executiveAnalytics?.units?.FGMU?.resolved ?? 0 }}
                  </span>
                </div>
              </div>
              <router-link
                to="/admin/fgmu/archives"
                class="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer min-h-[42px] touch-manipulation group-hover:translate-y-[-1px]"
              >
                <span>Access FGMU Archives</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>

            <!-- 2. LEAU Environment Archives Card -->
            <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-100/80 shadow-xs flex flex-col justify-between gap-5 group hover:shadow-md hover:border-emerald-200 transition-all duration-200">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-600 text-white uppercase tracking-wider">
                    LEAU Unit
                  </span>
                  <span class="text-xs font-bold text-slate-500">Landscaping & Ecology</span>
                </div>
                <div>
                  <h4 class="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">Landscaping & Borrowing Archives</h4>
                  <p class="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                    Campus groundskeeping, environmental care, tree maintenance, waste disposal, and fulfilled equipment borrowing slips.
                  </p>
                </div>
                <div class="pt-3 border-t border-emerald-100/60 flex items-baseline justify-between">
                  <span class="text-xs font-black text-slate-500 uppercase tracking-wider">Resolved Tickets</span>
                  <span class="text-2xl font-black text-emerald-700 tabular-nums">
                    {{ executiveAnalytics?.units?.LEAU?.resolved ?? 0 }}
                  </span>
                </div>
              </div>
              <router-link
                to="/admin/leau/archives"
                class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer min-h-[42px] touch-manipulation group-hover:translate-y-[-1px]"
              >
                <span>Access LEAU Archives</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>

            <!-- 3. SSU Security Archives Card -->
            <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50/50 to-white border border-rose-100/80 shadow-xs flex flex-col justify-between gap-5 group hover:shadow-md hover:border-rose-200 transition-all duration-200">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-600 text-white uppercase tracking-wider">
                    SSU Unit
                  </span>
                  <span class="text-xs font-bold text-slate-500">Security & Safety</span>
                </div>
                <div>
                  <h4 class="text-base font-black text-slate-900 group-hover:text-rose-700 transition-colors">Special Security Archives</h4>
                  <p class="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                    Concluded incident investigations, security blotters, safety interventions, and joint multi-unit dispatches.
                  </p>
                </div>
                <div class="pt-3 border-t border-rose-100/60 flex items-baseline justify-between">
                  <span class="text-xs font-black text-slate-500 uppercase tracking-wider">Resolved Incidents</span>
                  <span class="text-2xl font-black text-rose-700 tabular-nums">
                    {{ executiveAnalytics?.units?.SSU?.resolved ?? 0 }}
                  </span>
                </div>
              </div>
              <router-link
                to="/admin/ssu/archives"
                class="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer min-h-[42px] touch-manipulation group-hover:translate-y-[-1px]"
              >
                <span>Access SSU Archives</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>
          </div>

          <!-- Recent Concluded Records Explorer -->
          <div class="pt-4 border-t border-slate-100 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h4 class="text-sm font-black text-slate-900 uppercase tracking-wider">Recent Concluded Records Explorer</h4>
              </div>

              <!-- Filter Tabs and Search Bar -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <!-- Unit Tabs -->
                <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/70 gap-1">
                  <button
                    v-for="tab in archiveTabs"
                    :key="tab.key"
                    type="button"
                    @click="activeArchiveTab = tab.key"
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer min-h-[30px] touch-manipulation"
                    :class="activeArchiveTab === tab.key ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                  >
                    {{ tab.label }}
                  </button>
                </div>

                <!-- Search Input -->
                <div class="relative min-w-[200px]">
                  <input
                    v-model="searchArchiveQuery"
                    type="text"
                    placeholder="Search archives..."
                    class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all min-h-[34px]"
                  />
                  <div class="pointer-events-none absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Records Table -->
            <div class="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-xs">
              <table class="min-w-[700px] w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                    <th class="py-3 px-4">Ticket Ref</th>
                    <th class="py-3 px-3 text-center">Unit</th>
                    <th class="py-3 px-4">Service Category / Title</th>
                    <th class="py-3 px-4">Requestor</th>
                    <th class="py-3 px-4 text-center">Date Concluded</th>
                    <th class="py-3 px-3 text-center">Status</th>
                    <th class="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs">
                  <tr v-if="isArchivesLoading">
                    <td colspan="7" class="py-8 text-center text-slate-400 font-bold">
                      <div class="flex items-center justify-center gap-2">
                        <svg class="animate-spin h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading archived records...</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-else-if="filteredRecentArchives.length === 0">
                    <td colspan="7" class="py-8 text-center text-slate-400 font-medium">
                      No archived records match the current filter or search criteria.
                    </td>
                  </tr>
                  <tr
                    v-for="record in filteredRecentArchives"
                    :key="record.id"
                    class="hover:bg-slate-50/80 transition-colors"
                  >
                    <td class="py-3 px-4 font-black text-slate-900 tabular-nums">
                      #{{ record.id }}
                    </td>
                    <td class="py-3 px-3 text-center">
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                        :class="record.unit_code === 'FGMU' ? 'bg-blue-100 text-blue-800' : (record.unit_code === 'LEAU' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800')"
                      >
                        {{ record.unit_code }}
                      </span>
                    </td>
                    <td class="py-3 px-4 font-bold text-slate-800">
                      <div class="truncate max-w-[220px]" :title="record.title || record.service_type">
                        {{ record.title || record.service_type || 'General Service' }}
                      </div>
                      <div class="text-[11px] font-normal text-slate-500 truncate max-w-[220px]">
                        {{ record.service_type }}
                      </div>
                    </td>
                    <td class="py-3 px-4 text-slate-700 font-medium">
                      {{ record.requester || record.requestedBy || (record.user ? `${record.user.first_name} ${record.user.last_name}` : '') || 'Campus Member' }}
                    </td>
                    <td class="py-3 px-4 text-center tabular-nums text-slate-600 font-medium">
                      {{ new Date(record.completed_at || record.updated_at || record.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
                    </td>
                    <td class="py-3 px-3 text-center">
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                        :class="['completed', 'resolved'].includes(record.status) ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'"
                      >
                        {{ record.status_label || record.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <router-link
                        :to="{ path: `/admin/${record.unit_code.toLowerCase()}/archives`, query: { ticketId: record.id } }"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors"
                      >
                        <span>Open Record</span>
                        <span>›</span>
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import { toast } from 'vue3-toastify';
import api from '@/api/client';

// Executive Analytics State
const executiveAnalytics = ref(null);
const isGeneratingPdf = ref(false);
let isAlive = true;
let analyticsRequestSeq = 0;
let analyticsAbort = null;



// Date / Period Controls
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentQuarter = Math.ceil(currentMonth / 3);

const selectedPeriod = ref('month');
const selectedYear = ref(currentYear);
const selectedMonth = ref(currentMonth);
const selectedQuarter = ref(currentQuarter);
const selectedUnitScope = ref('ALL');

const activeServiceTab = ref('ALL');

const serviceTabs = [
  { key: 'ALL',  label: 'All Units' },
  { key: 'FGMU', label: 'FGMU' },
  { key: 'LEAU', label: 'LEAU' },
  { key: 'SSU',  label: 'SSU' },
];

const displayedServiceGroups = computed(() => {
  const byUnit = executiveAnalytics.value?.service_breakdown_by_unit;
  if (!byUnit) {
    return [];
  }

  if (activeServiceTab.value === 'ALL') {
    return [
      { code: 'FGMU', name: byUnit.FGMU?.unit_name || 'Facilities & Grounds Management Unit', total: byUnit.FGMU?.total || 0, services: byUnit.FGMU?.services || [], color: 'blue' },
      { code: 'LEAU', name: byUnit.LEAU?.unit_name || 'Landscaping & Environmental Aesthetics Unit', total: byUnit.LEAU?.total || 0, services: byUnit.LEAU?.services || [], color: 'emerald' },
      { code: 'SSU',  name: byUnit.SSU?.unit_name || 'Safety & Security Services Unit', total: byUnit.SSU?.total || 0, services: byUnit.SSU?.services || [], color: 'amber' },
    ].filter(g => g.services.length > 0);
  }

  const selected = byUnit[activeServiceTab.value];
  if (!selected) return [];
  const colorMap = { FGMU: 'blue', LEAU: 'emerald', SSU: 'amber' };
  return [
    {
      code: activeServiceTab.value,
      name: selected.unit_name,
      total: selected.total || 0,
      services: selected.services || [],
      color: colorMap[activeServiceTab.value] || 'emerald',
    }
  ];
});

const periodOptions = [
  { key: 'month',   label: 'Monthly' },
  { key: 'quarter', label: 'Quarterly' },
  { key: 'year',    label: 'Annual' },
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

const kpiPeriodLabel = computed(() => {
  const rawLabel = executiveAnalytics.value?.filter?.label;
  if (!rawLabel || selectedPeriod.value === 'all' || /all[- ]?time/i.test(rawLabel)) {
    return 'All-Time';
  }
  if (selectedPeriod.value === 'quarter' && selectedQuarter.value) {
    return `Q${selectedQuarter.value} ${selectedYear.value}`;
  }
  if (selectedPeriod.value === 'year') {
    return `Year ${selectedYear.value}`;
  }
  if (selectedPeriod.value === 'month') {
    const m = monthOptions.find((opt) => opt.value === Number(selectedMonth.value));
    return m ? `${m.label.slice(0, 3)} ${selectedYear.value}` : rawLabel;
  }
  return rawLabel;
});

const changePeriod = (key) => {
  selectedPeriod.value = key;
  fetchExecutiveAnalytics();
};

const fetchExecutiveAnalytics = async () => {
  const requestId = ++analyticsRequestSeq;
  try {
    analyticsAbort?.abort('Superseded by newer executive analytics fetch');
  } catch { /* noop */ }
  analyticsAbort = new AbortController();
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

    const res = await api.get('director/analytics', { params, signal: analyticsAbort.signal });
    if (requestId !== analyticsRequestSeq || !isAlive) return;
    if (res.data?.data) {
      executiveAnalytics.value = res.data.data;
    }
  } catch (error) {
    if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError' || error?.name === 'AbortError') return;
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
    const { downloadDirectorReportPdf } = await import('@/utils/directorReportPdfGenerator');
    await downloadDirectorReportPdf(executiveAnalytics.value);
    toast.success('Official BSU Report downloaded successfully.');
  } catch (error) {
    console.error('Failed to download report PDF:', error);
    toast.error('Failed to download official report PDF.');
  } finally {
    isGeneratingPdf.value = false;
  }
};

// -----------------------------------------------------------------------------
// Per-Unit Archives Explorer State & Logic
// -----------------------------------------------------------------------------
const recentArchives = ref([]);
const isArchivesLoading = ref(false);
const activeArchiveTab = ref('ALL');
const searchArchiveQuery = ref('');
const archiveTabs = [
  { key: 'ALL',  label: 'All Units' },
  { key: 'FGMU', label: 'FGMU' },
  { key: 'LEAU', label: 'LEAU' },
  { key: 'SSU',  label: 'SSU' },
];

const totalCombinedArchived = computed(() => {
  const fgmu = executiveAnalytics.value?.units?.FGMU?.resolved ?? 0;
  const leau = executiveAnalytics.value?.units?.LEAU?.resolved ?? 0;
  const ssu = executiveAnalytics.value?.units?.SSU?.resolved ?? 0;
  return fgmu + leau + ssu;
});

const fetchRecentArchives = async () => {
  isArchivesLoading.value = true;
  try {
    const [fgmuRes, leauRes, ssuRes] = await Promise.allSettled([
      api.get('tickets/archives/FGMU'),
      api.get('tickets/archives/LEAU'),
      api.get('tickets/archives/SSU'),
    ]);

    const combined = [];

    if (fgmuRes.status === 'fulfilled' && fgmuRes.value?.data?.data?.tickets) {
      fgmuRes.value.data.data.tickets.forEach(t => {
        combined.push({ ...t, unit_code: 'FGMU' });
      });
    }

    if (leauRes.status === 'fulfilled' && leauRes.value?.data?.data?.tickets) {
      leauRes.value.data.data.tickets.forEach(t => {
        combined.push({ ...t, unit_code: 'LEAU' });
      });
    }

    if (ssuRes.status === 'fulfilled' && ssuRes.value?.data?.data?.tickets) {
      ssuRes.value.data.data.tickets.forEach(t => {
        combined.push({ ...t, unit_code: 'SSU' });
      });
    }

    // Sort descending by completion date or updated date
    combined.sort((a, b) => {
      const dateA = new Date(a.completed_at || a.updated_at || a.submitted_at || 0).getTime();
      const dateB = new Date(b.completed_at || b.updated_at || b.submitted_at || 0).getTime();
      return dateB - dateA;
    });

    recentArchives.value = combined.slice(0, 30);
  } catch (err) {
    console.error('Failed to load recent archives:', err);
  } finally {
    isArchivesLoading.value = false;
  }
};

const filteredRecentArchives = computed(() => {
  let list = recentArchives.value;
  if (activeArchiveTab.value !== 'ALL') {
    list = list.filter(t => t.unit_code === activeArchiveTab.value);
  }
  const q = searchArchiveQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter(t => {
      const id = String(t.id || '').toLowerCase();
      const service = String(t.service_type || '').toLowerCase();
      const title = String(t.title || '').toLowerCase();
      const requester = String(t.requester || t.requestedBy || (t.user ? `${t.user.first_name} ${t.user.last_name}` : '') || '').toLowerCase();
      return id.includes(q) || service.includes(q) || title.includes(q) || requester.includes(q);
    });
  }
  return list;
});

onMounted(() => {
  isAlive = true;
  fetchExecutiveAnalytics();
  fetchRecentArchives();
});

onUnmounted(() => {
  isAlive = false;
  analyticsRequestSeq++;
  try {
    analyticsAbort?.abort('Director dashboard unmounted');
  } catch { /* noop */ }
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
