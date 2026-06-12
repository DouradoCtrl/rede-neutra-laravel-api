# Guia Rápido de Validação (Quickstart): Edição de Perfil e Senha

Este guia descreve os passos necessários para validar localmente o funcionamento da Edição de Perfil e Alteração de Senha no frontend Next.js.

## Pré-requisitos
1. Os containers Docker do projeto devem estar ativos.
2. Next.js Frontend rodando em `http://localhost:3000`.

---

## Passos para Validação

### 1. Acesso à Tela de Perfil
1. Acesse `http://localhost:3000/login` e efetue login com as credenciais válidas.
2. Clique no avatar de usuário no rodapé do menu lateral e selecione a opção **"Perfil"**.
3. **Resultado Esperado**: O navegador deve redirecionar para a rota `/meu-perfil`. Os campos **Nome** e **E-mail** do formulário principal devem estar pré-preenchidos com seus dados cadastrais corretos obtidos da API.

---

### 2. Validação da Edição de Perfil (Dados Cadastrais)
1. No formulário de dados cadastrais, altere o valor do campo **Nome** (ex: adicione " - Alterado") e clique no botão **"Salvar Perfil"**.
2. **Resultado Esperado**: O formulário é submetido, um toast de sucesso ("Perfil atualizado com sucesso.") surge no canto da tela e o nome na barra lateral é atualizado para refletir o novo nome cadastrado.
3. Atualize a página (F5).
4. **Resultado Esperado**: Os campos continuam exibindo as informações novas que foram atualizadas e salvas na API do Laravel.

---

### 3. Validação de Erro de Dados Pessoais (CORS / Validações)
1. Limpe o campo **Nome** e coloque um e-mail com formato incorreto (ex: `invalido@`).
2. Clique em **"Salvar Perfil"**.
3. **Resultado Esperado**: Os erros de validação retornados pelo Laravel (ex: *"O campo nome é obrigatório."* e *"O e-mail deve ser um endereço válido."*) devem surgir logo abaixo de cada respectivo campo em vermelho.

---

### 4. Validação da Alteração de Senha
1. No segundo formulário de alteração de senha, insira:
   - **Senha Atual**: `but1709vd` (a senha cadastrada no seeder)
   - **Nova Senha**: `nova1234`
   - **Confirmar Nova Senha**: `nova1234`
2. Clique em **"Atualizar Senha"**.
3. **Resultado Esperado**: O formulário é processado e um toast de sucesso ("Senha atualizada com sucesso.") é exibido na tela.

---

### 5. Validação de Erros de Senha
1. No mesmo formulário de senha, tente alterar utilizando:
   - **Senha Atual**: `senha_errada`
   - **Nova Senha**: `curta`
   - **Confirmar Nova Senha**: `diferente`
2. Clique em **"Atualizar Senha"**.
3. **Resultado Esperado**: Erros específicos retornados pelo Laravel sob cada campo (senha atual incorreta, tamanho mínimo da nova senha e divergência da confirmação).
