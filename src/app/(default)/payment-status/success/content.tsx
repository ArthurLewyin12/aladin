"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWaveCallback } from "@/services/hooks/payments/useWaveCallback";
import { Spinner } from "@/components/ui/spinner";

export default function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { isPending, isSuccess, isError, error } = useWaveCallback({
    token: token || "",
    isSuccessCallback: true,
  });

  useEffect(() => {
    if (!token) {
      toast.error("Token de paiement manquant.");
      router.push("/student/home");
    }
  }, [token, router]);

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">
            Confirmation de votre paiement en cours...
          </p>
        </div>
      );
    }

    if (isError) {
      const errorMessage =
        (error as any)?.response?.data?.message || "Une erreur est survenue.";
      return (
        <div className="text-center text-red-600">
          <p>La confirmation du paiement a échoué.</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">
            Votre abonnement a été activé avec succès. Vous avez maintenant
            accès à toutes les fonctionnalités.
          </p>
          <Button onClick={() => router.push("/")}>Aller à l'accueil</Button>
        </div>
      );
    }

    return null; // Ne rien afficher si le token n'est pas encore traité
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mb-2" />
          <CardTitle className="text-2xl">Paiement Réussi !</CardTitle>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
