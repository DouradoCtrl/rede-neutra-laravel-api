import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/usuarios") ||
    pathname.startsWith("/telecom");
  const isAuthRoute = pathname === "/login";

  // Se acessar a rota raiz '/', redireciona com base na autenticação
  if (pathname === "/") {
    const targetUrl = new URL(token ? "/dashboard" : "/login", request.url);
    return NextResponse.redirect(targetUrl);
  }

  // Se o usuário não está autenticado e tenta acessar rota protegida, redireciona para /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se o usuário está autenticado e tenta acessar a tela de login, redireciona para o dashboard
  if (isAuthRoute && token) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Executa o middleware apenas nas rotas de interesse
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/usuarios/:path*",
    "/telecom/:path*",
    "/login",
  ],
};

