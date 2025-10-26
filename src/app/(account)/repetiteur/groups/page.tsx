"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X } from "lucide-react";
import Image from "next/image";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GroupList } from "@/components/pages/groups/group-list";
import { useGroupes } from "@/services/hooks/groupes/useGroupes";
import { useCreateGroupe } from "@/services/hooks/groupes/useCreateGroupe";
import { useEleves, useNiveauxChoisis } from "@/services/hooks/repetiteur";
import { useMediaQuery } from "@/services/hooks/use-media-query";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormContentProps {
  groupName: string;
  setGroupName: (value: string) => void;
  groupDescription: string;
  setGroupDescription: (value: string) => void;
  niveauId: string;
  setNiveauId: (value: string) => void;
  isCreatingGroup: boolean;
  niveaux: any[];
}

const FormContent = ({
  groupName,
  setGroupName,
  groupDescription,
  setGroupDescription,
  niveauId,
  setNiveauId,
  isCreatingGroup,
  niveaux,
}: FormContentProps) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="groupName" className="text-sm text-gray-600">
        Nom du groupe*
      </Label>
      <Input
        id="groupName"
        placeholder="Nom du groupe*"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="mt-1 bg-gray-50 border-gray-200"
        disabled={isCreatingGroup}
      />
    </div>

    <div>
      <Label htmlFor="niveau" className="text-sm text-gray-600">
        Niveau scolaire*
      </Label>
      <Select value={niveauId} onValueChange={setNiveauId} disabled={isCreatingGroup}>
        <SelectTrigger className="mt-1 bg-gray-50 border-gray-200">
          <SelectValue placeholder="Sélectionner un niveau" />
        </SelectTrigger>
        <SelectContent>
          {niveaux.map((niveau) => (
            <SelectItem key={niveau.id} value={niveau.id.toString()}>
              {niveau.libelle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="description" className="text-sm text-gray-600">
        Description du groupe
      </Label>
      <Textarea
        id="description"
        placeholder="Description du groupe"
        value={groupDescription}
        onChange={(e) => setGroupDescription(e.target.value)}
        rows={4}
        className="mt-1 bg-gray-50 border-gray-200 resize-none"
        disabled={isCreatingGroup}
      />
    </div>
  </div>
);

export default function RepetiteurGroupsPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [niveauId, setNiveauId] = useState("");

  const { data: elevesData } = useEleves();
  const { data: niveauxChoisis, isLoading: isLoadingNiveaux } = useNiveauxChoisis();
  const { mutate: createGroupeMutation, isPending: isCreatingGroup } =
    useCreateGroupe();
  const { data: groupes, isLoading, isError } = useGroupes();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const eleveActif = elevesData?.eleve_actif;
  const niveaux = niveauxChoisis?.niveaux || [];

  const handleBack = () => {
    router.push("/repetiteur/home");
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast({
        variant: "warning",
        message: "Le nom du groupe ne peut pas être vide.",
      });
      return;
    }

    if (!niveauId) {
      toast({
        variant: "error",
        message: "Veuillez sélectionner un niveau scolaire.",
      });
      return;
    }

    createGroupeMutation(
      {
        nom: groupName,
        description: groupDescription,
        niveau_id: niveauId,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setGroupName("");
          setGroupDescription("");
          setNiveauId("");
        },
      },
    );
  };

  const handleCancel = () => {
    setIsOpen(false);
    setGroupName("");
    setGroupDescription("");
    setNiveauId("");
  };

  if (isLoading || isLoadingNiveaux) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">
            Une erreur est survenue lors du chargement des groupes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header avec bouton retour et titre */}
        <div
          className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
          style={{
            backgroundImage: `url("/bg-2.png")`,
            backgroundSize: "180px 180px",
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full bg-white hover:bg-gray-50 w-10 h-10 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#548C2F]">
                Groupes d'étude
              </h1>
            </div>
          </div>
        </div>

        {/* Afficher l'élève actif */}
        {eleveActif && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[20px]">
            <p className="text-sm text-gray-700">
              Groupes pour :{" "}
              <span className="font-semibold text-[#548C2F]">
                {eleveActif.prenom} {eleveActif.nom}
              </span>{" "}
              ({eleveActif.niveau?.libelle})
            </p>
          </div>
        )}

        {groupes && groupes.length > 0 ? (
          // Scénario: Des groupes sont présents
          <GroupList
            basePath="/repetiteur/groups"
            onCreateGroup={() => setIsOpen(true)}
            showCreateButton={true} // Les répétiteurs peuvent créer des groupes
            variant="repetiteur" // Mode répétiteur
          />
        ) : (
          // Scénario: Aucun groupe (contenu placeholder original)
          <>
            {/* Description originale */}
            <div className="text-center mb-12">
              <p className="text-gray-600 text-base sm:text-lg max-w-4xl mx-auto leading-relaxed">
                Créez un groupe d'étude pour votre élève, invitez d'autres
                répétiteurs ou élèves et permettez-leur d'apprendre ensemble.
                Posez des questions, créez des quiz en groupe et suivez les
                progrès de chacun.
              </p>
            </div>

            {/* Illustration centrale originale */}
            <div className="flex flex-col items-center gap-8 mt-16">
              <div className="relative w-full max-w-2xl">
                <Image
                  src="/group.png"
                  alt="Groupe d'étude illustration"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>

              {/* Texte et bouton CTA originaux */}
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-6">
                  Cliquez ci-dessous pour créer le premier groupe de votre
                  élève !
                </p>

                <Button
                  size="lg"
                  onClick={() => setIsOpen(true)}
                  disabled={niveaux.length === 0}
                  className="bg-[#548C2F] hover:bg-[#4a7829] text-white px-8 py-6 text-lg rounded-lg shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Créer un groupe
                </Button>

                {niveaux.length === 0 && (
                  <p className="text-sm text-red-600 mt-4">
                    Veuillez d'abord configurer vos niveaux d'enseignement
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal pour Desktop/Tablette */}
      {isDesktop && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#548C2F]">
                Créer un groupe
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <FormContent
                groupName={groupName}
                setGroupName={setGroupName}
                groupDescription={groupDescription}
                setGroupDescription={setGroupDescription}
                niveauId={niveauId}
                setNiveauId={setNiveauId}
                isCreatingGroup={isCreatingGroup}
                niveaux={niveaux}
              />
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <Button variant="ghost" onClick={handleCancel} className="px-6">
                Annuler
              </Button>
              <Button
                onClick={handleCreateGroup}
                className="bg-[#548C2F] hover:bg-[#4a7829] text-white px-8"
                disabled={isCreatingGroup}
              >
                {isCreatingGroup ? <Spinner /> : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Drawer pour Mobile */}
      {!isDesktop && (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="bg-white max-h-[90vh]">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-2xl font-bold text-[#548C2F]">
                Créer un groupe
              </DrawerTitle>
              <DrawerClose className="absolute right-4 top-4">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DrawerClose>
            </DrawerHeader>

            <div className="px-4 pb-4 overflow-y-auto">
              <FormContent
                groupName={groupName}
                setGroupName={setGroupName}
                groupDescription={groupDescription}
                setGroupDescription={setGroupDescription}
                niveauId={niveauId}
                setNiveauId={setNiveauId}
                isCreatingGroup={isCreatingGroup}
                niveaux={niveaux}
              />
            </div>

            <DrawerFooter className="flex-row gap-3 justify-end">
              <Button variant="ghost" onClick={handleCancel} className="flex-1">
                Annuler
              </Button>
              <Button
                onClick={handleCreateGroup}
                className="bg-[#548C2F] hover:bg-[#4a7829] text-white flex-1"
                disabled={isCreatingGroup}
              >
                {isCreatingGroup ? <Spinner /> : "Créer"}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
