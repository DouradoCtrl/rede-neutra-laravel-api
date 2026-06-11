import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen dark:bg-background text-foreground">
        <header className="flex h-16 items-center gap-4 px-6 border-b border-border dark:bg-card">
          <SidebarTrigger />
          <div className="flex-1">
            <span className="text-sm font-medium text-muted-foreground">Portal Rede Neutra</span>
          </div>
        </header>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
