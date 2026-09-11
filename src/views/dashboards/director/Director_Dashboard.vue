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
              <div class="flex items-center gap-2.5">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
                  Executive Overview
                </span>
                <span class="text-xs font-medium text-slate-400">BSU General Services Office</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Performance Overview &amp; Reports
              </h3>
              <p class="text-sm text-slate-500 font-normal">
                Ticket volume, resolution rates, and client satisfaction ratings across all GSO operational units.
              </p>
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
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">Period:</span>
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
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <!-- 1. Total Requests Filed -->
            <div class="p-6 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-200">
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-300">Total Requests Filed</span>
                <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700/60 text-xs font-bold">
                  {{ executiveAnalytics?.filter?.label || 'All-Time' }}
                </span>
              </div>
              <div class="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-white my-1">
                {{ executiveAnalytics?.summary?.total_requests ?? 0 }}
              </div>
            </div>

            <!-- 2. Resolved & Completed -->
            <div class="p-6 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-2xs flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all duration-200">
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Resolved &amp; Completed</span>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold">
                  Closed
                </span>
              </div>
              <div class="flex items-baseline gap-2 my-1">
                <span class="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-emerald-700">
                  {{ executiveAnalytics?.summary?.total_resolved ?? 0 }}
                </span>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">resolved</span>
              </div>
            </div>

            <!-- 3. Declined / Out of Scope -->
            <div class="p-6 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-2xs flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-200">
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Declined / Out of Scope</span>
                <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 text-xs font-bold">
                  Disapproved
                </span>
              </div>
              <div class="flex items-baseline gap-2 my-1">
                <span class="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-slate-800">
                  {{ executiveAnalytics?.summary?.total_declined ?? 0 }}
                </span>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">declined</span>
              </div>
            </div>

            <!-- 4. Client Satisfaction Rating -->
            <div class="p-6 rounded-2xl bg-white border border-slate-200/80 text-slate-900 shadow-2xs flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all duration-200">
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Client Satisfaction</span>
                <div class="flex items-center gap-0.5 text-amber-500">
                  <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
              <div class="flex items-baseline gap-1.5 my-1">
                <span class="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-slate-900">
                  {{ executiveAnalytics?.summary?.overall_ratings?.overall_avg ? parseFloat(executiveAnalytics.summary.overall_ratings.overall_avg).toFixed(2) : '5.00' }}
                </span>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  ({{ executiveAnalytics?.summary?.overall_ratings?.total_feedbacks || 0 }} reviews)
                </span>
              </div>
            </div>
          </div>

          <!-- Cross-Unit Performance Matrix Table -->
          <div class="space-y-4 pt-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <h4 class="text-base font-extrabold text-slate-900 tracking-tight">
                  Performance by Sub-Unit
                </h4>
              </div>
              <span class="text-xs font-semibold text-slate-400">
                Period: {{ executiveAnalytics?.filter?.label || 'Current Period' }}
              </span>
            </div>

            <div class="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-2xs">
              <table class="min-w-[650px] w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th class="py-3.5 px-6">Sub-Unit</th>
                    <th class="py-3.5 px-4 text-center">Total Requests</th>
                    <th class="py-3.5 px-4 text-center">Resolved</th>
                    <th class="py-3.5 px-4 text-center">Declined</th>
                    <th class="py-3.5 px-6 text-center">Client Rating</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-sm">
                  <!-- FGMU -->
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <span class="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60 uppercase shrink-0">
                          FGMU
                        </span>
                        <div>
                          <div class="font-bold text-slate-900 text-sm sm:text-base">Facilities Management</div>
                          <span class="text-xs text-slate-400 font-normal">Electrical, Plumbing, Carpentry, HVAC</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-4 text-center font-bold tabular-nums text-slate-900 text-base">{{ executiveAnalytics?.units?.FGMU?.total ?? 0 }}</td>
                    <td class="py-4 px-4 text-center font-bold text-emerald-700 tabular-nums text-base">{{ executiveAnalytics?.units?.FGMU?.resolved ?? 0 }}</td>
                    <td class="py-4 px-4 text-center font-semibold text-slate-600 tabular-nums text-base">{{ executiveAnalytics?.units?.FGMU?.declined ?? 0 }}</td>
                    <td class="py-4 px-6 text-center font-bold text-slate-900 tabular-nums text-base">
                      <span v-if="executiveAnalytics?.units?.FGMU?.avg_ratings?.overall_avg" class="inline-flex items-center gap-1">
                        <span>{{ executiveAnalytics.units.FGMU.avg_ratings.overall_avg }}</span>
                        <span class="text-amber-500">★</span>
                      </span>
                      <span v-else class="text-slate-400 text-xs font-medium">N/A</span>
                    </td>
                  </tr>

                  <!-- LEAU -->
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <span class="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase shrink-0">
                          LEAU
                        </span>
                        <div>
                          <div class="font-bold text-slate-900 text-sm sm:text-base">Landscaping &amp; Environment</div>
                          <span class="text-xs text-slate-400 font-normal">Grounds, Campus Ecology, Tree Pruning</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-4 text-center font-bold tabular-nums text-slate-900 text-base">{{ executiveAnalytics?.units?.LEAU?.total ?? 0 }}</td>
                    <td class="py-4 px-4 text-center font-bold text-emerald-700 tabular-nums text-base">{{ executiveAnalytics?.units?.LEAU?.resolved ?? 0 }}</td>
                    <td class="py-4 px-4 text-center font-semibold text-slate-600 tabular-nums text-base">{{ executiveAnalytics?.units?.LEAU?.declined ?? 0 }}</td>
                    <td class="py-4 px-6 text-center font-bold text-slate-900 tabular-nums text-base">
                      <span v-if="executiveAnalytics?.units?.LEAU?.avg_ratings?.overall_avg" class="inline-flex items-center gap-1">
                        <span>{{ executiveAnalytics.units.LEAU.avg_ratings.overall_avg }}</span>
                        <span class="text-amber-500">★</span>
                      </span>
                      <span v-else class="text-slate-400 text-xs font-medium">N/A</span>
                    </td>
                  </tr>

                  <!-- SSU -->
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <span class="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200/60 uppercase shrink-0">
                          SSU
                        </span>
                        <div>
                          <div class="font-bold text-slate-900 text-sm sm:text-base">Security Services</div>
                          <span class="text-xs text-slate-400 font-normal">Campus Safety, Guard Posts &amp; Surveillance</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-4 text-center font-bold tabular-nums text-slate-900 text-base">{{ executiveAnalytics?.units?.SSU?.total ?? 0 }}</td>
                    <td class="py-4 px-4 text-center font-bold text-emerald-700 tabular-nums text-base">{{ executiveAnalytics?.units?.SSU?.resolved ?? 0 }}</td>
                    <td class="py-4 px-4 text-center font-semibold text-slate-600 tabular-nums text-base">{{ executiveAnalytics?.units?.SSU?.declined ?? 0 }}</td>
                    <td class="py-4 px-6 text-center font-bold text-slate-900 tabular-nums text-base">
                      <span v-if="executiveAnalytics?.units?.SSU?.avg_ratings?.overall_avg" class="inline-flex items-center gap-1">
                        <span>{{ executiveAnalytics.units.SSU.avg_ratings.overall_avg }}</span>
                        <span class="text-amber-500">★</span>
                      </span>
                      <span v-else class="text-slate-400 text-xs font-medium">N/A</span>
                    </td>
                  </tr>

                  <!-- Consolidated Total Row -->
                  <tr class="bg-slate-100/70 font-extrabold text-slate-900 border-t-2 border-slate-200">
                    <td class="py-4 px-6 text-sm font-extrabold tracking-wider text-slate-900 uppercase">
                      GSO Overall Total
                    </td>
                    <td class="py-4 px-4 text-center text-slate-900 tabular-nums text-base sm:text-lg font-extrabold">{{ executiveAnalytics?.summary?.total_requests ?? 0 }}</td>
                    <td class="py-4 px-4 text-center text-emerald-700 tabular-nums text-base sm:text-lg font-extrabold">{{ executiveAnalytics?.summary?.total_resolved ?? 0 }}</td>
                    <td class="py-4 px-4 text-center text-slate-700 tabular-nums text-base sm:text-lg font-extrabold">{{ executiveAnalytics?.summary?.total_declined ?? 0 }}</td>
                    <td class="py-4 px-6 text-center text-slate-900 tabular-nums text-base sm:text-lg font-extrabold">
                      <span v-if="executiveAnalytics?.summary?.overall_ratings?.overall_avg" class="inline-flex items-center gap-1">
                        <span>{{ executiveAnalytics.summary.overall_ratings.overall_avg }}</span>
                        <span class="text-amber-500">★</span>
                      </span>
                      <span v-else class="text-slate-400 text-xs font-medium">N/A</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Operational Insights (Service Distribution & SLA Health) -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
            <!-- Left: Service Workload Share -->
            <div class="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 space-y-5 shadow-2xs">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                  <h4 class="text-sm sm:text-base font-bold text-slate-900">
                    Top Service Categories &amp; Distribution
                  </h4>
                </div>
                <span class="text-xs text-slate-400 font-medium">By Volume</span>
              </div>

              <div v-if="executiveAnalytics?.service_breakdown?.length" class="space-y-4">
                <div v-for="item in executiveAnalytics.service_breakdown" :key="item.name" class="space-y-1.5">
                  <div class="flex items-center justify-between text-sm font-semibold text-slate-800">
                    <span class="truncate">{{ item.name }}</span>
                    <span class="tabular-nums text-slate-500 font-bold text-xs">{{ item.count }} tickets ({{ item.percent }}%)</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-slate-800 rounded-full transition-all duration-500" :style="{ width: `${item.percent}%` }"></div>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-slate-400 font-medium py-8 text-center">
                No service categories recorded for this period.
              </p>
            </div>

            <!-- Right: SLA Compliance & Quality Dimensions -->
            <div class="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 space-y-5 shadow-2xs">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                  <h4 class="text-sm sm:text-base font-bold text-slate-900">
                    Service Completion Overview
                  </h4>
                </div>
                <span class="text-xs text-slate-400 font-medium">Timeliness SLA</span>
              </div>

              <!-- 3 Health Tiles -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center">
                <div class="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/60">
                  <span class="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">On-Time</span>
                  <span class="text-2xl sm:text-3xl font-extrabold text-emerald-900 tabular-nums">{{ executiveAnalytics?.completion_health?.on_time ?? 0 }}</span>
                  <span class="text-xs font-bold text-emerald-700 block mt-1">{{ executiveAnalytics?.completion_health?.on_time_percent ?? 0 }}%</span>
                </div>
                <div class="p-4 bg-amber-50/70 rounded-xl border border-amber-200/60">
                  <span class="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">Beyond-Time</span>
                  <span class="text-2xl sm:text-3xl font-extrabold text-amber-900 tabular-nums">{{ executiveAnalytics?.completion_health?.beyond_time ?? 0 }}</span>
                  <span class="text-xs font-bold text-amber-700 block mt-1">{{ executiveAnalytics?.completion_health?.beyond_time_percent ?? 0 }}%</span>
                </div>
                <div class="p-4 bg-slate-100/70 rounded-xl border border-slate-200/60">
                  <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Incomplete</span>
                  <span class="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">{{ executiveAnalytics?.completion_health?.not_completed ?? 0 }}</span>
                  <span class="text-xs font-bold text-slate-500 block mt-1">{{ executiveAnalytics?.completion_health?.not_completed_percent ?? 0 }}%</span>
                </div>
              </div>

              <!-- Rating Breakdown Dimensions -->
              <div class="pt-3 border-t border-slate-100 space-y-3">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Rating Breakdown</span>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center sm:text-left">
                    <span class="text-xs font-medium text-slate-500 block mb-0.5">Quality</span>
                    <span class="text-lg sm:text-xl font-extrabold text-slate-900 tabular-nums">{{ executiveAnalytics?.summary?.overall_ratings?.avg_quality ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_quality).toFixed(2) : '5.00' }}</span>
                  </div>
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center sm:text-left">
                    <span class="text-xs font-medium text-slate-500 block mb-0.5">Efficiency</span>
                    <span class="text-lg sm:text-xl font-extrabold text-slate-900 tabular-nums">{{ executiveAnalytics?.summary?.overall_ratings?.avg_efficiency ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_efficiency).toFixed(2) : '5.00' }}</span>
                  </div>
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center sm:text-left">
                    <span class="text-xs font-medium text-slate-500 block mb-0.5">Timeliness</span>
                    <span class="text-lg sm:text-xl font-extrabold text-slate-900 tabular-nums">{{ executiveAnalytics?.summary?.overall_ratings?.avg_timeliness ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_timeliness).toFixed(2) : '5.00' }}</span>
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
