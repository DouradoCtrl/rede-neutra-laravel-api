# Implementation Plan: User Sessions Management

**Branch**: `008-user-sessions-management` | **Date**: 2026-06-12 | **Spec**: [spec.md](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/specs/008-user-sessions-management/spec.md)

**Input**: Feature specification from `/specs/008-user-sessions-management/spec.md`

## Summary

O objetivo desta feature é implementar a visualização e o gerenciamento de sessões ativas (tokens de acesso pessoal do Laravel Sanctum) diretamente na tela de perfil do usuário (`/meu-perfil`). Isso permite que os usuários visualizem de quais dispositivos/navegadores estão conectados, identifiquem a sessão atual e revoguem remotamente outras sessões suspeitas ou inativas para aumentar a segurança.

## Technical Context

**Language/Version**: PHP 8.2+ (Laravel 11+), TypeScript (Next.js 15+, React 19, Node 20)

**Primary Dependencies**: Laravel Sanctum, Shadcn UI (Tabs, Card, Button, Table/List, Alert, Dialog), Lucide React

**Storage**: MySQL (`personal_access_tokens` table)

**Testing**: Pest (Laravel backend), Vitest & React Testing Library (Next.js frontend)

**Target Platform**: Linux Docker environment (dev), modern Web Browsers

**Project Type**: Web Application (Monorepo: Laravel API + Next.js frontend with BFF)

**Performance Goals**:
- Listar sessões em menos de 1.0s (carregamento inicial ou transição de aba).
- Revogar sessão (remotamente) e atualizar a lista em menos de 1.5s.

**Constraints**:
- Segurança absoluta: o token de acesso pessoal (`auth_token`) não deve vazar para o frontend do cliente (armazenado em cookie `HttpOnly`).
- O usuário logado só pode visualizar e revogar seus próprios tokens.
- O token associado à requisição atual do usuário NÃO pode ser revogado (bloqueio no frontend e backend).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Arquitetura Monorepo e Separação de Responsabilidades**: Mantido de forma clara com alterações separadas em `laravel/` (API) e `nextjs/` (frontend).
- **II. Design Padrão e Desacoplamento da API (Laravel)**:
  - Controllers enxutos (`ProfileController`).
  - Sem necessidade de novos Form Requests (a exclusão recebe ID na rota, e a listagem é puramente leitura).
  - Toda lógica encapsulada no `ProfileService`.
  - Eloquent relations (`$user->tokens()`) mapeadas diretamente sem queries brutas, mantendo conformidade.
  - Uso obrigatório de API Resource (`PersonalAccessTokenResource`) para higienizar e formatar o retorno.
- **III. Padronização de Respostas HTTP (Traits)**: Respostas usando `successResponse` e `errorResponse` via trait herdada pelo controller.
- **IV. Segurança e Autenticação (Laravel Sanctum)**: Todas as rotas protegidas pelo middleware `auth:sanctum`. Validação de propriedade do token no backend (o ID do token deve pertencer ao usuário logado). Impedir auto-revogação (retornar 400 Bad Request se tentar excluir o token da requisição atual).
- **V. Desenvolvimento Orientado a Especificações (SDD)**: Especificação completa em Português e com ciclo planejado de spec -> plan -> tasks -> implementation.
- **VI. Desenvolvimento Frontend Next.js e Segurança**:
  - Componentes oficiais do **Shadcn UI** (como Tabs, Card, Table, Button) para preservar o design e UX.
  - Segurança de Tokens: Sem chamadas diretas da página; toda comunicação encapsulada em `userService` e mediada pelo Next.js BFF proxy `/api/auth/profile/tokens/*`.
  - Validação delegada ao Laravel: O BFF Next.js apenas repassará as requisições e respostas.
- **Fluxo de Trabalho Git e Padrões de Commit**: Commits semânticos em português realizados apenas após a especificação, planejamento, tarefas, implementação, testes e aprovação de usabilidade.

## Project Structure

### Documentation (this feature)

```text
specs/008-user-sessions-management/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (generated via /speckit-tasks command)
```

### Source Code (repository root)

```text
laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── ProfileController.php (Adicionar métodos 'tokens' e 'revokeToken')
│   │   └── Resources/
│   │       └── PersonalAccessTokenResource.php [NEW]
│   └── Services/
│       └── ProfileService.php (Adicionar métodos 'tokens' e 'revokeToken')
└── routes/
    └── api.php (Adicionar rotas de tokens sob o middleware auth:sanctum)

nextjs/
├── src/
│   ├── app/
│   │   ├── (authenticated)/
│   │   │   └── meu-perfil/
│   │   │       └── page.tsx (Incluir a aba 'Sessões' com listagem e ação de revogação)
│   │   └── api/
│   │       └── auth/
│   │           └── profile/
│   │               └── tokens/
│   │                   ├── route.ts [NEW] (BFF Proxy para listagem)
│   │                   └── [id]/
│   │                       └── route.ts [NEW] (BFF Proxy para revogação)
│   └── services/
│       └── userService.ts (Adicionar métodos getClientTokens e revokeClientToken)
```

**Structure Decision**: Web application layout, separando as mudanças de API backend em `laravel/` e as mudanças de BFF/Frontend em `nextjs/`.

## Complexity Tracking

*Nenhuma violação identificada à constituição do projeto.*
