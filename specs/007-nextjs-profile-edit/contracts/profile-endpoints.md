# Contratos de API: Atualização de Perfil e Senha

Este documento descreve as assinaturas das rotas locais de API do Next.js BFF para modificação dos dados de perfil e senha.

## 1. Rota de Proxy: Salvar Dados de Perfil

### Endpoint: `PUT /api/auth/profile/me`
Invocado pela página de perfil para atualizar os dados cadastrais (nome e e-mail).

#### Comportamento Interno
1. Extrai o cookie seguro `auth_token` da requisição do Next.js.
2. Se o cookie não existir, retorna `401 Unauthorized`.
3. Executa requisição `PUT` para `${NEXT_PUBLIC_API_URL}/api/v1/auth/profile/me` injetando o cabeçalho `Authorization: Bearer <token>` e os dados do corpo.
4. Retorna a resposta (erro ou sucesso) do Laravel de forma inalterada para o cliente.

#### Resposta de Sucesso (`200 OK`)
```json
{
  "status": "success",
  "message": "Perfil atualizado com sucesso.",
  "data": {
    "id": 20,
    "name": "NOC Kayros Link Alterado",
    "email": "noc.novo@kayroslink.com.br",
    "role": "super_admin"
  }
}
```

---

## 2. Rota de Proxy: Alterar Senha

### Endpoint: `PUT /api/auth/profile/password`
Invocado pela página de perfil para alterar a senha de acesso do usuário.

#### Comportamento Interno
1. Extrai o cookie seguro `auth_token` da requisição do Next.js.
2. Se o cookie não existir, retorna `401 Unauthorized`.
3. Executa requisição `PUT` para `${NEXT_PUBLIC_API_URL}/api/v1/auth/profile/password` injetando o cabeçalho `Authorization: Bearer <token>` e as senhas do corpo.
4. Retorna a resposta (erro ou sucesso) do Laravel de forma inalterada para o cliente.

#### Resposta de Sucesso (`200 OK`)
```json
{
  "status": "success",
  "message": "Senha atualizada com sucesso."
}
```

#### Resposta de Erro de Validação (`422 Unprocessable Entity`)
```json
{
  "message": "A senha atual incorreta ou as senhas não coincidem.",
  "errors": {
    "current_password": [
      "A senha atual está incorreta."
    ],
    "password": [
      "A nova senha deve ter no mínimo 8 caracteres."
    ]
  }
}
```
