# Tarefas: Gestão de Usuários

**Input**: Documentos de design de `/specs/003-usuarios/`

**Pré-requisitos**: [plan.md](plan.md) (obrigatório), [spec.md](spec.md) (obrigatório), [research.md](research.md), [data-model.md](data-model.md), [contracts/users-api.md](contracts/users-api.md)

**Organização**: Tarefas retrospectivas mapeando as etapas de codificação que estruturaram o CRUD de usuários no backend, marcadas como concluídas.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: Pode ser executado em paralelo (arquivos diferentes, sem dependência)
- **[Story]**: A qual história de usuário pertence a tarefa (ex.: US1, US2, US3, US4, US5)
- Caminhos exatos dos arquivos estão definidos nas descrições.

---

## Fase 1: Setup (Infraestrutura Compartilhada)

**Objetivo**: Declaração das rotas REST no backend.

- [x] T001 Declarar o grupo de rotas privadas sob prefixo `/v1/users` no arquivo `laravel/routes/api.php`

---

## Fase 2: Fundacional (Prerrequisitos de Bloqueio)

**Objetivo**: Mapeamento e criação das regras de acesso (Policies) e repositórios.

- [x] T002 Implementar autorizações baseadas em cargos no arquivo `laravel/app/Policies/UserPolicy.php`
- [x] T003 Implementar a query otimizada `getAllWithGroup` e injeção do model no repositório `laravel/app/Repositories/UserRepository.php`

---

## Fase 3: User Story 1 - Listagem de Usuários (Prioridade: P1)

**Objetivo**: Retornar a coleção completa de usuários com relacionamento eager-loaded.

- [x] T004 [P] [US1] Utilizar a classe `UserResource.php` para formatar e higienizar a saída de dados da coleção de usuários
- [x] T005 [US1] Adicionar chamada ao método `getAll` do `UserService` e retornar resposta de sucesso no método `index` do controller `laravel/app/Http/Controllers/UserController.php`

---

## Fase 4: User Story 2 - Cadastro de Novo Usuário (Prioridade: P1)

**Objetivo**: Criar novos usuários no banco aplicando regras de validação estritas baseadas em privilégios.

- [x] T006 [P] [US2] Criar a classe de validação customizada `StoreUserRequest.php` aplicando a restrição que proíbe cargos inferiores de atribuir perfis superiores ou grupos corporativos
- [x] T007 [US2] Implementar método `createUser` no service `laravel/app/Services/UserService.php` para criptografar a senha com `Hash::make()`
- [x] T008 [US2] Chamar o service a partir do método `store` no `UserController.php` retornando HTTP 201 Created

---

## Fase 5: User Story 3 - Visualização de Detalhes de um Usuário (Prioridade: P2)

**Objetivo**: Detalhar dados de um cadastro no endpoint `show`.

- [x] T009 [US3] Implementar o método `show` no `UserController.php` fazendo o carregamento da relação `telecomGroup` no model `$user` via `UserService`

---

## Fase 6: User Story 4 - Atualização de Cadastro e Permissões (Prioridade: P1)

**Objetivo**: Atualizar dados de um usuário bloqueando a alteração da sua própria permissão de cargo.

- [x] T010 [P] [US4] Criar a classe de validação customizada `UpdateUserRequest.php` aplicando a restrição que impede a auto-alteração de cargo (`role`)
- [x] T011 [US4] Implementar método `updateUser` no service `laravel/app/Services/UserService.php` tratando a alteração de senhas de forma criptografada
- [x] T012 [US4] Criar o método `update` no `UserController.php` disparando o service e retornando HTTP 200 OK

---

## Fase 7: User Story 5 - Exclusão de Usuário (Prioridade: P2)

**Objetivo**: Deletar o cadastro de um usuário do banco.

- [x] T013 [US5] Adicionar método `delete` no `UserRepository` e implementar chamada de deleção a partir do método `destroy` no controller `laravel/app/Http/Controllers/UserController.php`

---

## Fase 8: Polimento & Validação Geral

**Objetivo**: Execução de rotinas de auditoria manual das chamadas da API.

- [x] T014 Validar chamadas de listagem e criação de usuários via API Client conforme o [quickstart.md](quickstart.md)
- [x] T015 Testar caso de erro ao tentar salvar e-mail duplicado
- [x] T016 Testar caso de erro ao tentar alterar o próprio cargo
- [x] T017 Testar caso de erro ao tentar manipular grupo telecom sem permissão de `super_admin`
