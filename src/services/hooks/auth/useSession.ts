import { useEffect } from "react";
import { toast } from "@/lib/toast";
import Cookies from "js-cookie";
import { User } from "@/services/controllers/types/auth.types";
import ENVIRONNEMENTS from "@/constants/environnement";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  logout as apiLogout,
} from "@/services/controllers/auth.controller";
import { createQueryKey } from "@/lib/request";

/**
 * Hook de gestion de la session utilisateur.
 * Gère l'état de connexion, les données de l'utilisateur et les actions de connexion/déconnexion.
 * Tente de récupérer l'utilisateur depuis les cookies, sinon depuis l'API.
 *
 * @returns Un objet contenant :
 * - `user`: Les données de l'utilisateur ou `null`.
 * - `login`: Une fonction pour mettre à jour manuellement les données utilisateur après connexion.
 * - `logout`: Une fonction pour déclencher la déconnexion.
 * - `isLoading`: Un booléen indiquant si la session est en cours de chargement ou de déconnexion.
 * - `isLoggedIn`: Un booléen indiquant si l'utilisateur est connecté.
 */
export const useSession = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isLoadingUser,
    isError,
  } = useQuery<User | null>({
    queryKey: createQueryKey("me"),
    queryFn: async () => {
      const userCookie = Cookies.get("user_" + ENVIRONNEMENTS.UNIVERSE);
      if (userCookie) {
        return JSON.parse(userCookie) as User;
      }

      const token = Cookies.get("token_" + ENVIRONNEMENTS.UNIVERSE);
      if (!token) {
        return null; // Pas de token, pas besoin d'appeler getMe
      }

      try {
        const fetchedUser = await getMe();
        Cookies.set(
          "user_" + ENVIRONNEMENTS.UNIVERSE,
          JSON.stringify(fetchedUser),
        );
        return fetchedUser;
      } catch (error) {
        Cookies.remove("token_" + ENVIRONNEMENTS.UNIVERSE);
        Cookies.remove("user_" + ENVIRONNEMENTS.UNIVERSE);
        return null;
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const login = (userData: User) => {
    Cookies.set("user_" + ENVIRONNEMENTS.UNIVERSE, JSON.stringify(userData));
    queryClient.setQueryData(createQueryKey("me"), userData);
  };

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Déconnexion",
        message: "Vous avez été déconnecté.",
      });
      Cookies.remove("token_" + ENVIRONNEMENTS.UNIVERSE);
      Cookies.remove("user_" + ENVIRONNEMENTS.UNIVERSE);
      queryClient.setQueryData(createQueryKey("me"), null);
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Logout error", error);
      Cookies.remove("token_" + ENVIRONNEMENTS.UNIVERSE);
      Cookies.remove("user_" + ENVIRONNEMENTS.UNIVERSE);
      queryClient.setQueryData(createQueryKey("me"), null);
      queryClient.invalidateQueries();
    },
  });

  useEffect(() => {
    if (!isLoadingUser && isError) {
      // Optionnellement, rediriger vers la page de connexion si une erreur survient.
    }
  }, [isLoadingUser, isError]);

  return {
    user,
    login,
    logout: logoutMutation.mutate,
    isLoading: isLoadingUser || logoutMutation.isPending,
    isLoggedIn: !!user,
  };
};
