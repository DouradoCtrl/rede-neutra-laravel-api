# API Contracts: User Sessions Management

This document defines the contracts for the backend API and Next.js BFF proxy routes.

## Laravel Backend API (`laravel/`)

All requests must include the header `Authorization: Bearer <token>`.

### 1. List User Tokens
* **Method & Path**: `GET /api/v1/auth/profile/tokens`
* **Response `200 OK`**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 12,
        "name": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
        "last_used_at": "2026-06-12T13:40:00.000000Z",
        "created_at": "2026-06-12T10:15:00.000000Z",
        "is_current": true
      },
      {
        "id": 15,
        "name": "PostmanRuntime/7.40.0",
        "last_used_at": "2026-06-12T12:00:00.000000Z",
        "created_at": "2026-06-12T11:55:00.000000Z",
        "is_current": false
      }
    ],
    "message": "Tokens recuperados com sucesso."
  }
  ```

### 2. Revoke Specific Token
* **Method & Path**: `DELETE /api/v1/auth/profile/tokens/{id}`
* **Response `200 OK`**:
  ```json
  {
    "status": "success",
    "data": null,
    "message": "Sessão revogada com sucesso."
  }
  ```
* **Response `400 Bad Request`** (User tries to delete their current active session token):
  ```json
  {
    "status": "error",
    "message": "Você não pode revogar a sua sessão atual."
  }
  ```
* **Response `404 Not Found`** (Token does not exist or does not belong to the user):
  ```json
  {
    "status": "error",
    "message": "Sessão não encontrada."
  }
  ```

---

## Next.js BFF Proxy API (`nextjs/`)

Authenticates using cookie `auth_token` automatically passed by the browser.

### 1. List Client Tokens
* **Method & Path**: `GET /api/auth/profile/tokens`
* **Response `200 OK`**:
  Matches Laravel `200 OK` format.
* **Response `401 Unauthorized`**:
  ```json
  {
    "message": "Não autorizado. Token de sessão ausente."
  }
  ```

### 2. Revoke Client Token
* **Method & Path**: `DELETE /api/auth/profile/tokens/{id}`
* **Response `200 OK`**:
  Matches Laravel `200 OK` format.
* **Response `401/400/404`**:
  Direct proxy forwarding of Laravel's response code and message.
