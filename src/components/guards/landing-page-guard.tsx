"use client";

import { useSession } from "@/services/hooks/auth/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export function LandingPageGuard() {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/student/home");
      } else {
        router.push("/login");
      }
    }
  }, [isLoading, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Spinner size="lg" />
    </div>
  );
}
