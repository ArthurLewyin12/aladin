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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/services/hooks/auth/useSession";
import { useRouter } from "next/navigation";

interface AccountHeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export function AccountHeader({
  userName = "Megan Forrest",
  userEmail = "megan@example.com",
  userAvatar,
}: AccountHeaderProps) {
  const router = useRouter();
  const { logout } = useSession();
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfile = () => {
    // Logique pour aller au profil
    console.log("Naviguer vers le profil");
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
          height={50}
          width={50}
          src="/logo.png"
          alt="Logo Aladin"
          className="md:h-[70px] md:w-[80px]"
        />
      </div>

      {/* Menu utilisateur */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-3 hover:bg-gray-200 rounded-lg p-2 transition-colors cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-rose-500 text-white font-semibold">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900">
                {userName}
              </span>
              <span className="text-xs text-gray-500">Terminale A2</span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleProfile}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleProfile}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
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
