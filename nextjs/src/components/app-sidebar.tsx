"use client";

import * as React from "react";
import { LayoutDashboard, Users, Radio } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser, UserProfile } from "@/components/nav-user";
import { SidebarHeaderLogo } from "@/components/SidebarHeaderLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserProfile | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const isAdmin = user?.role === "super_admin" || user?.role === "admin";

  const data = {
    menu: {
      label: "Menu Principal",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: <LayoutDashboard />,
        },
      ],
    },
    admin: {
      label: "Administrador",
      items: [
        {
          title: "Usuários",
          url: "/usuarios",
          icon: <Users />,
        },
        {
          title: "Telecom",
          url: "/telecom",
          icon: <Radio />,
        },
      ],
    },
  };

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarHeaderLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.menu.items} label={data.menu.label} />
      </SidebarContent>
      <SidebarFooter>
        {isAdmin && (
          <>
            <NavMain items={data.admin.items} label={data.admin.label} />
            <SidebarSeparator />
          </>
        )}
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
