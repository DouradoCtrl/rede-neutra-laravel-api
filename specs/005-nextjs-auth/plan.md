# Implementation Plan: nextjs-auth

**Branch**: `005-nextjs-auth` | **Date**: 2026-06-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-nextjs-auth/spec.md`

## Summary

Implementar um frontend moderno com Next.js (16.2.9) para autenticação, consumindo a API Laravel existente. A solução exigirá a integração segura de tokens de sessão mantendo-os no servidor (Next.js Route Handlers / Server Actions), sem vazar para o cliente, e utilizará as bibliotecas Shadcn UI e Sonner para construção rápida da interface e exibição de feedbacks visuais.

## Technical Context

**Language/Version**: TypeScript / Node.js / PHP 8.x

**Primary Dependencies**: Next.js 16.2.9, React, Shadcn UI, Sonner, TailwindCSS (default com Shadcn)

**Storage**: Servidor Frontend (HTTP Only Cookies para armazenar o Token Bearer)

**Testing**: N/A (por ora)

**Target Platform**: Web Browser / Containerizado via Docker (`docker-compose.dev.yaml`)

**Project Type**: Aplicação Web (Frontend) em ambiente Monorepo

**Performance Goals**: Respostas instantâneas e SSR.

**Constraints**:
- O Token Bearer recebido pelo Laravel **NÃO PODE** ser exposto ao navegador do usuário (sem LocalStorage ou chamadas `use client` vazando credenciais). Ele será gerenciado via HttpOnly cookies e as requisições autenticadas passarão por um intermediário ou Server Actions.
- O formulário precisa enviar o `device_name` usando os dados extraídos do cabeçalho `User-Agent`.
- Obrigatório utilizar o framework Next.js 16.2.9 e instalar as dependências de UI via Shadcn UI em vez de criar componentes do zero.

**Scale/Scope**: Inicialização da pasta `/nextjs`, tela de `/login`, mapeamento de erros 422 para os campos `input` (sem duplicação de lógicas de validação), e tela temporária `/dashboard`. Atualização do CORS no Laravel.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Arquitetura Monorepo**: Nova pasta `nextjs/` na raiz do projeto, mantendo versionamento conjunto e separação de responsabilidades.
- [x] **IV. Segurança e Autenticação (Laravel Sanctum)**: O Next.js será um cliente que irá autenticar e consumir as rotas, guardando o token recebido de forma segura (neste caso, protegido como HttpOnly no próprio server node).

## Project Structure

### Documentation (this feature)

```text
specs/005-nextjs-auth/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
└── tasks.md             
```

### Source Code (repository root)

```text
nextjs/
├── src/
│   ├── app/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── api/auth/route.ts (Proxy opcional/gerenciamento de sessão)
│   ├── components/
│   │   └── ui/ (shadcn)
│   └── services/
│       └── authService.ts

laravel/
├── config/
│   └── cors.php (Update for Next.js origin)
```

**Structure Decision**: O projeto será contido dentro da pasta `nextjs` e utilizará a estrutura de `App Router` (`src/app`). O Laravel será modificado minimamente apenas para aceitar a origem do Next.js via CORS.
