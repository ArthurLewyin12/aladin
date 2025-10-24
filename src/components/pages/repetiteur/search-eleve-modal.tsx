"use client";

import { useState } from "react";
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
import { useRechercherEleve, useAjouterEleveUtilisateur } from "@/services/hooks/repetiteur";
import { useMediaQuery } from "@/services/hooks/use-media-query";
import { Loader2, User, Check, X } from "lucide-react";
import { toast } from "@/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";

const searchSchema = z.object({
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  numero: z.string().optional().or(z.literal("")),
}).refine((data) => data.email || data.numero, {
  message: "Veuillez fournir au moins un email ou un numéro",
  path: ["email"],
});

type SearchFormData = z.infer<typeof searchSchema>;

interface SearchEleveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchEleveModal = ({
  open,
  onOpenChange,
}: SearchEleveModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [eleveFound, setEleveFound] = useState<any>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  });

  const { mutate: rechercherEleve, isPending: isSearching } =
    useRechercherEleve();
  const { mutate: ajouterEleve, isPending: isAdding } =
    useAjouterEleveUtilisateur();

  const onSearch = (data: SearchFormData) => {
    const payload: any = {};
    if (data.email) payload.email = data.email;
    if (data.numero) payload.numero = data.numero;

    rechercherEleve(payload, {
      onSuccess: (response) => {
        if (response.eleve) {
          setEleveFound(response.eleve);
          toast({
            variant: "success",
            title: "Élève trouvé",
            message: `${response.eleve.prenom} ${response.eleve.nom} a été trouvé`,
          });
        } else {
          setEleveFound(null);
          toast({
            variant: "error",
            title: "Aucun élève trouvé",
            message: response.message || "Aucun élève ne correspond à ces critères",
          });
        }
      },
      onError: (error: any) => {
        setEleveFound(null);
        toast({
          variant: "error",
          title: "Erreur",
          message:
            error?.response?.data?.message || "Erreur lors de la recherche",
        });
      },
    });
  };

  const handleAddEleve = () => {
    if (!eleveFound) return;

    ajouterEleve(
      { eleve_id: eleveFound.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: createQueryKey("eleves"),
          });
          toast({
            variant: "success",
            title: "Succès",
            message: "Élève ajouté avec succès",
          });
          handleClose();
        },
        onError: (error: any) => {
          toast({
            variant: "error",
            title: "Erreur",
            message:
              error?.response?.data?.message || "Erreur lors de l'ajout de l'élève",
          });
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    setEleveFound(null);
    onOpenChange(false);
  };

  const FormContent = (
    <div className="space-y-5 mt-4">
      {!eleveFound ? (
        <form onSubmit={handleSubmit(onSearch)} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-gray-600">
              Email de l'élève
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
              Numéro de téléphone de l'élève
            </Label>
            <Input
              id="numero"
              {...register("numero")}
              placeholder="+225 77 123 45 67"
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
              disabled={isSearching}
              className="flex-1 rounded-lg border-gray-300 hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSearching}
              className="flex-1 bg-[#548C2F] hover:bg-[#4a7829] text-white rounded-lg"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Recherche...
                </>
              ) : (
                "Rechercher"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Élève trouvé */}
          <div className="bg-[#F0F7EC] border border-[#C8E0B8] rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-[#E3F1D9] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-[#548C2F]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {eleveFound.prenom} {eleveFound.nom}
                </h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {eleveFound.email}
                  </p>
                  {eleveFound.numero && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Téléphone:</span>{" "}
                      {eleveFound.numero}
                    </p>
                  )}
                  {eleveFound.niveau && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Niveau:</span>{" "}
                      {eleveFound.niveau.libelle}
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-[#548C2F] rounded-full p-2">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEleveFound(null)}
              disabled={isAdding}
              className="flex-1 rounded-lg border-gray-300 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Rechercher un autre
            </Button>
            <Button
              onClick={handleAddEleve}
              disabled={isAdding}
              className="flex-1 bg-[#548C2F] hover:bg-[#4a7829] text-white rounded-lg"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ajout...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Ajouter cet élève
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] bg-gray-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#548C2F]">
              Rechercher un élève
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Recherchez un élève existant par email ou numéro de téléphone
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
            Rechercher un élève
          </DrawerTitle>
          <DrawerDescription className="text-gray-600">
            Recherchez un élève existant par email ou numéro de téléphone
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">{FormContent}</div>
      </DrawerContent>
    </Drawer>
  );
};

