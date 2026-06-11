# Modelagem de Dados & Regras de Validação: Usuários

Este documento especifica os modelos e os esquemas estritos de validação do CRUD de usuários.

## Esquemas de Validação (Form Requests)

### 1. Criação de Usuário (`StoreUserRequest`)

O payload enviado para criação de novos usuários é submetido às seguintes regras:

| Campo | Validações | Descrição |
|---|---|---|
| `name` | `required`, `string`, `max:255` | Nome completo do usuário. |
| `email` | `required`, `string`, `email`, `max:255`, `unique:users,email` | Endereço de e-mail exclusivo no banco. |
| `password` | `required`, `string`, `min:8` | Senha inicial de acesso (mínimo de 8 caracteres). |
| `role` | `required`, `in:allowedRoles` | Cargo atribuído ao usuário (ver restrições de hierarquia abaixo). |
| `telecom_group_id` | `nullable` (para super_admin) ou `prohibited` (outros) | Grupo corporativo (restrito ao super_admin). |

#### Restrição de Hierarquia na Criação:
* Se o criador for um **`super_admin`**: os cargos permitidos no campo `role` são `['super_admin', 'admin', 'user']`. O campo `telecom_group_id` é opcional e deve existir na tabela de grupos.
* Se o criador for um **`admin`** ou outro cargo inferior: os cargos permitidos no campo `role` são restritos a `['admin', 'user']`. O campo `telecom_group_id` é proibido (`prohibited`) e sua presença causará erro de validação.

---

### 2. Atualização de Usuário (`UpdateUserRequest`)

O payload enviado para a rota de edição segue as seguintes regras de validação:

| Campo | Validações | Descrição |
|---|---|---|
| `name` | `required`, `string`, `max:255` | Nome completo. |
| `email` | `required`, `string`, `email`, `max:255`, `unique:users,email,<CURRENT_ID>` | Endereço de e-mail exclusivo (ignora o ID do próprio usuário editado). |
| `password` | `required`, `string`, `min:8` | Nova senha (obrigatória em todas as requisições de edição). |
| `role` | `sometimes`, `in:allowedRoles`, `CustomRoleRule` | Permissão de cargo atualizada. |
| `telecom_group_id` | `nullable` (para super_admin) ou `prohibited` (outros) | Grupo corporativo associado (restrito ao super_admin). |

#### Regra Customizada de Cargo (`CustomRoleRule`):
* Um usuário **não pode alterar a sua própria permissão de cargo**. Caso o ID do usuário sendo atualizado seja o mesmo ID do usuário autenticado e a requisição contenha um cargo diferente do atual, a validação falhará com a mensagem: `"Você não pode alterar o seu próprio nível de permissão."`
