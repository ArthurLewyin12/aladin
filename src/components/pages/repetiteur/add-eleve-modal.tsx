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
import { useAjouterEleveManuel, useNiveauxChoisis } from "@/services/hooks/repetiteur";
import { useCheckEleveByEmail } from "@/services/hooks/eleves/useCheckEleve";
import { useMediaQuery } from "@/services/hooks/use-media-query";
import { Loader2, Check } from "lucide-react";
import { isValidPhoneNumber } from "react-phone-number-input";

const eleveSchema = z.object({
  email: z.string({ message: "L'email est requis" }).email("Email invalide"),
  numero: z.string({ message: "Le numéro de téléphone est requis" }).refine(
    (val) => val && isValidPhoneNumber(val, "CI"),
    { message: "Numéro de téléphone ivoirien invalide" }
  ),
  nom: z.string({ message: "Le nom est requis" }).min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string({ message: "Le prénom est requis" }).min(2, "Le prénom doit contenir au moins 2 caractères"),
  niveau_id: z.number({ message: "Veuillez sélectionner un niveau" }).min(1, "Veuillez sélectionner un niveau"),
});

type EleveFormData = z.infer<typeof eleveSchema>;

interface AddEleveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  niveaux?: Array<{ id: number; libelle: string }>;
}

export const AddEleveModal = ({
  open,
  onOpenChange,
  niveaux = [],
}: AddEleveModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [eleveFound, setEleveFound] = useState<any>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EleveFormData>({
    resolver: zodResolver(eleveSchema),
  });

  const emailValue = watch("email");
  const numeroValue = watch("numero");
  const { mutate: ajouterEleveManuel, isPending } = useAjouterEleveManuel();
  const { mutate: checkEleve } = useCheckEleveByEmail();
  const { data: niveauxChoisisData } = useNiveauxChoisis();

  // Filtrer les niveaux pour ne garder que ceux choisis par le répétiteur
  const niveauxChoisisIds = niveauxChoisisData?.niveaux?.map((n: { id: number }) => n.id) || [];
  const niveauxFiltres = niveaux.filter(niveau => niveauxChoisisIds.includes(niveau.id));
  const hasNoNiveaux = niveauxFiltres.length === 0;

  // Vérifier l'email ou le numéro automatiquement lors de la saisie
  useEffect(() => {
    // Si aucun critère de recherche n'est rempli
    if ((!emailValue || emailValue.length < 5) && (!numeroValue || numeroValue.length < 8)) {
      setEleveFound(null);
      return;
    }

    // Vérifier si au moins l'email est valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasValidEmail = emailValue && emailRegex.test(emailValue);
    const hasValidNumero = numeroValue && numeroValue.length >= 8;

    if (!hasValidEmail && !hasValidNumero) {
      setEleveFound(null);
      return;
    }

    setIsCheckingEmail(true);
    const timeoutId = setTimeout(() => {
      // Priorité à l'email, sinon numéro
      const searchParam = hasValidEmail ? emailValue : numeroValue;

      checkEleve(searchParam, {
        onSuccess: (response) => {
          if (response.exists && response.eleve) {
            setEleveFound(response.eleve);
            // Auto-remplir les champs
            setValue("email", response.eleve.email);
            setValue("nom", response.eleve.nom);
            setValue("prenom", response.eleve.prenom);
            setValue("niveau_id", response.eleve.niveau_id);
            setValue("numero", response.eleve.numero || "");
          } else {
            setEleveFound(null);
          }
          setIsCheckingEmail(false);
        },
        onError: () => {
          setEleveFound(null);
          setIsCheckingEmail(false);
        },
      });
    }, 800); // Debounce de 800ms

    return () => clearTimeout(timeoutId);
  }, [emailValue, numeroValue, checkEleve, setValue]);

  const onSubmit = (data: EleveFormData) => {
    // Toujours utiliser la route d'ajout manuel
    // Les champs sont auto-remplis si un élève existant a été trouvé
    ajouterEleveManuel(data, {
      onSuccess: () => {
        reset();
        setEleveFound(null);
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    reset();
    setEleveFound(null);
    onOpenChange(false);
  };

  const FormContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
      {/* Alerte si aucun niveau */}
      {hasNoNiveaux && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            ⚠️ Vous devez d'abord configurer vos niveaux d'enseignement.
          </p>
        </div>
      )}

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
            disabled={!!eleveFound}
          />
          {isCheckingEmail && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          )}
          {eleveFound && (
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
          Numéro de téléphone
        </Label>
        <PhoneInput
          id="numero"
          defaultCountry="CI"
          countries={["CI"]}
          value={numeroValue}
          onChange={(value) => setValue("numero", value || "")}
          placeholder="07 XX XX XX XX"
          className="mt-1"
          disabled={!!eleveFound}
        />
        {errors.numero && (
          <p className="text-sm text-red-500">{errors.numero.message}</p>
        )}
        {eleveFound && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
            <p className="text-sm text-green-800">
              ✓ Élève existant trouvé : {eleveFound.prenom} {eleveFound.nom}
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
          disabled={!!eleveFound}
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
          disabled={!!eleveFound}
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
          disabled={!!eleveFound}
          value={eleveFound?.niveau_id?.toString()}
        >
          <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200">
            <SelectValue placeholder="Sélectionnez un niveau" />
          </SelectTrigger>
          <SelectContent>
            {niveauxFiltres.length > 0 ? (
              niveauxFiltres.map((niveau) => (
                <SelectItem key={niveau.id} value={niveau.id.toString()}>
                  {niveau.libelle}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500 text-center">
                Aucun niveau disponible
              </div>
            )}
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
          disabled={isPending || hasNoNiveaux}
          className="flex-1 bg-[#548C2F] hover:bg-[#4a7829] text-white rounded-lg"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Ajout en cours...
            </>
          ) : hasNoNiveaux ? (
            "Configurez vos niveaux d'abord"
          ) : eleveFound ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Ajouter cet élève
            </>
          ) : (
            "Ajouter l'élève"
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
            <DialogTitle className="text-2xl font-bold text-[#548C2F]">
              Ajouter un élève
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Remplissez les informations de votre élève
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
          <DrawerTitle className="text-2xl font-bold text-[#548C2F]">
            Ajouter un élève
          </DrawerTitle>
          <DrawerDescription className="text-gray-600">
            Remplissez les informations de votre élève
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">{FormContent}</div>
      </DrawerContent>
    </Drawer>
  );
};

