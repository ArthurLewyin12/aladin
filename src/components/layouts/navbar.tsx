"use client";
import { Button } from "../ui/button";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRouter } from "next/navigation";
import { useSession } from "@/services/hooks/auth/useSession";
import {
  User,
  LogOut,
  Settings,
  Home,
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

import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/services/hooks/use-media-query";

export default function NavBar() {
  const { scrollY } = useScroll();
  const { user, isLoading, logout } = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Sur mobile, désactiver les animations de scroll
  const width = useTransform(
    scrollY,
    [0, 100],
    isMobile ? ["100%", "100%"] : ["100%", "90%"],
  );
  const borderRadius = useTransform(
    scrollY,
    [0, 100],
    isMobile ? ["0px", "0px"] : ["0px", "20px"],
  );
  const top = useTransform(
    scrollY,
    [0, 100],
    isMobile ? ["0px", "0px"] : ["0px", "40px"],
  );
  const position = useTransform(
    scrollY,
    [0, 100],
    isMobile ? ["fixed", "fixed"] : ["fixed", "sticky"],
  );

  const router = useRouter();
  const pathname = usePathname();

  // Récupérer les initiales pour l'avatar
  const getInitials = (nom?: string, prenom?: string) => {
    if (!nom && !prenom) return "U";
    return `${nom?.[0] || ""}${prenom?.[0] || ""}`.toUpperCase();
  };

  const handleLogout = () => {
    logout();
    const publicPaths = ["/", "/tarifs"];
    // Ne rediriger que si l'utilisateur n'est pas sur une page publique
    if (!publicPaths.includes(pathname)) {
      router.push("/login");
    }
  };

  return (
    <motion.nav
      className="h-24 sm:h-28 border-b flex justify-between items-center gap-2 bg-center left-0 z-50 backdrop-blur-sm mx-auto"
      style={{
        backgroundImage: "url('/bg1.png')",
        backgroundSize: "30%",
        width,
        borderRadius,
        top,
        position: position as any,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Overlay pour l'opacité */}
      <div
        className="absolute inset-0 bg-white/80 z-0"
        style={{ borderRadius: "inherit" }}
      ></div>

      <div className="ml-4 md:ml-24 relative z-10">
        <Image
          height={80}
          width={80}
          src="/logo.png"
          alt="Logo du site"
          className="sm:h-[70px] sm:w-[70px] md:h-[80px] md:w-[80px] lg:h-[90px] lg:w-[90px] cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>

      <div className="mr-4 md:mr-24 flex gap-2 sm:gap-4 md:gap-8 relative z-10 items-center">
        {isLoading ? (
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full ring-2 ring-[#111D4A]/10 hover:ring-[#111D4A]/30 transition-all"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#111D4A] text-white font-semibold">
                    {getInitials(user.nom, user.prenom)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-gray-100 rounded-xl"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.prenom} {user.nom}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.mail}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground capitalize pt-1">
                    {user.statut === "eleve" && user.niveau
                      ? `Élève - ${user.niveau.libelle}`
                      : user.statut}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/student/home")}
                className="cursor-pointer"
              >
                <Home className="mr-2 h-4 w-4" />
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
                    <span>Mes révisions</span>
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
                onClick={() => router.push("/student/settings")}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button
              variant="ghost"
              className="transition-colors cursor-pointer text-black font-medium text-sm md:text-base px-2 sm:px-4"
              aria-label="Se connecter à votre compte"
              onClick={() => {
                router.push("/login");
              }}
            >
              Se connecter
            </Button>
            <Button
              className="px-3 sm:px-6 md:px-8 py-2 bg-[#111D4A] hover:bg-[#0d1640] rounded-md text-white cursor-pointer transition-colors text-sm md:text-base font-medium"
              aria-label="Créer un nouveau compte"
              onClick={() => {
                router.push("/register");
              }}
            >
              S'inscrire
            </Button>
          </>
        )}
      </div>
    </motion.nav>
  );
}
