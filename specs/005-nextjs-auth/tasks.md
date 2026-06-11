# Tarefas: nextjs-auth

**Entrada**: Documentos de design em `specs/005-nextjs-auth/`

**Pré-requisitos**: plan.md (obrigatório), spec.md (obrigatório para histórias de usuário), research.md, data-model.md, quickstart.md

**Organização**: As tarefas estão agrupadas por história de usuário para permitir a implementação e testes independentes de cada história.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual história de usuário essa tarefa pertence (ex: US1, US2)
- Inclui caminhos de arquivo exatos nas descrições

## Fase 1: Setup (Infraestrutura Compartilhada)

**Objetivo**: Inicialização do projeto e estrutura básica

- [x] T001 Inicializar a aplicação Next.js 16.2.9 no diretório `nextjs/` usando npx create-next-app
- [x] T002 [P] Inicializar as configurações do Shadcn UI e Tailwind no `nextjs/`
- [x] T003 [P] Instalar a biblioteca Sonner no `nextjs/`

---

## Fase 2: Fundacional (Pré-requisitos Bloqueantes)

**Objetivo**: Infraestrutura principal que DEVE estar completa antes de QUALQUER história de usuário ser iniciada.

**⚠️ CRÍTICO**: Nenhuma história de usuário pode começar até que esta fase esteja completa.

- [x] T004 Atualizar as origens permitidas no CORS em `laravel/config/cors.php`
- [x] T005 [P] Criar o contrato base do serviço de autenticação em `nextjs/src/services/authService.ts`

**Ponto de Verificação (Checkpoint)**: Fundação pronta - a implementação das histórias de usuário agora pode começar em paralelo.

---

## Fase 3: História de Usuário 1 - Login de Usuário (Prioridade: P1) 🎯 MVP

**Objetivo**: Permitir acesso validado preenchendo credenciais, exibindo erros 422 em linha nos campos, mensagens em Sonner e redirecionar para a dashboard.

**Teste Independente**: Renderização do Form na tela acessível pelo navegador sem falhas; injeção de erros mocados.

### Implementação da História de Usuário 1

- [ ] T006 [P] [US1] Instalar os componentes shadcn necessários via CLI (`form`, `input`, `button`, `label`) em `nextjs/`
- [ ] T007 [P] [US1] Integrar o Toaster Global do Sonner no RootLayout em `nextjs/src/app/layout.tsx`
- [ ] T008 [US1] Criar tela inicial restrita para redirecionamento em `nextjs/src/app/dashboard/page.tsx`
- [ ] T009 [US1] Criar UI básica do Formulário de Login (estrutural, sem lógica complexa ainda) em `nextjs/src/app/login/page.tsx`
- [ ] T010 [US1] Acoplar a chamada ao serviço de backend no componente de login, tratando as respostas 422 e disparando Sonner Toasts apropriados em `nextjs/src/app/login/page.tsx`

**Ponto de Verificação (Checkpoint)**: Neste ponto, a História de Usuário 1 deve ser totalmente funcional e testável de forma independente (visualmente e na tratativa de erros recebidos).

---

## Fase 4: História de Usuário 2 - Segurança do Token e Identificação do Dispositivo (Prioridade: P1)

**Objetivo**: Gerenciar a sessão sem vazar o Bearer Token do Sanctum para o navegador e enviar o device_name ao backend.

**Teste Independente**: Inspeção nas ferramentas de desenvolvedor comprovando flag HTTPOnly no cookie gerado e o envio de Headers de Agent capturados.

### Implementação da História de Usuário 2

- [ ] T011 [P] [US2] Criar Next.js Server Route (ou Action) para atuar como proxy seguro de login em `nextjs/src/app/api/auth/login/route.ts`
- [ ] T012 [US2] Refatorar chamada do `authService` para usar o server side e extrair o `device_name` a partir de cabeçalhos HTTP na requisição em `nextjs/src/app/api/auth/login/route.ts`
- [ ] T013 [US2] Implementar leitura e gravação segura do token recebido pelo Laravel em Cookies HTTP-Only gerados pela Server Route Next em `nextjs/src/app/api/auth/login/route.ts`
- [ ] T014 [US2] Atualizar a UI do Login para apontar para a Server Route do Next em vez de apontar diretamente para a API do Laravel em `nextjs/src/app/login/page.tsx`

**Ponto de Verificação (Checkpoint)**: As Histórias de Usuário 1 E 2 devem ambas funcionar independentemente. A aplicação tem segurança de SSR garantida.

---

## Fase 5: Polimento e Preocupações Transversais

**Objetivo**: Melhorias que afetam múltiplas histórias de usuário.

- [ ] T015 [P] Ajustar o `docker-compose.dev.yaml` caso necessário para garantir o mapeamento de rede e volumes do `nextjs/` localmente.
- [ ] T016 Rodar as validações do quickstart.md localmente e garantir o fluxo completo de Login ao Dashboard.

---

## Dependências e Ordem de Execução

### Dependências das Fases

- **Setup (Fase 1)**: Sem dependências - pode começar imediatamente.
- **Fundacional (Fase 2)**: Depende da conclusão do Setup - BLOQUEIA todas as histórias de usuário.
- **Histórias de Usuário (Fase 3+)**: Todas dependem da conclusão da fase Fundacional.
- **Polimento (Fase Final)**: Depende de todas as histórias de usuário estarem completas.

### Oportunidades Paralelas

- Inicialização do Shadcn e Sonner podem ocorrer em paralelo.
- Configuração do CORS no Laravel e base de services no Next podem rodar isolados e paralelos.
- T011 pode começar simultaneamente ao T006, visto que atua como serviço de endpoint backend.

---

## Estratégia de Implementação

### Entrega Incremental

1. Completar Setup + Fundacional → Fundação pronta (Next rodando + CORS liberado).
2. Adicionar História de Usuário 1 → Formulário renderizado, validando e disparando erro.
3. Adicionar História de Usuário 2 → Server Route substitui chamadas inseguras diretas da Client API, finalizando a segurança do Cookie.
4. Aplicação completa e validada.
