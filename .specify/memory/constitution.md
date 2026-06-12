<!--
Sync Impact Report
- Version change: 1.5.0 → 1.6.0
- List of modified principles:
  - Fluxo de Trabalho Git e Padrões de Commit (Removed the branch separation requirement from GitHub Flow)
- Added sections: N/A
- Removed sections: N/A
- Templates requiring updates: N/A
- Follow-up TODOs: N/A
-->

# Rede Neutra Constitution

## Princípios Arquiteturais e Fundamentos

### I. Arquitetura Monorepo e Separação de Responsabilidades
O repositório é gerenciado como um monorepo, separando de forma clara o backend (API na pasta `laravel/`) do frontend (em Next.js na pasta `next/`). Cada camada mantém suas responsabilidades e versionamento independente, embora compartilhem o ciclo de vida do projeto global.

### II. Design Padrão e Desacoplamento da API (Laravel)
O código no backend Laravel obrigatoriamente segue um fluxo estrito de desacoplamento em camadas:
- **Controllers**: Devem ser mantidos o mais enxuto possível, servindo apenas como receptores das requisições HTTP (`api.php`), delegando toda a lógica de negócios aos Services.
- **Form Requests**: A validação dos dados de entrada (input validation) DEVE ocorrer sempre nos Form Requests customizados e nunca dentro dos Controllers ou Services.
- **Services**: Toda a regra de negócio do domínio da aplicação e orquestração de processos deve residir estritamente nas classes de Service.
- **Repositories**: O acesso e a persistência de dados (lógica do Eloquent) devem estar contidos exclusivamente nas classes Repository, que devem herdar da classe `BaseRepository`. Nunca acesse ou modifique dados do banco diretamente no Controller ou Service sem invocar o Repository apropriado.
- **Resources**: A formatação da saída da API DEVE sempre utilizar API Resources (`JsonResource`) para garantir uma estrutura de resposta higienizada e padronizada, evitando o retorno bruto de Models ou Collections do Eloquent.

### III. Padronização de Respostas HTTP (Traits)
Todas as respostas da API devem obrigatoriamente usar as traits dedicadas, como a `ApiResponses`, para garantir um formato de saída REST uniforme e consistente entre todos os módulos da aplicação (padronizando as mensagens de erro, sucesso, metadados e os respectivos códigos HTTP de estado).

### IV. Segurança e Autenticação (Laravel Sanctum)
Toda a autenticação da aplicação e comunicação entre o frontend e o backend devem ser garantidas utilizando tokens de acesso protegidos gerenciados pelo **Laravel Sanctum**. As senhas devem sempre ser protegidas via mecanismo de criptografia nativo (`Hash::make`/Bcrypt). O middleware de autenticação (`auth:sanctum`) protegerá estritamente as rotas privadas expostas em `api.php`.

### V. Desenvolvimento Orientado a Especificações (SDD)
Nenhuma funcionalidade pode ser implementada diretamente no código. O desenvolvimento deve seguir estritamente o ciclo do Spec Kit (Especificação -> Planejamento Técnico -> Tarefas -> Implementação). As especificações guiarão a implementação arquitetural e toda a documentação técnica deve ser sempre escrita em **Português**.

### VI. Desenvolvimento Frontend Next.js e Segurança
O desenvolvimento da camada de frontend em Next.js deve obrigatoriamente seguir as seguintes diretrizes:
- **Desacoplamento de Componentes (UI)**: O visual do frontend deve ser construído de forma estritamente desacoplada em componentes reutilizáveis, sendo **estritamente necessário** desenvolver utilizando componentes oficiais do **Shadcn UI** (baseados em **Radix UI**) para preservar a consistência e o design UX.
- **Segurança de Tokens**: Devem ser rigorosamente mantidos os mecanismos de segurança implementados (como Cookies HttpOnly) para evitar a exposição e o vazamento do token de API (`auth_token`) no ambiente do cliente (frontend).
- **Camada de Serviços (Services)**: É estritamente proibido realizar chamadas HTTP diretas (como `fetch`, `axios`, etc.) dentro de arquivos de página (`page.tsx`). Toda comunicação entre o frontend e o backend ou APIs externas deve ser encapsulada e orquestrada de forma exclusiva dentro das classes de serviço correspondentes (`services/`), com as páginas consumindo apenas esses serviços.
- **Fluxo de Comunicação Unidirecional (BFF)**: A arquitetura de comunicação deve seguir estritamente o fluxo sequencial: `Página (page.tsx)` ➔ `Serviço (service)` ➔ `API do Next.js (BFF / Route Handler)` ➔ `API do Laravel`.
- **Validação Delegada ao Laravel**: A API do Next.js (BFF) atua apenas como um proxy seguro. Não é necessário realizar validações adicionais de dados ou de resposta na camada da API do Next.js, pois a validação de regras de negócio e de entrada é responsabilidade exclusiva da API do Laravel. As respostas do Laravel (mensagens de erro, validações e dados) devem ser retornadas e repassadas diretamente pelo BFF para o frontend sem alterações.

## Fluxo de Trabalho Git e Padrões de Commit

- **Momento do Commit (Ciclo Completo)**: Os commits só devem ser realizados após a conclusão de todo o ciclo de desenvolvimento da funcionalidade: especificação (SDD), planejamento técnico, definição de tarefas, implementação do código, realização completa de testes e aprovação da usabilidade. Nenhuma alteração deve ser comitada antes de garantir uma entrega eficiente e funcional.
- **Granularidade por Contexto (Commit por Contexto/Funcionalidade)**: As alterações devem ser comitadas de forma agregada por contexto lógico ou funcionalidade, agrupando os arquivos relacionados à mesma modificação em um único commit coerente, otimizando o histórico de alterações e facilitando revisões.
- **Commits Semânticos em Português**: Todas as mensagens de commit devem seguir os padrões do Conventional Commits, escritas inteiramente em português e com descrição curta. Exemplos:
  - `feat: criar UserService.php`
  - `fix: corrigir validação de cpf`
  - `refactor: extrair logica de token para Service`
  - `docs: adicionar spec.md`
  - `test: implementar UserRepositoryTest.php`
  - `chore: ajustar rotas no api.php`

## Governança

- Toda alteração de arquitetura base, como a introdução de um novo padrão que viole a estrutura Service/Repository/Trait, exigirá a atualização formal prévia deste documento.
- Todas as implementações devem estar em conformidade com as restrições acima, e os testes integrados deverão ser desenvolvidos de forma a validar as funcionalidades isoladas nessas camadas.
- As revisões de código devem usar esta constituição como *checkpoint* para evitar vazamento de lógica de negócio para Controllers ou acesso a banco fora de Repositories.

**Versão**: 1.6.0 | **Ratificada**: 2026-06-11 | **Última Atualização**: 2026-06-12
