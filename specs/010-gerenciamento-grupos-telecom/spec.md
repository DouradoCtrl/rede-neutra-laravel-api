# Feature Specification: Gerenciamento de Grupos de Telecom (Rede Neutra)

**Feature Branch**: `010-gerenciamento-grupos-telecom`

**Created**: 2026-06-12

**Status**: Draft

**Input**: User description: "gerenciamento de grupos de telecom, nela é onde eu posso cadastrar as minhas telecoms parceiras (rede neutra) e fazer aquele ajuste na minha migration que eu te falei no contexto acima de um atributo extra, chamado codigo_cliente_hubsoft. Por favor faça uma separação clara dessas duas specs"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listagem de Telecoms Parceiras (Priority: P1)

Como usuário `super_admin` (Empresa Dona / Kayros Link), eu quero visualizar a listagem completa de todas as Telecoms parceiras cadastradas no sistema em uma tabela responsiva na rota `/telecom`, exibindo seus dados básicos e o código de cliente Hubsoft, para ter o controle de quem possui acesso à rede neutra.

**Why this priority**: É o ponto de entrada da gestão corporativa das parceiras e a base de visualização para as demais operações do CRUD.

**Independent Test**: Acessar a página `/telecom` logado como `super_admin` e verificar se a tabela renderiza os grupos cadastrados com colunas para ID, Nome, Slug, Status (Ativo/Inativo) e Código Cliente Hubsoft.

**Acceptance Scenarios**:

1. **Given** que o usuário está autenticado com o cargo `super_admin`, **When** ele navega para `/telecom`, **Then** o sistema deve carregar os grupos telecom ativos e inativos a partir do BFF e exibi-los na listagem.
2. **Given** que a tabela de listagem está vazia, **When** a página carrega, **Then** deve exibir um feedback amigável indicando que não há grupos telecom cadastrados.

---

### User Story 2 - Cadastro de Nova Telecom Parceira com Integração Hubsoft (Priority: P1)

Como usuário `super_admin`, eu quero cadastrar uma nova empresa de telecomunicação parceira no sistema informando Nome, Slug (gerado automaticamente ou manual), Status de atividade e seu respectivo Código de Cliente Hubsoft, para integrá-la à plataforma de rede neutra.

**Why this priority**: Permite expandir a rede e cadastrar novos parceiros operacionais que utilizarão o catálogo de clientes integrado futuramente.

**Independent Test**: Clicar no botão "Novo Grupo Telecom", preencher os campos obrigatórios (Nome, Slug) e o campo opcional `codigo_cliente_hubsoft`, salvar e verificar se a nova telecom é adicionada à tabela de listagem.

**Acceptance Scenarios**:

1. **Given** que o formulário está aberto, **When** o administrador preenche com um nome exclusivo e um código de cliente Hubsoft e clica em "Salvar", **Then** a requisição é enviada ao BFF/Laravel, persistida no banco de dados e um alerta de sucesso (Toast) é exibido.
2. **Given** que o código de cliente Hubsoft informado já está em uso por outra telecom, **When** o administrador tenta salvar, **Then** o backend retorna HTTP 422 e o frontend exibe a mensagem de validação abaixo do campo correspondente.

---

### User Story 3 - Edição de Telecom Parceira (Priority: P1)

Como usuário `super_admin`, eu quero atualizar as informações cadastrais de uma telecom parceira, bem como alterar o seu status (Ativo/Inativo) ou seu código de cliente Hubsoft, para refletir alterações cadastrais ocorridas na parceria.

**Why this priority**: Importante para manter as integrações corretas e para ativar/desativar parceiros dinamicamente.

**Independent Test**: Clicar na ação de editar em uma telecom existente, alterar o código Hubsoft ou o status de atividade, salvar e validar se as mudanças foram persistidas no banco e atualizadas na listagem.

**Acceptance Scenarios**:

1. **Given** que a telecom parceira possui dados cadastrados, **When** o administrador altera seu status para inativo e salva, **Then** as alterações são salvas na API Laravel e refletidas na listagem com o indicador visual correspondente.

---

### User Story 4 - Restrição de Acesso Multi-tenant (Priority: P1)

Como usuário com cargo de `admin` (administrador local parceiro) ou `user` (operador), eu **não** devo conseguir acessar a rota `/telecom` nem interagir com os endpoints de grupos de telecomunicações no BFF/Laravel, para manter a segurança geral e isolamento entre parceiros.

**Why this priority**: É um requisito de segurança crítico que previne que empresas parceiras visualizem dados cadastrais ou códigos de integração de outros concorrentes na rede neutra.

**Independent Test**: Efetuar login como `admin` de uma telecom parceira, tentar digitar na barra de navegação o endereço `/telecom` e verificar se o sistema bloqueia o acesso (redirecionando ou exibindo página de erro de permissão).

**Acceptance Scenarios**:

1. **Given** que o usuário autenticado não possui o cargo `super_admin`, **When** ele tenta acessar a página `/telecom`, **Then** ele deve ser bloqueado com uma página de "Não Autorizado" (HTTP 403) ou redirecionado para o `/dashboard`.
2. **Given** que um usuário não autenticado tenta acessar a rota BFF `/api/telecom-groups`, **When** ele envia a requisição HTTP, **Then** a API retorna HTTP 401/403.

---

### Edge Cases

- **Unicidade do Código Hubsoft**: O campo `codigo_cliente_hubsoft` deve ser único na tabela `telecom_groups` para evitar ambiguidades de integração. A validação do Laravel deve barrar duplicidades (retornando HTTP 422) e o frontend deve reportar o erro no campo adequado.
- **Validação de Slug**: O slug deve ser exclusivo e formatado em kebab-case (ex: `parceira-telecom-a`). Se inserido manualmente ou gerado com base no nome, a API deve rejeitar slugs duplicados.
- **Desativação do Grupo e Acesso dos Usuários**: Usuários vinculados a um grupo telecom inativo perderão permissões operacionais na plataforma (o sistema de login/autenticação deve rejeitar chamadas se o grupo associado não for ativo. *Nota: A implementação da restrição de login de usuários inativos é um edge case desta especificação*).
- **Grupo Owner Protegido**: O grupo `owner` padrão é um registro protegido do sistema. Ele não deve poder ser excluído ou desativado pela interface `/telecom` para evitar que a empresa dona perca acessos administrativos e de staff.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O backend Laravel MUST disponibilizar uma migration para adicionar o campo `codigo_cliente_hubsoft` (string, nullable, unique) na tabela `telecom_groups`.
- **FR-002**: O model `TelecomGroup` no Laravel MUST incluir `codigo_cliente_hubsoft` em seus atributos fillable e expô-lo em sua representação de Resource.
- **FR-003**: O backend Laravel MUST validar a unicidade e formato do campo `codigo_cliente_hubsoft` nas requisições de criação e atualização de grupos telecom.
- **FR-004**: O frontend Next.js MUST expor a tela de gerenciamento de empresas parceiras na rota protegida `/telecom`.
- **FR-005**: O sistema MUST restringir o acesso à rota `/telecom` e aos seus endpoints BFF exclusivamente para usuários autenticados com o cargo de `super_admin`.
- **FR-006**: A listagem de Telecoms MUST exibir as colunas: Nome, Slug, Status (Ativo/Inativo) e o Código Cliente Hubsoft.
- **FR-007**: O sistema MUST expor rotas correspondentes no BFF do Next.js para fazer o proxy das requisições para a API do Laravel:
  - `GET /api/telecom-groups` ➔ `GET /api/v1/telecom-groups`
  - `POST /api/telecom-groups` ➔ `POST /api/v1/telecom-groups`
  - `GET /api/telecom-groups/[id]` ➔ `GET /api/v1/telecom-groups/[id]`
  - `PUT /api/telecom-groups/[id]` ➔ `PUT /api/v1/telecom-groups/[id]`
  - `DELETE /api/telecom-groups/[id]` ➔ `DELETE /api/v1/telecom-groups/[id]`
- **FR-008**: O formulário de cadastro e edição de Telecoms MUST exibir o campo de texto para preenchimento de `codigo_cliente_hubsoft` e tratar erros HTTP 422 de validação.
- **FR-009**: O sistema MUST notificar o usuário administrador sobre o resultado das ações via alertas visuais (Toasts da biblioteca Sonner).
- **FR-010**: O backend Laravel MUST garantir a criação do grupo padrão `owner` (Nome: Kayros Link, Slug: owner, Active: true) através de seeder e migration de dados iniciais.
- **FR-011**: O backend Laravel MUST configurar a coluna `telecom_group_id` na tabela `users` como `NOT NULL` (com chave estrangeira vinculando os usuários à tabela `telecom_groups`), associando o usuário padrão `noc@kayroslink.com.br` ao grupo `owner`.

### Key Entities *(include if feature involves data)*

- **TelecomGroup**: Entidade principal que representa a empresa parceira. Possui `id`, `name`, `slug`, `active` e `codigo_cliente_hubsoft`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O linter e os testes estáticos do frontend devem rodar sem erros após a integração dos novos componentes de formulário e da rota `/telecom`.
- **SC-002**: 100% das tentativas de acesso à rota `/telecom` ou chamadas de API BFF por usuários sem cargo de `super_admin` devem ser bloqueadas com HTTP 403 Forbidden ou redirecionamento imediato.
- **SC-003**: A tabela de listagem de telecoms deve renderizar e estar interativa em menos de 1.2 segundos após o carregamento da página sob condições de rede normais.

## Assumptions

- A API Laravel para gerenciamento de Telecom Groups (`/api/v1/telecom-groups`) com suporte a index, store, show, update e delete já está disponível e responde conforme especificado no contrato anterior, necessitando apenas da adição da coluna Hubsoft e respectivas validações.
- As Policies do Laravel (`TelecomGroupPolicy`) já estão criadas e restringem a manipulação de grupos apenas a administradores globais (`super_admin`).
- Os componentes visuais utilizarão a biblioteca do Shadcn UI (Radix) e estilização TailwindCSS.
