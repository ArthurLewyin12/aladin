"use client";
import Image from "next/image";
import { User, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/services/hooks/auth/useSession";
import { useRouter } from "next/navigation";
import { NotificationCenter } from "@/components/ui/notification-center";
import { getNavigationForRole, UserRole } from "@/constants/navigation";

export function AccountHeader() {
  const router = useRouter();
  const { user, logout } = useSession();

  const getInitials = (nom?: string, prenom?: string) => {
    if (!nom && !prenom) return "U";
    return `${nom?.[0] || ""}${prenom?.[0] || ""}`.toUpperCase();
  };

  const userRole = user?.statut as UserRole;
  const navigation = getNavigationForRole(userRole);

  const handleProfile = () => {
    router.push(navigation?.homePath || "/");
  };

  const handleSettings = () => {
    router.push(navigation?.settingsPath || "/settings");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-50 w-full h-20 bg-[#F5F4F1]/50 backdrop-blur-sm border-b border-gray-200/50 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          height={80}
          width={80}
          src="/logo.png"
          alt="Logo du site"
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>

      {/* Menu utilisateur */}
      <div className="flex items-center gap-4">
        <NotificationCenter />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-3 hover:bg-gray-200 rounded-xl p-2 transition-colors cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#111D4A] text-white font-semibold">
                {getInitials(user?.nom, user?.prenom)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900">
                {user?.prenom} {user?.nom}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {user?.statut === "eleve" && user?.niveau
                  ? `Élève - ${user.niveau.libelle}`
                  : user?.statut}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 rounded-xl bg-gray-100"
            align="end"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.mail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleProfile}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Ma page d'accueil</span>
            </DropdownMenuItem>
            {navigation?.menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <DropdownMenuItem
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className="cursor-pointer"
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuItem
              onClick={handleSettings}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Mes Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
