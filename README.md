# RC Events - AI-Powered Event Operations Platform

RC Events is a comprehensive operational command center designed for professional wedding planners and event management companies. It combines a robust design system with a powerful backend to manage events, tasks, vendors, budgets, approvals, and communications — all from a mobile-first interface.

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS 4, Radix UI/shadcn, Lucide Icons, Recharts, Vite 6
- **Backend:** PocketBase 0.25 (SQLite, Auth, REST API)
- **Deployment:** Vercel (Frontend), Railway (Backend with Docker)

## Features

- **Operational Dashboard** — Real-time metrics, event readiness tracking, status monitoring
- **Task Management** — Categorize, filter, and update tasks with priority and vendor assignment
- **Vendor Management** — Directory with Call/WhatsApp/Email quick actions, category filtering
- **Budget Tracking** — Allocated vs. Spent analysis with utilization warnings
- **Approval Workflow** — Request/Approve/Reject flow with overdue tracking
- **AI Copilot Chat** — Intent-based query interface for operational insights
- **Contacts Management** — Searchable contact directory with grouped display
- **Calendar** — Monthly view with event markers and upcoming tasks
- **Alerts & Notifications** — Combined alerts, approvals, risks, and calendar views
- **Dark Mode** — Full dark/light theme support with localStorage persistence

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm dev

# App runs at http://localhost:5173
```

## Environment Setup

Create a `.env` file in the project root:

```env
VITE_PB_URL=http://127.0.0.1:8090
```

## PocketBase Setup

```bash
# Start PocketBase with Docker
docker-compose up -d

# Create admin at http://localhost:8090/_/

# Setup collections and seed data
npm run setup:pb
npm run seed:pb
```

## Sample Credentials

All sample accounts use password: **`Password123!`**

| Role | Email |
|---|---|
| Admin | parag@runningchores.com |
| Vendor | sharma@decorators.com |
| Wedding Couple | couple@gmail.com |
| Planner | priya@runningchores.com |
| Coordinator | rajk@runningchores.com |

## Build for Production

```bash
npm run build
# Output in dist/
```

## Documentation

- [Full Project Documentation](./PROJECT_DOCUMENTATION.md)
- [Design System Guide](./DESIGN_SYSTEM.md)
- [Contacts Management](./CONTACTS_PAGE.md)
