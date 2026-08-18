# Timely intern project guide

Last reviewed: 2026-08-18

This is the shortest useful map of the whole Timely application. Read it once before changing code, then follow the source links when working on a feature.

## Index

1. [What Timely does](#1-what-timely-does)
2. [System architecture](#2-system-architecture)
3. [Run the application](#3-run-the-application)
4. [Frontend index](#4-frontend-index)
5. [Backend index](#5-backend-index)
6. [Core data model](#6-core-data-model)
7. [API endpoint index](#7-api-endpoint-index)
8. [Important application flows](#8-important-application-flows)
9. [How the project evolved](#9-how-the-project-evolved)
10. [How to make a safe change](#10-how-to-make-a-safe-change)
11. [Current limitations and naming debt](#11-current-limitations-and-naming-debt)

## 1. What Timely does

Timely helps a signed-in business owner:

- create customers and tasks;
- move tasks from pending to in progress, completed, or cancelled;
- automatically schedule a reminder when a task is created;
- reschedule, cancel, or delete scheduled reminders from the Tasks screen;
- send reminder emails through a background job;
- store notification records for sent or failed emails; and
- view live dashboard totals, urgent tasks, upcoming tasks, and recent activity.

Operational data comes from the backend. Landing-page feature descriptions are presentation copy, not mock business records.

## 2. System architecture

```text
Browser
  -> React pages and feature components
  -> Context/hooks for session and task state
  -> src/lib/*Api.js
  -> Axios client at VITE_API_URL
  -> Express /api/v1 routes
  -> auth middleware + controller + service
  -> Mongoose models
  -> MongoDB

Every minute:
  cron job -> due reminder -> notification record -> SMTP email
```

The frontend is React 19, React Router, Axios, Tailwind CSS, and Vite. The backend is Express 5, Mongoose, MongoDB, Zod validation, JWT authentication, Nodemailer, Luxon, and node-cron.

## 3. Run the application

### Backend

From `timely-backend`:

```powershell
npm install
npm run dev
```

The backend `.env` needs at least `DBSTRING` and `JWT_SECRET` to start. A useful development configuration also supplies:

```dotenv
PORT=5050
NODE_ENV=development
APP_TIMEZONE=Africa/Lagos
JWT_EXPIRES_IN=15m
SMTP_HOST=...
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASSWORD=...
EMAIL_FROM=...
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

SMTP settings are required for real reminder and password-reset email delivery. Never commit real secrets.

### Frontend

From `timely-frontend`:

```powershell
npm install
npm run dev
```

`.env.development` points Axios to:

```dotenv
VITE_API_URL=http://localhost:5050/api/v1
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## 4. Frontend index

| Path | Responsibility |
| --- | --- |
| [`src/main.jsx`](../src/main.jsx) | Mounts the React application. |
| [`src/App.jsx`](../src/App.jsx) | Declares public, authentication, protected dashboard, and fallback routes. |
| [`src/lib/api.js`](../src/lib/api.js) | Configures Axios, credentials, bearer tokens, refresh-on-401, and expired-session handling. |
| [`src/lib/*Api.js`](../src/lib) | Small endpoint clients for auth, tasks, customers, reminders, notifications, and dashboard data. |
| [`src/context/AuthContext.jsx`](../src/context/AuthContext.jsx) | Owns login, registration, logout, and the current browser session. |
| [`src/context/OrdersContext.jsx`](../src/context/OrdersContext.jsx) | Owns task, customer, and reminder state and coordinates multi-request workflows. The name is legacy. |
| [`src/pages`](../src/pages) | Route-level screens: landing, dashboard, tasks, customers, notifications, settings, and not-found. |
| [`src/features`](../src/features) | Feature-specific components and task formatting/workflow helpers. |
| [`src/shared/components/ui`](../src/shared/components/ui) | Reusable buttons, cards, form controls, modal, table, and typography. |
| [`src/layouts/DashboardLayout.jsx`](../src/layouts/DashboardLayout.jsx) | Fixed dashboard shell containing the sidebar, topbar, route outlet, and New Task modal. |

Frontend routes:

| URL | Access | Screen |
| --- | --- | --- |
| `/`, `/home` | Public | Landing page |
| `/login`, `/register` | Signed-out users | Authentication |
| `/forgot-password`, `/reset-password` | Signed-out users | Password recovery |
| `/dashboard` | Protected | Dashboard overview |
| `/dashboard/tasks` | Protected | Task and reminder management |
| `/dashboard/customers` | Protected | Customer list |
| `/dashboard/notifications` | Protected | Notification history |
| `/dashboard/settings` | Protected | Read-only account details |
| `/dashboard/orders` | Protected | Legacy redirect to `/dashboard/tasks` |

## 5. Backend index

| Path | Responsibility |
| --- | --- |
| [`src/server.js`](../../timely-backend/src/server.js) | Validates environment variables, connects MongoDB, starts the reminder job, and listens for HTTP traffic. |
| [`src/app.js`](../../timely-backend/src/app.js) | Configures security, CORS, body parsing, cookies, routes, 404 responses, and error handling. |
| [`src/config`](../../timely-backend/src/config) | Environment, database, and mail transport configuration. |
| [`src/middleware`](../../timely-backend/src/middleware) | JWT protection, ObjectId checks, and centralized errors. |
| [`src/modules`](../../timely-backend/src/modules) | Feature modules. Each generally has routes, controller, service, model, and validation files. |
| [`src/jobs/reminder.job.js`](../../timely-backend/src/jobs/reminder.job.js) | Claims and processes up to 50 due reminders every minute. |
| [`src/services/email.service.js`](../../timely-backend/src/services/email.service.js) | Builds and sends password-reset and task-reminder emails. |
| [`src/utils/date.js`](../../timely-backend/src/utils/date.js) | Application-timezone deadline calculations used by tasks and dashboard summaries. |

Backend layers have distinct jobs:

```text
route -> selects middleware/controller
controller -> validates input and shapes HTTP response
service -> applies business rules and database operations
model -> defines persisted MongoDB structure
```

## 6. Core data model

| Entity | Important fields | Relationship |
| --- | --- | --- |
| User | businessName, ownerName, email, password, role | Owns all workspace records. |
| Customer | userId, name, phone | Belongs to one user and can have many tasks. |
| Task | userId, customerId, title, dueDate, dueTime, priority, status | Belongs to one user and customer. |
| Reminder | userId, taskId, remindAt, status, attempts | Belongs to one task and schedules notification processing. |
| Notification | userId, taskId, reminderId, recipient, subject, message, status | Audit record for one reminder email attempt. |
| RefreshToken | userId, tokenHash, expiresAt, revoked | Maintains a renewable login session. |
| PasswordResetToken | userId, tokenHash, expiresAt, used | Allows one password reset. |

Task status flow:

```text
pending -> in_progress -> completed
   |             |
   +-----------> cancelled
```

Reminder status flow:

```text
scheduled -> processing -> sent
    |             |
    |             +-----> failed
    +-------------------> cancelled
```

## 7. API endpoint index

All paths below begin with `/api/v1`. Protected routes require `Authorization: Bearer <accessToken>`.

### Authentication

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Create an account. |
| POST | `/auth/login` | Return an access token and user; set the refresh-token cookie. |
| POST | `/auth/refresh` | Rotate the refresh token and return a new access token. |
| POST | `/auth/logout` | Revoke the refresh token and clear its cookie. |
| POST | `/auth/forgot-password` | Email a password-reset link. |
| POST | `/auth/reset-password` | Consume a reset token and set a new password. |
| GET | `/auth/me` | Return the authenticated user. |

### Tasks

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/tasks` | Create a task. |
| GET | `/tasks` | List tasks; supports `status`, `priority`, `due`, `search`, `page`, and `limit`. |
| GET | `/tasks/:id` | Fetch one owned task. |
| PATCH | `/tasks/:id` | Update task details. |
| PATCH | `/tasks/:id/start` | Move a pending task to in progress. |
| PATCH | `/tasks/:id/complete` | Complete a task and cancel its scheduled reminders. |
| PATCH | `/tasks/:id/cancel` | Cancel a task and its scheduled reminders. |
| DELETE | `/tasks/:id` | Delete a task and its scheduled reminders. See the current limitation below. |

Task creation expects `customerId`, `title`, `dueDate`, `dueTime`, `priority`, and optional `notes`.

### Customers, reminders, notifications, and dashboard

| Method | Path | Purpose |
| --- | --- | --- |
| POST / GET | `/customers` | Create or list customers. |
| GET / PATCH / DELETE | `/customers/:id` | Read, update, or delete one customer. |
| POST / GET | `/reminders` | Schedule or list reminders. |
| GET / PATCH / DELETE | `/reminders/:id` | Read, reschedule, or delete one reminder. |
| PATCH | `/reminders/:id/cancel` | Cancel a scheduled reminder. |
| GET | `/notifications` | List notification records; supports status and pagination. |
| GET | `/notifications/:id` | Fetch one notification record. |
| GET | `/dashboard` | Fetch summary counts and dashboard task collections. |

Successful responses generally use `{ success, message?, data? }`. Errors use `{ success: false, message }`.

## 8. Important application flows

### Login and token refresh

1. The login form calls `loginAccount`.
2. The backend verifies the password, returns an access token, and sets an HTTP-only refresh cookie.
3. The frontend stores the access token and user locally so protected routes survive refreshes.
4. Axios adds the bearer token to API requests.
5. After a protected request returns `401`, Axios attempts `/auth/refresh` once and retries the request.
6. If refresh fails, stored session data is cleared and the user is returned to signed-out state.

### Creating a task

1. The user opens New Task and enters customer, deadline, priority, and notes.
2. `OrdersContext` reuses a customer with the same normalized phone number or creates one.
3. It creates the task through `POST /tasks`.
4. It immediately creates a reminder at the task deadline through `POST /reminders`.
5. If reminder creation fails, the frontend attempts to delete the newly created task so a half-created workflow is not left behind.
6. Local state is updated and a `timely:data-changed` browser event refreshes dashboard data.

### Reminder and notification processing

1. A reminder remains `scheduled` until `remindAt`.
2. The cron job checks once per minute and atomically changes a due reminder to `processing`.
3. Completed, cancelled, or missing tasks cause the reminder to be cancelled.
4. Otherwise, the notification service creates a pending notification record and sends an email.
5. Success marks both notification and reminder as `sent`; failure records timestamps and error messages.
6. The Notifications page fetches the stored notification history from the API.

## 9. How the project evolved

This timeline combines repository commits with the current working tree:

1. **Initial scaffold (`a8b0def`)** — established the Vite UI, reusable components, dashboard layout, authentication foundation, Express application, and initial module placeholders.
2. **Customer and task domain (`742fa25`)** — replaced the empty order concept with real Customer and Task models, validation, services, controllers, and routes.
3. **Reminder and dashboard logic (`7c863fe`)** — added reminder persistence, task deadline behavior, timezone-aware dashboard calculations, and the frontend dashboard API hook.
4. **Completed backend routes (`d6b5eba`)** — added ObjectId validation, notification storage, email delivery, the minute-based reminder worker, and broader route wiring.
5. **Frontend/backend integration (current working tree)** — connected authentication, tasks, customers, reminders, notifications, and dashboard screens to Axios API modules; removed mock operational records.
6. **Task-first UX (current working tree)** — changed customer-facing “Orders” labels and routes to “Tasks,” placed reminder management inside the Tasks table, and made a deadline reminder part of New Task creation.

The result is an incremental system: UI shell first, domain persistence second, background automation third, then live frontend wiring and terminology cleanup.

## 10. How to make a safe change

For a normal feature:

1. Find the owner module from the indexes above.
2. Confirm the backend response shape before editing frontend mapping code.
3. Add or update backend validation, service rules, controller response, and route in that order.
4. Add the matching function in `src/lib/*Api.js`.
5. Put shared state/workflows in a context or hook; keep pages focused on rendering and user actions.
6. Reuse `src/shared/components/ui` and preserve established colors and spacing.
7. Test the happy path, validation failure, unauthorized request, empty state, and API failure.

Frontend checks:

```powershell
npm run lint
npm run build
```

Backend checks currently available:

```powershell
Get-ChildItem src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
node --test src/utils/date.test.js
node -e "require('./src/app'); console.log('app loads')"
```

The backend does not yet define `npm test` or `npm run lint`, so do not claim those checks ran.

## 11. Current limitations and naming debt

- `OrdersContext`, `OrdersPage`, `CreateOrderModal`, and several `order*` helpers are legacy internal names. They manage Tasks; new customer-facing text and endpoints should say `task`.
- `/api/v1/orders` remains a legacy alias in `src/routes/index.js`. New frontend work must use `/api/v1/tasks`.
- The Users route is still a protected `501 Not Implemented` scaffold. Settings currently shows cached account details and cannot edit them.
- The notification API stores `subject`, but `NotificationsPage.jsx` currently renders `notification.title`; the heading needs alignment before notification UI work is considered complete.
- The task route currently registers DELETE with a numeric path because `router.delete(~` contains a stray `~`. Fix that route before relying on task-deletion rollback or exposing delete in the UI.
- The background worker checks every minute, so a reminder can be delivered shortly after its exact timestamp rather than at the exact second.
- There is no automated end-to-end browser suite yet. Lint/build, backend module checks, API smoke tests, and targeted live reminder tests are the current validation layers.
