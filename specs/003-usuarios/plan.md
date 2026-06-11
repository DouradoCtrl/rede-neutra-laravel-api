# Plano de Implementação Retrospectivo: Gestão de Usuários

**Branch**: `003-usuarios` | **Data**: 2026-06-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-usuarios/spec.md`

## Resumo

Mapeamento e documentação retrospectiva do CRUD completo de usuários da API Rede Neutra. O backend utiliza autorizações baseadas em Laravel Policies (`UserPolicy`) aplicadas nos controllers, validações de requisição estritas via Form Requests (`StoreUserRequest` e `UpdateUserRequest`), orquestração do domínio via classe `UserService`, isolamento de queries no `UserRepository` e envelopamento uniforme das respostas HTTP.

## Contexto Técnico

**Linguagens/Versões**: PHP 8.4+, Laravel 11+.

**Dependências Primárias**: Framework Laravel (Eloquent ORM, Policies, Form Requests).

**Armazenamento (Storage)**: PostgreSQL (persistência de registros cadastrais na tabela `users`).

**Testes**: Testes automatizados via Pest PHP no backend Laravel cobrindo o CRUD de usuários e restrições de permissão/hierarquia, além de verificação manual.

**Plataforma Alvo**: API REST com dados em JSON consumida de forma desacoplada por clientes web.

**Restrições (Constraints)**: Otimização de queries para evitar loops N+1; Bloqueio estrito para evitar que usuários editem o próprio cargo (`role`) ou manipulem grupos de telecomunicações corporativos se não forem `super_admin`.

## Verificação de Princípios (Constitution Check)

*GATE: Atendido de forma retrospectiva com o código atual.*

- **Princípio I (Monorepo):** APROVADO. O código e as classes estão integralmente contidos dentro de `laravel/app/`.
- **Princípio II (Desacoplamento Laravel):** APROVADO.
  - Controller (`UserController`) livre de regras de negócio ou lógica de banco de dados.
  - Validações complexas de hierarquia isoladas nos requests (`StoreUserRequest` e `UpdateUserRequest`).
  - Fluxo de domínio concentrado em `UserService`.
  - Abstração e encapsulamento das queries do banco de dados contidos no `UserRepository` (herdando de `BaseRepository`).
  - Retornos padronizados através de `UserResource` e `TelecomGroupResource`.
- **Princípio III (Traits de ApiResponse):** APROVADO. O controller responde uniformemente disparando `successResponse` oriunda da trait do sistema.
- **Princípio IV (Segurança):** APROVADO. Todas as rotas de usuários exigem autenticação ativa via Sanctum e são guardadas por Policies de segurança.
- **Princípio V (SDD em Português):** APROVADO. Toda a documentação e mapeamento técnico estruturados em português.

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/003-usuarios/
├── plan.md              # Este arquivo
├── research.md          # Análise de autorização e query eager loading
├── data-model.md        # Atributos de dados e validações do Store/Update
├── quickstart.md        # Cenários de validação e rotinas do CRUD
└── contracts/
    └── users-api.md     # Assinatura dos endpoints do CRUD de usuários
```

### Código Fonte Mapeado (subpasta laravel)

```text
laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── UserController.php      # Controller com index, store, show, update, destroy
│   │   ├── Requests/
│   │   │   ├── StoreUserRequest.php    # Validação e restrição de criação
│   │   │   └── UpdateUserRequest.php    # Validação e restrição de edição
│   │   └── Resources/
│   │       ├── UserResource.php        # Formata o perfil de usuário
│   │       └── TelecomGroupResource.php # Formata o grupo corporativo associado
│   ├── Policies/
│   │   └── UserPolicy.php              # Regras de autorização por cargo
│   ├── Repositories/
│   │   ├── BaseRepository.php          # Abstração de persistência genérica
│   │   └── UserRepository.php          # Queries otimizadas (eager loading)
│   └── Services/
│       └── UserService.php             # Orquestrador da lógica de usuários
└── routes/
    └── api.php                         # Rotas registradas sob middleware auth:sanctum
```

**Decisão de Estrutura**: A arquitetura obedece rigorosamente às convenções do Laravel com injeção de dependências do Service/Repository no Controller, mantendo a responsabilidade isolada de cada camada.

## Testes Automatizados

Foram criados testes automatizados de funcionalidade usando Pest PHP no backend Laravel:
* **Arquivo de Testes**: [UserTest.php](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/laravel/tests/Feature/UserTest.php)
* **Cenários testados**:
  * Listagem geral de usuários permitida para `super_admin`.
  * Listagem restrita ao mesmo grupo de telecomunicações do `admin` logado (via escopo global da trait `BelongsToTelecomGroup`).
  * Bloqueio de listagem de usuários para cargo comum `user` (HTTP 403).
  * Criação de usuário definindo grupo e qualquer cargo por `super_admin`.
  * Criação de usuário por `admin` restrita ao próprio grupo (telecom_group_id proibido na requisição e herdado automaticamente via trait) e cargo igual ou inferior.
  * Visualização de qualquer usuário por `super_admin` e restrita ao mesmo grupo por `admin` (retornando HTTP 404 para grupos diferentes devido ao escopo global).
  * Atualização de qualquer usuário por `super_admin`.
  * Atualização de usuário do mesmo grupo por `admin`, e bloqueio de atualização para super_admin ou outro grupo.
  * Impossibilidade de o usuário alterar o próprio cargo/role.
  * Remoção de outros usuários por `super_admin`, com bloqueio de auto-exclusão.
  * Remoção de usuários do mesmo grupo por `admin` (bloqueio para outros grupos ou super_admins).
