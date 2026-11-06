# 05. Standard API Response Contract

All API endpoints return predictable, standardized JSON envelopes. Client applications only ever need to inspect `success: true` or `success: false`.

---

## 1. Success Responses (`success: true`)

### 1.1 Single Resource Fetched (HTTP 200 OK)
```json
{
  "success": true,
  "data": {
    "id": "67290bc4e1...",
    "rollNumber": "STU-1001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@school.edu",
    "grade": "10",
    "section": "A",
    "status": "active",
    "createdAt": "2026-11-05T12:00:00.000Z"
  }
}
```

### 1.2 Resource Created (HTTP 201 Created)
```json
{
  "success": true,
  "data": {
    "id": "67290bc4e1...",
    "rollNumber": "STU-1002",
    "firstName": "Jane",
    "lastName": "Smith",
    "status": "active",
    "createdAt": "2026-11-05T12:05:00.000Z"
  }
}
```

### 1.3 Paginated List (HTTP 200 OK with `meta`)
Returned by list endpoints (`/api/v1/students`, `/api/v1/users`):
```json
{
  "success": true,
  "data": [
    {
      "id": "67290bc4e1...",
      "rollNumber": "STU-1001",
      "firstName": "John",
      "lastName": "Doe",
      "grade": "10",
      "section": "A"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### 1.4 Action Completed (HTTP 200 OK)
Returned after operations like deletion or status toggling:
```json
{
  "success": true,
  "data": {
    "message": "Student removed successfully."
  }
}
```

---

## 2. Error Responses (`success: false`)

All errors return `success: false` and an `error` object with standard fields: `code` and `message`.

### 2.1 Validation Error (HTTP 400 Bad Request)
Returned when Zod request validation fails on body, query, or params:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address format"
      },
      {
        "field": "rollNumber",
        "message": "Roll number is required"
      }
    ]
  }
}
```

### 2.2 Missing or Expired Authentication (HTTP 401 Unauthorized)
Returned when token is missing, invalid, or expired:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired access token."
  }
}
```

### 2.3 Forbidden Access (HTTP 403 Forbidden)
Returned when authenticated user does not have the required role:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Action restricted to roles: TENANT_ADMIN, STAFF"
  }
}
```

### 2.4 Resource Not Found (HTTP 404 Not Found)
Returned when querying an ID or URL that does not exist:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Student was not found."
  }
}
```

### 2.5 Conflict / Duplicate Record (HTTP 409 Conflict)
Returned when attempting to create a record with an existing unique value within the tenant:
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Student with roll number \"STU-1001\" already exists in this tenant."
  }
}
```

### 2.6 Rate Limit Exceeded (HTTP 429 Too Many Requests)
Returned when an IP exceeds global traffic or login attempt limits:
> **Response Headers:** `Retry-After: 900`, `X-RateLimit-Limit: 5`, `X-RateLimit-Remaining: 0`
```json
{
  "success": false,
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Too many login attempts. Access blocked for 15 minutes to protect your account."
  }
}
```

### 2.7 Internal Server Error (HTTP 500 Internal Server Error)
Returned on unexpected server crashes. Detailed stack traces are hidden in production:
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Internal server error"
  }
}
```

---

## 3. Summary of Error Codes

| HTTP Status | Error Code | Trigger Condition |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Request payload fails Zod schema validation |
| `401` | `UNAUTHORIZED` | Token missing, expired, invalid, or refresh revoked |
| `403` | `FORBIDDEN` | Insufficient role or cross-tenant access attempt |
| `404` | `NOT_FOUND` | Document ID or route not found in database |
| `409` | `CONFLICT` / `DUPLICATE_KEY` | Duplicate unique index (e.g. rollNumber, email per tenant) |
| `429` | `TOO_MANY_REQUESTS` | IP exceeds rate limiter window threshold |
| `500` | `INTERNAL_SERVER_ERROR` | Unhandled runtime exception |
