# Feature Specification: Painel de Gerenciamento de Usuários no Next.js

**Feature Branch**: `011-nextjs-user-management`

**Created**: 2026-06-12

**Status**: Draft

**Input**: User description: "Dado a api do laravel temos estas endpoints: index, store, show, update, delete no UserController... Eu quero que você crie um painel de gerenciamento de usuários no next js, você pode se inspirar no projeto de referência. Crie a nova SPEC"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listagem de Usuários (Priority: P1)

Como usuário administrador ou super-admin, eu quero listar todos os usuários cadastrados no sistema em uma tabela responsiva na rota `/usuarios`, para que eu possa visualizar rapidamente quem tem acesso à plataforma e seus respectivos dados básicos.

**Why this priority**: É a funcionalidade central e o ponto de entrada da tela de gerenciamento de usuários. Sem ela, nenhuma outra ação do CRUD pode ser realizada ou visualizada convenientemente.

**Independent Test**: Acessar o caminho `/usuarios` no navegador com uma conta de administrador e verificar se a tabela exibe a lista de usuários obtida do banco de dados, incluindo as colunas: Nome, E-mail, Cargo e Grupo de Telecomunicações (se houver).

**Acceptance Scenarios**:

1. **Given** que o usuário está autenticado com o cargo `admin` ou `super_admin`, **When** ele navega para `/usuarios`, **Then** o sistema deve fazer a chamada ao BFF, recuperar a lista de usuários e exibi-la de forma estruturada.
2. **Given** que o usuário está logado como um usuário comum (`user`), **When** ele tenta navegar diretamente para `/usuarios`, **Then** o middleware do Next.js deve redirecioná-lo ou a página deve exibir um estado de "Acesso Negado" (HTTP 403).

---

### User Story 2 - Cadastro de Novo Usuário (Priority: P1)

Como usuário administrador ou super-admin, eu quero cadastrar um novo usuário inserindo nome, e-mail, senha e selecionando o cargo (Role), para conceder acesso ao sistema a um novo colaborador.

**Why this priority**: Permite o crescimento e a inclusão de novas credenciais e cargos de forma dinâmica.

**Independent Test**: Clicar no botão "Novo Usuário" na tela `/usuarios`, preencher o formulário com dados válidos, e submeter. O sistema deve fechar o formulário, mostrar um alerta de sucesso e exibir o novo usuário inserido no final da tabela.

**Acceptance Scenarios**:

1. **Given** que o administrador clica em "Novo Usuário", **When** ele insere dados válidos e clica em "Salvar", **Then** a requisição é enviada ao BFF, o usuário é cadastrado no banco do Laravel e a listagem é atualizada com o novo registro.
2. **Given** que o administrador tenta salvar o formulário com um e-mail já em uso ou dados em branco, **When** ele clica em "Salvar", **Then** a API retorna erro 422 e o formulário do Next.js exibe o erro específico abaixo de cada campo respectivo.

---

### User Story 3 - Edição de Usuário Existente (Priority: P1)

Como usuário administrador ou super-admin, eu quero atualizar os dados de um usuário (nome, e-mail, cargo e opcionalmente sua senha) e sua associação a grupos de telecomunicações, para manter os acessos e informações em conformidade.

**Why this priority**: Permite realizar ajustes de segurança ou correções cadastrais a qualquer momento.

**Independent Test**: Clicar no botão de edição de um usuário, alterar o nome ou e-mail, salvar e validar que a tabela e os dados no banco foram atualizados.

**Acceptance Scenarios**:

1. **Given** que o administrador selecionou a opção de editar um usuário, **When** o formulário é carregado com as informações atuais do usuário e ele atualiza o nome, **Then** ao salvar os dados são persistidos na API Laravel e um feedback visual de sucesso é mostrado.
2. **Given** que o administrador está logado e tentando editar seu próprio perfil nesta listagem, **When** ele tenta alterar o seu próprio cargo (`role`), **Then** a API retorna erro 422 e o frontend exibe o aviso "Você não pode alterar o seu próprio nível de permissão".

---

### User Story 4 - Exclusão de Usuários (Priority: P2)

Como usuário administrador ou super-admin, eu quero poder excluir um usuário do sistema para revogar permanentemente o acesso dele à plataforma.

**Why this priority**: Importante para a segurança geral e desligamento de colaboradores, mas pode ser implementada sequencialmente após a criação e listagem básica.

**Independent Test**: Clicar na ação de remoção de um usuário específico na tabela, confirmar no modal de alerta e verificar se ele desaparece da lista.

**Acceptance Scenarios**:

1. **Given** que o administrador deseja excluir um usuário, **When** he clica em "Excluir" e confirma no diálogo, **Then** o sistema envia a requisição HTTP DELETE à API através do BFF, o usuário é excluído e a tabela é atualizada instantaneamente.

---

### Edge Cases

- **Privilégio do campo Grupo Telecom**: Apenas o cargo `super_admin` pode associar ou atualizar o Grupo Telecom de um usuário. Administradores comuns (`admin`) não devem ter acesso a esse campo no formulário de cadastro/edição (o campo deve ficar oculto ou desabilitado).
- **Validação de Cargo (Role)**: O cargo `super_admin` só pode ser atribuído a outros usuários por quem já for `super_admin`. Um usuário `admin` só pode atribuir os cargos `admin` ou `user`. O frontend deve limitar as opções do seletor com base no cargo do usuário atualmente logado.
- **Auto-exclusão**: O usuário administrador atualmente autenticado não deve ser capaz de excluir a si próprio pela listagem geral para evitar o auto-bloqueio. A ação de exclusão para o próprio ID deve estar indisponível ou bloqueada no frontend.
- **Integração Hubsoft**: O campo `codigo_cliente_hubsoft` associado a cada Grupo Telecom (Telecom Parceira) deve ser exclusivo e opcional (para permitir que a telecom "Dona" não tenha código associado ou que o cadastro inicial ocorra sem ele).
- **Admin com Grupo Owner**: Se um usuário com cargo `admin` pertencer ao grupo padrão `owner` (empresa dona), ele deve visualizar e gerenciar apenas os usuários que também pertencem ao grupo `owner` (staff interno). Ele não possui acesso global de `super_admin` e nunca deve visualizar ou alterar usuários pertencentes a outras telecoms parceiras.
- **Telecom Group Obrigatório**: Todo usuário cadastrado deve possuir uma associação a um grupo telecom (`telecom_group_id` NOT NULL), eliminando valores `null` e estados inválidos de limbo no sistema.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST disponibilizar uma página de gerenciamento de usuários na rota protegida `/usuarios`.
- **FR-002**: A listagem de usuários MUST renderizar colunas contendo Nome, E-mail, Cargo e o Grupo Telecom associado.
- **FR-003**: O sistema MUST disponibilizar filtros na listagem: busca textual por Nome/E-mail e filtro por cargo (Role).
- **FR-004**: O sistema MUST expor rotas correspondentes no BFF do Next.js para fazer o proxy seguro das chamadas da API do Laravel:
  - `GET /api/users` ➔ `GET /api/v1/users`
  - `POST /api/users` ➔ `POST /api/v1/users`
  - `GET /api/users/[id]` ➔ `GET /api/v1/users/[id]`
  - `PUT /api/users/[id]` ➔ `PUT /api/v1/users/[id]`
  - `DELETE /api/users/[id]` ➔ `DELETE /api/v1/users/[id]`
- **FR-005**: O formulário de cadastro e edição MUST gerenciar erros de validação retornados pela API Laravel (HTTP 422) e exibi-los nos campos apropriados (Nome, E-mail, Senha, Cargo, etc.).
- **FR-006**: O sistema MUST bloquear no frontend a alteração de cargo e exclusão do próprio usuário atualmente logado.
- **FR-007**: O sistema MUST carregar dinamicamente a listagem de grupos telecom ativos via `GET /api/v1/telecom-groups` apenas se o usuário logado for `super_admin`, disponibilizando a seleção correspondente no formulário de criação/edição.
- **FR-008**: O sistema MUST notificar o usuário administrador em caso de sucesso ou falha de rede utilizando Toasts da biblioteca Sonner.
- **FR-009**: O backend Laravel MUST disponibilizar o campo `codigo_cliente_hubsoft` na tabela `telecom_groups` por meio de uma nova migration.
- **FR-010**: A API de retorno do perfil ou listagem de Telecom Groups MUST expor o campo `codigo_cliente_hubsoft`.

### Key Entities *(include if feature involves data)*

- **User**: O modelo de dados do usuário contendo `id`, `name`, `email`, `role` (super_admin, admin, user) e `telecom_group_id` (NOT NULL).
- **TelecomGroup**: O modelo de grupo telecom associado a um usuário, contendo `id`, `name`, `slug`, `active` e `codigo_cliente_hubsoft`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A tabela de listagem de usuários deve renderizar os dados e estar pronta para interação em menos de 1 segundo em condições de conexões normais.
- **SC-002**: 100% dos erros HTTP 422 retornados pelo Laravel na tentativa de salvar dados duplicados ou inválidos devem ser mapeados aos inputs específicos do formulário em tempo de execução.
- **SC-003**: 100% das tentativas de atribuição ou modificação de Grupo Telecom por usuários que não sejam `super_admin` devem ser impedidas visualmente no frontend antes do envio da requisição.

## Assumptions

- A API do Laravel para listagem de usuários (`GET /api/v1/users`) e seu respectivo UserController já estão totalmente implementados e respondem conforme a especificação `003-usuarios` (acrescidos das adaptações de filtragem por Tenant descritas na especificação, usando o grupo `owner`).
- A API de listagem de grupos telecom (`GET /api/v1/telecom-groups`) está funcional para uso pelo `super_admin`.
- O layout de sidebar do Next.js ([layout.tsx](file:///home/dourado-kayros/kayros-projects/rede-neutra-laravel-api/nextjs/src/app/%28authenticated%29/layout.tsx)) e o middleware do proxy contêm suporte a rotas protegidas sob `/usuarios` e carregam as informações de perfil do usuário logado corretas.
- O design visual da tabela e formulários utilizará componentes oficiais do **Shadcn UI** (Radix) e estilização com **TailwindCSS**.ob `/usuarios` e carregam as informações de perfil do usuário logado corretas.
- O design visual da tabela e formulários utilizará componentes oficiais do **Shadcn UI** (Radix) e estilização com **TailwindCSS**.
