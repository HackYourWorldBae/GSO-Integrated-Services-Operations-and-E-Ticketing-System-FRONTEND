<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-sm sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
        {{ unitCode }} Settings
      </h2>
    </template>

    <template #main-content>
      <div class="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
        <!-- Acting Unit Head Coverage Active Banner -->
        <div
          v-if="authStore.isActingHead"
          class="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-md border border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 font-black flex items-center justify-center shrink-0 shadow-xs">
              ★
            </div>
            <div>
              <h4 class="text-sm font-black text-white">Acting Unit Head Mode Active</h4>
              <p class="text-xs text-amber-100 font-medium mt-0.5">
                You are currently managing <strong>{{ unitCode }}</strong> on behalf of the Unit Head as <strong>Director {{ authStore.fullName }}</strong>. All actions are logged under your Director audit log.
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="handleRevertToDirector"
            :disabled="isReverting"
            class="px-4 py-2.5 bg-white hover:bg-amber-50 text-amber-950 text-xs font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 w-full sm:w-auto"
          >
            <svg v-if="!isReverting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span v-else class="animate-spin h-3.5 w-3.5 border-2 border-amber-900 border-t-transparent rounded-full"></span>
            <span>{{ isReverting ? 'Returning...' : 'Return to Director Dashboard' }}</span>
          </button>
        </div>

        <!-- Profile Form Card -->
        <div data-tour="admin-settings-profile" class="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <div class="p-5 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div class="flex items-center gap-4">
              <div class="relative group cursor-pointer shrink-0" @click="triggerAvatarUpload" title="Click to change profile picture">
                <input
                  type="file"
                  ref="avatarInputRef"
                  accept="image/png,image/jpeg,image/webp"
                  class="hidden"
                  @change="handleAvatarFileChange"
                />
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] overflow-hidden bg-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-700/20 border-2 border-emerald-500/40">
                  <img v-if="avatarPreviewUrl" :src="avatarPreviewUrl" alt="Avatar" class="w-full h-full object-cover" />
                  <span v-else class="text-xl sm:text-2xl font-black">{{ form.firstName ? form.firstName.charAt(0).toUpperCase() : 'A' }}</span>
                </div>
                <div class="absolute -bottom-1.5 -right-1.5 p-1.5 bg-white rounded-xl shadow-md border border-slate-200 text-slate-600 hover:text-emerald-600 transition-all group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">{{ unitCode }} Administrator Profile</h3>
                </div>
                <p class="text-xs text-slate-500 font-medium mt-0.5">Manage operational profile details and credentials for {{ unitCode }} admin</p>
              </div>
            </div>

            <div class="flex items-center gap-2 self-start sm:self-auto">
              <span class="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-700">
                {{ unitCode }} Admin Portal
              </span>
            </div>
          </div>

          <div class="p-5 sm:p-8 md:p-12 space-y-6 sm:space-y-10">
            <!-- Account Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
              <!-- First Name -->
              <div class="space-y-2.5 md:col-span-5">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">First Name</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.firstName"
                    type="text"
                    class="block w-full pl-11 pr-4 py-3 sm:py-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    placeholder="Enter first name"
                  />
                </div>
              </div>

              <!-- Last Name -->
              <div class="space-y-2.5 md:col-span-5">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Last Name</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.lastName"
                    type="text"
                    class="block w-full pl-11 pr-4 py-3 sm:py-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <!-- Name Extension -->
              <div class="space-y-2.5 md:col-span-2">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1 truncate" title="Name Extension / Suffix (e.g. Jr., Sr., III)">Suffix / Ext.</label>
                <div class="relative group">
                  <select
                    v-model="form.nameExtensionSelection"
                    class="block w-full pl-3 pr-8 py-3 sm:py-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">None</option>
                    <option v-for="ext in STANDARD_NAME_EXTENSIONS" :key="ext" :value="ext">{{ ext }}</option>
                    <option value="OTHER">Other...</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Custom Name Extension if OTHER -->
              <div v-if="form.nameExtensionSelection === 'OTHER'" class="space-y-2.5 md:col-span-12 animate-fade-in">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Specify Name Extension</label>
                <input
                  v-model="form.customExtension"
                  type="text"
                  maxlength="20"
                  placeholder="e.g. Jr., III, IV, etc."
                  class="block w-full px-4 py-3 sm:py-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                />
              </div>

              <!-- Email Address -->
              <div class="space-y-2.5 md:col-span-12">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Email Address</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.email"
                    type="email"
                    class="block w-full pl-11 pr-4 py-3 sm:py-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    placeholder="admin@bsu.edu.ph"
                  />
                </div>
                <p class="text-[11px] text-slate-400 font-medium ml-1">Official operational unit administrator email address. Used for login and system notifications.</p>
              </div>

              <!-- Email Notifications Toggle -->
              <div class="md:col-span-12 p-4 rounded-2xl border flex items-start gap-3.5 transition-colors" :class="form.emailNotificationsEnabled ? 'bg-emerald-50/60 border-emerald-200/70' : 'bg-slate-50 border-slate-200'">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs" :class="form.emailNotificationsEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-400 text-white'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0 space-y-1">
                  <div class="flex items-center justify-between gap-3">
                    <h4 class="text-xs font-black uppercase tracking-wider" :class="form.emailNotificationsEnabled ? 'text-emerald-900' : 'text-slate-700'">Email Notifications</h4>
                    <label class="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" v-model="form.emailNotificationsEnabled" class="sr-only peer" />
                      <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <p class="text-xs leading-relaxed font-medium" :class="form.emailNotificationsEnabled ? 'text-emerald-800/80' : 'text-slate-500'">
                    <span v-if="unitCode === 'SSU'">Critical for SSU incident reporting — when on, new Incident Reports trigger an immediate high-priority email to <span class="font-bold">{{ form.email || 'your email' }}</span> alongside the dashboard alert.</span>
                    <span v-else>When on, automated unit ticket dispatches and system escalation alerts are sent to <span class="font-bold">{{ form.email || 'your email' }}</span>.</span>
                  </p>
                  <p v-if="!form.emailNotificationsEnabled" class="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                    Email alerts are paused — you will not receive ticket update or dispatch emails until re-enabled.
                  </p>
                </div>
              </div>

              <!-- Two-Factor Authentication (MFA with Email OTP) Toggle -->
              <div class="md:col-span-12 p-4 rounded-2xl border flex items-start gap-3.5 transition-colors" :class="form.isMfaEnabled ? 'bg-emerald-50/60 border-emerald-200/70' : 'bg-slate-50 border-slate-200'">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs" :class="form.isMfaEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-400 text-white'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0 space-y-1">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs font-black uppercase tracking-wider" :class="form.isMfaEnabled ? 'text-emerald-900' : 'text-slate-700'">Two-Factor Authentication (Email OTP)</h4>
                      <span v-if="form.isMfaEnabled" class="px-2 py-0.5 bg-emerald-200/80 text-emerald-900 text-[10px] font-black uppercase tracking-wider rounded-md">Enabled</span>
                      <span v-else class="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-md">Off</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" v-model="form.isMfaEnabled" class="sr-only peer" />
                      <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <p class="text-xs leading-relaxed font-medium" :class="form.isMfaEnabled ? 'text-emerald-800/80' : 'text-slate-500'">
                    When enabled, administrator sign-in requires both your password and a 6-digit one-time verification code dispatched to <span class="font-bold">{{ form.email || 'your email' }}</span>.
                  </p>
                  <p v-if="!form.isMfaEnabled" class="text-[11px] font-medium text-slate-500">
                    Two-factor authentication is currently disabled. Recommended for administrative accounts.
                  </p>
                </div>
              </div>

              <!-- New Password -->
              <div class="space-y-2.5 md:col-span-6">
                <label class="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">New Password</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="block w-full pl-11 pr-12 py-3 sm:py-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    placeholder="Leave blank to keep current"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer touch-manipulation min-h-[44px]"
                    aria-label="Toggle password visibility"
                  >
                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 013.111-5.184M9.9 4.314A10.198 10.198 0 0112 4c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l3.59 3.59m0 0A9.956 9.956 0 016.59 2.59M9 13a3 3 0 013-3m0 3a1.5 1.5 0 011.5 1.5" />
                    </svg>
                  </button>
                </div>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Minimum 8 characters if changing.</p>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-2.5 md:col-span-6">
                <div class="flex items-center justify-between ml-1">
                  <label class="block text-xs font-black text-slate-800 uppercase tracking-widest">Confirm Password</label>
                  <span v-if="form.password && form.confirmPassword" class="text-xs font-bold" :class="form.password === form.confirmPassword ? 'text-emerald-600' : 'text-rose-500'">
                    {{ form.password === form.confirmPassword ? '✓ Passwords match' : '✕ Do not match' }}
                  </span>
                </div>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    class="block w-full pl-11 pr-4 py-3 sm:py-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    placeholder="Re-type new password"
                  />
                </div>
              </div>
            </div>

            <!-- Official Digital Signature Section -->
            <div data-tour="admin-settings-signature" class="space-y-3">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 class="text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Official Digital Signature</h4>
                  <p class="text-xs text-slate-500 font-medium ml-1">
                    Applied automatically to {{ unitCode }} Job Orders, Request Slips, and archived documents.
                  </p>
                </div>
                <button
                  type="button"
                  @click="showSignatureModal = true"
                  class="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-emerald-50 hover:border-emerald-500 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer touch-manipulation min-h-[36px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>{{ currentSignatureUrl ? 'Change Signature' : 'Add Signature' }}</span>
                </button>
              </div>

              <!-- Signature Preview Card -->
              <div
                v-if="currentSignatureUrl"
                class="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div class="flex items-center gap-4 w-full sm:w-auto">
                  <div
                    class="w-36 h-20 rounded-xl border border-slate-300 bg-white flex items-center justify-center p-2 relative shadow-xs shrink-0 overflow-hidden"
                    :style="{
                      backgroundImage: 'radial-gradient(#cbd5e1 0.75px, transparent 0.75px)',
                      backgroundSize: '12px 12px'
                    }"
                  >
                    <img
                      :src="currentSignatureUrl"
                      alt="Official Signature"
                      class="max-h-full max-w-full object-contain filter drop-shadow-xs"
                    />
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                        <svg class="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                        Signature Active
                      </span>
                    </div>
                    <p class="text-xs font-bold text-slate-700">Official signee on {{ unitCode }} job orders</p>
                    <p class="text-[11px] text-slate-400 font-medium">Auto-rendered above your designated signature line</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    @click="showSignatureModal = true"
                    class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer min-h-[36px]"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    @click="handleRemoveSignature"
                    :disabled="isRemovingSignature"
                    class="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer min-h-[36px]"
                  >
                    {{ isRemovingSignature ? 'Removing...' : 'Remove' }}
                  </button>
                </div>
              </div>

              <!-- Empty State -->
              <div
                v-else
                @click="showSignatureModal = true"
                class="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/20 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all cursor-pointer group"
              >
                <div class="flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row">
                  <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-300 flex items-center justify-center shadow-xs transition-colors shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <h5 class="text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-emerald-900 transition-colors">
                      No official signature registered
                    </h5>
                    <p class="text-xs text-slate-500 font-medium">
                      Draw on screen or upload a transparent PNG image (.png) of your signature.
                    </p>
                  </div>
                </div>
                <span class="px-4 py-2 rounded-xl bg-white border border-slate-200 group-hover:border-emerald-500 text-slate-700 group-hover:text-emerald-700 text-xs font-bold shadow-2xs transition-all shrink-0">
                  + Add Signature
                </span>
              </div>
            </div>

            <!-- Unit Assignment Callout -->
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
              <div class="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div class="space-y-0.5">
                <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">{{ unitFullName }} Jurisdiction</h4>
                <p class="text-xs text-slate-600 leading-relaxed font-medium">
                  Your operational administrator role permits ticket dispatch, worker scheduling, job liquidation, and inventory management strictly within the {{ unitCode }} branch.
                </p>
              </div>
            </div>
          </div>

          <!-- Bottom Action Bar -->
          <div class="p-4 sm:p-8 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end">
            <button
              data-tour="admin-settings-btn-save"
              type="button"
              @click="handleSave"
              :disabled="isSaving"
              class="w-full sm:w-auto min-h-[44px] touch-manipulation px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <svg v-if="!isSaving" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSaving ? 'Saving Changes...' : 'Save Changes' }}</span>
            </button>
          </div>
        </div>

        <!-- Signature Pad & Upload Modal -->
        <SignatureManagerModal
          v-model:isOpen="showSignatureModal"
          @saved="onSignatureSaved"
        />
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import SignatureManagerModal from '@/components/common/SignatureManagerModal.vue';
import api from '@/api/client';
import { toast } from 'vue3-toastify';
import { clearSignatureCache } from '@/utils/signatureUtils';
import { STANDARD_NAME_EXTENSIONS } from '@/constants/nameExtensions';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const avatarInputRef = ref(null);
const avatarPreviewUrl = ref(null);
const showSignatureModal = ref(false);
const isRemovingSignature = ref(false);
const signatureTimestamp = ref(Date.now());
const isReverting = ref(false);

const handleRevertToDirector = async () => {
  if (isReverting.value) return;
  isReverting.value = true;
  try {
    const res = await authStore.revertToDirector();
    if (res.success) {
      toast.success(res.message);
      router.push(res.redirectUrl || '/director/dashboard');
    } else {
      toast.error(res.message || 'Failed to return to Director dashboard.');
    }
  } catch (err) {
    console.error('Failed to revert to director dashboard:', err);
    toast.error('An error occurred while returning to Director dashboard.');
  } finally {
    isReverting.value = false;
  }
};

const form = ref({
  firstName: '',
  lastName: '',
  nameExtensionSelection: '',
  customExtension: '',
  email: '',
  emailNotificationsEnabled: false,
  isMfaEnabled: false,
  password: '',
  confirmPassword: '',
});

const showPassword = ref(false);
const isSaving = ref(false);

const unitCode = computed(() => {
  const path = route.path.toLowerCase();
  if (path.includes('/leau')) return 'LEAU';
  if (path.includes('/ssu')) return 'SSU';
  if (path.includes('/fgmu')) return 'FGMU';

  const unitId = Number(authStore.unitId ?? authStore.user?.unit_id ?? 0);
  if (unitId === 2) return 'LEAU';
  if (unitId === 3) return 'SSU';
  return 'FGMU';
});

const unitFullName = computed(() => {
  switch (unitCode.value) {
    case 'LEAU': return 'Landscaping & Environmental Aesthetics Unit';
    case 'SSU': return 'Special Services Unit';
    default: return 'Facilities & Grounds Maintenance Unit';
  }
});

onMounted(() => {
  const user = authStore.user;
  if (user) {
    form.value.firstName = user.first_name || '';
    form.value.lastName  = user.last_name  || '';
    const ext = (user.name_extension || '').trim();
    if (STANDARD_NAME_EXTENSIONS.includes(ext) || ext === '') {
      form.value.nameExtensionSelection = ext;
      form.value.customExtension = '';
    } else {
      form.value.nameExtensionSelection = 'OTHER';
      form.value.customExtension = ext;
    }
    form.value.email     = user.email      || '';
    form.value.emailNotificationsEnabled = Boolean(user.email_notifications_enabled === 1 || user.email_notifications_enabled === '1' || user.email_notifications_enabled === true);
    form.value.isMfaEnabled = Boolean(user.is_mfa_enabled === 1 || user.is_mfa_enabled === '1' || user.is_mfa_enabled === true);
    if (user.avatar_path) {
      avatarPreviewUrl.value = `/api/v1/auth/avatar/${user.id}?t=${Date.now()}`;
    }
  }
});

const triggerAvatarUpload = () => {
  avatarInputRef.value?.click();
};

const handleAvatarFileChange = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    toast.error('Only JPG, PNG, and WebP images are allowed.');
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    toast.error('Image size must be less than 3MB.');
    return;
  }

  avatarPreviewUrl.value = URL.createObjectURL(file);

  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data?.data?.user) {
      authStore.user = res.data.data.user;
      toast.success('Profile avatar updated successfully!');
    }
  } catch (err) {
    console.error('Failed to upload avatar:', err);
    toast.error(err.response?.data?.message || 'Failed to upload avatar image.');
  }
};

const currentSignatureUrl = computed(() => {
  const user = authStore.user;
  if (!user || (!user.signature_path && !user.signature_url)) return null;
  const raw = user.signature_url || `/api/v1/auth/signature/${user.id}`;
  if (raw.startsWith('data:')) return raw;
  const clean = raw.split('?')[0];
  return `${clean}?t=${signatureTimestamp.value}`;
});

const onSignatureSaved = (url) => {
  signatureTimestamp.value = Date.now();
  if (authStore.user) {
    authStore.user.signature_url = url;
    authStore.user.signature_path = 'saved';
  }
};

const handleRemoveSignature = async () => {
  if (!confirm('Are you sure you want to remove your official digital signature?')) return;
  isRemovingSignature.value = true;
  try {
    const res = await api.delete('/auth/signature');
    if (res.data?.data?.user) {
      authStore.user = res.data.data.user;
    } else if (authStore.user) {
      authStore.user.signature_path = null;
      authStore.user.signature_url = null;
    }
    clearSignatureCache();
    toast.success('Official signature removed.');
  } catch (err) {
    console.error('Failed to remove signature:', err);
    toast.error('Failed to remove signature.');
  } finally {
    isRemovingSignature.value = false;
  }
};

const handleSave = async () => {
  if (form.value.password) {
    if (form.value.password.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (form.value.password !== form.value.confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
  }

  const emailChanged = (form.value.email || '').trim().toLowerCase() !== (authStore.user?.email || '').trim().toLowerCase();
  if (emailChanged && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((form.value.email || '').trim())) {
    toast.error('Please enter a valid email address.');
    return;
  }

  isSaving.value = true;
  try {
    const finalExtension = form.value.nameExtensionSelection === 'OTHER'
      ? form.value.customExtension.trim()
      : form.value.nameExtensionSelection.trim();

    const payload = {
      first_name: form.value.firstName,
      last_name:  form.value.lastName,
      name_extension: finalExtension || null,
      email_notifications_enabled: form.value.emailNotificationsEnabled ? 1 : 0,
      is_mfa_enabled: form.value.isMfaEnabled ? 1 : 0,
    };
    if (emailChanged) {
      payload.email = form.value.email.trim().toLowerCase();
    }
    const result = await authStore.updateProfile(payload);
    
    if (form.value.password) {
      await api.post('/auth/change-password', {
        new_password: form.value.password,
        new_password_confirm: form.value.confirmPassword,
      });
      form.value.password = '';
      form.value.confirmPassword = '';
    }

    if (result.success) {
      toast.success(`${unitCode.value} Admin profile updated successfully!`);
    } else {
      toast.error(result.message || 'Failed to update profile.');
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update profile.');
  } finally {
    isSaving.value = false;
  }
};
</script>
