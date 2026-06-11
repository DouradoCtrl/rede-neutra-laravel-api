# Tarefas: Gestão de Grupos Telecom

**Input**: Documentos de design de `/specs/004-telecom-groups/`

**Pré-requisitos**: [plan.md](plan.md) (obrigatório), [spec.md](spec.md) (obrigatório), [research.md](research.md), [data-model.md](data-model.md), [contracts/telecom-groups-api.md](contracts/telecom-groups-api.md)

**Organização**: Tarefas retrospectivas mapeando as etapas de codificação que estruturaram o CRUD de grupos de telecomunicações no backend, marcadas como concluídas.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: Pode ser executado em paralelo (arquivos diferentes, sem dependência)
- **[Story]**: A qual história de usuário pertence a tarefa (ex.: US1, US2, US3, US4, US5)
- Caminhos exatos dos arquivos estão definidos nas descrições.

---

## Fase 1: Setup (Infraestrutura Compartilhada)

**Objetivo**: Registro de rotas REST de grupos de telecomunicações.

- [x] T001 Declarar o grupo de rotas privadas sob prefixo `/v1/telecom-groups` no arquivo `laravel/routes/api.php`

---

## Fase 2: Fundacional (Prerrequisitos de Bloqueio)

**Objetivo**: Proteção de acesso e repositório.

- [x] T002 Criar a barreira de autorização Super Admin `authorizeSuperAdmin()` e injetar nos métodos de processamento em `laravel/app/Http/Controllers/TelecomGroupController.php`
- [x] T003 Criar o repositório `TelecomGroupRepository.php` herdando os métodos CRUD genéricos da `BaseRepository`

---

## Fase 3: User Story 1 - Listagem de Grupos Telecom (Prioridade: P1)

**Objetivo**: Listar os grupos em formato JSON higienizado.

- [x] T004 [P] [US1] Utilizar a classe `TelecomGroupResource.php` para formatar e estruturar as chaves JSON de retorno da listagem
- [x] T005 [US1] Criar chamada ao service `telecomGroupService->getAll` no método `index` do controller e envelopar resposta com `successResponse`

---

## Fase 4: User Story 2 - Cadastro de Grupo Telecom (Prioridade: P1)

**Objetivo**: Cadastrar novos grupos de telecomunicação gerando slugs automaticamente.

- [x] T006 [P] [US2] Criar a classe de validação customizada `StoreTelecomGroupRequest.php` aplicando a obrigatoriedade do nome e unicidade do slug (quando enviado)
- [x] T007 [US2] Implementar método `createGroup` no service `laravel/app/Services/TelecomGroupService.php` integrando o helper de autogeração de slugs `Str::slug()`
- [x] T008 [US2] Chamar o service a partir do método `store` no `TelecomGroupController.php` retornando HTTP 201 Created

---

## Fase 5: User Story 3 - Visualização de Detalhes e Usuários Vinculados (Prioridade: P2)

**Objetivo**: Detalhar um grupo telecom carregando aninhados os usuários vinculados a ele.

- [x] T009 [US3] Implementar o carregamento da relação `users` no model via método `getGroup` do service `laravel/app/Services/TelecomGroupService.php`

---

## Fase 6: User Story 4 - Atualização de Grupo Telecom (Prioridade: P1)

**Objetivo**: Editar campos do grupo telecom validando unicidade de slugs modificados.

- [x] T010 [P] [US4] Criar a classe de validação customizada `UpdateTelecomGroupRequest.php` exigindo a unicidade de slug exceto para o ID do próprio grupo atualizado
- [x] T011 [US4] Criar o método `updateGroup` no service e conectá-lo ao método `update` no `TelecomGroupController.php`

---

## Fase 7: User Story 5 - Exclusão de Grupo Telecom (Prioridade: P2)

**Objetivo**: Remover fisicamente o registro de um grupo telecom do banco de dados.

- [x] T012 [US5] Invocar deleção no repository a partir do método `destroy` no controller `laravel/app/Http/Controllers/TelecomGroupController.php`

---

## Fase 8: Polimento & Validação Geral

**Objetivo**: Validação final de barreiras de segurança e testes de endpoints.

- [x] T013 Validar chamadas de listagem e criação de grupos via API Client conforme o [quickstart.md](quickstart.md)
- [x] T014 Validar barreira de acesso HTTP 403 ao enviar token de usuário comum/admin para os endpoints de telecom-groups
- [x] T015 Testar autogeração de slug ao omitir o campo no payload de criação
