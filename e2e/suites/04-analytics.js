/**
 * Suite 04 — Director analytics consistency.
 *
 * Verifies the numbers the dashboards/PDF report render:
 *  - multi-service tickets counted as individual service requests per unit
 *  - per-unit totals, trends, completion health, unit stats endpoints
 *
 * Uses before/after deltas where possible; absolute presence checks
 * otherwise (production keeps moving concurrently).
 */
import { api, assert, step } from '../lib.js';

async function analytics(ctx, params = '') {
  const { http, json } = await api('GET', `/director/analytics${params}`, { token: ctx.tokens.director });
  assert(http === 200, `analytics → HTTP ${http}: ${json?.message}`);
  return json.data;
}

const unitTotal = (data, code) => Number(data?.service_breakdown_by_unit?.[code]?.total ?? NaN);
const unitServices = (data, code) => data?.service_breakdown_by_unit?.[code]?.services ?? [];

export async function run(ctx) {
  console.log('\n[04] Analytics consistency');

  await step('executive analytics shape is complete', async () => {
    const a = await analytics(ctx, '?period=all');
    ctx.analyticsAll = a;
    assert(a.summary, 'missing summary');
    assert(a.units?.FGMU && a.units?.LEAU && a.units?.SSU, 'missing per-unit blocks');
    assert(Array.isArray(a.service_breakdown), 'missing service_breakdown');
    assert(a.service_breakdown_by_unit?.FGMU?.services, 'missing by-unit services');
    assert(a.completion_health, 'missing completion_health');
    assert(Array.isArray(a.trends), 'missing trends');
    return `requests=${a.summary.total_requests} services=${a.summary.total_service_requests ?? '?'}`;
  });

  await step('multi-service ticket counted per service, not per ticket', async () => {
    const a = ctx.analyticsAll;
    // This run's FGMU ticket (employee path) bundled 2 services in 1 ticket.
    if (ctx.fgmuTicket) {
      const names = unitServices(a, 'FGMU').map((s) => s.name);
      assert(names.some((n) => /Carpentry/i.test(n)), 'Carpentry missing from FGMU breakdown');
      assert(names.some((n) => /Electrical/i.test(n)), 'Electrical missing from FGMU breakdown');
      const total = unitTotal(a, 'FGMU');
      assert(total >= 2, `FGMU service total ${total} < 2 (bundled ticket undercounted?)`);
      return `FGMU services total=${total}`;
    }
    // Student path: hauling + borrowing are separate single-service tickets.
    const names = unitServices(a, 'LEAU').map((s) => s.name);
    assert(names.some((n) => /Hauling/i.test(n)), 'Hauling missing from LEAU breakdown');
    return 'LEAU breakdown OK (student path)';
  });

  await step('period filters respond (month/day)', async () => {
    const m = await analytics(ctx, `?period=month&year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}`);
    assert(m.filter?.period === 'month', 'month filter echo');
    assert(m.summary, 'month summary missing');
    const today = new Date().toISOString().slice(0, 10);
    const todayData = await analytics(ctx, `?period=day&date=${today}`);
    assert(todayData.summary, 'day summary missing');
    return `month requests=${m.summary.total_requests}, day requests=${todayData.summary.total_requests}`;
  });

  await step('completion health adds up', async () => {
    const h = ctx.analyticsAll.completion_health;
    const sum = h.early_finished + h.on_time + h.beyond_time + h.not_completed;
    assert(sum === h.total, `health sum ${sum} != total ${h.total}`);
    assert(h.total >= 1, 'expected at least our feedback in health stats');
  });

  await step('unit stats endpoints answer per unit', async () => {
    for (const u of ['FGMU', 'LEAU', 'SSU']) {
      const { http, json } = await api('GET', `/tickets/stats/${u}`, { token: ctx.tokens.director });
      assert(http === 200, `stats ${u} → HTTP ${http}`);
      assert(json?.data?.stats, `stats ${u} → missing stats`);
    }
  });

  await step('per-unit analytics endpoint answers', async () => {
    const { http, json } = await api('GET', '/director/analytics/LEAU', { token: ctx.tokens.director });
    assert(http === 200, `unit analytics → HTTP ${http}`);
    assert(json?.data?.stats, 'missing unit stats');
  });
}
