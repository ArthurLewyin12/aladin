"use client";

import { useState, useCallback, useEffect } from "react";
import { X, UserPlus, Mail, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAddMember } from "@/services/hooks/professeur/useAddMember";
import { useCheckEleve } from "@/services/hooks/professeur/useCheckEleve";
import { toast } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNiveaux } from "@/services/hooks/niveaux/useNiveaux";
import { useDebounce } from "@/services/hooks/useDebounce";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classeId: number;
  classeName: string;
  classeNiveauId?: number;
  cardColor?: string;
  isMobile?: boolean;
}

export const AddStudentModal = ({
  isOpen,
  onClose,
  classeId,
  classeName,
  classeNiveauId,
  cardColor = "bg-[#D4F4DD]",
  isMobile = false,
}: AddStudentModalProps) => {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [numero, setNumero] = useState("");
  const [parentMail, setParentMail] = useState("");
  const [parentNumero, setParentNumero] = useState("");
  const [eleveFound, setEleveFound] = useState<any>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const debouncedEmail = useDebounce(email, 800);

  const { mutate: addMemberMutation, isPending } = useAddMember();
  const { mutate: checkEleveMutation } = useCheckEleve();

  // Vérifier l'email automatiquement lors de la saisie
  useEffect(() => {
    if (!debouncedEmail || debouncedEmail.length < 5) {
      setEleveFound(null);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(debouncedEmail)) {
      setEleveFound(null);
      return;
    }

    setIsCheckingEmail(true);
    checkEleveMutation(debouncedEmail, {
      onSuccess: (response) => {
        if (response.exists && response.eleve) {
          setEleveFound(response.eleve);
          // Auto-remplir les champs (sauf niveau, pas besoin)
          setNom(response.eleve.nom);
          setPrenom(response.eleve.prenom);
          setNumero(response.eleve.numero || "");
          setParentMail(response.eleve.parent_mail || "");
          setParentNumero(response.eleve.parent_numero || "");
        } else {
          setEleveFound(null);
          // Réinitialiser les champs si l'élève n'existe pas
          setNom("");
          setPrenom("");
          setNumero("");
          setParentMail("");
          setParentNumero("");
        }
        setIsCheckingEmail(false);
      },
      onError: () => {
        setEleveFound(null);
        setIsCheckingEmail(false);
      },
    });
  }, [debouncedEmail, checkEleveMutation]);

  const handleSubmit = useCallback(() => {
    if (!email.trim()) {
      toast({
        variant: "error",
        message: "L'email est requis",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "error",
        message: "Format d'email invalide",
      });
      return;
    }

    // Si l'élève existe déjà, on envoie juste l'email
    if (eleveFound) {
      addMemberMutation(
        {
          classeId,
          payload: { email },
        },
        {
          onSuccess: () => {
            handleReset();
            onClose();
          },
        },
      );
    } else {
      // Sinon, on envoie un élève manuel
      if (!nom.trim() || !prenom.trim()) {
        toast({
          variant: "error",
          message:
            "Veuillez remplir tous les champs obligatoires (nom et prénom)",
        });
        return;
      }

      if (!classeNiveauId) {
        toast({
          variant: "error",
          message:
            "Impossible d'ajouter l'élève: niveau de la classe non défini",
        });
        return;
      }

      addMemberMutation(
        {
          classeId,
          payload: {
            email,
            nom: nom.trim(),
            prenom: prenom.trim(),
            niveau_id: classeNiveauId,
            numero: numero.trim() || undefined,
            parent_mail: parentMail.trim() || undefined,
            parent_numero: parentNumero.trim() || undefined,
          },
        },
        {
          onSuccess: () => {
            handleReset();
            onClose();
          },
        },
      );
    }
  }, [
    email,
    nom,
    prenom,
    numero,
    parentMail,
    parentNumero,
    eleveFound,
    classeId,
    classeNiveauId,
    addMemberMutation,
    onClose,
  ]);

  const handleReset = useCallback(() => {
    setEmail("");
    setNom("");
    setPrenom("");
    // setNiveauId("");
    setNumero("");
    setParentMail("");
    setParentNumero("");
    setEleveFound(null);
  }, []);

  const handleCancel = useCallback(() => {
    handleReset();
    onClose();
  }, [handleReset, onClose]);

  // Version Desktop (Dialog)
  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className={`sm:max-w-[550px] ${cardColor} border-none`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              Ajouter un élève à {classeName}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email de l'élève *
              </Label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-gray-200"
                  disabled={isPending}
                />
                {isCheckingEmail && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              {eleveFound && (
                <p className="text-sm text-green-600">
                  ✓ Élève trouvé : {eleveFound.prenom} {eleveFound.nom}
                </p>
              )}
            </div>

            {/* Champs pour nouvel élève (affichés si élève non trouvé) */}
            {!eleveFound && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Nom *
                    </Label>
                    <Input
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="bg-white border-gray-200"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Prénom *
                    </Label>
                    <Input
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="bg-white border-gray-200"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Numéro de téléphone
                  </Label>
                  <Input
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="+2250700000000"
                    className="bg-white border-gray-200"
                    disabled={isPending}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Email parent
                    </Label>
                    <Input
                      type="email"
                      value={parentMail}
                      onChange={(e) => setParentMail(e.target.value)}
                      className="bg-white border-gray-200"
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Numéro parent
                    </Label>
                    <Input
                      value={parentNumero}
                      onChange={(e) => setParentNumero(e.target.value)}
                      placeholder="+2250700000000"
                      className="bg-white border-gray-200"
                      disabled={isPending}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="px-6"
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
              disabled={isPending || isCheckingEmail}
            >
              {isPending ? (
                <>
                  <Spinner size="sm" className="mr-2 border-white" />
                  Ajout...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ajouter l'élève
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Version Mobile (Drawer)
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DrawerContent className={`${cardColor} max-h-[90vh]`}>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            Ajouter un élève
          </DrawerTitle>
          <DrawerClose className="absolute right-4 top-4">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-4 overflow-y-auto space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email de l'élève *
            </Label>
            <div className="relative">
              <Input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-gray-200"
                disabled={isPending}
              />
              {isCheckingEmail && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            {eleveFound && (
              <p className="text-sm text-green-600">
                ✓ Élève trouvé : {eleveFound.prenom} {eleveFound.nom}
              </p>
            )}
          </div>

          {/* Champs pour nouvel élève */}
          {!eleveFound && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Nom *
                  </Label>
                  <Input
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="bg-white border-gray-200"
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Prénom *
                  </Label>
                  <Input
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="bg-white border-gray-200"
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Numéro de téléphone
                </Label>
                <Input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="+2250700000000"
                  className="bg-white border-gray-200"
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Email parent
                  </Label>
                  <Input
                    type="email"
                    value={parentMail}
                    onChange={(e) => setParentMail(e.target.value)}
                    className="bg-white border-gray-200"
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Numéro parent
                  </Label>
                  <Input
                    value={parentNumero}
                    onChange={(e) => setParentNumero(e.target.value)}
                    placeholder="+2250700000000"
                    className="bg-white border-gray-200"
                    disabled={isPending}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <DrawerFooter className="flex-row gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex-1"
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white flex-1"
            disabled={isPending || isCheckingEmail}
          >
            {isPending ? (
              <>
                <Spinner size="sm" className="mr-2 border-white" />
                Ajout...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter
              </>
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
