# Quickstart: Validação do Ambiente Docker

Este documento descreve os passos para inicializar e validar o novo ambiente de desenvolvimento na raiz do monorepo.

## Pré-requisitos

1. Docker e Docker Compose instalados no host.
2. Portas livres no host: `80` (HTTP), `5432` (PostgreSQL), `6379` (Redis) e `8025` (Mailpit).

## Passos para Inicialização

### 1. Criar arquivo de variáveis de ambiente
Na raiz do monorepo, copie o `.env.example` para `.env`:
```bash
cp .env.example .env
```
*(Certifique-se de que as credenciais do banco no `.env` da raiz correspondem às contidas no `laravel/.env`)*.

### 2. Executar o Docker Compose
Na raiz do monorepo, suba os containers:
```bash
docker compose -f docker-compose.dev.yaml up -d --build
```

### 3. Verificar o status dos containers
Valide se todos os containers estão rodando normalmente:
```bash
docker compose -f docker-compose.dev.yaml ps
```

---

## Cenários de Validação

### Teste A: Acesso à API Laravel (Nginx)
Acesse no navegador: `http://localhost/` ou via curl:
```bash
curl -I http://localhost
```
* **Resultado esperado:** Retorno HTTP 200 OK (ou 302/JSON dependendo das rotas padrão do seu Laravel).

### Teste B: Conexão com o Banco de Dados (Laravel)
Execute as migrations do Laravel de dentro do container PHP para validar a conexão dele com o PostgreSQL:
```bash
docker compose -f docker-compose.dev.yaml exec php php artisan migrate
```
* **Resultado esperado:** As migrations devem rodar com sucesso sem erros de conexão ou autenticação.

### Teste C: Persistência de Dados
1. Crie uma entrada no banco.
2. Desligue e remova os containers:
   ```bash
   docker compose -f docker-compose.dev.yaml down
   ```
3. Suba novamente:
   ```bash
   docker compose -f docker-compose.dev.yaml up -d
   ```
4. Verifique se o dado inserido no passo 1 ainda existe no banco de dados.
* **Resultado esperado:** O dado deve persistir devido ao volume montado em `.docker/db/data`.
