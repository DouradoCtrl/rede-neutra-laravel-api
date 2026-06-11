"use client";

import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarHeaderLogo() {
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/dashboard">
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-lg bg-blue-800 p-1 flex items-center justify-center">
                <Image src="/logo.svg" alt="Logo" width={24} height={24} />
              </div>
              {/* Mostra o texto apenas quando a sidebar está expandida */}
              {state === "expanded" && (
                <div className="transition-all duration-200">
                  <div className="font-bold text-sm leading-none">Rede Neutra</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    Kayros Link
                  </div>
                </div>
              )}
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
