import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { userService } from "@/services/userService";

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Não autorizado. Token de sessão ausente." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = await userService.updatePassword(token, body);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Erro no proxy de atualização de senha:", error);
    const status = error.status || 500;
    return NextResponse.json(
      {
        message: error.message || "Erro interno do servidor ao atualizar senha.",
        errors: error.errors,
      },
      { status }
    );
  }
}
