# Data Model & Environment Variables

Este documento detalha o modelo lógico de variáveis de ambiente e volumes de dados estruturados para a infraestrutura do monorepo.

## Variáveis de Ambiente (Configuração local da raiz)

As variáveis abaixo devem ser inseridas no arquivo `.env` localizado na raiz do monorepo. O Docker Compose irá ler estas variáveis para configurar os serviços de banco de dados.

| Variável | Descrição | Valor Padrão (Sugestão) |
|---|---|---|
| `DB_DATABASE` | Nome do banco de dados relacional PostgreSQL | `refactorian` |
| `DB_USERNAME` | Nome do usuário administrador do banco | `refactorian` |
| `DB_PASSWORD` | Senha de acesso ao banco PostgreSQL | `refactorian` |

> **Importante:** Estas mesmas credenciais devem corresponder às cadastradas no `.env` interno do Laravel (`laravel/.env`) para que a aplicação consiga se autenticar nos containers.

## Volumes Locais Persistentes

Para garantir que os dados não sejam apagados durante reinicializações, os containers usarão os seguintes mapeamentos físicos no host (em relação à raiz do monorepo):

```text
raiz/
└── .docker/
    ├── db/
    │   └── data/        # Persistência física de dados do PostgreSQL 16
    └── redis/
        └── data/        # Persistência física de dados do Redis
```

* Os volumes acima são declarados no `docker-compose.dev.yaml` e são criados no host assim que os containers são inicializados.
