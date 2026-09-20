/** Finish this run's non-terminal leftovers so nothing tagged stays active. */
import { ACCOUNTS } from './config.js';
import { login, api, getTicket } from './lib.js';

const req = await login(ACCOUNTS.requester.identifier, ACCOUNTS.requester.password);
const fgmu = await login(ACCOUNTS.fgmuAdmin.identifier, ACCOUNTS.fgmuAdmin.password);
const leau = await login(ACCOUNTS.leauAdmin.identifier, ACCOUNTS.leauAdmin.password);

// LEAU-TIC-5-2026: approved_director borrowing with no inventory → admin cancel.
let r = await api('PATCH', '/borrowing/LEAU-TIC-5-2026/cancel', {
  token: leau.token, body: { reason: 'E2E cleanup: mock inventory unavailable pre-deploy' },
});
console.log('cancel LEAU-TIC-5-2026 →', r.http, r.json?.message);

// FGMU-TIC-5-2026: approved → complete (labor-only) → feedback → closed.
r = await api('PATCH', '/tickets/FGMU-TIC-5-2026/complete', { token: fgmu.token, body: { is_labor_only: true } });
console.log('complete FGMU-TIC-5-2026 →', r.http, r.json?.message);
r = await api('POST', '/feedback', {
  token: req.token,
  body: { ticket_id: 'FGMU-TIC-5-2026', completion_status: 'on-time', quality_rating: 4, efficiency_rating: 4, timeliness_rating: 4, remarks: 'E2E cleanup close-out' },
});
console.log('feedback FGMU-TIC-5-2026 →', r.http, r.json?.message);
let t = await getTicket('FGMU-TIC-5-2026', req.token);
console.log('FGMU-TIC-5-2026 now:', t.status, '| archived:', t.is_archived);
if (t.status !== 'closed') {
  r = await api('POST', '/tickets/FGMU-TIC-5-2026/verify-close', { token: req.token, body: {} });
  console.log('verify-close →', r.http, r.json?.message);
}
t = await getTicket('LEAU-TIC-5-2026', req.token).catch((e) => ({ status: 'ERR ' + e.message }));
console.log('LEAU-TIC-5-2026 now:', t.status, '| archived:', t.is_archived);
