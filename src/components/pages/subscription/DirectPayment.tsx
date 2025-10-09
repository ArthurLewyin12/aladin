"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";

import { Button } from "@/components/ui/button";
import { useWaveCheckout } from "@/services/hooks/payments/useWaveCheckout";
import { Spinner } from "@/components/ui/spinner";
import { CURRENCY, STUDENT_SUBSCRIPTION_AMOUNT } from "@/constants/payment";

export default function DirectPayment() {
  const { mutate: startCheckout, isPending: isLoading } = useWaveCheckout();

  const handlePayment = () => {
    startCheckout(
      { amount: STUDENT_SUBSCRIPTION_AMOUNT, currency: CURRENCY },
      {
        onSuccess: (data) => {
          if (data.launch_url) {
            // Rediriger l'utilisateur vers la page de paiement de Wave
            window.location.href = data.launch_url;
          } else {
            toast({
              variant: "error",
              title: "Erreur de paiement",
              message: "Impossible d\'initier le paiement. URL non disponible.",
            });
          }
        },
        onError: (error: any) => {
          toast({
            variant: "error",
            title: "Erreur de paiement",
            message: error.response?.data?.message || "Une erreur est survenue lors de l'initialisation du paiement.",
          });
        },
      },
    );
  };

  return (
    <div className="p-4 border rounded-lg flex flex-col items-center">
      <p className="text-center text-muted-foreground mb-4">
        Activez votre abonnement d'un an en payant directement via Wave.
      </p>
      <Button
        onClick={handlePayment}
        className="w-full max-w-xs bg-blue-600 text-white hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Initialisation...
          </>
        ) : (
          `S'abonner pour 1 an (${STUDENT_SUBSCRIPTION_AMOUNT} ${CURRENCY})`
        )}
      </Button>
    </div>
  );
}
