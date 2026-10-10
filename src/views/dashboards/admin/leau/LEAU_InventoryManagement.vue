<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
        Inventory Management
      </h2>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in pb-12 px-3 sm:px-8 py-4 sm:py-6 max-w-[1600px] mx-auto min-h-screen">

        <!-- Top Toolbar: Search, View Switcher, Actions & Filters -->
        <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4 min-w-0">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <!-- Search bar -->
            <div class="relative flex-1 max-w-md w-full">
              <input
                v-model="searchQuery"
                @input="currentPage = 1"
                type="text"
                placeholder="Search inventory by name, model, serial, or location..."
                class="w-full pl-10 pr-9 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-slate-50/50"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                v-if="searchQuery"
                @click="searchQuery = ''; currentPage = 1"
                class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Action Controls: View Switcher + Add Inventory -->
            <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
              <!-- View Switcher -->
              <div class="hidden sm:inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  @click="viewMode = 'table'"
                  :class="[
                    'px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                    viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  ]"
                  title="Table View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  @click="viewMode = 'cards'"
                  :class="[
                    'px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                    viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  ]"
                  title="Cards View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Cards</span>
                </button>
              </div>

              <!-- Add Inventory Button -->
              <button
                v-if="isAdmin"
                @click="openAddModal"
                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all shadow-xs shadow-amber-200 active:scale-95 cursor-pointer touch-manipulation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="truncate">Add Inventory Item</span>
              </button>
            </div>
          </div>

          <!-- Status & Category Filters (Non-overflowing wrapped layout) -->
          <div class="pt-3 border-t border-slate-100 space-y-3 min-w-0">
            <!-- Row 1: Stock Status Filter Tabs -->
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">Stock Status:</span>
              <button
                type="button"
                @click="availabilityFilter = 'all'"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', availabilityFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                All ({{ totalCount }})
              </button>
              <button
                type="button"
                @click="availabilityFilter = 'available'"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', availabilityFilter === 'available' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                Available ({{ availableCount }})
              </button>
              <button
                type="button"
                @click="availabilityFilter = 'out_of_stock'"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', availabilityFilter === 'out_of_stock' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                Out of Stock ({{ outOfStockCount }})
              </button>
              <button
                type="button"
                @click="availabilityFilter = 'maintenance'"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', availabilityFilter === 'maintenance' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                Maintenance ({{ maintenanceCount }})
              </button>
              <button
                type="button"
                @click="availabilityFilter = 'retired'"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', availabilityFilter === 'retired' ? 'bg-slate-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                Retired ({{ retiredCount }})
              </button>
            </div>

            <!-- Row 2: Category Filter Pills -->
            <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100/70 text-xs min-w-0">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">Category:</span>
              <button
                type="button"
                @click="categoryFilter = 'all'"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', categoryFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                All Categories
              </button>
              <button
                type="button"
                v-for="cat in categories"
                :key="cat"
                @click="categoryFilter = cat"
                :class="['px-3 py-1.5 min-h-[36px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', categoryFilter === cat ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && inventoryItems.length === 0" class="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
            <svg class="animate-spin h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading inventory items...
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredInventory.length === 0" class="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h4 class="text-sm font-black text-slate-700">No inventory items found</h4>
          <p class="text-xs text-slate-400 mt-1">Try adjusting your search criteria or add new inventory items.</p>
        </div>

        <!-- ═══ Table View (Desktop & Tablet) ═══ -->
        <div v-else-if="viewMode === 'table'" class="hidden md:block bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
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
              <tbody class="divide-y divide-slate-100 text-xs">
                <tr
                  v-for="item in paginatedInventory"
                  :key="item.id"
                  class="hover:bg-amber-50/20 transition-colors group"
                >
                  <!-- Item Particulars -->
                  <td class="px-5 py-3.5">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-700 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
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
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/70">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      {{ item.category.charAt(0).toUpperCase() + item.category.slice(1) }}
                    </span>
                  </td>

                  <!-- Stock Availability -->
                  <td class="px-4 py-3.5 whitespace-nowrap">
                    <div class="space-y-1 max-w-[170px]">
                      <div class="flex items-center justify-between gap-2">
                        <span class="font-black text-slate-900 text-xs">{{ item.quantity_available }} / {{ item.quantity_total }} in stock</span>
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
                        v-if="isAdmin"
                        @click="openAdjustQuantityModal(item)"
                        class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                        title="Adjust available quantity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Qty</span>
                      </button>

                      <button
                        v-if="isAdmin"
                        @click="openEditModal(item)"
                        class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                        title="Edit item details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>Edit</span>
                      </button>

                      <button
                        v-if="isAdmin && item.condition_status !== 'maintenance'"
                        @click="setMaintenance(item)"
                        class="p-1.5 rounded-lg border border-amber-200/80 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="Mark for maintenance"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>

                      <button
                        v-if="isAdmin && item.condition_status === 'maintenance'"
                        @click="returnFromMaintenance(item)"
                        class="p-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="Return from maintenance"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>

                      <button
                        v-if="isAdmin && item.quantity_available === item.quantity_total && item.condition_status !== 'maintenance'"
                        @click="confirmDelete(item)"
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

        <!-- ═══ Streamlined Cards View (Clean Cards layout, default on mobile) ═══ -->
        <div :class="['grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5', viewMode === 'table' ? 'md:hidden' : '']">
          <div
            v-for="item in paginatedInventory"
            :key="item.id"
            class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
          >
            <div class="space-y-3">
              <!-- Card Header: Category & Availability + Item Name -->
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/70">
                      {{ item.category.charAt(0).toUpperCase() + item.category.slice(1) }}
                    </span>
                    <span v-if="item.location" class="text-[10px] text-slate-400 font-semibold truncate flex items-center gap-1">
                      • {{ item.location }}
                    </span>
                  </div>
                  <h4 class="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                    {{ item.name }}
                  </h4>
                  <p v-if="item.model" class="text-xs text-slate-500 font-semibold truncate mt-0.5">
                    {{ item.model }}
                  </p>
                </div>

                <span
                  :class="[
                    'px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 border',
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

              <!-- Stock Health & Status -->
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-slate-500 text-[11px]">Stock Level</span>
                  <span class="font-black text-slate-900">{{ item.quantity_available }} of {{ item.quantity_total }} Available</span>
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

            <!-- Simplified Action Bar -->
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5">
                <button
                  v-if="isAdmin"
                  @click="openAdjustQuantityModal(item)"
                  class="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-black transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Adjust Qty</span>
                </button>
                <button
                  v-if="isAdmin"
                  @click="openEditModal(item)"
                  class="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  Edit
                </button>
              </div>

              <div class="flex items-center gap-1">
                <button
                  v-if="isAdmin && item.condition_status !== 'maintenance'"
                  @click="setMaintenance(item)"
                  class="p-2 rounded-xl text-amber-600 hover:bg-amber-50 transition-all cursor-pointer"
                  title="Mark for maintenance"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button
                  v-if="isAdmin && item.condition_status === 'maintenance'"
                  @click="returnFromMaintenance(item)"
                  class="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                  title="Return from maintenance"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  v-if="isAdmin && item.quantity_available === item.quantity_total && item.condition_status !== 'maintenance'"
                  @click="confirmDelete(item)"
                  class="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                  title="Remove from inventory"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredInventory.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-xs text-slate-500">
          <div class="font-medium">
            Showing <span class="font-bold text-slate-800">{{ paginationRange.start }}</span> to <span class="font-bold text-slate-800">{{ paginationRange.end }}</span> of <span class="font-bold text-slate-800">{{ filteredInventory.length }}</span> items
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Prev
            </button>
            <span class="font-bold text-slate-700 px-2">{{ currentPage }} / {{ totalPages }}</span>
            <button
              type="button"
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Add Inventory Modal -->
      <Teleport to="body">
        <div v-if="showAddModal" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto">
          <div class="pointer-events-auto bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md p-5 sm:p-7 shadow-2xl border border-slate-100 animate-scale-up my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div class="flex items-center justify-between mb-5">
              <div>
                <span class="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                  New Item
                </span>
                <h3 class="text-xl font-black text-slate-900 mt-1">Add Inventory Item</h3>
              </div>
              <button @click="showAddModal = false" class="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form @submit.prevent="submitAddInventory" class="space-y-4">
              <!-- Item Name -->
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Item Name *</label>
                <input
                  v-model="addForm.name"
                  required
                  placeholder="e.g. Lawn Mower, Garden Shovel, Fertilizer"
                  class="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <!-- Category & Quantity (2 columns) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category *</label>
                  <select
                    v-model="addForm.category"
                    required
                    class="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer bg-white"
                  >
                    <option value="" disabled>Select Category</option>
                    <option value="tools">Tools</option>
                    <option value="equipment">Equipment</option>
                    <option value="plants">Plants</option>
                    <option value="materials">Materials</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Quantity *</label>
                  <input
                    v-model.number="addForm.quantity_total"
                    type="number"
                    min="1"
                    required
                    class="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <!-- Location -->
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Storage Location (Optional)</label>
                <input
                  v-model="addForm.location"
                  placeholder="e.g. Tool Shed, Greenhouse A, Main Warehouse"
                  class="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <!-- Optional Advanced Details Toggle -->
              <div class="pt-1">
                <button
                  type="button"
                  @click="showAddAdvanced = !showAddAdvanced"
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 transition-transform duration-200"
                    :class="{ 'rotate-90': showAddAdvanced }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>{{ showAddAdvanced ? 'Hide Additional Details' : '+ Add Model, Serial #, Condition, or Notes (Optional)' }}</span>
                </button>

                <div v-if="showAddAdvanced" class="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Model / Specification</label>
                      <input
                        v-model="addForm.model"
                        placeholder="e.g. STIHL FS 240, 24V"
                        class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Serial Number</label>
                      <input
                        v-model="addForm.serial_number"
                        placeholder="e.g. SN-882910"
                        class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Initial Condition</label>
                    <select
                      v-model="addForm.condition_status"
                      class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good (Default)</option>
                      <option value="fair">Fair</option>
                      <option value="needs_repair">Needs Repair</option>
                    </select>
                  </div>

                  <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Notes / Description</label>
                    <textarea
                      v-model="addForm.description"
                      rows="2"
                      placeholder="Maintenance tips, notes, or specific handling instructions..."
                      class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              <!-- Modal Actions -->
              <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-5">
                <button
                  type="button"
                  @click="showAddModal = false"
                  class="px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="px-6 py-2.5 min-h-[44px] rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all shadow-sm shadow-amber-200 active:scale-95 disabled:opacity-50 cursor-pointer touch-manipulation flex items-center gap-2"
                >
                  <svg v-if="submitting" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ submitting ? 'Adding...' : 'Add Item' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- Edit Inventory Modal -->
      <Teleport to="body">
        <div v-if="showEditModal && editingItem" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto">
          <div class="pointer-events-auto bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md p-5 sm:p-8 shadow-2xl border border-slate-100 animate-scale-up my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div class="flex items-center justify-between mb-6">
              <div>
                <span class="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                  Edit Item
                </span>
                <h3 class="text-xl font-black text-slate-900 mt-1">Edit Inventory Item</h3>
              </div>
              <button @click="showEditModal = false" class="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form @submit.prevent="submitEditInventory" class="space-y-4">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Item Name *</label>
                <input v-model="editForm.name" required class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Model / Specification</label>
                <input v-model="editForm.model" class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category *</label>
                <select v-model="editForm.category" required class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer bg-white">
                  <option value="tools">Tools</option>
                  <option value="equipment">Equipment</option>
                  <option value="plants">Plants</option>
                  <option value="materials">Materials</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Serial Number</label>
                <input v-model="editForm.serial_number" class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Condition *</label>
                <select v-model="editForm.condition_status" required class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer bg-white">
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="needs_repair">Needs Repair</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Storage Location</label>
                <input v-model="editForm.location" class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                <textarea v-model="editForm.description" rows="2" class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" @click="showEditModal = false" class="px-5 py-3 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer touch-manipulation">Cancel</button>
                <button type="submit" :disabled="submittingEdit" class="px-6 py-3 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer touch-manipulation">
                  {{ submittingEdit ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- Adjust Quantity Modal -->
      <Teleport to="body">
        <div v-if="showAdjustQtyModal && adjustingItem" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto">
          <div class="pointer-events-auto bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md p-5 sm:p-8 shadow-2xl border border-slate-100 animate-scale-up my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div class="flex items-center justify-between mb-6">
              <div>
                <span class="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                  Adjust Quantity
                </span>
                <h3 class="text-xl font-black text-slate-900 mt-1">Adjust Available Quantity</h3>
              </div>
              <button @click="showAdjustQtyModal = false" class="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div class="space-y-4">
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Item</span>
                  <span class="font-bold text-slate-900">{{ adjustingItem.name }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Total Quantity</span>
                  <span class="font-bold text-slate-900">{{ adjustingItem.quantity_total }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Currently Available</span>
                  <span class="font-bold text-amber-700">{{ adjustingItem.quantity_available }}</span>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">New Available Quantity *</label>
                <input
                  v-model.number="adjustQtyForm.new_quantity"
                  type="number"
                  min="0"
                  :max="adjustingItem.quantity_total"
                  required
                  class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center text-xl"
                />
                <p class="text-[11px] text-slate-400 font-medium mt-1 text-center">Must be between 0 and {{ adjustingItem.quantity_total }}</p>
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" @click="showAdjustQtyModal = false" class="px-5 py-3 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer touch-manipulation">Cancel</button>
                <button @click="submitAdjustQuantity" :disabled="submittingAdjust" class="px-6 py-3 min-h-[44px] rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all shadow-sm shadow-amber-200 active:scale-95 disabled:opacity-50 cursor-pointer touch-manipulation">
                  {{ submittingAdjust ? 'Saving...' : 'Update Quantity' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Delete Confirmation Modal -->
      <Teleport to="body">
        <div v-if="itemToDelete" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto">
          <div class="pointer-events-auto bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 text-center animate-scale-up my-auto">
            <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h4 class="text-base font-black text-slate-900 mb-1">Remove Inventory Item</h4>
            <p class="text-xs text-slate-500 mb-6">Are you sure you want to remove <strong class="text-slate-800">{{ itemToDelete.name }}</strong> from inventory?</p>
            <p class="text-xs text-amber-600 font-medium mb-4">Only items with full quantity available and not in maintenance can be deleted.</p>
            <div class="flex items-center justify-center gap-3">
              <button @click="itemToDelete = null" class="px-5 py-3 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer touch-manipulation">Cancel</button>
              <button @click="submitDelete" :disabled="deleteSubmitting" class="px-5 py-3 min-h-[44px] rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black transition-all shadow-sm shadow-rose-200 active:scale-95 disabled:opacity-50 cursor-pointer touch-manipulation">
                {{ deleteSubmitting ? 'Removing...' : 'Yes, Remove' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue3-toastify';
import {
  listInventory,
  getInventoryStats,
  createInventoryItem,
  updateInventoryItem,
  adjustInventoryQuantity,
  deleteInventoryItem,
} from '@/api/inventory';

const authStore = useAuthStore();

const isAdmin = computed(() => {
  const role = authStore.role || authStore.user?.role;
  return role === 'admin' || role === 'superadmin' || role === 'director';
});

// State
const searchQuery = ref('');
const availabilityFilter = ref('all');
const categoryFilter = ref('all');
const inventoryItems = ref([]);
const categories = ['tools', 'equipment', 'plants', 'materials', 'others'];
const loading = ref(false);
const stats = ref({});
const viewMode = ref('table');

// Modals
const showAddModal = ref(false);
const showAddAdvanced = ref(false);
const submitting = ref(false);
const addForm = reactive({
  name: '',
  model: '',
  category: '',
  serial_number: '',
  quantity_total: 1,
  condition_status: 'good',
  location: '',
  description: ''
});

const showEditModal = ref(false);
const editingItem = ref(null);
const submittingEdit = ref(false);
const editForm = reactive({
  name: '',
  model: '',
  category: '',
  serial_number: '',
  condition_status: 'good',
  location: '',
  description: ''
});

const showAdjustQtyModal = ref(false);
const adjustingItem = ref(null);
const submittingAdjust = ref(false);
const adjustQtyForm = reactive({
  new_quantity: 0
});

const itemToDelete = ref(null);
const deleteSubmitting = ref(false);

// Pagination State
const currentPage = ref(1);
const perPage = computed(() => (viewMode.value === 'table' ? 15 : 12));
const totalPages = computed(() => Math.max(1, Math.ceil(filteredInventory.value.length / perPage.value)));

const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredInventory.value.slice(start, start + perPage.value);
});

const paginationRange = computed(() => {
  if (filteredInventory.value.length === 0) return { start: 0, end: 0 };
  const start = (currentPage.value - 1) * perPage.value + 1;
  const end = Math.min(currentPage.value * perPage.value, filteredInventory.value.length);
  return { start, end };
});

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

watch([searchQuery, availabilityFilter, categoryFilter, viewMode], () => {
  currentPage.value = 1;
});

// Computed
const totalCount = computed(() => inventoryItems.value.length);
const availableCount = computed(() => inventoryItems.value.filter(i => i.quantity_available > 0 && i.condition_status !== 'retired' && i.condition_status !== 'needs_repair').length);
const outOfStockCount = computed(() => inventoryItems.value.filter(i => i.quantity_available === 0 && i.condition_status !== 'retired' && i.condition_status !== 'needs_repair').length);
const maintenanceCount = computed(() => inventoryItems.value.filter(i => i.condition_status === 'needs_repair').length);
const retiredCount = computed(() => inventoryItems.value.filter(i => i.condition_status === 'retired').length);

const filteredInventory = computed(() => {
  let list = inventoryItems.value;

  if (availabilityFilter.value !== 'all') {
    switch (availabilityFilter.value) {
      case 'available':
        list = list.filter(i => i.quantity_available > 0 && i.condition_status !== 'retired' && i.condition_status !== 'needs_repair');
        break;
      case 'out_of_stock':
        list = list.filter(i => i.quantity_available === 0 && i.condition_status !== 'retired' && i.condition_status !== 'needs_repair');
        break;
      case 'maintenance':
        list = list.filter(i => i.condition_status === 'needs_repair');
        break;
      case 'retired':
        list = list.filter(i => i.condition_status === 'retired');
        break;
    }
  }

  if (categoryFilter.value !== 'all') {
    list = list.filter(i => i.category === categoryFilter.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(i =>
      String(i.name || '').toLowerCase().includes(q) ||
      String(i.model || '').toLowerCase().includes(q) ||
      String(i.serial_number || '').toLowerCase().includes(q) ||
      String(i.description || '').toLowerCase().includes(q)
    );
  }

  return list;
});

const getAvailabilityLabel = (item) => {
  if (item.condition_status === 'retired') return 'Retired';
  if (item.condition_status === 'needs_repair') return 'Maintenance';
  if (item.quantity_available === 0) return 'Out of Stock';
  if (item.quantity_available < item.quantity_total) return 'Partial';
  return 'Available';
};

// Methods
const fetchInventory = async () => {
  loading.value = true;
  try {
    const res = await listInventory({ per_page: 500 });
    inventoryItems.value = res.data?.data?.items ?? [];
  } catch (err) {
    console.error('Failed to fetch inventory:', err);
    toast.error('Failed to load inventory items.');
  } finally {
    loading.value = false;
  }
};

const fetchStats = async () => {
  try {
    const res = await getInventoryStats();
    stats.value = res.data?.data ?? {};
  } catch (err) {
    console.error('Failed to fetch stats:', err);
  }
};

onMounted(async () => {
  await Promise.all([fetchInventory(), fetchStats()]);
});

// Add Inventory
const openAddModal = () => {
  showAddAdvanced.value = false;
  addForm.name = '';
  addForm.model = '';
  addForm.category = '';
  addForm.serial_number = '';
  addForm.quantity_total = 1;
  addForm.condition_status = 'good';
  addForm.location = '';
  addForm.description = '';
  showAddModal.value = true;
};

const submitAddInventory = async () => {
  if (!addForm.name || !addForm.category) {
    toast.error('Please enter an item name and select a category.');
    return;
  }
  submitting.value = true;
  try {
    const payload = {
      ...addForm,
      condition_status: addForm.condition_status || 'good',
      quantity_total: Math.max(1, Number(addForm.quantity_total) || 1),
    };
    await createInventoryItem(payload);
    toast.success('Inventory item added successfully!');
    showAddModal.value = false;
    await fetchInventory();
    await fetchStats();
  } catch (err) {
    const msg = err?.response?.data?.message || 'Failed to add inventory item.';
    toast.error(msg);
  } finally {
    submitting.value = false;
  }
};

// Edit Inventory
const openEditModal = (item) => {
  editingItem.value = item;
  editForm.name = item.name;
  editForm.model = item.model || '';
  editForm.category = item.category;
  editForm.serial_number = item.serial_number || '';
  editForm.condition_status = item.condition_status;
  editForm.location = item.location || '';
  editForm.description = item.description || '';
  showEditModal.value = true;
};

const submitEditInventory = async () => {
  if (!editingItem.value || !editForm.name || !editForm.category) {
    toast.error('Please fill in all required fields.');
    return;
  }
  submittingEdit.value = true;
  try {
    await updateInventoryItem(editingItem.value.id, editForm);
    toast.success('Inventory item updated successfully!');
    showEditModal.value = false;
    await fetchInventory();
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to update inventory item.');
  } finally {
    submittingEdit.value = false;
  }
};

// Adjust Quantity
const openAdjustQuantityModal = (item) => {
  adjustingItem.value = item;
  adjustQtyForm.new_quantity = item.quantity_available;
  showAdjustQtyModal.value = true;
};

const submitAdjustQuantity = async () => {
  if (adjustQtyForm.new_quantity === undefined || adjustQtyForm.new_quantity < 0 || adjustQtyForm.new_quantity > adjustingItem.value.quantity_total) {
    toast.error('Invalid quantity. Must be between 0 and total quantity.');
    return;
  }
  submittingAdjust.value = true;
  try {
    await adjustInventoryQuantity(adjustingItem.value.id, adjustQtyForm.new_quantity);
    toast.success('Quantity updated successfully!');
    showAdjustQtyModal.value = false;
    await fetchInventory();
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to adjust quantity.');
  } finally {
    submittingAdjust.value = false;
  }
};

// Maintenance Actions
const setMaintenance = async (item) => {
  try {
    await updateInventoryItem(item.id, { condition_status: 'needs_repair' });
    toast.success(`${item.name} marked for maintenance.`);
    await fetchInventory();
  } catch (err) {
    toast.error('Failed to set maintenance status.');
  }
};

const returnFromMaintenance = async (item) => {
  try {
    await updateInventoryItem(item.id, { condition_status: 'good' });
    toast.success(`${item.name} returned to service.`);
    await fetchInventory();
  } catch (err) {
    toast.error('Failed to update status.');
  }
};

// Delete Inventory
const confirmDelete = (item) => {
  itemToDelete.value = item;
};

const submitDelete = async () => {
  if (!itemToDelete.value) return;
  deleteSubmitting.value = true;
  try {
    await deleteInventoryItem(itemToDelete.value.id);
    toast.success(`${itemToDelete.value.name} removed from inventory.`);
    itemToDelete.value = null;
    await fetchInventory();
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to remove inventory item.');
  } finally {
    deleteSubmitting.value = false;
  }
};
</script>

<style scoped>
.slide-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.delay-100 { animation-delay: 0.15s; }

@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }

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
</style>