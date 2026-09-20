/** One-off cleanup of orphaned E2E tickets from an aborted run. Usage: node e2e/cleanup.js E2E-20260920-2314 */
import { ACCOUNTS, BASE_URL } from './config.js';
import { login, api } from './lib.js';

const tag = process.argv[2];
if (!tag) { console.error('Usage: node e2e/cleanup.js <RUN_TAG>'); process.exit(2); }

const req = await login(ACCOUNTS.requester.identifier, ACCOUNTS.requester.password);
const leau = await login(ACCOUNTS.leauAdmin.identifier, ACCOUNTS.leauAdmin.password);
console.log(`base=${BASE_URL} tag=${tag}`);

const mine = await api('GET', '/tickets/my-requests', { token: req.token });
const tickets = (mine.json?.data?.tickets ?? []).filter((t) =>
  JSON.stringify(t).includes(tag),
);
console.log(`found ${tickets.length} active tagged tickets`);
for (const t of tickets) {
  const id = t.id ?? t.ticket_id;
  const isBorrow = /borrow/i.test(`${t.service_type ?? ''} ${t.title ?? ''}`);
  try {
    if (isBorrow) {
      const r = await api('PATCH', `/borrowing/${encodeURIComponent(id)}/cancel`, {
        token: leau.token, body: { reason: `${tag} cleanup of aborted run` },
      });
      console.log(`  ${id} borrowing-cancel → ${r.http}`);
    } else {
      const r = await api('PATCH', `/tickets/${encodeURIComponent(id)}/cancel`, { token: req.token, body: {} });
      console.log(`  ${id} cancel → ${r.http}`);
    }
  } catch (e) { console.log(`  ${id} ERROR ${e.message}`); }
}
