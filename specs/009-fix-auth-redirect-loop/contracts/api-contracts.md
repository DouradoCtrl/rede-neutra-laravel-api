# API Contracts: Contratos do BFF (Backend For Frontend)

Documentamos as rotas e respostas do BFF (Next.js Route Handlers) relacionadas à verificação e controle de sessão do usuário.

## 1. Obter Perfil do Usuário
- **Endpoint**: `/api/auth/me`
- **Método**: `GET`
- **Cabeçalhos Requeridos**: Nenhum (consome o cookie `auth_token` diretamente)

### Respostas

#### Sucesso (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Noc Kayros",
    "email": "noc@kayroslink.com.br",
    "role": "admin"
  },
  "message": "Dados do usuário obtidos com sucesso."
}
```

#### Erro - Sessão Inválida ou Expirada (401 Unauthorized)
- **Cabeçalho retornado**: `Set-Cookie: auth_token=; Path=/; Max-Age=0; HttpOnly; ...`
```json
{
  "message": "Falha ao obter perfil do usuário no servidor."
}
```

---

## 2. Listar Tokens de Sessão (Dispositivos Conectados)
- **Endpoint**: `/api/auth/profile/tokens`
- **Método**: `GET`

### Respostas

#### Erro - Sessão Inválida ou Expirada (401 Unauthorized)
- **Cabeçalho retornado**: `Set-Cookie: auth_token=; Path=/; Max-Age=0; HttpOnly; ...`
```json
{
  "message": "Falha ao obter tokens de sessão no servidor."
}
```
*(As rotas `/api/auth/profile/me` [PUT], `/api/auth/profile/password` [PUT] e `/api/auth/profile/tokens/[id]` [DELETE] seguem o mesmo contrato de retorno de status `401` com remoção do cookie no cabeçalho em caso de expiração.)*
