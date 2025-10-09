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
import { toast } from "@/lib/toast";
import { useActivate } from "@/services/hooks/users/useUser";
import { useResendActivationCode } from "@/services/hooks/users/useResendActivationCode";
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
  const { mutate: activate, isPending: isActivating } = useActivate();
  const { mutate: resendCode, isPending: isResending } =
    useResendActivationCode();
  const [countdown, setCountdown] = useState(0);

  const isLoading = isActivating || isResending;

  useEffect(() => {
    if (!email) {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Email non trouvé. Veuillez recommencer.",
      });
      router.push("/register");
    }
  }, [email, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !email) return;

    const payload = { mail: email, code: otp };

    activate(payload, {
      onSuccess: () => {
        toast({
          variant: "success",
          message: "Votre compte a été activé avec succès !",
        });
        router.push("/student/home");
      },
      onError: (error: any) => {
        toast({
          variant: "error",
          title: "Code invalide",
          message:
            error?.response?.data?.message ||
            "Code invalide ou expiré. Veuillez réessayer.",
        });
      },
    });
  };

  const handleResendCode = () => {
    if (!email || countdown > 0) return;

    resendCode(
      { mail: email },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            message: "Un nouveau code a été envoyé.",
          });
          setCountdown(60); // Démarre le compte à rebours de 60 secondes
        },
        onError: (error: any) => {
          toast({
            variant: "error",
            title: "Erreur",
            message:
              error?.response?.data?.message ||
              "Erreur lors du renvoi du code. Veuillez réessayer.",
          });
        },
      },
    );
  };

  const handleBack = () => {
    router.push("/register");
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
              className="cursor-pointer w-full h-12 bg-[#111D4A] text-white font-medium text-lg rounded-lg mt-6 flex items-center justify-center"
              disabled={isLoading || otp.length !== 6}
            >
              {isActivating ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Vérification...
                </>
              ) : (
                "Activer mon compte"
              )}
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

              <Button
                type="button"
                variant="link"
                onClick={handleResendCode}
                disabled={isLoading || countdown > 0}
              >
                {countdown > 0
                  ? `Renvoyer dans ${countdown}s`
                  : "Renvoyer le code"}
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
