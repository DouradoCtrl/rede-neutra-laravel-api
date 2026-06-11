# Guia Rápido de Validação (Quickstart)

Siga os passos abaixo para testar a integração. Detalhes de implementação e desenvolvimento estarão contidos no *Tasks* quando for gerado, mas este guia garante que os testes locais passarão no final.

**1. Subindo os Ambientes**
1. Na pasta `laravel/`, assegure-se de estar com o `.env` populado e rode as migrations se houver base nova.
2. Na raiz do projeto, suba a stack do docker (`docker-compose.dev.yaml`), que deverá expor o Laravel na porta padrão e o frontend Next.js.
```bash
docker-compose -f docker-compose.dev.yaml up -d
```

**2. Verificando o CORS do Backend**
- Envie uma requisição OPTIONS manual usando curl ou o Insomnia para verificar se as rotas de login permitem a origem local onde o container do Next.js roda (tipicamente `localhost:3000`).
```bash
curl -i -X OPTIONS http://localhost:8000/api/login -H "Origin: http://localhost:3000"
```
A resposta deve retornar status `204 No Content` ou `200 OK` com os headers CORS corretos e `Access-Control-Allow-Origin: http://localhost:3000`.

**3. Validação do Fluxo com Dados Inválidos**
1. Acesse o frontend (ex: `http://localhost:3000/login`).
2. Digite um e-mail com formato estranho e preencha algo qualquer em senha, depois clique em Submeter.
3. Certifique-se de ver o Toast de Sonner dizendo algo como "Falha na validação" (ou "Credenciais inválidas").
4. A mensagem de erro da API deve aparecer logo embaixo dos campos de input (UI Shadcn).

**4. Verificando Isolamento do Cookie no Login**
1. Faça o Login com credenciais válidas conhecidas (seeding do Laravel).
2. O sistema deve redirecionar para a página em branco (futuro `/dashboard`).
3. Abra as Ferramentas do Desenvolvedor (F12) e inspecione a aba `Application > Cookies`.
4. Procure pelo token: A coluna "HttpOnly" DEVE estar com um *check* (ativada).
5. Tente rodar `document.cookie` na aba `Console`; ele *não* pode retornar o token de sessão.
