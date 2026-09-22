<template>
  <div class="space-y-4 animate-fade-in relative pb-4">
    <!-- Tabs & Search Toolbar (shown only when !hideToolbar) -->
    <div v-if="!hideToolbar" class="bg-white rounded-2xl border border-slate-200 shadow-xs p-1.5">
      <div class="flex items-center gap-1.5 flex-wrap">
        <template v-if="showTabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            @click="activeTab = tab.key; currentPage = 1"
            :class="[
              'flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95',
              activeTab === tab.key ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            ]"
          >
            <span>{{ tab.label }}</span>
            <span :class="['ml-1 px-2 py-0.5 rounded-full text-[10px] font-black leading-none', activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700']">
              {{ tabCounts[tab.key] ?? 0 }}
            </span>
          </button>
        </template>
        <div class="flex-1"></div>
        <button
          type="button"
          @click="refreshAll"
          :disabled="loading"
          class="px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          title="Refresh borrowing queues"
        >
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
      <div class="px-2 pt-2">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search ticket #, borrower, item, ID..."
            class="w-full pl-9 pr-4 py-2.5 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- ═══ Desktop Tabular View (matching other ticket lists on this system) ═══ -->
    <div v-if="isTableLayout" class="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Ticket Ref</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Borrower</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Item Requested</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
              <th class="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <!-- Loading State -->
            <tr v-if="loading && requests.length === 0">
              <td colspan="5" class="py-16 text-center">
                <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
                  <svg class="animate-spin h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading borrowing requests...
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="paginatedRequests.length === 0">
              <td colspan="5" class="py-16 text-center">
                <div class="max-w-sm mx-auto flex flex-col items-center">
                  <div class="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p class="text-sm font-bold text-slate-700">No Borrowing Requests Found</p>
                  <p class="text-xs text-slate-400 mt-1">
                    {{ effectiveSearch ? 'No requests match your search criteria.' : 'No borrowing requests in this tab.' }}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-for="req in paginatedRequests"
              :key="req.ticket_id || req.id"
              class="hover:bg-amber-50/30 transition-all duration-150 group cursor-pointer relative"
              @click="emitDetails(req)"
            >
              <!-- Ticket Ref -->
              <td class="px-4 py-2.5 whitespace-nowrap relative">
                <span class="absolute left-0 top-2 bottom-2 w-1 rounded-r-sm bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150"></span>
                <div class="relative inline-flex items-center gap-1.5 flex-wrap">
                  <span class="font-mono text-sm font-bold px-3 py-1 rounded-lg border bg-amber-50 text-amber-800 border-amber-200 inline-flex items-center group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all duration-150 shadow-2xs">
                    #{{ req.ticket_id }}
                  </span>
                  <span
                    v-if="isOverdue(req)"
                    class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider border border-rose-200"
                  >
                    Overdue
                  </span>
                </div>
              </td>

              <!-- Borrower -->
              <td class="px-3 py-2.5">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {{ getInitials(req.borrower_name) }}
                  </div>
                  <div class="min-w-0">
                    <span class="text-xs font-semibold text-slate-800 truncate block max-w-[150px]">{{ req.borrower_name }}</span>
                  </div>
                </div>
              </td>

              <!-- Item Requested -->
              <td class="px-3 py-2.5">
                <div class="text-xs font-black text-slate-900 truncate max-w-[220px]">
                  {{ req.item_name_requested }}
                  <span v-if="req.item_model_requested" class="font-semibold text-slate-500">({{ req.item_model_requested }})</span>
                </div>
                <div class="text-[10px] text-slate-500 truncate max-w-[220px]">
                  Item/s requested
                </div>
              </td>

              <!-- Status -->
              <td class="px-3 py-2.5 whitespace-nowrap">
                <span :class="['px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border inline-flex items-center gap-1 shadow-2xs', statusPillClass(req.status)]">
                  {{ formatStatus(req.status) }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-3 py-2.5 whitespace-nowrap text-right" @click.stop>
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    v-if="req.status === 'ready_for_pickup'"
                    type="button"
                    @click="doPickup(req)"
                    :disabled="actionLoading"
                    class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1 disabled:opacity-50"
                    title="Record early or on-time pickup"
                  >
                    <span>Picked Up</span>
                  </button>
                  <button
                    v-if="req.status === 'picked_up' || req.status === 'overdue'"
                    type="button"
                    @click="openReturnModal(req)"
                    :disabled="actionLoading"
                    class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1 disabled:opacity-50"
                    title="Record item return (auto-archives, no rating)"
                  >
                    <span>Mark Returned</span>
                  </button>
                  <button
                    type="button"
                    @click="emitDetails(req)"
                    class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1 cursor-pointer"
                    title="View full request details"
                  >
                    <span>Details</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Desktop Pagination Footer -->
      <div v-if="visibleRequests.length > 0" class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span class="font-bold text-slate-800">{{ paginationRange.start }}</span> to <span class="font-bold text-slate-800">{{ paginationRange.end }}</span> of <span class="font-bold text-slate-800">{{ visibleRequests.length }}</span> tickets
        </div>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
          >
            Previous
          </button>
          <div class="px-3 py-1.5 font-bold text-slate-700">
            {{ currentPage }} / {{ totalPages }}
          </div>
          <button
            type="button"
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ Mobile View (Cards) when Table Layout ═══ -->
    <div v-if="isTableLayout" class="md:hidden space-y-3">
      <!-- Loading State -->
      <div v-if="loading && requests.length === 0" class="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
        <div class="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
          <svg class="animate-spin h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading borrowing requests...
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedRequests.length === 0" class="py-12 text-center bg-white rounded-2xl border border-slate-200">
        <div class="h-10 w-10 mx-auto rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p class="text-xs font-bold text-slate-700">No Borrowing Requests Found</p>
        <p class="text-[10px] text-slate-400 mt-0.5">
          {{ effectiveSearch ? 'No requests match your search criteria.' : 'No borrowing requests in this tab.' }}
        </p>
      </div>

      <!-- Mobile Data Cards -->
      <div
        v-for="req in paginatedRequests"
        :key="req.ticket_id || req.id"
        class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3 cursor-pointer transition-all hover:border-amber-300 active:scale-[0.99]"
        @click="emitDetails(req)"
      >
        <!-- Top Row: Ref Mono Badge & Status -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-mono text-sm font-bold px-2.5 py-0.5 rounded-lg border bg-amber-50 text-amber-800 border-amber-200 shadow-2xs">
              #{{ req.ticket_id }}
            </span>
            <span
              v-if="isOverdue(req)"
              class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider border border-rose-200"
            >
              Overdue
            </span>
          </div>
          <span :class="['px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border inline-flex items-center gap-1 shadow-2xs', statusPillClass(req.status)]">
            {{ formatStatus(req.status) }}
          </span>
        </div>

        <!-- Borrower & Item Summary -->
        <div class="space-y-1.5">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[9px] font-bold flex items-center justify-center shrink-0">
              {{ getInitials(req.borrower_name) }}
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-xs font-bold text-slate-800 truncate block">{{ req.borrower_name }}</span>
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div class="text-xs font-black text-slate-900 leading-tight">
              {{ req.item_name_requested }}
              <span v-if="req.item_model_requested" class="font-semibold text-slate-500">({{ req.item_model_requested }})</span>
            </div>
            <div class="text-[10px] text-slate-500 flex items-center gap-1.5 flex-wrap">
              <span>Item/s requested</span>
            </div>
          </div>
        </div>

        <!-- Card Action Buttons -->
        <div class="flex items-center justify-end gap-2 pt-1 border-t border-slate-100" @click.stop>
          <button
            v-if="req.status === 'ready_for_pickup'"
            type="button"
            @click="doPickup(req)"
            :disabled="actionLoading"
            class="flex-1 py-2 px-3 min-h-[38px] rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black text-center transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
            title="Record item pickup"
          >
            <span>Picked Up</span>
          </button>
          <button
            v-if="req.status === 'picked_up' || req.status === 'overdue'"
            type="button"
            @click="openReturnModal(req)"
            :disabled="actionLoading"
            class="flex-1 py-2 px-3 min-h-[38px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black text-center transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
            title="Record item return"
          >
            <span>Mark Returned</span>
          </button>
          <button
            type="button"
            @click="emitDetails(req)"
            class="py-2 px-4 min-h-[38px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold text-center transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center justify-center gap-1"
          >
            <span>Details</span>
          </button>
        </div>
      </div>

      <!-- Mobile Pagination Footer -->
      <div v-if="visibleRequests.length > 0" class="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
        <button
          type="button"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-slate-50 text-slate-700 disabled:opacity-40 font-bold touch-manipulation flex items-center justify-center"
        >
          Prev
        </button>
        <span class="font-bold text-slate-700">{{ currentPage }} / {{ totalPages }}</span>
        <button
          type="button"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-slate-50 text-slate-700 disabled:opacity-40 font-bold touch-manipulation flex items-center justify-center"
        >
          Next
        </button>
      </div>
    </div>

    <!-- ═══ Grid Cards View (when layout !== 'table') ═══ -->
    <div v-else class="space-y-4">
      <div v-if="loading && requests.length === 0" class="text-center py-10 bg-white rounded-2xl border border-slate-200">
        <p class="text-xs font-bold text-slate-400">Loading borrowing requests...</p>
      </div>
      <div v-else-if="paginatedRequests.length === 0" class="text-center py-10 bg-white rounded-2xl border border-slate-200">
        <p class="text-sm font-bold text-slate-600">No borrowing requests found</p>
        <p class="text-xs text-slate-400 mt-1">Requests move here automatically as their status changes.</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="req in paginatedRequests"
          :key="req.ticket_id || req.id"
          class="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3 hover:border-amber-300 transition-all cursor-pointer"
          @click="emitDetails(req)"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="font-mono text-sm font-bold px-2.5 py-0.5 rounded-lg border bg-amber-50 text-amber-800 border-amber-200">#{{ req.ticket_id }}</span>
            <span :class="['px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border', statusPillClass(req.status)]">
              {{ formatStatus(req.status) }}
            </span>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-black text-slate-900 truncate">{{ req.item_name_requested }} <span v-if="req.item_model_requested" class="font-semibold text-slate-500">({{ req.item_model_requested }})</span></p>
            <p class="text-xs text-slate-600 font-semibold truncate">{{ req.borrower_name }}</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Item/s requested</p>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2" @click.stop>
            <button
              v-if="req.status === 'ready_for_pickup'"
              type="button"
              @click="doPickup(req)"
              :disabled="actionLoading"
              class="px-4 py-2 min-h-[40px] rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black cursor-pointer disabled:opacity-50"
              title="Record early or on-time pickup"
            >
              Picked Up
            </button>
            <button
              v-if="req.status === 'picked_up' || req.status === 'overdue'"
              type="button"
              @click="openReturnModal(req)"
              :disabled="actionLoading"
              class="px-4 py-2 min-h-[40px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer disabled:opacity-50"
              title="Record item return (auto-archives, no rating)"
            >
              Mark Returned
            </button>
            <button
              type="button"
              @click="emitDetails(req)"
              class="px-4 py-2 min-h-[40px] rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold inline-flex items-center cursor-pointer"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      <!-- Grid Pagination Footer -->
      <div v-if="visibleRequests.length > 0" class="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span class="font-bold text-slate-800">{{ paginationRange.start }}</span> to <span class="font-bold text-slate-800">{{ paginationRange.end }}</span> of <span class="font-bold text-slate-800">{{ visibleRequests.length }}</span> tickets
        </div>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
          >
            Previous
          </button>
          <div class="px-3 py-1.5 font-bold text-slate-700">
            {{ currentPage }} / {{ totalPages }}
          </div>
          <button
            type="button"
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Return modal -->
    <Teleport to="body">
      <div v-if="returnTarget" class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto pointer-events-auto" @click.self="returnTarget = null">
        <div class="bg-white rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-slate-100 my-auto">
          <h3 class="text-lg font-black text-slate-900">Mark Returned — #{{ returnTarget.ticket_id }}</h3>
          <p class="text-xs text-slate-500 mt-1">Returning auto-archives the ticket as completed. No rating form is shown to the end user.</p>
          <div class="space-y-3 mt-4">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Return Condition *</label>
              <select v-model="returnForm.condition" class="w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer bg-white">
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="damaged">Damaged</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Return Notes</label>
              <textarea v-model="returnForm.notes" rows="2" placeholder="Condition notes, damages, missing parts..." class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 mt-5">
            <button type="button" @click="returnTarget = null" class="px-5 py-3 min-h-[44px] rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="button" @click="doReturn" :disabled="actionLoading" class="px-5 py-3 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer disabled:opacity-50">
              {{ actionLoading ? 'Saving...' : 'Confirm Return' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  getBorrowingQueue,
  getOverdueBorrowings,
  recordBorrowingPickup,
  recordBorrowingReturn,
} from '@/api/borrowing';
import { borrowingStatusLabel, isOverdueBorrowing } from '@/utils/borrowing';
import { toast } from 'vue3-toastify';

const props = defineProps({
  initialTab: { type: String, default: 'awaiting' },
  // When embedded inside another ticket-list layout (e.g. LEAU Scheduled / Active Tickets),
  // the host provides the tab switcher — hide this component's own tab row.
  showTabs: { type: Boolean, default: true },
  // Suppresses the internal toolbar completely (tabs + search + refresh), delegating to parent.
  hideToolbar: { type: Boolean, default: false },
  // Optional search text passed down from parent workspace toolbar
  searchText: { type: String, default: '' },
  // Optional locked status set for embedded mode (e.g. ['ready_for_pickup'] on the
  // Scheduled page, ['picked_up', 'overdue'] on the Active page). When provided with
  // showTabs=false, the list shows these statuses combined instead of a single tab.
  statusFilter: { type: Array, default: null },
  // List layout: 'cards' (default grid) or 'table' (tabular, matching the other
  // ticket-list workspaces on desktop; mobile stays as cards).
  layout: { type: String, default: 'cards' }
});

const emit = defineEmits(['view-details', 'status-changed', 'updated']);

const isTableLayout = computed(() => String(props.layout || 'cards').toLowerCase() === 'table');

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return String(name).substring(0, 2).toUpperCase();
};

const tabs = [
  { key: 'awaiting', label: 'Borrowing Requests (Awaiting Pickup Date)' },
  { key: 'borrowed', label: 'Borrowed Items' },
  { key: 'overdue', label: 'Overdue' }
];

const activeTab = ref(['awaiting', 'borrowed', 'overdue'].includes(props.initialTab) ? props.initialTab : 'awaiting');
const requests = ref([]);
const overdue = ref([]);
const loading = ref(false);
const actionLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const returnTarget = ref(null);
const returnForm = ref({ condition: 'good', notes: '' });

const awaitingList = computed(() => requests.value.filter(r => r.status === 'ready_for_pickup'));
const borrowedList = computed(() => requests.value.filter(r => r.status === 'picked_up'));
const overdueList = computed(() => {
  const fromQueue = requests.value.filter(r => r.status === 'overdue');
  const merged = [...fromQueue];
  overdue.value.forEach(o => { if (!merged.some(m => String(m.ticket_id) === String(o.ticket_id))) merged.push(o); });
  return merged;
});

const tabCounts = computed(() => ({ awaiting: awaitingList.value.length, borrowed: borrowedList.value.length, overdue: overdueList.value.length }));

const lockedStatuses = computed(() => {
  if (props.showTabs) return null;
  if (!Array.isArray(props.statusFilter) || props.statusFilter.length === 0) return null;
  return props.statusFilter.map(s => String(s));
});

const baseList = computed(() => {
  const locked = lockedStatuses.value;
  if (locked) {
    const merged = [...requests.value];
    overdue.value.forEach(o => { if (!merged.some(m => String(m.ticket_id) === String(o.ticket_id))) merged.push(o); });
    const filtered = merged.filter(r => locked.includes(String(r.status)));
    // Surface overdue items first so past-due returns are actioned promptly.
    return [...filtered].sort((a, b) => (String(b.status) === 'overdue') - (String(a.status) === 'overdue'));
  }
  return activeTab.value === 'awaiting' ? awaitingList.value : activeTab.value === 'borrowed' ? borrowedList.value : overdueList.value;
});

const effectiveSearch = computed(() => {
  if (props.searchText !== undefined && props.searchText !== null && props.searchText.trim() !== '') {
    return props.searchText.trim().toLowerCase();
  }
  return searchQuery.value.trim().toLowerCase();
});

const visibleRequests = computed(() => {
  const q = effectiveSearch.value;
  if (!q) return baseList.value;
  return baseList.value.filter(r =>
    String(r.ticket_id || '').toLowerCase().includes(q) ||
    String(r.borrower_name || '').toLowerCase().includes(q) ||
    String(r.item_name_requested || '').toLowerCase().includes(q) ||
    String(r.item_model_requested || '').toLowerCase().includes(q) ||
    String(r.borrower_id_number || '').toLowerCase().includes(q) ||
    String(r.department_college || '').toLowerCase().includes(q) ||
    String(r.purpose_project || '').toLowerCase().includes(q)
  );
});

// ═══ Pagination Computeds ═══
const totalPages = computed(() => Math.max(1, Math.ceil(visibleRequests.value.length / perPage.value)));

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return visibleRequests.value.slice(start, start + perPage.value);
});

const paginationRange = computed(() => {
  const total = visibleRequests.value.length;
  if (!total) return { start: 0, end: 0 };
  const start = (currentPage.value - 1) * perPage.value + 1;
  const end = Math.min(start + perPage.value - 1, total);
  return { start, end };
});

const changePage = (p) => {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p;
  }
};

watch([effectiveSearch, activeTab], () => {
  currentPage.value = 1;
});

const formatStatus = (s) => borrowingStatusLabel(s);
const statusPillClass = (s) => s === 'overdue'
  ? 'bg-rose-50 text-rose-700 border-rose-200'
  : s === 'picked_up'
    ? 'bg-blue-50 text-blue-700 border-blue-200'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';
const formatDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const isOverdue = (r) => isOverdueBorrowing(r);

const fetchQueue = async () => {
  const res = await getBorrowingQueue({ per_page: 500 });
  requests.value = res.data?.data?.borrowing_requests || [];
};

const fetchOverdue = async () => {
  try {
    const res = await getOverdueBorrowings();
    overdue.value = res.data?.data?.overdue_requests || [];
  } catch { overdue.value = []; }
};

const refreshAll = async () => {
  loading.value = true;
  try {
    await Promise.all([fetchQueue(), fetchOverdue()]);
    emit('updated');
  }
  catch (e) {
    console.error(e);
    toast.error('Failed to load borrowing queues.');
  }
  finally {
    loading.value = false;
  }
};

const doPickup = async (req) => {
  actionLoading.value = true;
  try {
    await recordBorrowingPickup(req.ticket_id, {});
    toast.success(`#${req.ticket_id} picked up — moved to Borrowed Items.`);
    emit('status-changed', { ticket_id: req.ticket_id, status: 'picked_up' });
    emit('updated');
    await refreshAll();
  } catch (e) { toast.error(e.response?.data?.message || 'Failed to record pickup.'); }
  finally { actionLoading.value = false; }
};

const openReturnModal = (req) => {
  returnTarget.value = req;
  returnForm.value = { condition: 'good', notes: '' };
};

const doReturn = async () => {
  if (!returnTarget.value) return;
  actionLoading.value = true;
  try {
    const tid = returnTarget.value.ticket_id;
    await recordBorrowingReturn(tid, {
      return_condition: returnForm.value.condition,
      return_notes: returnForm.value.notes
    });
    toast.success(`#${tid} returned and archived (no rating required).`);
    returnTarget.value = null;
    emit('status-changed', { ticket_id: tid, status: 'returned' });
    emit('updated');
    await refreshAll();
  } catch (e) { toast.error(e.response?.data?.message || 'Failed to record return.'); }
  finally { actionLoading.value = false; }
};

const emitDetails = (req) => {
  emit('view-details', req);
};

defineExpose({
  refreshAll,
  refresh: refreshAll,
});

onMounted(refreshAll);
</script>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
