# Data Flow Documentation

This document describes how data travels between the user interface, browser storage, REST API endpoints, and WebSocket real-time distribution.

---

## 1. Authentication Lifecycle

```
[User Input]
     │ (Name, Email, Password)
     ▼
[Frontend: LoginPage / SignupPage]
     │
     ▼ (HTTP POST /api/auth/signup or /login)
[Middleware: validateSignup / validateLogin]
     │
     ▼ (Valid payload)
[Controller: authController]
     │ ──> [Model: User.js] (Check duplicate email / save in users.json)
     │ ──> [Bcryptjs] (Hash password / compare hash)
     │ ──> [jsonwebtoken] (Generate signed token with 7d validity)
     ▼
[Frontend: AuthContext]
     ├──> localStorage.setItem('auth_token', token)
     ├──> localStorage.setItem('auth_user', user)
     └──> Redirect to Dashboard ("/")
```

### Session Restoration (App Initialization):
1. `AuthProvider` mounts and checks `localStorage.getItem('auth_token')`.
2. If token exists, calls `GET /api/auth/me` with header `Authorization: Bearer <token>`.
3. If token is valid, sets `user` in React state and renders protected routes.
4. If token is expired/invalid, automatically clears storage keys and redirects to `/login`.

---

## 2. Expense Creation Flow

```
[User fills ExpenseForm (Name, Amount, Category)]
     │
     ▼
[Form Validation (Required checks, Amount > 0)]
     │
     ▼ (Passes validation)
[ExpenseContext.addExpense(data)]
     │
     ▼ (POST /api/expenses with Bearer JWT)
[Middleware: auth.js (JWT verify) & validate.js]
     │
     ▼
[Controller: expenseController.createExpense]
     ├──> Generates UUID: crypto.randomUUID()
     ├──> Attaches ISO Date: new Date().toISOString()
     ├──> Attaches userId: req.user.id
     ├──> Triggers WebSocket: broadcast(userId, 'expense:created', expense)
     └──> Returns HTTP 201: { expense }
     │
     ▼
[Frontend: Response Received]
     ├──> Updates React state: expenses = [newExpense, ...prev]
     ├──> Saves to localStorage: expenses_<userId> = JSON.stringify(expenses)
     ├──> Resets Form Fields to empty ('')
     └──> Shows temporary success banner
```

---

## 3. Expense Deletion Flow

```
[User clicks "Delete" button on ExpenseTable row]
     │
     ▼
[Browser Confirm Dialog: "Delete '<Expense Name>'?"]
     │
     ▼ (User confirms)
[ExpenseContext.deleteExpense(id)]
     │
     ▼ (DELETE /api/expenses/:id with Bearer JWT)
[Middleware: auth.js verify]
     │
     ▼
[Controller: expenseController.deleteExpense]
     ├──> Triggers WebSocket: broadcast(userId, 'expense:deleted', { id })
     └──> Returns HTTP 200: { message: "Expense deleted" }
     │
     ▼
[Frontend: Response Received]
     ├──> Filters state: expenses = expenses.filter(e => e.id !== id)
     ├──> Saves to localStorage: expenses_<userId> = JSON.stringify(expenses)
     └──> Framer Motion triggers row exit animation
```

---

## 4. Real-Time Cross-Tab Synchronization (WebSockets)

When the user has multiple tabs or windows open (e.g., Tab A and Tab B):

```
+------------------+                    +------------------+
|      Tab A       |                    |      Tab B       |
+--------+---------+                    +--------+---------+
         |                                       |
         | Adds / Deletes Expense                | Listening via useWebSocket
         | (POST / DELETE)                       |
         v                                       |
  [Express Server]                               |
         |                                       |
         +-----> [WebSocket broadcast] --------->|
                 Event: 'expense:created'        |
                 or 'expense:deleted'            v
                                        [ExpenseContext receives message]
                                        ├──> Updates state array
                                        ├──> Updates localStorage
                                        └──> Re-renders Table & Charts
```

---

## 5. Client-Side Computed State Flow

Whenever the `expenses` array changes in `ExpenseContext`:

```
              expenses: Array<Expense>
                         │
        +----------------+----------------+
        │                                 │
        ▼                                 ▼
   totalAmount                     categoryTotals
 reduce(sum + amount)          reduce({ [cat]: sum })
        │                                 │
        ▼                                 ▼
 Dashboard Summary Card          CategoryProgress Bars &
 & Chart Center Display          Chart.js Doughnut Segments
```
