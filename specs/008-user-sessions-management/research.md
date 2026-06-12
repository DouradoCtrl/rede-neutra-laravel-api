# Technical Research: User Sessions Management

## Decision 1: Token List and Revocation Model (Laravel Backend)

* **Decision**: Use the Eloquent relationship `$user->tokens()` on the authenticated `User` model, mapped via a custom `PersonalAccessTokenResource` and handled inside `ProfileService`.
* **Rationale**: Sanitizes token details (filtering out token hashes) and cleanly checks ownership. Laravel Sanctum encapsulates all necessary operations, so writing a repository or custom database query is unnecessary and would violate the simplicity guidelines.
* **Alternatives Considered**: 
  - *Direct Database Queries*: Evaluated querying `personal_access_tokens` table via a custom repository. Rejected because it duplicates built-in Sanctum capabilities and introduces boilerplate.

## Decision 2: Prevention of Self-Revocation

* **Decision**: Match the token's database `id` against `$request->user()->currentAccessToken()->id` both in the resource representation (to flag `is_current: true` for the frontend) and inside the controller/service delete method (throwing a `400 Bad Request` if they match).
* **Rationale**: Prevent users from accidentally destroying their active session, which would immediately log them out and cause a confusing user experience. Checking at both layers guarantees both UI safety and backend enforcement.
* **Alternatives Considered**:
  - *UI-only check*: Disable the button in React only. Rejected because an API client could bypass the UI and self-revoke.

## Decision 3: BFF proxy path mapping

* **Decision**: Next.js route handlers will be located at `nextjs/src/app/api/auth/profile/tokens/route.ts` (GET) and `nextjs/src/app/api/auth/profile/tokens/[id]/route.ts` (DELETE).
* **Rationale**: Aligns with existing BFF paths (like `/api/auth/profile/me` and `/api/auth/profile/password`). Encapsulates the Authorization header fetch securely in server-side Next.js code.
* **Alternatives Considered**:
  - *Unified route with search parameters*: E.g., `DELETE /api/auth/profile/tokens?id=1`. Rejected because path parameters (`/tokens/[id]`) are more REST-compliant and align with Laravel route patterns.

## Decision 4: Frontend UI Components (Shadcn UI)

* **Decision**: Use Shadcn UI elements (`Table`, `Card`, `Badge`, `Button`, `Dialog` / `AlertDialog` for confirmation, `Alert` for error notifications).
* **Rationale**: Mandated by the project Constitution (v1.4.0) to preserve UX consistency. Custom CSS/Tailwind elements from scratch are restricted.
* **Alternatives Considered**:
  - *Plain HTML/Tailwind elements*: Rejected to enforce design system alignment.
