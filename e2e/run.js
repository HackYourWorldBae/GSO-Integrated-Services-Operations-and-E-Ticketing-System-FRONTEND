#!/usr/bin/env node
/**
 * E2E runner — GSO E-Ticketing live-backend verification.
 *
 *   npm run e2e
 *   E2E_BASE_URL=https://backend.hywb.online/api/v1 npm run e2e
 *
 * Runs suites in order against the ONLINE backend using mock accounts
 * (see config.js). Creates real tickets, drives them to terminal states,
 * and leaves closed test data tagged with the run id for traceability.
 */
import { RUN_TAG } from './config.js';
import { stats } from './lib.js';
import { run as auth } from './suites/01-auth.js';
import { run as lifecycle } from './suites/02-service-lifecycle.js';
import { run as borrowing } from './suites/03-borrowing-chain.js';
import { run as analytics } from './suites/04-analytics.js';
import { run as declines } from './suites/05-decline-flows.js';

const ctx = { tokens: {}, users: {}, adminForTicket: {} };

console.log(`GSO E-Ticketing E2E — run ${RUN_TAG}`);

try {
  await auth(ctx);
  await lifecycle(ctx);
  await borrowing(ctx);
  await analytics(ctx);
  await declines(ctx);
} catch (e) {
  stats.failed++;
  stats.failures.push({ name: '(suite abort)', error: e.message });
  console.log(`\nABORTED: ${e.message}`);
}

console.log('\n================ RESULT ================');
console.log(`PASSED: ${stats.passed}   FAILED: ${stats.failed}`);
if (stats.failures.length > 0) {
  console.log('Failures:');
  for (const f of stats.failures) console.log(`  - ${f.name}: ${f.error}`);
}
process.exit(stats.failed > 0 ? 1 : 0);
