"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const BREADCRUMB_LABELS: Record<string, string> = {
  "dashboard": "Dashboard",
  "usuarios": "Usuários",
  "telecom": "Telecom",
  "meu-perfil": "Meu Perfil",
};

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "(authenticated)" && segment !== "dashboard");

  const breadcrumbs: Array<{
    label: string;
    href: string;
    isLast: boolean;
  }> = [
    { label: "Painel", href: "/dashboard", isLast: segments.length === 0 },
    ...segments.map((segment, idx) => {
      const isLast = idx === segments.length - 1;
      const href = "/" + segments.slice(0, idx + 1).join("/");

      return {
        label:
          BREADCRUMB_LABELS[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1),
        href,
        isLast,
      };
    }),
  ];

  return (
    <header className="relative z-20 bg-background/30 backdrop-blur-md flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/50 transition-[width,height] ease-linear px-6 sticky top-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4"
        />
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, idx) => (
              <BreadcrumbItem key={idx}>
                {crumb.isLast ? (
                  <BreadcrumbPage className="text-sm font-medium">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={crumb.href} className="text-sm">
                      {crumb.label}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        {children && <div className="flex items-center">{children}</div>}
        <ThemeToggle />
      </div>
    </header>
  );
}
