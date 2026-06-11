# Especificação da Funcionalidade: Autenticação via Laravel Sanctum

**Branch da Feature**: `002-autenticacao`

**Criado em**: 2026-06-11

**Status**: Draft

**Input**: Descrição do usuário: "Fazer a engenharia reversa para documentar a segunda spec da autenticação do laravel sanctum, login, logout e me"

## Cenários de Usuário & Testes *(obrigatório)*

### Story 1 - Autenticação e Geração de Token (Prioridade: P1)

Como usuário do sistema, eu quero realizar o login informando meu e-mail e senha cadastrados, para que eu possa receber um token de acesso seguro (Bearer Token) e consumir as rotas restritas da API.

**Por que esta prioridade**: É a funcionalidade base de segurança da API. Sem o login e a geração de token, nenhuma outra funcionalidade protegida do sistema pode ser acessada.

**Teste Independente**: Pode ser validado enviando uma requisição HTTP `POST` contendo e-mail e senha válidos para o endpoint `/v1/auth/login` e recebendo o token de acesso.

**Cenários de Aceitação**:

1. **Dado** que informo credenciais válidas (e-mail cadastrado e senha correta), **Quando** eu enviar a requisição de login, **Então** o sistema deve retornar um código HTTP 200 OK contendo a chave `token` e os dados do meu perfil de usuário formatados.
2. **Dado** que o e-mail não existe no banco ou a senha está incorreta, **Quando** eu enviar a requisição de login, **Então** o sistema deve retornar um erro HTTP 422 Unprocessable Entity contendo a mensagem de erro específica "As credenciais fornecidas estão incorretas" vinculada ao campo de e-mail.

---

### Story 2 - Revogação de Acesso / Terminar Sessão (Prioridade: P1)

Como usuário autenticado, eu quero realizar o logout do sistema, para que meu token de acesso ativo seja destruído e ninguém mais possa usar o mesmo token para fazer requisições em meu nome.

**Por que esta prioridade**: Garante a segurança e privacidade do usuário, garantindo que sessões finalizadas não fiquem expostas.

**Teste Independente**: Pode ser validado enviando um `POST` para o endpoint `/v1/auth/logout` com o token ativo e depois tentando fazer uma nova requisição usando o mesmo token (que deve falhar).

**Cenários de Aceitação**:

1. **Dado** que possuo um token de acesso válido, **Quando** eu enviar a requisição de logout contendo o token no header `Authorization`, **Então** o sistema deve revogar o token e retornar HTTP 200 com a mensagem "Deslogado com sucesso".
2. **Dado** que o token foi revogado com sucesso, **Quando** eu tentar consumir qualquer rota protegida usando esse mesmo token expirado, **Então** o sistema deve recusar o acesso e retornar HTTP 401 Unauthorized.

---

### Story 3 - Obtenção de Perfil Autenticado (Prioridade: P2)

Como usuário autenticado no sistema, eu quero obter os dados do meu próprio perfil e do meu grupo de telecomunicações vinculado, para que a interface cliente (frontend) possa carregar e exibir minhas permissões e dados na tela.

**Por que esta prioridade**: Fornece os dados necessários para hidratar o estado global de autenticação do frontend (Next.js) após a inicialização da aplicação pelo usuário.

**Teste Independente**: Enviar um `GET` para `/v1/auth/profile/me` com o token Bearer e validar o payload de retorno.

**Cenários de Aceitação**:

1. **Dado** que informo um token válido no header `Authorization`, **Quando** eu enviar uma requisição de consulta de perfil, **Então** o sistema deve retornar HTTP 200 OK com meu `id`, `name`, `email`, `role`, as datas de criação/atualização em formato ISO 8601, além de um objeto `telecom_group` contendo os dados do meu grupo associado.

---

### Casos de Borda (*Edge Cases*)

* **Tokens Ausentes ou Inválidos em Rotas Protegidas:**
  Se um cliente tentar acessar `/logout` ou `/profile/me` sem passar o header `Authorization` ou informando um token que não existe no banco, a API deve interceptar e retornar HTTP 401 Unauthorized com o padrão JSON da aplicação.
* **Formatos de Entrada Inválidos:**
  Se o cliente enviar o e-mail em formato incorreto ou a senha com menos de 8 caracteres no login, a API deve retornar HTTP 422 Unprocessable Entity com as mensagens de validação padrão de campos antes de fazer a busca no banco de dados.

## Requisitos *(obrigatório)*

### Requisitos Funcionais

* **FR-001**: O sistema DEVE fornecer um endpoint público `POST /v1/auth/login` para autenticação.
* **FR-002**: O endpoint de login DEVE exigir os campos `email` (válido e obrigatório) e `password` (string obrigatória com no mínimo 8 caracteres).
* **FR-003**: O sistema DEVE validar se a senha informada corresponde ao hash cadastrado (Bcrypt) do e-mail informado.
* **FR-004**: O sistema DEVE retornar um Bearer Token Sanctum e os dados do usuário autenticado em formato JSON sob sucesso na autenticação.
* **FR-005**: O sistema DEVE fornecer o endpoint protegido `POST /v1/auth/logout` para revogar o token de acesso do usuário.
* **FR-006**: O sistema DEVE fornecer o endpoint protegido `GET /v1/auth/profile/me` que retorna as informações do usuário ativo.
* **FR-007**: A resposta do endpoint `/profile/me` DEVE obrigatoriamente trazer os dados do `telecom_group` associado ao usuário através de carregamento de relacionamento (`load`).

### Entidades Chave

* **User (Usuário)**: Representa o usuário do sistema. Possui os atributos: `id`, `name`, `email`, `password` (hash criptografado), `role` e a relação opcional `telecom_group_id`.
* **TelecomGroup (Grupo de Telecomunicações)**: Representa o grupo empresarial ao qual o usuário está associado. Possui: `id`, `name`, `slug` e `active`.

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

* **SC-001**: A resposta de login bem-sucedido deve possuir latência inferior a 300ms (performance da API).
* **SC-002**: 100% das tentativas de acesso sem token válido às rotas de logout ou me devem ser rejeitadas com código HTTP 401 Unauthorized.
* **SC-003**: O token de acesso destruído na rota de logout deve ser permanentemente inutilizável.
