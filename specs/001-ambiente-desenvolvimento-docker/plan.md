# Plano de Implementação: Ambiente de Desenvolvimento Docker

**Branch**: `001-ambiente-desenvolvimento-docker` | **Data**: 2026-06-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-ambiente-desenvolvimento-docker/spec.md`

## Resumo

Centralização do ambiente de orquestração local com Docker Compose na raiz do monorepo. O arquivo `docker-compose.dev.yaml` passará a residir no nível raiz, mapeando os volumes do backend a partir da subpasta `./laravel` (para `/var/www` no container) e consumindo credenciais do PostgreSQL dinamicamente a partir de um arquivo `.env` do monorepo, mantendo a persistência física dos dados em `.docker/db/data` e `.docker/redis/data` na raiz.

## Contexto Técnico

**Linguagens/Versões**: PHP 8.4 (via container PHP-FPM), Node.js 22.x (incluso no container PHP), PostgreSQL 16.x (via container oficial do Postgres).

**Dependências Primárias**: Docker (versão 24+), Docker Compose (versão 2.20+).

**Armazenamento (Storage)**: 
* PostgreSQL 16 (volumes persistentes locais em `./.docker/db/data/`).
* Redis (volumes persistentes locais em `./.docker/redis/data/`).

**Testes**: Validação manual das conexões internas de rede e conectividade do PHP/Laravel com o Postgres via comandos Artisan no container.

**Plataforma Alvo**: Máquina local do desenvolvedor (Linux, macOS, Windows via WSL2).

**Tipo de Projeto**: Infraestrutura local e orquestração de ambiente Monorepo.

**Metas de Performance**: Inicialização do docker-compose em menos de 1 minuto (após build/pull inicial de imagens).

**Restrições (Constraints)**: Nenhuma credencial ou senha do banco de dados deve ser declarada de forma estática no arquivo `docker-compose.dev.yaml`. O banco deve ler as variáveis de ambiente a partir do arquivo `.env` local do host.

## Verificação de Princípios (Constitution Check)

*GATE: Deve passar antes do desenvolvimento e ser reavaliado pós-design.*

- **Princípio I (Monorepo):** APROVADO. A movimentação do compose para a raiz do projeto permite a posterior integração do frontend no mesmo ambiente de orquestração.
- **Princípio II (Desacoplamento Laravel):** APROVADO. Mapeamos `./laravel:/var/www` nos containers do PHP e Nginx. Isso impede que os arquivos gerais da raiz do monorepo (como configurações do Git, Spec Kit e futuros frontends) vazem para dentro dos containers do backend.
- **Princípio IV (Segurança via Sanctum/Bcrypt):** APROVADO. A parametrização das senhas do banco PostgreSQL via variáveis de ambiente no `.env` do monorepo remove segredos estáticos do repositório Git.
- **Princípio V (SDD em Português):** APROVADO. Toda a documentação e planos de implementação do Docker estão sendo estruturados em português dentro da pasta de especificação dedicada.

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/001-ambiente-desenvolvimento-docker/
├── plan.md              # Este arquivo
├── research.md          # Pesquisa técnica sobre volumes e parametrização
├── data-model.md        # Mapeamento de variáveis de ambiente e volumes
└── quickstart.md        # Passos de execução e cenários de testes de aceitação
```

### Código Fonte (raiz do repositório)

```text
.env                     # Criado na raiz a partir do .env.example (com credenciais do DB)
.env.example             # Criado na raiz (expondo variáveis do compose)
docker-compose.dev.yaml  # Criado na raiz (novo arquivo de orquestração centralizado)
.docker/                 # Pasta de infraestrutura contendo Dockerfiles e Nginx confs
laravel/                 # Pasta de backend Laravel
└── docker-compose.dev.yaml # REMOVIDO (antigo arquivo da pasta do backend)
```

**Decisão da Estrutura**: Mover o docker-compose.dev.yaml para a raiz do repositório para servir como orquestrador central do monorepo. Montar o diretório host `./laravel` em `/var/www` no container do backend Laravel e utilizar a pasta local `.docker/` para logs e persistência de banco de dados.

## Complexity Tracking

*Nenhuma violação aos princípios identificada. O design propõe simplificação e conformidade.*
