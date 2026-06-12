# Contratos de API: BFF Next.js para Gerenciamento de Usuários

Este documento especifica a assinatura dos endpoints intermediários (BFF) que a interface Next.js consumirá para se comunicar com o Laravel.

Os endpoints BFF requerem o cookie de sessão `auth_token` configurado no navegador (enviado automaticamente).

---

## 1. Listar Usuários
Retorna a listagem de usuários filtrada por escopo (Dona vê tudo, Parceira vê apenas si mesma).

* **URL:** `/api/users`
* **Método:** `GET`

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Lista de usuários obtida com sucesso.",
  "data": [
    {
      "id": 1,
      "name": "NOC Kayros Link",
      "email": "noc@kayroslink.com.br",
      "role": "super_admin",
      "telecom_group": {
        "id": 1,
        "name": "Kayros Link",
        "slug": "owner",
        "active": true,
        "codigo_cliente_hubsoft": null
      }
    },
    {
      "id": 2,
      "name": "Admin Telecom A",
      "email": "admin@telecoma.com.br",
      "role": "admin",
      "telecom_group": {
        "id": 1,
        "name": "Telecom A",
        "slug": "telecom-a",
        "active": true,
        "codigo_cliente_hubsoft": "10025"
      }
    }
  ]
}
```

---

## 2. Criar Usuário
Cadastra um novo usuário no banco de dados.

* **URL:** `/api/users`
* **Método:** `POST`

### Corpo da Requisição (JSON Body)
```json
{
  "name": "Novo Operador",
  "email": "operador@telecoma.com.br",
  "password": "senhaSegura123",
  "role": "user",
  "telecom_group_id": 1
}
```

### Resposta de Sucesso (201 Created)
```json
{
  "status": "success",
  "message": "Usuário criado com sucesso.",
  "data": {
    "id": 3,
    "name": "Novo Operador",
    "email": "operador@telecoma.com.br",
    "role": "user",
    "telecom_group": {
      "id": 1,
      "name": "Telecom A",
      "slug": "telecom-a",
      "active": true,
      "codigo_cliente_hubsoft": "10025"
    }
  }
}
```

### Resposta de Erro de Validação (422 Unprocessable Entity)
```json
{
  "message": "Os dados fornecidos são inválidos.",
  "errors": {
    "email": ["O e-mail já está em uso."]
  }
}
```

---

## 3. Atualizar Usuário
Altera as informações de um usuário.

* **URL:** `/api/users/{id}`
* **Método:** `PUT`

### Corpo da Requisição (JSON Body)
```json
{
  "name": "Novo Operador Alterado",
  "email": "operador.alt@telecoma.com.br",
  "role": "user",
  "password": "", 
  "telecom_group_id": 1
}
```

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Usuário atualizado com sucesso.",
  "data": {
    "id": 3,
    "name": "Novo Operador Alterado",
    "email": "operador.alt@telecoma.com.br",
    "role": "user",
    "telecom_group": {
      "id": 1,
      "name": "Telecom A",
      "slug": "telecom-a",
      "active": true,
      "codigo_cliente_hubsoft": "10025"
    }
  }
}
```

---

## 4. Excluir Usuário
Deleta o usuário da base de dados.

* **URL:** `/api/users/{id}`
* **Método:** `DELETE`

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Usuário deletado com sucesso.",
  "data": null
}
```
