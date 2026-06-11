# Quickstart: Validação do CRUD de Usuários

Este documento instrui o desenvolvedor sobre como validar as operações do CRUD de usuários via chamadas HTTP locais.

## Testando os Endpoints Restritos

Para realizar qualquer teste abaixo, garanta que obteve o token de acesso Bearer no login e o configurou no header da requisição:
* **Header:** `Authorization: Bearer <TOKEN>`
* **Header:** `Accept: application/json`

### 1. Listar Usuários (GET /api/v1/users)
Envie a requisição de listagem.
* **Validação:** A API deve retornar status `200 OK` e um array contendo os usuários. Verifique se o objeto `telecom_group` vem preenchido de forma aninhada nos usuários que pertencem a grupos.

### 2. Criar Usuário (POST /api/v1/users)
Envie o payload com e-mail não registrado:
```json
{
  "name": "João Colaborador",
  "email": "joao.colab@example.com",
  "password": "senha_forte_teste",
  "role": "user"
}
```
* **Validação:** A resposta deve ser `201 Created` e retornar o novo registro gerado.

### 3. Exibir Detalhes (GET /api/v1/users/{id})
Requisite pelo ID do usuário recém-criado.
* **Validação:** Retorno `200 OK` com dados detalhados.

### 4. Atualizar Usuário (PUT /api/v1/users/{id})
Envie a requisição de atualização para o ID criado:
```json
{
  "name": "João Editado",
  "email": "joao.colab@example.com",
  "password": "nova_senha_forte"
}
```
* **Validação:** Retorno `200 OK` com os novos dados persistidos.

### 5. Excluir Usuário (DELETE /api/v1/users/{id})
Envie a requisição de exclusão para o ID.
* **Validação:** Retorno `200 OK` com `"Usuário deletado com sucesso."`. Tentar consultá-lo novamente deve retornar `404 Not Found`.
