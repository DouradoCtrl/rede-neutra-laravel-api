# Tarefas: Ambiente de Desenvolvimento Docker

**Input**: Documentos de design de `/specs/001-ambiente-desenvolvimento-docker/`

**Pré-requisitos**: [plan.md](plan.md) (obrigatório), [spec.md](spec.md) (obrigatório), [research.md](research.md), [data-model.md](data-model.md)

**Organização**: Tarefas agrupadas por fases e User Stories para implementação e testes independentes de cada entrega.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: Pode ser executado em paralelo (arquivos diferentes, sem dependência)
- **[Story]**: A qual história de usuário pertence a tarefa (ex.: US1, US2, US3)
- Caminhos exatos dos arquivos estão definidos nas descrições.

---

## Fase 1: Setup (Infraestrutura Compartilhada)

**Objetivo**: Inicialização e estrutura básica do ambiente na raiz do monorepo.

- [x] T001 Criar o arquivo `.env.example` na raiz do monorepo contendo os parâmetros de banco de dados (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`)

---

## Fase 2: Fundacional (Prerrequisitos de Bloqueio)

**Objetivo**: Infraestrutura principal que DEVE estar pronta antes da inicialização das User Stories.

**⚠️ CRÍTICO**: Nenhuma tarefa das histórias de usuário pode começar até que esta fase esteja concluída.

- [x] T002 Remover o arquivo antigo de docker-compose em `laravel/docker-compose.dev.yaml`
- [x] T003 Criar o arquivo `docker-compose.dev.yaml` na raiz do monorepo, definindo os serviços básicos (php, nginx, redis, db, mail) e mapeando o volume do backend para `./laravel:/var/www`

**Checkpoint**: Fundação pronta - a implementação das User Stories pode iniciar de forma focada.

---

## Fase 3: User Story 1 - Inicialização do Ambiente Unificado (Prioridade: P1) 🎯 MVP

**Objetivo**: Subir todos os containers integrados a partir do monorepo executando o Laravel FPM em `/var/www` de forma funcional.

**Teste Independente**: Executar `docker compose -f docker-compose.dev.yaml up -d` na raiz e acessar `http://localhost/` retornando a API Laravel.

### Implementação para a User Story 1

- [x] T004 [P] [US1] Criar o arquivo `.env` local na raiz do monorepo a partir do `.env.example`
- [x] T005 [P] [US1] Validar que o arquivo `laravel/.env` possui `DB_HOST=db` e credenciais compatíveis para conexão local da API com o container
- [x] T006 [US1] Ajustar o mapeamento de volumes do Nginx no `docker-compose.dev.yaml` da raiz para ler os confs locais de `.docker/nginx/` e servir `/var/www/public`
- [x] T007 [US1] Executar o build das imagens dos containers para testar a inicialização inicial do Nginx/PHP

**Checkpoint**: A partir daqui, a API Laravel já deve rodar de forma isolada dentro do container FPM na raiz do monorepo.

---

## Fase 4: User Story 2 - Persistência Segura do Banco de Dados (Prioridade: P1)

**Objetivo**: Configurar e testar a persistência física dos volumes do Postgres e do Redis locais.

**Teste Independente**: Inserir registros no banco Postgres, parar o docker compose via `down`, reiniciar via `up` e validar a integridade dos dados.

### Implementação para a User Story 2

- [x] T008 [US2] Mapear o volume físico do PostgreSQL no serviço `db` do `docker-compose.dev.yaml` na raiz para `./.docker/db/data:/var/lib/postgresql/data`
- [x] T009 [US2] Mapear o volume físico do Redis no serviço `redis` do `docker-compose.dev.yaml` na raiz para `./.docker/redis/data:/data`

**Checkpoint**: O ambiente é capaz de reter dados locais sem sofrer perdas entre desligamentos de containers.

---

## Fase 5: User Story 3 - Configuração de Credenciais Dinâmicas via `.env` (Prioridade: P2)

**Objetivo**: Ler dados de acesso do banco de dados a partir das variáveis do `.env` da raiz.

**Teste Independente**: Mudar as credenciais no `.env` da raiz, reiniciar os containers e validar se o banco do Postgres foi recriado com o novo usuário e se o Laravel consegue se autenticar com os novos dados.

### Implementação para a User Story 3

- [x] T010 [US3] Injetar as variáveis de ambiente `POSTGRES_DB=${DB_DATABASE}`, `POSTGRES_USER=${DB_USERNAME}` e `POSTGRES_PASSWORD=${DB_PASSWORD}` no serviço `db` do `docker-compose.dev.yaml` da raiz

---

## Fase 6: Polimento & Validação Geral

**Objetivo**: Testes de ponta a ponta e auditoria final de integridade.

- [x] T011 Rodar o comando `docker compose -f docker-compose.dev.yaml up -d --build` para validar o build final na raiz
- [x] T012 Executar migrations no container para testar conectividade FPM/Postgres: `docker compose -f docker-compose.dev.yaml exec php php artisan migrate`
- [x] T013 Validar passo a passo seguindo os cenários descritos no [quickstart.md](quickstart.md)

---

## Dependências e Ordem de Execução

### Dependências das Fases

* **Setup (Fase 1):** Inicia imediatamente (Sem dependências).
* **Fundacional (Fase 2):** Depende da conclusão da Fase 1 (Setup) — BLOQUEIA a execução das próximas fases.
* **User Stories (Fases 3, 4 e 5):** Dependem da conclusão da Fase Fundacional. Podem prosseguir em paralelo.
* **Polimento (Fase 6):** Depende de todas as tarefas de User Stories estarem concluídas.

---

## Estratégia de Implementação MVP

1. Concluir Fase 1 (Setup) e Fase 2 (Fundacional).
2. Concluir Fase 3 (User Story 1 - Inicialização do ambiente).
3. **Validar MVP:** Certificar-se de que a API Laravel responde em `http://localhost`.
4. Prosseguir para as Fases 4 e 5 (Persistência e Parametrização via `.env`).
5. Rodar a Fase 6 de Validação final.
