# Research: Orquestração Docker Compose para Monorepo

Este documento registra as investigações e decisões de design técnico tomadas para a reestruturação e centralização do ambiente de desenvolvimento Docker.

## Decisões Técnicas de Design

### 1. Mapeamento Granular de Volumes (Laravel FPM & Nginx)
* **Decisão:** Mapear a subpasta `./laravel` do host diretamente no `/var/www` do container PHP e do Nginx, em vez de mapear a raiz do monorepo (`.`).
* **Motivo:** Evita o vazamento de arquivos sensíveis de ferramentas (como a pasta do Spec Kit `.agents/`, `.specify/` e arquivos de configuração) para dentro do container do PHP/Nginx. Além disso, garante compatibilidade total com os caminhos padrão do framework Laravel (como a busca da pasta `/var/www/public` pelo Nginx) sem necessidade de reconfigurar os arquivos do servidor web.
* **Alternativas consideradas:** Mapear a raiz do monorepo e ajustar o `default.conf` do Nginx para apontar para `/var/www/laravel/public`. Rejeitado para manter o container do backend desacoplado de outros arquivos da raiz.

### 2. Parametrização de Credenciais via `.env` do Monorepo
* **Decisão:** Criar um arquivo `.env` na raiz do monorepo contendo as variáveis `DB_DATABASE`, `DB_USERNAME` e `DB_PASSWORD` e injetá-las dinamicamente no serviço `db` (Postgres) do `docker-compose.dev.yaml`.
* **Motivo:** Melhora a segurança local e atende aos princípios arquiteturais de não deixar senhas estáticas expostas no repositório. Permite fácil adequação caso o desenvolvedor possua credenciais locais personalizadas.
* **Alternativas consideradas:** Deixar as credenciais estáticas como `refactorian` dentro do compose. Rejeitado por violação de boas práticas de segurança recomendadas pela Constituição.

### 3. Preservação do Nome do Arquivo Compose
* **Decisão:** Manter o nome `docker-compose.dev.yaml` na raiz do projeto.
* **Motivo:** Mantém a clareza de que se trata de um ambiente exclusivo de desenvolvimento e respeita a preferência do desenvolvedor de orquestrar explicitamente o ambiente de dev.
