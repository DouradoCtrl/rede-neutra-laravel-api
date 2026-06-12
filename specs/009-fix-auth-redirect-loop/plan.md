# Implementation Plan: Solução do Loop de Redirecionamento de Sessão Expirada

**Branch**: `009-fix-auth-redirect-loop` | **Date**: 2026-06-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/009-fix-auth-redirect-loop/spec.md`

## Summary

Esta feature corrige o loop de redirecionamento infinito que ocorre quando o Personal Access Token do usuário é revogado ou excluído do banco de dados (por exemplo, por outro dispositivo ou manualmente). O layout autenticado (`(authenticated)/layout.tsx`) redirecionará o usuário para `/login?session_expired=true` em caso de erro 401. O middleware (`proxy.ts`) interceptará esse parâmetro, removerá o cookie `auth_token` e permitirá que o fluxo prossiga normalmente, onde o formulário de login exibirá um Toast de sessão expirada para dar feedback visual ao usuário.

## Technical Context

**Language/Version**: TypeScript / Node.js (v20) / Next.js (v16.2.9)

**Primary Dependencies**: Next.js, Radix UI (Shadcn UI), Sonner (Toasts)

**Storage**: HttpOnly Cookie (`auth_token`) no cliente, tokens de acesso no PostgreSQL (Laravel Sanctum)

**Testing**: Eslint/Linting no cliente

**Target Platform**: Linux server (Docker)

**Project Type**: Web application (Next.js client + Laravel backend monorepo)

**Performance Goals**: Redirecionamento e limpeza imediatos, sem sobrecarga ou chamadas API extras no middleware

**Constraints**: O cookie `auth_token` é HttpOnly e não pode ser apagado via JavaScript client-side; deve ser apagado no servidor (middleware ou BFF)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Separação de responsabilidades (Monorepo)**: Sim, as alterações do frontend são mantidas na pasta `nextjs/`.
- **Uso do BFF (Next.js API proxy)**: Sim, mantemos o fluxo de comunicação `Página -> Serviço -> BFF -> Laravel`.
- **Segurança de Tokens (HttpOnly cookie)**: Sim, a segurança de tokens é preservada e a limpeza é feita através dos cabeçalhos HTTP pelo middleware e BFF.
- **Validação delegada ao Laravel**: Sim, as falhas de autenticação são verificadas exclusivamente no Laravel e propagadas pelo BFF.
- **SDD**: Sim, estamos seguindo o fluxo de especificações e plano técnico antes de programar.

*Resultado: PASS*

## Project Structure

### Documentation (this feature)

```text
specs/009-fix-auth-redirect-loop/
├── plan.md              # This file
├── research.md          # Technical decisions and alternatives
├── data-model.md        # Session state and cookie model
├── quickstart.md        # Test scenarios and step-by-step verification
├── contracts/
│   └── api-contracts.md # BFF endpoint update contracts
└── tasks.md             # (Not created by speckit-plan)
```

### Source Code (repository root)

```text
nextjs/
├── src/
│   ├── app/
│   │   ├── (authenticated)/
│   │   │   └── layout.tsx            # Session layout error handling
│   │   │   └── meu-perfil/page.tsx   # Profile & sessions client actions
│   │   ├── api/                      # BFF Route Handlers
│   │   └── login/
│   │       └── page.tsx              # LoginPage to capture searchParams
│   │   ├── components/
│   │   │   └── login-form.tsx        # Login Form component to show Toast
│   │   ├── proxy.ts                  # Middleware / Router redirection
│   │   └── services/
│   │       └── userService.ts        # Client & server API services
```

**Structure Decision**: A estrutura segue a convenção monorepo pré-existente do projeto, dividida entre `laravel/` para a API backend e `nextjs/` para a aplicação frontend com Next.js.

## Proposed Changes

### Next.js Client-Side & Routing

#### [MODIFY] [layout.tsx](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/app/(authenticated)/layout.tsx)
- No bloco `catch` do perfil (`userService.getProfile`), redirecionar o usuário para `/login?session_expired=true` em vez de `/login` para sinalizar a invalidação.

#### [MODIFY] [proxy.ts](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/proxy.ts)
- Interceptar a rota `/login` verificando se o parâmetro `session_expired=true` está presente.
- Se presente, instanciar a resposta `NextResponse.next()`, invocar `response.cookies.delete("auth_token")` para remover o cookie inválido do navegador, e retornar essa resposta.
- Adicionar `/meu-perfil` na validação de rotas protegidas (`isProtectedRoute`) e no matcher de rotas para garantir consistência de acessos diretos.

#### [MODIFY] [page.tsx](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/app/login/page.tsx)
- Modificar o componente `LoginPage` para ser assíncrono e receber as propriedades `searchParams` do Next.js.
- Obter o parâmetro `session_expired` (dando await se necessário) e passá-lo como a propriedade `sessionExpired` para o componente `<LoginForm />`.

#### [MODIFY] [login-form.tsx](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/components/login-form.tsx)
- Atualizar a interface `LoginFormProps` para aceitar a propriedade `sessionExpired: boolean`.
- Adicionar um hook `useEffect` que detecta a inicialização do formulário: se `sessionExpired` for verdadeiro, chamar `toast.error("Sua sessão expirou. Por favor, faça login novamente.")`.

#### [MODIFY] [userService.ts](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/services/userService.ts)
- Atualizar os métodos do servidor (`getProfile` e `getProfileTokens`): em caso de erro na requisição fetch (quando `!response.ok`), em vez de lançar um objeto genérico `Error`, lançar um objeto de erro contendo o código HTTP correspondente (`{ status: response.status, message: ... }`).
- Adicionar em todas as requisições client-side (`getClientProfile`, `getClientTokens`, `updateClientProfile`, `updateClientPassword`, `revokeClientToken`) um tratamento de resposta para verificar se o status de retorno é `401`.
- Caso seja `401`, executar imediatamente `window.location.href = "/login?session_expired=true"` para limpar o estado local e enviar o usuário à tela de login.

## Verification Plan

### Automated Tests
- Executar linting estático para garantir que não há erros de tipagem no Next.js:
  ```bash
  npm run lint
  ```

### Manual Verification
- Autenticar na aplicação.
- Deletar os tokens da tabela `personal_access_tokens` do usuário no banco de dados.
- Atualizar qualquer página protegida (ex: `/dashboard` ou `/meu-perfil`) e confirmar o redirecionamento imediato para `/login?session_expired=true`, a ausência do cookie `auth_token` e o surgimento do Toast de alerta.
- Repetir o fluxo em tempo de execução na aba "Sessões" ao tentar revogar uma sessão após a exclusão do token, validando se o redirecionamento client-side funciona no clique de botões.
