"use client";

import { useSession } from "@/services/hooks/auth/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirection uniquement si le chargement est terminé et qu'il n'y a pas d'utilisateur
    if (!isLoading && !user) {
      router.push("student/login");
    }
  }, [isLoading, user, router]);

  // Affichage du spinner pendant le chargement ou pendant la redirection
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Spinner size="lg" />
      </div>
    );
  }

  // Affichage du contenu protégé
  return <>{children}</>;
}
