# REST & WebSocket API Specification

Base URL: `http://localhost:3001/api` (or `/api` in production)  
WebSocket URL: `ws://localhost:3001`

All responses follow consistent HTTP status codes. Errors adhere to:
```json
{
  "message": "Error description message",
  "statusCode": 400
}
```

---

## 1. Authentication Endpoints

### 1.1 POST `/auth/signup`
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "mypassword123"
}
```
- **Response** (`201 Created`):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "e8d08cb5-15a0-4f81-a3f7-5d259c071b76",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

---

### 1.2 POST `/auth/login`
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "mypassword123"
}
```
- **Response** (`200 OK`):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "e8d08cb5-15a0-4f81-a3f7-5d259c071b76",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

---

### 1.3 GET `/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`): Returns current user payload.

---

## 2. Expense Endpoints

### 2.1 POST `/expenses`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "Groceries",
  "amount": 1500,
  "category": "Food"
}
```
- **Response** (`201 Created`): Returns formatted expense object with UUID and ISO timestamp.
- **Side Effect**: Broadcasts `{ event: "expense:created", data: <expense> }` over WebSocket.

---

### 2.2 DELETE `/expenses/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`): `{ "message": "Expense deleted" }`
- **Side Effect**: Broadcasts `{ event: "expense:deleted", data: { "id": ":id" } }`.

---

## 3. WebSocket Real-Time Events

- Connect: `ws://localhost:3001?token=<JWT_TOKEN>`
- Events: `expense:created`, `expense:deleted`