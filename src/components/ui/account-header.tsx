"use client";
import Image from "next/image";
import {
  User,
  LogOut,
  Settings,
  BookOpen,
  ClipboardList,
  BarChart3,
} from "lucide-react";
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
import { NotificationsBell } from "@/components/pages/groups/notification-group";

export function AccountHeader() {
  const router = useRouter();
  const { user, logout } = useSession();

  const getInitials = (nom?: string, prenom?: string) => {
    if (!nom && !prenom) return "U";
    return `${nom?.[0] || ""}${prenom?.[0] || ""}`.toUpperCase();
  };

  const handleProfile = () => {
    router.push("/student/home");
  };

  const handleSettings = () => {
    router.push("/student/settings");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="w-full h-20 bg-[#F5F4F1] border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          height={80}
          width={80}
          src="/logo.png"
          alt="Logo du site"
          className="sm:h-[60px] sm:w-[60px] md:h-[70px] md:w-[70px] lg:h-[80px] lg:w-[80px] cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>

      {/* Menu utilisateur */}
      <div className="flex items-center gap-4">
        <NotificationsBell />
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
            {user?.statut === "eleve" && (
              <>
                <DropdownMenuItem
                  onClick={() => router.push("/student/dashboard")}
                  className="cursor-pointer"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Mon tableau de bord</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/student/revision")}
                  className="cursor-pointer"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>Mes cours</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/student/quiz")}
                  className="cursor-pointer"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Mes quiz</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/student/groups")}
                  className="cursor-pointer"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Mes groupes</span>
                </DropdownMenuItem>
              </>
            )}
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
