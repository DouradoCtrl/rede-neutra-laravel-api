# Pesquisa e Decisões de Arquitetura

Como as restrições arquiteturais e de bibliotecas foram providenciadas explicitamente pelo usuário, este documento apenas sumariza as decisões.

**Decisão**: Gerenciamento de Sessão Seguro (Server-Side)
- **Rationale**: A especificação exige que o token Bearer nunca vaze para o client. Portanto, usaremos Server Actions ou Route Handlers no Next.js (App Router) para armazenar o token provido pela API do Laravel em HttpOnly Cookies criptografados. O lado do cliente fará as requisições para o próprio backend Node.js (Next.js), e este injetará o Bearer Token nas requisições subsequentes ao Laravel.
- **Alternatives considered**: Armazenar no LocalStorage ou Context. (Rejeitado pela premissa de segurança explícita).

**Decisão**: Extração de Device Name
- **Rationale**: Next.js pode inspecionar headers no servidor (`headers().get('user-agent')`) para ler o browser agent e injetá-lo no JSON antes de despachar a chamada para a API do Laravel. 

**Decisão**: Exibição Dinâmica de Erros 422
- **Rationale**: Ao receber o status HTTP 422 da API, o Auth Service devolverá uma exceção estruturada ao client, onde o componente form do Shadcn interceptará e populará o erro especificamente nos campos via a propriedade `errors` interna.
