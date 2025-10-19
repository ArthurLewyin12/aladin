"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/services/hooks/auth/useSession";
import { hasAccessToRoute, getHomePathForRole, UserRole } from "@/constants/navigation";
import { Spinner } from "@/components/ui/spinner";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Guard pour protéger les routes selon le rôle de l'utilisateur
 * Redirige automatiquement vers la page d'accueil appropriée si l'accès est refusé
 */
export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setIsChecking(true);
      return;
    }

    // Si pas d'utilisateur, laisser AuthGuard gérer la redirection
    if (!user) {
      setIsChecking(false);
      return;
    }

    const userRole = user.statut as UserRole;

    // Si des rôles spécifiques sont requis, vérifier
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      const homePath = getHomePathForRole(userRole);
      router.push(homePath);
      setIsChecking(true); // Garder le loader pendant la redirection
      return;
    }

    // Vérifier si l'utilisateur a accès à cette route
    if (!hasAccessToRoute(userRole, pathname)) {
      const homePath = getHomePathForRole(userRole);
      router.push(homePath);
      setIsChecking(true); // Garder le loader pendant la redirection
      return;
    }

    // Tout est OK, on peut afficher le contenu
    setIsChecking(false);
  }, [user, isLoading, pathname, allowedRoles, router]);

  // Afficher un loader pendant la vérification OU pendant la redirection
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F4F1]">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
