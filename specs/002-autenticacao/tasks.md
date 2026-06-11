# Tarefas: Autenticação via Laravel Sanctum

**Input**: Documentos de design de `/specs/002-autenticacao/`

**Pré-requisitos**: [plan.md](plan.md) (obrigatório), [spec.md](spec.md) (obrigatório), [research.md](research.md), [data-model.md](data-model.md), [contracts/auth-api.md](contracts/auth-api.md)

**Organização**: Tarefas retrospectivas que documentam o fluxo de código já implementado na aplicação, marcadas como concluídas para fins de conformidade.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: Pode ser executado em paralelo (arquivos diferentes, sem dependência)
- **[Story]**: A qual história de usuário pertence a tarefa (ex.: US1, US2, US3)
- Caminhos exatos dos arquivos estão definidos nas descrições.

---

## Fase 1: Setup (Infraestrutura Compartilhada)

**Objetivo**: Preparação inicial das rotas do monorepo para autenticação da API.

- [x] T001 Declarar o grupo de rotas públicas e privadas no arquivo `laravel/routes/api.php`

---

## Fase 2: Fundacional (Prerrequisitos de Bloqueio)

**Objetivo**: Instalação e configuração do framework Sanctum.

- [x] T002 Injetar o middleware `EnsureFrontendRequestsAreStateful` e configurar o Sanctum no projeto Laravel
- [x] T003 Criar o arquivo base da classe `BaseRepository.php` para servir as demais consultas
- [x] T004 Criar o repositório `UserRepository.php` para encapsular consultas de e-mail e dados de usuário

---

## Fase 3: User Story 1 - Autenticação e Geração de Token (Prioridade: P1) 🎯 MVP

**Objetivo**: Implementar o login de usuários com validação estrita e geração de Bearer Token.

- [x] T005 [P] [US1] Criar a classe de validação customizada `LoginRequest.php` para higienizar e aplicar regras de e-mail e senha mínimos de 8 caracteres
- [x] T006 [P] [US1] Criar o recurso de transformação `LoginResource.php` para formatação da saída do token e usuário
- [x] T007 [US1] Implementar o método `login` na classe `AuthService.php` realizando hash check via Bcrypt e emitindo tokens Sanctum
- [x] T008 [US1] Criar o endpoint de login público no controller `AuthController.php` disparando o Service e retornando a resposta padronizada via trait `ApiResponses`

**Checkpoint**: Login funcionando e retornando o token Bearer.

---

## Fase 4: User Story 2 - Revogação de Acesso / Terminar Sessão (Prioridade: P1)

**Objetivo**: Invalidar e remover o token de acesso ativo no logout do usuário.

- [x] T009 [US2] Implementar o método `logout` no `AuthService.php` para remover o `currentAccessToken()` correspondente
- [x] T010 [US2] Criar o endpoint de logout protegido no `AuthController.php` e registrar a rota sob o middleware `auth:sanctum` no `api.php`

---

## Fase 5: User Story 3 - Obtenção de Perfil Autenticado (Prioridade: P2)

**Objetivo**: Retornar os dados do usuário autenticado juntamente com seu grupo de telecomunicações associado.

- [x] T011 [P] [US3] Criar o recurso de transformação `UserResource.php` para formatação dos dados de perfil do usuário
- [x] T012 [P] [US3] Criar o recurso de transformação `TelecomGroupResource.php` para formatação do grupo de telecomunicações associado
- [x] T013 [US3] Criar o endpoint `me` protegido no `AuthController.php` fazendo o carregamento da relação `telecomGroup` e retornando via `UserResource`

---

## Fase 6: Polimento & Validação Geral

**Objetivo**: Testes retrospectivos manuais para atestar a estabilidade.

- [x] T014 Validar a chamada de login e obter token no Insomnia conforme descrito no [quickstart.md](quickstart.md)
- [x] T015 Validar a chamada do endpoint `me` com o token Bearer ativo obtendo os dados corretos em formato JSON
- [x] T016 Validar a chamada de logout e constatar a impossibilidade de reuso do token expirado (HTTP 401)
