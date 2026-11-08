<template>
  <div
    class="space-y-4 sm:space-y-6 animate-fade-in"
    :class="[
      isLeau ? 'theme-unit-leau' : 'theme-unit-fgmu',
      embedded ? 'w-full' : 'p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-16 min-h-screen'
    ]"
  >
    <!-- Section Header & Sub-Navigation -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Inventory Management</span>
            <span
              class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border"
              :class="isLeau
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'"
            >
              {{ effectiveUnit }}
            </span>
          </h3>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Tools, equipment, and materials stock
          </p>
        </div>

        <!-- Section Switcher Tabs (Separating Tools/Equipment and Materials) -->
        <div data-tour="inventory-main-tabs" class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner self-start sm:self-auto shrink-0">
          <button
            type="button"
            @click="activeTab = 'tools'"
            :class="[
              'px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 min-h-[40px] touch-manipulation',
              activeTab === 'tools'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="activeTab === 'tools' ? 'text-emerald-600' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Tools &amp; Equipment</span>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              :class="activeTab === 'tools' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200/80 text-slate-600'"
            >
              {{ toolsTotalCount }}
            </span>
          </button>

          <button
            type="button"
            @click="activeTab = 'materials'"
            :class="[
              'px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 min-h-[40px] touch-manipulation',
              activeTab === 'materials'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="activeTab === 'materials' ? 'text-blue-600' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Materials List</span>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              :class="activeTab === 'materials' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200/80 text-slate-600'"
            >
              {{ unitMaterials.length }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════════ -->
    <!-- TAB 1: TOOLS & EQUIPMENT LIST -->
    <!-- ═══════════════════════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'tools'" class="space-y-6">
      <!-- Toolbar: Search, Filters, View Switcher & Add Button -->
      <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <!-- Search Bar -->
          <div class="relative flex-1 max-w-md w-full">
            <input
              v-model="toolsSearchQuery"
              @input="toolsCurrentPage = 1"
              type="text"
              :placeholder="toolsSearchPlaceholder"
              class="w-full pl-10 pr-9 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              v-if="toolsSearchQuery"
              @click="toolsSearchQuery = ''; toolsCurrentPage = 1"
              class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Controls: View Switcher + Add Button -->
          <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
            <!-- View Switcher -->
            <div class="hidden sm:inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              <button
                type="button"
                @click="toolsViewMode = 'table'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                  toolsViewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Table</span>
              </button>
              <button
                type="button"
                @click="toolsViewMode = 'cards'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                  toolsViewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Cards</span>
              </button>
            </div>

            <!-- Add Tool / Equipment Button -->
            <button
              v-if="canManage"
              @click="openAddToolModal"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer touch-manipulation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>{{ isLeau ? 'Add Plant / Tool' : 'Add Tool / Equipment' }}</span>
            </button>
          </div>
        </div>

        <!-- Filter Row 1: Stock Status Tabs -->
        <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">Availability:</span>
          <button
            type="button"
            @click="toolsAvailabilityFilter = 'all'"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', toolsAvailabilityFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            All ({{ toolsTotalCount }})
          </button>
          <button
            type="button"
            @click="toolsAvailabilityFilter = 'available'"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', toolsAvailabilityFilter === 'available' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            Available ({{ toolsAvailableCount }})
          </button>
          <button
            type="button"
            @click="toolsAvailabilityFilter = 'out_of_stock'"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', toolsAvailabilityFilter === 'out_of_stock' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            Out of Stock ({{ toolsOutOfStockCount }})
          </button>
          <button
            type="button"
            @click="toolsAvailabilityFilter = 'maintenance'"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', toolsAvailabilityFilter === 'maintenance' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            Maintenance ({{ toolsMaintenanceCount }})
          </button>
          <button
            type="button"
            @click="toolsAvailabilityFilter = 'retired'"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', toolsAvailabilityFilter === 'retired' ? 'bg-slate-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            Retired ({{ toolsRetiredCount }})
          </button>
        </div>

        <!-- Filter Row 2: Category Pills -->
        <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100/70 text-xs">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">Category:</span>
          <button
            type="button"
            @click="toolsCategoryFilter = 'all'"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', toolsCategoryFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            All Categories
          </button>
          <button
            type="button"
            v-for="cat in toolsCategories"
            :key="cat"
            @click="toolsCategoryFilter = cat"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', toolsCategoryFilter === cat ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
          </button>
        </div>
      </div>

      <!-- Tools Loading State -->
      <div v-if="toolsLoading && toolsInventoryItems.length === 0" class="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
          <svg class="animate-spin h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading {{ effectiveUnit }} tools and equipment...
        </div>
      </div>

      <!-- Tools Empty State -->
      <div v-else-if="filteredToolsInventory.length === 0" class="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-xl">
          🛠️
        </div>
        <h4 class="text-sm font-black text-slate-800">No tools or equipment match your criteria</h4>
        <p class="text-xs text-slate-400 mt-1">Try adjusting your search keyword or selected category filter.</p>
      </div>

      <!-- Tools Table View -->
      <div v-else-if="toolsViewMode === 'table'" class="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th class="px-5 py-3">Item Particulars</th>
                <th class="px-4 py-3">Category</th>
                <th class="px-4 py-3">Stock &amp; Availability</th>
                <th class="px-4 py-3">Condition</th>
                <th class="px-4 py-3">Storage Location</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="item in paginatedToolsInventory"
                :key="item.id"
                class="hover:bg-slate-50/70 transition-colors group"
              >
                <!-- Particulars -->
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                      {{ item.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="min-w-0">
                      <p class="font-black text-slate-900 text-sm leading-tight truncate">{{ item.name }}</p>
                      <p v-if="item.model" class="text-[11px] text-slate-500 font-semibold truncate mt-0.5">{{ item.model }}</p>
                      <p v-if="item.serial_number" class="text-[10px] font-mono text-slate-400 truncate">SN: {{ item.serial_number }}</p>
                    </div>
                  </div>
                </td>

                <!-- Category -->
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200/80">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {{ item.category.charAt(0).toUpperCase() + item.category.slice(1) }}
                  </span>
                </td>

                <!-- Stock Availability -->
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <div class="space-y-1 max-w-[170px]">
                    <div class="flex items-center justify-between gap-2">
                      <span class="font-black text-slate-900 text-xs">{{ item.quantity_available }} / {{ item.quantity_total }} available</span>
                      <span
                        :class="[
                          'px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0',
                          item.quantity_available > 0
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.condition_status === 'needs_repair'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : item.condition_status === 'retired'
                                ? 'bg-slate-50 text-slate-700 border-slate-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                        ]"
                      >
                        {{ getAvailabilityLabel(item) }}
                      </span>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-300"
                        :class="item.quantity_available === 0 ? 'bg-rose-500' : item.quantity_available < item.quantity_total ? 'bg-amber-500' : 'bg-emerald-500'"
                        :style="{ width: `${Math.round((item.quantity_available / Math.max(1, item.quantity_total)) * 100)}%` }"
                      ></div>
                    </div>
                  </div>
                </td>

                <!-- Condition -->
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2.5 py-1 rounded-lg text-xs font-bold border inline-flex items-center gap-1.5',
                      item.condition_status === 'excellent' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      item.condition_status === 'good' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      item.condition_status === 'fair' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      item.condition_status === 'needs_repair' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                      'bg-slate-50 text-slate-700 border-slate-200'
                    ]"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="item.condition_status === 'needs_repair' ? 'bg-rose-500' : item.condition_status === 'excellent' || item.condition_status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                    {{ item.condition_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                  </span>
                </td>

                <!-- Location -->
                <td class="px-4 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                  <span v-if="item.location" class="inline-flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                    <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ item.location }}
                  </span>
                  <span v-else class="text-slate-300 italic">—</span>
                </td>

                <!-- Actions -->
                <td class="px-5 py-3.5 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      v-if="canManage"
                      @click="openAdjustQuantityModal(item)"
                      class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                      title="Adjust available quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Qty</span>
                    </button>

                    <button
                      v-if="canManage"
                      @click="openEditToolModal(item)"
                      class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                      title="Edit item details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit</span>
                    </button>

                    <button
                      v-if="canManage && item.condition_status !== 'maintenance'"
                      @click="setToolMaintenance(item)"
                      class="p-1.5 rounded-lg border border-amber-200/80 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                      title="Mark for maintenance"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>

                    <button
                      v-if="canManage && item.condition_status === 'maintenance'"
                      @click="returnToolFromMaintenance(item)"
                      class="p-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                      title="Return from maintenance"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>

                    <button
                      v-if="canManage && item.quantity_available === item.quantity_total && item.condition_status !== 'maintenance'"
                      @click="confirmDeleteTool(item)"
                      class="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all cursor-pointer shadow-2xs active:scale-95"
                      title="Remove from inventory"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tools Cards View -->
      <div :class="['grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', toolsViewMode === 'table' ? 'md:hidden' : '']">
        <div
          v-for="item in paginatedToolsInventory"
          :key="item.id"
          class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-3 group"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200/70">
                    {{ item.category.charAt(0).toUpperCase() + item.category.slice(1) }}
                  </span>
                  <span v-if="item.location" class="text-[10px] text-slate-400 font-semibold truncate flex items-center gap-1">
                    • {{ item.location }}
                  </span>
                </div>
                <h4 class="text-sm font-black text-slate-900 leading-tight truncate">
                  {{ item.name }}
                </h4>
                <p v-if="item.model" class="text-xs text-slate-500 font-semibold truncate mt-0.5">
                  {{ item.model }}
                </p>
              </div>

              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 border',
                  item.quantity_available > 0
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : item.condition_status === 'needs_repair'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : item.condition_status === 'retired'
                        ? 'bg-slate-50 text-slate-700 border-slate-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                ]"
              >
                {{ getAvailabilityLabel(item) }}
              </span>
            </div>

            <!-- Stock Health -->
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-500 text-[11px]">Available Stock</span>
                <span class="font-black text-slate-900">{{ item.quantity_available }} of {{ item.quantity_total }} units</span>
              </div>
              <div class="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="item.quantity_available === 0 ? 'bg-rose-500' : item.quantity_available < item.quantity_total ? 'bg-amber-500' : 'bg-emerald-500'"
                  :style="{ width: `${Math.round((item.quantity_available / Math.max(1, item.quantity_total)) * 100)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5">
              <button
                v-if="canManage"
                @click="openAdjustQuantityModal(item)"
                class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
              >
                <span>Adjust Qty</span>
              </button>
              <button
                v-if="canManage"
                @click="openEditToolModal(item)"
                class="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                Edit
              </button>
            </div>

            <div class="flex items-center gap-1">
              <button
                v-if="canManage && item.condition_status !== 'maintenance'"
                @click="setToolMaintenance(item)"
                class="p-2 rounded-xl text-amber-600 hover:bg-amber-50 transition-all cursor-pointer"
                title="Mark for maintenance"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </button>
              <button
                v-if="canManage && item.quantity_available === item.quantity_total && item.condition_status !== 'maintenance'"
                @click="confirmDeleteTool(item)"
                class="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                title="Remove item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tools Pagination -->
      <div v-if="filteredToolsInventory.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
        <p class="font-medium">
          Showing <strong class="text-slate-800">{{ toolsPaginationRange.start }}</strong> to <strong class="text-slate-800">{{ toolsPaginationRange.end }}</strong> of <strong class="text-slate-800">{{ filteredToolsInventory.length }}</strong> tools/equipment
        </p>
        <div class="flex items-center gap-1.5">
          <button
            @click="toolsCurrentPage--"
            :disabled="toolsCurrentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          >
            Previous
          </button>
          <div class="px-3 py-1.5 font-bold text-slate-700">
            {{ toolsCurrentPage }} / {{ toolsTotalPages }}
          </div>
          <button
            @click="toolsCurrentPage++"
            :disabled="toolsCurrentPage === toolsTotalPages"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════════ -->
    <!-- TAB 2: MATERIALS CATALOG & STOCK LIST -->
    <!-- ═══════════════════════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'materials'" class="space-y-6">
      <!-- Toolbar: Search, Filters, View Switcher & Action Buttons -->
      <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <!-- Search Field -->
          <div class="relative flex-1 max-w-md w-full">
            <input
              v-model="materialsSearchQuery"
              @input="materialsCurrentPage = 1"
              type="text"
              placeholder="Search material description, unit, or category..."
              class="w-full pl-10 pr-9 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              v-if="materialsSearchQuery"
              @click="materialsSearchQuery = ''; materialsCurrentPage = 1"
              class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Controls: View Switcher, Add Material, Refresh -->
          <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0 flex-wrap sm:flex-nowrap">
            <!-- View Switcher -->
            <div class="hidden sm:inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              <button
                type="button"
                @click="materialsViewMode = 'table'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                  materialsViewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Table</span>
              </button>
              <button
                type="button"
                @click="materialsViewMode = 'cards'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                  materialsViewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Cards</span>
              </button>
            </div>

            <button
              v-if="canManage"
              @click="openAddMaterialModal"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer touch-manipulation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Material</span>
            </button>

            <button
              @click="handleRefreshMaterials"
              :disabled="operationsStore.isLoading"
              title="Refresh materials catalog"
              class="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" :class="{ 'animate-spin': operationsStore.isLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <!-- Material Stock Level Filter Tabs -->
        <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">Stock Status:</span>
          <button
            type="button"
            @click="materialStockFilter = 'all'"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', materialStockFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            All Materials ({{ unitMaterials.length }})
          </button>
          <button
            type="button"
            @click="materialStockFilter = 'in_stock'"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', materialStockFilter === 'in_stock' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            In Stock ({{ inStockMaterialsCount }})
          </button>
          <button
            type="button"
            @click="materialStockFilter = 'low_stock'"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', materialStockFilter === 'low_stock' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            Low Stock ({{ lowStockMaterialsCount }})
          </button>
          <button
            type="button"
            @click="materialStockFilter = 'out_of_stock'"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', materialStockFilter === 'out_of_stock' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            Out of Stock ({{ outOfStockMaterialsCount }})
          </button>
        </div>

        <!-- Material Category Filter Pills -->
        <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100/70 text-xs">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">Trade / Category:</span>
          <button
            type="button"
            @click="materialsCategoryFilter = 'all'"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', materialsCategoryFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            All Trades
          </button>
          <button
            type="button"
            v-for="cat in availableMaterialCategories"
            :key="cat"
            @click="materialsCategoryFilter = cat"
            :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', materialsCategoryFilter === cat ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Materials Empty State -->
      <div v-if="filteredMaterialsList.length === 0" class="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-xl">
          📦
        </div>
        <h4 class="text-sm font-black text-slate-800">No materials match your criteria</h4>
        <p class="text-xs text-slate-400 mt-1">Try adjusting your search keyword or selected category filter.</p>
      </div>

      <!-- Materials Table View (Desktop & Tablet) -->
      <div v-else-if="materialsViewMode === 'table'" class="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th class="py-3.5 px-4 w-12 text-center">#</th>
                <th class="py-3.5 px-5">Material / Supply Name</th>
                <th class="py-3.5 px-4">Category</th>
                <th class="py-3.5 px-4 text-center">Standard Unit</th>
                <th class="py-3.5 px-4 text-right">Default Benchmark Price</th>
                <th class="py-3.5 px-5">Available Units &amp; Stock Level</th>
                <th class="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(item, idx) in paginatedMaterialsList"
                :key="item.id || item.name"
                class="hover:bg-slate-50/70 transition-colors group"
              >
                <!-- # Index -->
                <td class="py-3.5 px-4 text-center font-bold text-slate-400 tabular-nums">
                  {{ (materialsCurrentPage - 1) * materialsPerPage + idx + 1 }}
                </td>

                <!-- Name -->
                <td class="py-3.5 px-5">
                  <div class="font-black text-slate-900 text-sm leading-tight">
                    {{ item.name }}
                  </div>
                </td>

                <!-- Category -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200/80">
                    {{ item.category || 'General' }}
                  </span>
                </td>

                <!-- Standard Unit -->
                <td class="py-3.5 px-4 text-center font-bold text-slate-600">
                  <span class="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 font-mono text-xs">
                    {{ item.unit || 'pcs' }}
                  </span>
                </td>

                <!-- Benchmark Price -->
                <td class="py-3.5 px-4 text-right font-black text-slate-900 tabular-nums text-xs sm:text-sm">
                  ₱{{ Number(item.default_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </td>

                <!-- Available Units & Stock Progress Bar (Key Capstone Requirement) -->
                <td class="py-3.5 px-5 whitespace-nowrap">
                  <div class="space-y-1.5 max-w-[200px]">
                    <div class="flex items-center justify-between gap-2">
                      <span class="font-black text-slate-900 text-xs tabular-nums">
                        {{ getMaterialAvailableQty(item) }} / {{ getMaterialTotalQty(item) }} {{ item.unit || 'units' }}
                      </span>
                      <span
                        :class="[
                          'px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0',
                          getMaterialAvailableQty(item) > 10
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : getMaterialAvailableQty(item) > 0
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                        ]"
                      >
                        {{ getMaterialStockLabel(item) }}
                      </span>
                    </div>

                    <!-- Mini Stock Progress Bar -->
                    <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-300"
                        :class="getMaterialAvailableQty(item) === 0 ? 'bg-rose-500' : getMaterialAvailableQty(item) <= 10 ? 'bg-amber-500' : 'bg-emerald-500'"
                        :style="{ width: `${Math.min(100, Math.round((getMaterialAvailableQty(item) / Math.max(1, getMaterialTotalQty(item))) * 100))}%` }"
                      ></div>
                    </div>
                  </div>
                </td>

                <!-- Actions -->
                <td class="py-3.5 px-5 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      v-if="canManage"
                      @click="openAdjustMaterialQtyModal(item)"
                      class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-800 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                      title="Adjust available quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Adjust Qty</span>
                    </button>

                    <button
                      v-if="canManage"
                      @click="openEditMaterialModal(item)"
                      class="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Material"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    <button
                      v-if="canManage"
                      @click="handleDeleteMaterialItem(item)"
                      class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Material"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Materials Cards View (Mobile-responsive) -->
      <div :class="['grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', materialsViewMode === 'table' ? 'md:hidden' : '']">
        <div
          v-for="(item, idx) in paginatedMaterialsList"
          :key="item.id || item.name"
          class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-3 group"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">
                  #{{ (materialsCurrentPage - 1) * materialsPerPage + idx + 1 }} • {{ item.category || 'General' }}
                </span>
                <h4 class="font-black text-sm sm:text-base text-slate-900 leading-snug">
                  {{ item.name }}
                </h4>
                <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span class="text-xs font-semibold text-slate-500">
                    Unit: <strong class="text-slate-700 font-mono">{{ item.unit || 'pcs' }}</strong>
                  </span>
                  <span class="text-xs font-semibold text-slate-500">•</span>
                  <span class="text-xs font-black text-slate-900 tabular-nums">
                    ₱{{ Number(item.default_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </span>
                </div>
              </div>

              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0',
                  getMaterialAvailableQty(item) > 10
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : getMaterialAvailableQty(item) > 0
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                ]"
              >
                {{ getMaterialStockLabel(item) }}
              </span>
            </div>

            <!-- Stock Progress Level -->
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-500 text-[11px]">Available Stock</span>
                <span class="font-black text-slate-900 tabular-nums">
                  {{ getMaterialAvailableQty(item) }} / {{ getMaterialTotalQty(item) }} {{ item.unit || 'units' }}
                </span>
              </div>
              <div class="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="getMaterialAvailableQty(item) === 0 ? 'bg-rose-500' : getMaterialAvailableQty(item) <= 10 ? 'bg-amber-500' : 'bg-emerald-500'"
                  :style="{ width: `${Math.min(100, Math.round((getMaterialAvailableQty(item) / Math.max(1, getMaterialTotalQty(item))) * 100))}%` }"
                ></div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              v-if="canManage"
              @click="openAdjustMaterialQtyModal(item)"
              class="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-black transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
            >
              <span>Adjust Qty</span>
            </button>

            <div class="flex items-center gap-1">
              <button
                v-if="canManage"
                @click="openEditMaterialModal(item)"
                class="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                Edit
              </button>
              <button
                v-if="canManage"
                @click="handleDeleteMaterialItem(item)"
                class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Materials Pagination -->
      <div v-if="filteredMaterialsList.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
        <div class="flex items-center gap-2">
          <span class="font-medium text-slate-600">Rows per page:</span>
          <select
            v-model.number="materialsPerPage"
            @change="materialsCurrentPage = 1"
            class="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer min-h-[38px]"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-slate-600 ml-2">
            Showing <strong class="text-slate-900">{{ ((materialsCurrentPage - 1) * materialsPerPage) + 1 }}</strong> to
            <strong class="text-slate-900">{{ Math.min(materialsCurrentPage * materialsPerPage, filteredMaterialsList.length) }}</strong> of
            <strong class="text-slate-900">{{ filteredMaterialsList.length }}</strong> materials
          </span>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            @click="materialsCurrentPage--"
            :disabled="materialsCurrentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          >
            Previous
          </button>
          <div class="px-3 py-1.5 font-bold text-slate-700">
            {{ materialsCurrentPage }} / {{ materialsTotalPages }}
          </div>
          <button
            @click="materialsCurrentPage++"
            :disabled="materialsCurrentPage === materialsTotalPages"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════════ -->
    <!-- MODALS SECTION -->
    <!-- ═══════════════════════════════════════════════════════════════════════════ -->

    <!-- Modal 1: Add Tool / Equipment -->
    <Teleport to="body">
      <div v-if="showAddToolModal" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div class="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-8 shadow-2xl border border-slate-100 my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
          <div class="flex items-center justify-between mb-5">
            <div>
              <span class="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                {{ effectiveUnit }} Tools &amp; Assets
              </span>
              <h3 class="text-xl font-black text-slate-900 mt-1">Add Tool or Equipment</h3>
            </div>
            <button @click="showAddToolModal = false" class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitAddTool" class="space-y-4">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Item Name *</label>
              <input
                v-model="addToolForm.name"
                required
                :placeholder="isLeau ? 'e.g. Brush Cutter STIHL FS 240, Hand Shears, Bougainvillea' : 'e.g. Cordless Impact Drill, Heavy Duty Ladder, Pipe Wrench'"
                class="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category *</label>
                <select
                  v-model="addToolForm.category"
                  required
                  class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer bg-white"
                >
                  <option v-for="cat in toolsCategoryOptions" :key="cat.value" :value="cat.value">
                    {{ cat.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Quantity *</label>
                <input
                  v-model.number="addToolForm.quantity_total"
                  type="number"
                  min="1"
                  required
                  class="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Model / Specification</label>
                <input
                  v-model="addToolForm.model"
                  placeholder="e.g. Bosch GSB 18V-50"
                  class="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Serial Number (Optional)</label>
                <input
                  v-model="addToolForm.serial_number"
                  placeholder="e.g. SN-9821-X"
                  class="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Storage Location</label>
              <input
                v-model="addToolForm.location"
                placeholder="e.g. Tool Room A, Mechanical Workshop, General Storage"
                class="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-5">
              <button
                type="button"
                @click="showAddToolModal = false"
                class="px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submittingTool"
                class="px-6 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {{ submittingTool ? 'Adding...' : 'Save Tool / Equipment' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 2: Edit Tool / Equipment -->
    <Teleport to="body">
      <div v-if="showEditToolModal && editingToolItem" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div class="bg-white rounded-3xl w-full max-w-md p-5 sm:p-8 shadow-2xl border border-slate-100 my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
          <div class="flex items-center justify-between mb-5">
            <div>
              <span class="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                Edit Item
              </span>
              <h3 class="text-xl font-black text-slate-900 mt-1">Edit Tool Details</h3>
            </div>
            <button @click="showEditToolModal = false" class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitEditTool" class="space-y-4">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Item Name *</label>
              <input v-model="editToolForm.name" required class="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category *</label>
              <select v-model="editToolForm.category" required class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer bg-white">
                <option v-for="cat in toolsCategoryOptions" :key="cat.value" :value="cat.value">
                  {{ cat.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Model / Specification</label>
              <input v-model="editToolForm.model" class="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Serial Number</label>
              <input v-model="editToolForm.serial_number" class="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Condition *</label>
              <select v-model="editToolForm.condition_status" required class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer bg-white">
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="needs_repair">Needs Repair</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Storage Location</label>
              <input v-model="editToolForm.location" class="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-5">
              <button type="button" @click="showEditToolModal = false" class="px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" :disabled="submittingToolEdit" class="px-6 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer">
                {{ submittingToolEdit ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 3: Adjust Quantity for Tool / Equipment -->
    <Teleport to="body">
      <div v-if="showAdjustToolQtyModal && adjustingToolItem" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div class="bg-white rounded-3xl w-full max-w-md p-5 sm:p-8 shadow-2xl border border-slate-100 my-auto">
          <div class="flex items-center justify-between mb-5">
            <div>
              <span class="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Tool Stock Level
              </span>
              <h3 class="text-xl font-black text-slate-900 mt-1">Adjust Tool Available Qty</h3>
            </div>
            <button @click="showAdjustToolQtyModal = false" class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="space-y-4">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Item</span>
                <span class="font-bold text-slate-900">{{ adjustingToolItem.name }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Total Quantity</span>
                <span class="font-bold text-slate-900">{{ adjustingToolItem.quantity_total }} units</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Currently Available</span>
                <span class="font-bold text-emerald-700">{{ adjustingToolItem.quantity_available }} units</span>
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">New Available Quantity *</label>
              <input
                v-model.number="adjustToolQtyForm.new_quantity"
                type="number"
                min="0"
                :max="adjustingToolItem.quantity_total"
                required
                class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-lg font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
              />
              <p class="text-[11px] text-slate-400 font-medium mt-1 text-center">Must be between 0 and {{ adjustingToolItem.quantity_total }}</p>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-5">
              <button type="button" @click="showAdjustToolQtyModal = false" class="px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button @click="submitAdjustToolQty" :disabled="submittingToolAdjust" class="px-6 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer">
                {{ submittingToolAdjust ? 'Saving...' : 'Update Quantity' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal 4: Add New Material (with Quantity Available & Total) -->
    <Teleport to="body">
      <div v-if="showAddMaterialModal" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div class="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-8 shadow-2xl border border-slate-100 my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
          <div class="flex items-center justify-between mb-5">
            <div>
              <span class="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                {{ effectiveUnit }} Materials Catalog
              </span>
              <h3 class="text-xl font-black text-slate-900 mt-1">Add New Material</h3>
            </div>
            <button @click="showAddMaterialModal = false" class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitAddMaterial" class="space-y-4">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Material Name *</label>
              <input
                v-model="materialForm.name"
                required
                :placeholder="isLeau ? 'e.g. 2T Engine Oil, Nylon Trimmer Line 3.0mm, Vermicast' : 'e.g. PVC Pipe 1/2 inch, LED Bulb 18W, Marine Plywood 1/4'"
                class="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category / Trade *</label>
                <input
                  v-model="materialForm.category"
                  required
                  :placeholder="isLeau ? 'e.g. Grounds Maintenance, Soil & Fertilizers' : 'e.g. Plumbing, Electrical, Carpentry'"
                  class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Standard Unit *</label>
                <select
                  v-model="materialForm.unit"
                  required
                  class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                >
                  <option value="pcs">pcs</option>
                  <option value="lengths">lengths</option>
                  <option value="meters">meters</option>
                  <option value="liters">liters</option>
                  <option value="kg">kg</option>
                  <option value="rolls">rolls</option>
                  <option value="sets">sets</option>
                  <option value="bags">bags</option>
                  <option value="cans">cans</option>
                  <option value="pairs">pairs</option>
                  <option value="boxes">boxes</option>
                  <option value="units">units</option>
                  <option value="sheets">sheets</option>
                  <option value="gallons">gallons</option>
                  <option value="sq.ft.">sq.ft.</option>
                  <option value="packs">packs</option>
                  <option value="tubes">tubes</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Benchmark Price (₱)</label>
                <input
                  v-model.number="materialForm.default_price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Available Units *</label>
                <input
                  v-model.number="materialForm.quantity_available"
                  type="number"
                  min="0"
                  required
                  placeholder="50"
                  class="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Stock Limit *</label>
                <input
                  v-model.number="materialForm.quantity_total"
                  type="number"
                  min="1"
                  required
                  placeholder="50"
                  class="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-5">
              <button
                type="button"
                @click="showAddMaterialModal = false"
                class="px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="operationsStore.isSaving"
                class="px-6 py-2.5 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {{ operationsStore.isSaving ? 'Saving...' : 'Add Material to Inventory' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 5: Edit Material -->
    <Teleport to="body">
      <div v-if="showEditMaterialModal && editingMaterialItem" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div class="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-8 shadow-2xl border border-slate-100 my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
          <div class="flex items-center justify-between mb-5">
            <div>
              <span class="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                Edit Material
              </span>
              <h3 class="text-xl font-black text-slate-900 mt-1">Edit Material Item</h3>
            </div>
            <button @click="showEditMaterialModal = false" class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitEditMaterial" class="space-y-4">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Material Name *</label>
              <input v-model="materialForm.name" required class="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category / Trade *</label>
                <input v-model="materialForm.category" required class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Standard Unit *</label>
                <select v-model="materialForm.unit" required class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white">
                  <option value="pcs">pcs</option>
                  <option value="lengths">lengths</option>
                  <option value="meters">meters</option>
                  <option value="liters">liters</option>
                  <option value="kg">kg</option>
                  <option value="rolls">rolls</option>
                  <option value="sets">sets</option>
                  <option value="bags">bags</option>
                  <option value="cans">cans</option>
                  <option value="pairs">pairs</option>
                  <option value="boxes">boxes</option>
                  <option value="units">units</option>
                  <option value="sheets">sheets</option>
                  <option value="gallons">gallons</option>
                  <option value="sq.ft.">sq.ft.</option>
                  <option value="packs">packs</option>
                  <option value="tubes">tubes</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Benchmark Price (₱)</label>
                <input
                  v-model.number="materialForm.default_price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Available Units *</label>
                <input
                  v-model.number="materialForm.quantity_available"
                  type="number"
                  min="0"
                  required
                  class="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Stock Limit *</label>
                <input
                  v-model.number="materialForm.quantity_total"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-5">
              <button type="button" @click="showEditMaterialModal = false" class="px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" :disabled="operationsStore.isSaving" class="px-6 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer">
                {{ operationsStore.isSaving ? 'Updating...' : 'Update Material' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 6: Adjust Available Quantity for Material Item -->
    <Teleport to="body">
      <div v-if="showAdjustMaterialQtyModal && adjustingMaterialItem" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div class="bg-white rounded-3xl w-full max-w-md p-5 sm:p-8 shadow-2xl border border-slate-100 my-auto">
          <div class="flex items-center justify-between mb-5">
            <div>
              <span class="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                Material Stock Take
              </span>
              <h3 class="text-xl font-black text-slate-900 mt-1">Adjust Material Stock</h3>
            </div>
            <button @click="showAdjustMaterialQtyModal = false" class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="space-y-4">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Material</span>
                <span class="font-bold text-slate-900">{{ adjustingMaterialItem.name }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Standard Unit</span>
                <span class="font-bold text-slate-700 font-mono">{{ adjustingMaterialItem.unit || 'pcs' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Total Stock Limit</span>
                <span class="font-bold text-slate-900">{{ getMaterialTotalQty(adjustingMaterialItem) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Current Available</span>
                <span class="font-bold text-blue-700">{{ getMaterialAvailableQty(adjustingMaterialItem) }}</span>
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                New Available Units in Stock ({{ adjustingMaterialItem.unit || 'pcs' }}) *
              </label>
              <input
                v-model.number="adjustMaterialQtyForm.new_quantity"
                type="number"
                min="0"
                required
                class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-xl font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
              <p class="text-[11px] text-slate-400 font-medium mt-1 text-center">
                Enter the updated physical count available for dispatch.
              </p>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-5">
              <button type="button" @click="showAdjustMaterialQtyModal = false" class="px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button @click="submitAdjustMaterialQty" :disabled="operationsStore.isSaving" class="px-6 py-2.5 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer">
                {{ operationsStore.isSaving ? 'Updating...' : 'Update Stock' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useOperationsHubStore } from '@/stores/operationsHub';
import { toast } from 'vue3-toastify';
import Swal from 'sweetalert2';
import {
  listInventory,
  createInventoryItem,
  updateInventoryItem,
  adjustInventoryQuantity,
  deleteInventoryItem,
} from '@/api/inventory';

const props = defineProps({
  unitCode: {
    type: String,
    default: '',
  },
  embedded: {
    type: Boolean,
    default: false,
  },
  defaultTab: {
    type: String,
    default: 'tools',
  },
});

const route = useRoute();
const authStore = useAuthStore();
const operationsStore = useOperationsHubStore();

// Effective unit detection
const effectiveUnit = computed(() => {
  if (props.unitCode) return props.unitCode.toUpperCase();
  const path = route.path.toLowerCase();
  if (path.includes('/leau')) return 'LEAU';
  if (path.includes('/fgmu')) return 'FGMU';
  const userUnit = authStore.user?.unit_code || '';
  if (userUnit) return userUnit.toUpperCase();
  return 'FGMU';
});

const isLeau = computed(() => effectiveUnit.value === 'LEAU');
const unitLower = computed(() => effectiveUnit.value.toLowerCase());
const unitTitle = computed(() =>
  isLeau.value
    ? 'Landscaping & Environmental Action Unit (LEAU)'
    : 'Facilities & Grounds Management Unit (FGMU)'
);

const canManage = computed(() => {
  const role = (authStore.role || authStore.user?.role || '').toLowerCase();
  return ['admin', 'staff', 'superadmin', 'director'].includes(role);
});

// Primary Tab: 'tools' or 'materials'
const activeTab = ref(props.defaultTab === 'materials' ? 'materials' : 'tools');

// Sync tab with route query ?tab=
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab === 'materials' || newTab === 'tools') {
      activeTab.value = newTab;
    }
  },
  { immediate: true }
);

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1: TOOLS & EQUIPMENT STATE & LOGIC
// ─────────────────────────────────────────────────────────────────────────────
const toolsSearchQuery = ref('');
const toolsAvailabilityFilter = ref('all');
const toolsCategoryFilter = ref('all');
const toolsInventoryItems = ref([]);
const toolsLoading = ref(false);
const toolsViewMode = ref('table');

const toolsCategories = computed(() =>
  isLeau.value
    ? ['tools', 'equipment', 'plants', 'others']
    : ['tools', 'equipment', 'others']
);

const toolsCategoryOptions = computed(() => {
  if (isLeau.value) {
    return [
      { value: 'tools', label: 'Tools' },
      { value: 'equipment', label: 'Equipment' },
      { value: 'plants', label: 'Plants' },
      { value: 'others', label: 'Others' },
    ];
  }
  return [
    { value: 'tools', label: 'Tools' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'others', label: 'Others' },
  ];
});

const toolsSearchPlaceholder = computed(() =>
  isLeau.value
    ? 'Search tools, equipment, or plants by name, model, serial, or location...'
    : 'Search tools & equipment by name, model, serial, or location...'
);

const toolsTotalCount = computed(() => toolsInventoryItems.value.length);
const toolsAvailableCount = computed(() =>
  toolsInventoryItems.value.filter(
    (i) => i.quantity_available > 0 && i.condition_status !== 'retired' && i.condition_status !== 'needs_repair'
  ).length
);
const toolsOutOfStockCount = computed(() =>
  toolsInventoryItems.value.filter(
    (i) => i.quantity_available === 0 && i.condition_status !== 'retired' && i.condition_status !== 'needs_repair'
  ).length
);
const toolsMaintenanceCount = computed(() =>
  toolsInventoryItems.value.filter((i) => i.condition_status === 'needs_repair').length
);
const toolsRetiredCount = computed(() =>
  toolsInventoryItems.value.filter((i) => i.condition_status === 'retired').length
);

const filteredToolsInventory = computed(() => {
  let list = toolsInventoryItems.value;

  if (toolsAvailabilityFilter.value !== 'all') {
    switch (toolsAvailabilityFilter.value) {
      case 'available':
        list = list.filter(
          (i) => i.quantity_available > 0 && i.condition_status !== 'retired' && i.condition_status !== 'needs_repair'
        );
        break;
      case 'out_of_stock':
        list = list.filter(
          (i) => i.quantity_available === 0 && i.condition_status !== 'retired' && i.condition_status !== 'needs_repair'
        );
        break;
      case 'maintenance':
        list = list.filter((i) => i.condition_status === 'needs_repair');
        break;
      case 'retired':
        list = list.filter((i) => i.condition_status === 'retired');
        break;
    }
  }

  if (toolsCategoryFilter.value !== 'all') {
    list = list.filter((i) => i.category === toolsCategoryFilter.value);
  }

  if (toolsSearchQuery.value.trim()) {
    const q = toolsSearchQuery.value.toLowerCase().trim();
    list = list.filter(
      (i) =>
        String(i.name || '').toLowerCase().includes(q) ||
        String(i.model || '').toLowerCase().includes(q) ||
        String(i.serial_number || '').toLowerCase().includes(q) ||
        String(i.location || '').toLowerCase().includes(q) ||
        String(i.description || '').toLowerCase().includes(q)
    );
  }

  return list;
});

const toolsCurrentPage = ref(1);
const toolsPerPage = computed(() => (toolsViewMode.value === 'table' ? 15 : 12));
const toolsTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredToolsInventory.value.length / toolsPerPage.value))
);

const paginatedToolsInventory = computed(() => {
  const start = (toolsCurrentPage.value - 1) * toolsPerPage.value;
  return filteredToolsInventory.value.slice(start, start + toolsPerPage.value);
});

const toolsPaginationRange = computed(() => {
  if (filteredToolsInventory.value.length === 0) return { start: 0, end: 0 };
  const start = (toolsCurrentPage.value - 1) * toolsPerPage.value + 1;
  const end = Math.min(toolsCurrentPage.value * toolsPerPage.value, filteredToolsInventory.value.length);
  return { start, end };
});

const getAvailabilityLabel = (item) => {
  if (item.condition_status === 'retired') return 'Retired';
  if (item.condition_status === 'needs_repair') return 'Maintenance';
  if (item.quantity_available === 0) return 'Out of Stock';
  if (item.quantity_available < item.quantity_total) return 'Partial';
  return 'Available';
};

const fetchToolsInventory = async () => {
  toolsLoading.value = true;
  try {
    const res = await listInventory({ unit: unitLower.value, per_page: 500 });
    toolsInventoryItems.value = res.data?.data?.items ?? [];
  } catch (err) {
    console.error('Failed to load inventory tools:', err);
  } finally {
    toolsLoading.value = false;
  }
};

// Tools Modals
const showAddToolModal = ref(false);
const submittingTool = ref(false);
const addToolForm = reactive({
  name: '',
  model: '',
  category: isLeau.value ? 'tools' : 'tools',
  serial_number: '',
  quantity_total: 1,
  condition_status: 'good',
  location: '',
  description: '',
});

const openAddToolModal = () => {
  addToolForm.name = '';
  addToolForm.model = '';
  addToolForm.category = isLeau.value ? 'tools' : 'tools';
  addToolForm.serial_number = '';
  addToolForm.quantity_total = 1;
  addToolForm.condition_status = 'good';
  addToolForm.location = '';
  addToolForm.description = '';
  showAddToolModal.value = true;
};

const submitAddTool = async () => {
  if (!addToolForm.name || !addToolForm.category) {
    toast.error('Item name and category are required.');
    return;
  }
  submittingTool.value = true;
  try {
    const payload = {
      ...addToolForm,
      unit: unitLower.value,
      condition_status: addToolForm.condition_status || 'good',
      quantity_total: Math.max(1, Number(addToolForm.quantity_total) || 1),
    };
    await createInventoryItem(payload);
    toast.success('Tool / equipment item added successfully!');
    showAddToolModal.value = false;
    await fetchToolsInventory();
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to add item.');
  } finally {
    submittingTool.value = false;
  }
};

const showEditToolModal = ref(false);
const editingToolItem = ref(null);
const submittingToolEdit = ref(false);
const editToolForm = reactive({
  name: '',
  model: '',
  category: 'tools',
  serial_number: '',
  condition_status: 'good',
  location: '',
  description: '',
});

const openEditToolModal = (item) => {
  editingToolItem.value = item;
  editToolForm.name = item.name;
  editToolForm.model = item.model || '';
  editToolForm.category = item.category || 'tools';
  editToolForm.serial_number = item.serial_number || '';
  editToolForm.condition_status = item.condition_status || 'good';
  editToolForm.location = item.location || '';
  editToolForm.description = item.description || '';
  showEditToolModal.value = true;
};

const submitEditTool = async () => {
  if (!editingToolItem.value || !editToolForm.name) {
    toast.error('Item name is required.');
    return;
  }
  submittingToolEdit.value = true;
  try {
    await updateInventoryItem(editingToolItem.value.id, {
      ...editToolForm,
      unit: unitLower.value,
    });
    toast.success('Tool details updated successfully!');
    showEditToolModal.value = false;
    await fetchToolsInventory();
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to update item.');
  } finally {
    submittingToolEdit.value = false;
  }
};

const showAdjustToolQtyModal = ref(false);
const adjustingToolItem = ref(null);
const submittingToolAdjust = ref(false);
const adjustToolQtyForm = reactive({
  new_quantity: 0,
});

const openAdjustQuantityModal = (item) => {
  adjustingToolItem.value = item;
  adjustToolQtyForm.new_quantity = item.quantity_available;
  showAdjustToolQtyModal.value = true;
};

const submitAdjustToolQty = async () => {
  if (
    adjustToolQtyForm.new_quantity === undefined ||
    adjustToolQtyForm.new_quantity < 0 ||
    adjustToolQtyForm.new_quantity > adjustingToolItem.value.quantity_total
  ) {
    toast.error('Invalid quantity. Must be between 0 and total quantity.');
    return;
  }
  submittingToolAdjust.value = true;
  try {
    await adjustInventoryQuantity(adjustingToolItem.value.id, adjustToolQtyForm.new_quantity);
    toast.success('Tool quantity adjusted successfully!');
    showAdjustToolQtyModal.value = false;
    await fetchToolsInventory();
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to adjust quantity.');
  } finally {
    submittingToolAdjust.value = false;
  }
};

const setToolMaintenance = async (item) => {
  try {
    await updateInventoryItem(item.id, { condition_status: 'needs_repair' });
    toast.success(`${item.name} marked for maintenance.`);
    await fetchToolsInventory();
  } catch (err) {
    toast.error('Failed to set maintenance status.');
  }
};

const returnToolFromMaintenance = async (item) => {
  try {
    await updateInventoryItem(item.id, { condition_status: 'good' });
    toast.success(`${item.name} returned to service.`);
    await fetchToolsInventory();
  } catch (err) {
    toast.error('Failed to return item from maintenance.');
  }
};

const confirmDeleteTool = async (item) => {
  const result = await Swal.fire({
    title: 'Remove Tool from Inventory?',
    html: `Are you sure you want to remove <strong>${item.name}</strong> from the ${effectiveUnit.value} inventory?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, Remove',
    cancelButtonText: 'Cancel',
  });
  if (result.isConfirmed) {
    try {
      await deleteInventoryItem(item.id);
      toast.success(`${item.name} removed from inventory.`);
      await fetchToolsInventory();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to remove item.');
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2: MATERIALS CATALOG & QUANTITIES STATE & LOGIC
// ─────────────────────────────────────────────────────────────────────────────
const materialsSearchQuery = ref('');
const materialStockFilter = ref('all');
const materialsCategoryFilter = ref('all');
const materialsViewMode = ref('table');

const unitMaterials = computed(() => {
  return operationsStore.materialsByUnit(effectiveUnit.value);
});

const availableMaterialCategories = computed(() => {
  return operationsStore.categoriesByUnit(effectiveUnit.value);
});

const getMaterialAvailableQty = (item) => {
  if (item.quantity_available !== undefined && item.quantity_available !== null) {
    return Number(item.quantity_available);
  }
  return 50;
};

const getMaterialTotalQty = (item) => {
  if (item.quantity_total !== undefined && item.quantity_total !== null) {
    return Number(item.quantity_total);
  }
  return Math.max(50, getMaterialAvailableQty(item));
};

const getMaterialStockLabel = (item) => {
  const qty = getMaterialAvailableQty(item);
  if (qty === 0) return 'Out of Stock';
  if (qty <= 10) return 'Low Stock';
  return 'In Stock';
};

const totalMaterialAvailableUnits = computed(() => {
  return unitMaterials.value.reduce((acc, m) => acc + getMaterialAvailableQty(m), 0);
});

const inStockMaterialsCount = computed(() => {
  return unitMaterials.value.filter((m) => getMaterialAvailableQty(m) > 10).length;
});

const lowStockMaterialsCount = computed(() => {
  return unitMaterials.value.filter((m) => {
    const q = getMaterialAvailableQty(m);
    return q > 0 && q <= 10;
  }).length;
});

const outOfStockMaterialsCount = computed(() => {
  return unitMaterials.value.filter((m) => getMaterialAvailableQty(m) === 0).length;
});

const filteredMaterialsList = computed(() => {
  let list = unitMaterials.value;

  if (materialStockFilter.value !== 'all') {
    switch (materialStockFilter.value) {
      case 'in_stock':
        list = list.filter((m) => getMaterialAvailableQty(m) > 10);
        break;
      case 'low_stock':
        list = list.filter((m) => {
          const q = getMaterialAvailableQty(m);
          return q > 0 && q <= 10;
        });
        break;
      case 'out_of_stock':
        list = list.filter((m) => getMaterialAvailableQty(m) === 0);
        break;
    }
  }

  if (materialsCategoryFilter.value !== 'all') {
    list = list.filter(
      (m) => String(m.category || '').toLowerCase() === materialsCategoryFilter.value.toLowerCase()
    );
  }

  if (materialsSearchQuery.value.trim()) {
    const q = materialsSearchQuery.value.toLowerCase().trim();
    list = list.filter(
      (m) =>
        String(m.name || '').toLowerCase().includes(q) ||
        String(m.unit || '').toLowerCase().includes(q) ||
        String(m.category || '').toLowerCase().includes(q)
    );
  }

  return list;
});

const materialsCurrentPage = ref(1);
const materialsPerPage = ref(15);
const materialsTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredMaterialsList.value.length / materialsPerPage.value))
);

const paginatedMaterialsList = computed(() => {
  const start = (materialsCurrentPage.value - 1) * materialsPerPage.value;
  return filteredMaterialsList.value.slice(start, start + materialsPerPage.value);
});

// Materials Modals
const showAddMaterialModal = ref(false);
const showEditMaterialModal = ref(false);
const editingMaterialItem = ref(null);
const materialForm = reactive({
  name: '',
  category: 'General',
  unit: 'pcs',
  default_price: 0,
  quantity_available: 50,
  quantity_total: 50,
});

const openAddMaterialModal = () => {
  editingMaterialItem.value = null;
  materialForm.name = '';
  materialForm.category = isLeau.value ? 'Grounds Maintenance' : 'General';
  materialForm.unit = 'pcs';
  materialForm.default_price = 0;
  materialForm.quantity_available = 50;
  materialForm.quantity_total = 50;
  showAddMaterialModal.value = true;
};

const openEditMaterialModal = (item) => {
  editingMaterialItem.value = item;
  materialForm.name = item.name || '';
  materialForm.category = item.category || 'General';
  materialForm.unit = item.unit || 'pcs';
  materialForm.default_price = Number(item.default_price || 0);
  materialForm.quantity_available = getMaterialAvailableQty(item);
  materialForm.quantity_total = getMaterialTotalQty(item);
  showEditMaterialModal.value = true;
};

const submitAddMaterial = async () => {
  if (!materialForm.name.trim()) {
    toast.error('Material name is required.');
    return;
  }
  const payload = {
    unit_code: effectiveUnit.value,
    category: materialForm.category.trim() || 'General',
    name: materialForm.name.trim(),
    unit: materialForm.unit,
    default_price: Number(materialForm.default_price || 0),
    quantity_available: Math.max(0, Number(materialForm.quantity_available || 0)),
    quantity_total: Math.max(1, Number(materialForm.quantity_total || 50)),
    is_active: 1,
  };
  const res = await operationsStore.saveMaterial(payload);
  if (res.success) {
    toast.success(res.message || 'Material added to library.');
    showAddMaterialModal.value = false;
  } else {
    toast.error(res.message || 'Failed to add material.');
  }
};

const submitEditMaterial = async () => {
  if (!editingMaterialItem.value || !materialForm.name.trim()) {
    toast.error('Material name is required.');
    return;
  }
  const payload = {
    unit_code: effectiveUnit.value,
    category: materialForm.category.trim() || 'General',
    name: materialForm.name.trim(),
    unit: materialForm.unit,
    default_price: Number(materialForm.default_price || 0),
    quantity_available: Math.max(0, Number(materialForm.quantity_available || 0)),
    quantity_total: Math.max(1, Number(materialForm.quantity_total || 50)),
  };
  const res = await operationsStore.updateMaterial(editingMaterialItem.value.id, payload);
  if (res.success) {
    toast.success(res.message || 'Material updated successfully.');
    showEditMaterialModal.value = false;
  } else {
    toast.error(res.message || 'Failed to update material.');
  }
};

// Material Adjust Qty Modal
const showAdjustMaterialQtyModal = ref(false);
const adjustingMaterialItem = ref(null);
const adjustMaterialQtyForm = reactive({
  new_quantity: 0,
});

const openAdjustMaterialQtyModal = (item) => {
  adjustingMaterialItem.value = item;
  adjustMaterialQtyForm.new_quantity = getMaterialAvailableQty(item);
  showAdjustMaterialQtyModal.value = true;
};

const submitAdjustMaterialQty = async () => {
  if (adjustMaterialQtyForm.new_quantity < 0) {
    toast.error('Available quantity cannot be negative.');
    return;
  }
  const total = getMaterialTotalQty(adjustingMaterialItem.value);
  const newTotal = Math.max(total, adjustMaterialQtyForm.new_quantity);
  const res = await operationsStore.adjustMaterialQuantity(
    adjustingMaterialItem.value.id,
    adjustMaterialQtyForm.new_quantity,
    newTotal
  );
  if (res.success) {
    toast.success(res.message || 'Material stock updated successfully.');
    showAdjustMaterialQtyModal.value = false;
  } else {
    toast.error(res.message || 'Failed to update stock.');
  }
};

const handleDeleteMaterialItem = async (item) => {
  const result = await Swal.fire({
    title: 'Delete Material?',
    html: `Are you sure you want to remove <strong>${item.name}</strong> from the ${effectiveUnit.value} catalog?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
  });
  if (result.isConfirmed) {
    const res = await operationsStore.deleteMaterial(item.id);
    if (res.success) {
      toast.success(res.message || 'Material deleted.');
    } else {
      toast.error(res.message || 'Failed to delete material.');
    }
  }
};

const handleRefreshMaterials = async () => {
  try {
    await operationsStore.fetchMaterials(effectiveUnit.value);
    toast.info(`Refreshed ${effectiveUnit.value} materials catalog.`);
  } catch (err) {
    console.error('Failed to refresh materials:', err);
  }
};

onMounted(async () => {
  await Promise.all([
    fetchToolsInventory(),
    operationsStore.initOperationsHub(),
    operationsStore.fetchMaterials(effectiveUnit.value),
  ]);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>

