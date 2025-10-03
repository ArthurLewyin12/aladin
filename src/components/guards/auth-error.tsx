"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AuthError() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="shadow-lg">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold mb-2">
            Accès non autorisé
          </AlertTitle>
          <AlertDescription className="space-y-4">
            <p className="text-sm">
              Vous n'êtes pas autorisé à accéder à cette page. Veuillez vous
              connecter pour continuer.
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("student/login")}
              >
                Se connecter
              </Button>
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => router.back}
              >
                Retour
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
