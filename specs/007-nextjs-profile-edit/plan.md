# Implementation Plan: Edição de Perfil e Senha no Frontend

**Branch**: `007-nextjs-profile-edit` | **Date**: 2026-06-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/007-nextjs-profile-edit/spec.md`

## Summary

Implementar os formulários de edição de dados cadastrais (Nome, E-mail) e de alteração de senha (Senha Atual, Nova Senha, Confirmação) na página `/meu-perfil` do frontend Next.js. A funcionalidade será integrada com as rotas do backend Laravel `PUT /auth/profile/me` e `PUT /api/v1/auth/profile/password` através do fluxo arquitetural `page ➔ service ➔ BFF ➔ Laravel`, com tratamento de erros (como validações 422) e toasts de notificação globais via Sonner.

## Technical Context

**Language/Version**: TypeScript / Next.js 16.2.9 (App Router)

**Primary Dependencies**: React 19, lucide-react, tailwindcss, shadcn/ui (button, input, label, card, separator), sonner

**Storage**: Cookies HTTP-Only (`auth_token`) para autenticação Sanctum

**Testing**: Validação manual e fluxos E2E de validação de formulários no navegador

**Target Platform**: Navegadores Web (Desktop e Mobile)

**Project Type**: Frontend Next.js em repositório Monorepo

**Performance Goals**: Processamento de requisições de salvamento e feedback em menos de 1.5 segundos.

**Constraints**:
- Segurança de Sessão: O token `auth_token` deve ser mantido restrito em cookie HTTP-Only.
- BFF sem Validação Local: A API do Next.js (BFF) funcionará estritamente como um proxy de repasse seguro, delegando toda validação de regras e respostas ao Laravel e repassando o retorno de forma direta.
- Arquitetura de Comunicação: Obedecer a sequência `page -> service -> BFF -> Laravel`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Arquitetura Monorepo e Separação de Responsabilidades**: A implementação reside estritamente no frontend Next.js (`nextjs/`), comunicando-se com o backend Laravel apenas via endpoints REST.
- [x] **IV. Segurança e Autenticação (Laravel Sanctum)**: O token Bearer do Laravel é mantido sob controle seguro no cookie HTTP-Only.
- [x] **V. Desenvolvimento Orientado a Especificações (SDD)**: O plano técnico e a especificação foram gerados e documentados em português antes da implementação das tarefas.
- [x] **VI. Desenvolvimento Frontend Next.js e Segurança**: Componentização visual via Shadcn/Radix UI, isolamento do token no cookie, uso obrigatório de serviços e BFF de repasse de dados sem validações adicionais.

## Project Structure

### Documentation (this feature)

```text
specs/007-nextjs-profile-edit/
├── plan.md              # Este arquivo
├── research.md          # Decisões de arquitetura e alternativas
├── data-model.md        # Estrutura de dados consumida e enviada
├── quickstart.md        # Passos de validação local
└── checklists/
    └── requirements.md  # Checklist de qualidade da especificação
```

### Source Code (repository root)

```text
nextjs/
├── src/
│   ├── app/
│   │   ├── (authenticated)/
│   │   │   └── meu-perfil/
│   │   │       └── page.tsx        # Página de perfil com formulários de dados e senha
│   │   └── api/
│   │       └── auth/
│   │           └── profile/
│   │               ├── me/
│   │               │   └── route.ts  # BFF Route Handler para atualizar dados do perfil
│   │               └── password/
│   │                   └── route.ts  # BFF Route Handler para atualizar senha
│   ├── services/
│   │   └── userService.ts          # Métodos de serviço para updateProfile e updatePassword
```

**Structure Decision**: Utilizaremos a estrutura existente do Next.js BFF adicionando os Route Handlers do proxy sob `src/app/api/auth/profile/` e adicionando os formulários de interação diretamente dentro da página `meu-perfil/page.tsx` usando componentes e hooks de estado para os inputs.

## Complexity Tracking

*Nenhuma violação identificada à constituição do projeto.*
