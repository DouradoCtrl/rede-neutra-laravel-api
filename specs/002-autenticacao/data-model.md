# Modelagem de Dados & Validações

Este documento descreve as estruturas lógicas de dados e validações que regem o fluxo de autenticação.

## Entidades Lógicas

### 1. User (Usuário)
Representa o colaborador ou administrador do sistema.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | Integer / UUID | Identificador exclusivo do usuário |
| `name` | String | Nome completo |
| `email` | String | Endereço de e-mail (usado para login, deve ser exclusivo) |
| `password` | String | Senha do usuário (sempre armazenada como Bcrypt hash) |
| `role` | String | Nível de acesso (ex.: admin, user) |
| `telecom_group_id` | Integer | ID do grupo de telecomunicações associado (chave estrangeira) |
| `created_at` | DateTime | Data de criação do cadastro |
| `updated_at` | DateTime | Data da última alteração de cadastro |

### 2. TelecomGroup (Grupo de Telecomunicações)
Representa a empresa/grupo de telecomunicação ao qual o usuário está vinculado.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | Integer | Identificador exclusivo do grupo |
| `name` | String | Nome fantasia do grupo |
| `slug` | String | Identificador textual amigável para URLs |
| `active` | Boolean | Define se o grupo está ativo no sistema |

---

## Validações de Entrada (Request Validation)

### Login (`LoginRequest`)
Validações obrigatórias que ocorrem antes do processamento das credenciais no banco:

* **`email`**:
  * Obrigatório (`required`)
  * Formato de e-mail válido (`email`)
* **`password`**:
  * Obrigatório (`required`)
  * Tipo String (`string`)
  * Comprimento mínimo de 8 caracteres (`min:8`)
* **`device_name`**:
  * Opcional/Nulável (`nullable`)
  * Tipo String (`string`) (usado para dar nome ao token gerado)
