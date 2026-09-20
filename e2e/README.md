# GSO E-Ticketing — Automated E2E (live backend)

Runs the full service-requesting process and borrowing chain against the
**online backend** (`backend.hywb.online`) and verifies data consistency
at every step, so UI/UX review can focus on look and feel.

## Run

```bash
npm run e2e
# or with overrides:
E2E_BASE_URL=https://backend.hywb.online/api/v1 E2E_PASSWORD=access npm run e2e
```

Exit code `0` = all green, `1` = failures (listed at the end).

## Suites

| # | File | Covers |
|---|------|--------|
| 01 | `suites/01-auth.js` | Login for all 6 mock roles, `/auth/me`, wrong-password 401, requester 403 on admin queue, unauthenticated 401 |
| 02 | `suites/02-service-lifecycle.js` | FGMU multi-service intake (or student 403 guard) → queue → approve → assign mock personnel → materials → complete → feedback → closed/archived; LEAU hauling labor-only path; SSU custom-Others-type intake + investigate → notation → resolve → feedback; requester cancel; my-requests/completed/logs/notifications consistency; mock personnel cleanup |
| 03 | `suites/03-borrowing-chain.js` | Mock inventory item → borrowing intake (blank qty ⇒ 1, no model) → admin-approve guard → pre-approval assign guard → director approve → assign (stock −2) → ready → pickup → return (stock restored, ticket closed+archived, no rating) → second ticket approve → cancel → queue/overdue sweep → mock item soft-delete |
| 04 | `suites/04-analytics.js` | Executive analytics shape, per-service (not per-ticket) counting, period filters, completion-health arithmetic, unit stats + per-unit endpoints |
| 05 | `suites/05-decline-flows.js` | Decline edge cases for FGMU/LEAU/SSU + borrowing director-reject: reason stored, ticket archived, requester declined-notification received, declined tickets reject feedback + re-approve; decline guards (422 no reason, 400 after approve) |

## Test data policy

- Everything created is tagged with the run id (`E2E-YYYYMMDD-HHMM`) in names/remarks.
- Tickets are driven to terminal states and **left closed/archived** for your review.
- Mock inventory items (soft-deleted) and mock personnel (deleted) are cleaned up.
- Credentials: mock accounts only — override via `E2E_*` env vars, never commit real ones.

## Deploy gate (backend fixes verified by this suite)

These local backend fixes must be deployed to `backend.hywb.online`
before suites 01/03 go fully green:

1. `app/Filters/RoleGuardFilter.php` — init `$hasDynamicAccess = false`
   (else any role-guard denial fatals to HTTP 500 instead of 403).
2. `app/Controllers/API/InventoryController.php` — cast `is_active` to int
   (bool `true` fails `in_list[0,1]` validation → item creation 500s).
3. `app/Config/Routes.php` — declare `borrowing/overdue` (and queue)
   before `borrowing/(:segment)` (wildcard was swallowing it → 404).
4. `app/Controllers/API/TicketController.php` — borrowing intake validates
   upfront (422, explicit rollback) and guards the borrowing insert so a
   failed insert can never commit an orphan ticket with no borrowing record.

## Helpers

- `probe.js` — read-only login/role smoke check
- `cleanup.js <RUN_TAG>` — cancels active tagged tickets of an aborted run
- `finish-leftovers.js` — one-off close-out script (historical runs)

## Files

- `config.js` — base URL, accounts, run tag
- `lib.js` — fetch client (429 retry), assertions, step runner, login/ticket/borrowing helpers
- `run.js` — entry point, runs suites in order
