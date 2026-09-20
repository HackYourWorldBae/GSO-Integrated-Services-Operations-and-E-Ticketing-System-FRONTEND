import { ACCOUNTS } from './config.js';
import { login, api } from './lib.js';
const leau = await login(ACCOUNTS.leauAdmin.identifier, ACCOUNTS.leauAdmin.password);
for (const id of [2, 3, 4]) {
  const r = await api('GET', `/inventory/${id}`, { token: leau.token });
  console.log(`GET inventory/${id} →`, r.http, JSON.stringify(r.json?.data?.item ?? r.json).slice(0, 220));
}
