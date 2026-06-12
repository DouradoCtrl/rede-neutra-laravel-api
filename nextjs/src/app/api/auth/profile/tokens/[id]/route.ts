import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { userService } from "@/services/userService";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Não autorizado. Token de sessão ausente." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const result = await userService.revokeProfileToken(token, parseInt(id, 10));
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("Erro no proxy de revogação do token:", error);
    const err = error as { status?: number; message?: string; errors?: unknown };
    const status = err.status || 500;
    return NextResponse.json(
      {
        message: err.message || "Erro ao revogar token de sessão.",
        errors: err.errors,
      },
      { status }
    );
  }
}
