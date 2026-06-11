"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success(data.message || "Sessão encerrada com sucesso!");
        router.push("/login");
      } else {
        toast.error(data.message || "Falha ao realizar logout.");
      }
    } catch (error) {
      toast.error("Erro de conexão ao tentar sair.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="dark bg-background text-foreground min-h-screen p-6 md:p-10 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Portal de Gerenciamento Rede Neutra Kayros Link
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 border-border dark:hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border rounded-xl p-12 text-center bg-card/50">
        <h2 className="text-2xl font-bold tracking-tight">Bem-vindo à área logada</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Sua autenticação com a API Laravel foi realizada com sucesso e o token está seguro no servidor.
        </p>
      </div>
    </div>
  );
}
