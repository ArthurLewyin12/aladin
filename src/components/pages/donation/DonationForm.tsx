"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useInitiateDonation } from "@/services/hooks/donateurs/useInitiateDonation";
import type { InitiateDonationPayload } from "@/services/controllers/types/common/donateur.type";
import { CURRENCY, STUDENT_SUBSCRIPTION_AMOUNT } from "@/constants/payment";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DONATION_AMOUNTS = [10, 25, 50, 100];

export default function DonationForm() {
  const [formData, setFormData] = useState<
    Omit<InitiateDonationPayload, "currency">
  >({
    type: "particulier",
    nom: "",
    email: "",
    nombre_coupons: 10,
  });
  const [customAmount, setCustomAmount] = useState("");

  const { mutate: initiateDonation, isPending: isLoading } =
    useInitiateDonation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value as "particulier" | "entreprise",
    }));
  };

  const handleAmountClick = (amount: number) => {
    setFormData((prev) => ({ ...prev, nombre_coupons: amount }));
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setFormData((prev) => ({
        ...prev,
        nombre_coupons: parseInt(value, 10) || 0,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nombre_coupons <= 0) {
      toast.error("Le nombre de coupons doit être supérieur à zéro.");
      return;
    }

    initiateDonation(
      { ...formData, currency: CURRENCY },
      {
        onSuccess: () => {
          toast.success(
            "Demande enregistrée. Redirection vers la page de paiement en cours...",
          );
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message || "Une erreur est survenue.";
          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Soutenir un élève</CardTitle>
        <CardDescription>
          Chaque coupon offert est une porte ouverte vers la connaissance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Je suis un(e)</Label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={handleTypeChange}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particulier">Particulier</SelectItem>
                  <SelectItem value="entreprise">Entreprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom complet ou Raison sociale</Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <Label>Nombre de coupons à offrir</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {DONATION_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={
                    formData.nombre_coupons === amount && !customAmount
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleAmountClick(amount)}
                  disabled={isLoading}
                >
                  {amount}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Ou entrez un montant personnalisé"
              value={customAmount}
              onChange={handleCustomAmountChange}
              disabled={isLoading}
              min="1"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              `Faire un don de ${formData.nombre_coupons * STUDENT_SUBSCRIPTION_AMOUNT} ${CURRENCY}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
