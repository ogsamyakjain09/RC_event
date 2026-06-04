# RC Events - AI-Powered Event Operations Platform

RC Events is a comprehensive operational command center designed for professional wedding planners and event management companies. It combines a robust design system with a powerful backend to manage events, tasks, vendors, and budgets.

## 🚀 Live Demo
- **Frontend (Vercel):** [Your Vercel URL]
- **Backend (Railway):** [Your Railway URL]

## 🛠 Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS 4, Radix UI, Lucide Icons, Vite.
- **Backend:** PocketBase (SQLite, Auth, REST API).
- **Deployment:** Vercel (Frontend), Railway (Backend with Docker).

## 📦 Features
- **Operational Dashboard:** Real-time metrics, event readiness tracking, and status monitoring.
- **Task Management:** Categorized tasks with priority levels and vendor assignments.
- **Vendor Management:** Integrated directory with quick actions (Call, WhatsApp, Email).
- **Budget Tracking:** Allocated vs. Spent monitoring with approval workflows.
- **AI Copilot:** An AI-themed interface for operational insights and quick actions.
- **Dark Mode:** Full support optimized for dashboard environments.

---

## 🏗 Setup & Deployment Guide

### 1. Backend (PocketBase on Railway)
The backend runs as a Dockerized PocketBase instance.
1.  **Create Service:** Deploy the `Dockerfile` to Railway.
2.  **Add Volume:** Create a Railway Volume and mount it to `/pb/pb_data` to ensure data persists across restarts.
3.  **Environment:** Set `PORT=8080` in Railway variables.
4.  **Admin UI:** Access `https://your-backend.up.railway.app/_/` to create your first admin.

### 2. Frontend (Vercel)
1.  **Environment Variables:** Add `VITE_PB_URL=https://your-backend.up.railway.app` in Vercel settings.
2.  **Build:** Vercel will automatically build and deploy from the `features` branch.

### 3. Database Initialization
Once the backend is live, run these commands locally to set up the schema and sample data:
```bash
npm install
npm run setup:pb  # Creates collections/tables
npm run seed:pb   # Populates sample users, events, and vendors
```

---

## 🔐 Credentials (Sample Data)
All accounts use the password: **`Password123!`**

| Role | Email | Use Case |
| :--- | :--- | :--- |
| **Admin** | `parag@runningchores.com` | Full system management |
| **Vendor** | `sharma@decorators.com` | Assigned tasks & status updates |
| **Couple** | `couple@gmail.com` | View event progress & approvals |
| **Planner** | `priya@runningchores.com` | Event & task operations |

---

## 📂 Project Structure
- `src/app/`: Core logic and shared component library.
- `src/components/`: Layout and specialized UI components.
- `src/context/`: Global state management (Auth, AppData, Events).
- `src/pages/`: Main view components.
- `src/scripts/`: Database setup and seeding scripts.
- `src/data/`: Sample JSON data used for seeding.
- `Dockerfile`: Deployment configuration for the backend.

## 📄 Documentation
- [Design System Guide](./DESIGN_SYSTEM.md)
- [Contacts Management](./CONTACTS_PAGE.md)
- [Dashboard Metrics](./DASHBOARD_METRICS.md)

---
**Built for excellence in event operations.**
