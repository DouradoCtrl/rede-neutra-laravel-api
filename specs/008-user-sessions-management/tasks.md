# Tasks: User Sessions Management

**Input**: Design documents from `/specs/008-user-sessions-management/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Backend (Laravel)**: `laravel/`
- **Frontend (Next.js)**: `nextjs/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verificação do ambiente local e integridade da infraestrutura.

- [x] T001 Verify backend API and frontend Next.js dev server are running locally

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Criação do recurso de API para serialização e preparação das rotas no Laravel.

- [x] T002 [P] Create Laravel API Resource in laravel/app/Http/Resources/PersonalAccessTokenResource.php
- [x] T003 Register endpoints under middleware 'auth:sanctum' in laravel/routes/api.php

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Visualização de Sessões Ativas (Priority: P1) 🎯 MVP

**Goal**: Permitir que o usuário autenticado visualize de forma clara a lista de suas sessões/tokens ativos na aba "Sessões", identificando a sessão do dispositivo atual.

**Independent Test**: Acessar `/meu-perfil` no navegador, clicar na aba "Sessões", e verificar se a listagem de tokens ativos exibe nome do dispositivo, data de criação e data de último uso, além de exibir o badge "Este Dispositivo" no token correspondente ao navegador atual.

### Tests for User Story 1

- [x] T004 [P] [US1] Write backend tests for token listing inside laravel/tests/Feature/ProfileTokenTest.php

### Implementation for User Story 1

- [x] T005 [US1] Implement token listing retrieval inside laravel/app/Services/ProfileService.php
- [x] T006 [US1] Implement 'tokens' action in laravel/app/Http/Controllers/ProfileController.php
- [x] T007 [P] [US1] Add token listing service client method 'getProfileTokens' in nextjs/src/services/userService.ts
- [x] T008 [US1] Create Next.js BFF proxy GET Route Handler in nextjs/src/app/api/auth/profile/tokens/route.ts
- [x] T009 [US1] Implement the tab trigger and rendering layout of sessions list inside nextjs/src/app/(authenticated)/meu-perfil/page.tsx
- [x] T010 [P] [US1] Write frontend tests for profile sessions tab loading in nextjs/src/__tests__/MeuPerfilPage.test.tsx

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Revogação de Sessão Específica (Priority: P2)

**Goal**: Permitir que o usuário revogue individualmente sessões ativas remotas de sua conta (bloqueando a auto-revogação da sessão ativa).

**Independent Test**: Identificar outra sessão na aba "Sessões" em `/meu-perfil`, clicar em "Revogar", confirmar no modal e verificar que o item desaparece e que requisições subsequentes usando aquele token são rejeitadas com erro 401.

### Tests for User Story 2

- [x] T011 [P] [US2] Write backend tests for token revocation (including current token block and ownership check validation) inside laravel/tests/Feature/ProfileTokenTest.php

### Implementation for User Story 2

- [x] T012 [US2] Implement token deletion inside laravel/app/Services/ProfileService.php
- [x] T013 [US2] Implement 'revokeToken' action in laravel/app/Http/Controllers/ProfileController.php
- [x] T014 [P] [US2] Add token revocation service client method 'revokeProfileToken' in nextjs/src/services/userService.ts
- [x] T015 [US2] Create Next.js BFF proxy DELETE Route Handler in nextjs/src/app/api/auth/profile/tokens/[id]/route.ts
- [x] T016 [US2] Integrate the revocation button, confirmation modal, and state update in nextjs/src/app/(authenticated)/meu-perfil/page.tsx

**Checkpoint**: User Story 1 and 2 are fully functional and integrated.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Polimento final, auditoria de código e execução de validações.

- [x] T017 [P] Verify code style, linting, and remove any debug statements in laravel/ and nextjs/
- [x] T018 Run the quickstart validation scenarios defined in quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 completion. Blocks all user stories.
- **User Stories (Phases 3 and 4)**: Depend on Phase 2 completion.
  - US2 can be developed after or in parallel with US1 backend, but depends on US1's list UI to trigger revocation.
- **Polish (Phase 5)**: Depends on all User Stories completion.

### Parallel Opportunities

- T002, T004, T007 can be started in parallel once Phase 1 is done.
- T011, T014 can be started in parallel with US1 UI implementation.
- Backend and frontend tests marked [P] can run concurrently.

---

## Parallel Example: User Story 1

```bash
# Executar testes do backend e frontend em paralelo
docker compose exec laravel-api php artisan test --filter=ProfileTokenTest
npm run test -- --run --glob="*meu-perfil*"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & Phase 2.
2. Complete Phase 3 (US1 - List Active Sessions).
3. **STOP and VALIDATE**: Verify active session listing is correct and current session badge displays.

### Incremental Delivery

1. Foundation: Endpoints mapping and Token resource.
2. Increment 1 (MVP): Read-only listing of devices, current device badge, disabled self-revoke button.
3. Increment 2 (Final): Modal de confirmação, revogação remota no backend, remoção imediata da lista.
4. Polish: Testes finais e remoção de código morto.
