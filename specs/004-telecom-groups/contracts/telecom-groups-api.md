# Contrato da API: Gestão de Grupos Telecom

Este documento especifica a assinatura dos endpoints restritos de gerenciamento de grupos de telecomunicações.

## Headers Gerais
Para todos os endpoints abaixo, é necessário informar os seguintes headers:
* `Accept: application/json`
* `Authorization: Bearer <TOKEN_DE_ACESSO_SUPER_ADMIN>`

---

## 1. Listar Grupos Telecom
Retorna a listagem completa de grupos de telecomunicações do sistema.

* **URL:** `/api/v1/telecom-groups`
* **Método:** `GET`

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Lista de grupos telecom obtida com sucesso.",
  "data": [
    {
      "id": 1,
      "name": "Grupo Telecom A",
      "slug": "grupo-telecom-a",
      "active": true,
      "created_at": "2026-06-11T09:00:00.000000Z",
      "updated_at": "2026-06-11T09:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "Grupo Telecom B",
      "slug": "grupo-telecom-b",
      "active": false,
      "created_at": "2026-06-11T09:05:00.000000Z",
      "updated_at": "2026-06-11T09:05:00.000000Z"
    }
  ]
}
```

### Resposta de Erro para Não Super-Admin (403 Forbidden)
```json
{
  "message": "Acesso Negado: Apenas a Kayros Link (Super Admin) pode acessar o gerenciamento de Grupos Telecom."
}
```

---

## 2. Criar Grupo Telecom
Cadastra uma nova empresa de telecomunicação na plataforma.

* **URL:** `/api/v1/telecom-groups`
* **Método:** `POST`

### Corpo da Requisição (JSON Body)
```json
{
  "name": "Nova Telecom",
  "slug": "nova-telecom",
  "active": true
}
```

### Resposta de Sucesso (201 Created)
```json
{
  "status": "success",
  "message": "Grupo telecom criado com sucesso.",
  "data": {
    "id": 3,
    "name": "Nova Telecom",
    "slug": "nova-telecom",
    "active": true,
    "created_at": "2026-06-11T14:00:00.000000Z",
    "updated_at": "2026-06-11T14:00:00.000000Z"
  }
}
```

---

## 3. Detalhar Grupo Telecom
Recupera as informações de um grupo e a relação de usuários associados a ele.

* **URL:** `/api/v1/telecom-groups/{id}`
* **Método:** `GET`

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Grupo telecom obtido com sucesso.",
  "data": {
    "id": 1,
    "name": "Grupo Telecom A",
    "slug": "grupo-telecom-a",
    "active": true,
    "users": [
      {
        "id": 2,
        "name": "Usuário Telecom A",
        "email": "user.a@example.com",
        "role": "user"
      }
    ]
  }
}
```

---

## 4. Atualizar Grupo Telecom
Altera dados cadastrais de um grupo específico.

* **URL:** `/api/v1/telecom-groups/{id}`
* **Método:** `PUT`

### Corpo da Requisição (JSON Body)
```json
{
  "name": "Telecom Nome Alterado",
  "slug": "telecom-nome-alterado",
  "active": false
}
```

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Grupo telecom atualizado com sucesso.",
  "data": {
    "id": 1,
    "name": "Telecom Nome Alterado",
    "slug": "telecom-nome-alterado",
    "active": false
  }
}
```

---

## 5. Excluir Grupo Telecom
Deleta permanentemente o registro de um grupo de telecomunicações do banco de dados.

* **URL:** `/api/v1/telecom-groups/{id}`
* **Método:** `DELETE`

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Grupo Telecom removido com sucesso.",
  "data": null
}
```
