# Pesquisa e Decisões de Arquitetura: Edição de Perfil e Senha

Este documento consolida as decisões arquiteturais e de design técnico referentes à implementação dos formulários de perfil e senha no frontend Next.js.

## 1. Fluxo de Comunicação do BFF e Delegação de Validações

### Decisão
A API interna do Next.js (BFF Route Handlers) sob `/api/auth/profile/me` e `/api/auth/profile/password` agirá estritamente como um proxy de repasse seguro (*pass-through*). Nenhuma validação de formato de dados de entrada, regras de validação ou de resposta de erro será processada ou duplicada na camada do Next.js BFF. Toda essa responsabilidade será delegada inteiramente à API do Laravel.

### Rationale
Garante conformidade com o princípio de que a lógica de negócios e as regras de persistência residem apenas no backend. Evita duplicidade de validações (ex: validação de e-mail existente, regras de complexidade de senha) entre o frontend Next.js e o backend Laravel. O Next.js BFF apenas extrai o cookie de token, injeta o cabeçalho `Authorization: Bearer <token>`, realiza a requisição ao Laravel e repassa o retorno de sucesso ou erro (ex: 422 Unprocessable Entity) integralmente de volta para a Service e a Página.

### Alternativas Consideradas
- **Validação de Entrada Duplicada no Next.js BFF (Rejeitada)**: Validar formato de e-mail ou senhas vazias no Node.js antes de enviar ao Laravel. Rejeitado porque encarece a manutenção do código caso as regras de validação mudem no Laravel (ex: se o tamanho mínimo da senha mudar no Laravel de 8 para 10 caracteres, o Next.js precisaria ser atualizado e sofrer deploy conjunto).

---

## 2. Interface de Formulários Separados na Mesma Página

### Decisão
Dividir as ações do usuário em dois formulários HTML separados (`<form>`) dispostos na tela `/meu-perfil`:
1. Formulário de Dados Cadastrais (Campos: Nome, E-mail, botão "Salvar Perfil").
2. Formulário de Alteração de Senha (Campos: Senha Atual, Nova Senha, Confirmar Senha, botão "Atualizar Senha").

### Rationale
Permite que o usuário edite apenas suas informações cadastrais (como o nome de exibição) sem a obrigação de digitar sua senha atual. Melhora a segurança e a usabilidade do usuário, isolando os fluxos e seus respectivos estados de erros de validação retornados pelo Laravel.

### Alternativas Consideradas
- **Formulário Único Consolidado (Rejeitada)**: Exigir que o usuário atualize o perfil e altere a senha na mesma submissão. Rejeitado por ser um fluxo de usabilidade ruim, pois forçaria o usuário a saber ou digitar sua senha atual mesmo para apenas atualizar o e-mail/nome.
