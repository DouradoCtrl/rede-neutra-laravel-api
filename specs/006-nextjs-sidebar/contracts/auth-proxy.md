# API & Interface Contracts: Sidebar de Navegação

Este documento estabelece o contrato das rotas do Next.js Route Handler que servem como proxy seguro de comunicação com o backend Laravel.

## 1. Rota de Proxy: Obter Usuário Logado

### Endpoint: `GET /api/auth/me`
Invocado pelo frontend Next.js para carregar os detalhes do perfil do usuário autenticado a partir do token contido no cookie.

#### Comportamento Interno
1. Extrai o cookie seguro `auth_token` da requisição do Next.js.
2. Se o cookie não existir, retorna `401 Unauthorized`.
3. Executa uma requisição `GET` para `${NEXT_PUBLIC_API_URL}/api/v1/auth/profile/me` injetando o cabeçalho `Authorization: Bearer <token>`.
4. Repassa o JSON recebido do Laravel de volta para a aplicação cliente.

#### Resposta de Sucesso (`200 OK`)
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao.silva@example.com",
    "role": "admin",
    "telecom_group": {
      "id": 2,
      "name": "Operações SP"
    },
    "created_at": "2026-06-11T12:00:00Z",
    "updated_at": "2026-06-11T12:00:00Z"
  },
  "message": "Dados do usuário autenticado obtidos com sucesso."
}
```

#### Resposta de Erro (`401 Unauthorized`)
```json
{
  "message": "Não autorizado. Token de sessão inválido ou ausente."
}
```

---

## 2. Rota de Proxy: Encerramento de Sessão (Logout)

### Endpoint: `POST /api/auth/logout`
Invocado pelo dropdown do avatar para encerrar a sessão.

#### Comportamento Interno
1. Extrai o cookie `auth_token`.
2. Se existir, executa requisição `POST` para `${NEXT_PUBLIC_API_URL}/api/v1/auth/logout` com `Authorization: Bearer <token>` para invalidar o token no Laravel.
3. Exclui o cookie `auth_token` do navegador setando o tempo de vida do cookie para expirado.
4. Retorna resposta de sucesso.

#### Resposta de Sucesso (`200 OK`)
```json
{
  "success": true,
  "message": "Sessão encerrada com sucesso!"
}
```
