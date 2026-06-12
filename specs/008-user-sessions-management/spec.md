# Feature Specification: Gerenciamento de Sessões de Usuário

**Feature Branch**: `008-user-sessions-management`

**Created**: 2026-06-12

**Status**: Draft

**Input**: User description: "na página de meu perfil do next js, eu quero que você crie uma nova aba chamada sessões essa aba será responsável por exibir os personal acess token daquele usuário autenticado, o objetivo principal é que o próprio usuário consiga saber onde a suas contas estão logadas com sessões ativa.  No laravel vai ser necessário você crie uma endpoint que seja capaz de consultar o personal token daquele usuário autenticado, usuário autenticado não pode ser capaz de ver o personal token de outros usuário. Esse usuário poderá excluir/invalidar o seu próprio personal token, exceto o token que o mesmo utilizava. Vamos criar um plano de implementação se tiver dúvidas me faça perguntas para melhorarmos o plano"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualização de Sessões Ativas (Priority: P1)

Como usuário autenticado, desejo visualizar a lista de dispositivos e sessões onde minha conta está atualmente autenticada para que eu possa monitorar a segurança dos meus acessos.

**Why this priority**: É a funcionalidade central necessária para que o usuário identifique onde seus acessos estão ativos.

**Independent Test**: Acessar a página de perfil (`/meu-perfil`), clicar na aba "Sessões" e verificar se são listados os dispositivos conectados com nome (device), data de criação e data de último uso.

**Acceptance Scenarios**:

1. **Given** que o usuário está na aba "Sessões", **When** a interface é carregada, **Then** o sistema deve listar os tokens de acesso ativo do usuário, exibindo o nome do dispositivo, data de criação e data de último uso.
2. **Given** que o usuário está visualizando a lista, **When** ele identifica a sessão atual por onde está navegando, **Then** essa sessão deve conter um indicador visual distintivo (ex: badge "Sessão Atual" ou "Dispositivo Atual").

---

### User Story 2 - Revogação de Sessão Específica (Priority: P2)

Como usuário autenticado, desejo invalidar/excluir uma sessão ativa específica para que eu possa deslogar remotamente dispositivos suspeitos ou que não utilizo mais.

**Why this priority**: Permite que o usuário aja ativamente na segurança de sua conta ao encerrar acessos de outros dispositivos.

**Independent Test**: Clicar no botão de exclusão de um dispositivo listado (que não seja a sessão atual) e confirmar a exclusão. A sessão deve sumir da lista imediatamente.

**Acceptance Scenarios**:

1. **Given** que o usuário deseja encerrar um acesso remoto, **When** ele clica no botão "Revogar" de um dispositivo (diferente do atual), **Then** o sistema deve solicitar uma confirmação, invalidar o token no backend e atualizar a lista na tela.
2. **Given** a sessão atual de navegação do usuário, **When** ele visualiza a lista de sessões, **Then** o botão de revogação para essa sessão específica deve estar desabilitado ou ocultado, impedindo a auto-exclusão acidental.

---

### User Story 3 - Revogação em Massa de Outras Sessões (Priority: P3)

Como usuário autenticado, desejo invalidar todas as outras sessões de uma única vez para garantir a segurança imediata da minha conta em caso de comprometimento de credenciais.

**Why this priority**: Agiliza a segurança da conta em caso de emergência, sem exigir a exclusão manual item a item.

**Independent Test**: [NEEDS CLARIFICATION: A funcionalidade de revogação em massa de todas as outras sessões é desejada para este incremento?]

**Acceptance Scenarios**:

1. **Given** que o usuário deseja deslogar todos os outros dispositivos, **When** ele clica no botão "Revogar Outras Sessões", **Then** todos os tokens exceto o atual devem ser invalidados no backend e a lista atualizada.

---

### Edge Cases

- **Token da Sessão Atual**: O sistema impede de forma estrita, tanto no frontend quanto no backend, que o usuário revogue o token correspondente à requisição activa. Se o ID do token enviado for igual ao ID do token atual do usuário autenticado no Laravel, a requisição deve retornar `400 Bad Request` com uma mensagem amigável.
- **Sessão Expirada durante a Revogação**: Se o token do usuário for revogado por outra ação ou expirar enquanto ele tenta gerenciar sessões, a chamada de revogação deve retornar `401 Unauthorized` e o frontend deve redirecionar o usuário para a página de login.
- **Tentativa de Acessar Token de Outro Usuário**: O backend deve garantir que a listagem e a revogação filtrem tokens associados exclusivamente ao ID do usuário autenticado. Qualquer tentativa de revogar um token inexistente ou pertencente a outro usuário deve retornar `404 Not Found`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir uma nova aba chamada "Sessões" na interface de perfil em `/meu-perfil`.
- **FR-002**: A aba "Sessões" MUST listar os tokens de acesso ativo do usuário contendo o nome do dispositivo, data de criação e data de último uso.
- **FR-003**: O sistema MUST identificar visualmente a sessão ativa atual do navegador com a etiqueta "Este Dispositivo" ou similar.
- **FR-004**: O sistema MUST fornecer um botão para revogar sessões individuais.
- **FR-005**: O sistema MUST proibir a revogação do token da sessão atual (botão desabilitado na tela e validação de bloqueio no backend).
- **FR-006**: O backend Laravel MUST disponibilizar um endpoint `GET /api/v1/auth/profile/tokens` para listar os tokens do usuário logado.
- **FR-007**: O backend Laravel MUST disponibilizar um endpoint `DELETE /api/v1/auth/profile/tokens/{id}` para revogar um token específico pertencente ao usuário.
- **FR-008**: O Next.js BFF MUST atuar como um proxy seguro para os endpoints de sessão do Laravel.

### Key Entities

- **PersonalAccessToken**: Representa o token de acesso Sanctum (sessão ativa) armazenado no backend, contendo atributos como identificador único, nome do token (nome do dispositivo/User-Agent), data de criação (`created_at`) e data de último uso (`last_used_at`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O carregamento da lista de sessões ativas deve ocorrer em menos de 1.0 segundo.
- **SC-002**: A revogação de uma sessão deve se refletir na interface (removendo o item da lista) em menos de 1.5 segundos após a confirmação.
- **SC-003**: 100% das tentativas de exclusão de tokens de terceiros devem ser bloqueadas no backend e retornar erro de segurança.

## Assumptions

- O Laravel utiliza a biblioteca Sanctum padrão (`Laravel\Sanctum\PersonalAccessToken`) para controle de tokens e sessões da API.
- O campo `name` do token é preenchido com a identificação do dispositivo (como o User-Agent extraído no BFF no momento do login).
- A tabela de tokens possui as colunas padrão `created_at` e `last_used_at` ativas.
