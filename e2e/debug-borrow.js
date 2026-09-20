import { ACCOUNTS, BASE_URL } from './config.js';
import { login } from './lib.js';

const leau = await login(ACCOUNTS.leauAdmin.identifier, ACCOUNTS.leauAdmin.password);
for (const p of ['/borrowing/LEAU-TIC-5-2026', '/borrowing/LEAU-TIC-8-2026']) {
  const res = await fetch(`${BASE_URL}${p}`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${leau.token}` },
  });
  const text = await res.text();
  console.log(p, '→', res.status, text.slice(0, 400).replace(/\s+/g, ' '));
}
