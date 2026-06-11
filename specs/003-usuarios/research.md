# Research: CRUD de Usuários e Autorizações de Policy

Este documento registra as decisões de design adotadas para a implementação da gestão de usuários, com foco especial em segurança e arquitetura em camadas.

## Decisões Técnicas de Design

### 1. Camada de Autorização Dedicada (Laravel Policies)
* **Decisão:** Utilizar o sistema de Policies nativo do Laravel (`UserPolicy`) injetado via `Gate::authorize()` em todos os métodos do `UserController`.
* **Motivo:** Separa a lógica de validação de permissões de acesso da lógica de controle HTTP e de regras de domínio. Permite configurar facilmente quem pode listar, criar, visualizar, atualizar ou deletar usuários com base no cargo (`role`) do usuário autenticado.

### 2. Otimização de Performance na Listagem (Query Eager Loading)
* **Decisão:** Forçar o carregamento do relacionamento `telecomGroup` no repositório (`UserRepository->getAllWithGroup`) via `with('telecomGroup')`.
* **Motivo:** Evita o problema clássico de queries N+1 no banco de dados. Ao carregar a lista de usuários, o Nginx não precisará fazer uma chamada individual ao banco para cada telecom_group associado a cada usuário listado, reduzindo drasticamente o número de conexões ativas e a latência global do endpoint.

### 3. Validação Hierárquica no Form Request
* **Decisão:** Injetar lógicas de verificação dinâmicas baseadas no perfil do usuário autenticado diretamente nas classes de validação (`StoreUserRequest` e `UpdateUserRequest`).
* **Motivo:** Centraliza no request as regras que impedem usuários com cargos inferiores de atribuir privilégios maiores ou de vincular usuários a grupos corporativos restritos. A validação falha no nível inicial do ciclo HTTP, protegendo as camadas de serviço e dados de payloads inconsistentes.
