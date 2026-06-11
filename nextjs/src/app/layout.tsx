import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rede Neutra - Kayros Link",
  description: "Portal de autenticação Rede Neutra Kayros Link",
};
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
