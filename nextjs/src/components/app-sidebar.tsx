"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  Network,
  Settings,
  LogOut,
  ChevronUp,
  User as UserIcon
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Grupos Telecom",
    url: "#",
    icon: Network,
  },
  {
    title: "Usuários",
    url: "#",
    icon: Users,
  },
  {
    title: "Configurações",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border dark:bg-card">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
              <circle cx="12" cy="12" r="4" fill="currentColor" className="opacity-30" />
            </svg>
          </div>
          <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm leading-none text-foreground">Kayros Link</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">Rede Neutra</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<a href={item.url} />}>
                    <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton className="w-full justify-between h-12 hover:bg-muted p-2 rounded-lg transition-colors flex items-center gap-3" />
                }
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 rounded-lg shrink-0">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs rounded-lg">
                      NK
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                    <span className="font-medium text-xs leading-none text-foreground">NOC Kayros</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 max-w-[120px] truncate">
                      noc@kayroslink.com.br
                    </span>
                  </div>
                </div>
                <ChevronUp className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-56 dark:bg-card border-border">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">NOC Kayros Link</p>
                    <p className="text-xs leading-none text-muted-foreground">noc@kayroslink.com.br</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="focus:bg-muted focus:text-foreground cursor-pointer flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="focus:bg-destructive/10 focus:text-destructive cursor-pointer flex items-center gap-2 text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isLoading ? "Saindo..." : "Sair"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
