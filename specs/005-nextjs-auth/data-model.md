# Data Model & Interfaces

Esta feature abrange o contrato de Login entre o Next.js e o Laravel e a gestão da Sessão.

### Interface: `authService.login(credentials)`

**Request JSON (ao Laravel):**
```json
{
  "email": "user@example.com",
  "password": "secret_password",
  "device_name": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
}
```

**Response 200 OK (do Laravel):**
```json
{
  "status": "success",
  "data": {
    "token": "1|abc123token...",
    "user": {
       "id": 1,
       "name": "Jane Doe",
       "email": "user@example.com"
    }
  }
}
```

**Response 422 Unprocessable Entity (do Laravel):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["O e-mail é obrigatório.", "O e-mail não foi encontrado na base."],
    "password": ["A senha está incorreta."]
  }
}
```

### Gestão da Sessão

- **Cookie Local Next.js**: `session_token`
- **Atributos**: `HttpOnly`, `Secure` (em produção), `SameSite=Lax`, `Path=/`
- **Conteúdo**: O string real gerado pelo Laravel Sanctum.
