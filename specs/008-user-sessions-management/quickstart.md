# Quickstart & Validation Guide: User Sessions Management

This guide outlines the scenarios and steps required to validate the User Sessions Management feature.

## Prerequisites

1. Laravel backend running inside Docker containers.
2. Next.js frontend running locally at `http://localhost:3000`.
3. An active user account for testing (e.g., `noc@kayroslink.com.br` / `but1709vd`).

---

## Validation Scenarios

### Scenario 1: Active Sessions List
1. Login to the Next.js app.
2. Navigate to `http://localhost:3000/meu-perfil`.
3. Click on the **Sessões** tab.
4. **Expected Outcome**:
   - The user sees a list of active sessions (device/User-Agent, creation date, and last used date).
   - The current session has a distinct badge/label showing **Este Dispositivo** or **Dispositivo Atual**.
   - The "Revogar" (Revoke) button for the current session is disabled.

### Scenario 2: Revoke Remote Session
1. Log in from a separate browser, device, or use a tool like Postman/cURL to generate another Sanctum token for the user.
2. Refresh the **Sessões** tab on the first browser.
3. Locate the other session in the list and click the **Revogar** button.
4. Confirm the revocation in the dialog.
5. **Expected Outcome**:
   - The remote session is deleted in the backend database.
   - The session disappears from the list immediately.
   - If you attempt a request using the revoked token, the backend returns `401 Unauthorized`.

### Scenario 3: Backend Security Guardrails
1. Attempt to call `DELETE /api/v1/auth/profile/tokens/{current_id}` (trying to delete the active token).
2. **Expected Outcome**:
   - Returns `400 Bad Request` with message: `"Você não pode revogar a sua sessão atual."`.
3. Attempt to call `DELETE /api/v1/auth/profile/tokens/{other_user_token_id}` (trying to delete a token belonging to another user).
4. **Expected Outcome**:
   - Returns `404 Not Found` with message: `"Sessão não encontrada."`.

---

## Testing Commands

### Backend API Tests
Run the Pest tests inside the Laravel workspace:
```bash
docker compose exec laravel-api php artisan test --filter=ProfileTokenTest
```

### Frontend Component Tests
Run Vitest in the Next.js workspace:
```bash
npm run test -- --run --glob="*meu-perfil*"
```
