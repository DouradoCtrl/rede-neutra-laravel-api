"use client";

export default function MeuPerfilPage() {
  return (
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualização e edição do seu perfil de usuário
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border rounded-xl p-12 text-center bg-card/50">
        <h2 className="text-xl font-semibold">Área do Meu Perfil</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Esta tela exibirá as informações e configurações do seu perfil de usuário.
        </p>
      </div>
    </div>
  );
}
