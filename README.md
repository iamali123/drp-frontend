# DRP Frontend

React-based frontend for the Driver Retention Program (DRP) dashboard. This is a migration of the legacy Rails UI into a modern SPA that consumes the same backend APIs.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** – build and dev server
- **React Router v6** – routing (admin/driver layouts, protected routes)
- **Tailwind CSS v4** – styling
- **Shadcn-style UI** – reusable components (Button, Card, Input, Table, Select, Badge, Dialog, etc.)
- **ECharts** (via `echarts-for-react`) – charts and analytics
- **Radix UI** – primitives for Select, Dialog, Dropdown, Progress, Label

## Project Structure

```
drp-frontend/
├── public/              # Static assets, favicon
├── src/
│   ├── components/
│   │   ├── global/      # FlashMessage, DataTable
│   │   └── ui/          # Shadcn-style: button, card, input, table, badge, select, dialog, dropdown-menu, progress, label
│   ├── layouts/
│   │   ├── SafetyLayout.tsx   # Admin/safety sidebar + navbar + outlet
│   │   └── DriverLayout.tsx   # Driver sidebar + header + outlet
│   ├── lib/
│   │   ├── api.ts       # API base URL, apiRoutes, api() helper
│   │   ├── auth.tsx     # AuthProvider, useAuth, login/logout
│   │   └── utils.ts     # cn(), formatDate, formatMonthYear
│   ├── pages/
│   │   ├── auth/        # LoginPage
│   │   ├── safety/      # AdminDashboard, AnalyticsPage, DrpScorePage, SafetyScorePage, MaintenanceScorePage, OperationScorePage, DriverListPage, LeaveRequestsPage, BonusReportsPage, UsersPage, ContactQueriesPage
│   │   ├── driver/      # DriverDashboard, DriverAnalytics, DriverBonuses, DriverLeaveRequests, DriverContactPage, DriverProfilePage
│   │   ├── leave/       # LeaveRequestsPage (admin)
│   │   └── static/      # AboutDrpPage, FaqPage, RulesPage
│   ├── App.tsx          # Routes, ProtectedRoute, layout nesting
│   ├── main.tsx         # React root, BrowserRouter, AuthProvider
│   └── index.css        # Tailwind + theme variables
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── .env.example
```

## Routes (mirroring Rails)

| Route | Description |
|-------|-------------|
| `/login` | Login (email/password) |
| `/about_drp`, `/faq`, `/rules_and_regulation` | Static pages (no auth) |
| **Admin (safety)** | |
| `/admin/dashboard` | Admin dashboard (safety score cards, drivers chart, DRP status, top performers, driver bonus) |
| `/admin/analytics` | Analytics (DRP status, driver score, driver position, bonuses charts) |
| `/admin/drp-score` | DRP score status table (month filter) |
| `/admin/safety` | Safety score table |
| `/admin/maintenance` | Maintenance score table |
| `/admin/operations` | Operations score table |
| `/admin/driver-list` | Driver list (department filter) |
| `/admin/leave-requests` | Leave requests (filters, calendar link) |
| `/admin/bonus-reports` | Bonus reports table |
| `/admin/users` | Users table (department filter) |
| `/admin/contacts` | Contact queries table |
| **Driver** | |
| `/driver/dashboard` | Driver dashboard |
| `/driver/analytics` | Driver analytics |
| `/driver/bonuses` | Driver bonuses |
| `/driver/leave-requests` | Driver leave requests |
| `/driver/contact` | Contact safety form |
| `/driver/profile` | Driver profile |

## Setup

1. **Install dependencies**

   ```bash
   cd drp-frontend
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set:

   - `VITE_API_BASE` – leave empty to use Vite proxy to the Rails backend (see `vite.config.ts` proxy for `/api`).

3. **Run dev server**

   ```bash
   npm run dev
   ```

   App runs at `http://localhost:5173`. Unauthenticated users are redirected to `/login`.

4. **Build**

   ```bash
   npm run build
   ```

   Output is in `dist/`.

## API Assumptions

The frontend expects the existing Rails API surface:

- **Auth**: `POST /api/users/sign_in`, `DELETE /api/users/sign_out` (or equivalent); session/cookie or JSON with user payload including `safety_department`, `driver`, `driver_id`, etc.
- **Dashboard**: `GET /admin_dashboard`, `/dashboard/yearly_driver`, `/dashboard/monthly_drp_status_score`, `/dashboard/monthly_top_driver_score`, `/dashboard/driver_bonus_data`.
- **Analytics**: `GET /update_drp_status_chart`, `/update_driver_score_chart`, `/update_driver_position_chart`, `/update_driver_bonus_chart`, `GET /export_statistics_data`.
- **Resources**: JSON endpoints for `safety_departments`, `joyride_safety_scores`, `maintainance_scores`, `operation_scores`, `bonus_structures`, `leave_requests`, `contacts` with pagination/search/filters as used in the legacy app.

Auth is currently simulated via `localStorage` and a simple login that expects the backend to return user info; the backend team can replace this with real session/JWT and CORS as needed.

## Design

- **Admin (safety)**: Light theme, sidebar (desktop) / mobile drawer, breadcrumb navbar, teal accent.
- **Driver**: Dark header/sidebar, teal accents, same Shadcn/Tailwind components.
- **Charts**: ECharts for bar, pie, and line/area where the Rails app used Highcharts; same data shape assumed from the backend.

This keeps the migration faithful to the existing DRP UI while improving structure, maintainability, and consistency.
