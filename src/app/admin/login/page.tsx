"use client";

import { Suspense, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") ?? "/admin";
  const [pending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await signIn("credentials", {
        email: fd.get("email"),
        password: fd.get("password"),
        redirect: false,
      });
      if (res?.error) {
        toast.error("Identifiants invalides");
      } else {
        router.push(callbackUrl);
      }
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm border border-white/10 bg-carbon-800 p-8 space-y-6"
    >
      <div className="text-center">
        <div className="inline-flex h-10 w-10 border border-racing items-center justify-center font-mono text-xs font-bold text-racing mb-3">
          AMA
        </div>
        <h1 className="font-display text-xl font-bold">Admin</h1>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1">
          Auto Move Azur
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoFocus />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-carbon-900">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
