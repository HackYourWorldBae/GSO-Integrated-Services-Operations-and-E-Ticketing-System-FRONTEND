/**
 * Suite 05 — Decline edge cases across all 3 sub-units + borrowing.
 *
 * For FGMU, LEAU (hauling), SSU (incident), and LEAU borrowing:
 *   intake → decline with reason → ticket declined+archived with reason stored
 *   → requester receives the declined notification/message
 *   → declined ticket shows in completed, rejects feedback + re-approve.
 * Plus negative guards: decline without reason (422), decline after
 * approve (400).
 */
import { RUN_TAG } from '../config.js';
import { api, assert, eq, step, getTicket } from '../lib.js';

async function intakeAsRequester(ctx, payload) {
  const { http, json } = await api('POST', '/tickets/intake', {
    token: ctx.tokens.requester, body: payload,
  });
  assert(http === 200 || http === 201, `intake → HTTP ${http}: ${json?.message}`);
  const ids = json?.data?.ticket_ids ?? [];
  assert(ids.length > 0, 'intake → no ticket id');
  return ids[0];
}

/** Assert the requester got a declined notification/message for the ticket. */
async function expectDeclinedNotification(ctx, ticketId, mustContainReason) {
  const { http, json } = await api('GET', '/notifications', { token: ctx.tokens.requester });
  assert(http === 200, `notifications → HTTP ${http}`);
  const items = json?.data?.notifications ?? json?.data ?? [];
  assert(Array.isArray(items) && items.length > 0, 'no notifications at all');
  const hit = items.find((n) => {
    const s = JSON.stringify(n);
    return s.includes(ticketId) && /declin/i.test(s);
  });
  assert(hit, `no declined notification for ${ticketId}`);
  if (mustContainReason) {
    assert(JSON.stringify(hit).includes(mustContainReason),
      `declined notification missing reason text "${mustContainReason}"`);
  }
  return hit;
}

async function expectDeclinedTicket(ctx, ticketId, reason, adminKey) {
  const t = await getTicket(ticketId, ctx.tokens[adminKey]);
  eq(t.status, 'declined', `${ticketId} status`);
  assert(String(t.decline_reason ?? '').includes(reason), `${ticketId} reason stored (got: ${t.decline_reason})`);
  assert(Number(t.is_archived) === 1, `${ticketId} archived flag`);
  // Requester can see the reason on their own ticket.
  const mine = await getTicket(ticketId, ctx.tokens.requester);
  assert(String(mine.decline_reason ?? '').includes(reason), `${ticketId} reason visible to requester`);
  // Declined tickets surface in completed, and reject feedback + re-approve.
  const done = await api('GET', '/tickets/completed', { token: ctx.tokens.requester });
  const doneIds = (done.json?.data?.tickets ?? []).map((x) => x.id ?? x.ticket_id);
  assert(doneIds.includes(ticketId), `${ticketId} missing from completed`);
  const fb = await api('POST', '/feedback', {
    token: ctx.tokens.requester,
    body: { ticket_id: ticketId, completion_status: 'on-time', quality_rating: 5, efficiency_rating: 5, timeliness_rating: 5 },
  });
  assert(fb.http === 400, `feedback on declined should 400, got ${fb.http}`);
  const re = await api('PATCH', `/tickets/${encodeURIComponent(ticketId)}/approve`, {
    token: ctx.tokens[adminKey], body: {},
  });
  assert(re.http === 400, `re-approve declined should 400, got ${re.http}`);
}

export async function run(ctx) {
  console.log('\n[05] Decline edge cases (FGMU/LEAU/SSU/borrowing)');

  // ---- FGMU decline ----
  await step('FGMU decline: reason stored + requester notified', async () => {
    const tid = await intakeAsRequester(ctx, {
      fgmu: {
        services: [{ service: 'Painting Works' }],
        details: {
          ticket_title: `${RUN_TAG} decline paint`,
          job_description: `${RUN_TAG} repaint the office wall near the entrance area.`,
          college_building: 'College of Information Sciences Building (CIS)',
          office_room: 'Room 102',
        },
      },
    });
    const reason = `${RUN_TAG} insufficient details, please resubmit`;
    const d = await api('PATCH', `/tickets/${encodeURIComponent(tid)}/decline`, {
      token: ctx.tokens.fgmuAdmin, body: { decline_reason: reason },
    });
    assert(d.http === 200, `decline → HTTP ${d.http}: ${d.json?.message}`);
    await expectDeclinedTicket(ctx, tid, reason, 'fgmuAdmin');
    await expectDeclinedNotification(ctx, tid, reason);
    return tid;
  });

  // ---- FGMU decline guards ----
  await step('FGMU decline without reason → 422', async () => {
    const tid = await intakeAsRequester(ctx, {
      fgmu: {
        services: [{ service: 'Masonry Works' }],
        details: {
          ticket_title: `${RUN_TAG} decline guard`,
          job_description: `${RUN_TAG} repair cracked wall plaster in the hallway section.`,
          college_building: 'College of Information Sciences Building (CIS)',
          office_room: 'Hallway',
        },
      },
    });
    ctx.declineGuardTicket = tid;
    const d = await api('PATCH', `/tickets/${encodeURIComponent(tid)}/decline`, {
      token: ctx.tokens.fgmuAdmin, body: {},
    });
    eq(d.http, 422, `expected 422, got ${d.http}`);
    const t = await getTicket(tid, ctx.tokens.fgmuAdmin);
    eq(t.status, 'pending', 'ticket still pending after 422');
  });

  await step('FGMU decline after approve → 400', async () => {
    const tid = ctx.declineGuardTicket;
    const a = await api('PATCH', `/tickets/${encodeURIComponent(tid)}/approve`, {
      token: ctx.tokens.fgmuAdmin, body: {},
    });
    assert(a.http === 200, `approve → HTTP ${a.http}`);
    const d = await api('PATCH', `/tickets/${encodeURIComponent(tid)}/decline`, {
      token: ctx.tokens.fgmuAdmin, body: { decline_reason: `${RUN_TAG} too late` },
    });
    eq(d.http, 400, `expected 400, got ${d.http}`);
    // Leave it clean: requester cancels the still-approved ticket? Approved
    // tickets cannot be requester-cancelled; drive it minimally: leave for
    // admin queue (tagged, terminal later). Instead decline path is closed,
    // so cancel via admin-side: requester cancel only allows pending —
    // assert that guard too.
    const c = await api('PATCH', `/tickets/${encodeURIComponent(tid)}/cancel`, {
      token: ctx.tokens.requester, body: {},
    });
    assert(c.http !== 200, `cancel of approved ticket should not succeed, got ${c.http}`);
    return `${tid} stays approved (tagged)`;
  });

  // ---- LEAU decline (hauling) ----
  await step('LEAU decline: reason stored + requester notified', async () => {
    const tid = await intakeAsRequester(ctx, {
      leau: {
        services: [{ service: 'Hauling' }],
        details: {
          ticket_title: `${RUN_TAG} decline haul`,
          job_description: `${RUN_TAG} haul old furniture from the storage room area.`,
          college_building: 'BSU Gymnasium',
          office_room: 'Storage',
        },
      },
    });
    const reason = `${RUN_TAG} truck unavailable this week`;
    const d = await api('PATCH', `/tickets/${encodeURIComponent(tid)}/decline`, {
      token: ctx.tokens.leauAdmin, body: { decline_reason: reason },
    });
    assert(d.http === 200, `decline → HTTP ${d.http}: ${d.json?.message}`);
    await expectDeclinedTicket(ctx, tid, reason, 'leauAdmin');
    await expectDeclinedNotification(ctx, tid, reason);
    return tid;
  });

  // ---- SSU decline (incident) ----
  await step('SSU decline: reason stored + requester notified', async () => {
    const tid = await intakeAsRequester(ctx, {
      ssu: {
        incidentReport: {
          incidents: ['Vandalism'],
          who: `${RUN_TAG} unknown person`,
          where: 'BSU Gymnasium',
          when: 'September 20, 2026 @ 08:00 PM',
          how: `${RUN_TAG} alleged vandalism report submitted for decline-path verification purposes.`,
          reportedBy: { printedName: 'E2E Requester' },
        },
      },
    });
    const reason = `${RUN_TAG} duplicate of an earlier report`;
    const d = await api('PATCH', `/tickets/${encodeURIComponent(tid)}/decline`, {
      token: ctx.tokens.ssuAdmin, body: { decline_reason: reason },
    });
    assert(d.http === 200, `decline → HTTP ${d.http}: ${d.json?.message}`);
    await expectDeclinedTicket(ctx, tid, reason, 'ssuAdmin');
    await expectDeclinedNotification(ctx, tid, reason);
    return tid;
  });

  // ---- Borrowing director-reject ----
  await step('borrowing director-reject: cancelled + requester notified', async () => {
    const u = ctx.users.requester ?? {};
    const fullName = u.full_name || `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim();
    const { http, json } = await api('POST', '/tickets/intake', {
      token: ctx.tokens.requester,
      body: {
        leauBorrowing: {
          services: [{ service: 'Borrowing of tools/ equipment' }],
          details: {
            borrower_name: fullName,
            borrower_id_number: u.student_id_number ?? u.employee_id_number ?? '',
            borrower_type: (u.role ?? '') === 'student' ? 'student' : 'staff',
            department_major: u.college ?? '',
            borrower_email: u.email ?? '',
            borrower_contact: u.contact_number ?? u.contact_no ?? '',
            item_name: `${RUN_TAG} Ladder`,
            quantity_needed: 1,
            purpose_project: `${RUN_TAG} roof gutter cleaning for decline-path verification.`,
            date_needed: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
            expected_return_date: new Date(Date.now() + 8 * 86400000).toISOString().slice(0, 10),
            terms_agreed: true,
          },
        },
      },
    });
    assert(http === 200 || http === 201, `borrowing intake → HTTP ${http}: ${json?.message}`);
    const tid = (json?.data?.ticket_ids ?? [])[0];
    assert(tid, 'no borrowing ticket id');
    const reason = `${RUN_TAG} item under maintenance`;
    const r = await api('PATCH', `/borrowing/${encodeURIComponent(tid)}/director-reject`, {
      token: ctx.tokens.director, body: { reason },
    });
    assert(r.http === 200, `director-reject → HTTP ${r.http}: ${r.json?.message}`);
    const t = await getTicket(tid, ctx.tokens.leauAdmin);
    eq(t.status, 'declined', 'borrowing ticket declined');
    assert(Number(t.is_archived) === 1, 'borrowing ticket archived');
    await expectDeclinedNotification(ctx, tid, reason);
    return tid;
  });
}
