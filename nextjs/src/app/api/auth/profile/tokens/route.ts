import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { userService } from "@/services/userService";

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Não autorizado. Token de sessão ausente." },
        { status: 401 }
      );
    }

    const tokens = await userService.getProfileTokens(token);
    
    return NextResponse.json({
      status: "success",
      data: tokens,
      message: "Tokens recuperados com sucesso."
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Erro no proxy de listagem de tokens:", error);
    const err = error as { status?: number; message?: string; errors?: unknown };
    const status = err.status || 500;
    return NextResponse.json(
      {
        message: err.message || "Erro interno do servidor ao listar tokens.",
        errors: err.errors,
      },
      { status }
    );
  }
}
