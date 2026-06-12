"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  KeyRound, 
  Save, 
  Loader2, 
  ShieldAlert,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { userService } from "@/services/userService";

export default function MeuPerfilPage() {
  const router = useRouter();

  // Page initialization loading
  const [pageLoading, setPageLoading] = useState(true);

  // Profile Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileErrors, setProfileErrors] = useState<Record<string, string[]>>({});
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string[]>>({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch user details on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await userService.getClientProfile();
        setName(profile.name || "");
        setEmail(profile.email || "");
      } catch (err: any) {
        console.error("Erro ao carregar perfil:", err);
        toast.error("Não foi possível carregar os dados do perfil.");
      } finally {
        setPageLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Handle Profile Update Submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileErrors({});

    try {
      const result = await userService.updateClientProfile({ name, email });
      toast.success(result.message || "Perfil atualizado com sucesso!");
      
      // Refresh the page to update header/sidebar user data
      router.refresh();
    } catch (err: any) {
      if (err.status === 422 && err.errors) {
        setProfileErrors(err.errors);
        toast.error(err.message || "Verifique os erros no formulário.");
      } else {
        toast.error(err.message || "Erro ao atualizar dados cadastrais.");
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Update Submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordErrors({});

    try {
      const result = await userService.updateClientPassword({
        current_password: currentPassword,
        password: password,
        password_confirmation: passwordConfirmation,
      });
      toast.success(result.message || "Senha atualizada com sucesso!");
      
      // Clear password form fields on success
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err: any) {
      if (err.status === 422 && err.errors) {
        setPasswordErrors(err.errors);
        toast.error(err.message || "Verifique os erros no formulário.");
      } else {
        toast.error(err.message || "Erro ao atualizar senha.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Render Skeletons when loading initial user data
  if (pageLoading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <Card className="border-border">
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>

          <Card className="border-border">
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-1 border-b border-border pb-5">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Meu Perfil
        </h1>
        <p className="text-muted-foreground text-sm">
          Gerencie suas informações cadastrais e segurança da conta.
        </p>
      </div>

      {/* Grid of Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: Personal Details */}
        <Card className="border-border shadow-sm bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:bg-card">
          <form onSubmit={handleProfileSubmit}>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <User className="h-5 w-5" />
                <CardTitle className="text-xl">Dados Cadastrais</CardTitle>
              </div>
              <CardDescription>
                Atualize seu nome de exibição e endereço de e-mail.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Name Input */}
              <div className="grid gap-2">
                <Label htmlFor="profile-name" className="text-sm font-medium flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Nome
                </Label>
                <Input
                  id="profile-name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={profileLoading}
                  className="bg-background/50 focus-visible:ring-primary"
                />
                {profileErrors.name && (
                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {profileErrors.name[0]}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="grid gap-2">
                <Label htmlFor="profile-email" className="text-sm font-medium flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  E-mail
                </Label>
                <Input
                  id="profile-email"
                  type="email"
                  placeholder="seu-email@provedor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={profileLoading}
                  className="bg-background/50 focus-visible:ring-primary"
                />
                {profileErrors.email && (
                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {profileErrors.email[0]}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button type="submit" disabled={profileLoading} className="min-w-36 gap-2">
                {profileLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Perfil
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Card 2: Password Form */}
        <Card className="border-border shadow-sm bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:bg-card">
          <form onSubmit={handlePasswordSubmit}>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <KeyRound className="h-5 w-5" />
                <CardTitle className="text-xl">Alteração de Senha</CardTitle>
              </div>
              <CardDescription>
                Mantenha sua conta segura alterando a senha regularmente.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Current Password Input */}
              <div className="grid gap-2">
                <Label htmlFor="current-password" className="text-sm font-medium flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Senha Atual
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={passwordLoading}
                  className="bg-background/50 focus-visible:ring-primary"
                />
                {passwordErrors.current_password && (
                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {passwordErrors.current_password[0]}
                  </p>
                )}
              </div>

              {/* New Password Input */}
              <div className="grid gap-2">
                <Label htmlFor="new-password" className="text-sm font-medium flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                  Nova Senha
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={passwordLoading}
                  className="bg-background/50 focus-visible:ring-primary"
                />
                {passwordErrors.password && (
                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {passwordErrors.password[0]}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                  Confirmar Nova Senha
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repita a nova senha"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  disabled={passwordLoading}
                  className="bg-background/50 focus-visible:ring-primary"
                />
                {passwordErrors.password_confirmation && (
                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {passwordErrors.password_confirmation[0]}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button type="submit" disabled={passwordLoading} className="min-w-36 gap-2">
                {passwordLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Atualizar Senha
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

      </div>
    </div>
  );
}
