/**
 * Suite 02 — Service-requesting lifecycle, beginning → finish.
 *
 * Branches on the requester role (probed in suite 01):
 *  - employee: FGMU multi-service + LEAU regular + SSU incident full lifecycles
 *  - student:  FGMU guard (403) + hauling + SSU incident lifecycles
 * Borrowing intake itself is covered in suite 03.
 *
 * Every created ticket is driven to a terminal closed/archived state.
 * Mock personnel are created for dispatch and deleted at the end.
 */
import { RUN_TAG } from '../config.js';
import { api, assert, eq, step, requireAll, getTicket } from '../lib.js';

const FGMU_SERVICES = ['Carpentry & Joinery', 'Electrical Work'];

async function submitIntake(ctx, payload) {
  const { http, json } = await api('POST', '/tickets/intake', {
    token: ctx.tokens.requester, body: payload,
  });
  assert(http === 200 || http === 201, `intake → HTTP ${http}: ${json?.message}`);
  const ids = json?.data?.ticket_ids ?? [];
  assert(ids.length > 0, `intake → no ticket_ids: ${json?.message}`);
  return ids;
}

async function approveTicket(ctx, adminKey, ticketId) {
  const { http, json } = await api('PATCH', `/tickets/${encodeURIComponent(ticketId)}/approve`, {
    token: ctx.tokens[adminKey], body: {},
  });
  assert(http === 200, `approve ${ticketId} → HTTP ${http}: ${json?.message}`);
  const t = await getTicket(ticketId, ctx.tokens[adminKey]);
  eq(t.status, 'approved', `${ticketId} status after approve`);
}

async function assignWorker(ctx, ticketId, personnelId) {
  const { http, json } = await api('POST', '/dispatch/assign', {
    token: ctx.tokens[ctx.adminForTicket[ticketId]],
    body: { ticket_id: ticketId, personnel_id: personnelId },
  });
  assert(http === 200 || http === 201, `assign ${ticketId} → HTTP ${http}: ${json?.message}`);
}

async function submitFeedback(ctx, ticketId, ratings = [5, 5, 5], completion = 'on-time') {
  const { http, json } = await api('POST', '/feedback', {
    token: ctx.tokens.requester,
    body: {
      ticket_id: ticketId,
      completion_status: completion,
      quality_rating: ratings[0],
      efficiency_rating: ratings[1],
      timeliness_rating: ratings[2],
      remarks: `${RUN_TAG} automated E2E rating`,
    },
  });
  assert(http === 200 || http === 201, `feedback ${ticketId} → HTTP ${http}: ${json?.message}`);
}

/** If feedback left the ticket merely resolved, close it via verify-close. */
async function ensureClosed(ctx, ticketId) {
  let t = await getTicket(ticketId, ctx.tokens.requester);
  if (t.status === 'closed') return t;
  const { http, json } = await api('POST', `/tickets/${encodeURIComponent(ticketId)}/verify-close`, {
    token: ctx.tokens.requester, body: {},
  });
  assert(http === 200, `verify-close ${ticketId} → HTTP ${http}: ${json?.message}`);
  t = await getTicket(ticketId, ctx.tokens.requester);
  eq(t.status, 'closed', `${ticketId} status after verify-close`);
  return t;
}

export async function run(ctx) {
  console.log('\n[02] Service lifecycle');
  ctx.adminForTicket = ctx.adminForTicket ?? {};
  const isEmployee = ctx.requesterRole === 'employee';

  // ---- mock personnel (dispatch needs real workers in the ticket's unit) ----
  await step('create mock FGMU personnel', async () => {
    const { http, json } = await api('POST', '/personnel', {
      token: ctx.tokens.fgmuAdmin,
      body: { name: `${RUN_TAG} FGMU Worker`, specialty: 'Carpentry & Joinery', unit_id: 1 },
    });
    assert(http === 200 || http === 201, `create personnel → HTTP ${http}: ${json?.message}`);
    ctx.fgmuWorkerId = json?.data?.personnel_id ?? json?.data?.id;
    assert(ctx.fgmuWorkerId, 'missing personnel_id');
    return ctx.fgmuWorkerId;
  });

  await step('create mock LEAU personnel', async () => {
    const { http, json } = await api('POST', '/personnel', {
      token: ctx.tokens.leauAdmin,
      body: { name: `${RUN_TAG} LEAU Worker`, specialty: 'Hauling', unit_id: 2 },
    });
    assert(http === 200 || http === 201, `create personnel → HTTP ${http}: ${json?.message}`);
    ctx.leauWorkerId = json?.data?.personnel_id ?? json?.data?.id;
    assert(ctx.leauWorkerId, 'missing personnel_id');
    return ctx.leauWorkerId;
  });

  // ---- FGMU multi-service intake (employee) or guard proof (student) ----
  if (isEmployee) {
    await step('FGMU intake with 2 services in one request', async () => {
      const ids = await submitIntake(ctx, {
        fgmu: {
          services: FGMU_SERVICES.map((service) => ({ service })),
          details: {
            ticket_title: `${RUN_TAG} FGMU repairs`,
            job_description: `${RUN_TAG} repair wooden door and replace busted lights in the office.`,
            college_building: 'College of Information Sciences Building (CIS)',
            office_room: 'Room 101',
          },
        },
      });
      ctx.fgmuTicket = ids[0];
      ctx.adminForTicket[ctx.fgmuTicket] = 'fgmuAdmin';
      const t = await getTicket(ctx.fgmuTicket, ctx.tokens.requester);
      eq(t.status, 'pending', 'FGMU ticket initial status');
      for (const s of FGMU_SERVICES) {
        assert(String(t.service_type).includes(s.replace(/ Works?$/, '').split(' ')[0]),
          `service_type missing ${s} (got: ${t.service_type})`);
      }
      return `${ctx.fgmuTicket} [${t.service_type}]`;
    });

    await step('FGMU ticket visible in admin pending queue', async () => {
      const { http, json } = await api('GET', '/tickets/queue/FGMU', { token: ctx.tokens.fgmuAdmin });
      assert(http === 200, `queue → HTTP ${http}`);
      const list = json?.data?.tickets ?? [];
      assert(list.some((t) => (t.id ?? t.ticket_id) === ctx.fgmuTicket), 'ticket not in queue');
    });

    await step('FGMU approve → assign → materials → complete', async () => {
      await approveTicket(ctx, 'fgmuAdmin', ctx.fgmuTicket);
      await assignWorker(ctx, ctx.fgmuTicket, ctx.fgmuWorkerId);
      const { http, json } = await api('POST', `/tickets/${encodeURIComponent(ctx.fgmuTicket)}/materials`, {
        token: ctx.tokens.fgmuAdmin,
        body: {
          materials: [
            { material_name: `${RUN_TAG} Plywood`, quantity: 2, unit_measurement: 'pcs', unit_price: 450 },
            { material_name: `${RUN_TAG} LED bulb`, quantity: 4, unit_measurement: 'pcs', unit_price: 120 },
          ],
        },
      });
      assert(http === 200, `materials → HTTP ${http}: ${json?.message}`);
      const c = await api('PATCH', `/tickets/${encodeURIComponent(ctx.fgmuTicket)}/complete`, {
        token: ctx.tokens.fgmuAdmin, body: {},
      });
      assert(c.http === 200, `complete → HTTP ${c.http}: ${c.json?.message}`);
      const t = await getTicket(ctx.fgmuTicket, ctx.tokens.fgmuAdmin);
      eq(t.status, 'resolved', 'FGMU status after complete');
      return `materials_logged=${t.materials_logged ?? '?'}`;
    });

    await step('FGMU feedback closes + archives ticket', async () => {
      await submitFeedback(ctx, ctx.fgmuTicket, [5, 5, 5], 'early');
      const t = await ensureClosed(ctx, ctx.fgmuTicket);
      eq(t.status, 'closed', 'FGMU final status');
      assert(Number(t.is_archived) === 1, 'FGMU archived flag');
      return `${t.status_label}`;
    });
  } else {
    await step('student FGMU intake is blocked (403 guard)', async () => {
      const { http, json } = await api('POST', '/tickets/intake', {
        token: ctx.tokens.requester,
        body: { fgmu: { services: [{ service: 'Carpentry & Joinery' }], details: { job_description: 'x' } } },
      });
      eq(http, 403, `expected 403, got ${http}: ${json?.message}`);
    });
  }

  // ---- LEAU hauling (allowed for both roles) ----
  await step('LEAU hauling intake → approve → assign → labor-only complete', async () => {
    const ids = await submitIntake(ctx, {
      leau: {
        services: [{ service: 'Hauling' }],
        details: {
          ticket_title: `${RUN_TAG} Hauling`,
          job_description: `${RUN_TAG} haul tables and chairs to the gymnasium for the event.`,
          college_building: 'BSU Gymnasium',
          office_room: 'Stage Area',
        },
      },
    });
    ctx.haulTicket = ids[0];
    ctx.adminForTicket[ctx.haulTicket] = 'leauAdmin';
    await approveTicket(ctx, 'leauAdmin', ctx.haulTicket);
    await assignWorker(ctx, ctx.haulTicket, ctx.leauWorkerId);
    const c = await api('PATCH', `/tickets/${encodeURIComponent(ctx.haulTicket)}/complete`, {
      token: ctx.tokens.leauAdmin, body: { is_labor_only: true },
    });
    assert(c.http === 200, `complete → HTTP ${c.http}: ${c.json?.message}`);
    return ctx.haulTicket;
  });

  await step('hauling feedback closes ticket', async () => {
    await submitFeedback(ctx, ctx.haulTicket, [4, 4, 4], 'on-time');
    const t = await ensureClosed(ctx, ctx.haulTicket);
    eq(t.status, 'closed', 'hauling final status');
  });

  // ---- SSU incident: custom Others-only type is accepted ----
  await step('SSU incident intake with custom Others-only type', async () => {
    const customType = `${RUN_TAG} Custom Disturbance`;
    const { http, json } = await api('POST', '/tickets/intake', {
      token: ctx.tokens.requester,
      body: {
        ssu: {
          incidentReport: {
            incidents: [],
            otherIncident: customType,
            who: `${RUN_TAG} involved person`,
            where: 'University Library',
            when: 'September 20, 2026 @ 10:30 PM',
            how: `${RUN_TAG} step by step account of what occurred during the incident for E2E purposes.`,
            reportedBy: { printedName: 'E2E Requester' },
          },
        },
      },
    });
    assert(http === 200 || http === 201, `SSU custom intake → HTTP ${http}: ${json?.message}`);
    ctx.ssuCustomTicket = (json?.data?.ticket_ids ?? [])[0];
    assert(ctx.ssuCustomTicket, 'no ticket id for custom incident');
    return ctx.ssuCustomTicket;
  });

  // ---- SSU incident full chain: investigate → notation → resolve → feedback ----
  await step('SSU incident full chain to closed', async () => {
    const { http, json } = await api('POST', '/tickets/intake', {
      token: ctx.tokens.requester,
      body: {
        ssu: {
          incidentReport: {
            incidents: ['Vandalism'],
            otherIncident: `${RUN_TAG} extra detail`,
            who: `${RUN_TAG} involved person`,
            where: 'BSU Gymnasium',
            when: 'September 20, 2026 @ 09:00 PM',
            how: `${RUN_TAG} vandalism narrative describing the damage observed for E2E verification.`,
            reportedBy: { printedName: 'E2E Requester' },
          },
        },
      },
    });
    assert(http === 200 || http === 201, `SSU intake → HTTP ${http}: ${json?.message}`);
    const tid = (json?.data?.ticket_ids ?? [])[0];
    assert(tid, 'no ticket id for SSU incident');
    ctx.ssuTicket = tid;
    ctx.adminForTicket[tid] = 'ssuAdmin';

    const inv = await api('PATCH', `/tickets/${encodeURIComponent(tid)}/investigate`, { token: ctx.tokens.ssuAdmin, body: {} });
    assert(inv.http === 200, `investigate → HTTP ${inv.http}: ${inv.json?.message}`);

    const note = await api('PATCH', `/tickets/${encodeURIComponent(tid)}/notation`, {
      token: ctx.tokens.ssuAdmin, body: { notation: `${RUN_TAG} verified, recommend repaint and monitoring.` },
    });
    assert(note.http === 200, `notation → HTTP ${note.http}: ${note.json?.message}`);

    const res = await api('PATCH', `/tickets/${encodeURIComponent(tid)}/resolve`, { token: ctx.tokens.ssuAdmin, body: {} });
    assert(res.http === 200, `resolve → HTTP ${res.http}: ${res.json?.message}`);
    const t = await getTicket(tid, ctx.tokens.ssuAdmin);
    eq(t.status, 'resolved', 'SSU status after resolve');

    await submitFeedback(ctx, tid, [5, 4, 5], 'on-time');
    const closed = await ensureClosed(ctx, tid);
    eq(closed.status, 'closed', 'SSU final status');
    return tid;
  });

  // ---- cancel the custom-only SSU ticket (terminal, no chain) ----
  await step('cancel custom-only SSU ticket (requester cancel)', async () => {
    const { http, json } = await api('PATCH', `/tickets/${encodeURIComponent(ctx.ssuCustomTicket)}/cancel`, {
      token: ctx.tokens.requester, body: {},
    });
    assert(http === 200, `cancel → HTTP ${http}: ${json?.message}`);
    const t = await getTicket(ctx.ssuCustomTicket, ctx.tokens.requester);
    assert(['cancelled', 'closed'].includes(t.status), `unexpected status ${t.status}`);
  });

  // ---- consistency: my-requests (active), completed (archived/terminal), logs, notifications ----
  // NOTE: my-requests returns ACTIVE tickets only; closed/cancelled tickets
  // live in completed. Our flow closes everything, so completed is asserted.
  await step('my-requests + completed + logs + notifications are consistent', async () => {
    const mine = await api('GET', '/tickets/my-requests', { token: ctx.tokens.requester });
    assert(mine.http === 200, `my-requests → HTTP ${mine.http}`);
    const mineIds = (mine.json?.data?.tickets ?? []).map((t) => t.id ?? t.ticket_id);
    const done = await api('GET', '/tickets/completed', { token: ctx.tokens.requester });
    assert(done.http === 200, `completed → HTTP ${done.http}`);
    const doneIds = (done.json?.data?.tickets ?? []).map((t) => t.id ?? t.ticket_id);
    for (const tid of [ctx.haulTicket, ctx.ssuTicket, ctx.ssuCustomTicket, ctx.fgmuTicket].filter(Boolean)) {
      assert(doneIds.includes(tid), `${tid} missing from completed`);
      assert(!mineIds.includes(tid), `${tid} should no longer be active`);
    }

    const t = await getTicket(ctx.haulTicket, ctx.tokens.requester);
    const actions = (t.logs ?? []).map((l) => l.action ?? l.title ?? '');
    for (const a of ['Ticket Submitted', 'Feedback Submitted']) {
      assert(actions.some((x) => String(x).includes(a)), `log missing "${a}"`);
    }
    const notifs = await api('GET', '/notifications', { token: ctx.tokens.requester });
    assert(notifs.http === 200, `notifications → HTTP ${notifs.http}`);
    const items = notifs.json?.data?.notifications ?? notifs.json?.data ?? [];
    assert(Array.isArray(items) && items.length > 0, 'no notifications for requester');
    return `${mineIds.length} mine, ${doneIds.length} completed, ${items.length} notifications`;
  });

  // ---- cleanup mock personnel ----
  for (const [label, id, adminKey] of [['FGMU', ctx.fgmuWorkerId, 'fgmuAdmin'], ['LEAU', ctx.leauWorkerId, 'leauAdmin']]) {
    await step(`delete mock ${label} personnel`, async () => {
      const { http, json } = await api('DELETE', `/personnel/${encodeURIComponent(id)}`, { token: ctx.tokens[adminKey] });
      assert(http === 200, `delete personnel → HTTP ${http}: ${json?.message}`);
    });
  }
}
