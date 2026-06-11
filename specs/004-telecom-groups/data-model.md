# Modelagem de Dados & Regras de Validação: Grupos Telecom

Este documento especifica os modelos e os esquemas estritos de validação do CRUD de grupos de telecomunicações.

## Esquemas de Validação (Form Requests)

### 1. Criação de Grupo Telecom (`StoreTelecomGroupRequest`)

O payload enviado para criação de novos grupos de telecomunicação é submetido às seguintes regras:

| Campo | Validações | Descrição |
|---|---|---|
| `name` | `required`, `string`, `max:255` | Nome fantasia ou razão social do grupo. |
| `slug` | `nullable`, `string`, `max:255`, `unique:telecom_groups,slug` | Identificador de URL exclusivo (se omitido, será gerado automaticamente). |
| `active` | `boolean` (opcional) | Define se o grupo já nasce ativo no sistema. |

---

### 2. Atualização de Grupo Telecom (`UpdateTelecomGroupRequest`)

O payload enviado para a rota de edição segue as seguintes regras de validação:

| Campo | Validações | Descrição |
|---|---|---|
| `name` | `required`, `string`, `max:255` | Nome fantasia ou razão social do grupo. |
| `slug` | `required`, `string`, `max:255`, `unique:telecom_groups,slug,<CURRENT_ID>` | Identificador de URL exclusivo (ignora o ID do próprio grupo editado). |
| `active` | `required`, `boolean` | Estado de atividade atual do grupo. |
