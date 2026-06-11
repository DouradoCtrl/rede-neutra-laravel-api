import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (token) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://nginx";
      
      // Chamada à API do Laravel para revogar o token no banco
      const res = await fetch(`${apiUrl}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Erro ao invalidar token no Laravel durante logout:", res.status);
      }
    }

    // Deleta o cookie HttpOnly do lado do servidor
    cookieStore.set({
      name: "auth_token",
      value: "",
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json(
      { success: true, message: "Deslogado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no proxy de logout:", error);
    
    // Fallback de segurança para garantir a deleção do cookie local
    try {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "auth_token",
        value: "",
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      });
    } catch {}

    return NextResponse.json(
      { success: true, message: "Deslogado com sucesso (localmente)" },
      { status: 200 }
    );
  }
}
