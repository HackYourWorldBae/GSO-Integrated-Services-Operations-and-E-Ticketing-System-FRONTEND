import { BASE_URL, ACCOUNTS } from './config.js';
import { login, api } from './lib.js';

for (const [key, c] of Object.entries(ACCOUNTS)) {
  try {
    const { user } = await login(c.identifier, c.password);
    console.log(`${key}: OK role=${user?.role} unit=${user?.unit_id ?? '-'} verified=${user?.is_verified ?? '?'}`);
  } catch (e) {
    console.log(`${key}: FAIL ${e.message}`);
  }
}
const { token } = await login(ACCOUNTS.requester.identifier, ACCOUNTS.requester.password).catch(() => ({}));
if (token) {
  const r = await api('GET', '/auth/me', { token });
  console.log('me:', r.http, JSON.stringify(r.json?.data ?? r.json).slice(0, 300));
}
