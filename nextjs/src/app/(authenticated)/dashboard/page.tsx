export default function DashboardPage() {

  return (
    <div className="p-6 md:p-10 flex flex-col gap-6">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border rounded-xl p-12 text-center bg-card/50">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Bem-vindo à área logada</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Sua autenticação com a API Laravel foi realizada com sucesso e o token está seguro no servidor.
        </p>
      </div>
    </div>
  );
}

