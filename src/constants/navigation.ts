import {
  Home,
  BarChart3,
  BookOpen,
  ClipboardList,
  Users,
  Settings,
  UsersRound,
  FileText,
} from "lucide-react";

export type UserRole = "eleve" | "parent" | "professeur" | "repetiteur";

interface NavigationItem {
  label: string;
  path: string;
  icon: any;
}

interface RoleNavigation {
  homePath: string;
  settingsPath: string;
  menuItems: NavigationItem[];
}

/**
 * Configuration de navigation par rôle
 * Cette approche modulaire permet d'ajouter facilement de nouveaux rôles
 */
export const ROLE_NAVIGATION: Record<UserRole, RoleNavigation> = {
  eleve: {
    homePath: "/student/home",
    settingsPath: "/student/settings",
    menuItems: [
      {
        label: "Mon tableau de bord",
        path: "/student/dashboard",
        icon: BarChart3,
      },
      {
        label: "Mes cours",
        path: "/student/revision",
        icon: ClipboardList,
      },
      {
        label: "Mes quiz",
        path: "/student/quiz",
        icon: BookOpen,
      },
      {
        label: "Mes notes",
        path: "/student/notes",
        icon: FileText,
      },
      {
        label: "Mon planning",
        path: "/student/planning",
        icon: ClipboardList,
      },
      {
        label: "Mes groupes",
        path: "/student/groups",
        icon: Users,
      },
      {
        label: "Mes documents",
        path: "/student/documents",
        icon: FileText,
      },
    ],
  },
  parent: {
    homePath: "/parent/home",
    settingsPath: "/parent/settings",
    menuItems: [
      {
        label: "Mon tableau de bord",
        path: "/parent/dashboard",
        icon: BarChart3,
      },
      // {
      //   label: "Mes cours",
      //   path: "/parent/courses",
      //   icon: BookOpen,
      // },
      {
        label: "Mes enfants",
        path: "/parent/enfants",
        icon: Users,
      },
      {
        label: "Notes des enfants",
        path: "/parent/notes",
        icon: FileText,
      },
      {
        label: "Mes groupes",
        path: "/parent/groups",
        icon: UsersRound,
      },
    ],
  },
  professeur: {
    homePath: "/teacher/home",
    settingsPath: "/teacher/settings",
    menuItems: [
      {
        label: "Mon tableau de bord",
        path: "/teacher/dashboard",
        icon: BarChart3,
      },
      {
        label: "Mes classes",
        path: "/teacher/classes",
        icon: Users,
      },
      {
        label: "Mes cours",
        path: "/teacher/courses",
        icon: BookOpen,
      },

      // {
      //   label: "Notes des élèves",
      //   path: "/teacher/notes",
      //   icon: ClipboardList,
      // },
    ],
  },
  repetiteur: {
    homePath: "/repetiteur/home",
    settingsPath: "/repetiteur/settings",
    menuItems: [
      {
        label: "Tableau de bord",
        path: "/repetiteur/dashboard",
        icon: BarChart3,
      },
      {
        label: "Mes élèves",
        path: "/repetiteur/students",
        icon: Users,
      },
      {
        label: "Mes groupes",
        path: "/repetiteur/groups",
        icon: UsersRound,
      },
    ],
  },
};

/**
 * Récupère la configuration de navigation pour un rôle donné
 */
export const getNavigationForRole = (role: UserRole): RoleNavigation | null => {
  return ROLE_NAVIGATION[role] || null;
};

/**
 * Vérifie si un utilisateur a accès à une route spécifique
 */
export const hasAccessToRoute = (userRole: UserRole, path: string): boolean => {
  const navigation = getNavigationForRole(userRole);
  if (!navigation) return false;

  // Vérifier si le chemin correspond au rôle de l'utilisateur
  let rolePrefix: string;
  if (userRole === "eleve") {
    rolePrefix = "/student";
  } else if (userRole === "professeur") {
    rolePrefix = "/teacher";
  } else {
    rolePrefix = `/${userRole}`;
  }

  console.log("🔍 hasAccessToRoute check:", {
    userRole,
    path,
    rolePrefix,
    result: path.startsWith(rolePrefix),
  });
  return path.startsWith(rolePrefix);
};

/**
 * Redirige vers la page d'accueil appropriée selon le rôle
 */
export const getHomePathForRole = (role: UserRole): string => {
  return ROLE_NAVIGATION[role]?.homePath || "/";
};
