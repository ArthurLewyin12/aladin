"use client";

import { useSession } from "@/services/hooks/auth/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { AuthError } from "./auth-error";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <AuthError />;
  }

  return <>{children}</>;
}
