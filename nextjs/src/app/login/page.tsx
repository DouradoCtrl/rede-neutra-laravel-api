import { LoginForm } from "@/components/login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const sessionExpired = params.session_expired === "true";

  return (
    <div className="dark bg-background text-foreground flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm sessionExpired={sessionExpired} />
      </div>
    </div>
  )
}
