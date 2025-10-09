"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWaveCallback } from "@/services/hooks/payments/useWaveCallback";
import { Spinner } from "@/components/ui/spinner";

export default function PaymentErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { isPending } = useWaveCallback({
    token: token || "",
    isSuccessCallback: false,
  });

  useEffect(() => {
    if (!token) {
      toast.error("Token de paiement manquant.");
      router.push("/student/home");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <XCircle className="w-12 h-12 text-red-500 mb-2" />
          <CardTitle className="text-2xl">Échec du Paiement</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {isPending ? (
            <div className="flex flex-col items-center gap-4">
              <Spinner size="lg" />
              <p className="text-muted-foreground">
                Enregistrement de l'erreur...
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground">
                Le processus de paiement a été annulé ou a échoué. Votre
                abonnement n'a pas été activé.
              </p>
              <Button variant="outline" onClick={() => router.push("/")}>
                Retourner à l'accueil
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
