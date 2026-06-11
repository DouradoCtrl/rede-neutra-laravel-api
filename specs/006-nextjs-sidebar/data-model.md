# Data Model & Types: Sidebar de Navegação e Menu do Usuário

Como esta funcionalidade se concentra na interface de usuário (frontend Next.js) e consome endpoints existentes do backend Laravel, as estruturas de dados a seguir representam os tipos TypeScript utilizados na aplicação frontend.

## 1. Estrutura de Dados do Usuário (User Profile)

Dados retornados pelo backend no endpoint `/api/v1/auth/profile/me` e tipados no frontend para preenchimento da sidebar.

### Tipo: `User`
Representa o usuário autenticado que está visualizando a interface.

| Campo | Tipo | Descrição | Regras/Validação |
|---|---|---|---|
| `id` | `number` | Identificador único no banco de dados. | Obrigatório |
| `name` | `string` | Nome completo do usuário. | Exibido no rodapé do menu |
| `email` | `string` | Endereço de e-mail do usuário. | Exibido no rodapé do menu |
| `role` | `string` | Nível de permissão (ex: `admin`, `user`). | Usado para controle de acesso |
| `telecom_group` | `TelecomGroup \| null` | Grupo de telecomunicações associado ao usuário. | Relacionamento opcional |

---

### Tipo: `TelecomGroup`
Grupo ao qual o usuário pertence.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `number` | Identificador único do grupo. |
| `name` | `string` | Nome do grupo (ex: `Matriz`, `Filial`). |

---

## 2. Estrutura de Navegação (Navigation Menu)

Representa a estrutura de controle dinâmico dos links exibidos na barra lateral de navegação.

### Tipo: `NavigationItem`
Representa cada link na lista da barra lateral.

| Campo | Tipo | Descrição |
|---|---|---|
| `title` | `string` | Título de exibição (ex: `Dashboard`, `Usuários`, `Telecom`). |
| `path` | `string` | Rota interna do Next.js (ex: `/dashboard`, `/usuarios`, `/telecom`). |
| `icon` | `LucideIcon` | Componente de ícone do Lucide React a ser exibido ao lado do título. |
| `roles` | `string[] \| undefined` | Perfis que têm permissão de visualizar este item (se não especificado, todos visualizam). |
