# Implementation Plan: Sidebar de Navegação e Menu do Usuário

**Branch**: `006-nextjs-sidebar` | **Date**: 2026-06-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-nextjs-sidebar/spec.md`

**Note**: Este template é preenchido pelo comando `/speckit-plan`.

## Summary

Implementar a estrutura de navegação lateral (Sidebar) no Next.js utilizando o componente de Sidebar oficial da Shadcn UI (baseado em Radix UI) com suporte a temas dinâmicos (Claro/Escuro/Sistema) via `next-themes` e tipografia premium (fonte Inter). A Sidebar exibirá o logotipo da aplicação ("Rede Neutra") e atalho do "Dashboard" no menu principal, e conterá no rodapé os atalhos de "Usuários" e "Telecom" sob o cabeçalho "Administrador" (exibido condicionalmente a perfis administrativos). O rodapé também contará com um menu flutuante (dropdown) associado ao avatar do usuário autenticado para as ações de perfil e logout. Toda a área logada será encapsulada em um grupo de rotas com layout compartilhado e um componente `<Header>` unificado com breadcrumbs dinâmicos e alternador de tema.

## Technical Context

**Language/Version**: TypeScript / Next.js 16.2.9 (App Router)

**Primary Dependencies**: React 19, @radix-ui/react-avatar, @radix-ui/react-dropdown-menu, @radix-ui/react-separator, lucide-react, tailwindcss, shadcn

**Storage**: Cookies HTTP-Only (`auth_token`) para autenticação com o Laravel Sanctum

**Testing**: Validação visual de renderização responsiva e fluxo de clique E2E

**Target Platform**: Navegadores Web (Desktop e Mobile)

**Project Type**: Frontend Next.js em repositório Monorepo

**Performance Goals**: Renderização instantânea em Server Components, respostas de clique abaixo de 100ms.

**Constraints**:
- Segurança de sessão: Nenhuma credencial de token exposta no lado do cliente.
- A barra lateral deve usar os componentes originais instalados pelo Shadcn UI no projeto.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Arquitetura Monorepo e Separação de Responsabilidades**: A implementação reside estritamente no frontend Next.js (`nextjs/`), comunicando-se com o backend Laravel apenas via endpoints JSON predefinidos.
- [x] **IV. Segurança e Autenticação (Laravel Sanctum)**: O token Bearer do Laravel é mantido sob controle seguro no cookie HTTP-Only, e o fluxo de logout limpa essa credencial de forma segura e imediata.
- [x] **V. Desenvolvimento Orientado a Especificações (SDD)**: O plano técnico e a especificação foram gerados e documentados em português antes da implementação das tarefas.

## Project Structure

### Documentation (this feature)

```text
specs/006-nextjs-sidebar/
├── plan.md              # Este arquivo
├── research.md          # Decisões de arquitetura e alternativas
├── data-model.md        # Definições de tipos TypeScript
├── quickstart.md        # Passos de validação local
└── checklists/
    └── requirements.md  # Checklist de qualidade da especificação
```

### Source Code (repository root)

```text
nextjs/
├── src/
│   ├── app/
│   │   ├── (authenticated)/      # Grupo de rotas autenticadas
│   │   │   ├── layout.tsx        # Layout comum com SidebarProvider e AppSidebar
│   │   │   ├── dashboard/        # Movido para dentro do grupo autenticado
│   │   │   │   └── page.tsx
│   │   │   ├── usuarios/         # Rota de Usuários
│   │   │   │   └── page.tsx
│   │   │   ├── telecom/          # Rota de Telecom
│   │   │   │   └── page.tsx
│   │   │   └── meu-perfil/       # Rota de Meu Perfil
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── me/           # Route Handler para dados do perfil
│   │   │           └── route.ts
│   │   └── middleware.ts         # Controle de rotas protegidas
│   ├── components/
│   │   ├── app-sidebar.tsx       # Componente customizado da barra lateral
│   │   ├── header.tsx            # Header unificado com breadcrumbs dinâmicos e ThemeToggle
│   │   ├── theme-toggle.tsx      # Componente seletor de temas (Claro/Escuro/Sistema)
│   │   ├── providers.tsx         # Provedor global de temas (next-themes)
│   │   └── ui/                   # Componentes primitivos Shadcn UI (sidebar, avatar, dropdown, breadcrumb)
│   └── services/
│       └── userService.ts        # Serviço de comunicação para obter dados do usuário
```

**Structure Decision**: Utilizaremos a estrutura recomendada de **Grupo de Rotas (`(authenticated)`)** no Next.js App Router para separar as rotas públicas (como `/login`) das privadas (como `/dashboard`, `/usuarios` e `/telecom`), aplicando o componente de layout de barra lateral de forma automática e limpa a todo o escopo autenticado. O arquivo `middleware.ts` será criado na raiz de `src/` para orquestrar o fluxo de redirecionamento utilizando a lógica já presente em `proxy.ts`.

## Complexity Tracking

*Nenhuma violação identificada à constituição do projeto.*
