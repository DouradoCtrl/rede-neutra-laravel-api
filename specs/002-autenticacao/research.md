# Research: Arquitetura da Autenticação via Sanctum

Este documento registra as decisões de design arquitetural adotadas para a implementação da autenticação, garantindo total conformidade com os princípios da Constituição do projeto.

## Decisões Técnicas de Design

### 1. Separação Estrita em Camadas (Desacoplamento)
* **Decisão:** Dividir o fluxo de autenticação em quatro camadas lógicas:
  1. **HTTP/Controller (`AuthController`)**: Recebe a requisição HTTP e retorna a resposta formatada sem regras de negócio.
  2. **Validação (`LoginRequest`)**: Valida os tipos e a obrigatoriedade dos parâmetros recebidos na requisição.
  3. **Domínio/Service (`AuthService`)**: Processa a lógica de negócio (validação de credenciais via hash e criação/exclusão de tokens Sanctum).
  4. **Acesso a Dados/Repository (`UserRepository`)**: Gerencia consultas diretas ao banco de dados Eloquent (busca de usuário por e-mail).
* **Motivo:** Facilita a manutenção, testes unitários isolados e evita acoplamento excessivo de lógica de banco e lógica de negócio dentro dos controllers.

### 2. Autenticação Baseada em Tokens (Laravel Sanctum)
* **Decisão:** Utilizar o Laravel Sanctum para emissão de Personal Access Tokens em formato Bearer.
* **Motivo:** Fornece um mecanismo nativo, leve e seguro para autenticação de APIs RESTful que serão consumidas por SPAs ou aplicações SSR (como o Next.js).
* **Alternativas consideradas:** JWT nativo via Tymon JWT. Rejeitado devido à simplicidade e facilidade de integração oferecida nativamente pelo Sanctum na versão atual do Laravel.

### 3. Padronização de Respostas e Formatação (Traits e Resources)
* **Decisão:**
  * Uso de API Resources (`LoginResource` e `UserResource`) para higienizar e estruturar os retornos da API.
  * Uso da trait `ApiResponses` no controller para padronizar o envelope JSON de sucesso (contendo `data`, `message` e `status`).
* **Motivo:** Evita o vazamento de dados internos de models (como hashes de senhas ou colunas obsoletas) para a resposta final consumida pelo frontend.
