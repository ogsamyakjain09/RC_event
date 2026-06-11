# RC Events - AI-Powered Event Operations Platform

## Project Overview

RC Events is a SaaS-ready, mobile-first event operations platform designed for professional wedding planners. It provides a unified dashboard for managing weddings and events with AI-assisted insights, vendor coordination, budget tracking, task management, and approval workflows.

The platform uses **PocketBase** as its backend (SQLite + REST API) and a **React + TypeScript + Vite** frontend styled with **Tailwind CSS v4** and **shadcn/ui** components.

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Frontend Framework | React | 18.3.1 |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 6.3.5 |
| Package Manager | pnpm | - |
| Styling | Tailwind CSS | 4.1.12 |
| UI Components | shadcn/ui (Radix UI) | 47+ primitives |
| Icon Library | Lucide React | 0.487.0 |
| Charts | Recharts | 2.15.2 |
| Routing | react-router | 7.13.0 |
| Forms | react-hook-form | 7.55.0 |
| Drag & Drop | react-dnd | 16.0.1 |
| Animations | framer-motion (motion) | 12.23.24 |
| Notifications | sonner | 2.0.3 |
| Calendar | react-day-picker | 8.10.1 |
| Backend | PocketBase | 0.25.0 |
| Database | SQLite | via PocketBase |
| Containerization | Docker | Alpine-based |
| Deployment (FE) | Vercel | SPA |
| Deployment (BE) | Railway | Docker |

---

## Project Structure

```
rc-events/
├── .env                          # Environment variables
├── .env.example                  # Template for environment
├── index.html                    # Main app entry HTML
├── docs.html                     # Documentation site entry HTML
├── vite.config.ts                # Vite build configuration
├── package.json                  # Dependencies & scripts
├── Dockerfile                    # PocketBase Docker image
├── docker-compose.yml            # Docker Compose for PocketBase
├── vercel.json                   # Vercel deployment config
├── default_shadcn_theme.css      # shadcn/ui theme variables
│
├── src/
│   ├── main.tsx                  # React entry point
│   ├── pocketbase.ts             # PocketBase client instance
│   │
│   ├── types/
│   │   └── index.ts              # All TypeScript interfaces
│   │
│   ├── context/
│   │   ├── AuthContext.tsx        # Authentication (PocketBase auth)
│   │   ├── EventContext.tsx       # Event data & selection
│   │   └── AppDataContext.tsx     # All app data (tasks, vendors, etc.)
│   │
│   ├── app/
│   │   ├── App.tsx               # Root component with routing
│   │   └── lib/                  # Reusable UI components
│   │       ├── ActionButton.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── DashboardCard.tsx
│   │       ├── ChatMessage.tsx
│   │       ├── ContactCard.tsx
│   │       ├── ContactListItem.tsx
│   │       ├── ContactsPage.tsx
│   │       ├── QuickActionChip.tsx
│   │       ├── QuickContactWidget.tsx
│   │       ├── CircularProgress.tsx
│   │       ├── MetricCard.tsx
│   │       ├── MiniChart.tsx
│   │       ├── Timeline.tsx
│   │       ├── CRMDashboard.tsx
│   │       └── figma/
│   │           └── ImageWithFallback.tsx
│   │
│   ├── components/
│   │   ├── Layout.tsx            # App layout with header
│   │   ├── BottomNav.tsx         # Bottom navigation bar
│   │   └── cards/               # Data display cards
│   │       ├── EventCard.tsx
│   │       ├── TaskCard.tsx
│   │       ├── ApprovalCard.tsx
│   │       └── VendorCard.tsx
│   │
│   ├── pages/                    # Page-level components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── EventDetailsPage.tsx
│   │   ├── TaskListPage.tsx
│   │   ├── TaskDetailPage.tsx
│   │   ├── ApprovalBoardPage.tsx
│   │   ├── VendorBoardPage.tsx
│   │   ├── BudgetPage.tsx
│   │   ├── ContactsPage.tsx      # Wraps lib/ContactsPage
│   │   ├── ChatPage.tsx
│   │   ├── AlertsPage.tsx
│   │   ├── CalendarPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── CreateEventPage.tsx
│   │   ├── CreateTaskPage.tsx
│   │   ├── CreateVendorAssignmentPage.tsx
│   │   ├── CreateBudgetItemPage.tsx
│   │   └── CreateApprovalPage.tsx
│   │
│   ├── styles/                   # CSS files
│   │   ├── index.css             # Entry point
│   │   ├── fonts.css             # Inter font import
│   │   ├── tailwind.css          # Tailwind v4 config
│   │   ├── theme.css             # Design tokens
│   │   └── globals.css           # Global styles
│   │
│   ├── data/                     # Seed/mock data (JSON)
│   │   ├── events.json
│   │   ├── tasks.json
│   │   ├── vendors.json
│   │   ├── vendorAssignments.json
│   │   ├── approvals.json
│   │   ├── budgetItems.json
│   │   ├── users.json
│   │   ├── notifications.json
│   │   ├── chatMessages.json
│   │   └── organization.json
│   │
│   └── scripts/                  # CLI scripts
│       ├── seed-data.ts          # Seed PocketBase with data
│       └── setup-production.ts   # Setup PocketBase collections
│
├── src/docs/                     # Documentation site source
│
├── ATTRIBUTIONS.md               # Third-party attributions
├── CONTACTS_PAGE.md              # Contacts feature docs
├── DESIGN_SYSTEM.md              # Design system reference
├── README.md                     # User-facing README
├── guidelines/
│   └── Guidelines.md             # Design guidelines
└── PROJECT_DOCUMENTATION.md      # This file
```

---

## Architecture & Data Flow

### Context Architecture

The app uses React Context for state management with three providers:

```
AuthProvider (AuthContext)
  └─ EventProvider (EventContext)
       └─ AppDataProvider (AppDataContext)
            └─ MainApp
```

1. **AuthContext** - Handles PocketBase authentication. Provides `user`, `login()`, `logout()`, `hasRole()`.
2. **EventContext** - Manages events list and active event selection. Provides `events`, `activeEvent`, `setActiveEvent()`.
3. **AppDataContext** - Loads and manages all operational data (tasks, vendors, assignments, approvals, budget, notifications, chat messages). Provides query and mutation functions.

### Data Flow

```
PocketBase Backend (SQLite)
       │
       ▼
  pocketbase.ts (client instance)
       │
       ▼
  Context Providers (Auth, Event, AppData)
       │
       ▼
  Page Components
       │
       ▼
  UI Components (cards, lib/)
```

**Offline-first:** The app fetches data from PocketBase on load and maintains state in React context. Mutations (create, update) are sent to PocketBase and the local state is updated optimistically.

### Routing

The app uses a **state-based router** (not URL-based) - a `view` state variable in `App.tsx` determines which page component renders. The `BottomNav` component provides tab switching between Dashboard, Chat, Contacts, Alerts, and Settings.

---

## Features

### 1. Authentication (LoginPage)
- Role-based login flow with role selection (Admin, Vendor, Wedding Couple)
- Email/password authentication via PocketBase
- Password visibility toggle
- Error handling with user-friendly messages

### 2. Dashboard (DashboardPage)
- Welcome message with user name and role
- List of all events with selection
- "Create Event" button
- AI Event Copilot promotion card

### 3. Event Details (EventDetailsPage)
- Event info (date, venue, couple, budget)
- Readiness progress bar
- Quick summary cards:
  - Tasks (completed/pending counts)
  - Vendors (confirmed/pending counts)
  - Approvals (approved/pending counts)
  - Budget (spent/remaining with utilization)
- Navigation to sub-pages (Tasks, Vendors, Approvals, Budget)

### 4. Task Management
- **TaskListPage**: Filterable task list grouped by status (Completed, In Progress, Blocked, Not Started). Filter by individual status.
- **TaskDetailPage**: View task details, update status, see dependencies.
- **CreateTaskPage**: Form to create new tasks (title, description, priority, status, due date, assignee).

### 5. Vendor Board (VendorBoardPage)
- Confirmed/pending vendor summary
- Category filter chips
- Vendor cards with:
  - Initials avatar
  - Assignment status badge
  - Rating, verification status
  - Call & Email action buttons

### 6. Approval Board (ApprovalBoardPage)
- Filter tabs (All, Pending, Approved)
- Approval cards with:
  - Title, description, status badge
  - Due date with overdue detection
  - Requestor info
  - Approve/Reject actions for pending items
  - Detail view

### 7. Budget Tracking (BudgetPage)
- Overall budget summary (allocated, spent, remaining, utilization)
- Category breakdown with progress bars
- Utilization warnings (red indicator >80%)
- "Add Budget Item" button

### 8. AI Chat (ChatPage)
- Chat interface with predefined AI responses
- Intent detection (readiness, vendors, approvals, risks)
- Quick action chips
- Loading animation with bouncing dots
- Chat history from context

### 9. Contacts (ContactsPage)
- 10 sample contacts with names, roles, event assignments
- Search by name, role, or event part
- Filter by event part
- Stats dashboard (Total, Confirmed, Pending)
- Contact cards with Call, WhatsApp, Email buttons
- Horizon scrollable grouped by event part

### 10. Alerts & Notifications (AlertsPage)
- Tabbed interface: All, Approvals, Risks, Calendar
- **Notifications**: Mark as read, filter by type
- **Approvals**: Pending approvals with due dates
- **Risks**: Hardcoded risk items (DJ overdue, budget overrun)
- **Calendar**: Monthly calendar view with event markers and upcoming tasks

### 11. Settings (SettingsPage)
- User profile display
- Role and organization info
- Dark/Light mode toggle (localStorage persisted)
- Link to design documentation
- AI Copilot info card
- Logout button

### 12. Calendar (CalendarPage)
- Monthly calendar navigation
- Event indicators on dates
- Upcoming tasks list with overdue detection

---

## Pages & Navigation Map

```
                    ┌─────────────┐
                    │   LoginPage │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Dashboard  │ (default tab)
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────▼──────┐   ┌──────▼──────┐   ┌───────▼──────┐
  │ EventDetail │   │CreateEvent  │   │  BOTTOM NAV  │
  └──────┬──────┘   └─────────────┘   └──────┬───────┘
         │                             ┌─────┼─────┐
    ┌────┼────┐                         │     │     │
    │    │    │                    ┌─────┴┐ ┌───┴──┐ ┌┴──────┐
  ┌─▼─┐ ┌▼──┐ ┌▼───┐             │Chat  │ │Alert│ │Settings│
  │Tsk│ │Vnd│ │Appr│              └──────┘ └─────┘ └───────┘
  │Lst│ │Brd│ │Brd │                 │
  └┬──┘ └───┘ └──┬─┘            ┌─────┼─────┐
   │              │              │     │     │
┌──▼───┐   ┌──────▼──────┐  ┌───┴┐ ┌──┴──┐ ┌──┴───┐
│Task  │   │Approval     │  │All │ │Risks│ │Calend│
│Detail│   │Detail       │  │Notf│ └─────┘ └──────┘
└──────┘   └─────────────┘  └────┘
```

---

## Data Models (TypeScript Interfaces)

Located in `src/types/index.ts`:

| Entity | Key Fields |
|---|---|
| **User** | id, name, email, phone, role (admin/vendor/wedding_couple/planner/coordinator), organization_id |
| **Organization** | id, name, email, phone, city, timezone |
| **Event** | id, organization_id, event_name, event_type, couple_name_1/2, event_date, venue_name, venue_city, total_guests_expected, total_budget, currency, status, readiness_score |
| **Task** | id, event_id, title, description, status (not_started/in_progress/pending_approval/blocked/completed), priority (low/medium/high/urgent), due_date, assigned_to, vendor_id |
| **Vendor** | id, organization_id, name, category, phone, email, city, description, average_rating, total_reviews, is_verified |
| **VendorAssignment** | id, event_id, vendor_id, task_id, assignment_scope, status (assigned/confirmed/in_progress/completed/cancelled) |
| **Approval** | id, event_id, approval_type, title, description, requested_by, approver_id, status (pending/approved/rejected), due_date, metadata |
| **BudgetItem** | id, event_id, category, vendor_id, description, allocated_amount, estimated_amount, spent_amount, status (quoted/approved/paid/overdue) |
| **Notification** | id, organization_id, user_id, type, title, body, related_entity_type, related_entity_id, is_read |
| **ChatMessage** | id, event_id, organization_id, user_id, message_text, ai_response, intent |

---

## PocketBase Collections

The backend uses PocketBase with the following collections:

1. **users** - Auth collection (email/password). Fields: name, phone, role, organization_id, is_active
2. **events** - Base collection. Fields: organization_id, event_name, event_type, couple_name_1/2, event_date, venue_name, venue_city, total_guests_expected, total_budget, currency, status, readiness_score, created_by
3. **tasks** - Base collection. Fields: event_id, organization_id, title, description, status, priority, due_date, assigned_to, vendor_id, completed_at
4. **vendors** - Base collection. Fields: organization_id, name, category, phone, email, city, description, average_rating, total_reviews, is_verified, is_active
5. **vendor_assignments** - Base collection. Fields: event_id, vendor_id, task_id, organization_id, assignment_scope, status, confirmed_at, start_date, end_date
6. **budget_items** - Base collection. Fields: event_id, organization_id, category, vendor_id, description, allocated_amount, estimated_amount, spent_amount, status, payment_date
7. **approvals** - Base collection. Fields: event_id, organization_id, approval_type, title, description, requested_by, approver_id, status, approval_date, approval_comments, due_date, metadata (json)
8. **notifications** - Base collection. Fields: organization_id, user_id, type, title, body, related_entity_type, related_entity_id, is_read

---

## Design System

### Colors
- **Brand**: Indigo (#4F46E5) / Purple (#7C3AED) / Cyan (#06B6D4)
- **Status**: Success (green), Warning (amber), Error (red), Info (blue), Pending (slate)
- **AI**: Purple-tinted (#A78BFA bg, #7C3AED text)
- Full variables in `src/styles/theme.css`

### Component Library (`src/app/lib/`)
- `StatusBadge` - Colored pill badges (success/warning/error/info/pending)
- `ActionButton` - Multi-variant button (primary/secondary/destructive/ghost)
- `ProgressBar` - Horizontal progress bar (compact/prominent)
- `DashboardCard` - Card wrapper with title, badge, action slot
- `CircularProgress` - SVG circular progress indicator
- `MetricCard` - KPI metric display with icon, trend, percentage
- `MiniChart` - Small bar chart (Recharts)
- `ChatMessage` - Chat bubble (user/AI)
- `QuickActionChip` - Clickable chip for quick actions
- `ContactCard` - Contact display with Call/WhatsApp/Email
- `ContactListItem` - Compact/expanded contact list row
- `QuickContactWidget` - Widget showing key contacts
- `Timeline` - Vertical timeline component
- `CRMDashboard` - Full CRM dashboard with charts

### Card Components (`src/components/cards/`)
- `EventCard` - Event summary with readiness progress
- `TaskCard` - Task with status, priority, due date
- `ApprovalCard` - Approval with approve/reject actions
- `VendorCard` - Vendor info with Call/Email buttons

---

## Setup & Deployment

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- PocketBase instance (local or Railway)

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# The app will be available at http://localhost:5173
```

### Environment Variables
Create a `.env` file:
```env
VITE_PB_URL=http://127.0.0.1:8090
```

### PocketBase Setup

**Option 1: Local with Docker**
```bash
docker-compose up -d
# PocketBase runs at http://localhost:8090
# Open http://localhost:8090/_/ to create admin
```

**Option 2: Railway Deployment**
1. Create a Railway project
2. Deploy using the Dockerfile
3. Set the Railway URL as `VITE_PB_URL`

After PocketBase is running:
```bash
# Setup collections
pnpm setup:pb

# Seed data
pnpm seed:pb
```

### Build for Production

```bash
pnpm build
# Output in dist/
```

### Deploy Frontend to Vercel
1. Push to GitHub
2. Import project in Vercel
3. Set `VITE_PB_URL` environment variable
4. Deploy (Vercel auto-detects Vite)

### Seed Users

| Role | Email | Password |
|---|---|---|
| Admin | parag@runningchores.com | Password123! |
| Vendor | sharma@decorators.com | Password123! |
| Wedding Couple | couple@gmail.com | Password123! |
| Planner | priya@runningchores.com | Password123! |
| Coordinator | rajk@runningchores.com | Password123! |

---

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Production build |
| `pnpm setup:pb` | Create PocketBase collections |
| `pnpm seed:pb` | Seed data into PocketBase |

---

## Key Design Decisions

1. **State-based routing** instead of URL paths - simplifies mobile-first navigation with bottom tab bar
2. **React Context** instead of Redux - sufficient for this scale, avoids boilerplate
3. **PocketBase** backend - provides auth, database, REST API, and file storage in a single binary
4. **Hardcoded AI responses** in ChatPage for POC - intent-based pattern matching
5. **Seed data** is bundled as JSON - allows offline development and easy seeding
6. **Dark mode** via CSS class toggle - persisted in localStorage
7. **No URL routing library** - view state is managed in App.tsx, keeping the architecture simple

---

## Future Enhancements

- Integrate actual AI/LLM API for dynamic chat responses
- Add real-time subscriptions via PocketBase SSE
- Implement URL-based routing with react-router for deep linking
- Add file uploads for event media
- Multi-tenant isolation (organization-based data filtering)
- Role-based access control (RBAC) enforcement
- Email notifications integration
- Export reports (PDF/CSV)
- Mobile app (React Native)
- Payment gateway integration
