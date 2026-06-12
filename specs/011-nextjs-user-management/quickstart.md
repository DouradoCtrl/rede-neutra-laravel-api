# Guia de Validação: Gerenciamento de Usuários e Hubsoft

Este guia descreve como validar manualmente a listagem, criação, edição e exclusão de usuários, incluindo o controle de tenants e o campo de integração `codigo_cliente_hubsoft`.

## Pré-requisitos
1. O ambiente Docker deve estar rodando (`docker compose -f docker-compose.dev.yaml up -d`).
2. O usuário master `noc@kayroslink.com.br` com a senha `but1709vd` deve estar cadastrado.
3. Executar as migrations e seeds para criar a nova coluna de integração e povoar o banco com o grupo padrão `owner`:
   ```bash
   docker compose exec php php artisan migrate:fresh --seed
   ```

## Cenário 1: Gestão de Usuários por um Super Admin (Dona)

### Passo a Passo:
1. Acesse `http://localhost:3000/login` e entre como `noc@kayroslink.com.br` (senha: `but1709vd`).
2. Acesse a tela de usuários no menu ou via URL: `http://localhost:3000/usuarios`.
3. **Listagem**: Verifique se a tabela exibe todos os usuários e a coluna **"Telecom Parceira"** indicando o grupo de cada um.
4. **Cadastro de Empresa Telecom de Teste**:
   - Crie uma empresa parceira para associar o usuário (se não houver). Caso precise cadastrar direto no banco ou já exista:
     ```bash
     docker compose exec php php artisan tinker
     # Crie um grupo telecom de teste com o novo campo Hubsoft:
     \App\Models\TelecomGroup::create(['name' => 'Parceira Telecom', 'slug' => 'parceira-telecom', 'active' => true, 'codigo_cliente_hubsoft' => 'HUB-9988']);
     ```
5. **Criação**: Clique em "Novo Usuário":
   - Preencha Nome, E-mail, Senha e selecione o Cargo como `admin` ou `user`.
   - Como `super_admin`, você deve ver a seleção de "Telecom". Selecione "Parceira Telecom".
   - Salve e confirme se o usuário aparece na lista com a telecom correspondente.
6. **Edição**: Edite o usuário criado e mude seu e-mail ou nome. Valide se as modificações refletiram na listagem.
7. **Exclusão**: Tente excluir o usuário clicando no ícone correspondente e confirmando no modal de diálogo. O usuário deve sumir da tabela.

## Cenário 2: Gestão de Usuários por um Admin Parceiro (Multi-tenant)

### Passo a Passo:
1. No Laravel, crie uma conta admin vinculada à telecom criada anteriormente (Parceira Telecom - ID 2):
   ```bash
   docker compose exec php php artisan tinker
   # Criar o admin parceiro:
   \App\Models\User::create(['name' => 'Admin Parceiro', 'email' => 'admin@parceira.com', 'password' => \Illuminate\Support\Facades\Hash::make('senha123'), 'role' => 'admin', 'telecom_group_id' => 2]);
   ```
2. Deslogue e entre na aplicação com `admin@parceira.com` (senha: `senha123`).
3. Acesse a rota `http://localhost:3000/usuarios`.
4. **Verificações**:
   - A tabela deve listar **apenas** o usuário `Admin Parceiro` e eventuais usuários criados sob a mesma Telecom. Usuários da "Dona" ou de outras parceiras não devem aparecer.
   - A coluna "Telecom Parceira" deve estar oculta ou estática.
   - Ao clicar em "Novo Usuário", o seletor "Telecom" não deve estar visível (o cadastro do novo usuário herda automaticamente a telecom do admin parceiro).
