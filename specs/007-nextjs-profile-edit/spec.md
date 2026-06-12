# Feature Specification: Edição de Perfil e Senha no Frontend

**Feature Branch**: `007-nextjs-profile-edit`

**Created**: 2026-06-12

**Status**: Draft

**Input**: User description: "Route::middleware('auth:sanctum')->group(function () { Route::prefix('auth')->group(function () { Route::post('/logout', [AuthController::class, 'logout']); Route::get('/profile/me', [AuthController::class, 'me']); Route::put('/profile/me', [ProfileController::class, 'update']); Route::put('/profile/password', [ProfileController::class, 'updatePassword']); }); }); Dado essas minhas endpoint da minha api do laravel, eu quero que vc crie no next, na página de perfil, os campos para realizar essas interações."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edição de Dados Pessoais (Priority: P1)

Como usuário autenticado, desejo visualizar meus dados cadastrais (nome e e-mail) e ter a capacidade de editá-los para manter minhas informações pessoais sempre atualizadas.

**Why this priority**: É a funcionalidade primária da tela de perfil, essencial para a atualização dos dados cadastrais básicos do usuário.

**Independent Test**: Pode ser testado acessando a tela `/meu-perfil`, verificando se os campos de Nome e E-mail carregam preenchidos, alterando os valores e clicando em salvar. A alteração deve refletir imediatamente após recarregar.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tela `/meu-perfil`, **When** a interface é carregada, **Then** as informações de nome e e-mail atuais do usuário devem estar preenchidas nos campos de texto correspondentes.
2. **Given** que o usuário alterou seu nome ou e-mail, **When** ele clica no botão "Salvar Perfil", **Then** a requisição deve ser enviada para a API e um alerta de sucesso (toast) deve ser exibido.
3. **Given** que o usuário inseriu dados inválidos (ex: e-mail em branco ou em formato incorreto), **When** ele tenta salvar, **Then** os erros de validação retornados pela API devem ser exibidos de forma clara ao lado/abaixo de cada respectivo campo.

---

### User Story 2 - Alteração de Senha (Priority: P2)

Como usuário autenticado, desejo alterar minha senha de acesso de forma segura para garantir que minha conta continue protegida.

**Why this priority**: É uma funcionalidade de segurança essencial que deve residir na página de perfil para permitir a troca periódica de senhas ou mitigação de acessos suspeitos.

**Independent Test**: Pode ser testado preenchendo os campos de senha atual, nova senha e confirmação, e clicando em "Atualizar Senha".

**Acceptance Scenarios**:

1. **Given** que o usuário deseja alterar sua senha, **When** ele preenche os campos de Senha Atual, Nova Senha e Confirmação de Senha e clica em "Atualizar Senha", **Then** a requisição deve ser enviada à API e um alerta de sucesso (toast) deve ser exibido se a senha antiga for válida.
2. **Given** que o usuário preencheu a Senha Atual incorretamente ou a Nova Senha e Confirmação não coincidem, **When** ele tenta salvar, **Then** os erros de validação retornados pela API devem ser exibidos de forma clara sob os campos correspondentes.

---

### Edge Cases

- **Valores duplicados ou já existentes**: Se o usuário tentar atualizar o e-mail para um endereço que já pertence a outra conta cadastrada no banco de dados, o erro 422 correspondente enviado pelo Laravel deve ser capturado e exibido abaixo do campo E-mail.
- **Interrupção de Rede**: Se a conexão falhar enquanto o usuário tenta salvar, os dados modificados devem permanecer digitados no formulário e uma notificação visual amigável deve informar o erro de conectividade.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir uma interface de formulário para edição de perfil na rota `/meu-perfil`.
- **FR-002**: O formulário de perfil MUST vir pré-preenchido com o nome e e-mail atuais do usuário (obtidos via `GET /api/auth/me`).
- **FR-003**: O sistema MUST fornecer um botão para salvar a alteração de dados pessoais enviando a requisição para `PUT /api/auth/profile/me`.
- **FR-004**: O sistema MUST exibir uma seção ou formulário separado contendo os campos: Senha Atual, Nova Senha e Confirmar Nova Senha.
- **FR-005**: O sistema MUST fornecer um botão para salvar a alteração de senha enviando a requisição para `PUT /api/auth/profile/password`.
- **FR-006**: O sistema MUST exibir as mensagens de erro de validação recebidas da API (ex: erros 422 de e-mail inválido, senha atual incorreta, etc.) diretamente abaixo de seus respectivos campos.
- **FR-007**: O sistema MUST exibir uma notificação global (Sonner toast) indicando sucesso ou erro após a resposta da requisição.
- **FR-008**: O fluxo de comunicação do frontend MUST seguir a arquitetura sequencial: Página (`page.tsx`) ➔ Serviço (`service`) ➔ API do Next.js (BFF / Route Handler) ➔ API do Laravel.
- **FR-009**: A API do Next.js (BFF) MUST atuar estritamente como um proxy seguro, sem realizar validações adicionais locais, delegando toda a validação de regras de negócio ao Laravel e repassando o retorno inalterado.

### Key Entities

- **UserProfile**: Representa os dados cadastrais editáveis do usuário logado (Nome, E-mail).
- **PasswordUpdate**: Parâmetros necessários para a troca de senha (Senha Atual, Nova Senha, Confirmação de Senha).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: As atualizações de perfil ou senha devem ser processadas com feedback visual na tela em menos de 1.5 segundos.
- **SC-002**: 100% das mensagens de validação vindas da API Laravel são exibidas dinamicamente abaixo de seus campos correspondentes sem recarregar a página.
- **SC-003**: A visualização dos dados antigos é limpa e atualizada instantaneamente na interface (como na barra lateral) assim que o usuário salva com sucesso as novas informações.

## Assumptions

- O Laravel possui os endpoints `PUT /api/v1/auth/profile/me` e `PUT /api/v1/auth/profile/password` expostos e configurados sob o middleware de autenticação Sanctum.
- Os componentes visuais da tela de perfil serão criados utilizando os componentes do Shadcn UI (baseados em Radix UI) e estilizados com TailwindCSS.
