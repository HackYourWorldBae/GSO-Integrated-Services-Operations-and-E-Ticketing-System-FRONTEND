<template>
  <MainLayout>
    <template #header-title>
      <div class="flex items-center gap-2">
        <span class="text-xs px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-black uppercase tracking-wider">LEAU</span>
        <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Inventory Management</h2>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-6 animate-fade-in pb-12 px-3 sm:px-8 py-4 sm:py-6 max-w-[1600px] mx-auto min-h-screen">

        <!-- Top Toolbar: Search, Actions & Filters -->
        <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <!-- Search bar -->
            <div class="relative flex-1 max-w-md w-full">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search inventory by name, model, or serial..."
                class="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-slate-50/50"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Action Buttons: Add Inventory -->
            <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end sm:justify-start shrink-0">
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

          <!-- Status & Category Filters -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <!-- Availability Filter Tabs -->
            <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs">
              <button
                @click="availabilityFilter = 'all'"
                :class="['px-3 py-2 sm:py-1.5 min-h-[38px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', availabilityFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                All ({{ totalCount }})
              </button>
              <button
                @click="availabilityFilter = 'available'"
                :class="['px-3 py-2 sm:py-1.5 min-h-[38px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', availabilityFilter === 'available' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                Available ({{ availableCount }})
              </button>
              <button
                @click="availabilityFilter = 'out_of_stock'"
                :class="['px-3 py-2 sm:py-1.5 min-h-[38px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', availabilityFilter === 'out_of_stock' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                Out of Stock ({{ outOfStockCount }})
              </button>
              <button
                @click="availabilityFilter = 'maintenance'"
                :class="['px-3 py-2 sm:py-1.5 min-h-[38px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', availabilityFilter === 'maintenance' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                Maintenance ({{ maintenanceCount }})
              </button>
              <button
                @click="availabilityFilter = 'retired'"
                :class="['px-3 py-2 sm:py-1.5 min-h-[38px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', availabilityFilter === 'retired' ? 'bg-slate-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                Retired ({{ retiredCount }})
              </button>
            </div>

            <!-- Category Filter Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-1 sm:pt-0 text-xs">
              <button
                @click="categoryFilter = 'all'"
                :class="['px-3 py-2 sm:py-1.5 min-h-[38px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', categoryFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                All Categories
              </button>
              <button
                v-for="cat in categories"
                :key="cat"
                @click="categoryFilter = cat"
                :class="['px-3 py-2 sm:py-1.5 min-h-[38px] rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation flex items-center justify-center', categoryFilter === cat ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              >
                {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Inventory Cards Grid -->
        <div v-if="filteredInventory.length === 0" class="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h4 class="text-sm font-black text-slate-700">No inventory items found</h4>
          <p class="text-xs text-slate-400 mt-1">Try adjusting your search criteria or add new inventory items.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          <div
            v-for="item in filteredInventory"
            :key="item.id"
            class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
          >
            <!-- Card Body: Item Details -->
            <div class="space-y-3.5">
              <!-- Top Row: Icon, Name, Category & Availability Badge -->
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 flex items-center justify-center font-black text-sm shrink-0 border border-amber-200 shadow-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-sm font-black text-slate-900 truncate leading-tight">
                      {{ item.name }}
                    </h4>
                    <span class="inline-block text-xs font-bold text-slate-500 truncate mt-0.5">
                      {{ item.model ? item.model : 'No model specified' }}
                    </span>
                  </div>
                </div>

                <!-- Availability Badge -->
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 border',
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

              <!-- Category & Condition Badges -->
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center gap-1">
                  <span class="w-1 h-1 rounded-full bg-amber-500"></span>
                  {{ item.category.charAt(0).toUpperCase() + item.category.slice(1) }}
                </span>
                <span
                  :class="[
                    'px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1',
                    item.condition_status === 'excellent' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    item.condition_status === 'good' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                    item.condition_status === 'fair' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    item.condition_status === 'needs_repair' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                    'bg-slate-50 text-slate-700 border-slate-200'
                  ]"
                >
                  {{ item.condition_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                </span>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200/60">
                  Qty: {{ item.quantity_available }} / {{ item.quantity_total }}
                </span>
              </div>

              <!-- Location & Serial -->
              <div v-if="item.location || item.serial_number" class="space-y-1 pt-1 border-t border-slate-100/50">
                <div v-if="item.location" class="flex items-center gap-1.5 text-xs text-slate-500">
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="font-medium text-slate-700">{{ item.location }}</span>
                </div>
                <div v-if="item.serial_number" class="flex items-center gap-1.5 text-xs text-slate-500">
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span class="font-mono text-slate-700">SN: {{ item.serial_number }}</span>
                </div>
              </div>
            </div>

            <!-- Card Bottom: Action Buttons -->
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <!-- Edit Inventory -->
                <button
                  v-if="isAdmin"
                  @click="openEditModal(item)"
                  class="px-3 sm:px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 touch-manipulation"
                  title="Edit inventory item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Edit</span>
                </button>

                <!-- Adjust Quantity -->
                <button
                  v-if="isAdmin && item.quantity_available > 0"
                  @click="openAdjustQuantityModal(item)"
                  class="px-3 sm:px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 touch-manipulation"
                  title="Adjust available quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Adjust Qty</span>
                </button>

                <!-- Set Maintenance -->
                <button
                  v-if="isAdmin && item.condition_status !== 'maintenance'"
                  @click="setMaintenance(item)"
                  class="px-3 sm:px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 touch-manipulation"
                  title="Mark for maintenance"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Maintenance</span>
                </button>

                <!-- Return from Maintenance -->
                <button
                  v-if="isAdmin && item.condition_status === 'maintenance'"
                  @click="returnFromMaintenance(item)"
                  class="px-3 sm:px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 touch-manipulation"
                  title="Return from maintenance"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Back to Service</span>
                </button>
              </div>

              <!-- Delete Button -->
              <button
                v-if="isAdmin && item.quantity_available === item.quantity_total && item.condition_status !== 'maintenance'"
                @click="confirmDelete(item)"
                class="w-9 h-9 min-h-[38px] min-w-[38px] rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center cursor-pointer touch-manipulation shrink-0"
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

      <!-- Add Inventory Modal -->
      <Teleport to="body">
        <div v-if="showAddModal" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto">
          <div class="pointer-events-auto bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md p-5 sm:p-8 shadow-2xl border border-slate-100 animate-scale-up my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div class="flex items-center justify-between mb-6">
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
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Item Name *</label>
                <input v-model="addForm.name" required placeholder="e.g. Brush Cutter, Hedge Trimmer, Ficus benjamina" class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Model / Specification</label>
                <input v-model="addForm.model" placeholder="e.g. STIHL FS 240, Makita XHU02Z, 1.5m height" class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category *</label>
                <select v-model="addForm.category" required class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer bg-white">
                  <option value="" disabled>Select Category</option>
                  <option value="tools">Tools</option>
                  <option value="equipment">Equipment</option>
                  <option value="plants">Plants</option>
                  <option value="materials">Materials</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Serial Number</label>
                <input v-model="addForm.serial_number" placeholder="Optional serial/asset number" class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Quantity *</label>
                  <input v-model.number="addForm.quantity_total" type="number" min="1" required class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Condition *</label>
                  <select v-model="addForm.condition_status" required class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer bg-white">
                    <option value="excellent">Excellent</option>
                    <option value="good" selected>Good</option>
                    <option value="fair">Fair</option>
                    <option value="needs_repair">Needs Repair</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Storage Location</label>
                <input v-model="addForm.location" placeholder="e.g. LEAU Warehouse - Shelf A3" class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                <textarea v-model="addForm.description" rows="2" placeholder="Additional details, specifications, or notes..." class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-base sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" @click="showAddModal = false" class="px-5 py-3 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer touch-manipulation">Cancel</button>
                <button type="submit" :disabled="submitting" class="px-6 py-3 min-h-[44px] rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all shadow-sm shadow-amber-200 active:scale-95 disabled:opacity-50 cursor-pointer touch-manipulation">
                  {{ submitting ? 'Saving...' : 'Add to Inventory' }}
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
import { ref, computed, reactive, onMounted } from 'vue';
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

// Modals
const showAddModal = ref(false);
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
    toast.error('Please fill in all required fields.');
    return;
  }
  submitting.value = true;
  try {
    await createInventoryItem(addForm);
    toast.success('Inventory item added successfully!');
    showAddModal.value = false;
    await fetchInventory();
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