"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/services/hooks/auth/useSession";
import { hasAccessToRoute, getHomePathForRole, UserRole } from "@/constants/navigation";

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

  useEffect(() => {
    if (isLoading) return;

    // Si pas d'utilisateur, laisser AuthGuard gérer la redirection
    if (!user) return;

    const userRole = user.statut as UserRole;

    // Si des rôles spécifiques sont requis, vérifier
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      const homePath = getHomePathForRole(userRole);
      router.push(homePath);
      return;
    }

    // Vérifier si l'utilisateur a accès à cette route
    if (!hasAccessToRoute(userRole, pathname)) {
      const homePath = getHomePathForRole(userRole);
      router.push(homePath);
    }
  }, [user, isLoading, pathname, allowedRoles, router]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
