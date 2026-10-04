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

            <!-- Upload SQL Dump Button -->
            <button
              @click="openUploadModal"
              type="button"
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Upload .SQL Dump</span>
            </button>

            <!-- Create Full Backup Now Button -->
            <button
              @click="handleCreateBackup"
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
              <span>{{ isCreatingBackup ? 'Generating Backup...' : 'Create Backup Now' }}</span>
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
                        <div class="font-bold text-slate-900 font-mono text-xs flex items-center gap-2">
                          <span>{{ item.file_name }}</span>
                          <span class="px-2 py-0.5 rounded text-[10px] font-sans font-semibold uppercase tracking-wider" :class="item.backup_type === 'manual' ? 'bg-slate-100 text-slate-700' : 'bg-blue-100 text-blue-700'">
                            {{ item.backup_type }}
                          </span>
                        </div>
                        <p class="text-xs text-slate-500 mt-0.5">{{ item.notes || 'Full database snapshot' }}</p>
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

      </div>

      <!-- ======================================================== -->
      <!-- MODAL 1: Two-Step Safe Restore Confirmation Modal       -->
      <!-- ======================================================== -->
      <Teleport to="body">
        <div 
          v-if="selectedBackupForRestore" 
          class="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 pointer-events-auto overflow-y-auto animate-fade-in"
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
                <h3 class="text-lg font-black text-slate-900 tracking-tight">Database Restoration Warning</h3>
                <p class="text-xs text-red-600 font-bold uppercase tracking-wider">Destructive State Rollback</p>
              </div>
            </div>

            <div class="bg-red-50 border border-red-200/80 rounded-2xl p-4 text-xs text-red-900 space-y-2 leading-relaxed">
              <p>
                You are about to roll back the entire MySQL database to the state recorded in snapshot:
              </p>
              <div class="p-2.5 bg-white/80 rounded-xl border border-red-200 font-mono text-[11px] font-bold text-slate-800 break-all">
                {{ selectedBackupForRestore.file_name }}
              </div>
              <p class="font-bold text-red-700">
                Any tickets, accounts, logs, or attachments created after this snapshot will be permanently overwritten.
              </p>
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
                <span>{{ isRestoring ? 'Restoring Database...' : 'Execute Restoration' }}</span>
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
          class="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 pointer-events-auto overflow-y-auto animate-fade-in"
          @click.self="showDriveModal = false"
        >
          <div 
            class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scale-up max-h-[calc(100dvh-3rem)] sm:max-h-[88vh] overflow-y-auto custom-scrollbar my-auto pointer-events-auto"
            @click.stop
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-900">Google Drive Cloud Setup</h3>
                  <p class="text-xs text-slate-500">Attach Service Account credentials for automated Drive uploads</p>
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
              <div class="flex items-center gap-2.5">
                <span class="w-3 h-3 rounded-full" :class="googleDrive.connected ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                <div>
                  <h4 class="text-xs font-bold text-slate-900">{{ googleDrive.connected ? 'Google Drive Active' : 'Not Connected' }}</h4>
                  <p class="text-[11px] text-slate-500">{{ googleDrive.message }}</p>
                </div>
              </div>
              <button
                @click="checkDriveStatus"
                :disabled="isTestingDrive"
                type="button"
                class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <svg :class="{ 'animate-spin': isTestingDrive }" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Test Now</span>
              </button>
            </div>

            <div class="space-y-4">
              <!-- Target Folder ID -->
              <div>
                <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Google Drive Folder ID (Optional)
                </label>
                <input
                  v-model="driveForm.folderId"
                  type="text"
                  placeholder="e.g. 1a2B3c4D5e6F7g8H9i"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                />
                <p class="text-[11px] text-slate-400 mt-1">Leave blank to store in root, or copy the ID from the folder URL in your browser.</p>
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
                  rows="4"
                  placeholder='{"type": "service_account", "project_id": "...", "private_key": "..."}'
                  class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none"
                ></textarea>
              </div>
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
      </Teleport>

      <!-- ======================================================== -->
      <!-- MODAL 3: Upload External SQL Dump Modal                 -->
      <!-- ======================================================== -->
      <Teleport to="body">
        <div 
          v-if="showUploadModal" 
          class="fixed inset-0 z-[150] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 pointer-events-auto overflow-y-auto animate-fade-in"
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
                  <h3 class="text-base font-extrabold text-slate-900">Upload &amp; Restore .SQL Dump</h3>
                  <p class="text-xs text-slate-500">Restore database from an offline or external snapshot</p>
                </div>
              </div>
              <button @click="showUploadModal = false" class="text-slate-400 hover:text-slate-600 p-2 cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Select .SQL File
                </label>
                <input
                  type="file"
                  ref="uploadSqlFileInput"
                  accept=".sql"
                  class="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-emerald-600 cursor-pointer"
                  @change="handleUploadFileChange"
                />
              </div>

              <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
                <p class="font-bold">Caution:</p>
                <p class="mt-0.5">Uploading will immediately execute the SQL dump into your active database. Type confirmation below.</p>
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

    </template>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
  updateGoogleDriveConfig
} from '@/api/backup';
import { toast } from 'vue3-toastify';
import Swal from 'sweetalert2';

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
  folder_id: ''
});

const isLoading = ref(false);
const isCreatingBackup = ref(false);
const isSyncingDriveId = ref(null);

// Restore Modal State
const selectedBackupForRestore = ref(null);
const restoreConfirmationInput = ref('');
const isRestoring = ref(false);

// Google Drive Config Modal State
const showDriveModal = ref(false);
const isTestingDrive = ref(false);
const isSavingDriveConfig = ref(false);
const driveJsonFileInput = ref(null);
const selectedDriveFileName = ref('');
const driveForm = ref({
  folderId: '',
  credentialsJson: '',
  file: null
});

// Upload SQL Dump Modal State
const showUploadModal = ref(false);
const uploadSqlFileInput = ref(null);
const selectedUploadFile = ref(null);
const uploadRestoreConfirmation = ref('');
const isUploadingRestore = ref(false);

// ---------------------------------------------------------
// Lifecycle & Data Fetching
// ---------------------------------------------------------
onMounted(() => {
  loadBackups();
});

const loadBackups = async () => {
  isLoading.value = true;
  try {
    const res = await fetchBackups();
    if (res.data?.status) {
      backups.value = res.data.data.backups || [];
      stats.value = res.data.data.stats || {};
      googleDrive.value = res.data.data.google_drive || {};
      driveForm.value.folderId = googleDrive.value.folder_id || '';
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to fetch backups.');
  } finally {
    isLoading.value = false;
  }
};

// ---------------------------------------------------------
// Backup Actions
// ---------------------------------------------------------
const handleCreateBackup = async () => {
  isCreatingBackup.value = true;
  try {
    const res = await createBackup({ notes: 'On-demand manual snapshot' });
    if (res.data?.status) {
      toast.success(res.data.message || 'Database snapshot created successfully!');
      await loadBackups();
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to generate database backup.');
  } finally {
    isCreatingBackup.value = false;
  }
};

const handleDownload = async (item) => {
  try {
    toast.info('Preparing backup file download...');
    const response = await downloadBackup(item.id);
    const blob = new Blob([response.data], { type: 'application/sql' });
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
    toast.error(err.response?.data?.message || 'Download failed.');
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
    toast.error(err.response?.data?.message || 'Google Drive sync failed.');
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
      toast.error(err.response?.data?.message || 'Failed to delete backup.');
    }
  }
};

// ---------------------------------------------------------
// Restore Modal Handlers
// ---------------------------------------------------------
const openRestoreModal = (item) => {
  selectedBackupForRestore.value = item;
  restoreConfirmationInput.value = '';
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
    const res = await restoreBackup(selectedBackupForRestore.value.id, 'CONFIRM RESTORE');
    if (res.data?.status) {
      closeRestoreModal();
      await Swal.fire({
        title: 'Restoration Successful!',
        text: res.data.message || 'Database has been restored to the selected snapshot.',
        icon: 'success',
        confirmButtonColor: '#059669'
      });
      await loadBackups();
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Restoration failed.');
  } finally {
    isRestoring.value = false;
  }
};

// ---------------------------------------------------------
// Google Drive Config Handlers
// ---------------------------------------------------------
const openDriveConfigModal = () => {
  showDriveModal.value = true;
};

const handleDriveFileSelected = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  selectedDriveFileName.value = file.name;
  driveForm.value.file = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    driveForm.value.credentialsJson = e.target.result;
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
      if (info.success) {
        toast.success(info.message);
      } else {
        toast.warning(info.message);
      }
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Drive connection test failed.');
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
    } else {
      payload = {
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
    toast.error(err.response?.data?.message || 'Failed to update Google Drive configuration.');
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
    toast.error(err.response?.data?.message || 'Uploaded restoration failed.');
  } finally {
    isUploadingRestore.value = false;
  }
};

// ---------------------------------------------------------
// Formatting Utilities
// ---------------------------------------------------------
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
