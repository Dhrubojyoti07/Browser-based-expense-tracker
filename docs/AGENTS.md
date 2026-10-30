# Autonomous Agents Architecture

This document describes the multi-agent design, roles, prompts, and execution patterns used to generate, verify, and maintain the Browser-Based Expense Tracker system.

---

## 1. Multi-Agent System Overview

The application was synthesized using a coordinated parallel subagent pattern:

```
                  +---------------------------+
                  |       Parent Agent        |
                  |       (Antigravity)       |
                  +-------------+-------------+
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
+-------------------------+           +-------------------------+
|     backend-builder     |           |    frontend-builder     |
|   (Express / MVC API)   |           |    (React 18 / UI)      |
+-------------------------+           +-------------------------+
             |                                     |
             v                                     v
  - Express Server & MVC               - React Components & Hooks
  - Passport.js & JWT Auth             - Chart.js & Framer Motion
  - WebSocket Synchronization          - Tailwind CSS Integration
  - Strict Error Handlers              - localStorage Management
```

---

## 2. Defined Agent Specifications

### 2.1 Backend Builder Agent (`backend-builder`)
- **Role**: Backend API Builder & Systems Architect
- **Mission**: Construct an enterprise-grade Express.js REST API with MVC pattern, Passport.js authentication, and WebSocket dynamic event streaming.
- **Responsibilities**:
  1. Implement MVC directory layout (`config/`, `controllers/`, `middleware/`, `models/`, `routes/`, `services/`).
  2. Implement local JSON file persistence for users in `data/users.json` (eliminating MongoDB setup overhead).
  3. Configure Passport.js local strategy with bcryptjs password hashing.
  4. Write a centralized Express error handling middleware strictly returning `{ message, statusCode }`.
  5. Build a WebSocket server using `ws` library with JWT query parameter verification and per-user socket pools.

### 2.2 Frontend Builder Agent (`frontend-builder`)
- **Role**: Frontend UI Engineer & State Specialist
- **Mission**: Build a responsive React 18 Single-Page Application with Vite, Tailwind CSS, Chart.js visualizations, and Framer Motion micro-interactions.
- **Responsibilities**:
  1. Implement React Context providers (`AuthContext` and `ExpenseContext`) separating concerns.
  2. Implement client storage persistence in `localStorage` keyed per user (`expenses_<userId>`).
  3. Create an auto-clearing expense input form with real-time field validation.
  4. Build dynamic summary cards displaying total spent, transaction count, and active categories.
  5. Render spending distributions using a Chart.js Doughnut chart and animated CSS category progress bars.
  6. Build an interactive expense table with category badges, date formatting, and row deletion with confirmation.

---

## 3. Maintenance Guidelines for Agents

When extending or maintaining this project via future AI agent invocations:
- **Strict Error Schema**: Always keep the backend error handler signature producing `{ message, statusCode }`.
- **Storage Boundary**: Maintain browser `localStorage` as the primary persistence layer for expenses.
- **Minimal UI Aesthetic**: Maintain the clean, professional, non-cluttered design.
- **Stability Guarantee**: Always verify that `npm run build` passes cleanly before delivering changes.