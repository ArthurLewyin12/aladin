"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSendPasswordResetLink } from "@/services/hooks/auth/useSendPasswordResetLink";
import { Spinner } from "@/components/ui/spinner";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutate: sendLink, isPending: isLoading } = useSendPasswordResetLink();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez entrer une adresse e-mail.");
      return;
    }

    sendLink(
      { mail: email },
      {
        onSuccess: () => {
          setSubmitted(true); // Affiche le message de succès
        },
        onError: (error: any) => {
          // Par sécurité, on affiche le même message de succès même en cas d'erreur
          // pour ne pas révéler si un email existe ou non dans la base de données.
          setSubmitted(true);
        },
      },
    );
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-bold">Vérifiez votre boîte mail</h1>
          <p className="text-muted-foreground">
            Si un compte correspondant à{" "}
            <span className="font-medium">{email}</span> existe, un e-mail
            contenant un lien de réinitialisation de mot de passe lui a été
            envoyé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Mot de passe oublié ?</h1>
          <p className="text-muted-foreground">
            Entrez votre adresse e-mail et nous vous enverrons un lien pour
            réinitialiser votre mot de passe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@domaine.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#111D4A] text-white font-medium text-lg rounded-lg mt-6 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer le lien de réinitialisation"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
