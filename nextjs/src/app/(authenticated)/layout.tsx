import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { userService } from "@/services/userService";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user = null;
  try {
    user = await userService.getProfile(token);
  } catch (error) {
    console.error("Erro ao obter perfil do usuário no layout autenticado:", error);
    redirect("/login?session_expired=true");
  }

  return (
    <SidebarProvider className="bg-background text-foreground">
      <AppSidebar user={user} />
      <SidebarInset className="overflow-hidden min-h-screen relative bg-background text-foreground">
        {/* Padrão Dot Matrix para Light Mode */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.3] dark:opacity-0 mix-blend-multiply transition-opacity duration-500"
          style={{ 
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
        
        {/* Padrão Dot Matrix para Dark Mode */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-[0.15] transition-opacity duration-500"
          style={{ 
            backgroundImage: 'radial-gradient(#52525b 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />

        {/* Mesh Glows - Gradientes abstratos imersivos de fundo */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-500/5 dark:hidden blur-[120px] pointer-events-none transition-all duration-500" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/5 dark:hidden blur-[120px] pointer-events-none transition-all duration-500" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/3 dark:hidden blur-[100px] pointer-events-none transition-all duration-500" />

        {/* Main Content Area */}
        <div className="relative z-10 flex flex-col flex-1 w-full">
          <Header />
          
          <div className="flex-1 p-4 lg:p-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
