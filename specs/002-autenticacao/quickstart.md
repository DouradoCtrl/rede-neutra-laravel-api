# Quickstart: Validação da Autenticação

Este documento instrui o desenvolvedor sobre como testar e validar os fluxos de autenticação do backend Laravel localmente.

## Testando via API Client (Insomnia ou similar)

### 1. Relaizar Login (POST /api/v1/auth/login)
Envie uma requisição para `http://localhost/api/v1/auth/login` com o seguinte corpo:
```json
{
  "email": "user@example.com",
  "password": "secretpassword",
  "device_name": "teste_local"
}
```
* **Verificação:** A API deve retornar `200 OK` contendo o `token` e dados do `user`. Copie a chave `token`.

### 2. Acessar Rota Protegida Me (GET /api/v1/auth/profile/me)
Envie uma requisição para `http://localhost/api/v1/auth/profile/me` configurando o Header HTTP de autorização:
* **Header:** `Authorization`
* **Valor:** `Bearer <TOKEN_COPIADO_NO_PASSO_1>`
* **Verificação:** A API deve retornar `200 OK` trazendo os dados completos do seu perfil e o `telecom_group` associado.

### 3. Realizar Logout (POST /api/v1/auth/logout)
Envie uma requisição `POST` para `http://localhost/api/v1/auth/logout` contendo o mesmo header de autenticação do passo anterior.
* **Verificação:** A API deve responder `200 OK` informando "Deslogado com sucesso".

### 4. Validar Expiração de Token
Tente enviar novamente a requisição de consulta de perfil (`GET /api/v1/auth/profile/me`) utilizando o mesmo token que foi revogado no passo 3.
* **Verificação:** A API deve retornar o código HTTP `401 Unauthorized` de forma correta, impedindo o acesso.
