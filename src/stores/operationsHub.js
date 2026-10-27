import { defineStore } from 'pinia';
import api from '@/api/client';
import { configureWorkCalendar } from '@/utils/workCalendar';
import { COMMON_MATERIALS } from '@/constants/materials';

export const useOperationsHubStore = defineStore('operationsHub', {
  state: () => ({
    workingHours: {
      work_start_time: '08:00',
      work_end_time: '17:00',
      lunch_start_time: '12:00',
      lunch_end_time: '13:00',
      standard_daily_hours: 8.0,
    },
    holidays: [],
    materials: [...COMMON_MATERIALS],
    categories: {
      FGMU: [],
      LEAU: [],
    },
    isLoading: false,
    isSaving: false,
    isInitialized: false,
  }),

  getters: {
    fgmuMaterials: (state) => {
      const list = state.materials.filter(m => (m.unit_code || '').toUpperCase() === 'FGMU');
      return list.length > 0 ? list : COMMON_MATERIALS.filter(m => m.unit_code === 'FGMU');
    },

    leauMaterials: (state) => {
      const list = state.materials.filter(m => (m.unit_code || '').toUpperCase() === 'LEAU');
      return list.length > 0 ? list : COMMON_MATERIALS.filter(m => m.unit_code === 'LEAU');
    },

    materialsByUnit: (state) => (unit = 'ALL') => {
      const norm = String(unit || 'ALL').toUpperCase().trim();
      if (norm === 'FGMU') {
        const list = state.materials.filter(m => (m.unit_code || '').toUpperCase() === 'FGMU');
        return list.length > 0 ? list : COMMON_MATERIALS.filter(m => m.unit_code === 'FGMU');
      }
      if (norm === 'LEAU') {
        const list = state.materials.filter(m => (m.unit_code || '').toUpperCase() === 'LEAU');
        return list.length > 0 ? list : COMMON_MATERIALS.filter(m => m.unit_code === 'LEAU');
      }
      return state.materials.length > 0 ? state.materials : COMMON_MATERIALS;
    },

    materialNamesByUnit: (state) => (unit = 'ALL') => {
      const norm = String(unit || 'ALL').toUpperCase().trim();
      let source = state.materials;
      if (norm === 'FGMU') {
        source = state.materials.filter(m => (m.unit_code || '').toUpperCase() === 'FGMU');
        if (source.length === 0) source = COMMON_MATERIALS.filter(m => m.unit_code === 'FGMU');
      } else if (norm === 'LEAU') {
        source = state.materials.filter(m => (m.unit_code || '').toUpperCase() === 'LEAU');
        if (source.length === 0) source = COMMON_MATERIALS.filter(m => m.unit_code === 'LEAU');
      } else {
        if (source.length === 0) source = COMMON_MATERIALS;
      }
      return source.map(m => m.name).sort();
    },

    categoriesByUnit: (state) => (unit = 'ALL') => {
      const norm = String(unit || 'ALL').toUpperCase().trim();
      let source = state.materials;
      if (norm === 'FGMU' || norm === 'LEAU') {
        source = state.materials.filter(m => (m.unit_code || '').toUpperCase() === norm);
      }
      if (source.length === 0) {
        source = norm === 'ALL' ? COMMON_MATERIALS : COMMON_MATERIALS.filter(m => m.unit_code === norm);
      }
      return Array.from(new Set(source.map(m => m.category).filter(Boolean))).sort();
    },

    getMaterialInfo: (state) => (name, unit = 'ALL') => {
      if (!name) return null;
      const target = String(name).toLowerCase().trim();
      const norm = String(unit || 'ALL').toUpperCase().trim();

      let pool = state.materials;
      if (norm === 'FGMU' || norm === 'LEAU') {
        const filtered = pool.filter(m => (m.unit_code || '').toUpperCase() === norm);
        if (filtered.length > 0) pool = filtered;
      }

      const match = pool.find(m => (m.name || '').toLowerCase() === target) ||
                    COMMON_MATERIALS.find(m => (m.name || '').toLowerCase() === target);
      return match || null;
    },

    getDefaultUnit: (state) => (name, unit = 'ALL') => {
      if (!name) return 'pcs';
      const target = String(name).toLowerCase().trim();
      const norm = String(unit || 'ALL').toUpperCase().trim();

      let pool = state.materials;
      if (norm === 'FGMU' || norm === 'LEAU') {
        const filtered = pool.filter(m => (m.unit_code || '').toUpperCase() === norm);
        if (filtered.length > 0) pool = filtered;
      }

      const match = pool.find(m => (m.name || '').toLowerCase() === target) ||
                    COMMON_MATERIALS.find(m => (m.name || '').toLowerCase() === target);
      return match?.unit || 'pcs';
    },

    getDefaultPrice: (state) => (name, unit = 'ALL') => {
      if (!name) return 0;
      const target = String(name).toLowerCase().trim();
      const norm = String(unit || 'ALL').toUpperCase().trim();

      let pool = state.materials;
      if (norm === 'FGMU' || norm === 'LEAU') {
        const filtered = pool.filter(m => (m.unit_code || '').toUpperCase() === norm);
        if (filtered.length > 0) pool = filtered;
      }

      const match = pool.find(m => (m.name || '').toLowerCase() === target) ||
                    COMMON_MATERIALS.find(m => (m.name || '').toLowerCase() === target);
      return match?.default_price ? Number(match.default_price) : 0;
    },
  },

  actions: {
    /**
     * Initializes the central operations configuration from the backend.
     */
    async initOperationsHub(forceRefresh = false) {
      if (this.isInitialized && !forceRefresh) return;
      this.isLoading = true;
      try {
        const [configRes, materialsRes] = await Promise.allSettled([
          api.get('operations/config'),
          api.get('operations/materials', { params: { unit: 'ALL' } }),
        ]);

        if (configRes.status === 'fulfilled' && configRes.value?.data?.data) {
          const cfg = configRes.value.data.data;
          if (cfg.working_hours) {
            this.workingHours = { ...this.workingHours, ...cfg.working_hours };
          }
          if (Array.isArray(cfg.holidays)) {
            this.holidays = cfg.holidays;
          }
        }

        if (materialsRes.status === 'fulfilled' && materialsRes.value?.data?.data) {
          const mData = materialsRes.value.data.data;
          if (Array.isArray(mData.materials) && mData.materials.length > 0) {
            this.materials = mData.materials;
          }
          if (mData.categories) {
            this.categories = mData.categories;
          }
        }

        // Synchronize workCalendar.js calculations with the loaded config
        configureWorkCalendar({
          work_start_time: this.workingHours.work_start_time,
          work_end_time: this.workingHours.work_end_time,
          lunch_start_time: this.workingHours.lunch_start_time,
          lunch_end_time: this.workingHours.lunch_end_time,
          standard_daily_hours: this.workingHours.standard_daily_hours,
          holidays: this.holidays,
        });

        this.isInitialized = true;
      } catch (err) {
        console.warn('Could not sync operations config from backend, using baseline defaults:', err);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch materials catalog from API
     */
    async fetchMaterials(unit = 'ALL', search = '', category = '') {
      try {
        const params = { unit };
        if (search) params.search = search;
        if (category) params.category = category;
        const res = await api.get('operations/materials', { params });
        if (res.data?.data?.materials) {
          if (unit === 'ALL' && !search && !category) {
            this.materials = res.data.data.materials;
          }
          return res.data.data.materials;
        }
      } catch (err) {
        console.error('Failed to fetch materials:', err);
      }
      return this.materialsByUnit(unit);
    },

    /**
     * Create a new material
     */
    async saveMaterial(materialData) {
      this.isSaving = true;
      try {
        const res = await api.post('operations/materials', materialData);
        if (res.data?.data) {
          const created = res.data.data;
          const idx = this.materials.findIndex(m => m.id === created.id);
          if (idx !== -1) {
            this.materials[idx] = created;
          } else {
            this.materials.unshift(created);
          }
          return { success: true, material: created, message: res.data.message };
        }
        return { success: false, message: 'Invalid server response' };
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to save material';
        return { success: false, message: msg };
      } finally {
        this.isSaving = false;
      }
    },

    /**
     * Update an existing material
     */
    async updateMaterial(id, materialData) {
      this.isSaving = true;
      try {
        const res = await api.patch(`operations/materials/${id}`, materialData);
        if (res.data?.data) {
          const updated = res.data.data;
          const idx = this.materials.findIndex(m => m.id === id);
          if (idx !== -1) {
            this.materials[idx] = { ...this.materials[idx], ...updated };
          }
          return { success: true, material: updated, message: res.data.message };
        }
        return { success: false, message: 'Invalid response' };
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to update material';
        return { success: false, message: msg };
      } finally {
        this.isSaving = false;
      }
    },

    /**
     * Delete a material
     */
    async deleteMaterial(id) {
      this.isSaving = true;
      try {
        const res = await api.delete(`operations/materials/${id}`);
        this.materials = this.materials.filter(m => m.id !== id);
        return { success: true, message: res.data?.message || 'Material deleted successfully' };
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to delete material';
        return { success: false, message: msg };
      } finally {
        this.isSaving = false;
      }
    },

    /**
     * Save / Add a special non-working holiday
     */
    async saveHoliday(holidayData) {
      this.isSaving = true;
      try {
        const res = await api.post('operations/holidays', holidayData);
        if (res.data?.data) {
          const created = res.data.data;
          this.holidays.push(created);
          this.holidays.sort((a, b) => (a.holiday_date || '').localeCompare(b.holiday_date || ''));

          configureWorkCalendar({ holidays: this.holidays });
          return { success: true, holiday: created, message: res.data.message };
        }
        return { success: false, message: 'Invalid response' };
      } catch (err) {
        const errors = err.response?.data?.errors;
        let msg = err.response?.data?.message || 'Failed to add holiday';
        if (errors && typeof errors === 'object') {
          const details = Object.values(errors).flat().join(', ');
          if (details) msg += `: ${details}`;
        }
        return { success: false, message: msg };
      } finally {
        this.isSaving = false;
      }
    },

    /**
     * Update a special holiday
     */
    async updateHoliday(id, holidayData) {
      this.isSaving = true;
      try {
        const res = await api.patch(`operations/holidays/${id}`, holidayData);
        if (res.data?.data) {
          const updated = res.data.data;
          const idx = this.holidays.findIndex(h => h.id === id);
          if (idx !== -1) {
            this.holidays[idx] = { ...this.holidays[idx], ...updated };
            this.holidays.sort((a, b) => (a.holiday_date || '').localeCompare(b.holiday_date || ''));
          }

          configureWorkCalendar({ holidays: this.holidays });
          return { success: true, holiday: updated, message: res.data.message };
        }
        return { success: false, message: 'Invalid response' };
      } catch (err) {
        const errors = err.response?.data?.errors;
        let msg = err.response?.data?.message || 'Failed to update holiday';
        if (errors && typeof errors === 'object') {
          const details = Object.values(errors).flat().join(', ');
          if (details) msg += `: ${details}`;
        }
        return { success: false, message: msg };
      } finally {
        this.isSaving = false;
      }
    },

    /**
     * Delete a special holiday
     */
    async deleteHoliday(id) {
      this.isSaving = true;
      try {
        const res = await api.delete(`operations/holidays/${id}`);
        this.holidays = this.holidays.filter(h => h.id !== id);

        configureWorkCalendar({ holidays: this.holidays });
        return { success: true, message: res.data?.message || 'Holiday deleted' };
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to delete holiday';
        return { success: false, message: msg };
      } finally {
        this.isSaving = false;
      }
    },

    /**
     * Update operational working hours
     */
    async saveWorkingHours(hoursData) {
      this.isSaving = true;
      try {
        const res = await api.post('operations/working-hours', hoursData);
        if (res.data?.data) {
          this.workingHours = { ...this.workingHours, ...res.data.data };

          configureWorkCalendar({
            work_start_time: this.workingHours.work_start_time,
            work_end_time: this.workingHours.work_end_time,
            lunch_start_time: this.workingHours.lunch_start_time,
            lunch_end_time: this.workingHours.lunch_end_time,
            standard_daily_hours: this.workingHours.standard_daily_hours,
          });

          return { success: true, data: this.workingHours, message: res.data.message };
        }
        return { success: false, message: 'Invalid response' };
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to update working hours';
        return { success: false, message: msg };
      } finally {
        this.isSaving = false;
      }
    },
  },
});
