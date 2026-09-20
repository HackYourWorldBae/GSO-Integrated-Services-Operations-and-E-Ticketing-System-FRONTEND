import { ACCOUNTS, BASE_URL } from './config.js';
import { login, api } from './lib.js';

const leau = await login(ACCOUNTS.leauAdmin.identifier, ACCOUNTS.leauAdmin.password);
const r = await api('GET', '/inventory?search=E2E%20probe&per_page=100', { token: leau.token });
console.log('search →', r.http);
const items = r.json?.data?.items ?? r.json?.data?.inventory ?? r.json?.data ?? [];
console.log('items:', JSON.stringify(items).slice(0, 600));
