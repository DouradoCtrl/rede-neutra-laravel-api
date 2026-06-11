import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { userService } from "@/services/userService";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Não autorizado. Token de sessão ausente." },
        { status: 401 }
      );
    }

    const profile = await userService.getProfile(token);
    return NextResponse.json(
      {
        status: "success",
        data: profile,
        message: "Dados do usuário obtidos com sucesso.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro no proxy /api/auth/me:", error);
    return NextResponse.json(
      { message: error.message || "Erro interno do servidor ao obter perfil." },
      { status: 401 }
    );
  }
}
