import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useOperationsHubStore } from '@/stores/operationsHub';
import api from '@/api/client';
import { isHoliday } from '@/utils/workCalendar';

vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Operations Hub Store & Dynamic Calendar Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with structured defaults and separates FGMU and LEAU materials', () => {
    const store = useOperationsHubStore();
    expect(store.workingHours.work_start_time).toBe('08:00');
    expect(store.workingHours.work_end_time).toBe('17:00');
    expect(store.materials.length).toBeGreaterThan(0);

    const fgmuList = store.fgmuMaterials;
    const leauList = store.leauMaterials;

    expect(fgmuList.length).toBeGreaterThan(0);
    expect(leauList.length).toBeGreaterThan(0);

    // Verify all FGMU items have unit_code FGMU
    fgmuList.forEach(m => expect(m.unit_code).toBe('FGMU'));
    // Verify all LEAU items have unit_code LEAU
    leauList.forEach(m => expect(m.unit_code).toBe('LEAU'));
  });

  it('correctly filters material names by unit', () => {
    const store = useOperationsHubStore();
    const fgmuNames = store.materialNamesByUnit('FGMU');
    const leauNames = store.materialNamesByUnit('LEAU');

    expect(fgmuNames.some(n => n.includes('PVC') || n.includes('Bulb') || n.includes('Cement'))).toBe(true);
    expect(leauNames.some(n => n.includes('Grass') || n.includes('Seedlings') || n.includes('Soil') || n.includes('Fertilizer'))).toBe(true);

    // Cross-check that LEAU catalog does not leak FGMU-specific materials
    expect(leauNames).not.toContain('PVC Pipe 1/2 inch');
  });

  it('retrieves default unit and price for items', () => {
    const store = useOperationsHubStore();
    const pvcUnit = store.getDefaultUnit('PVC Pipe 1/2 inch', 'FGMU');
    const pvcPrice = store.getDefaultPrice('PVC Pipe 1/2 inch', 'FGMU');

    expect(pvcUnit).toBe('lengths');
    expect(pvcPrice).toBe(120);

    const soilUnit = store.getDefaultUnit('Organic Garden Soil / Topsoil', 'LEAU');
    const soilPrice = store.getDefaultPrice('Organic Garden Soil / Topsoil', 'LEAU');

    expect(soilUnit).toBe('bags');
    expect(soilPrice).toBe(85);
  });

  it('fetches full operations config and dynamically synchronizes workCalendar', async () => {
    const store = useOperationsHubStore();

    api.get.mockImplementation((url) => {
      if (url === 'operations/config') {
        return Promise.resolve({
          data: {
            status: true,
            data: {
              working_hours: {
                work_start_time: '07:30',
                work_end_time: '16:30',
                lunch_start_time: '12:00',
                lunch_end_time: '13:00',
                standard_daily_hours: 8.0,
              },
              holidays: [
                {
                  id: 1,
                  holiday_date: '2026-12-25',
                  name: 'Christmas Day',
                  type: 'Special Non-Working',
                  is_recurring: true,
                  is_active: true,
                },
              ],
            },
          },
        });
      }
      if (url === 'operations/materials') {
        return Promise.resolve({
          data: {
            status: true,
            data: {
              materials: [
                { id: 999, unit_code: 'FGMU', category: 'Plumbing', name: 'Custom Brass Ball Valve', unit: 'pcs', default_price: 350, is_active: 1 },
              ],
              categories: ['Plumbing'],
            },
          },
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    await store.initOperationsHub(true);

    expect(store.workingHours.work_start_time).toBe('07:30');
    expect(store.workingHours.work_end_time).toBe('16:30');
    expect(store.holidays.length).toBe(1);
    expect(store.materials.some(m => m.name === 'Custom Brass Ball Valve')).toBe(true);

    // Verify calendar was updated dynamically
    expect(isHoliday(new Date('2026-12-25T10:00:00'))).toBe(true);
  });

  it('saves updated working hours via API and updates store state', async () => {
    const store = useOperationsHubStore();

    api.post.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Institutional working hours calibrated successfully.',
        data: {
          work_start_time: '08:30',
          work_end_time: '17:30',
          lunch_start_time: '12:00',
          lunch_end_time: '13:00',
          standard_daily_hours: 8.0,
        },
      },
    });

    const res = await store.saveWorkingHours({
      work_start_time: '08:30',
      work_end_time: '17:30',
      lunch_start_time: '12:00',
      lunch_end_time: '13:00',
      standard_daily_hours: 8.0,
    });

    expect(res.success).toBe(true);
    expect(store.workingHours.work_start_time).toBe('08:30');
    expect(store.workingHours.work_end_time).toBe('17:30');
  });

  it('supports saving and deleting materials through store actions', async () => {
    const store = useOperationsHubStore();

    api.post.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Material added.',
        data: {
          id: 501,
          unit_code: 'LEAU',
          category: 'Tree Care',
          name: 'Arboriculture Pruning Shears',
          unit: 'pairs',
          default_price: 1200,
          is_active: 1,
        },
      },
    });

    const saveRes = await store.saveMaterial({
      unit_code: 'LEAU',
      category: 'Tree Care',
      name: 'Arboriculture Pruning Shears',
      unit: 'pairs',
      default_price: 1200,
    });

    expect(saveRes.success).toBe(true);
    expect(store.materials.some(m => m.name === 'Arboriculture Pruning Shears')).toBe(true);

    api.delete.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Material deleted.',
      },
    });

    const delRes = await store.deleteMaterial(501);
    expect(delRes.success).toBe(true);
    expect(store.materials.some(m => m.id === 501)).toBe(false);
  });

  it('saves full schedule configuration including continuation, breaks, and weekend exclusions', async () => {
    const store = useOperationsHubStore();

    const schedulePayload = {
      work_start_time: '08:00',
      work_end_time: '17:00',
      lunch_start_time: '12:00',
      lunch_end_time: '13:00',
      standard_daily_hours: 8.0,
      daily_continuation_enabled: true,
      continuation_start_time: '08:00',
      continuation_cutoff_time: '17:00',
      lunch_break_enabled: true,
      morning_break_enabled: true,
      morning_break_start: '10:00',
      morning_break_end: '10:15',
      afternoon_break_enabled: true,
      afternoon_break_start: '15:00',
      afternoon_break_end: '15:15',
      exclude_weekends: true,
      exclude_saturday: true,
      exclude_sunday: false,
    };

    api.post.mockResolvedValueOnce({
      data: {
        status: true,
        message: 'Operational schedule, job continuation, time breaks, and weekend policies successfully updated.',
        data: schedulePayload,
      },
    });

    const res = await store.saveWorkingHours(schedulePayload);
    expect(res.success).toBe(true);
    expect(store.workingHours.daily_continuation_enabled).toBe(true);
    expect(store.workingHours.continuation_start_time).toBe('08:00');
    expect(store.workingHours.continuation_cutoff_time).toBe('17:00');
    expect(store.workingHours.morning_break_enabled).toBe(true);
    expect(store.workingHours.morning_break_start).toBe('10:00');
    expect(store.workingHours.afternoon_break_enabled).toBe(true);
    expect(store.workingHours.exclude_saturday).toBe(true);
    expect(store.workingHours.exclude_sunday).toBe(false);
  });
});
