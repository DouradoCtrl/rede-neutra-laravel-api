# Research & Design Decisions: Sidebar de Navegação e Menu do Usuário

Este documento consolida as decisões arquiteturais e técnicas referentes à especificação da Sidebar de Navegação e do Menu do Usuário no frontend Next.js.

## 1. Carregamento de Dados do Usuário e Estado do Avatar

### Decisão
Obter os dados do usuário autenticado no **Server Component** de layout principal (`nextjs/src/app/(authenticated)/layout.tsx`) utilizando o token de sessão armazenado no cookie seguro `auth_token`. As informações obtidas (nome, e-mail) serão repassadas diretamente via props para o componente `<AppSidebar>`.

### Justificativa
Esta abordagem elimina a necessidade de requisições adicionais no lado do cliente (Client-side fetching), evitando o efeito indesejado de "flash de conteúdo" ou a necessidade de skeletons pesados durante o carregamento inicial da interface. Como os layouts no Next.js App Router são Server Components por padrão, podemos invocar o backend de forma direta e segura antes de entregar o HTML estruturado ao navegador.

### Alternativas Consideradas
- **Busca via Client-Side (`useEffect`/SWR) (Rejeitada)**: Introduziria latência perceptível ao renderizar o avatar, exibindo estados de carregamento (skeletons) no rodapé da sidebar a cada carregamento de página.
- **Cookies de Sessão Não-HttpOnly (Rejeitada)**: Armazenar o nome e e-mail do usuário em cookies descriptografados no lado do cliente. Rejeitada por violar princípios de segurança de sessão única da verdade (Single Source of Truth) do backend.

---

## 2. Estruturação das Rotas Autenticadas e Compartilhamento de Layout

### Decisão
Criar um grupo de rotas no Next.js chamado `(authenticated)` sob `src/app/`. Isso agrupará as rotas `/dashboard`, `/usuarios` e `/telecom` para herdarem o mesmo arquivo de `layout.tsx` onde a sidebar e a estrutura base do painel estarão presentes, sem alterar as URLs finais.

### Justificativa
O Next.js suporta o agrupamento de rotas com parênteses, o que nos permite declarar um layout comum que envelopa o `<SidebarProvider>` e o `<AppSidebar>` apenas para as páginas autenticadas, mantendo páginas públicas (como `/login`) isoladas sem barra lateral.

### Alternativas Consideradas
- **Layouts Individuais por Página (Rejeitada)**: Duplicaria a invocação da `<AppSidebar>` em `/dashboard/layout.tsx`, `/usuarios/layout.tsx` e `/telecom/layout.tsx`. Isso geraria retrabalho e inconsistência caso a navegação sofresse alterações futuras.

---

## 3. Integração com Componente Shadcn/UI e Radix UI

### Decisão
Utilizar o componente oficial `@/components/ui/sidebar` da Shadcn/UI (que já está configurado no projeto e se baseia na Radix UI) para estruturar a barra de navegação, utilizando elementos como `<Sidebar>`, `<SidebarHeader>`, `<SidebarContent>`, `<SidebarFooter>`, além dos componentes de `<Avatar>` e `<DropdownMenu>` do diretório `ui/`.

### Justificativa
Reutilizar componentes existentes acelera o desenvolvimento, garante conformidade com o sistema de design (TailwindCSS + Variáveis CSS) e entrega acessibilidade nativa garantida pelos primitivos da Radix UI.
