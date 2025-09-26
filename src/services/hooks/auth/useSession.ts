import { useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { User } from "@/services/controllers/types/auth.types";
import ENVIRONNEMENTS from "@/constants/environnement";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  logout as apiLogout,
} from "@/services/controllers/auth.controller";

export const useSession = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isLoadingUser,
    isError,
    refetch,
  } = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      const userCookie = Cookies.get("user_" + ENVIRONNEMENTS.UNIVERSE);
      if (userCookie) {
        return JSON.parse(userCookie) as User;
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
    queryClient.setQueryData(["me"], userData);
  };

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      toast.info("Vous avez été déconnecté.");
      Cookies.remove("token_" + ENVIRONNEMENTS.UNIVERSE);
      Cookies.remove("user_" + ENVIRONNEMENTS.UNIVERSE);
      queryClient.setQueryData(["me"], null);
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Logout error", error);

      Cookies.remove("token_" + ENVIRONNEMENTS.UNIVERSE);
      Cookies.remove("user_" + ENVIRONNEMENTS.UNIVERSE);
      queryClient.setQueryData(["me"], null);
      queryClient.invalidateQueries();
    },
  });

  useEffect(() => {
    if (!isLoadingUser && isError) {
      //redirigier optionnnelement vers login si erreur
      // router.push('/login');
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
