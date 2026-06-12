# Quickstart: Validação de Expiração de Sessão e Redirecionamento

Este guia descreve como validar o fluxo de expiração de sessão e prevenção do loop de redirecionamento.

## Pré-requisitos

1. O ambiente de desenvolvimento deve estar rodando (`docker compose -f docker-compose.dev.yaml up -d`).
2. O usuário `noc@kayroslink.com.br` com a senha `but1709vd` deve estar cadastrado.

## Cenário 1: Expiração na Recarga da Página (Server-Side)

### Passo a Passo

1. Abra o navegador e acesse a tela de login em `http://localhost:3000/login`.
2. Efetue o login com o usuário padrão. Você será redirecionado para o dashboard (`http://localhost:3000/dashboard`).
3. Abra o banco de dados do Laravel (PostgreSQL) ou use o tinker/tabela de sessões para excluir o Personal Access Token correspondente a essa sessão:
   - Para deletar todos os tokens do usuário via Laravel Tinker:
     ```bash
     docker compose exec php php artisan tinker
     # Digite no terminal:
     \App\Models\User::where('email', 'noc@kayroslink.com.br')->first()->tokens()->delete();
     ```
4. Atualize a página do dashboard ou navegue para `http://localhost:3000/meu-perfil`.
5. **Resultado Esperado**:
   - A página NÃO deve travar ou entrar em loop.
   - Você deve ser redirecionado instantaneamente para a tela de login.
   - O endereço no navegador deve ser `/login?session_expired=true`.
   - Um alerta (Toast) deve aparecer com a mensagem: *"Sua sessão expirou. Por favor, faça login novamente."*
   - O cookie `auth_token` deve ter sido apagado no navegador (pode ser verificado no DevTools -> Application/Storage -> Cookies).

## Cenário 2: Expiração durante a Navegação Dinâmica (Client-Side)

### Passo a Passo

1. Efetue o login normalmente na aplicação.
2. Acesse a página `http://localhost:3000/meu-perfil` e clique na aba **Sessões**.
3. Pelo terminal ou banco de dados, delete os tokens do usuário (conforme comando no Passo 3 do Cenário 1).
4. No navegador, tente clicar no botão de "Revogar" de qualquer sessão ou tente salvar as alterações do formulário de perfil.
5. **Resultado Esperado**:
   - A chamada de API interceptará o erro 401.
   - O aplicativo redirecionará você para `/login?session_expired=true`.
   - O Toast informativo de sessão expirada será exibido na tela de login.
