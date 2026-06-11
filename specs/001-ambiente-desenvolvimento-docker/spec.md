# Especificação da Funcionalidade: Ambiente de Desenvolvimento Docker

**Branch da Feature**: `001-ambiente-desenvolvimento-docker`

**Criado em**: 2026-06-11

**Status**: Draft

**Input**: Descrição do usuário: "Corrigir a dockerização do backend da api na raiz do monorepo, movendo o docker-compose.dev.yaml e gravando o volume de banco de dados postgres na raiz (.docker/db/data) parametrizado por .env"

## Cenários de Usuário & Testes *(obrigatório)*

### Story 1 - Inicialização do Ambiente Unificado (Prioridade: P1)

Como desenvolvedor, eu quero inicializar o ambiente de desenvolvimento completo a partir da raiz do repositório (monorepo), para que eu possa rodar a API Laravel e o banco de dados PostgreSQL sem ter que acessar pastas internas ou configurar serviços locais.

**Por que esta prioridade**: É o núcleo da funcionalidade. Sem a inicialização unificada e o mapeamento correto dos volumes de código, o ambiente de desenvolvimento fica inoperante.

**Teste Independente**: Pode ser totalmente testado ao rodar `docker compose -f docker-compose.dev.yaml up -d` na raiz do monorepo e acessar a página inicial do Laravel no navegador pelo host.

**Cenários de Aceitação**:

1. **Dado** que estou na raiz do monorepo, **Quando** eu executar o comando `docker compose -f docker-compose.dev.yaml up -d`, **Então** todos os containers (php, nginx, redis, db e mail) devem ser criados e iniciados com sucesso.
2. **Dado** que os containers estão rodando, **Quando** eu acessar a url do Nginx exposta na porta 80, **Then** a aplicação Laravel (localizada na pasta `./laravel`) deve processar a requisição e retornar a resposta correta através do container do PHP-FPM.

---

### Story 2 - Persistência Segura do Banco de Dados (Prioridade: P1)

Como desenvolvedor, eu quero que os dados do meu banco PostgreSQL sejam persistidos na raiz do projeto (no caminho `.docker/db/data/`), para que meu progresso de testes e registros no banco de dados não sejam deletados quando os containers forem reiniciados ou removidos.

**Por que esta prioridade**: Evita a perda recorrente de dados locais de teste, agilizando o desenvolvimento do dia a dia.

**Teste Independente**: Pode ser testado criando uma tabela ou registro fictício no banco, destruindo os containers (`docker compose -f docker-compose.dev.yaml down`), subindo novamente e verificando se o registro ainda existe.

**Cenários de Aceitação**:

1. **Dado** que os containers foram inicializados, **Quando** eu criar dados no banco de dados postgres, **Então** esses dados devem ser gravados localmente na pasta `.docker/db/data/` do host.
2. **Dado** que os dados já foram salvos no volume local, **Quando** eu rodar `docker compose -f docker-compose.dev.yaml down` e depois `docker compose -f docker-compose.dev.yaml up -d`, **Então** o banco deve iniciar recuperando os dados existentes sem perda de informação.

---

### Story 3 - Configuração de Credenciais Dinâmicas via `.env` (Prioridade: P2)

Como desenvolvedor, eu quero configurar as credenciais do banco de dados (usuário, senha, nome do banco) em um arquivo `.env` localizado na raiz do monorepo, para que o docker-compose.dev.yaml leia essas configurações de forma dinâmica sem expor senhas diretamente no repositório do Git.

**Por que esta prioridade**: Aumenta a segurança e flexibilidade do ambiente local, permitindo que cada desenvolvedor personalize suas portas ou credenciais de banco, se necessário.

**Teste Independente**: Pode ser validado alterando as variáveis no `.env` da raiz e verificando se os valores são aplicados no container postgres e se o Laravel consegue se conectar a ele usando a mesma configuração.

**Cenários de Aceitação**:

1. **Dado** que criei o arquivo `.env` na raiz do projeto, **Quando** eu definir as variáveis `DB_DATABASE`, `DB_USERNAME` e `DB_PASSWORD`, **Então** o container de PostgreSQL deve ser inicializado utilizando esses parâmetros.
2. **Dado** que as variáveis foram injetadas no container do banco, **Quando** o Laravel se conectar usando o host `db`, **Então** a autenticação deve ser realizada com sucesso usando as mesmas credenciais do arquivo de ambiente do host.

---

### Casos de Borda (*Edge Cases*)

* **Arquivo `.env` Ausente na Raiz:**
  Se o desenvolvedor tentar subir o Docker Compose sem criar o arquivo `.env` na raiz, o Docker Compose deve emitir um aviso sobre as variáveis vazias e utilizar valores padrão seguros (ex.: `refactorian`) ou falhar de forma clara, orientando o desenvolvedor a copiar o `.env.example`.
* **Portas em Uso no Host:**
  Caso a porta `80` (Nginx), `5432` (Postgres) ou `6379` (Redis) já estejam sendo usadas por processos nativos na máquina do desenvolvedor, as variáveis correspondentes no `.env` do monorepo devem permitir a reconfiguração dessas portas de forma simples para evitar conflitos de binding.

## Requisitos *(obrigatório)*

### Requisitos Funcionais

* **FR-001**: O arquivo de orquestração Docker Compose DEVE ser nomeado como `docker-compose.dev.yaml` e residir na raiz do monorepo.
* **FR-002**: O container do PHP-FPM DEVE mapear a subpasta `./laravel` do host para o diretório `/var/www` do container de forma sincronizada (`cached`).
* **FR-003**: O container Nginx DEVE mapear a subpasta `./laravel` do host para `/var/www` e ler os arquivos de configuração contidos em `.docker/nginx/` na raiz do projeto.
* **FR-004**: O PostgreSQL DEVE persistir a pasta de dados `/var/lib/postgresql/data` do container no caminho `.docker/db/data/` em relação à raiz do monorepo.
* **FR-005**: O Docker Compose DEVE ler as variáveis `DB_DATABASE`, `DB_USERNAME` e `DB_PASSWORD` do arquivo `.env` localizado na raiz do monorepo para configurar as credenciais do PostgreSQL.
* **FR-006**: O container do Redis DEVE persistir seus dados locais no caminho `.docker/redis/data/` do host.

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

* **SC-001**: O ambiente Docker na raiz inicializa com sucesso em menos de 1 minuto (após build dos containers) via `docker compose -f docker-compose.dev.yaml up -d`.
* **SC-002**: 100% das conexões do Laravel com o banco de dados Postgres dentro do container funcionam perfeitamente na primeira tentativa.
* **SC-003**: Nenhuma credencial de banco de dados ou senha local fica codificada de forma estática (*hardcoded*) no arquivo `docker-compose.dev.yaml`.
* **SC-004**: O banco de dados preserva as informações persistidas na pasta `.docker/db/data/` mesmo após a exclusão e recriação dos containers via `docker compose down --volumes`.

## Premissas e Dependências

* **Premissa 1:** O desenvolvedor tem o Docker (versão 24+) e o Docker Compose (versão 2.20+) instalados na máquina host.
* **Premissa 2:** A máquina local possui permissões para criar diretórios e persistir volumes em `.docker/db/data/`.
* **Dependência 1:** O backend Laravel (`laravel/`) deve possuir seu próprio arquivo `.env` com configurações equivalentes (`DB_HOST=db`, `DB_CONNECTION=pgsql` e as credenciais correspondentes) para que a aplicação consiga se comunicar com os containers internos.
