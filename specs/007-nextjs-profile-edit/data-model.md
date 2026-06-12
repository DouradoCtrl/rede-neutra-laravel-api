# Estrutura de Dados e Tipos: Edição de Perfil e Senha

Este documento descreve as estruturas de dados e tipos TypeScript envolvidos nas operações de edição de dados pessoais e alteração de senha no frontend Next.js.

## 1. Atualização de Perfil (Profile Update)

### Endpoint (BFF): `PUT /api/auth/profile/me`
Envia os dados cadastrais atualizados do usuário para a API Laravel.

#### Tipo: `ProfileUpdateData`
```typescript
export interface ProfileUpdateData {
  name: string;
  email: string;
}
```

#### JSON de Requisição (Enviado pelo cliente para o BFF e repassado ao Laravel):
```json
{
  "name": "NOC Kayros Link Alterado",
  "email": "noc.novo@kayroslink.com.br"
}
```

---

## 2. Alteração de Senha (Password Update)

### Endpoint (BFF): `PUT /api/auth/profile/password`
Envia as credenciais de alteração de senha do usuário para a API Laravel.

#### Tipo: `PasswordUpdateData`
```typescript
export interface PasswordUpdateData {
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}
```

#### JSON de Requisição (Enviado pelo cliente para o BFF e repassado ao Laravel):
```json
{
  "current_password": "but1709vd_antiga",
  "password": "but1709vd_nova",
  "password_confirmation": "but1709vd_nova"
}
```
