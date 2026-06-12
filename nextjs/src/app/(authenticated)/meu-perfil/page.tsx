"use client";

import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  User, 
  KeyRound, 
  Loader2, 
  ShieldAlert,
  Eye,
  EyeOff,
  MonitorSmartphone,
  Laptop,
  Smartphone
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
import { Badge } from "@/components/ui/badge";
import { userService } from "@/services/userService";
import type { UserToken } from "@/services/userService";

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

  // Sessions State
  const [tokens, setTokens] = useState<UserToken[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [revokingTokenId, setRevokingTokenId] = useState<number | null>(null);

  const loadTokens = async () => {
    setLoadingTokens(true);
    try {
      const data = await userService.getClientTokens();
      setTokens(data);
    } catch (err: unknown) {
      console.error("Erro ao carregar sessões:", err);
      toast.error("Não foi possível carregar as sessões ativas.");
    } finally {
      setLoadingTokens(false);
    }
  };

  const handleRevokeToken = async (tokenId: number) => {
    const confirmRevoke = window.confirm("Tem certeza que deseja encerrar esta sessão? O dispositivo associado será desconectado.");
    if (!confirmRevoke) return;

    setRevokingTokenId(tokenId);
    try {
      await userService.revokeClientToken(tokenId);
      toast.success("Sessão encerrada com sucesso!");
      loadTokens();
    } catch (err: unknown) {
      console.error("Erro ao revogar sessão:", err);
      const error = err as { message?: string };
      toast.error(error.message || "Erro ao encerrar sessão.");
    } finally {
      setRevokingTokenId(null);
    }
  };

  // Fetch user details on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await userService.getClientProfile();
        setName(profile.name || "");
        setEmail(profile.email || "");
      } catch (err: unknown) {
        console.error("Erro ao carregar perfil:", err);
        toast.error("Não foi possível carregar os dados do perfil.");
      } finally {
        setPageLoading(false);
      }
    }
    async function initTokens() {
      await Promise.resolve();
      loadTokens();
    }
    loadProfile();
    initTokens();
  }, []);

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes("chrome") || ua.includes("firefox") || ua.includes("safari") || ua.includes("edge") || ua.includes("opera")) {
      if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone") || ua.includes("ipad")) {
        return <Smartphone className="h-4 w-4" />;
      }
      return <Laptop className="h-4 w-4" />;
    }
    return <MonitorSmartphone className="h-4 w-4" />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

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
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string; errors?: Record<string, string[]> };
      if (error.status === 422 && error.errors) {
        const mappedErrors: InfoFieldErrors = {};
        if (error.errors.name) mappedErrors.name = error.errors.name[0];
        if (error.errors.email) mappedErrors.email = error.errors.email[0];
        setInfoErrors(mappedErrors);
        toast.error(error.message || "Erro de validação nos campos.");
      } else {
        toast.error(error.message || "Erro ao atualizar dados cadastrais.");
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
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string; errors?: Record<string, string[]> };
      if (error.status === 422 && error.errors) {
        const mappedErrors: PasswordFieldErrors = {};
        if (error.errors.current_password) mappedErrors.current_password = error.errors.current_password[0];
        if (error.errors.password) mappedErrors.password = error.errors.password[0];
        if (error.errors.password_confirmation) mappedErrors.password_confirmation = error.errors.password_confirmation[0];
        setPasswordErrors(mappedErrors);
        toast.error(error.message || "Erro de validação nos campos.");
      } else {
        toast.error(error.message || "Erro ao atualizar senha.");
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
        <TabsList className="grid w-full grid-cols-3 max-w-[550px]">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Dados do Usuário</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            <span>Alterar Senha</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2" onClick={loadTokens}>
            <MonitorSmartphone className="h-4 w-4" />
            <span>Sessões</span>
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

        {/* Conteúdo de Sessões Ativas */}
        <TabsContent value="sessions" className="mt-0 outline-hidden">
          <Card className="border-border shadow-sm bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MonitorSmartphone className="h-5 w-5 text-primary" />
                <CardTitle>Sessões Ativas</CardTitle>
              </div>
              <CardDescription>
                Gerencie os dispositivos onde sua conta está conectada no momento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingTokens ? (
                <div className="flex flex-col gap-4 py-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : tokens.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma sessão ativa encontrada.</p>
              ) : (
                <div className="divide-y divide-border">
                  {tokens.map((token) => (
                    <div key={token.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-muted rounded-lg text-muted-foreground mt-0.5">
                          {getDeviceIcon(token.name)}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm block max-w-[280px] sm:max-w-md truncate" title={token.name}>
                              {token.name}
                            </span>
                            {token.is_current && (
                              <Badge variant="secondary" className="bg-primary/15 text-primary border-transparent hover:bg-primary/20 text-[10px] py-0 px-2 font-semibold">
                                Este Dispositivo
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Criado em: {formatDate(token.created_at)} • Último uso: {formatDate(token.last_used_at)}
                          </p>
                        </div>
                      </div>
                      
                      {!token.is_current && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-3"
                          onClick={() => handleRevokeToken(token.id)}
                          disabled={revokingTokenId === token.id}
                        >
                          {revokingTokenId === token.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Revogar"
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
