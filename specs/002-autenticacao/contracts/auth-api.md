# Contrato da API: Autenticação via Sanctum

Este documento especifica a assinatura dos endpoints de autenticação expostos pelo backend Laravel.

## 1. Login
Realiza a autenticação de um usuário no sistema e gera o Bearer Token.

* **URL:** `/api/v1/auth/login`
* **Método:** `POST`
* **Headers:** 
  * `Accept: application/json`
  * `Content-Type: application/json`

### Parâmetros de Entrada (JSON Body)
```json
{
  "email": "user@example.com",
  "password": "secretpassword",
  "device_name": "tableplus_client"
}
```

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Login realizado com sucesso.",
  "data": {
    "token": "1|laravel_sanctum_token_plain_text_here...",
    "user": {
      "id": 1,
      "name": "João da Silva",
      "email": "user@example.com",
      "role": "admin",
      "telecom_group": {
        "id": 1,
        "name": "Grupo Telecom A",
        "slug": "grupo-telecom-a",
        "active": true,
        "created_at": "2026-06-11T09:00:00.000000Z",
        "updated_at": "2026-06-11T09:00:00.000000Z"
      },
      "created_at": "2026-06-11T09:00:00.000000Z",
      "updated_at": "2026-06-11T09:00:00.000000Z"
    }
  }
}
```

### Resposta de Erro de Credenciais Inválidas (422 Unprocessable Entity)
```json
{
  "message": "As credenciais fornecidas estão incorretas.",
  "errors": {
    "email": [
      "As credenciais fornecidas estão incorretas."
    ]
  }
}
```

---

## 2. Logout
Finaliza a sessão do usuário ativo invalidando o token Bearer enviado na requisição.

* **URL:** `/api/v1/auth/logout`
* **Método:** `POST`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <TOKEN_DE_ACESSO>`

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Deslogado com sucesso",
  "data": null
}
```

### Resposta de Erro sem Token / Token Expirado (401 Unauthorized)
```json
{
  "message": "Unauthenticated."
}
```

---

## 3. Consultar Perfil Autenticado (Me)
Recupera os dados detalhados do usuário associado ao token ativo.

* **URL:** `/api/v1/auth/profile/me`
* **Método:** `GET`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <TOKEN_DE_ACESSO>`

### Resposta de Sucesso (200 OK)
```json
{
  "status": "success",
  "message": "Dados do usuário autenticado obtidos com sucesso.",
  "data": {
    "id": 1,
    "name": "João da Silva",
    "email": "user@example.com",
    "role": "admin",
    "telecom_group": {
      "id": 1,
      "name": "Grupo Telecom A",
      "slug": "grupo-telecom-a",
      "active": true,
      "created_at": "2026-06-11T09:00:00.000000Z",
      "updated_at": "2026-06-11T09:00:00.000000Z"
    },
    "created_at": "2026-06-11T09:00:00.000000Z",
    "updated_at": "2026-06-11T09:00:00.000000Z"
  }
}
```
