# Especificação da Funcionalidade: Gestão de Grupos Telecom

**Branch da Feature**: `004-telecom-groups`

**Criado em**: 2026-06-11

**Status**: Draft

**Input**: Descrição do usuário: "Mudar para branch main, git pull e criar a branch para documentar telecomgroups assim como feito nas anteriores, criando a spec 004"

## Cenários de Usuário & Testes *(obrigatório)*

### Story 1 - Listagem de Grupos Telecom pelo Super Admin (Prioridade: P1)

Como Super Administrador (Kayros Link), eu quero listar todos os grupos de telecomunicações registrados na plataforma, para que eu possa acompanhar quais grupos empresariais estão ativos no ecossistema de rede neutra.

**Por que esta prioridade**: Funcionalidade base para o monitoramento de empresas clientes da rede.

**Teste Independente**: Enviar um `GET` para `/v1/telecom-groups` com o token ativo de um `super_admin` e verificar a resposta.

**Cenários de Aceitação**:

1. **Dado** que estou autenticado com a permissão de `super_admin`, **Quando** eu enviar a requisição de listagem, **Então** o sistema deve retornar HTTP 200 contendo a lista completa de grupos de telecomunicação em formato JSON.
2. **Dado** que estou autenticado com cargo comum (ex.: `admin` ou `user`), **Quando** eu tentar listar os grupos, **Então** o sistema deve recusar o acesso e retornar HTTP 403 Forbidden com a mensagem "Acesso Negado: Apenas a Kayros Link (Super Admin) pode acessar o gerenciamento de Grupos Telecom."

---

### Story 2 - Cadastro de Grupo de Telecomunicação (Prioridade: P1)

Como Super Administrador, eu quero registrar um novo grupo de telecomunicação na plataforma definindo seu nome, slug e estado de atividade, para habilitar a criação subsequente de usuários associados a esse grupo.

**Por que esta prioridade**: Permite a expansão e entrada de novos parceiros de rede na plataforma.

**Teste Independente**: Enviar um `POST` para `/v1/telecom-groups` com o payload de dados e verificar o registro no banco.

**Cenários de Aceitação**:

1. **Dado** que sou um `super_admin`, **Quando** eu enviar uma requisição com o `name` e opcionalmente `slug` exclusivo, **Então** o sistema deve salvar o grupo e retornar HTTP 201 Created.
2. **Dado** que omito o campo `slug` no cadastro, **Quando** o grupo for persistido, **Então** o sistema deve gerar automaticamente o `slug` textual formatado a partir do nome (ex.: "Telecom Norte" -> "telecom-norte").

---

### Story 3 - Visualização de Detalhes e Relação de Usuários (Prioridade: P2)

Como Super Administrador, eu quero visualizar os detalhes de um grupo de telecomunicação específico incluindo os usuários cadastrados e vinculados a ele, para inspecionar o quadro de colaboradores corporativos desse grupo.

**Por que esta prioridade**: Importante para auditoria interna de colaboradores por parceiro de telecomunicação.

**Teste Independente**: Enviar um `GET` para `/v1/telecom-groups/{id}` e validar se o objeto aninhado `users` é retornado.

**Cenários de Aceitação**:

1. **Dado** que possuo cargo de `super_admin`, **Quando** eu consultar os detalhes de um ID existente, **Então** o sistema deve retornar HTTP 200 contendo os dados do grupo e a coleção de usuários associados carregada de forma aninhada.

---

### Story 4 - Atualização de Grupo Telecom (Prioridade: P1)

Como Super Administrador, eu quero editar o nome, slug ou estado de atividade de um grupo de telecomunicação, para mantê-lo atualizado ou desativar temporariamente o seu acesso.

**Por que esta prioridade**: Permite correções e o bloqueio/desbloqueio administrativo de grupos clientes.

**Cenários de Aceitação**:

1. **Dado** que sou `super_admin`, **Quando** eu enviar novos dados válidos para a rota de edição, **Então** o sistema deve atualizar as informações e retornar HTTP 200 OK.
2. **Dado** que o `slug` informado na edição já está em uso por outro grupo de telecomunicação cadastrado, **Quando** eu tentar salvar, **Então** o sistema deve retornar HTTP 422 informando o conflito de slug.

---

### Story 5 - Exclusão de Grupo Telecom (Prioridade: P2)

Como Super Administrador, eu quero remover permanentemente um grupo de telecomunicação da plataforma.

**Por que esta prioridade**: Exclusão definitiva de parceiros que rescindiram contrato.

**Cenários de Aceitação**:

1. **Dado** que sou `super_admin`, **Quando** eu solicitar a deleção de um grupo existente, **Então** o sistema deve excluí-lo do banco de dados e responder HTTP 200 OK.

---

### Casos de Borda (*Edge Cases*)

* **Bloqueio de Usuários Não Autorizados:**
  Qualquer tentativa de acessar qualquer endpoint do CRUD de `telecom-groups` por usuários com cargo de `admin` ou `user` deve ser barrada imediatamente no nível do controller, sem processar nenhuma consulta de banco e retornando HTTP 403 com a mensagem de segurança.

## Requisitos *(obrigatório)*

### Requisitos Funcionais

* **FR-001**: O sistema DEVE expor rotas privadas protegidas pelo middleware `auth:sanctum` para listar (`GET`), criar (`POST`), detalhar (`GET`), atualizar (`PUT`) e excluir (`DELETE`) grupos sob o prefixo `/v1/telecom-groups`.
* **FR-002**: O sistema DEVE realizar validação explícita em todos os endpoints de grupos para garantir que apenas usuários com cargo `super_admin` prossigam.
* **FR-003**: O endpoint de criação DEVE exigir o campo `name` e aceitar o campo `slug` de forma opcional (se enviado, deve ser único na tabela `telecom_groups`).
* **FR-004**: Se omitido no cadastro, o `slug` DEVE ser gerado automaticamente utilizando a biblioteca de strings do Laravel (`Str::slug`).
* **FR-005**: O endpoint de visualização `GET /v1/telecom-groups/{id}` DEVE obrigatoriamente carregar o relacionamento `users` no model de grupo antes de responder.
* **FR-006**: O endpoint de atualização DEVE exigir os campos `name`, `slug` (único, exceto para si mesmo) e `active` (boolean).

### Entidades Chave

* **TelecomGroup (Grupo de Telecomunicações)**: Entidade principal do CRUD.
* **User (Usuário)**: Entidade associada em formato 1-para-N (um grupo possui muitos usuários).

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

* **SC-001**: 100% das tentativas de acesso às rotas por usuários comuns ou administradores que não sejam `super_admin` são rejeitadas com HTTP 403 Forbidden.
* **SC-002**: A geração automática de slugs na criação do grupo substitui espaços e caracteres especiais por hífens de forma precisa (ex.: "Telecom A & B!" -> "telecom-a-b").
