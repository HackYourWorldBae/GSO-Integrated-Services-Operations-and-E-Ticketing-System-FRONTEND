/**
 * E2E configuration — GSO E-Ticketing live-backend test run.
 *
 * Targets the ONLINE backend (default https://backend.hywb.online/api/v1).
 * Credentials are mock/testing accounts; override everything via env vars.
 * NEVER commit real credentials here.
 *
 * Env overrides:
 *   E2E_BASE_URL, E2E_PASSWORD,
 *   E2E_REQUESTER, E2E_SUPERADMIN, E2E_DIRECTOR,
 *   E2E_FGMU_ADMIN, E2E_LEAU_ADMIN, E2E_SSU_ADMIN
 */
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
export const RUN_TAG = `E2E-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;

export const BASE_URL = process.env.E2E_BASE_URL || 'https://backend.hywb.online/api/v1';

const PASSWORD = process.env.E2E_PASSWORD || 'access';

export const ACCOUNTS = {
  requester:  { identifier: process.env.E2E_REQUESTER   || 'enduser@email.com', password: PASSWORD },
  superadmin: { identifier: process.env.E2E_SUPERADMIN  || 'superadmin',        password: PASSWORD },
  director:   { identifier: process.env.E2E_DIRECTOR    || 'director',          password: PASSWORD },
  fgmuAdmin:  { identifier: process.env.E2E_FGMU_ADMIN  || 'fgmu-admin',        password: PASSWORD },
  leauAdmin:  { identifier: process.env.E2E_LEAU_ADMIN  || 'leau-admin',        password: PASSWORD },
  ssuAdmin:   { identifier: process.env.E2E_SSU_ADMIN   || 'ssu-admin',         password: PASSWORD },
};

export const EXPECTED_ROLES = {
  requester:  ['student', 'employee'],
  superadmin: ['superadmin'],
  director:   ['director'],
  fgmuAdmin:  ['admin'],
  leauAdmin:  ['admin'],
  ssuAdmin:   ['admin'],
};
