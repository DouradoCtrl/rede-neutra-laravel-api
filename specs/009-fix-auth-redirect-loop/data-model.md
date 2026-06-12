# Data Model: Estado de Sessão e Cookies

Não há alterações necessárias no esquema do banco de dados (Laravel migrations) para esta funcionalidade. O gerenciamento de dados de sessão envolve apenas o cookie no navegador e o parâmetro de estado na URL.

## Cookies do Cliente

O cookie de autenticação é definido da seguinte forma no BFF do Next.js:

| Nome do Cookie | Tipo | Origem | Escopo | Segurança | Finalidade |
|----------------|------|--------|--------|-----------|------------|
| `auth_token` | String | BFF `/api/auth/login` | `/` | `httpOnly`, `secure` (prod), `sameSite: lax` | Armazena o Bearer token do Laravel Sanctum para autenticação |

No caso de revogação/expiração de token:
- O cookie é limpo configurando seu valor para `""` (vazio) e `expires` para uma data no passado (equivalente a `maxAge: 0`).

## Estados de URL e Redirecionamento

| URL de Destino | Parâmetros | Finalidade | Ação no Cliente |
|----------------|------------|------------|-----------------|
| `/login` | `session_expired=true` | Sinalizar expiração de sessão após erro 401 | Limpar cookie no middleware e exibir Toast informativo |
