# ExpenseTracker

A modern full-stack Browser-Based Expense Tracker built with React 18, Tailwind CSS, Express.js (MVC), Passport.js authentication, and WebSocket real-time synchronization.

Persists expense data locally in your browser (`localStorage`) with zero external database dependencies.

## Features

- **Expense Management**: Add expenses with Name, Amount, and Category (`Food`, `Travel`, `Utilities`, `Shopping`, `Entertainment`, `Health`, `Other`).
- **Client Persistence**: Automatically saves expenses to `localStorage` under `expenses_<userId>` across sessions and refreshes.
- **Dynamic Stats**: Real-time totals, expense counter, and active category breakdown.
- **Interactive Visualizations**:
  - Doughnut chart powered by Chart.js (`react-chartjs-2`).
  - Animated CSS progress bars showing spending share per category.
- **Clean Form Interaction**: Validation with error feedback and auto-clearing inputs upon successful submission.
- **Delete Support**: Remove expenses with confirmation and exit animations via Framer Motion.
- **User Authentication**: Secure signup and login using Passport.js Local Strategy, JWT tokens, and bcryptjs password hashing.
- **WebSocket Sync**: Real-time multi-tab synchronization (`ws`).
- **Standardized Error Handling**: Strict `{ message, statusCode }` Express error responses.
- **Vercel Ready**: Preconfigured with `vercel.json` and `/api` serverless handler for one-click deployment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Framer Motion, Lucide Icons |
| **Data Viz** | Chart.js 4, react-chartjs-2 |
| **Backend** | Node.js, Express.js (MVC Pattern), Passport.js, JWT, bcryptjs |
| **Real-time** | WebSockets (`ws`) |
| **Storage** | Browser `localStorage` (expenses), File-based JSON (users) |
| **Deployment**| Vercel Serverless & Static Hosting (`vercel.json`) |

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Both Frontend & Backend Concurrently
```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **WebSocket**: ws://localhost:3001

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, click **"Add New Project"** and import this repository.
3. Keep default settings (the included `vercel.json` configures the build and rewrites automatically).
4. Click **Deploy**!

---

## Project Structure

```
├── api/                    # Vercel serverless function entrypoint (index.js)
├── backend/
│   ├── src/
│   │   ├── config/         # env.js, passport.js
│   │   ├── controllers/    # authController.js, expenseController.js
│   │   ├── middleware/     # auth.js, validate.js, errorHandler.js
│   │   ├── models/         # User.js (local file store)
│   │   ├── routes/         # authRoutes.js, expenseRoutes.js
│   │   └── services/       # websocket.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/     # forms, tables, charts, layout
│   │   ├── context/        # AuthContext, ExpenseContext
│   │   ├── hooks/          # useLocalStorage, useWebSocket
│   │   ├── pages/          # LoginPage, SignupPage, DashboardPage
│   │   ├── services/       # api.js, authService.js
│   │   └── utils/          # constants.js, formatters.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docs/                   # ARCHITECTURE, DATA_FLOW, API, AGENTS
├── vercel.json             # Vercel deployment configuration
├── package.json
└── README.md
```