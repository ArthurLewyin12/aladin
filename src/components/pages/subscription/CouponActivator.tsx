"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActivateCoupon } from "@/services/hooks/auth/useActivateCoupon";
import { Spinner } from "@/components/ui/spinner";

export default function CouponActivator() {
  const [couponCode, setCouponCode] = useState("");
  const router = useRouter();
  const { mutate: activateCoupon, isPending: isLoading } = useActivateCoupon();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error("Veuillez entrer un code de coupon.");
      return;
    }

    activateCoupon(
      { coupon_code: couponCode.trim().toUpperCase() },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Coupon activé avec succès !");
          // On pourrait vouloir rafraîchir la page ou les données de la session
          // pour que le changement de statut soit immédiatement visible.
          router.refresh();
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            "Une erreur est survenue lors de l'activation du coupon.";
          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="coupon-code">Code promo</Label>
        <Input
          id="coupon-code"
          type="text"
          placeholder="Ex: ABCD-1234-EFGH"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#111D4A] text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Activation...
          </>
        ) : (
          "Activer le coupon"
        )}
      </Button>
    </form>
  );
}
