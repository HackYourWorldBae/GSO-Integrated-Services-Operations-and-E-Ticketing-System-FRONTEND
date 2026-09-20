import { ACCOUNTS, BASE_URL } from './config.js';
import { login, api } from './lib.js';

const leau = await login(ACCOUNTS.leauAdmin.identifier, ACCOUNTS.leauAdmin.password);

// A: explicit is_active=1 (int)
let r = await api('POST', '/inventory', {
  token: leau.token,
  body: { name: 'E2E probe item A', category: 'tools', quantity_total: 5, condition_status: 'good', is_active: 1 },
});
console.log('explicit is_active=1 →', r.http, JSON.stringify(r.json).slice(0, 200));
const idA = r.json?.data?.item?.id;

// B: omitted is_active (default path)
r = await api('POST', '/inventory', {
  token: leau.token,
  body: { name: 'E2E probe item B', category: 'tools', quantity_total: 5, condition_status: 'good' },
});
console.log('omitted is_active →', r.http, JSON.stringify(r.json).slice(0, 200));
const idB = r.json?.data?.item?.id;

// cleanup whatever got created
for (const id of [idA, idB].filter(Boolean)) {
  const d = await api('DELETE', `/inventory/${id}`, { token: leau.token });
  console.log(`cleanup ${id} →`, d.http);
}
