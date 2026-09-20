/**
 * Suite 01 — Authentication & route guards (all roles).
 * Fills ctx.tokens / ctx.users for downstream suites.
 */
import { ACCOUNTS, EXPECTED_ROLES } from '../config.js';
import { api, assert, eq, step, requireAll, login } from '../lib.js';

export async function run(ctx) {
  console.log('\n[01] Auth & guards');
  const pre = [];

  for (const [key, creds] of Object.entries(ACCOUNTS)) {
    pre.push(await step(`login ${key} (${creds.identifier})`, async () => {
      const { token, user } = await login(creds.identifier, creds.password);
      ctx.tokens[key] = token;
      ctx.users[key] = user;
      const roles = EXPECTED_ROLES[key];
      assert(roles.includes(user?.role), `role ${user?.role} not in [${roles}]`);
      if (key === 'fgmuAdmin') eq(Number(user?.unit_id ?? user?.unitId), 1, 'fgmu admin unit');
      if (key === 'leauAdmin') eq(Number(user?.unit_id ?? user?.unitId), 2, 'leau admin unit');
      if (key === 'ssuAdmin') eq(Number(user?.unit_id ?? user?.unitId), 3, 'ssu admin unit');
      return `role=${user?.role}`;
    }));
  }
  requireAll(pre, 'logins');

  ctx.requesterRole = ctx.users.requester?.role;
  console.log(`  · requester role = ${ctx.requesterRole} (drives lifecycle branching)`);

  await step('GET /auth/me returns the requester profile', async () => {
    const { http, json } = await api('GET', '/auth/me', { token: ctx.tokens.requester });
    eq(http, 200, '/auth/me http');
    assert(json?.data?.user || json?.data?.id || json?.data?.email, '/auth/me payload');
    return `id=${json?.data?.user?.id ?? json?.data?.id ?? '?'}`;
  });

  await step('wrong password is rejected (401)', async () => {
    const { http, json } = await api('POST', '/auth/login', {
      body: { identifier: ACCOUNTS.requester.identifier, password: 'wrong-password-123' },
    });
    eq(http, 401, 'wrong-password http');
    eq(json?.status, false, 'wrong-password status flag');
  });

  await step('requester is forbidden from admin queue (403)', async () => {
    const { http } = await api('GET', '/tickets/queue/FGMU', { token: ctx.tokens.requester });
    assert(http === 403, `expected 403, got ${http}`);
  });

  await step('unauthenticated request is rejected (401)', async () => {
    const { http } = await api('GET', '/auth/me');
    assert(http === 401, `expected 401, got ${http}`);
  });
}
