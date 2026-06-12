# Tasks: Solução do Loop de Redirecionamento de Sessão Expirada

**Input**: Design documents from `/specs/009-fix-auth-redirect-loop/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: As tarefas são agrupadas por história de usuário para viabilizar implementação e testes independentes de cada entrega de valor.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (sem conflito de arquivo ou dependências lógicas diretas)
- **[Story]**: A qual história de usuário (US) a tarefa pertence (ex: US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verificação do estado do ambiente de desenvolvimento.

- [x] T001 Verificar o funcionamento local do Next.js via comando `curl -I http://localhost:3000/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pré-requisitos essenciais na camada de serviço para propagação correta dos códigos HTTP de erro.

- [x] T002 Atualizar funções server-side `getProfile` e `getProfileTokens` em `nextjs/src/services/userService.ts` para propagar objetos contendo o código HTTP (`status`) e a mensagem de erro.

---

## Phase 3: User Story 1 - Identificar Sessão Expirada e Desconectar (Priority: P1) 🎯 MVP

**Goal**: Identificar quando a sessão é revogada na recarga da página e no clique de botões, iniciando o redirecionamento.

**Independent Test**: Invalidar o token de sessão do usuário no banco de dados e verificar se, ao recarregar a página protegida ou clicar em alguma ação, a aplicação responde iniciando a navegação para `/login?session_expired=true`.

### Implementation for User Story 1

- [x] T003 [P] [US1] Modificar o bloco `catch` do perfil do usuário em `nextjs/src/app/(authenticated)/layout.tsx` para redirecionar para `/login?session_expired=true` em caso de erro.
- [x] T004 [P] [US1] Atualizar métodos client-side (`getClientProfile`, `getClientTokens`, `updateClientProfile`, `updateClientPassword`, `revokeClientToken`) em `nextjs/src/services/userService.ts` para verificar se `response.status === 401` e redirecionar via `window.location.href` caso verdadeiro.

---

## Phase 4: User Story 2 - Notificação de Feedback (Priority: P1)

**Goal**: Exibir Toast na tela de login informando que a sessão expirou.

**Independent Test**: Acessar `/login?session_expired=true` no navegador e verificar se o Toast da Sonner é disparado no carregamento da página com a mensagem informativa.

### Implementation for User Story 2

- [x] T005 [P] [US2] Atualizar o componente de página de login em `nextjs/src/app/login/page.tsx` para ser assíncrono, aguardar `searchParams` e repassar a propriedade `sessionExpired` para `<LoginForm />`.
- [x] T006 [P] [US2] Modificar o componente do formulário em `nextjs/src/components/login-form.tsx` para receber `sessionExpired` as prop e disparar `toast.error` em um `useEffect` caso seja verdadeiro.

---

## Phase 5: User Story 3 - Prevenção de Loops de Redirecionamento (Priority: P1)

**Goal**: Limpar o cookie no middleware ao carregar o login por expiração e estender a proteção para a rota de perfil.

**Independent Test**: Efetuar login, revogar o token no banco de dados e atualizar o `/dashboard` ou `/meu-perfil`. O redirecionamento de expiração deve ocorrer com sucesso e o loop de carregamento infinito não deve acontecer.

### Implementation for User Story 3

- [x] T007 [P] [US3] Atualizar o middleware `nextjs/src/proxy.ts` para que, ao acessar `/login` com parâmetro `session_expired=true`, ele delete o cookie `auth_token` e retorne `NextResponse.next()`.
- [x] T008 [US3] Adicionar as rotas `/meu-perfil` e `/meu-perfil/:path*` à verificação de rotas protegidas (`isProtectedRoute`) e no matcher de rotas no arquivo `nextjs/src/proxy.ts`.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificações finais e validação de qualidade estática.

- [x] T009 [P] Executar o linter do TypeScript na pasta `nextjs/` via comando `npm run lint` para validar integridade de tipos.
- [x] T010 Executar os testes manuais detalhados no guia `quickstart.md` e registrar os resultados finais.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** e **Foundational (Phase 2)**: Sem dependências, devem ser feitas no início.
- **User Story 1 (Phase 3)**: Depende do término da Phase 2.
- **User Story 2 (Phase 4)** e **User Story 3 (Phase 5)**: Podem começar em paralelo após a conclusão da Phase 3, pois necessitam que o fluxo de redirecionamento `?session_expired=true` esteja ativado no layout e nos serviços.
- **Polish (Phase 6)**: Depende da conclusão de todas as histórias de usuário.

### Parallel Opportunities

- As tarefas T003 e T004 (da história US1) podem ser executadas em paralelo.
- As tarefas da história US2 (T005 e T006) e da história US3 (T007 e T008) podem ser desenvolvidas em paralelo por desenvolvedores diferentes.
