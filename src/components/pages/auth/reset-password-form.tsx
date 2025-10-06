"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { useResetPassword } from "@/services/hooks/auth/useResetPassword";

function ResetPasswordFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const { mutate: resetPassword, isPending: isLoading } = useResetPassword();

  useEffect(() => {
    if (!token || !email) {
      toast.error("Lien invalide ou expiré. Veuillez refaire une demande.");
      router.push("/login");
    }
  }, [token, email, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email || !password || password !== passwordConfirmation) {
      toast.error("Les mots de passe ne correspondent pas ou sont vides.");
      return;
    }

    const payload = {
      token,
      mail: email,
      password,
      password_confirmation: passwordConfirmation,
    };

    resetPassword(payload, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success("Votre mot de passe a été réinitialisé avec succès !");
          router.push("/login");
        } else {
          toast.error(data.message || "Une erreur est survenue.");
        }
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "Une erreur est survenue. Veuillez réessayer.",
        );
      },
    });
  };

  if (!token || !email) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Réinitialiser le mot de passe</h1>
          <p className="text-muted-foreground">
            Choisissez un nouveau mot de passe pour votre compte.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-confirmation">
              Confirmez le mot de passe
            </Label>
            <PasswordInput
              id="password-confirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#111D4A] text-white font-medium text-lg rounded-lg mt-6 flex items-center justify-center"
            disabled={
              isLoading || !password || password !== passwordConfirmation
            }
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Réinitialisation...
              </>
            ) : (
              "Réinitialiser le mot de passe"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ResetPasswordFormComponent />
    </Suspense>
  );
}
