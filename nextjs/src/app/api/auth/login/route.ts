import { NextRequest, NextResponse } from "next/server";
import { authService, AuthErrorResponse } from "@/services/authService";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // T012: Extract user-agent to pass as device_name
    const userAgent = request.headers.get("user-agent") || "Unknown Device";
    
    // Pass to authService
    const response = await authService.login({
      email: body.email,
      password: body.password,
      device_name: userAgent,
    });
    
    // T013: Store token securely in HttpOnly cookie
    if (response.data?.token) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "auth_token",
        value: response.data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return NextResponse.json({ success: true, message: "Autenticado com sucesso" }, { status: 200 });

  } catch (error: any) {
    console.error("Erro no proxy de login:", error);
    const err = error as AuthErrorResponse;
    // Forward the 422 response down to the UI
    if (err.errors) {
      return NextResponse.json(err, { status: 422 });
    }
    return NextResponse.json(
      { message: err.message || "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
