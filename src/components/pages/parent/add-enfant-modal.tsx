"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAjouterEnfantManuel } from "@/services/hooks/parent";
import { useMediaQuery } from "@/services/hooks/use-media-query";
import { Loader2 } from "lucide-react";

const enfantSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  niveau_id: z.number().min(1, "Veuillez sélectionner un niveau"),
  email: z.string().email("Email invalide"),
  numero: z.string().min(9, "Numéro de téléphone invalide"),
});

type EnfantFormData = z.infer<typeof enfantSchema>;

interface AddEnfantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  niveaux?: Array<{ id: number; libelle: string }>;
}

export const AddEnfantModal = ({
  open,
  onOpenChange,
  niveaux = [],
}: AddEnfantModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EnfantFormData>({
    resolver: zodResolver(enfantSchema),
  });

  const { mutate: ajouterEnfant, isPending } = useAjouterEnfantManuel();

  const onSubmit = (data: EnfantFormData) => {
    ajouterEnfant(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const FormContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
      {/* Nom */}
      <div className="space-y-2">
        <Label htmlFor="nom" className="text-sm text-gray-600">
          Nom
        </Label>
        <Input
          id="nom"
          {...register("nom")}
          placeholder="Nom de famille"
          className="mt-1 bg-gray-50 border-gray-200"
        />
        {errors.nom && (
          <p className="text-sm text-red-500">{errors.nom.message}</p>
        )}
      </div>

      {/* Prénom */}
      <div className="space-y-2">
        <Label htmlFor="prenom" className="text-sm text-gray-600">
          Prénom
        </Label>
        <Input
          id="prenom"
          {...register("prenom")}
          placeholder="Prénom"
          className="mt-1 bg-gray-50 border-gray-200"
        />
        {errors.prenom && (
          <p className="text-sm text-red-500">{errors.prenom.message}</p>
        )}
      </div>

      {/* Niveau */}
      <div className="space-y-2">
        <Label htmlFor="niveau_id" className="text-sm text-gray-600">
          Niveau scolaire
        </Label>
        <Select
          onValueChange={(value) => setValue("niveau_id", parseInt(value))}
        >
          <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200">
            <SelectValue placeholder="Sélectionnez un niveau" />
          </SelectTrigger>
          <SelectContent>
            {niveaux.map((niveau) => (
              <SelectItem key={niveau.id} value={niveau.id.toString()}>
                {niveau.libelle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.niveau_id && (
          <p className="text-sm text-red-500">{errors.niveau_id.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm text-gray-600">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="email@exemple.com"
          className="mt-1 bg-gray-50 border-gray-200"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Numéro */}
      <div className="space-y-2">
        <Label htmlFor="numero" className="text-sm text-gray-600">
          Numéro de téléphone
        </Label>
        <Input
          id="numero"
          {...register("numero")}
          placeholder="77 123 45 67"
          className="mt-1 bg-gray-50 border-gray-200"
        />
        {errors.numero && (
          <p className="text-sm text-red-500">{errors.numero.message}</p>
        )}
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          disabled={isPending}
          className="flex-1 rounded-lg border-gray-300 hover:bg-gray-50"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-[#2C3E50] hover:bg-[#1a252f] text-white rounded-lg"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Ajout en cours...
            </>
          ) : (
            "Ajouter l'enfant"
          )}
        </Button>
      </div>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] bg-gray-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2C3E50]">
              Ajouter un enfant
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Remplissez les informations de votre enfant
            </DialogDescription>
          </DialogHeader>
          {FormContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent className="bg-gray-50">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-bold text-[#2C3E50]">
            Ajouter un enfant
          </DrawerTitle>
          <DrawerDescription className="text-gray-600">
            Remplissez les informations de votre enfant
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">{FormContent}</div>
      </DrawerContent>
    </Drawer>
  );
};
