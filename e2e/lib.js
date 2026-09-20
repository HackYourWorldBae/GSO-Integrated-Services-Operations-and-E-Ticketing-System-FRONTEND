/**
 * Shared E2E harness: HTTP client, assertions, step runner.
 * Uses global fetch (Node 18+). Retries HTTP 429 (rate throttle) with backoff.
 */
import { BASE_URL } from './config.js';

export const stats = { passed: 0, failed: 0, failures: [] };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function api(method, path, { token = null, body = undefined, retries = 4 } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let lastErr = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(25000),
      });
      let json = null;
      try { json = await res.json(); } catch { /* non-JSON body */ }
      if (res.status === 429 && attempt < retries) {
        await sleep(5000 * (attempt + 1));
        continue;
      }
      await sleep(150); // be polite to the shared backend
      return { http: res.status, json };
    } catch (e) {
      lastErr = e;
      if (attempt < retries) await sleep(2000 * (attempt + 1));
    }
  }
  throw new Error(`Request ${method} ${path} failed after retries: ${lastErr?.message}`);
}

export function assert(cond, msg) {
  if (!cond) throw new Error(`ASSERT: ${msg}`);
}

export function eq(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(`ASSERT: ${msg} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

/** Run a named step; records pass/fail and prints a one-line result. */
export async function step(name, fn) {
  const t0 = Date.now();
  try {
    const detail = await fn();
    stats.passed++;
    console.log(`  ✓ ${name} (${Date.now() - t0}ms)${detail ? ` — ${detail}` : ''}`);
    return true;
  } catch (e) {
    stats.failed++;
    stats.failures.push({ name, error: e.message });
    console.log(`  ✗ ${name} — ${e.message}`);
    return false;
  }
}

/** Require all listed steps to have passed; throws to abort the suite early. */
export function requireAll(results, label) {
  if (results.some((r) => r === false)) {
    throw new Error(`Aborting: prerequisite failed (${label})`);
  }
}

export async function login(identifier, password) {
  const { http, json } = await api('POST', '/auth/login', { body: { identifier, password } });
  assert(http === 200, `login ${identifier} → HTTP ${http}: ${json?.message}`);
  assert(json?.status === true, `login ${identifier} → status false: ${json?.message}`);
  assert(json?.data?.access_token, `login ${identifier} → missing access_token`);
  return { token: json.data.access_token, user: json.data.user };
}

/** GET /tickets/:id → data.ticket */
export async function getTicket(ticketId, token) {
  const { http, json } = await api('GET', `/tickets/${encodeURIComponent(ticketId)}`, { token });
  assert(http === 200, `GET ticket ${ticketId} → HTTP ${http}: ${json?.message}`);
  assert(json?.data?.ticket, `GET ticket ${ticketId} → missing data.ticket`);
  return json.data.ticket;
}

/** GET /borrowing/:ticketId → data.borrowing (shape-tolerant, 1 transient retry). */
export async function getBorrowing(ticketId, token) {
  let last = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const { http, json } = await api('GET', `/borrowing/${encodeURIComponent(ticketId)}`, { token });
    last = { http, json };
    if (http !== 500) break;
    await new Promise((r) => setTimeout(r, 3000)); // tolerate one transient 500
  }
  assert(last.http === 200, `GET borrowing ${ticketId} → HTTP ${last.http}: ${last.json?.message}`);
  const b = last.json?.data?.borrowing_request ?? last.json?.data?.borrowing ?? last.json?.data;
  assert(b && (b.status || b.ticket_id), `GET borrowing ${ticketId} → unrecognized shape`);
  return b;
}
