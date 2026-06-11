# Quickstart: Validação do CRUD de Grupos Telecom

Este documento descreve os passos para testar e validar o gerenciamento de grupos de telecomunicações no ambiente local.

## Testando via API Client (Exclusivo para Super Admin)

Garanta que as chamadas contenham os seguintes cabeçalhos configurados:
* **Header:** `Authorization: Bearer <TOKEN_DE_ACESSO_SUPER_ADMIN>`
* **Header:** `Accept: application/json`

### 1. Listar Grupos Telecom (GET /api/v1/telecom-groups)
Envie a requisição de listagem.
* **Validação:** A API deve responder `200 OK` trazendo a coleção de grupos cadastrados.

### 2. Cadastrar Grupo Telecom (POST /api/v1/telecom-groups)
Envie o payload JSON:
```json
{
  "name": "Grupo Telecom Teste",
  "active": true
}
```
* **Validação:** Retorno `211 Created`. Observe que o campo `slug` virá autogerado como `grupo-telecom-teste` no retorno, comprovando o funcionamento da lógica de slug automática no backend.

### 3. Visualizar Detalhes e Usuários Vinculados (GET /api/v1/telecom-groups/{id})
Consulte pelo ID criado.
* **Validação:** Retorno `200 OK` trazendo os dados do grupo e o array `users` (contendo usuários que pertencem a essa empresa).

### 4. Atualizar Grupo (PUT /api/v1/telecom-groups/{id})
Envie a requisição de atualização:
```json
{
  "name": "Telecom Nome Novo",
  "slug": "telecom-nome-novo",
  "active": false
}
```
* **Validação:** Retorno `200 OK` aplicando as alterações.

### 5. Excluir Grupo Telecom (DELETE /api/v1/telecom-groups/{id})
Deleta o grupo do banco de dados.
* **Validação:** Retorno `200 OK` com `"Grupo Telecom removido com sucesso."`. Tentar consultar o ID novamente deve retornar `404 Not Found`.

---

## Testando Restrição de Acesso (Outros Perfis)

Configure o cabeçalho `Authorization` com o token de um usuário do tipo `admin` ou `user` comum.
1. Tente disparar a listagem (`GET /api/v1/telecom-groups`).
* **Validação esperada:** A requisição deve ser barrada imediatamente no nível do controller, respondendo `403 Forbidden` com a seguinte mensagem JSON:
  `"Acesso Negado: Apenas a Kayros Link (Super Admin) pode acessar o gerenciamento de Grupos Telecom."`
