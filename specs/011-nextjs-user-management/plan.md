# Plano de Implementação: Painel de Gerenciamento de Usuários e Hubsoft

**Branch**: `011-nextjs-user-management` | **Date**: 2026-06-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-nextjs-user-management/spec.md`

## Summary

Esta funcionalidade implementa o painel completo de gerenciamento de usuários no Next.js (`/usuarios`) integrado com a API do Laravel por meio de rotas BFF intermediárias seguras. Além disso, adiciona o suporte ao campo `codigo_cliente_hubsoft` na tabela `telecom_groups` para futuras integrações de rede neutra, e realiza o isolamento de escopo (multi-tenant) no Laravel para que administradores de empresas parceiras visualizem e gerenciem exclusivamente seus próprios usuários.

## Technical Context

**Language/Version**: TypeScript / Node.js (v20) / Next.js (v16.2.9) / PHP (v8.2) / Laravel (v11)

**Primary Dependencies**: React (v19), Radix UI (dialog, alert-dialog, dropdown-menu, slot, separator, badge), TailwindCSS, Sonner (Toasts)

**Storage**: PostgreSQL (coluna `codigo_cliente_hubsoft` na tabela `telecom_groups`)

**Testing**: Linting estático e testes de compilação no Next.js; Migrations do Laravel

**Target Platform**: Servidor Linux (Docker)

**Project Type**: Monorepo (Next.js client + Laravel backend)

**Performance Goals**: Listagem rápida, redução de queries N+1 utilizando eager loading no Laravel, carregamento instantâneo do BFF

**Constraints**: Restrições rígidas de cargo (`super_admin` pode alterar o Grupo Telecom de qualquer usuário; `admin` gerencia apenas usuários do seu grupo e não pode alterar a sua própria permissão ou deletar a si mesmo).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Arquitetura Monorepo**: Sim, as alterações do frontend são mantidas na pasta `nextjs/` e as de backend em `laravel/`.
- **Camadas no Laravel**: Sim, toda a alteração de banco é feita via Migrations/Repositories e a lógica de negócio encapsulada em Services. As saídas usam API Resources.
- **Uso do BFF (Next.js API proxy)**: Sim, mantemos o fluxo de comunicação `Página -> Serviço -> BFF -> Laravel`.
- **Validação delegada ao Laravel**: Sim, as falhas de validação de formulários (erros 422) são propagadas pelo BFF e tratadas visualmente no Next.js.
- **SDD**: Sim, especificação e plano técnico gerados antes do código.

*Resultado: PASS*

## Project Structure

### Documentation (this feature)

```text
specs/011-nextjs-user-management/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Multi-tenant and Hubsoft decisions
├── data-model.md        # Database relationship and Hubsoft property schema
├── quickstart.md        # Validation scenarios
├── contracts/
│   └── api-contracts.md # BFF endpoint update contracts
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code

```text
laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── UserController.php          # Adjusted index to filter by tenant
│   │   └── Resources/
│   │       └── TelecomGroupResource.php    # Added codigo_cliente_hubsoft to json output
│   ├── Models/
│   │   └── TelecomGroup.php                # Added field to fillable attributes
│   └── Repositories/
│       └── UserRepository.php              # Implemented tenant query filtering
└── database/
    └── migrations/
        └── YYYY_MM_DD_HHMMSS_add_codigo_cliente_hubsoft_to_telecom_groups_table.php # [NEW] Migration

nextjs/
├── src/
│   ├── app/
│   │   ├── (authenticated)/
│   │   │   └── usuarios/
│   │   │       └── page.tsx                # [MODIFY] Dynamic dashboard page with search/filters/table
│   │   └── api/
│   │       ├── users/
│   │       │   ├── route.ts                # [NEW] BFF endpoint for list & create
│   │       │   └── [id]/
│   │       │       └── route.ts            # [NEW] BFF endpoint for detail, update, delete
│   │       └── telecom-groups/
│   │           └── route.ts                # [NEW] BFF endpoint for telecom-groups
│   ├── components/
│   │   ├── user-form-dialog.tsx            # [NEW] Modal containing create/edit form
│   │   └── ui/
│   │       ├── table.tsx                   # [NEW] Shadcn table components
│   │       └── select.tsx                  # [NEW] Shadcn select components
│   └── services/
│       └── userService.ts                  # [MODIFY] Added CRUD operations and telecom index
```

## Proposed Changes

### Laravel Backend

#### [NEW] [Migration file](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/laravel/database/migrations/)
- Criar a migration `add_codigo_cliente_hubsoft_to_telecom_groups_table` para adicionar a coluna `codigo_cliente_hubsoft` (string, nullable, unique) na tabela `telecom_groups`.

#### [MODIFY] [TelecomGroup.php](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/laravel/app/Models/TelecomGroup.php)
- Adicionar `'codigo_cliente_hubsoft'` ao atributo `#[Fillable]`.

#### [MODIFY] [TelecomGroupResource.php](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/laravel/app/Http/Resources/TelecomGroupResource.php)
- Incluir o campo `codigo_cliente_hubsoft` no array de saída do Resource.

#### [MODIFY] [UserRepository.php](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/laravel/app/Repositories/UserRepository.php)
- Atualizar ou criar o método de listagem com suporte a filtro do usuário logado:
  - Se `$user->role !== 'super_admin'`, aplicar a cláusula `where('telecom_group_id', $user->telecom_group_id)`. Como todos os usuários possuem grupo obrigatório (`telecom_group_id`), o `admin` do grupo `owner` verá apenas os usuários internos do grupo `owner`, enquanto o `admin` de uma parceira verá apenas os usuários da parceira.

#### [MODIFY] [UserService.php](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/laravel/app/Services/UserService.php)
- Adaptar o método `getAll()` para aceitar o usuário logado e delegar para a filtragem no repositório.

#### [MODIFY] [UserController.php](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/laravel/app/Http/Controllers/UserController.php)
- Passar o `$request->user()` para a chamada de serviço `getAll()` no método `index`.

---

### Next.js Client-Side & BFF

#### [NEW] [table.tsx](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/components/ui/table.tsx)
- Implementar os componentes reutilizáveis de tabela (`Table`, `TableHeader`, `TableBody`, `TableHead`, `TableRow`, `TableCell`) estilizados com as classes globais do Tailwind.

#### [NEW] [select.tsx](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/components/ui/select.tsx)
- Implementar o componente de dropdown select estilizado do Shadcn UI (baseado em `@radix-ui/react-select` se necessário, ou usar seletor estilizado compatível com o design system do projeto).

#### [MODIFY] [userService.ts](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/services/userService.ts)
- Adicionar operações CRUD cliente-side: `getUsers()`, `createUser()`, `updateUser()`, `deleteUser()`.
- Adicionar chamada para obter grupos de telecomunicações `getTelecomGroups()`.

#### [NEW] [route.ts (users)](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/app/api/users/route.ts)
- Adicionar BFF handlers para `GET /api/users` e `POST /api/users` repassando tokens de autorização e retornos de validação de forma transparente.

#### [NEW] [route.ts (users id)](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/app/api/users/[id]/route.ts)
- Adicionar BFF handlers para `GET /api/users/[id]`, `PUT /api/users/[id]`, e `DELETE /api/users/[id]`.

#### [NEW] [route.ts (telecom-groups)](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/app/api/telecom-groups/route.ts)
- Adicionar BFF handler para `GET /api/telecom-groups`.

#### [NEW] [user-form-dialog.tsx](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/components/user-form-dialog.tsx)
- Criar o componente de formulário modal de cadastro e edição de usuário.
- O campo de seleção de Telecomunicações só deve aparecer se o usuário logado for `super_admin`.

#### [MODIFY] [page.tsx](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/app/(authenticated)/usuarios/page.tsx)
- Substituir o conteúdo de placeholder por:
  - Tabela listando os usuários ativos.
  - Filtro por termo de busca e dropdown de cargo.
  - Botão "Novo Usuário" que abre o modal.
  - Botão de Editar e Deletar (que abre `AlertDialog` para confirmação antes de disparar o delete).

## Verification Plan

### Automated Tests
- Rodar o linter do frontend Next.js para garantir que não há erros de compilação ou de tipo:
  ```bash
  npm run lint
  ```

### Manual Verification
- Autenticar como `super_admin` e validar se visualiza todos os usuários e o campo de associação Telecom.
- Autenticar como `admin` parceiro e validar se visualiza **apenas** colaboradores do próprio grupo e se o campo Telecom fica oculto na criação de usuários.
- Tentar realizar ações proibidas (como excluir a si próprio ou editar seu próprio cargo) e verificar se o frontend bloqueia a ação corretamente.
