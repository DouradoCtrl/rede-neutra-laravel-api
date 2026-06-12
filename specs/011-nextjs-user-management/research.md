# Pesquisa Técnica: Painel de Gerenciamento de Usuários e Hubsoft

## Decisão 1: Abordagem de Multi-tenant (Kayros Link vs Parceiras)
- **Decisão**: A filtragem de dados de usuários será implementada no banco de dados do Laravel (API) e não apenas no frontend.
- **Justificativa**: A restrição no Laravel garante que administradores de telecoms parceiras não consigam interceptar via API dados de outras parceiras (vazamento de dados). O frontend Next.js apenas consome a lista filtrada que a API disponibiliza. O `super_admin` continua recebendo a lista de todos os usuários.
- **Alternativas consideradas**: Filtrar a lista completa no frontend. Rejeitado pois causaria sérios problemas de segurança de dados (data exposure).

## Decisão 2: Armazenamento do Código de Cliente Hubsoft
- **Decisão**: Adicionar uma coluna do tipo `string` chamada `codigo_cliente_hubsoft` na tabela `telecom_groups` (nullable e unique).
- **Justificativa**: Como esse código identifica os parceiros no sistema externo de ERP da Hubsoft, ele será essencial para consultas futuras do catálogo de clientes. Definido como `string` (pois alguns ERPs usam sequências alfanuméricas com zeros à esquerda) e `nullable` (pois a telecom administradora da rede neutra "Dona" não necessita de tal associação, nem outras integrações de teste iniciais).
- **Alternativas consideradas**: Adicionar uma tabela de metadados de integração. Rejeitado por complexidade desnecessária para esta fase inicial do MVP.

## Decisão 3: Componentes de UI Faltantes (Tabela e Seletor)
- **Decisão**: Criar manualmente os arquivos `table.tsx` e `select.tsx` baseados nas especificações oficiais do Shadcn UI (usando Radix UI) e adicionar à pasta `nextjs/src/components/ui/`.
- **Justificativa**: Garante consistência visual completa com o restante do projeto (que já utiliza Radix/Shadcn) e atende estritamente à diretriz da Constituição de não usar layouts ad-hoc sem Shadcn UI.
- **Alternativas consideradas**: Usar tabelas HTML puras ou bibliotecas externas complexas como TanStack Table. Rejeitado para manter o projeto minimalista e evitar novos pacotes desnecessários na stack básica.
