# Architecture Documentation

## System Architecture Overview

ExpenseTracker follows a decoupled MERN-style architecture: a modular Express.js backend implementing the MVC (Model-View-Controller) design pattern and a React 18 Single-Page Application (SPA) with component-level modularity, hooks, context providers, and responsive Tailwind styling.

```
+-------------------------------------------------------------------------------+
|                                BROWSER CLIENT                                 |
|                                                                               |
|  +--------------------+  +----------------------+  +-----------------------+  |
|  |     React 18 UI    |  | Browser Storage      |  | WebSocket Client      |  |
|  |  - Dashboard       |  | - auth_token (JWT)   |  | - auto-reconnect      |  |
|  |  - Expense Form    |  | - auth_user (JSON)   |  | - cross-tab sync      |  |
|  |  - Chart.js Visual |  | - expenses_<userId>  |  |                       |  |
|  |  - Category Bars   |  |                      |  |                       |  |
|  +---------+----------+  +----------+-----------+  +-----------+-----------+  |
|            |                        ^                          |              |
+------------|------------------------|--------------------------|--------------+
             | REST API (HTTP)        |                          | WS Event
             | /api/auth/*            | (Persistent Local Store) | ws://localhost:3001
             | /api/expenses/*        |                          |
+------------|------------------------+--------------------------|--------------+
|            v                                                   v              |
|  +--------------------+                             +----------------------+  |
|  | Express REST API   |                             | ws Server            |  |
|  |  - CORS & JSON     |                             |  - JWT Query Auth    |  |
|  |  - Error Handler   |                             |  - Client Grouping   |  |
|  +---------+----------+                             |  - Event Broadcast   |  |
|            |                                        +----------+-----------+  |
|            v                                                   ^              |
|  +--------------------+                                        |              |
|  | MVC Controllers    |----------------------------------------+              |
|  |  - authController  |  (Broadcast on expense create/delete)                 |
|  |  - expenseControl  |                                                       |
|  +---------+----------+                                                       |
|            |                                                                  |
|            v                                                                  |
|  +--------------------+                                                       |
|  | Model Layer        |                                                       |
|  |  - User.js         |                                                       |
|  |    data/users.json |                                                       |
|  +--------------------+                                                       |
|                                                                               |
|                                BACKEND SERVER                                 |
+-------------------------------------------------------------------------------+
```

---

## 1. Backend Architecture (MVC Pattern)

### 1.1 Models (`backend/src/models/`)
- **`User.js`**:
  - Handles file-based JSON persistence in `backend/data/users.json` (or `/tmp/users.json` when running in serverless environments like Vercel).
  - Auto-initializes directory and file structure on boot.
  - Exposes static-style methods: `findByEmail(email)`, `findById(id)`, and `create({ name, email, password })`.

### 1.2 Controllers (`backend/src/controllers/`)
- **`authController.js`**:
  - Handles `signup`, `login`, and `getMe`.
  - Uses `bcryptjs` with salt rounds = 10 for password hashing.
  - Integrates Passport.js local strategy authentication.
  - Issues signed JWT tokens with 7-day expiration.
- **`expenseController.js`**:
  - Handles `/api/expenses` endpoints.
  - Validates and generates immutable UUIDs and timestamps.
  - Broadcasts `expense:created` and `expense:deleted` WebSocket events.

### 1.3 Middleware Pipeline (`backend/src/middleware/`)
- **`auth.js`**: Verifies Bearer JWT tokens and populates `req.user`.
- **`validate.js`**: Rejects invalid payloads with descriptive 400 responses.
- **`errorHandler.js`**: Central error handler formatting responses strictly as `{ message, statusCode }`.

---

## 2. Frontend Architecture (React 18 SPA)

### 2.1 State & Context Hierarchy
```
<AuthProvider>
  └── <ExpenseProvider>
        └── <Router>
              ├── /login   -> <LoginPage />
              ├── /signup  -> <SignupPage />
              └── / (Auth) -> <ProtectedRoute>
                                └── <Layout>
                                      └── <DashboardPage />
```

### 2.2 Visual Components
- **`ExpenseForm.jsx`**: Auto-clearing input form with real-time field validation.
- **`ExpenseTable.jsx`**: Sorted expense rows, color tags, delete button with confirmation, and Framer Motion exit transitions.
- **`ExpenseChart.jsx`**: Chart.js Doughnut visualization.
- **`CategoryProgress.jsx`**: Percentage-based animated spending progress bars.