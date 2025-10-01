"use client";

import type React from "react";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { OTPInput, type SlotProps } from "input-otp";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useActivate } from "@/services/hooks/users/useUser";
import { UserStatus } from "@/constants/user-status";
import { Spinner } from "@/components/ui/spinner";

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "flex size-9 items-center justify-center rounded-lg border border-input bg-background font-medium text-foreground shadow-sm shadow-black/5 transition-shadow",
        { "z-10 border border-ring ring-[3px] ring-ring/20": props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}

function OtpFormComponent() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const id = useId();
  const { mutate: activate, isPending: isLoading } = useActivate();

  useEffect(() => {
    if (!email) {
      toast.error("Email non trouvé. Veuillez recommencer.");
      router.push("/student/register");
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !email) return;

    activate(
      { mail: email, code: otp },
      {
        onSuccess: () => {
          toast.success("Votre compte a été activé avec succès !");

          // Supprimer la logique de sessionStorage.getItem("user_to_activate")
          // et sessionStorage.removeItem("user_to_activate") car les tokens
          // sont déjà gérés par le backend lors de l'inscription.
          // L'utilisateur est déjà authentifié.

          // Rediriger directement vers la page d'accueil de l'étudiant
          // ou une page par défaut si le statut n'est pas géré.
          router.push("/student/home"); // Redirection par défaut pour les élèves
          // Si d'autres statuts sont ajoutés, la logique de redirection
          // devra être affinée en fonction du statut de l'utilisateur
          // qui devrait être disponible via le hook useSession.
        },
        onError: (error: any) => {
          console.error("Activation error:", error);
          toast.error(
            error?.response?.data?.message ||
              "Code invalide ou expiré. Veuillez réessayer.",
          );
        },
      },
    );
  };

  const handleBack = () => {
    router.push("/student/register");
  };

  if (!email) {
    return <Spinner />; // Ou un spinner de chargement
  }

  return (
    <div className=" flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Vérification par email</h1>
          <p className="text-muted-foreground">
            Nous avons envoyé un code de vérification à<br />
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2 flex flex-col items-center">
              <Label htmlFor={id}>Entrez le code de vérification</Label>
              <OTPInput
                id={id}
                value={otp}
                onChange={setOtp}
                containerClassName="flex items-center gap-3 has-[:disabled]:opacity-50"
                maxLength={6}
                disabled={isLoading}
                render={({ slots }) => (
                  <div className="flex gap-2">
                    {slots.map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                )}
              />
            </div>

            <Button
              type="submit"
              className="cursor-pointer w-full h-12 bg-[#111D4A] text-white font-medium text-lg rounded-lg mt-6"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Vérification..." : "Activer mon compte"}
            </Button>

            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OtpForm() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <OtpFormComponent />
    </Suspense>
  );
}
