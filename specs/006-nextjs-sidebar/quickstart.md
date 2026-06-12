# Guia de Validação Rápida (Quickstart): Sidebar de Navegação

Este guia descreve os passos necessários para testar e validar o funcionamento da Sidebar de Navegação e Menu do Usuário no ambiente de desenvolvimento.

## Pré-requisitos

1. Os containers Docker do projeto devem estar rodando e os servidores de desenvolvimento ativos:
   - Laravel API: `http://localhost:8000` (ou porta configurada)
   - Next.js Frontend: `http://localhost:3000`
2. Deve existir um usuário cadastrado no banco de dados para testes.

---

## Passos para Validação em Ambiente de Desenvolvimento

### 1. Inicializar os Serviços

Inicie a aplicação utilizando Docker:
```bash
docker-compose -f docker-compose.dev.yaml up -d
```

Certifique-se de que as dependências do Next.js estão instaladas localmente (ou no container):
```bash
cd nextjs
npm install
npm run dev
```

### 2. Fluxo de Navegação e Layout Autenticado

1. Abra o navegador em `http://localhost:3000/login`.
2. Efetue login com as credenciais de teste válidas.
3. **Resultado Esperado**: Você deve ser redirecionado para a rota `/dashboard`. O painel lateral de navegação (Sidebar) deve carregar instantaneamente à esquerda da tela, exibindo:
   - O logotipo do projeto e o nome "Rede Neutra".
   - Links de navegação: "Dashboard", "Usuários" e "Telecom".
   - Rodapé com o nome e e-mail do usuário autenticado no avatar.

### 3. Alternar entre as Páginas

1. Clique no item de navegação **Usuários**.
2. **Resultado Esperado**: A URL no navegador deve mudar para `/usuarios`, a página de Usuários deve ser renderizada na área de conteúdo e o item "Usuários" no menu lateral deve ficar destacado visualmente.
3. Clique no item de navegação **Telecom**.
4. **Resultado Esperado**: A URL deve ir para `/telecom` e o respectivo conteúdo deve ser renderizado.

### 4. Menu do Usuário (Dropdown e Logout)

1. No rodapé da barra lateral, clique sobre o avatar/nome do usuário.
2. **Resultado Esperado**: Um menu suspenso (dropdown) deve surgir exibindo as opções "Perfil" e "Sair".
3. Clique na opção **Perfil**.
4. **Resultado Esperado**: O navegador deve redirecionar para `/meu-perfil` e carregar a página limpa correspondente.
5. Abra o menu novamente e clique na opção **Sair**.
6. **Resultado Esperado**: O sistema deve invalidar a sessão no Laravel, deletar o cookie `auth_token` e redirecionar você de volta para `http://localhost:3000/login`. Qualquer tentativa de voltar no histórico do navegador para `/dashboard` deve redirecionar para a tela de login.
