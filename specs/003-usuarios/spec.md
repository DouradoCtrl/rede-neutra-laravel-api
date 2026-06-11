# Especificação da Funcionalidade: Gestão de Usuários

**Branch da Feature**: `003-usuarios`

**Criado em**: 2026-06-11

**Status**: Draft

**Input**: Descrição do usuário: "Mudar para branch main, git pull e criar nova branch para documentar a spec 003 de usuários com as rotas de listagem, store, show, update, delete no UserController"

## Cenários de Usuário & Testes *(obrigatório)*

### Story 1 - Listagem de Usuários Cadastrados (Prioridade: P1)

Como usuário administrador, eu quero listar todos os usuários cadastrados no sistema juntamente com seus respectivos grupos de telecomunicações, para que eu possa ter uma visão geral dos colaboradores e seus acessos.

**Por que esta prioridade**: Essencial para a navegação do sistema e gerenciamento de acessos no painel administrativo.

**Teste Independente**: Pode ser validado enviando um `GET` para `/v1/users` com o token ativo de um administrador e verificando a lista retornada no formato JSON.

**Cenários de Aceitação**:

1. **Dado** que possuo permissão de visualização global (Policy `viewAny`), **Quando** eu enviar a requisição de listagem, **Então** o sistema deve retornar HTTP 200 contendo uma lista de usuários com dados de perfil e seus grupos associados.
2. **Dado** que não possuo permissão (Policy `viewAny` falha ou token inválido), **Quando** eu enviar a requisição de listagem, **Então** o sistema deve retornar HTTP 403 Forbidden ou HTTP 401 Unauthorized.

---

### Story 2 - Cadastro de Novo Usuário (Prioridade: P1)

Como usuário administrador, eu quero cadastrar um novo usuário no sistema informando seus dados básicos, senha e cargo de atuação, para que ele possa receber credenciais e acessar a aplicação.

**Por que esta prioridade**: Funcionalidade primária do CRUD, responsável por povoar e conceder acesso a novos integrantes na plataforma.

**Teste Independente**: Enviar um `POST` para `/v1/users` com o payload contendo e-mail exclusivo e dados válidos, e verificar se o usuário é criado no banco.

**Cenários de Aceitação**:

1. **Dado** que possuo permissão de criação (Policy `create`), **Quando** eu enviar um payload válido de cadastro contendo e-mail exclusivo e senha de no mínimo 8 caracteres, **Então** o sistema deve criptografar a senha, persistir o cadastro no banco e retornar HTTP 201 Created com os dados do usuário formatados.
2. **Dado** que o e-mail informado já pertence a outro usuário, **Quando** eu enviar a requisição, **Então** o sistema deve rejeitar o cadastro com HTTP 422 Unprocessable Entity informando que o e-mail já está em uso.

---

### Story 3 - Visualização de Detalhes de um Usuário (Prioridade: P2)

Como usuário administrador, eu quero obter os detalhes de um usuário específico do sistema, para que eu possa inspecionar suas configurações de acesso individuais.

**Por que esta prioridade**: Permite o gerenciamento detalhado de um colaborador específico.

**Teste Independente**: Enviar um `GET` para `/v1/users/{id}` informando um ID existente e validar a resposta.

**Cenários de Aceitação**:

1. **Dado** que possuo permissão de visualização (Policy `view`), **Quando** eu requisitar os detalhes de um ID existente, **Então** o sistema deve retornar HTTP 200 contendo os dados higienizados do usuário e a empresa de telecomunicação associada.

---

### Story 4 - Atualização de Cadastro e Regras de Hierarquia (Prioridade: P1)

Como usuário administrador, eu quero atualizar o nome, e-mail, senha ou cargo de um usuário, para manter suas informações e níveis de acesso atualizados.

**Por que esta prioridade**: Permite ajustar permissões dinamicamente e corrigir e-mails e senhas de forma simples.

**Teste Independente**: Enviar um `PUT` para `/v1/users/{id}` e validar se as alterações foram salvas.

**Cenários de Aceitação**:

1. **Dado** que possuo permissão de atualização (Policy `update`), **Quando** eu alterar o e-mail para um valor exclusivo ou a senha para um valor de 8+ caracteres, **Então** o sistema deve persistir as mudanças e retornar HTTP 200 OK.
2. **Dado** que estou atualizando meus próprios dados de perfil, **Quando** eu tentar alterar o meu próprio cargo (`role`), **Então** o sistema deve rejeitar a requisição com HTTP 422 informando "Você não pode alterar o seu próprio nível de permissão".

---

### Story 5 - Exclusão de Usuários (Prioridade: P2)

Como usuário administrador, eu quero excluir um usuário que não faz mais parte da empresa, para que ele perca o acesso à aplicação imediatamente.

**Por que esta prioridade**: Importante para revogação permanente de acessos e conformidade de segurança.

**Cenários de Aceitação**:

1. **Dado** que possuo permissão de exclusão (Policy `delete`), **Quando** eu solicitar a deleção de um usuário existente, **Então** o sistema deve excluí-lo fisicamente do banco de dados e retornar HTTP 200 OK com mensagem de sucesso.

---

### Casos de Borda (*Edge Cases*)

* **Regras de Atribuição de Grupos Telecom por Nível de Usuário:**
  * Apenas usuários autenticados com o cargo de `super_admin` podem associar um novo usuário a um grupo de telecomunicações (`telecom_group_id`).
  * Se um usuário que não seja `super_admin` (ex.: `admin` ou `user`) tentar passar o campo `telecom_group_id` na criação ou edição, a API deve proibir o campo e rejeitar a requisição com HTTP 422 Unprocessable Entity.
* **Hierarquia na Definição de Cargos:**
  * O cargo `super_admin` pode ser atribuído apenas por outros `super_admin`. Usuários administradores normais só podem criar outros administradores ou usuários padrão.

## Requisitos *(obrigatório)*

### Requisitos Funcionais

* **FR-001**: O sistema DEVE fornecer rotas privadas protegidas pelo middleware `auth:sanctum` para listar (`GET`), criar (`POST`), detalhar (`GET`), atualizar (`PUT`) e excluir (`DELETE`) usuários sob o prefixo `/v1/users`.
* **FR-002**: Toda requisição para as rotas de usuários DEVE validar as permissões de acesso usando Laravel Policies correspondentes (`viewAny`, `create`, `view`, `update`, `delete`).
* **FR-003**: O sistema DEVE validar se o e-mail é obrigatório, no formato correto e exclusivo no banco de dados na criação e edição (exceto para o próprio ID na edição).
* **FR-004**: O campo `password` na criação e na edição (quando enviado) DEVE ser obrigatório, string e possuir no mínimo 8 caracteres, sendo criptografado com Bcrypt (`Hash::make`) antes de salvar no banco.
* **FR-005**: O sistema DEVE proibir a alteração do próprio cargo (`role`) pelo usuário autenticado na rota de edição.
* **FR-006**: O sistema DEVE restringir a manipulação e atribuição de `telecom_group_id` exclusivamente para usuários com cargo de `super_admin`.

### Entidades Chave

* **User (Usuário)**: Representa o usuário cadastrado no sistema.
* **TelecomGroup (Grupo de Telecomunicações)**: Representa a associação corporativa do usuário.

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

* **SC-001**: A listagem de usuários deve usar carregamento otimizado de relacionamento (`eager loading` com `with('telecomGroup')`) para mitigar o problema de query N+1, mantendo a performance da rota estável.
* **SC-002**: 100% das tentativas de exclusão ou alteração de privilégios não autorizados pelas rotas privadas devem ser barradas e retornar HTTP 403 Forbidden ou HTTP 422 Unprocessable Entity.
