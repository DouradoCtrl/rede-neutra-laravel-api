# Research: Solução do Loop de Redirecionamento de Sessão Expirada

Nesta pesquisa, documentamos as decisões de design técnico para resolver o loop de redirecionamento infinito que ocorre quando um token de acesso de um usuário logado é excluído ou revogado no banco de dados.

## Decisão de Arquitetura

Implementar uma abordagem híbrida de limpeza e sinalização de sessão:
1. **Sinalização de Expiração no Layout (Server-Side)**: Quando a chamada `userService.getProfile` falhar no layout autenticado (`(authenticated)/layout.tsx`), redirecionar o navegador para `/login?session_expired=true`.
2. **Remoção de Cookie no Middleware/Proxy**: O middleware do Next.js (`proxy.ts`) interceptará requisições para `/login` contendo o parâmetro `session_expired=true` e removerá o cookie `auth_token` definindo sua expiração imediata. Isso impede que o middleware redirecione o usuário de volta para o dashboard (resolvendo o loop).
3. **Tratamento de 401 no Client-Side**: No arquivo de serviço do cliente (`userService.ts`), se qualquer requisição de API BFF falhar com status `401` em tempo de execução, redirecionar imediatamente o navegador via `window.location.href = "/login?session_expired=true"`.
4. **Alerta de Sessão Expirada (Toast)**: O componente de login lerá o parâmetro `session_expired` e exibirá um alerta amigável (Toast) informando sobre o término da sessão.

## Rationale (Justificativa)

- **Limitações do Next.js Server Components**: Modificar cookies em Server Components que estão em fase de renderização de layout gera erro no Next.js (pois os cabeçalhos de resposta já estão parcialmente configurados ou em processo de streaming). O middleware e as rotas de API (Route Handlers) são os únicos locais onde a escrita de cabeçalhos de cookies é permitida e segura.
- **Evitar Chamadas Externas no Middleware**: O middleware do Next.js executa para cada rota estática e dinâmica mapeada. Fazer uma requisição HTTP para o backend Laravel Sanctum dentro de cada execução de middleware degradaria a performance e geraria sobrecarga desnecessária no backend. A validação de token deve continuar ocorrendo no layout e nas chamadas de API do BFF, usando o middleware apenas para limpar o cookie de forma reativa.
- **Fluxo UX Consistente**: O redirecionamento com parâmetro de busca (`?session_expired=true`) é um padrão web clássico, limpo e seguro para sinalizar estados temporários para páginas públicas sem expor informações confidenciais.

## Alternativas Consideradas

### Alternativa 1: Limpeza do Cookie via Javascript no Cliente
- **Descrição**: Deletar o cookie utilizando `document.cookie` no cliente antes de redirecionar.
- **Motivo de Rejeição**: O cookie `auth_token` é configurado com a flag `httpOnly: true` por questões de segurança (prevenção contra ataques XSS). Por conta disso, scripts rodando no navegador não conseguem visualizar, editar ou remover esse cookie.

### Alternativa 2: Validar o Token em cada chamada do Middleware
- **Descrição**: No middleware `proxy.ts`, validar se o token é válido chamando a rota `/api/v1/auth/profile/me` do backend.
- **Motivo de Rejeição**: Performance insatisfatória. Isso adicionaria uma latência de rede adicional (50ms a 150ms) a cada navegação de página do usuário, mesmo em rotas que servem componentes estáticos, além de sobrecarregar a API do Laravel.
