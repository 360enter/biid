# Apex Strategic Holdings Procurement Platform Architecture

## Product Positioning

Apex Strategic Holdings operates a legitimate enterprise procurement and contractor management portal for infrastructure, utilities, energy, and commercial development mandates. The platform publishes bid notices, distributes public documents, sells or approves access to premium bid packages, receives contractor proposals, and notifies procurement administrators through Discord webhooks.

The user experience should feel closer to an institutional procurement portal than a generic SaaS page: restrained typography, confident spacing, high-contrast data surfaces, clear workflows, minimal ornament, and strong auditability.

## Cloudflare-Native System Design

The platform is designed for Cloudflare Pages and Workers, with no dependency on a VPS, persistent server filesystem, or long-running backend process.

Core runtime:

- Cloudflare Pages serves the static frontend in `public/`.
- Pages Functions in `functions/api/` provide serverless API endpoints.
- D1 stores projects, contractors, purchases, bids, and audit events.
- KV stores short-lived document access grants and rate-limit counters.
- R2 should store public notices, premium drawings, addendums, blueprints, and technical packages.
- Durable Objects can be added for strongly consistent bid-room sessions, live administrator review queues, or per-project submission locks.
- Discord webhooks receive real-time operational alerts for submissions, purchases, registrations, and inquiries.

## Routing Structure

Frontend routes are SPA-style and Cloudflare Pages-compatible:

- `/` and `/#home`: landing page
- `/#opportunities`: searchable project directory
- `/projects/:id`: routed back to `index.html` for project detail handling
- `/#submit`: contractor bid wizard
- `/#admin`: admin dashboard shell
- `/#security`: security and compliance overview

API routes:

- `GET /api/projects`: list projects with search, category, status, and sort support
- `POST /api/projects`: create a new project in D1
- `GET /api/projects/:id`: fetch one project
- `POST /api/purchases`: confirm package purchase and create KV document access grant
- `POST /api/bids`: capture contractor and bid submission records
- `POST /api/inquiries`: notify administrators of project inquiries

## Component Hierarchy

- `AppShell`
- `SiteHeader`
- `Hero`
- `TrustBand`
- `ProjectDirectory`
- `FilterPanel`
- `CategoryTabs`
- `ProjectCard`
- `BidDeskPanel`
- `ProjectDetailDialog`
- `PaymentAccessPanel`
- `WorkflowSection`
- `BidSubmissionWizard`
- `WizardProgress`
- `AdminDashboardShell`
- `AdminProjectTable`
- `SecurityStandardsSection`
- `ToastRegion`
- `SiteFooter`

The current implementation is dependency-free JavaScript for portability. A future React, Solid, or Vue layer can preserve the same component boundaries.

## Database and Storage Strategy

D1 tables:

- `projects`: canonical procurement opportunities and serialized project detail arrays
- `contractors`: contractor identity and contact profile
- `purchases`: document package purchases and receipt metadata
- `bids`: proposal records and structured submission payloads
- `audit_events`: compliance-oriented operational history

KV namespaces:

- `DOCUMENT_ACCESS`: `access:{projectId}:{contractorEmail}` records with TTL for unlocked packages
- `RATE_LIMITS`: per-IP and per-route counters for inquiry, purchase, and bid endpoints

R2 buckets:

- `apex-public-documents`: public notices and invitation-to-bid documents
- `apex-premium-documents`: premium packages, drawings, addendums, and specifications

Document access flow:

1. Contractor reviews a public project page.
2. Contractor accepts package terms and completes payment.
3. Payment provider webhook verifies the transaction.
4. Worker writes a `purchases` record to D1.
5. Worker writes a KV access grant with an expiration window.
6. Premium download route verifies the grant and returns signed R2 URLs.
7. Download activity is recorded in `audit_events`.

## Payment Workflow

The checked-in implementation includes a payment confirmation endpoint and receipt model. For production, connect a provider such as Stripe, Paystack, Flutterwave, or bank-transfer approval workflow.

Production payment sequence:

1. `POST /api/payment-intents` creates a provider checkout session.
2. Contractor completes checkout on provider-hosted secure page or embedded approved component.
3. Provider calls a signed webhook route.
4. Worker validates the webhook signature with `PAYMENT_PROVIDER_SECRET`.
5. D1 purchase and KV access records are created.
6. Discord receives a purchase notification.
7. Contractor sees receipt and unlocked package state.

## Contractor Workflow

1. Browse public opportunities.
2. Filter by category, status, deadline, and estimated value.
3. Review notice, project overview, scope, criteria, and timeline.
4. Download public notice.
5. Unlock premium documents through payment or admin approval.
6. Complete the multi-step bid submission wizard.
7. Submit company information, qualification summary, attachment manifest, proposal title, commercial value, and acknowledgments.
8. Receive confirmation reference.
9. Administrators receive a Discord webhook notification.

## Admin Workflow

The admin shell is structured around four operating areas:

- Projects: add, edit, archive, and publish opportunities.
- Documents: associate public and premium files with project packages.
- Access: approve contractors, revoke access, resend receipts, and view unlock windows.
- Audit Log: review project changes, document downloads, purchases, and submission events.

Adding a future project should require only:

1. Insert a `projects` D1 record or call `POST /api/projects`.
2. Upload documents to R2.
3. Attach public and premium document metadata.
4. Publish the project status.

The directory, filters, detail modal, admin table, and bid wizard project selector all consume the same project data shape.

## Discord Webhook Strategy

Events sent to Discord:

- New bid submission
- Document purchase
- Contractor registration
- Project inquiry
- Project creation or archive
- Payment failure or suspicious retry volume

Webhook payloads use embeds with concise fields, event timestamps, and a color by event type. Secrets should be set with `wrangler secret put DISCORD_WEBHOOK_URL`.

## Security and Compliance Concepts

- Validate all required API fields at the edge.
- Add Turnstile before purchase, bid, and inquiry submissions.
- Rate limit sensitive routes using KV counters by IP, route, and time bucket.
- Verify payment webhooks with provider signatures.
- Store premium documents in private R2 buckets and serve signed URLs only.
- Keep document unlocks short-lived in KV and recreate them through receipt verification.
- Write audit events for project mutations, document access, purchase confirmations, and bid submissions.
- Use strict response headers from `public/_headers` and `functions/_middleware.js`.
- Avoid storing sensitive uploaded documents in D1; upload to R2 and store metadata only.

## UI System

Palette:

- Apex Navy `#0f172a`: authority, headers, admin shell
- Institutional Teal `#0f766e`: primary actions, success states, progress
- Procurement Blue `#2563eb`: active statuses and information accents
- Ledger Gold `#b7791f`: premium document and commercial accents
- Slate `#334155`: secondary text and table data
- Paper `#f8fafc`: application background

Typography:

- System UI stack for fast Cloudflare delivery and broad enterprise compatibility.
- Hero scale reserved for first viewport only.
- Compact headings inside panels, cards, tables, and forms.

Spacing:

- 8px radius maximum for cards and controls.
- 12px to 24px component-level spacing.
- 86px desktop section spacing.
- Responsive single-column mobile flow.

Motion:

- Short hover lifts on cards and buttons.
- Progress rail state changes in the submission wizard.
- Hero image settle animation.
- Loading skeleton shimmer for project data.
- Toast rise animation for confirmations.

## Deployment Structure

```text
public/
  index.html
  styles.css
  app.js
  _headers
  _redirects
functions/
  _middleware.js
  api/
    projects/index.js
    projects/[id].js
    purchases/index.js
    bids/index.js
    inquiries/index.js
data/
  projects.json
schema.sql
seed.sql
wrangler.toml
package.json
tools/
  validate.mjs
```

## Implementation Plan

1. Deploy the static Pages frontend and verify the enterprise UI renders cleanly.
2. Create D1 database and apply `schema.sql`.
3. Seed initial project records from `seed.sql`.
4. Create KV namespaces for document access grants and rate limits.
5. Create private R2 buckets for public and premium documents.
6. Replace placeholder public notice paths with R2-backed signed or public URLs.
7. Add production payment intent and webhook routes for the selected payment provider.
8. Add Turnstile validation to bid, purchase, inquiry, and admin routes.
9. Add admin authentication with signed session cookies or Cloudflare Access.
10. Add R2 direct-upload flow for contractor attachments.
11. Record audit events on all mutations and document access.
12. Add Durable Object review queues if simultaneous bid-room coordination becomes important.
13. Add CI checks for schema migration, API validation, and frontend smoke tests.
