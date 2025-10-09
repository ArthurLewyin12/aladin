"use client";

import { useTrialStatus } from "@/services/hooks/trial/useTrialStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// TODO: Implémenter ces deux composants dans les prochaines étapes.
// import CouponActivator from "./CouponActivator";
// import DirectPayment from "./DirectPayment";

export default function SubscriptionManager() {
  const { data: trialStatus, isLoading, isError } = useTrialStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !trialStatus) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Impossible de récupérer le statut de votre abonnement. Veuillez
          réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }

  // Si l'utilisateur a déjà payé, on ne devrait pas afficher ce composant.
  // Cette vérification sera faite dans la page parente (dashboard).
  if (trialStatus.has_paid) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Activer votre abonnement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {trialStatus.is_on_trial && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Période d'essai active</AlertTitle>
            <AlertDescription>
              Il vous reste{" "}
              <span className="font-bold">
                {trialStatus.days_remaining} jour(s)
              </span>{" "}
              pour profiter de toutes les fonctionnalités.
            </AlertDescription>
          </Alert>
        )}

        {!trialStatus.is_on_trial && !trialStatus.has_paid && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Période d'essai terminée</AlertTitle>
            <AlertDescription>
              Votre période d'essai est terminée. Pour continuer à accéder au
              contenu, veuillez activer votre abonnement.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Placeholder pour le composant d'activation de coupon */}
          <h3 className="font-semibold">Activer avec un code promo</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600">
              Le composant CouponActivator.tsx viendra ici.
            </p>
          </div>
          {/* <CouponActivator /> */}
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Ou</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Placeholder pour le composant de paiement direct */}
          <h3 className="font-semibold">Payer directement</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600">
              Le composant DirectPayment.tsx viendra ici.
            </p>
          </div>
          {/* <DirectPayment /> */}
        </div>
      </CardContent>
    </Card>
  );
}
