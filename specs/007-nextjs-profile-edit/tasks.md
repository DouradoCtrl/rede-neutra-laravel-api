# Tasks: Edição de Perfil e Senha no Frontend

**Input**: Design documents from `/specs/007-nextjs-profile-edit/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo structure**: `nextjs/src/` for Next.js files, `laravel/` for backend files.
- Paths shown below assume `nextjs/` prefix for frontend files.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Validação e preparação de infraestrutura do projeto

- [x] T001 Verificar o funcionamento e rotas autenticadas do Next.js localmente no repositório `nextjs/`
- [x] T002 Verificar se o Toaster do Sonner já está configurado no layout principal em `nextjs/src/app/layout.tsx` ou similar

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura principal da API (BFF) do Next.js.

**⚠️ CRITICAL**: Nenhuma história de usuário do frontend pode começar até que estes endpoints de proxy estejam prontos.

- [x] T003 Criar o BFF Route Handler para atualização do perfil em `nextjs/src/app/api/auth/profile/me/route.ts` (extrai o cookie de token, chama o Laravel via `PUT` sem validações locais e retorna o JSON original)
- [x] T004 Criar o BFF Route Handler para alteração da senha em `nextjs/src/app/api/auth/profile/password/route.ts` (extrai o cookie de token, chama o Laravel via `PUT` sem validações locais e retorna o JSON original)

**Checkpoint**: APIs de proxy prontas - a implementação do frontend pode iniciar.

---

## Phase 3: User Story 1 - Edição de Dados Pessoais (Priority: P1) 🎯 MVP

**Goal**: Implementar o formulário de alteração de nome e e-mail com pré-carregamento de dados e exibição de erros 422 em linha.

**Independent Test**: Acessar `/meu-perfil`, alterar nome/e-mail, salvar e verificar se os dados persistem ao recarregar (F5).

### Implementation for User Story 1

- [x] T005 [P] [US1] Criar método de cliente `updateProfile` em `nextjs/src/services/userService.ts` (chama o endpoint do BFF `/api/auth/profile/me` via PUT)
- [x] T006 [US1] Pré-carregar os dados cadastrais do usuário ao montar a página de perfil em `nextjs/src/app/(authenticated)/meu-perfil/page.tsx` usando `userService.getClientProfile`
- [x] T007 [US1] Construir a interface do formulário de dados pessoais em `nextjs/src/app/(authenticated)/meu-perfil/page.tsx` usando componentes do Shadcn UI, ligando a submissão ao `userService.updateProfile` e tratando os erros 422 nos inputs.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Alteração de Senha (Priority: P2)

**Goal**: Implementar o formulário de alteração de senha (atual, nova e confirmação) com tratamento de erros de validação e toast de sucesso.

**Independent Test**: Preencher o formulário de senha, atualizar com sucesso e tentar login futuro com a nova senha.

### Implementation for User Story 2

- [x] T008 [P] [US2] Criar método de cliente `updatePassword` em `nextjs/src/services/userService.ts` (chama o endpoint do BFF `/api/auth/profile/password` via PUT)
- [x] T009 [US2] Construir o formulário de alteração de senha em `nextjs/src/app/(authenticated)/meu-perfil/page.tsx` com campos de senha atual, nova senha e confirmação, tratando o envio via `userService.updatePassword` e erros de validação.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes visuais finos e validação final

- [x] T010 Garantir a responsividade e design consistente em dispositivos mobile em `nextjs/src/app/(authenticated)/meu-perfil/page.tsx`
- [x] T011 Rodar o guia de validação do [quickstart.md](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/specs/007-nextjs-profile-edit/quickstart.md) e confirmar o sucesso da feature

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências - pode começar imediatamente.
- **Foundational (Phase 2)**: Depende do Setup - BLOQUEIA as histórias de usuário do frontend.
- **User Stories (Phases 3 e 4)**: Ambas dependem da conclusão dos Route Handlers da Fase 2.
- **Polish (Phase 5)**: Depende da conclusão de ambas as histórias.

### User Story Dependencies

- **User Story 1 (P1)**: Pode iniciar após a Fase Fundacional (Fase 2) - Sem dependências diretas de outras histórias.
- **User Story 2 (P2)**: Pode iniciar após a Fase Fundacional (Fase 2) - Pode ser desenvolvido de forma independente, mas reside no mesmo arquivo de UI.

### Parallel Opportunities

- T003 e T004 podem ser implementados em paralelo (endpoints diferentes no BFF).
- T005 e T008 podem ser desenvolvidos em paralelo na camada de serviço.
- Após a Fase 2, os serviços e lógica de integração de formulários podem progredir de forma paralela.

---

## Parallel Example: User Story 1

```bash
# Executar a camada de serviços em paralelo:
Task: "Criar método de cliente updateProfile em nextjs/src/services/userService.ts"
Task: "Criar método de cliente updatePassword em nextjs/src/services/userService.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir Setup + Foundational (Route Handlers prontos).
2. Implementar carregamento e formulário de dados cadastrais (US1).
3. **Validar**: Fazer modificações cadastrais no navegador, verificar persistência e respostas de sucesso/erro.
4. Entregar MVP.

### Incremental Delivery

1. Concluir Setup + Foundational → Infraestrutura pronta.
2. Adicionar User Story 1 → Testar de forma independente → Demonstrar MVP.
3. Adicionar User Story 2 → Testar de forma independente → Entregar funcionalidade completa de perfil.
