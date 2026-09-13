<template>
  <MainLayout>
    <template #sidebar-links>
      <DirectorSidebar />
    </template>

    <template #header-title>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight leading-none mb-1">Director Dashboard</h2>
          <p class="text-[10px] text-emerald-700 font-bold tracking-[0.15em] uppercase">Executive Unit Oversight &amp; Reports</p>
        </div>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 sm:space-y-8 animate-fade-in pb-12 max-w-[1600px] mx-auto">
        <!-- ================================================================= -->
        <!-- EXECUTIVE ANALYTICS SUMMARY & OFFICIAL REPORTS SECTION           -->
        <!-- ================================================================= -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 sm:space-y-8">
          
          <!-- Section Header & Export Toolbar -->
          <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  Executive Overview
                </span>
                <span class="text-xs font-medium text-slate-400">BSU General Services Office</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Performance Overview &amp; Reports
              </h3>
              <p class="text-sm text-slate-500 font-normal">Across all GSO operational units for the selected period.</p>
            </div>

            <!-- PDF Action Button -->
            <div class="flex items-center gap-3 shrink-0">
              <button
                @click="handleDownloadReport"
                :disabled="isGeneratingPdf || !executiveAnalytics"
                class="px-5 py-3 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
              <div class="inline-flex p-1 rounded-xl bg-slate-200/60 border border-slate-200/80 gap-1">
                <button
                  v-for="p in periodOptions"
                  :key="p.key"
                  @click="changePeriod(p.key)"
                  class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  :class="selectedPeriod === p.key ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Dynamic Selectors (Year, Month, Quarter) & Refresh -->
            <div class="flex flex-wrap items-center gap-2.5">
              <!-- Year Selector -->
              <div v-if="selectedPeriod !== 'all'" class="relative">
                <select
                  v-model="selectedYear"
                  @change="fetchExecutiveAnalytics"
                  class="appearance-none pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
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
                  class="appearance-none pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
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
                  class="appearance-none pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
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
                class="p-2 bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-600 rounded-xl transition-all cursor-pointer shadow-2xs group"
                title="Refresh Report Data"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:rotate-180 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Executive KPI Cards Grid (Consolidated Overview) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- 1. Total Requests Filed -->
            <div class="p-5 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col gap-3 group hover:shadow-md transition-all duration-200">
              <div class="flex items-center justify-between gap-2">
                <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700/60 text-[10px] font-bold tracking-wider">
                  {{ executiveAnalytics?.filter?.label || 'All-Time' }}
                </span>
              </div>
              <div>
                <div class="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white">{{ executiveAnalytics?.summary?.total_requests ?? 0 }}</div>
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Total Requests Filed</div>
              </div>
            </div>

            <!-- 2. Resolved & Completed -->
            <div class="p-5 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-2xs flex flex-col gap-3 hover:border-emerald-300 hover:shadow-md transition-all duration-200">
              <div class="flex items-center justify-between gap-2">
                <div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold tracking-wider">Closed</span>
              </div>
              <div>
                <div class="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-emerald-700">{{ executiveAnalytics?.summary?.total_resolved ?? 0 }}</div>
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Resolved &amp; Completed</div>
              </div>
            </div>

            <!-- 3. Declined / Out of Scope -->
            <div class="p-5 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-2xs flex flex-col gap-3 hover:border-slate-300 hover:shadow-md transition-all duration-200">
              <div class="flex items-center justify-between gap-2">
                <div class="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 text-[10px] font-bold tracking-wider">Disapproved</span>
              </div>
              <div>
                <div class="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-slate-800">{{ executiveAnalytics?.summary?.total_declined ?? 0 }}</div>
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Declined / Out of Scope</div>
              </div>
            </div>

            <!-- 4. Client Satisfaction Rating -->
            <div class="p-5 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-2xs flex flex-col gap-3 hover:border-amber-300 hover:shadow-md transition-all duration-200">
              <div class="flex items-center justify-between gap-2">
                <div class="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-bold tracking-wider">{{ executiveAnalytics?.summary?.overall_ratings?.total_feedbacks || 0 }} Reviews</span>
              </div>
              <div>
                <div class="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-slate-900">{{ executiveAnalytics?.summary?.overall_ratings?.overall_avg ? parseFloat(executiveAnalytics.summary.overall_ratings.overall_avg).toFixed(2) : '5.00' }}<span class="text-base font-bold text-slate-400 ml-1">/5</span></div>
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Client Satisfaction</div>
              </div>
            </div>
          </div>

          <!-- Cross-Unit Performance Matrix Table -->
          <div class="space-y-3 pt-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M10 4v16M14 4v16" /></svg>
                <h4 class="text-sm font-extrabold text-slate-900 tracking-tight uppercase tracking-wider">Performance by Sub-Unit</h4>
              </div>
              <span class="text-xs font-semibold text-slate-400">{{ executiveAnalytics?.filter?.label || 'Current Period' }}</span>
            </div>

            <div class="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-2xs">
              <table class="min-w-[650px] w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
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
                    <td class="py-3 px-5">
                      <div class="flex items-center gap-2.5">
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60 uppercase shrink-0">FGMU</span>
                        <div>
                          <div class="font-bold text-slate-900 text-sm">Facilities Management</div>
                          <span class="text-xs text-slate-400 font-normal">Electrical, Plumbing, Carpentry, HVAC</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-center font-bold tabular-nums text-slate-900 text-sm">{{ executiveAnalytics?.units?.FGMU?.total ?? 0 }}</td>
                    <td class="py-3 px-4 text-center font-bold text-emerald-700 tabular-nums text-sm">{{ executiveAnalytics?.units?.FGMU?.resolved ?? 0 }}</td>
                    <td class="py-3 px-4 text-center font-semibold text-slate-600 tabular-nums text-sm">{{ executiveAnalytics?.units?.FGMU?.declined ?? 0 }}</td>
                    <td class="py-3 px-5 text-center font-bold text-slate-900 tabular-nums text-sm">
                      <span v-if="executiveAnalytics?.units?.FGMU?.avg_ratings?.overall_avg">{{ executiveAnalytics.units.FGMU.avg_ratings.overall_avg }}</span>
                      <span v-else class="text-slate-400 text-xs font-medium">—</span>
                    </td>
                  </tr>

                  <!-- LEAU -->
                  <tr class="hover:bg-slate-50/80 transition-colors border-l-2 border-l-transparent hover:border-l-emerald-400">
                    <td class="py-3 px-5">
                      <div class="flex items-center gap-2.5">
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase shrink-0">LEAU</span>
                        <div>
                          <div class="font-bold text-slate-900 text-sm">Landscaping &amp; Environment</div>
                          <span class="text-xs text-slate-400 font-normal">Grounds, Campus Ecology, Tree Pruning</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-center font-bold tabular-nums text-slate-900 text-sm">{{ executiveAnalytics?.units?.LEAU?.total ?? 0 }}</td>
                    <td class="py-3 px-4 text-center font-bold text-emerald-700 tabular-nums text-sm">{{ executiveAnalytics?.units?.LEAU?.resolved ?? 0 }}</td>
                    <td class="py-3 px-4 text-center font-semibold text-slate-600 tabular-nums text-sm">{{ executiveAnalytics?.units?.LEAU?.declined ?? 0 }}</td>
                    <td class="py-3 px-5 text-center font-bold text-slate-900 tabular-nums text-sm">
                      <span v-if="executiveAnalytics?.units?.LEAU?.avg_ratings?.overall_avg">{{ executiveAnalytics.units.LEAU.avg_ratings.overall_avg }}</span>
                      <span v-else class="text-slate-400 text-xs font-medium">—</span>
                    </td>
                  </tr>

                  <!-- SSU -->
                  <tr class="hover:bg-slate-50/80 transition-colors border-l-2 border-l-transparent hover:border-l-rose-400">
                    <td class="py-3 px-5">
                      <div class="flex items-center gap-2.5">
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200/60 uppercase shrink-0">SSU</span>
                        <div>
                          <div class="font-bold text-slate-900 text-sm">Security Services</div>
                          <span class="text-xs text-slate-400 font-normal">Campus Safety, Guard Posts &amp; Surveillance</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-center font-bold tabular-nums text-slate-900 text-sm">{{ executiveAnalytics?.units?.SSU?.total ?? 0 }}</td>
                    <td class="py-3 px-4 text-center font-bold text-emerald-700 tabular-nums text-sm">{{ executiveAnalytics?.units?.SSU?.resolved ?? 0 }}</td>
                    <td class="py-3 px-4 text-center font-semibold text-slate-600 tabular-nums text-sm">{{ executiveAnalytics?.units?.SSU?.declined ?? 0 }}</td>
                    <td class="py-3 px-5 text-center font-bold text-slate-900 tabular-nums text-sm">
                      <span v-if="executiveAnalytics?.units?.SSU?.avg_ratings?.overall_avg">{{ executiveAnalytics.units.SSU.avg_ratings.overall_avg }}</span>
                      <span v-else class="text-slate-400 text-xs font-medium">—</span>
                    </td>
                  </tr>

                  <!-- Consolidated Total Row -->
                  <tr class="bg-slate-50 font-extrabold text-slate-900 border-t-2 border-slate-200">
                    <td class="py-3 px-5 text-xs font-extrabold tracking-widest text-slate-500 uppercase">GSO Overall</td>
                    <td class="py-3 px-4 text-center text-slate-900 tabular-nums text-sm font-extrabold">{{ executiveAnalytics?.summary?.total_requests ?? 0 }}</td>
                    <td class="py-3 px-4 text-center text-emerald-700 tabular-nums text-sm font-extrabold">{{ executiveAnalytics?.summary?.total_resolved ?? 0 }}</td>
                    <td class="py-3 px-4 text-center text-slate-700 tabular-nums text-sm font-extrabold">{{ executiveAnalytics?.summary?.total_declined ?? 0 }}</td>
                    <td class="py-3 px-5 text-center text-slate-900 tabular-nums text-sm font-extrabold">
                      <span v-if="executiveAnalytics?.summary?.overall_ratings?.overall_avg">{{ executiveAnalytics.summary.overall_ratings.overall_avg }}</span>
                      <span v-else class="text-slate-400 text-xs font-medium">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Operational Insights (Service Distribution & SLA Health) -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
            <!-- Left: Service Workload Share -->
            <div class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-2xs">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Top Service Categories</h4>
              </div>

              <div v-if="executiveAnalytics?.service_breakdown?.length" class="space-y-3">
                <div v-for="(item, idx) in executiveAnalytics.service_breakdown" :key="item.name" class="space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold text-slate-700 truncate">{{ item.name }}</span>
                    <span class="tabular-nums text-slate-500 font-bold text-[11px] ml-2 shrink-0">{{ item.count }} <span class="text-slate-400">({{ item.percent }}%)</span></span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      :class="idx % 3 === 0 ? 'bg-blue-500' : idx % 3 === 1 ? 'bg-emerald-500' : 'bg-rose-400'"
                      :style="{ width: `${item.percent}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              <p v-else class="text-xs text-slate-400 font-medium py-6 text-center">No categories recorded for this period.</p>
            </div>

            <!-- Right: SLA Compliance & Quality Dimensions -->
            <div class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-2xs">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Service Completion &amp; Quality</h4>
              </div>

              <!-- 3 Health Tiles -->
              <div class="grid grid-cols-3 gap-2.5">
                <div class="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/60 text-center">
                  <svg class="w-4 h-4 text-emerald-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  <span class="text-xl sm:text-2xl font-extrabold text-emerald-900 tabular-nums block">{{ executiveAnalytics?.completion_health?.on_time ?? 0 }}</span>
                  <span class="text-[10px] font-bold text-emerald-700 block">{{ executiveAnalytics?.completion_health?.on_time_percent ?? 0 }}%</span>
                  <span class="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mt-0.5">On-Time</span>
                </div>
                <div class="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/60 text-center">
                  <svg class="w-4 h-4 text-amber-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span class="text-xl sm:text-2xl font-extrabold text-amber-900 tabular-nums block">{{ executiveAnalytics?.completion_health?.beyond_time ?? 0 }}</span>
                  <span class="text-[10px] font-bold text-amber-700 block">{{ executiveAnalytics?.completion_health?.beyond_time_percent ?? 0 }}%</span>
                  <span class="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mt-0.5">Overdue</span>
                </div>
                <div class="p-3.5 bg-slate-100/70 rounded-xl border border-slate-200/60 text-center">
                  <svg class="w-4 h-4 text-slate-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span class="text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums block">{{ executiveAnalytics?.completion_health?.not_completed ?? 0 }}</span>
                  <span class="text-[10px] font-bold text-slate-500 block">{{ executiveAnalytics?.completion_health?.not_completed_percent ?? 0 }}%</span>
                  <span class="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mt-0.5">Incomplete</span>
                </div>
              </div>

              <!-- Rating Breakdown Dimensions -->
              <div class="pt-3 border-t border-slate-100 space-y-2.5">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Client Rating Breakdown</span>
                <div class="grid grid-cols-3 gap-2">
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
                    <div class="flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <span class="text-[10px] font-bold text-slate-500 uppercase">Quality</span>
                    </div>
                    <span class="text-base font-extrabold text-slate-900 tabular-nums">{{ executiveAnalytics?.summary?.overall_ratings?.avg_quality ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_quality).toFixed(2) : '5.00' }}</span>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
                    <div class="flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      <span class="text-[10px] font-bold text-slate-500 uppercase">Efficiency</span>
                    </div>
                    <span class="text-base font-extrabold text-slate-900 tabular-nums">{{ executiveAnalytics?.summary?.overall_ratings?.avg_efficiency ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_efficiency).toFixed(2) : '5.00' }}</span>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
                    <div class="flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span class="text-[10px] font-bold text-slate-500 uppercase">Timeliness</span>
                    </div>
                    <span class="text-base font-extrabold text-slate-900 tabular-nums">{{ executiveAnalytics?.summary?.overall_ratings?.avg_timeliness ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_timeliness).toFixed(2) : '5.00' }}</span>
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
