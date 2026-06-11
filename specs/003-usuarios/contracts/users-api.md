# Contrato da API: Gestão de Usuários

Este documento especifica a assinatura dos endpoints restritos de gerenciamento de usuários.

## Headers Gerais
Para todos os endpoints abaixo, é necessário informar os seguintes headers:
* `Accept: application/json`
* `Authorization: Bearer <TOKEN_DE_ACESSO>`

---

## 1. Listar Usuários
Retorna a listagem completa de usuários com seus grupos associados.

* **URL:** `/api/v1/users`
* **Método:** `GET`

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Lista de usuários obtida com sucesso.",
  "data": [
    {
      "id": 1,
      "name": "Super Admin",
      "email": "super@example.com",
      "role": "super_admin",
      "telecom_group": null,
      "created_at": "2026-06-11T09:00:00.000000Z",
      "updated_at": "2026-06-11T09:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "Usuário Telecom A",
      "email": "user.a@example.com",
      "role": "user",
      "telecom_group": {
        "id": 1,
        "name": "Grupo Telecom A",
        "slug": "grupo-telecom-a",
        "active": true,
        "created_at": "2026-06-11T09:00:00.000000Z",
        "updated_at": "2026-06-11T09:00:00.000000Z"
      },
      "created_at": "2026-06-11T09:05:00.000000Z",
      "updated_at": "2026-06-11T09:05:00.000000Z"
    }
  ]
}
```

---

## 2. Criar Usuário
Cadastra um novo colaborador na plataforma.

* **URL:** `/api/v1/users`
* **Método:** `POST`

### Corpo da Requisição (JSON Body)
```json
{
  "name": "Novo Usuário",
  "email": "novo@example.com",
  "password": "senha_secreta",
  "role": "user"
}
```

### Resposta de Sucesso (211 Created)
```json
{
  "status": "success",
  "message": "Usuário criado com sucesso.",
  "data": {
    "id": 3,
    "name": "Novo Usuário",
    "email": "novo@example.com",
    "role": "user",
    "telecom_group": null,
    "created_at": "2026-06-11T14:00:00.000000Z",
    "updated_at": "2026-06-11T14:00:00.000000Z"
  }
}
```

---

## 3. Detalhar Usuário
Recupera as informações detalhadas de um cadastro específico.

* **URL:** `/api/v1/users/{user_id}`
* **Método:** `GET`

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Usuário obtido com sucesso.",
  "data": {
    "id": 2,
    "name": "Usuário Telecom A",
    "email": "user.a@example.com",
    "role": "user",
    "telecom_group": {
      "id": 1,
      "name": "Grupo Telecom A",
      "slug": "grupo-telecom-a",
      "active": true
    },
    "created_at": "2026-06-11T09:05:00.000000Z",
    "updated_at": "2026-06-11T09:05:00.000000Z"
  }
}
```

---

## 4. Atualizar Usuário
Altera dados cadastrais de um usuário específico.

* **URL:** `/api/v1/users/{user_id}`
* **Método:** `PUT`

### Corpo da Requisição (JSON Body)
```json
{
  "name": "Nome Atualizado",
  "email": "email.novo@example.com",
  "password": "nova_senha_secreta"
}
```

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Usuário atualizado com sucesso.",
  "data": {
    "id": 2,
    "name": "Nome Atualizado",
    "email": "email.novo@example.com",
    "role": "user",
    "telecom_group": {
      "id": 1,
      "name": "Grupo Telecom A",
      "slug": "grupo-telecom-a",
      "active": true
    },
    "created_at": "2026-06-11T09:05:00.000000Z",
    "updated_at": "2026-06-11T14:10:00.000000Z"
  }
}
```

---

## 5. Excluir Usuário
Deleta permanentemente o registro de um usuário.

* **URL:** `/api/v1/users/{user_id}`
* **Método:** `DELETE`

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Usuário deletado com sucesso.",
  "data": null
}
```
