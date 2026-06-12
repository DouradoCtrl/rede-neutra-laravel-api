"use client";

import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  KeyRound, 
  Loader2, 
  ShieldAlert,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userService } from "@/services/userService";

type InfoFieldErrors = {
  name?: string;
  email?: string;
};

type PasswordFieldErrors = {
  current_password?: string;
  password?: string;
  password_confirmation?: string;
};

export default function MeuPerfilPage() {
  const router = useRouter();

  // Page initialization loading
  const [pageLoading, setPageLoading] = useState(true);

  // Form 1 State: Profile Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [infoErrors, setInfoErrors] = useState<InfoFieldErrors>({});
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  // Form 2 State: Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<PasswordFieldErrors>({});
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Password Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleInfoInputChange = (setter: (value: string) => void, field: keyof InfoFieldErrors) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (infoErrors[field]) {
      setInfoErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePasswordInputChange = (setter: (value: string) => void, field: keyof PasswordFieldErrors) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle Profile Update Submission
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInfo(true);
    setInfoErrors({});

    try {
      const result = await userService.updateClientProfile({ name, email });
      toast.success(result.message || "Perfil atualizado com sucesso!");
      
      // Refresh the page to update header/sidebar user data
      router.refresh();
    } catch (err: any) {
      if (err.status === 422 && err.errors) {
        const mappedErrors: InfoFieldErrors = {};
        if (err.errors.name) mappedErrors.name = err.errors.name[0];
        if (err.errors.email) mappedErrors.email = err.errors.email[0];
        setInfoErrors(mappedErrors);
        toast.error(err.message || "Erro de validação nos campos.");
      } else {
        toast.error(err.message || "Erro ao atualizar dados cadastrais.");
      }
    } finally {
      setIsSavingInfo(false);
    }
  };

  // Handle Password Update Submission
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
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
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err: any) {
      if (err.status === 422 && err.errors) {
        const mappedErrors: PasswordFieldErrors = {};
        if (err.errors.current_password) mappedErrors.current_password = err.errors.current_password[0];
        if (err.errors.password) mappedErrors.password = err.errors.password[0];
        if (err.errors.password_confirmation) mappedErrors.password_confirmation = err.errors.password_confirmation[0];
        setPasswordErrors(mappedErrors);
        toast.error(err.message || "Erro de validação nos campos.");
      } else {
        toast.error(err.message || "Erro ao atualizar senha.");
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Render Skeletons when loading initial user data
  if (pageLoading) {
    return (
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Separator />
        
        <div className="space-y-6">
          <div className="flex gap-2 max-w-[400px]">
            <Skeleton className="h-9 w-1/2" />
            <Skeleton className="h-9 w-1/2" />
          </div>

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
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie suas informações cadastrais e configurações de segurança da conta.
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="info" className="w-full space-y-6">
        {/* Menu de Abas Horizontal */}
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Dados do Usuário</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            <span>Alterar Senha</span>
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo de Dados do Usuário */}
        <TabsContent value="info" className="mt-0 outline-hidden">
          <Card className="border-border shadow-sm bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Dados Pessoais</CardTitle>
              </div>
              <CardDescription>
                Atualize suas informações básicas de cadastro.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveInfo}>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Ex: John Doe"
                      value={name}
                      onChange={handleInfoInputChange(setName, "name")}
                      className={infoErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                      disabled={isSavingInfo}
                    />
                    {infoErrors.name && (
                      <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                        <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                        {infoErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Ex: john.doe@example.com"
                      value={email}
                      onChange={handleInfoInputChange(setEmail, "email")}
                      className={infoErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                      disabled={isSavingInfo}
                    />
                    {infoErrors.email && (
                      <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                        <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                        {infoErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSavingInfo} className="min-w-36">
                    {isSavingInfo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </TabsContent>

        {/* Conteúdo de Redefinição de Senha */}
        <TabsContent value="password" className="mt-0 outline-hidden">
          <Card className="border-border shadow-sm bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                <CardTitle>Alterar Senha</CardTitle>
              </div>
              <CardDescription>
                Garanta a segurança da sua conta definindo uma nova senha.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSavePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Digite sua senha atual"
                      value={currentPassword}
                      onChange={handlePasswordInputChange(setCurrentPassword, "current_password")}
                      className={`pr-10 ${
                        passwordErrors.current_password ? "border-destructive focus-visible:ring-destructive" : ""
                      }`}
                      disabled={isSavingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-9 px-0 py-2 hover:bg-transparent text-muted-foreground"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      disabled={isSavingPassword}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {passwordErrors.current_password && (
                    <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                      <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                      {passwordErrors.current_password}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={handlePasswordInputChange(setPassword, "password")}
                        className={`pr-10 ${
                          passwordErrors.password ? "border-destructive focus-visible:ring-destructive" : ""
                        }`}
                        disabled={isSavingPassword}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-9 px-0 py-2 hover:bg-transparent text-muted-foreground"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        disabled={isSavingPassword}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordErrors.password && (
                      <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                        <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                        {passwordErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="newPasswordConfirmation">Confirmar Nova Senha</Label>
                    <div className="relative">
                      <Input
                        id="newPasswordConfirmation"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme a nova senha"
                        value={passwordConfirmation}
                        onChange={handlePasswordInputChange(setPasswordConfirmation, "password_confirmation")}
                        className={`pr-10 ${
                          passwordErrors.password_confirmation ? "border-destructive focus-visible:ring-destructive" : ""
                        }`}
                        disabled={isSavingPassword}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-9 px-0 py-2 hover:bg-transparent text-muted-foreground"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        disabled={isSavingPassword}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordErrors.password_confirmation && (
                      <p className="text-xs text-destructive flex items-center gap-1.5 mt-1">
                        <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                        {passwordErrors.password_confirmation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSavingPassword} className="min-w-36">
                    {isSavingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Atualizar Senha
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
