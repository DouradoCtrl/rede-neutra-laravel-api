# Tarefas: Sidebar de Navegação e Menu do Usuário

**Entrada**: Documentos de design em `specs/006-nextjs-sidebar/`

**Pré-requisitos**: [plan.md](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/specs/006-nextjs-sidebar/plan.md) (obrigatório), [spec.md](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/specs/006-nextjs-sidebar/spec.md) (obrigatório para histórias de usuário), [research.md](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/specs/006-nextjs-sidebar/research.md), [data-model.md](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/specs/006-nextjs-sidebar/data-model.md), [contracts/auth-proxy.md](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/specs/006-nextjs-sidebar/contracts/auth-proxy.md).

**Organização**: As tarefas estão agrupadas por história de usuário para permitir a implementação e testes independentes de cada história.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências de lógica pendente).
- **[Story]**: A qual história de usuário essa tarefa pertence (ex: US1, US2).
- Inclui caminhos de arquivos exatos nas descrições.

---

## Phase 1: Setup (Infraestrutura Compartilhada)

**Propósito**: Validação e inicialização da estrutura básica de desenvolvimento.

- [x] T001 [P] Verificar os componentes primitivos do shadcn (sidebar, avatar, dropdown-menu) em `/nextjs/src/components/ui/`
- [x] T002 [P] Validar classes utilitárias e variáveis CSS em `/nextjs/src/app/globals.css`

---

## Phase 2: Foundational (Pré-requisitos Bloqueantes)

**Propósito**: Infraestrutura que DEVE estar completa antes de qualquer história de usuário começar.

**⚠️ CRÍTICO**: Nenhuma tarefa das histórias de usuário pode começar até que esta fase esteja completa.

- [x] T003 Criar o arquivo de middleware padrão do Next.js em `/nextjs/src/middleware.ts` para exportar a lógica de rotas do proxy. (Observação: removido após validação, pois Next.js 16 utiliza `proxy.ts` nativamente).
- [x] T004 Refatorar o mapeador de rotas protegidas em `/nextjs/src/proxy.ts` para interceptar as novas rotas autenticadas (`/usuarios` e `/telecom`), além de `/dashboard`.

**Checkpoint**: Fundação pronta - a implementação das histórias de usuário agora pode começar.

---

## Phase 3: User Story 1 - Acesso à Navegação do Sistema (Prioridade: P1) 🎯 MVP

**Objetivo**: Implementar o grupo de rotas privadas sob um layout compartilhado, com a renderização da sidebar contendo a logo, nome do projeto e os links "Dashboard", "Usuários" e "Telecom".

**Teste Independente**: Entrar no sistema autenticado e visualizar a sidebar na lateral esquerda renderizando os links e permitindo navegação sem quebra visual.

### Implementação para User Story 1

- [x] T005 [P] [US1] Mover a pasta `/nextjs/src/app/dashboard` para `/nextjs/src/app/(authenticated)/dashboard` e ajustar caminhos internos.
- [x] T006 [P] [US1] Criar página para a rota de usuários em `/nextjs/src/app/(authenticated)/usuarios/page.tsx` contendo estrutura simples de exibição de título.
- [x] T007 [P] [US1] Criar página para a rota de telecom em `/nextjs/src/app/(authenticated)/telecom/page.tsx` contendo estrutura simples de exibição de título.
- [x] T008 [US1] Criar componente customizado de barra lateral em `/nextjs/src/components/app-sidebar.tsx` renderizando a logo do projeto, o título da aplicação e a lista de links ("Dashboard", "Usuários", "Telecom") com ícones correspondentes do Lucide.
- [x] T009 [US1] Criar arquivo de layout em `/nextjs/src/app/(authenticated)/layout.tsx` para instanciar o `<SidebarProvider>`, a barra lateral `<AppSidebar>` e a div de contêiner principal da aplicação que exibe `{children}`.

**Checkpoint**: Neste ponto, a História de Usuário 1 (navegação básica e painel lateral) deve estar 100% operacional.

---

## Phase 4: User Story 2 - Gerenciamento de Sessão e Atalho de Perfil (Prioridade: P2)

**Objetivo**: Adicionar o avatar do usuário com menu dropdown contendo "Perfil" e "Sair" (logout), buscando dados do perfil diretamente na renderização do layout.

**Teste Independente**: Abrir o dropdown ao clicar no avatar, verificar o e-mail e nome do usuário logado e clicar em "Sair" para confirmar o redirecionamento com revogação do token.

### Implementação para User Story 2

- [x] T010 [P] [US2] Criar o serviço de perfil do usuário em `/nextjs/src/services/userService.ts` mapeando a chamada à API externa `/api/v1/auth/profile/me` com o cabeçalho Authorization.
- [x] T011 [P] [US2] Criar Route Handler do Next em `/nextjs/src/app/api/auth/me/route.ts` atuando como proxy seguro para o endpoint do Laravel, capturando o token Bearer do cookie HttpOnly.
- [x] T012 [US2] Refatorar layout em `/nextjs/src/app/(authenticated)/layout.tsx` para carregar os dados de perfil no servidor (Server-Side Fetch) e passar os dados do usuário conectado para a `<AppSidebar>`.
- [x] T013 [US2] Integrar no rodapé do componente `<AppSidebar>` em `/nextjs/src/components/app-sidebar.tsx` o componente de `<Avatar>` renderizando as iniciais ou imagem do usuário recebidas por props.
- [x] T014 [US2] Adicionar no componente `<AppSidebar>` em `/nextjs/src/components/app-sidebar.tsx` o menu dropdown com as ações para direcionar à página de perfil do usuário e a ação de logout.
- [x] T015 [US2] Conectar o gatilho de logout no dropdown do avatar com o serviço de logout do Next.js `/api/auth/logout` para excluir a sessão local e redirecionar para a tela de login.
- [x] T019 [US2] Criar rota limpa para a página de perfil em `/nextjs/src/app/(authenticated)/meu-perfil/page.tsx` e atualizar o link no menu dropdown do avatar para apontar para essa nova rota.

**Checkpoint**: Ambas as Histórias de Usuário 1 e 2 estão prontas e integradas de forma independente.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Propósito**: Ajustes finos, responsividade da barra lateral no mobile e validação final de ponta a ponta.

- [x] T016 Validar usabilidade em telas mobile (colapso de barra lateral, gestos de toggle) utilizando as facilidades padrão do shadcn.
- [x] T017 Limpar estados e estilizar estados de transição entre rotas autenticadas.
- [x] T018 Rodar o guia de validação do [quickstart.md](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/specs/006-nextjs-sidebar/quickstart.md) e registrar o sucesso da feature.

---

## Dependências e Ordem de Execução

### Dependências das Fases

- **Setup (Fase 1)**: Sem dependências - pode começar imediatamente.
- **Foundational (Fase 2)**: Depende do Setup - BLOQUEIA todas as histórias de usuário.
- **User Stories (Fases 3 e 4)**: Ambas dependem da conclusão da fase Foundational.
  - A História de Usuário 2 herda o layout e sidebar da História de Usuário 1, portanto, as tarefas estruturais da US1 bloqueiam a integração da US2.
- **Polish (Fase Final)**: Depende da conclusão de todas as histórias de usuário.

### Oportunidades de Paralelismo

- T005, T006, T007 podem rodar em paralelo pois criam caminhos e rotas físicas diferentes.
- T010 e T011 podem rodar em paralelo pois se dividem entre lógica de serviço cliente e endpoint de proxy no server do Next.

---

## Exemplo Paralelo: User Story 1

```bash
# Executar a estruturação física das pastas de rotas da aplicação simultaneamente:
Task: "Mover a pasta /nextjs/src/app/dashboard para /nextjs/src/app/(authenticated)/dashboard"
Task: "Criar página para a rota de usuários em /nextjs/src/app/(authenticated)/usuarios/page.tsx"
Task: "Criar página para a rota de telecom em /nextjs/src/app/(authenticated)/telecom/page.tsx"
```

---

## Estratégia de Implementação

### MVP Primeiro (História de Usuário 1)

1. Concluir Setup + Foundational.
2. Criar a estrutura de grupo de rotas públicas/autenticadas.
3. Desenvolver o componente da Sidebar e renderizá-lo no layout.
4. **Validar Navegação**: Alternar rotas entre Dashboard, Usuários e Telecom funcionando sem erros visuais.

### Entrega Incremental

1. **Fundação**: Rotas protegidas mapeadas no middleware.
2. **Navegação (US1)**: Painel lateral funcional navegando entre rotas autenticadas.
3. **Perfil e Sessão (US2)**: Avatar com informações do usuário autenticado e logout funcional pelo dropdown.
4. **Validação**: Testes finais de responsividade no Mobile.
