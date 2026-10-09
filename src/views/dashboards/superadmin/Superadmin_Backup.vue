<template>
  <MainLayout>
    <template #header-title>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-2xs shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zm0 4h16M8 4v4m8-4v4" />
          </svg>
        </div>
        <div class="flex flex-col">
          <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug mb-0.5">Database Backup &amp; Disaster Recovery</h2>
          <p class="text-[10px] text-emerald-700 font-bold tracking-[0.15em] uppercase">Onsite Local Storage &amp; Google Drive Cloud Vault</p>
        </div>
      </div>
    </template>

    <template #main-content>
      <div class="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-16">
        
        <!-- System Status & Metrics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Metric 1: Total Backups -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Backups</p>
              <h3 class="text-xl font-extrabold text-slate-900">{{ stats.total_backups || 0 }}</h3>
              <p class="text-[11px] text-slate-400 font-medium">{{ formatBytes(stats.total_size_bytes || 0) }} stored</p>
            </div>
          </div>

          <!-- Metric 2: Latest Snapshot -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Latest Backup</p>
              <h3 class="text-sm font-bold text-slate-900 truncate max-w-[150px]">
                {{ stats.latest_backup_at ? formatDate(stats.latest_backup_at) : 'No backups yet' }}
              </h3>
              <p class="text-[11px] text-emerald-600 font-medium" v-if="stats.latest_backup_at">Ready for restore</p>
            </div>
          </div>

          <!-- Metric 3: Google Drive Status -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Google Drive</p>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="inline-block w-2.5 h-2.5 rounded-full" :class="googleDrive.connected ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                <h3 class="text-sm font-bold text-slate-900">{{ googleDrive.connected ? 'Cloud Connected' : 'Setup Required' }}</h3>
              </div>
              <p class="text-[11px] text-slate-400 font-medium">{{ stats.gdrive_synced_count || 0 }} synced files</p>
            </div>
          </div>

          <!-- Metric 4: Disaster Recovery -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600 shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Protection Engine</p>
              <h3 class="text-sm font-bold text-slate-900">Dual-Vault Mode</h3>
              <p class="text-[11px] text-slate-400 font-medium">Local + Cloud Sync</p>
            </div>
          </div>
        </div>

        <!-- Action Control Bar -->
        <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-slate-900">Database Snapshot Operations</h3>
              <p class="text-xs text-slate-500">Initiate live snapshots or configure your Google Drive integration parameters</p>
            </div>
          </div>

          <div class="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
            <!-- Maintenance Mode Status & Precaution Button -->
            <button
              v-if="maintenance.active"
              @click="confirmDeactivateMaintenance"
              :disabled="isUpdatingMaintenance"
              type="button"
              class="px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs animate-pulse"
              title="Click to turn off emergency maintenance and allow user logins"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Maintenance ACTIVE (Turn Off)</span>
            </button>
            <button
              v-else
              @click="openMaintenancePrecautionModal"
              type="button"
              class="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              title="Activate website maintenance mode with live user countdown & eviction"
            >
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Website in Maintenance</span>
            </button>

            <!-- Configure Google Drive Button -->
            <button
              @click="openDriveConfigModal"
              type="button"
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Drive Settings</span>
            </button>

            <!-- Upload SQL / ZIP Dump Button -->
            <button
              @click="openUploadModal"
              type="button"
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Upload Archive / Dump</span>
            </button>

            <!-- Create Full Backup Now Button -->
            <button
              @click="openCreateBackupModal"
              :disabled="isCreatingBackup"
              type="button"
              class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <svg v-if="!isCreatingBackup" class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <svg v-else class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isCreatingBackup ? 'Generating Backup...' : 'Create Backup Snapshot' }}</span>
            </button>
          </div>
        </div>

        <!-- Google Drive Alert Banner if not configured -->
        <div v-if="!googleDrive.connected" class="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
          <div class="p-2 rounded-xl bg-amber-500/20 text-amber-700 shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-bold text-amber-900">Google Drive Cloud Synchronization Not Connected</h4>
            <p class="text-xs text-amber-800/80 mt-0.5 leading-relaxed">
              Backups will be created and kept in local onsite storage (<code class="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">writable/backups/</code>).
              To enable automatic Google Drive cloud backup for your demo, click <strong>Drive Settings</strong> above and attach your Google Service Account JSON key.
            </p>
          </div>
          <button
            @click="openDriveConfigModal"
            class="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer shadow-xs"
          >
            Configure Now
          </button>
        </div>

        <!-- Backup History Table Card -->
        <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div class="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-extrabold text-slate-900">Backup Repository &amp; Snapshot History</h3>
              <p class="text-xs text-slate-500">Historical database state archives available for instant disaster recovery and downloads</p>
            </div>
            
            <button
              @click="loadBackups"
              :disabled="isLoading"
              class="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <svg :class="{ 'animate-spin': isLoading }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>

          <!-- Loading State Skeleton -->
          <div v-if="isLoading" class="p-8 space-y-4">
            <div v-for="i in 3" :key="i" class="h-14 bg-slate-100 rounded-xl animate-pulse"></div>
          </div>

          <!-- Empty State -->
          <div v-else-if="backups.length === 0" class="p-12 text-center">
            <div class="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zm0 4h16M8 4v4m8-4v4" />
              </svg>
            </div>
            <h4 class="text-base font-bold text-slate-800">No database backups generated yet</h4>
            <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">Create your first database snapshot now to protect your tickets, personnel, logs, and system data.</p>
            <button
              @click="handleCreateBackup"
              class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs"
            >
              Generate First Backup
            </button>
          </div>

          <!-- Backups Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/75 border-b border-slate-200/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th class="py-3.5 px-6">File Name &amp; Description</th>
                  <th class="py-3.5 px-4">Size</th>
                  <th class="py-3.5 px-4">Storage Locations</th>
                  <th class="py-3.5 px-4">Created Date</th>
                  <th class="py-3.5 px-4">Initiated By</th>
                  <th class="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm">
                <tr v-for="item in backups" :key="item.id" class="hover:bg-slate-50/60 transition-colors">
                  <!-- File Info -->
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div class="font-bold text-slate-900 font-mono text-xs flex items-center gap-2 flex-wrap">
                          <span>{{ item.file_name }}</span>
                          <span
                            class="px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider border"
                            :class="{
                              'bg-purple-100 text-purple-700 border-purple-200': item.backup_category === 'full',
                              'bg-emerald-100 text-emerald-700 border-emerald-200': item.backup_category === 'media',
                              'bg-blue-100 text-blue-700 border-blue-200': !item.backup_category || item.backup_category === 'database'
                            }"
                          >
                            {{ item.backup_category === 'full' ? 'Full System' : (item.backup_category === 'media' ? 'Media Zip' : 'Database Dump') }}
                          </span>
                          <span class="px-2 py-0.5 rounded text-[10px] font-sans font-semibold uppercase tracking-wider bg-slate-100 text-slate-700">
                            {{ item.backup_type }}
                          </span>
                        </div>
                        <p class="text-xs text-slate-500 mt-0.5">{{ item.notes || 'System backup snapshot' }}</p>
                      </div>
                    </div>
                  </td>

                  <!-- Size -->
                  <td class="py-4 px-4 font-semibold text-slate-700 text-xs">
                    {{ formatBytes(item.file_size_bytes) }}
                  </td>

                  <!-- Storage Badges (Local + Drive) -->
                  <td class="py-4 px-4">
                    <div class="flex flex-col gap-1.5">
                      <!-- Onsite / Local Badge -->
                      <div class="flex items-center gap-1.5 text-xs font-semibold">
                        <span class="w-2 h-2 rounded-full" :class="item.local_exists ? 'bg-emerald-500' : 'bg-red-500'"></span>
                        <span :class="item.local_exists ? 'text-slate-700' : 'text-red-600'">
                          {{ item.local_exists ? 'Onsite (Local)' : 'Local File Missing' }}
                        </span>
                      </div>

                      <!-- Cloud / Drive Badge -->
                      <div class="flex items-center gap-1.5 text-xs font-semibold">
                        <template v-if="item.google_drive_status === 'uploaded'">
                          <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                          <a
                            v-if="item.google_drive_link"
                            :href="item.google_drive_link"
                            target="_blank"
                            class="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          >
                            <span>Google Drive</span>
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <span v-else class="text-blue-600">Google Drive Synced</span>
                        </template>
                        <template v-else-if="item.google_drive_status === 'pending'">
                          <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                          <span class="text-amber-600">Uploading to Drive...</span>
                        </template>
                        <template v-else-if="item.google_drive_status === 'failed'">
                          <span class="w-2 h-2 rounded-full bg-red-400"></span>
                          <span class="text-red-500 text-[11px]" :title="item.google_drive_error">Drive Sync Failed</span>
                        </template>
                        <template v-else>
                          <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                          <span class="text-slate-400 text-[11px]">Drive Not Configured</span>
                        </template>
                      </div>
                    </div>
                  </td>

                  <!-- Created Date -->
                  <td class="py-4 px-4 text-xs text-slate-600 font-medium">
                    {{ formatDate(item.created_at) }}
                  </td>

                  <!-- Creator -->
                  <td class="py-4 px-4">
                    <span class="text-xs font-semibold text-slate-800">{{ item.creator_name || 'System Admin' }}</span>
                    <p class="text-[10px] text-slate-400 font-mono">{{ item.creator_email || 'root' }}</p>
                  </td>

                  <!-- Actions Dropdown / Group -->
                  <td class="py-4 px-6 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <!-- Download -->
                      <button
                        @click="handleDownload(item)"
                        title="Download SQL File"
                        class="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>

                      <!-- Retry Sync to Drive if not uploaded -->
                      <button
                        v-if="item.google_drive_status !== 'uploaded'"
                        @click="handleSyncDrive(item)"
                        :disabled="isSyncingDriveId === item.id"
                        title="Sync to Google Drive"
                        class="p-2 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <svg :class="{ 'animate-spin': isSyncingDriveId === item.id }" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                      </button>

                      <!-- Restore Button -->
                      <button
                        @click="openRestoreModal(item)"
                        title="Restore Database from Snapshot"
                        class="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Restore</span>
                      </button>

                      <!-- Delete -->
                      <button
                        @click="handleDelete(item)"
                        title="Delete Backup"
                        class="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <!-- ======================================================== -->
        <!-- Disaster Recovery & Backup Operations Audit Trail        -->
        <!-- ======================================================== -->
        <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div class="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-extrabold text-slate-900">Backup &amp; Disaster Recovery Activity Logs</h3>
                <span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider border border-purple-200">
                  {{ recentLogs.length }} Operations
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">Live chronological audit trail of all snapshots, cloud synchronizations, restorations, and purges</p>
            </div>
            
            <router-link
              to="/superadmin/logs"
              class="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-slate-200 text-purple-700 hover:text-purple-900 hover:bg-purple-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Full Operations Audit Trail</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>

          <!-- Empty State -->
          <div v-if="recentLogs.length === 0" class="p-8 text-center">
            <p class="text-xs text-slate-400 font-medium">No backup or disaster recovery operations recorded yet.</p>
          </div>

          <!-- Logs Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/75 border-b border-slate-200/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th class="py-3 px-6">Timestamp</th>
                  <th class="py-3 px-4">Event Type</th>
                  <th class="py-3 px-4">Initiated By</th>
                  <th class="py-3 px-6">Details &amp; Outcome</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs">
                <tr v-for="log in recentLogs" :key="log.id" class="hover:bg-slate-50/60 transition-colors">
                  <td class="py-3 px-6 font-mono text-slate-600 whitespace-nowrap">
                    {{ formatDate(log.created_at) }}
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border inline-flex items-center gap-1"
                      :class="{
                        'bg-emerald-100 text-emerald-800 border-emerald-200': log.event_type === 'SYSTEM_BACKUP_CREATED',
                        'bg-amber-100 text-amber-800 border-amber-200': log.event_type === 'SYSTEM_RESTORE_EXECUTED',
                        'bg-blue-100 text-blue-800 border-blue-200': log.event_type === 'SYSTEM_BACKUP_SYNCED',
                        'bg-rose-100 text-rose-800 border-rose-200': log.event_type === 'SYSTEM_BACKUP_DELETED'
                      }"
                    >
                      {{
                        log.event_type === 'SYSTEM_BACKUP_CREATED' ? 'Snapshot Created' :
                        log.event_type === 'SYSTEM_RESTORE_EXECUTED' ? 'System Restored' :
                        log.event_type === 'SYSTEM_BACKUP_SYNCED' ? 'Drive Synced' :
                        log.event_type === 'SYSTEM_BACKUP_DELETED' ? 'Snapshot Deleted' : log.event_type
                      }}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {{ log.actor_name || 'System / Admin' }}
                  </td>
                  <td class="py-3 px-6 text-slate-600">
                    <p class="leading-relaxed">{{ log.details }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ======================================================== -->
      <!-- MODAL 1: Safe Restore with Storage Selection Modal      -->
      <!-- ======================================================== -->
      <Teleport to="body">
        <div 
          v-if="selectedBackupForRestore" 
          class="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 sm:py-10 pointer-events-auto overflow-y-auto animate-fade-in"
          @click.self="closeRestoreModal"
        >
          <div 
            class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scale-up max-h-[calc(100dvh-3rem)] sm:max-h-[88vh] overflow-y-auto custom-scrollbar my-auto pointer-events-auto"
            @click.stop
          >
            <div class="flex items-center gap-3 text-red-600">
              <div class="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-black text-slate-900 tracking-tight">System State Restoration</h3>
                <p class="text-xs text-red-600 font-bold uppercase tracking-wider">Disaster Recovery Rollback</p>
              </div>
            </div>

            <div class="bg-red-50 border border-red-200/80 rounded-2xl p-4 text-xs text-red-900 space-y-2 leading-relaxed">
              <p>
                You are about to restore the system state from snapshot:
              </p>
              <div class="p-2.5 bg-white/80 rounded-xl border border-red-200 font-mono text-[11px] font-bold text-slate-800 break-all">
                {{ selectedBackupForRestore.file_name }}
              </div>
              <p class="font-bold text-red-700">
                Warning: Current database tables and records will be replaced with data from this snapshot.
              </p>
            </div>

            <!-- Storage Source Selection -->
            <div class="space-y-2">
              <label class="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Select Storage Source to Fetch Backup:
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <!-- Local Onsite Storage Card -->
                <div
                  @click="selectedBackupForRestore.local_exists ? restoreStorageSource = 'local' : null"
                  class="p-3.5 rounded-2xl border transition-all flex items-start gap-3 select-none"
                  :class="{
                    'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 cursor-pointer shadow-xs': restoreStorageSource === 'local' && selectedBackupForRestore.local_exists,
                    'border-slate-200 bg-white hover:border-slate-300 cursor-pointer': restoreStorageSource !== 'local' && selectedBackupForRestore.local_exists,
                    'border-slate-200/60 bg-slate-50 opacity-50 cursor-not-allowed': !selectedBackupForRestore.local_exists
                  }"
                >
                  <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1">
                      <span class="text-xs font-bold text-slate-900">Local Onsite</span>
                      <span v-if="restoreStorageSource === 'local' && selectedBackupForRestore.local_exists" class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      {{ selectedBackupForRestore.local_exists ? 'Fastest, read from server disk' : 'Local file missing' }}
                    </p>
                  </div>
                </div>

                <!-- Google Drive Cloud Card -->
                <div
                  @click="selectedBackupForRestore.google_drive_status === 'uploaded' ? restoreStorageSource = 'google_drive' : null"
                  class="p-3.5 rounded-2xl border transition-all flex items-start gap-3 select-none"
                  :class="{
                    'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20 cursor-pointer shadow-xs': restoreStorageSource === 'google_drive' && selectedBackupForRestore.google_drive_status === 'uploaded',
                    'border-slate-200 bg-white hover:border-slate-300 cursor-pointer': restoreStorageSource !== 'google_drive' && selectedBackupForRestore.google_drive_status === 'uploaded',
                    'border-slate-200/60 bg-slate-50 opacity-50 cursor-not-allowed': selectedBackupForRestore.google_drive_status !== 'uploaded'
                  }"
                >
                  <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1">
                      <span class="text-xs font-bold text-slate-900">Google Drive</span>
                      <span v-if="restoreStorageSource === 'google_drive' && selectedBackupForRestore.google_drive_status === 'uploaded'" class="w-2 h-2 rounded-full bg-blue-500"></span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      {{ selectedBackupForRestore.google_drive_status === 'uploaded' ? 'Download fresh copy from Drive' : 'Not synced to Drive' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Maintenance Precaution Alert if Inactive -->
            <div v-if="!maintenance.active" class="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
              <div class="flex items-center gap-2 font-bold text-amber-900">
                <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Recommended: Activate Website Maintenance First</span>
              </div>
              <p class="leading-relaxed">
                Emergency Maintenance Mode is currently <strong>Inactive</strong>. Active users logged into the system could submit tickets or modify data concurrently during database restoration.
              </p>
              <button
                type="button"
                @click="openMaintenancePrecautionModal"
                class="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Activate Website Maintenance First
              </button>
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Type <span class="text-red-600 font-mono font-black">CONFIRM RESTORE</span> below to proceed:
              </label>
              <input
                v-model="restoreConfirmationInput"
                type="text"
                placeholder="CONFIRM RESTORE"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-800 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none uppercase"
                :disabled="isRestoring"
              />
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                @click="closeRestoreModal"
                :disabled="isRestoring"
                type="button"
                class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                @click="executeRestore"
                :disabled="restoreConfirmationInput !== 'CONFIRM RESTORE' || isRestoring"
                type="button"
                class="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-md"
              >
                <svg v-if="isRestoring" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isRestoring ? 'Restoring System...' : (restoreStorageSource === 'google_drive' ? 'Restore from Google Drive' : 'Restore from Local Storage') }}</span>
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- ======================================================== -->
      <!-- MODAL 2: Google Drive Configuration Modal               -->
      <!-- ======================================================== -->
      <Teleport to="body">
        <div 
          v-if="showDriveModal" 
          class="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 sm:py-10 pointer-events-auto overflow-y-auto animate-fade-in"
          @click.self="showDriveModal = false"
        >
          <div 
            class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-scale-up max-h-[calc(100dvh-3rem)] sm:max-h-[88vh] overflow-y-auto custom-scrollbar my-auto pointer-events-auto"
            @click.stop
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900">Google Drive Cloud Setup</h3>
                  <p class="text-xs text-slate-500">Configure automated cloud database backup storage</p>
                </div>
              </div>
              <button @click="showDriveModal = false" class="text-slate-400 hover:text-slate-600 p-2 cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Connection Status Card -->
            <div class="p-4 rounded-2xl border flex items-center justify-between gap-4" :class="googleDrive.connected ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-3 h-3 rounded-full shrink-0" :class="googleDrive.connected ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                <div class="min-w-0">
                  <h4 class="text-xs font-bold text-slate-900">
                    {{ googleDrive.connected ? (googleDrive.auth_type === 'oauth' ? 'Personal Google Drive Active' : 'Service Account Active') : 'Not Connected' }}
                  </h4>
                  <p class="text-[11px] text-slate-500 truncate">
                    {{ googleDrive.account_email || googleDrive.service_account_email || googleDrive.message }}
                  </p>
                  <p v-if="googleDrive.storage_limit" class="text-[10px] font-mono text-emerald-700 font-semibold mt-0.5">
                    Storage: {{ formatBytes(googleDrive.storage_usage) }} / {{ formatBytes(googleDrive.storage_limit) }} used
                  </p>
                </div>
              </div>
              <button
                @click="checkDriveStatus"
                :disabled="isTestingDrive"
                type="button"
                class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
              >
                <svg :class="{ 'animate-spin': isTestingDrive }" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Test Now</span>
              </button>
            </div>

            <!-- Auth Mode Segmented Tab Switch -->
            <div class="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl text-xs font-bold gap-1">
              <button
                type="button"
                @click="authTab = 'oauth'"
                :class="authTab === 'oauth' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
                class="py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <svg class="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v8h-2z" />
                </svg>
                <span>Personal Drive (OAuth 2.0)</span>
              </button>
              <button
                type="button"
                @click="authTab = 'service_account'"
                :class="authTab === 'service_account' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
                class="py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Workspace Shared Drive</span>
              </button>
            </div>

            <!-- ============================================== -->
            <!-- TAB 1: OAuth 2.0 (Personal Google Drive)       -->
            <!-- ============================================== -->
            <div v-if="authTab === 'oauth'" class="space-y-4">
              <!-- Informational Banner -->
              <div class="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-300/70 text-xs text-emerald-950 space-y-1.5 leading-relaxed">
                <div class="flex items-center gap-2 font-bold text-emerald-900">
                  <span class="px-2 py-0.5 rounded-full bg-emerald-200/90 text-[10px] font-extrabold uppercase tracking-wider">Recommended for @gmail.com</span>
                </div>
                <p class="text-[11px] text-slate-700">
                  Personal accounts store backups directly under your own Google Drive quota (15 GB / 5 TB).
                </p>
                <ol class="list-decimal list-inside space-y-0.5 text-[11px] text-slate-700 pt-0.5">
                  <li>In Google Cloud Console &rarr; <strong>APIs &amp; Services</strong> &rarr; <strong>Credentials</strong>, create an <strong>OAuth client ID</strong> (Web application).</li>
                  <li>Copy and paste the <strong>Authorized redirect URI</strong> below into your OAuth Client.</li>
                  <li>Enter your <strong>Client ID</strong> and <strong>Client Secret</strong>, then click <strong>Authorize with Google</strong>.</li>
                </ol>
              </div>

              <!-- Redirect URI Card with Copy -->
              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Authorized Redirect URI</span>
                  <button
                    @click="copyRedirectUri"
                    type="button"
                    class="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <svg v-if="!hasCopiedRedirectUri" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <svg v-else class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{{ hasCopiedRedirectUri ? 'Copied!' : 'Copy URI' }}</span>
                  </button>
                </div>
                <div class="p-2 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-800 break-all select-all">
                  {{ googleDrive.redirect_uri || `${window.location.origin}/api/v1/superadmin/backups/google-oauth-callback` }}
                </div>
              </div>

              <!-- Upload client_secret.json helper -->
              <div>
                <input
                  type="file"
                  ref="driveJsonFileInput"
                  accept=".json,application/json"
                  class="hidden"
                  @change="handleDriveFileSelected"
                />
                <button
                  type="button"
                  @click="$refs.driveJsonFileInput.click()"
                  class="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/40 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>{{ selectedDriveFileName ? `Loaded: ${selectedDriveFileName}` : 'Or click to upload downloaded client_secret_xxx.json' }}</span>
                </button>
              </div>

              <!-- Client ID -->
              <div>
                <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  OAuth Client ID <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="oauthForm.clientId"
                  type="text"
                  placeholder="e.g. 123456789-xxxx.apps.googleusercontent.com"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                />
              </div>

              <!-- Client Secret -->
              <div>
                <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  OAuth Client Secret <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="oauthForm.clientSecret"
                  type="password"
                  placeholder="e.g. GOCSPX-xxxxxxxxxxxxxxxxxxxx"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                />
              </div>

              <!-- Target Folder ID (Optional for OAuth) -->
              <div>
                <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Google Drive Folder ID (Optional)</span>
                  <span class="text-[10px] font-bold text-slate-400 normal-case">Leave blank to store in root</span>
                </label>
                <input
                  v-model="oauthForm.folderId"
                  type="text"
                  placeholder="e.g. 15u4dxdD1Ua6mQMImo1PCRaNHY0JITuai4"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                />
                <p class="text-[11px] text-slate-500 mt-1">
                  From folder URL: <code class="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded text-[10px]">drive.google.com/drive/folders/<strong>[FOLDER_ID]</strong></code>
                </p>
              </div>

              <!-- Advanced: Manual Refresh Token -->
              <div class="pt-1">
                <button
                  type="button"
                  @click="showManualRefreshToken = !showManualRefreshToken"
                  class="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  {{ showManualRefreshToken ? 'Hide Manual Refresh Token' : 'Advanced: Paste Refresh Token manually' }}
                </button>
                <div v-if="showManualRefreshToken" class="mt-2 space-y-2">
                  <textarea
                    v-model="oauthForm.refreshToken"
                    rows="2"
                    placeholder="1//04xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (from OAuth Playground or CLI)"
                    class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none"
                  ></textarea>
                  <button
                    @click="saveOAuthManualConfig"
                    :disabled="isSavingDriveConfig"
                    type="button"
                    class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                  >
                    <span>Save Manual Token</span>
                  </button>
                </div>
              </div>

              <!-- OAuth Authorization Action Buttons -->
              <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  @click="showDriveModal = false"
                  type="button"
                  class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  @click="initiateOAuthFlow"
                  :disabled="isAuthorizingOAuth"
                  type="button"
                  class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <svg v-if="isAuthorizingOAuth" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  <span>{{ isAuthorizingOAuth ? 'Connecting...' : 'Authorize with Google' }}</span>
                </button>
              </div>
            </div>

            <!-- ============================================== -->
            <!-- TAB 2: Service Account (Workspace Shared Drive)-->
            <!-- ============================================== -->
            <div v-else class="space-y-4">
              <!-- Notice for Service Account -->
              <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300/80 space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-amber-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span class="text-xs font-bold text-amber-950 uppercase tracking-wider">Service Account Email</span>
                  </div>
                  <button
                    v-if="detectedServiceAccountEmail"
                    @click="copyServiceAccountEmail"
                    type="button"
                    class="px-2.5 py-1 text-[11px] font-bold bg-amber-200/90 hover:bg-amber-300 text-amber-950 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <svg v-if="!hasCopiedEmail" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <svg v-else class="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{{ hasCopiedEmail ? 'Copied!' : 'Copy Email' }}</span>
                  </button>
                </div>

                <div v-if="detectedServiceAccountEmail" class="p-2.5 rounded-xl bg-white/90 border border-amber-200/80 font-mono text-xs font-semibold text-amber-950 break-all select-all">
                  {{ detectedServiceAccountEmail }}
                </div>

                <div class="text-[11px] text-amber-950/90 space-y-1 pt-1 leading-relaxed">
                  <p class="font-bold text-amber-950">Important note for Service Accounts:</p>
                  <p class="text-slate-700">
                    Google restricts Service Accounts to <strong>Google Workspace Shared Drives (Team Drives)</strong>. If using a personal @gmail.com account, please switch to the <strong>Personal Drive (OAuth 2.0)</strong> tab.
                  </p>
                </div>
              </div>

              <!-- Target Folder ID -->
              <div>
                <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Shared Drive / Folder ID <span class="text-rose-500">*</span></span>
                  <span class="text-[10px] font-bold text-amber-700 normal-case bg-amber-100/70 px-2 py-0.5 rounded-full">Required for Service Accounts</span>
                </label>
                <input
                  v-model="driveForm.folderId"
                  type="text"
                  placeholder="e.g. 1yGzABcDeFGHiJKlmnOPqRSTUVWXYZ"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                />
              </div>

              <!-- Service Account JSON Upload -->
              <div>
                <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Upload Service Account JSON File
                </label>
                <div class="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    ref="driveJsonFileInput"
                    accept=".json,application/json"
                    class="hidden"
                    @change="handleDriveFileSelected"
                  />
                  <div @click="$refs.driveJsonFileInput.click()" class="cursor-pointer space-y-1">
                    <svg class="w-8 h-8 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="text-xs font-bold text-slate-700">
                      {{ selectedDriveFileName ? selectedDriveFileName : 'Click to browse service-account.json' }}
                    </p>
                    <p class="text-[10px] text-slate-400">Google Cloud Console &rarr; IAM &amp; Admin &rarr; Service Accounts &rarr; Keys</p>
                  </div>
                </div>
              </div>

              <!-- Or Paste Raw JSON -->
              <div>
                <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Or Paste JSON Credentials
                </label>
                <textarea
                  v-model="driveForm.credentialsJson"
                  rows="3"
                  placeholder='{"type": "service_account", "project_id": "...", "private_key": "..."}'
                  class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none"
                ></textarea>
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button
                  @click="showDriveModal = false"
                  type="button"
                  class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  @click="saveDriveConfig"
                  :disabled="isSavingDriveConfig"
                  type="button"
                  class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <svg v-if="isSavingDriveConfig" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isSavingDriveConfig ? 'Saving...' : 'Save Drive Settings' }}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </Teleport>

      <!-- ======================================================== -->
      <!-- MODAL 3: Upload External SQL Dump Modal                 -->
      <!-- ======================================================== -->
      <Teleport to="body">
        <div 
          v-if="showUploadModal" 
          class="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 sm:py-10 pointer-events-auto overflow-y-auto animate-fade-in"
          @click.self="showUploadModal = false"
        >
          <div 
            class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scale-up max-h-[calc(100dvh-3rem)] sm:max-h-[88vh] overflow-y-auto custom-scrollbar my-auto pointer-events-auto"
            @click.stop
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900">Upload &amp; Restore Archive</h3>
                  <p class="text-xs text-slate-500">Restore database SQL dumps or full system .ZIP snapshots</p>
                </div>
              </div>
              <button @click="showUploadModal = false" class="text-slate-400 hover:text-slate-600 p-2 cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <!-- Maintenance Precaution Alert if Inactive -->
              <div v-if="!maintenance.active" class="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
                <div class="flex items-center gap-2 font-bold text-amber-900">
                  <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Recommended: Activate Website Maintenance First</span>
                </div>
                <p class="leading-relaxed">
                  Emergency Maintenance Mode is currently <strong>Inactive</strong>. It is strongly recommended to turn on maintenance mode to notify and evict active users before restoring files.
                </p>
                <button
                  type="button"
                  @click="openMaintenancePrecautionModal"
                  class="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Activate Website Maintenance First
                </button>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Select Backup Archive (.SQL or .ZIP)
                </label>
                <input
                  type="file"
                  ref="uploadSqlFileInput"
                  accept=".sql,.zip,application/zip,application/x-zip-compressed"
                  class="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-emerald-600 cursor-pointer"
                  @change="handleUploadFileChange"
                />
              </div>

              <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
                <p class="font-bold">Caution:</p>
                <p class="mt-0.5">Uploading will immediately execute the SQL dump into your active database and/or extract media assets into <code class="bg-amber-100 px-1 py-0.5 rounded text-[10px] font-mono">writable/uploads/</code>. Type confirmation below.</p>
              </div>

              <div>
                <label class="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Type <span class="text-red-600 font-mono font-black">CONFIRM RESTORE</span>:
                </label>
                <input
                  v-model="uploadRestoreConfirmation"
                  type="text"
                  placeholder="CONFIRM RESTORE"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-800 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none uppercase"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                @click="showUploadModal = false"
                type="button"
                class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                @click="executeUploadRestore"
                :disabled="uploadRestoreConfirmation !== 'CONFIRM RESTORE' || !selectedUploadFile || isUploadingRestore"
                type="button"
                class="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-md"
              >
                <svg v-if="isUploadingRestore" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isUploadingRestore ? 'Uploading & Restoring...' : 'Restore from Upload' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- ======================================================== -->
      <!-- MODAL 4: Website in Maintenance Precaution Modal        -->
      <!-- ======================================================== -->
      <Teleport to="body">
        <div 
          v-if="showMaintenancePrecautionModal" 
          class="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 sm:py-10 pointer-events-auto overflow-y-auto animate-fade-in"
          @click.self="showMaintenancePrecautionModal = false"
        >
          <div 
            class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scale-up max-h-[calc(100dvh-3rem)] sm:max-h-[88vh] overflow-y-auto custom-scrollbar my-auto pointer-events-auto"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900">Website in Maintenance</h3>
                  <p class="text-xs text-amber-700 font-bold uppercase tracking-wider">Emergency Precaution Controls</p>
                </div>
              </div>
              <button @click="showMaintenancePrecautionModal = false" class="text-slate-400 hover:text-slate-600 p-2 cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Precautionary Explanations -->
            <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2 leading-relaxed">
              <p class="font-bold text-amber-900">
                What happens when Maintenance Mode is activated?
              </p>
              <ul class="list-disc list-inside space-y-1 text-slate-700 font-medium">
                <li><strong>Active User Notification:</strong> All logged-in users (Staff, Students, Employees, Workers, Admins, Directors) will receive an instant emergency notification modal.</li>
                <li><strong>Automated Countdown Eviction:</strong> Users will see a live countdown timer before being securely logged out automatically.</li>
                <li><strong>Public Login Lockout:</strong> Any attempt to sign in will display an Emergency Maintenance Notice explaining that operations are paused.</li>
                <li><strong>Superadmin Exemption:</strong> You retain full Superadmin access to execute backups, restores, or database updates.</li>
              </ul>
            </div>

            <!-- Maintenance Notice Message -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Public Announcement Notice
              </label>
              <textarea
                v-model="maintenanceForm.message"
                rows="3"
                placeholder="The website is currently undergoing emergency database restoration and maintenance. Please check back shortly."
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none resize-none leading-relaxed"
              ></textarea>
            </div>

            <!-- Countdown Seconds Selector -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Eviction Countdown Duration
              </label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="dur in [15, 30, 60, 120]"
                  :key="dur"
                  type="button"
                  @click="maintenanceForm.countdown_seconds = dur"
                  :class="maintenanceForm.countdown_seconds === dur ? 'bg-amber-600 text-white font-black shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                  class="py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                >
                  {{ dur }}s
                </button>
              </div>
              <p class="text-[11px] text-slate-400">Seconds given to active users to read the notice before automatic logout.</p>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                @click="showMaintenancePrecautionModal = false"
                type="button"
                class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                @click="handleActivateMaintenance"
                :disabled="isUpdatingMaintenance"
                type="button"
                class="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <svg v-if="isUpdatingMaintenance" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isUpdatingMaintenance ? 'Activating...' : 'Activate Maintenance Mode' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- ======================================================== -->
      <!-- MODAL 5: Create Unified Full System Snapshot Modal       -->
      <!-- ======================================================== -->
      <Teleport to="body">
        <div 
          v-if="showCreateBackupModal" 
          class="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 sm:py-10 pointer-events-auto overflow-y-auto animate-fade-in"
          @click.self="showCreateBackupModal = false"
        >
          <div 
            class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scale-up max-h-[calc(100dvh-3rem)] sm:max-h-[88vh] overflow-y-auto custom-scrollbar my-auto pointer-events-auto"
            @click.stop
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900">Create Full System Snapshot</h3>
                  <p class="text-xs text-purple-700 font-bold uppercase tracking-wider">Unified Disaster Recovery Backup</p>
                </div>
              </div>
              <button @click="showCreateBackupModal = false" class="text-slate-400 hover:text-slate-600 p-2 cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Unified Snapshot Scope Box -->
            <div class="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 text-xs text-purple-950 space-y-2.5">
              <div class="flex items-center gap-2 font-bold text-purple-900">
                <svg class="w-4 h-4 text-purple-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Complete Database &amp; Media Assets Snapshot</span>
              </div>
              <p class="leading-relaxed text-purple-900/90">
                To eliminate partial restore conflicts, all backups are created as a complete snapshot package containing:
              </p>
              <ul class="space-y-1.5 pl-1 font-medium text-purple-900/90">
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                  <span><strong>Full MySQL Database:</strong> Schema, users, tickets, assignments, logs, and settings.</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                  <span><strong>All Uploaded Media:</strong> Evidentiary ticket attachments, photos, documents (<code class="bg-purple-100/80 px-1 py-0.5 rounded text-[11px] font-mono">writable/uploads/</code>).</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                  <span><strong>Cloud Parity:</strong> Automatically synced to Google Drive in the <code class="bg-purple-100/80 px-1 py-0.5 rounded text-[11px] font-mono">Databases/</code> folder.</span>
                </li>
              </ul>
            </div>

            <!-- Notes field -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Snapshot Description / Notes (Optional)
              </label>
              <input
                v-model="backupForm.notes"
                type="text"
                placeholder="e.g. Regular pre-demo system backup"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none"
              />
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                @click="showCreateBackupModal = false"
                type="button"
                class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                @click="handleGenerateBackup"
                :disabled="isCreatingBackup"
                type="button"
                class="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <svg v-if="isCreatingBackup" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isCreatingBackup ? 'Generating Full Snapshot...' : 'Start Full Snapshot Now' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Teleport>

    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import {
  fetchBackups,
  createBackup,
  restoreBackup,
  restoreFromUpload,
  downloadBackup,
  syncBackupToGoogleDrive,
  deleteBackup,
  getGoogleDriveStatus,
  updateGoogleDriveConfig,
  getGoogleOAuthUrl
} from '@/api/backup';
import { fetchMaintenanceStatus, updateMaintenanceStatus } from '@/api/superadmin';
import { toast } from 'vue3-toastify';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

// ---------------------------------------------------------
// Component State
// ---------------------------------------------------------
const backups = ref([]);
const stats = ref({
  total_backups: 0,
  total_size_bytes: 0,
  latest_backup_at: null,
  gdrive_synced_count: 0
});
const googleDrive = ref({
  is_configured: false,
  connected: false,
  message: 'Checking connection...',
  auth_type: 'oauth',
  folder_id: '',
  service_account_email: '',
  account_email: '',
  account_name: '',
  storage_limit: null,
  storage_usage: null,
  client_id: '',
  redirect_uri: ''
});

const isLoading = ref(false);
const isCreatingBackup = ref(false);
const isSyncingDriveId = ref(null);

// Emergency Maintenance Mode State
const maintenance = ref({
  active: false,
  message: '',
  countdown_seconds: 30,
  activated_at: null
});
const showMaintenancePrecautionModal = ref(false);
const isUpdatingMaintenance = ref(false);
const maintenanceForm = ref({
  message: 'The website is currently undergoing emergency database restoration and maintenance. Please check back shortly.',
  countdown_seconds: 30
});

// Create Backup Modal State
const showCreateBackupModal = ref(false);
const backupForm = ref({
  category: 'full',
  notes: ''
});

// Restore Modal State
const selectedBackupForRestore = ref(null);
const restoreConfirmationInput = ref('');
const restoreStorageSource = ref('local'); // 'local' | 'google_drive' | 'auto'
const isRestoring = ref(false);

// Disaster Recovery Operations Logs State
const recentLogs = ref([]);

// Google Drive Config Modal State
const showDriveModal = ref(false);
const isTestingDrive = ref(false);
const isSavingDriveConfig = ref(false);
const isAuthorizingOAuth = ref(false);
const authTab = ref('oauth'); // 'oauth' | 'service_account'
const hasCopiedRedirectUri = ref(false);
const hasCopiedEmail = ref(false);
const showManualRefreshToken = ref(false);

const oauthForm = ref({
  clientId: '',
  clientSecret: '',
  refreshToken: '',
  folderId: ''
});

const driveJsonFileInput = ref(null);
const selectedDriveFileName = ref('');
const driveForm = ref({
  folderId: '',
  credentialsJson: '',
  file: null
});

// Derived: emails from API response
const detectedServiceAccountEmail = computed(() => googleDrive.value.service_account_email || '');
const detectedAccountEmail = computed(() => googleDrive.value.account_email || '');

// Upload SQL / ZIP Dump Modal State
const showUploadModal = ref(false);
const uploadSqlFileInput = ref(null);
const selectedUploadFile = ref(null);
const uploadRestoreConfirmation = ref('');
const isUploadingRestore = ref(false);

// ---------------------------------------------------------
// Lifecycle & Data Fetching
// ---------------------------------------------------------
onMounted(async () => {
  // Check for OAuth redirect callback query params
  if (route.query.oauth_success) {
    const email = route.query.account_email ? ` as ${route.query.account_email}` : '';
    toast.success(`Personal Google Drive connected successfully${email}!`);
    router.replace({ path: route.path });
  } else if (route.query.oauth_error) {
    toast.error(formatErrorMessage(route.query.oauth_error));
    router.replace({ path: route.path });
  }

  await Promise.all([loadBackups(), loadMaintenanceStatus()]);
});

const loadMaintenanceStatus = async () => {
  try {
    const res = await fetchMaintenanceStatus();
    if (res.data?.status && res.data.data?.maintenance) {
      maintenance.value = res.data.data.maintenance;
      if (res.data.data.maintenance.message) {
        maintenanceForm.value.message = res.data.data.maintenance.message;
      }
      if (res.data.data.maintenance.countdown_seconds) {
        maintenanceForm.value.countdown_seconds = res.data.data.maintenance.countdown_seconds;
      }
    }
  } catch {
    // Non-blocking
  }
};

const openMaintenancePrecautionModal = () => {
  showMaintenancePrecautionModal.value = true;
};

const handleActivateMaintenance = async () => {
  isUpdatingMaintenance.value = true;
  try {
    const res = await updateMaintenanceStatus({
      active: true,
      message: maintenanceForm.value.message,
      countdown_seconds: maintenanceForm.value.countdown_seconds
    });
    if (res.data?.status) {
      showMaintenancePrecautionModal.value = false;
      maintenance.value = res.data.data.maintenance;
      toast.success('Emergency maintenance activated. Active users are now being notified and evicted.');
    }
  } catch (err) {
    toast.error(formatErrorMessage(err.response?.data?.message || 'Failed to activate maintenance mode.'));
  } finally {
    isUpdatingMaintenance.value = false;
  }
};

const confirmDeactivateMaintenance = async () => {
  const result = await Swal.fire({
    title: 'Deactivate Maintenance Mode?',
    text: 'Regular users across all roles will immediately be allowed to sign back in.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, Deactivate Now'
  });

  if (result.isConfirmed) {
    isUpdatingMaintenance.value = true;
    try {
      const res = await updateMaintenanceStatus({ active: false });
      if (res.data?.status) {
        maintenance.value = res.data.data.maintenance;
        toast.success('Maintenance mode deactivated. System restored to normal operations.');
      }
    } catch (err) {
      toast.error(formatErrorMessage(err.response?.data?.message || 'Failed to deactivate maintenance mode.'));
    } finally {
      isUpdatingMaintenance.value = false;
    }
  }
};

const openCreateBackupModal = () => {
  backupForm.value.notes = '';
  showCreateBackupModal.value = true;
};

const handleGenerateBackup = async () => {
  isCreatingBackup.value = true;
  try {
    const res = await createBackup({
      category: 'full',
      notes: backupForm.value.notes.trim() || undefined
    });
    if (res.data?.status) {
      showCreateBackupModal.value = false;
      toast.success(res.data.message || 'Full system snapshot created and synced successfully!');
      await loadBackups();
    }
  } catch (err) {
    toast.error(formatErrorMessage(err.response?.data?.message || 'Failed to generate full snapshot.'));
  } finally {
    isCreatingBackup.value = false;
  }
};

const loadBackups = async () => {
  isLoading.value = true;
  try {
    const res = await fetchBackups();
    if (res.data?.status) {
      backups.value = res.data.data.backups || [];
      stats.value = res.data.data.stats || {};
      recentLogs.value = res.data.data.recent_logs || [];
      googleDrive.value = res.data.data.google_drive || {};
      driveForm.value.folderId = googleDrive.value.folder_id || '';
      oauthForm.value.folderId = googleDrive.value.folder_id || '';
      if (googleDrive.value.client_id) {
        oauthForm.value.clientId = googleDrive.value.client_id;
      }
      if (googleDrive.value.auth_type) {
        authTab.value = googleDrive.value.auth_type;
      }
    }
  } catch (err) {
    toast.error(formatErrorMessage(err.response?.data?.message || 'Failed to fetch backups.'));
  } finally {
    isLoading.value = false;
  }
};

// ---------------------------------------------------------
// Backup Actions
// ---------------------------------------------------------
const handleCreateBackup = async () => {
  openCreateBackupModal();
};

const handleDownload = async (item) => {
  try {
    toast.info('Preparing backup file download...');
    const response = await downloadBackup(item.id);
    const mimeType = item.file_name?.endsWith('.zip') ? 'application/zip' : 'application/sql';
    const blob = new Blob([response.data], { type: mimeType });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', item.file_name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    toast.success('Download completed.');
  } catch (err) {
    toast.error(formatErrorMessage(err.response?.data?.message || 'Download failed.'));
  }
};

const handleSyncDrive = async (item) => {
  isSyncingDriveId.value = item.id;
  try {
    const res = await syncBackupToGoogleDrive(item.id);
    if (res.data?.status) {
      toast.success('Successfully synced backup to Google Drive!');
      await loadBackups();
    }
  } catch (err) {
    toast.error(formatErrorMessage(err.response?.data?.message || 'Google Drive sync failed.'));
  } finally {
    isSyncingDriveId.value = null;
  }
};

const handleDelete = async (item) => {
  const result = await Swal.fire({
    title: 'Delete Backup?',
    text: `Are you sure you want to remove ${item.file_name}? This deletes it locally and from Google Drive.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, delete it'
  });

  if (result.isConfirmed) {
    try {
      const res = await deleteBackup(item.id);
      if (res.data?.status) {
        toast.success(res.data.message || 'Backup removed.');
        await loadBackups();
      }
    } catch (err) {
      toast.error(formatErrorMessage(err.response?.data?.message || 'Failed to delete backup.'));
    }
  }
};

// ---------------------------------------------------------
// Restore Modal Handlers
// ---------------------------------------------------------
const openRestoreModal = (item) => {
  selectedBackupForRestore.value = item;
  restoreConfirmationInput.value = '';
  // Default to Local if present on disk, otherwise Google Drive
  if (item.local_exists) {
    restoreStorageSource.value = 'local';
  } else if (item.google_drive_status === 'uploaded') {
    restoreStorageSource.value = 'google_drive';
  } else {
    restoreStorageSource.value = 'auto';
  }
};

const closeRestoreModal = () => {
  if (isRestoring.value) return;
  selectedBackupForRestore.value = null;
  restoreConfirmationInput.value = '';
};

const executeRestore = async () => {
  if (restoreConfirmationInput.value !== 'CONFIRM RESTORE') {
    toast.warning('Please type CONFIRM RESTORE to verify.');
    return;
  }

  isRestoring.value = true;
  try {
    const res = await restoreBackup(
      selectedBackupForRestore.value.id,
      'CONFIRM RESTORE',
      restoreStorageSource.value
    );
    if (res.data?.status) {
      closeRestoreModal();
      await Swal.fire({
        title: 'Restoration Successful!',
        text: res.data.message || 'System state has been restored to the selected snapshot.',
        icon: 'success',
        confirmButtonColor: '#059669'
      });
      await loadBackups();
    }
  } catch (err) {
    toast.error(formatErrorMessage(err.response?.data?.message || 'Restoration failed.'));
  } finally {
    isRestoring.value = false;
  }
};

// ---------------------------------------------------------
// Google Drive Config Handlers
// ---------------------------------------------------------
const openDriveConfigModal = () => {
  driveForm.value.folderId = googleDrive.value.folder_id || '';
  oauthForm.value.folderId = googleDrive.value.folder_id || '';
  if (googleDrive.value.client_id) {
    oauthForm.value.clientId = googleDrive.value.client_id;
  }
  if (googleDrive.value.auth_type) {
    authTab.value = googleDrive.value.auth_type;
  }
  showDriveModal.value = true;
};

const copyRedirectUri = async () => {
  const uri = googleDrive.value.redirect_uri || `${window.location.origin}/api/v1/superadmin/backups/google-oauth-callback`;
  try {
    await navigator.clipboard.writeText(uri);
    hasCopiedRedirectUri.value = true;
    toast.success('Redirect URI copied to clipboard!');
    setTimeout(() => { hasCopiedRedirectUri.value = false; }, 2500);
  } catch {
    toast.warning('Could not copy automatically — please select and copy manually.');
  }
};

const initiateOAuthFlow = async () => {
  if (!oauthForm.value.clientId || !oauthForm.value.clientSecret) {
    toast.warning('Please enter both OAuth Client ID and Client Secret.');
    return;
  }
  isAuthorizingOAuth.value = true;
  try {
    const res = await getGoogleOAuthUrl({
      client_id: oauthForm.value.clientId.trim(),
      client_secret: oauthForm.value.clientSecret.trim(),
      folder_id: oauthForm.value.folderId ? oauthForm.value.folderId.trim() : ''
    });

    if (res.data?.status && res.data.data?.auth_url) {
      toast.info('Redirecting to Google sign-in...');
      window.location.href = res.data.data.auth_url;
    } else {
      toast.error('Failed generating authorization URL.');
    }
  } catch (err) {
    toast.error(formatErrorMessage(err.response?.data?.message || 'Failed to initiate Google authorization.'));
  } finally {
    isAuthorizingOAuth.value = false;
  }
};

const saveOAuthManualConfig = async () => {
  if (!oauthForm.value.clientId || !oauthForm.value.clientSecret) {
    toast.warning('Client ID and Client Secret are required.');
    return;
  }
  isSavingDriveConfig.value = true;
  try {
    const payload = {
      auth_type: 'oauth',
      client_id: oauthForm.value.clientId.trim(),
      client_secret: oauthForm.value.clientSecret.trim(),
      folder_id: oauthForm.value.folderId ? oauthForm.value.folderId.trim() : '',
      refresh_token: oauthForm.value.refreshToken ? oauthForm.value.refreshToken.trim() : ''
    };
    const res = await updateGoogleDriveConfig(payload);
    if (res.data?.status) {
      toast.success(res.data.message || 'Google Drive OAuth settings updated.');
      showDriveModal.value = false;
      await loadBackups();
    }
  } catch (err) {
    toast.error(formatErrorMessage(err.response?.data?.message || 'Failed to update Google Drive configuration.'));
  } finally {
    isSavingDriveConfig.value = false;
  }
};

const handleDriveFileSelected = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  selectedDriveFileName.value = file.name;
  driveForm.value.file = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target?.result);
      if (parsed.web || parsed.installed) {
        const creds = parsed.web || parsed.installed;
        authTab.value = 'oauth';
        if (creds.client_id) oauthForm.value.clientId = creds.client_id;
        if (creds.client_secret) oauthForm.value.clientSecret = creds.client_secret;
        toast.info('OAuth Client credentials detected and auto-populated!');
      } else if (parsed.type === 'service_account') {
        authTab.value = 'service_account';
        driveForm.value.credentialsJson = e.target?.result;
        toast.info('Service Account JSON loaded.');
      }
    } catch {
      toast.warning('Selected file is not valid JSON.');
    }
  };
  reader.readAsText(file);
};

const checkDriveStatus = async () => {
  isTestingDrive.value = true;
  try {
    const res = await getGoogleDriveStatus();
    if (res.data?.status) {
      const info = res.data.data;
      googleDrive.value.connected = info.success;
      googleDrive.value.message = info.message;
      if (info.auth_type) googleDrive.value.auth_type = info.auth_type;
      if (info.service_account_email) googleDrive.value.service_account_email = info.service_account_email;
      if (info.account_email) googleDrive.value.account_email = info.account_email;
      if (info.account_name) googleDrive.value.account_name = info.account_name;
      if (info.storage_limit !== undefined) googleDrive.value.storage_limit = info.storage_limit;
      if (info.storage_usage !== undefined) googleDrive.value.storage_usage = info.storage_usage;
      if (info.success) {
        toast.success(info.message);
      } else {
        toast.warning(formatErrorMessage(info.message));
      }
    }
  } catch (err) {
    toast.error(formatErrorMessage(err.response?.data?.message || 'Drive connection test failed.'));
  } finally {
    isTestingDrive.value = false;
  }
};

const saveDriveConfig = async () => {
  isSavingDriveConfig.value = true;
  try {
    let payload;
    if (driveForm.value.file) {
      payload = new FormData();
      payload.append('credentials_file', driveForm.value.file);
      payload.append('folder_id', driveForm.value.folderId || '');
      payload.append('auth_type', 'service_account');
    } else {
      payload = {
        auth_type: 'service_account',
        folder_id: driveForm.value.folderId || '',
        credentials_json: driveForm.value.credentialsJson || ''
      };
    }

    const res = await updateGoogleDriveConfig(payload);
    if (res.data?.status) {
      toast.success(res.data.message || 'Google Drive configuration updated.');
      showDriveModal.value = false;
      await loadBackups();
    }
  } catch (err) {
    toast.error(formatErrorMessage(err.response?.data?.message || 'Failed to update Google Drive configuration.'));
  } finally {
    isSavingDriveConfig.value = false;
  }
};

// ---------------------------------------------------------
// External Upload & Restore Handlers
// ---------------------------------------------------------
const openUploadModal = () => {
  showUploadModal.value = true;
  selectedUploadFile.value = null;
  uploadRestoreConfirmation.value = '';
};

const handleUploadFileChange = (e) => {
  selectedUploadFile.value = e.target.files[0] || null;
};

const executeUploadRestore = async () => {
  if (!selectedUploadFile.value) {
    toast.warning('Please select a .SQL dump file.');
    return;
  }
  if (uploadRestoreConfirmation.value !== 'CONFIRM RESTORE') {
    toast.warning('Type CONFIRM RESTORE to proceed.');
    return;
  }

  isUploadingRestore.value = true;
  try {
    const formData = new FormData();
    formData.append('backup_file', selectedUploadFile.value);
    formData.append('confirmation', 'CONFIRM RESTORE');

    const res = await restoreFromUpload(formData);
    if (res.data?.status) {
      showUploadModal.value = false;
      await Swal.fire({
        title: 'Restoration Completed!',
        text: res.data.message || 'The uploaded snapshot has been executed into the database.',
        icon: 'success',
        confirmButtonColor: '#059669'
      });
      await loadBackups();
    }
  } catch (err) {
    toast.error(formatErrorMessage(err.response?.data?.message || 'Uploaded restoration failed.'));
  } finally {
    isUploadingRestore.value = false;
  }
};

// ---------------------------------------------------------
// Service Account Email Clipboard Copy
// ---------------------------------------------------------
const copyServiceAccountEmail = async () => {
  if (!detectedServiceAccountEmail.value) return;
  try {
    await navigator.clipboard.writeText(detectedServiceAccountEmail.value);
    hasCopiedEmail.value = true;
    toast.success('Service Account email copied to clipboard!');
    setTimeout(() => { hasCopiedEmail.value = false; }, 2500);
  } catch {
    toast.warning('Could not copy — please select and copy manually.');
  }
};

// ---------------------------------------------------------
// Formatting Utilities
// ---------------------------------------------------------

/**
 * Sanitize raw API/Google error strings so toasts never dump raw JSON.
 * If the message looks like a JSON blob, extract the human-readable part.
 */
const formatErrorMessage = (raw) => {
  if (!raw || typeof raw !== 'string') return raw || 'An unexpected error occurred.';
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return trimmed;
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed?.error?.message) return parsed.error.message;
    if (parsed?.message) return parsed.message;
  } catch { /* not valid JSON, fall through */ }
  return trimmed.length > 200 ? trimmed.substring(0, 200) + '…' : trimmed;
};

const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
