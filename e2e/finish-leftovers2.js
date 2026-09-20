/** Close out run E2E-20260920-2327 leftovers + probe items. */
import { ACCOUNTS } from './config.js';
import { login, api, getTicket } from './lib.js';

const req = await login(ACCOUNTS.requester.identifier, ACCOUNTS.requester.password);
const fgmu = await login(ACCOUNTS.fgmuAdmin.identifier, ACCOUNTS.fgmuAdmin.password);
const leau = await login(ACCOUNTS.leauAdmin.identifier, ACCOUNTS.leauAdmin.password);

for (const id of [2, 3]) {
  const d = await api('DELETE', `/inventory/${id}`, { token: leau.token });
  console.log(`delete probe item ${id} →`, d.http, d.json?.message);
}

let r = await api('PATCH', '/borrowing/LEAU-TIC-10-2026/cancel', {
  token: leau.token, body: { reason: 'E2E cleanup post-run' },
});
console.log('cancel LEAU-TIC-10-2026 →', r.http, r.json?.message);

r = await api('PATCH', '/tickets/FGMU-TIC-8-2026/complete', { token: fgmu.token, body: { is_labor_only: true } });
console.log('complete FGMU-TIC-8-2026 →', r.http, r.json?.message);
r = await api('POST', '/feedback', {
  token: req.token,
  body: { ticket_id: 'FGMU-TIC-8-2026', completion_status: 'on-time', quality_rating: 4, efficiency_rating: 4, timeliness_rating: 4, remarks: 'E2E cleanup close-out' },
});
console.log('feedback FGMU-TIC-8-2026 →', r.http, r.json?.message);
const t = await getTicket('FGMU-TIC-8-2026', req.token);
console.log('FGMU-TIC-8-2026 now:', t.status, '| archived:', t.is_archived);
