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
      <div class="space-y-8 animate-fade-in pb-12">
        
        <!-- Welcome Executive Banner -->
        <div class="p-8 rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="relative z-10 space-y-2 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest">
              Executive Command Center
            </div>
            <h3 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sub-Unit Operational Portals
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Select an individual sub-unit below to inspect detailed analytics, performance evaluation ratings, workflow status, and issue root-cause reports.
            </p>
          </div>
        </div>

        <!-- Sub-Unit Individual Portals Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- FGMU Portal Card -->
          <div class="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden border-b-4 border-b-blue-500">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs border border-blue-100">
                    <!-- Tools / Facilities Maintenance Icon (FGMU) -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-black text-slate-900 leading-tight">Facilities Management</h4>
                    <p class="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">FGMU Unit</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Infrastructure
                </span>
              </div>

              <p class="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
                Manages campus electrical, carpentry, plumbing, air conditioning, welding, sound system, and scheduled building development.
              </p>

              <!-- Quick Mini Metrics -->
              <div class="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
                  <span class="text-base font-black text-amber-600 tabular-nums">{{ unitStats.fgmu.pending || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active</span>
                  <span class="text-base font-black text-blue-600 tabular-nums">{{ unitStats.fgmu.active_working || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                  <span class="text-base font-black text-emerald-600 tabular-nums">{{ unitStats.fgmu.resolved || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Declined</span>
                  <span class="text-base font-black text-rose-600 tabular-nums">{{ unitStats.fgmu.declined || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- FGMU Dual Actions -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <router-link 
                to="/admin/fgmu/queues" 
                class="py-3 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Ticket Queues</span>
              </router-link>
              <router-link 
                to="/director/fgmu" 
                class="py-3 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Analytics</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>
          </div>

          <!-- LEAU Portal Card -->
          <div class="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden border-b-4 border-b-emerald-500">
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs border border-emerald-100">
                    <!-- Leaf / Environment & Landscaping Icon (LEAU) -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-black text-slate-900 leading-tight">Landscaping & Environment</h4>
                    <p class="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">LEAU Unit</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Ecology
                </span>
              </div>

              <p class="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
                Oversees university grounds maintenance, campus landscaping, tree pruning, grass cutting, and environmental beautification.
              </p>

              <!-- Quick Mini Metrics -->
              <div class="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
                  <span class="text-base font-black text-amber-600 tabular-nums">{{ unitStats.leau.pending || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active</span>
                  <span class="text-base font-black text-emerald-600 tabular-nums">{{ unitStats.leau.active_working || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                  <span class="text-base font-black text-emerald-700 tabular-nums">{{ unitStats.leau.resolved || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Declined</span>
                  <span class="text-base font-black text-rose-600 tabular-nums">{{ unitStats.leau.declined || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- LEAU Dual Actions -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <router-link 
                to="/admin/leau/queues" 
                class="py-3 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Ticket Queues</span>
              </router-link>
              <router-link 
                to="/director/leau" 
                class="py-3 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Analytics</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>
          </div>

          <!-- SSU Portal Card -->
          <div class="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden border-b-4 border-b-rose-500">
            <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs border border-rose-100">
                    <!-- Shield / Security Services Icon (SSU) -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-black text-slate-900 leading-tight">Security Services</h4>
                    <p class="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest">SSU Unit</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 bg-rose-50 text-rose-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Campus Safety
                </span>
              </div>

              <p class="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
                Handles security incident reporting, campus investigations, witness verification, and campus safety coordination.
              </p>

              <!-- Quick Mini Metrics -->
              <div class="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div class="text-center">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
                  <span class="text-base font-black text-amber-600 tabular-nums">{{ unitStats.ssu.pending || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Processing</span>
                  <span class="text-base font-black text-blue-600 tabular-nums">{{ unitStats.ssu.processing || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                  <span class="text-base font-black text-emerald-600 tabular-nums">{{ unitStats.ssu.resolved || 0 }}</span>
                </div>
                <div class="text-center border-l border-slate-200/60">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Declined</span>
                  <span class="text-base font-black text-rose-600 tabular-nums">{{ unitStats.ssu.declined || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- SSU Single Action (Incident Queues removed as SSU incidents do not require Director approval) -->
            <div>
              <router-link 
                to="/director/ssu" 
                class="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-900/10 hover:shadow-rose-600/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>SSU Security Analytics</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>
          </div>

        </div>

        <!-- ================================================================= -->
        <!-- EXECUTIVE ANALYTICS SUMMARY & OFFICIAL REPORTS SECTION           -->
        <!-- ================================================================= -->
        <div class="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl space-y-6">
          
          <!-- Section Header & Export Toolbar -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div class="space-y-1">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Official BSU Executive Document
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Executive Analytics Summary &amp; Compliance Reports
              </h3>
              <p class="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">
                Generate, preview, and download official institutional performance reports across all GSO sub-units. Evaluates Citizen's Charter SLA execution, service frequencies, and client quality ratings.
              </p>
            </div>

            <!-- PDF Action Buttons -->
            <div class="flex flex-wrap items-center gap-3 shrink-0">
              <!-- Preview PDF Report -->
              <button
                @click="handlePreviewReport"
                :disabled="isGeneratingPdf || !executiveAnalytics"
                class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-slate-900/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Preview document in browser"
              >
                <svg v-if="isGeneratingPdf" class="animate-spin h-4 w-4 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Preview PDF</span>
              </button>

              <!-- Download Official PDF -->
              <button
                @click="handleDownloadReport"
                :disabled="isGeneratingPdf || !executiveAnalytics"
                class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Download official PDF report"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          <!-- Interactive Period & Timeframe Selector Bar -->
          <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <!-- Period Tabs -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-bold text-slate-500 mr-1">Report Period:</span>
              <div class="inline-flex p-1 rounded-xl bg-white border border-slate-200 shadow-xs">
                <button
                  v-for="p in periodOptions"
                  :key="p.key"
                  @click="changePeriod(p.key)"
                  class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer"
                  :class="selectedPeriod === p.key ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Dynamic Selectors (Year, Month, Quarter) -->
            <div class="flex flex-wrap items-center gap-2.5">
              <!-- Year Selector -->
              <div v-if="selectedPeriod !== 'all'" class="relative">
                <select
                  v-model="selectedYear"
                  @change="fetchExecutiveAnalytics"
                  class="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs cursor-pointer"
                >
                  <option v-for="yr in availableYears" :key="yr" :value="yr">
                    Year {{ yr }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Month Selector -->
              <div v-if="selectedPeriod === 'month'" class="relative">
                <select
                  v-model="selectedMonth"
                  @change="fetchExecutiveAnalytics"
                  class="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs cursor-pointer"
                >
                  <option v-for="m in monthOptions" :key="m.value" :value="m.value">
                    {{ m.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Quarter Selector -->
              <div v-if="selectedPeriod === 'quarter'" class="relative">
                <select
                  v-model="selectedQuarter"
                  @change="fetchExecutiveAnalytics"
                  class="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs cursor-pointer"
                >
                  <option v-for="q in quarterOptions" :key="q.value" :value="q.value">
                    {{ q.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <!-- Refresh / Reload Button -->
              <button
                @click="fetchExecutiveAnalytics"
                class="p-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition-all cursor-pointer shadow-xs"
                title="Refresh Report Data"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Executive KPI Cards Grid (Consolidated Overview) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- 1. Total Requests -->
            <div class="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md flex flex-col justify-between">
              <div class="flex items-center justify-between gap-2 mb-3">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Workload Filed</span>
                <span class="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[9px] font-bold">{{ executiveAnalytics?.filter?.label || 'All' }}</span>
              </div>
              <div class="text-3xl font-black tracking-tight tabular-nums mb-1">
                {{ executiveAnalytics?.summary?.total_requests ?? 0 }}
              </div>
              <p class="text-[11px] text-slate-300 font-medium">
                Combined across FGMU, LEAU, &amp; SSU
              </p>
            </div>

            <!-- 2. Resolution & Completion Rate -->
            <div class="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-950 shadow-xs flex flex-col justify-between">
              <div class="flex items-center justify-between gap-2 mb-3">
                <span class="text-[10px] font-black uppercase tracking-wider text-emerald-700">Completion Rate</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black">
                  {{ executiveAnalytics?.summary?.completion_rate ?? 0 }}%
                </span>
              </div>
              <div class="text-3xl font-black tracking-tight tabular-nums text-emerald-800 mb-1">
                {{ executiveAnalytics?.summary?.total_resolved ?? 0 }}
                <span class="text-xs font-bold text-emerald-600">resolved</span>
              </div>
              <div class="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden mt-1">
                <div class="h-full bg-emerald-600 rounded-full transition-all duration-500" :style="{ width: `${executiveAnalytics?.summary?.completion_rate || 0}%` }"></div>
              </div>
            </div>

            <!-- 3. Active Operations -->
            <div class="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-950 shadow-xs flex flex-col justify-between">
              <div class="flex items-center justify-between gap-2 mb-3">
                <span class="text-[10px] font-black uppercase tracking-wider text-blue-700">In Progress / Active</span>
                <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[9px] font-bold">
                  {{ executiveAnalytics?.summary?.total_pending ?? 0 }} Pending
                </span>
              </div>
              <div class="text-3xl font-black tracking-tight tabular-nums text-blue-800 mb-1">
                {{ (executiveAnalytics?.summary?.total_processing ?? 0) + (executiveAnalytics?.summary?.total_pending ?? 0) }}
              </div>
              <p class="text-[11px] text-blue-600/80 font-medium">
                {{ executiveAnalytics?.summary?.total_declined ?? 0 }} requests declined/out of scope
              </p>
            </div>

            <!-- 4. Client Satisfaction Rating -->
            <div class="p-5 rounded-2xl bg-amber-50/70 border border-amber-100 text-amber-950 shadow-xs flex flex-col justify-between">
              <div class="flex items-center justify-between gap-2 mb-3">
                <span class="text-[10px] font-black uppercase tracking-wider text-amber-700">Client CSAT Score</span>
                <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-black">
                  ARTA / ISO 9001
                </span>
              </div>
              <div class="flex items-baseline gap-2 mb-1">
                <span class="text-3xl font-black tracking-tight tabular-nums text-amber-800">
                  {{ executiveAnalytics?.summary?.overall_ratings?.overall_avg ? parseFloat(executiveAnalytics.summary.overall_ratings.overall_avg).toFixed(2) : '5.00' }}
                </span>
                <span class="text-xs font-extrabold text-amber-600">/ 5.00</span>
              </div>
              <div class="flex items-center gap-1 text-amber-500">
                <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-[10px] font-bold text-slate-500 ml-1">
                  ({{ executiveAnalytics?.summary?.overall_ratings?.total_feedbacks || 0 }} surveys)
                </span>
              </div>
            </div>
          </div>

          <!-- Cross-Unit Performance Matrix Table -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span class="w-2 h-3.5 rounded-full bg-emerald-600"></span>
                Sub-Unit Performance &amp; Workload Matrix ({{ executiveAnalytics?.filter?.label || 'Current Period' }})
              </h4>
              <span class="text-[11px] font-bold text-slate-400">Official Institutional Comparison</span>
            </div>

            <div class="overflow-x-auto rounded-2xl border border-slate-200">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
                    <th class="py-3 px-4">Sub-Unit</th>
                    <th class="py-3 px-3 text-center">Total Requests</th>
                    <th class="py-3 px-3 text-center">Resolved</th>
                    <th class="py-3 px-3 text-center">Active Work</th>
                    <th class="py-3 px-3 text-center">Pending Approval</th>
                    <th class="py-3 px-3 text-center">Declined</th>
                    <th class="py-3 px-3 text-center">Completion Rate</th>
                    <th class="py-3 px-3 text-center">Satisfaction</th>
                    <th class="py-3 px-4 text-right">Unit Portal</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs">
                  <!-- FGMU -->
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-3 px-4 font-bold text-slate-900">
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                        <div>
                          <div>Facilities Management (FGMU)</div>
                          <span class="text-[10px] text-slate-400 font-normal">Electrical, Plumbing, Carpentry, HVAC</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-3 text-center font-bold tabular-nums">{{ executiveAnalytics?.units?.FGMU?.total ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-bold text-emerald-600 tabular-nums">{{ executiveAnalytics?.units?.FGMU?.resolved ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-semibold text-blue-600 tabular-nums">
                      {{ (executiveAnalytics?.units?.FGMU?.processing ?? 0) + (executiveAnalytics?.units?.FGMU?.active_working ?? 0) }}
                    </td>
                    <td class="py-3 px-3 text-center font-semibold text-amber-600 tabular-nums">{{ executiveAnalytics?.units?.FGMU?.pending ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-semibold text-rose-600 tabular-nums">{{ executiveAnalytics?.units?.FGMU?.declined ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-black text-slate-800 tabular-nums">{{ executiveAnalytics?.units?.FGMU?.completion_rate ?? 0 }}%</td>
                    <td class="py-3 px-3 text-center font-bold text-emerald-700 tabular-nums">
                      {{ executiveAnalytics?.units?.FGMU?.avg_ratings?.overall_avg ? `${executiveAnalytics.units.FGMU.avg_ratings.overall_avg} ★` : 'N/A' }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <router-link to="/director/fgmu" class="text-blue-600 hover:text-blue-800 font-bold text-[11px] hover:underline">
                        Inspect &rarr;
                      </router-link>
                    </td>
                  </tr>

                  <!-- LEAU -->
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-3 px-4 font-bold text-slate-900">
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <div>
                          <div>Landscaping &amp; Environment (LEAU)</div>
                          <span class="text-[10px] text-slate-400 font-normal">Grounds, Campus Ecology, Tree Pruning</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-3 text-center font-bold tabular-nums">{{ executiveAnalytics?.units?.LEAU?.total ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-bold text-emerald-600 tabular-nums">{{ executiveAnalytics?.units?.LEAU?.resolved ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-semibold text-blue-600 tabular-nums">
                      {{ (executiveAnalytics?.units?.LEAU?.processing ?? 0) + (executiveAnalytics?.units?.LEAU?.active_working ?? 0) }}
                    </td>
                    <td class="py-3 px-3 text-center font-semibold text-amber-600 tabular-nums">{{ executiveAnalytics?.units?.LEAU?.pending ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-semibold text-rose-600 tabular-nums">{{ executiveAnalytics?.units?.LEAU?.declined ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-black text-slate-800 tabular-nums">{{ executiveAnalytics?.units?.LEAU?.completion_rate ?? 0 }}%</td>
                    <td class="py-3 px-3 text-center font-bold text-emerald-700 tabular-nums">
                      {{ executiveAnalytics?.units?.LEAU?.avg_ratings?.overall_avg ? `${executiveAnalytics.units.LEAU.avg_ratings.overall_avg} ★` : 'N/A' }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <router-link to="/director/leau" class="text-emerald-600 hover:text-emerald-800 font-bold text-[11px] hover:underline">
                        Inspect &rarr;
                      </router-link>
                    </td>
                  </tr>

                  <!-- SSU -->
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-3 px-4 font-bold text-slate-900">
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                        <div>
                          <div>Security Services (SSU)</div>
                          <span class="text-[10px] text-slate-400 font-normal">Campus Safety, Security Incidents</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-3 text-center font-bold tabular-nums">{{ executiveAnalytics?.units?.SSU?.total ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-bold text-emerald-600 tabular-nums">{{ executiveAnalytics?.units?.SSU?.resolved ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-semibold text-blue-600 tabular-nums">{{ executiveAnalytics?.units?.SSU?.processing ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-semibold text-amber-600 tabular-nums">{{ executiveAnalytics?.units?.SSU?.pending ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-semibold text-rose-600 tabular-nums">{{ executiveAnalytics?.units?.SSU?.declined ?? 0 }}</td>
                    <td class="py-3 px-3 text-center font-black text-slate-800 tabular-nums">{{ executiveAnalytics?.units?.SSU?.completion_rate ?? 0 }}%</td>
                    <td class="py-3 px-3 text-center font-bold text-emerald-700 tabular-nums">
                      {{ executiveAnalytics?.units?.SSU?.avg_ratings?.overall_avg ? `${executiveAnalytics.units.SSU.avg_ratings.overall_avg} ★` : 'N/A' }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <router-link to="/director/ssu" class="text-rose-600 hover:text-rose-800 font-bold text-[11px] hover:underline">
                        Inspect &rarr;
                      </router-link>
                    </td>
                  </tr>

                  <!-- Consolidated Total -->
                  <tr class="bg-emerald-50/40 font-black text-slate-900">
                    <td class="py-3.5 px-4 text-emerald-900">CONSOLIDATED GSO TOTAL</td>
                    <td class="py-3.5 px-3 text-center tabular-nums">{{ executiveAnalytics?.summary?.total_requests ?? 0 }}</td>
                    <td class="py-3.5 px-3 text-center text-emerald-700 tabular-nums">{{ executiveAnalytics?.summary?.total_resolved ?? 0 }}</td>
                    <td class="py-3.5 px-3 text-center text-blue-700 tabular-nums">{{ executiveAnalytics?.summary?.total_processing ?? 0 }}</td>
                    <td class="py-3.5 px-3 text-center text-amber-700 tabular-nums">{{ executiveAnalytics?.summary?.total_pending ?? 0 }}</td>
                    <td class="py-3.5 px-3 text-center text-rose-700 tabular-nums">{{ executiveAnalytics?.summary?.total_declined ?? 0 }}</td>
                    <td class="py-3.5 px-3 text-center text-emerald-800 tabular-nums">{{ executiveAnalytics?.summary?.completion_rate ?? 0 }}%</td>
                    <td class="py-3.5 px-3 text-center text-emerald-800 tabular-nums">
                      {{ executiveAnalytics?.summary?.overall_ratings?.overall_avg ? `${executiveAnalytics.summary.overall_ratings.overall_avg} ★` : 'N/A' }}
                    </td>
                    <td class="py-3.5 px-4 text-right text-[10px] text-emerald-800 uppercase tracking-wider">Campus Wide</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Operational Insights (Service Distribution & SLA Health) -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            <!-- Left: Service Workload Share -->
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Top Service Categories &amp; Distribution
              </h4>

              <div v-if="executiveAnalytics?.service_breakdown?.length" class="space-y-3">
                <div v-for="item in executiveAnalytics.service_breakdown" :key="item.name" class="space-y-1">
                  <div class="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span class="truncate">{{ item.name }}</span>
                    <span class="tabular-nums text-slate-500 font-extrabold">{{ item.count }} tickets ({{ item.percent }}%)</span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div class="h-full bg-slate-900 rounded-full" :style="{ width: `${item.percent}%` }"></div>
                  </div>
                </div>
              </div>
              <p v-else class="text-xs text-slate-400 font-medium py-4 text-center">
                No service categories recorded for this period.
              </p>
            </div>

            <!-- Right: SLA Compliance & Quality Dimensions -->
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Citizen's Charter SLA Compliance
              </h4>

              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-3 bg-emerald-100/60 rounded-xl border border-emerald-200/50">
                  <span class="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">On-Time</span>
                  <span class="text-lg font-black text-emerald-800 tabular-nums">{{ executiveAnalytics?.completion_health?.on_time ?? 0 }}</span>
                  <span class="text-[10px] font-extrabold text-emerald-600 block">{{ executiveAnalytics?.completion_health?.on_time_percent ?? 0 }}%</span>
                </div>
                <div class="p-3 bg-amber-100/60 rounded-xl border border-amber-200/50">
                  <span class="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">Beyond-Time</span>
                  <span class="text-lg font-black text-amber-800 tabular-nums">{{ executiveAnalytics?.completion_health?.beyond_time ?? 0 }}</span>
                  <span class="text-[10px] font-extrabold text-amber-600 block">{{ executiveAnalytics?.completion_health?.beyond_time_percent ?? 0 }}%</span>
                </div>
                <div class="p-3 bg-rose-100/60 rounded-xl border border-rose-200/50">
                  <span class="text-[9px] font-bold text-rose-800 uppercase tracking-wider block">Incomplete</span>
                  <span class="text-lg font-black text-rose-800 tabular-nums">{{ executiveAnalytics?.completion_health?.not_completed ?? 0 }}</span>
                  <span class="text-[10px] font-extrabold text-rose-600 block">{{ executiveAnalytics?.completion_health?.not_completed_percent ?? 0 }}%</span>
                </div>
              </div>

              <!-- Quality Dimensions Grid -->
              <div class="pt-2 border-t border-slate-200/60 space-y-2">
                <span class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Quality Dimension Scores (out of 5.0)</span>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div class="p-2 rounded-lg bg-white border border-slate-200/60">
                    <span class="text-[9px] font-bold text-slate-400 block">Courtesy</span>
                    <span class="font-extrabold text-slate-900">{{ executiveAnalytics?.summary?.overall_ratings?.avg_courtesy ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_courtesy).toFixed(2) : '5.00' }}</span>
                  </div>
                  <div class="p-2 rounded-lg bg-white border border-slate-200/60">
                    <span class="text-[9px] font-bold text-slate-400 block">Work Quality</span>
                    <span class="font-extrabold text-slate-900">{{ executiveAnalytics?.summary?.overall_ratings?.avg_quality ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_quality).toFixed(2) : '5.00' }}</span>
                  </div>
                  <div class="p-2 rounded-lg bg-white border border-slate-200/60">
                    <span class="text-[9px] font-bold text-slate-400 block">Timeliness</span>
                    <span class="font-extrabold text-slate-900">{{ executiveAnalytics?.summary?.overall_ratings?.avg_timeliness ? parseFloat(executiveAnalytics.summary.overall_ratings.avg_timeliness).toFixed(2) : '5.00' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </template>
  </MainLayout>

  <!-- Document Viewer Modal for Report Preview -->
  <DocumentViewerModal
    :is-open="isPreviewOpen"
    :title="previewTitle"
    :file-name="previewFileName"
    :file-blob="previewBlob"
    @close="isPreviewOpen = false"
  />
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import DirectorSidebar from './DirectorSidebar.vue';
import DocumentViewerModal from '@/components/DocumentViewerModal.vue';
import { generateDirectorReportBlob, downloadDirectorReportPdf } from '@/utils/directorReportPdfGenerator';
import { toast } from 'vue3-toastify';
import api from '@/api/client';

const unitStats = ref({
  fgmu: {},
  leau: {},
  ssu: {}
});

// Executive Analytics State
const executiveAnalytics = ref(null);
const isGeneratingPdf = ref(false);
const isPreviewOpen = ref(false);
const previewBlob = ref(null);
const previewTitle = ref('');
const previewFileName = ref('');

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

const fetchStats = async () => {
  try {
    const [fgmuRes, leauRes, ssuRes] = await Promise.allSettled([
      api.get('tickets/stats/FGMU'),
      api.get('tickets/stats/LEAU'),
      api.get('tickets/stats/SSU'),
    ]);
    
    if (fgmuRes.status === 'fulfilled' && fgmuRes.value.data?.data?.stats) {
      unitStats.value.fgmu = fgmuRes.value.data.data.stats;
    }
    if (leauRes.status === 'fulfilled' && leauRes.value.data?.data?.stats) {
      unitStats.value.leau = leauRes.value.data.data.stats;
    }
    if (ssuRes.status === 'fulfilled' && ssuRes.value.data?.data?.stats) {
      unitStats.value.ssu = ssuRes.value.data.data.stats;
    }
  } catch (error) {
    console.error('Failed to fetch director unit stats:', error);
  }
};

const handlePreviewReport = async () => {
  if (!executiveAnalytics.value) {
    toast.error('Analytics summary data is still loading.');
    return;
  }
  isGeneratingPdf.value = true;
  try {
    const blob = await generateDirectorReportBlob(executiveAnalytics.value);
    previewBlob.value = blob;
    const filter = executiveAnalytics.value.filter || {};
    previewTitle.value = `Official BSU Report — ${filter.label || 'Executive Summary'}`;
    const p = (filter.period || 'all').toLowerCase();
    const y = filter.year || currentYear;
    if (p === 'month') {
      previewFileName.value = `BSU_GSO_Monthly_Report_${y}_M${String(filter.month || 1).padStart(2, '0')}.pdf`;
    } else if (p === 'quarter') {
      previewFileName.value = `BSU_GSO_Quarterly_Report_${y}_Q${filter.quarter || 1}.pdf`;
    } else if (p === 'year') {
      previewFileName.value = `BSU_GSO_Annual_Report_${y}.pdf`;
    } else {
      previewFileName.value = `BSU_GSO_Executive_Report_${y}.pdf`;
    }
    isPreviewOpen.value = true;
  } catch (error) {
    console.error('Failed to generate report PDF:', error);
    toast.error('Failed to generate document preview.');
  } finally {
    isGeneratingPdf.value = false;
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
  fetchStats();
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
