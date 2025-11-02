"use client";

import { useEffect, useState } from "react";
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
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAjouterEnfantManuel } from "@/services/hooks/parent";
import { useCheckEleveByEmail } from "@/services/hooks/eleves/useCheckEleve";
import { useMediaQuery } from "@/services/hooks/use-media-query";
import { Loader2, Check } from "lucide-react";
import { isValidPhoneNumber } from "react-phone-number-input";

const enfantSchema = z.object({
  email: z.string().email("Email invalide"),
  numero: z.string().refine(
    (val) => val && isValidPhoneNumber(val, "CI"),
    { message: "Numéro de téléphone ivoirien invalide" }
  ),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  niveau_id: z.number().min(1, "Veuillez sélectionner un niveau"),
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
  const [enfantFound, setEnfantFound] = useState<any>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EnfantFormData>({
    resolver: zodResolver(enfantSchema),
  });

  const emailValue = watch("email");
  const numeroValue = watch("numero");
  const { mutate: ajouterEnfantManuel, isPending } = useAjouterEnfantManuel();
  const { mutate: checkEleve } = useCheckEleveByEmail();

  // Vérifier l'email ou le numéro automatiquement lors de la saisie
  useEffect(() => {
    // Si aucun critère de recherche n'est rempli
    if ((!emailValue || emailValue.length < 5) && (!numeroValue || numeroValue.length < 8)) {
      setEnfantFound(null);
      return;
    }

    // Vérifier si au moins l'email est valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasValidEmail = emailValue && emailRegex.test(emailValue);
    const hasValidNumero = numeroValue && numeroValue.length >= 8;

    if (!hasValidEmail && !hasValidNumero) {
      setEnfantFound(null);
      return;
    }

    setIsCheckingEmail(true);
    const timeoutId = setTimeout(() => {
      // Priorité à l'email, sinon numéro
      const searchParam = hasValidEmail ? emailValue : numeroValue;

      checkEleve(searchParam, {
        onSuccess: (response) => {
          if (response.exists && response.eleve) {
            setEnfantFound(response.eleve);
            // Auto-remplir les champs
            setValue("email", response.eleve.email);
            setValue("nom", response.eleve.nom);
            setValue("prenom", response.eleve.prenom);
            setValue("niveau_id", response.eleve.niveau_id);
            setValue("numero", response.eleve.numero || "");
          } else {
            setEnfantFound(null);
          }
          setIsCheckingEmail(false);
        },
        onError: () => {
          setEnfantFound(null);
          setIsCheckingEmail(false);
        },
      });
    }, 800); // Debounce de 800ms

    return () => clearTimeout(timeoutId);
  }, [emailValue, numeroValue, checkEleve, setValue]);

  const onSubmit = (data: EnfantFormData) => {
    // Toujours utiliser la route d'ajout manuel
    // Les champs sont auto-remplis si un enfant existant a été trouvé
    ajouterEnfantManuel(data, {
      onSuccess: () => {
        reset();
        setEnfantFound(null);
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    reset();
    setEnfantFound(null);
    onOpenChange(false);
  };

  const FormContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
      {/* Email - EN PREMIER */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm text-gray-600">
          Email
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="email@exemple.com"
            className="mt-1 bg-gray-50 border-gray-200"
            disabled={!!enfantFound}
          />
          {isCheckingEmail && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          )}
          {enfantFound && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="w-5 h-5 text-green-600" />
            </div>
          )}
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Numéro - EN DEUXIÈME */}
      <div className="space-y-2">
        <Label htmlFor="numero" className="text-sm text-gray-600">
          Numéro de téléphonhe
        </Label>
        <PhoneInput
          id="numero"
          defaultCountry="CI"
          countries={["CI"]}
          value={numeroValue}
          onChange={(value) => setValue("numero", value || "")}
          placeholder="07 XX XX XX XX"
          className="mt-1 h-2!"
          disabled={!!enfantFound}
        />
        {errors.numero && (
          <p className="text-sm text-red-500">{errors.numero.message}</p>
        )}
        {enfantFound && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
            <p className="text-sm text-green-800">
              ✓ Enfant existant trouvé : {enfantFound.prenom} {enfantFound.nom}
            </p>
          </div>
        )}
      </div>

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
          disabled={!!enfantFound}
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
          disabled={!!enfantFound}
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
          disabled={!!enfantFound}
          value={enfantFound?.niveau_id?.toString()}
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
          ) : enfantFound ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Ajouter cet enfant
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
