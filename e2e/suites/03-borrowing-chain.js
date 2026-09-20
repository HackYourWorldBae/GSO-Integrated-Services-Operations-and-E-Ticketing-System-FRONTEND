/**
 * Suite 03 — LEAU borrowing chain, beginning → finish.
 *
 * Main ticket:  intake (blank qty → defaults 1, no item model)
 *             → director approve → assign mock inventory (stock decremented)
 *             → ready → pickup → return (stock restored, ticket closed+archived)
 * Second ticket: negative guards (admin cannot director-approve; assign
 *             before approval rejected) → director approve → admin cancel.
 * Mock inventory item is soft-deleted at the end; tickets stay closed.
 */
import { RUN_TAG } from '../config.js';
import { api, assert, eq, step, getTicket, getBorrowing } from '../lib.js';

const ITEM_QTY = 5;
const ASSIGN_QTY = 2;

async function borrowingIntake(ctx, itemName, quantity) {
  // Mirrors the real frontend (getBorrowingData): borrower identity rides
  // along from the user profile; item model omitted; quantity optional.
  const u = ctx.users.requester ?? {};
  const fullName = u.full_name || `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim();
  const details = {
    borrower_name: fullName,
    borrower_id_number: u.student_id_number ?? u.employee_id_number ?? '',
    borrower_type: (u.role ?? '') === 'student' ? 'student' : 'staff',
    department_major: u.college ?? '',
    borrower_email: u.email ?? '',
    borrower_contact: u.contact_number ?? u.contact_no ?? '',
    item_name: itemName,
    purpose_project: `${RUN_TAG} community cleanup drive and stage setup for the foundation event.`,
    date_needed: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    expected_return_date: new Date(Date.now() + 8 * 86400000).toISOString().slice(0, 10),
    terms_agreed: true,
  };
  if (quantity !== undefined) details.quantity_needed = quantity;
  const { http, json } = await api('POST', '/tickets/intake', {
    token: ctx.tokens.requester,
    body: {
      leauBorrowing: {
        services: [{ service: 'Borrowing of tools/ equipment' }, { service: 'Borrowing of plants' }],
        details,
      },
    },
  });
  assert(http === 200 || http === 201, `borrowing intake → HTTP ${http}: ${json?.message}`);
  const ids = json?.data?.ticket_ids ?? [];
  assert(ids.length > 0, 'borrowing intake → no ticket id');
  return ids[0];
}

async function inventoryAvailable(ctx, itemId) {
  const { http, json } = await api('GET', `/inventory/${itemId}`, { token: ctx.tokens.leauAdmin });
  assert(http === 200, `GET inventory ${itemId} → HTTP ${http}`);
  return Number(json?.data?.item?.quantity_available ?? json?.data?.quantity_available);
}

export async function run(ctx) {
  console.log('\n[03] Borrowing chain');

  await step('create mock inventory item (qty 5)', async () => {
    const { http, json } = await api('POST', '/inventory', {
      token: ctx.tokens.leauAdmin,
      body: {
        name: `${RUN_TAG} Wheelbarrow`,
        model: '',
        category: 'tools',
        quantity_total: ITEM_QTY,
        condition_status: 'good',
        location: 'LEAU Depot',
        description: `${RUN_TAG} automated E2E mock item`,
      },
    });
    assert(http === 200 || http === 201, `create item → HTTP ${http}: ${json?.message}`);
    ctx.mockItemId = json?.data?.item?.id;
    assert(ctx.mockItemId, 'missing inventory item id');
    eq(await inventoryAvailable(ctx, ctx.mockItemId), ITEM_QTY, 'initial stock');
    return `id=${ctx.mockItemId}`;
  });

  await step('borrowing intake: blank qty + no model accepted', async () => {
    ctx.borrowTicket = await borrowingIntake(ctx, `${RUN_TAG} Wheelbarrow`);
    const b = await getBorrowing(ctx.borrowTicket, ctx.tokens.requester);
    eq(b.status, 'pending_director', 'borrowing initial status');
    eq(Number(b.quantity_needed), 1, 'blank quantity defaults to 1');
    assert(!b.item_model_requested, `item model should be empty (got: ${b.item_model_requested})`);
    const t = await getTicket(ctx.borrowTicket, ctx.tokens.requester);
    eq(t.status, 'pending', 'ticket initial status');
    return ctx.borrowTicket;
  });

  await step('guard: LEAU admin cannot director-approve (403)', async () => {
    const { http } = await api('PATCH', `/borrowing/${encodeURIComponent(ctx.borrowTicket)}/director-approve`, {
      token: ctx.tokens.leauAdmin, body: {},
    });
    assert(http === 403, `expected 403, got ${http}`);
  });

  await step('guard: assign before director approval rejected', async () => {
    const { http, json } = await api('POST', `/borrowing/${encodeURIComponent(ctx.borrowTicket)}/assign-inventory`, {
      token: ctx.tokens.leauAdmin,
      body: { inventory_id: ctx.mockItemId, assigned_quantity: ASSIGN_QTY },
    });
    assert(http === 400, `expected 400, got ${http}: ${json?.message}`);
  });

  await step('director approves borrowing', async () => {
    const { http, json } = await api('PATCH', `/borrowing/${encodeURIComponent(ctx.borrowTicket)}/director-approve`, {
      token: ctx.tokens.director, body: { notes: `${RUN_TAG} approved for testing` },
    });
    assert(http === 200, `director-approve → HTTP ${http}: ${json?.message}`);
    eq((await getBorrowing(ctx.borrowTicket, ctx.tokens.director)).status, 'approved_director', 'post-approval status');
  });

  await step('assign inventory decrements stock + moves ticket', async () => {
    const { http, json } = await api('POST', `/borrowing/${encodeURIComponent(ctx.borrowTicket)}/assign-inventory`, {
      token: ctx.tokens.leauAdmin,
      body: { inventory_id: ctx.mockItemId, assigned_quantity: ASSIGN_QTY },
    });
    assert(http === 200, `assign → HTTP ${http}: ${json?.message}`);
    eq(await inventoryAvailable(ctx, ctx.mockItemId), ITEM_QTY - ASSIGN_QTY, 'stock after assign');
    const b = await getBorrowing(ctx.borrowTicket, ctx.tokens.leauAdmin);
    eq(b.status, 'inventory_assigned', 'borrowing status');
    eq(Number(b.assigned_quantity), ASSIGN_QTY, 'assigned qty recorded');
    eq((await getTicket(ctx.borrowTicket, ctx.tokens.leauAdmin)).status, 'processing', 'ticket status');
  });

  await step('ready for pickup → pickup', async () => {
    const r = await api('PATCH', `/borrowing/${encodeURIComponent(ctx.borrowTicket)}/ready-for-pickup`, {
      token: ctx.tokens.leauAdmin, body: {},
    });
    assert(r.http === 200, `ready → HTTP ${r.http}: ${r.json?.message}`);
    const p = await api('PATCH', `/borrowing/${encodeURIComponent(ctx.borrowTicket)}/pickup`, {
      token: ctx.tokens.leauAdmin, body: {},
    });
    assert(p.http === 200, `pickup → HTTP ${p.http}: ${p.json?.message}`);
    eq((await getBorrowing(ctx.borrowTicket, ctx.tokens.leauAdmin)).status, 'picked_up', 'picked_up status');
  });

  await step('return restores stock + auto-archives ticket (no rating)', async () => {
    const { http, json } = await api('PATCH', `/borrowing/${encodeURIComponent(ctx.borrowTicket)}/return`, {
      token: ctx.tokens.leauAdmin,
      body: { return_condition: 'good', return_notes: `${RUN_TAG} returned in good condition` },
    });
    assert(http === 200, `return → HTTP ${http}: ${json?.message}`);
    eq(await inventoryAvailable(ctx, ctx.mockItemId), ITEM_QTY, 'stock restored after return');
    const b = await getBorrowing(ctx.borrowTicket, ctx.tokens.leauAdmin);
    eq(b.status, 'returned', 'borrowing final status');
    const t = await getTicket(ctx.borrowTicket, ctx.tokens.requester);
    eq(t.status, 'closed', 'ticket auto-closed');
    assert(Number(t.is_archived) === 1, 'ticket archived flag');
    return 'closed + archived, no feedback required';
  });

  // ---- second ticket: cancel branch ----
  await step('second ticket: approve → cancel (no stock movement)', async () => {
    ctx.borrowTicket2 = await borrowingIntake(ctx, `${RUN_TAG} Rake`, 1);
    const d = await api('PATCH', `/borrowing/${encodeURIComponent(ctx.borrowTicket2)}/director-approve`, {
      token: ctx.tokens.director, body: {},
    });
    assert(d.http === 200, `director-approve → HTTP ${d.http}`);
    const c = await api('PATCH', `/borrowing/${encodeURIComponent(ctx.borrowTicket2)}/cancel`, {
      token: ctx.tokens.leauAdmin, body: { reason: `${RUN_TAG} duplicate request` },
    });
    assert(c.http === 200, `cancel → HTTP ${c.http}: ${c.json?.message}`);
    eq((await getBorrowing(ctx.borrowTicket2, ctx.tokens.leauAdmin)).status, 'cancelled', 'cancelled status');
    eq(await inventoryAvailable(ctx, ctx.mockItemId), ITEM_QTY, 'stock untouched by cancel');
    const t = await getTicket(ctx.borrowTicket2, ctx.tokens.requester);
    eq(t.status, 'cancelled', 'ticket cancelled');
  });

  await step('borrowing queue + overdue sweep are consistent', async () => {
    const q = await api('GET', '/borrowing/queue/leau', { token: ctx.tokens.leauAdmin });
    assert(q.http === 200, `queue → HTTP ${q.http}`);
    const o = await api('GET', '/borrowing/overdue', { token: ctx.tokens.leauAdmin });
    assert(o.http === 200, `overdue → HTTP ${o.http}`);
    const m = await api('POST', '/borrowing/mark-overdue', { token: ctx.tokens.leauAdmin, body: {} });
    assert(m.http === 200, `mark-overdue → HTTP ${m.http}: ${m.json?.message}`);
  });

  await step('delete mock inventory item (soft delete)', async () => {
    const { http, json } = await api('DELETE', `/inventory/${ctx.mockItemId}`, { token: ctx.tokens.leauAdmin });
    assert(http === 200, `delete item → HTTP ${http}: ${json?.message}`);
  });
}
