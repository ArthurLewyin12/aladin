"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClasseList } from "@/components/pages/teacher-classes/classe-list";
import { useClasses } from "@/services/hooks/professeur/useClasses";
import { useCreateClasse } from "@/services/hooks/professeur/useCreateClasse";
import { useNiveaux } from "@/services/hooks/niveaux/useNiveaux";
import { useSubjects } from "@/services/hooks/professeur/useSubjects";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/lib/toast";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";

interface FormContentProps {
  classeName: string;
  setClasseName: (value: string) => void;
  classeDescription: string;
  setClasseDescription: (value: string) => void;
  selectedNiveau: string;
  setSelectedNiveau: (value: string) => void;
  selectedMatieres: number[];
  setSelectedMatieres: (value: number[]) => void;
  isCreatingClasse: boolean;
  niveaux: any[];
  matieres: any[];
  isLoadingMatieres: boolean;
}

const FormContent = ({
  classeName,
  setClasseName,
  classeDescription,
  setClasseDescription,
  selectedNiveau,
  setSelectedNiveau,
  selectedMatieres,
  setSelectedMatieres,
  isCreatingClasse,
  niveaux,
  matieres,
  isLoadingMatieres,
}: FormContentProps) => {
  const toggleMatiere = (matiereId: number) => {
    if (selectedMatieres.includes(matiereId)) {
      setSelectedMatieres(selectedMatieres.filter((id) => id !== matiereId));
    } else {
      if (selectedMatieres.length >= 3) {
        toast({
          variant: "warning",
          message: "Vous ne pouvez sélectionner que 3 matières maximum.",
        });
        return;
      }
      setSelectedMatieres([...selectedMatieres, matiereId]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="classeName" className="text-sm text-gray-600">
          Nom de la classe*
        </Label>
        <Input
          id="classeName"
          placeholder="Ex: Terminale S1"
          value={classeName}
          onChange={(e) => setClasseName(e.target.value)}
          className="mt-1 bg-gray-50 border-gray-200"
          disabled={isCreatingClasse}
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-sm text-gray-600">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Description de la classe"
          value={classeDescription}
          onChange={(e) => setClasseDescription(e.target.value)}
          rows={3}
          className="mt-1 bg-gray-50 border-gray-200 resize-none"
          disabled={isCreatingClasse}
        />
      </div>

      <div>
        <Label htmlFor="niveau" className="text-sm text-gray-600">
          Niveau*
        </Label>
        <Select
          value={selectedNiveau}
          onValueChange={setSelectedNiveau}
          disabled={isCreatingClasse}
        >
          <SelectTrigger className="mt-1 bg-gray-50 border-gray-200 w-full">
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

      {selectedNiveau && (
        <div>
          <Label className="text-sm text-gray-600">Matières* (max 3)</Label>
          {isLoadingMatieres ? (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
            </div>
          ) : matieres.length > 0 ? (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {matieres.map((matiere) => (
                <div
                  key={matiere.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                >
                  <Checkbox
                    id={`matiere-${matiere.id}`}
                    checked={selectedMatieres.includes(matiere.id)}
                    onCheckedChange={() => toggleMatiere(matiere.id)}
                    disabled={isCreatingClasse}
                  />
                  <label
                    htmlFor={`matiere-${matiere.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {matiere.libelle}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              Aucune matière disponible pour ce niveau
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {selectedMatieres.length}/3 matières sélectionnées
          </p>
        </div>
      )}
    </div>
  );
};

export default function TeacherClassesPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [classeName, setClasseName] = useState("");
  const [classeDescription, setClasseDescription] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedMatieres, setSelectedMatieres] = useState<number[]>([]);

  const { mutate: createClasseMutation, isPending: isCreatingClasse } =
    useCreateClasse();
  const { data: classes, isLoading, isError } = useClasses();
  const { data: niveauxData } = useNiveaux();
  const niveaux = niveauxData?.niveaux || [];

  // Récupérer les matières enseignées du prof
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  const subjectsResponse = subjectsData || { matieres: [], libelles: [], count: 0, max: 3 };
  // Vérifier si le prof a défini des matières (nouveau format: libelles contient les noms)
  const hasDefinedSubjects = (subjectsResponse.libelles && subjectsResponse.libelles.length > 0) || subjectsResponse.matieres.length > 0;

  // Noms des matières enseignées par le prof (depuis libelles)
  const profSubjectNames = subjectsResponse.libelles || [];

  // Filtrer les matières enseignées du prof selon le niveau sélectionné
  // On utilise les matières de subjectsResponse qui contiennent déjà niveau_id
  const isLoadingMatieres = isLoadingSubjects;
  const matieres = selectedNiveau
    ? subjectsResponse.matieres.filter(
        (matiere) =>
          matiere.niveau_id === parseInt(selectedNiveau) &&
          profSubjectNames.includes(matiere.libelle)
      )
    : [];

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleBack = () => {
    router.push("/teacher/home");
  };

  const handleCreateClasse = () => {
    if (!classeName.trim()) {
      toast({
        variant: "warning",
        message: "Le nom de la classe ne peut pas être vide.",
      });
      return;
    }

    if (!selectedNiveau) {
      toast({
        variant: "warning",
        message: "Veuillez sélectionner un niveau.",
      });
      return;
    }

    if (selectedMatieres.length === 0) {
      toast({
        variant: "warning",
        message: "Veuillez sélectionner au moins une matière.",
      });
      return;
    }

    createClasseMutation(
      {
        nom: classeName,
        description: classeDescription,
        niveau_id: parseInt(selectedNiveau),
        matiere_ids: selectedMatieres,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setClasseName("");
          setClasseDescription("");
          setSelectedNiveau("");
          setSelectedMatieres([]);
        },
      },
    );
  };

  const handleCancel = () => {
    setIsOpen(false);
    setClasseName("");
    setClasseDescription("");
    setSelectedNiveau("");
    setSelectedMatieres([]);
  };

  if (isLoading) {
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
            Une erreur est survenue lors du chargement des classes.
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
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 leading-tight">
                Gérer mes classes
              </h1>
            </div>
          </div>
        </div>

        {/* Alerte si pas de matières définies */}
        {!isLoadingSubjects && !hasDefinedSubjects && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl border-2 border-amber-200 bg-amber-50 flex gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-1">
                Définissez vos matières d'abord
              </h3>
              <p className="text-sm text-amber-800 mb-3">
                Vous devez définir les matières que vous enseignez avant de pouvoir créer des classes. Cela garantira que les matières sélectionnées correspondent à vos domaines d'enseignement.
              </p>
              <Button
                onClick={() => router.push("/teacher/settings")}
                className="text-sm bg-amber-600 hover:bg-amber-700 text-white"
              >
                Aller aux paramètres
              </Button>
            </div>
          </div>
        )}

        {classes && classes.length > 0 ? (
          // Scénario: Des classes sont présentes
          <ClasseList onCreateClasse={() => setIsOpen(true)} />
        ) : (
          // Scénario: Aucune classe
          <>
            {/* Description */}
            <div className="text-center mb-12">
              <p className="text-gray-600 text-base sm:text-lg max-w-4xl mx-auto leading-relaxed">
                Créez vos classes, ajoutez vos élèves et gérez vos cours et quiz
                facilement. Aladin vous accompagne dans l'organisation de vos
                enseignements.
              </p>
            </div>

            {/* Illustration centrale */}
            <div className="flex flex-col items-center gap-8 mt-16">
              <div className="relative w-full max-w-sm">
                <Image
                  src="/meet.gif"
                  alt="Gestion de classe illustration"
                  width={350}
                  height={100}
                  className="w-full h-auto object-contain"
                  priority
                  unoptimized
                />
              </div>

              {/* Texte et bouton CTA */}
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-6">
                  Clique ci-dessous pour créer ta première classe et commencer à
                  gérer tes élèves !
                </p>

                <Button
                  size="lg"
                  onClick={() => hasDefinedSubjects ? setIsOpen(true) : router.push("/teacher/settings")}
                  disabled={!hasDefinedSubjects && !isLoadingSubjects}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {hasDefinedSubjects ? "Créer une classe" : "Définissez vos matières d'abord"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal pour Desktop/Tablette */}
      {!isMobile && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-700">
                Créer une classe
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <FormContent
                classeName={classeName}
                setClasseName={setClasseName}
                classeDescription={classeDescription}
                setClasseDescription={setClasseDescription}
                selectedNiveau={selectedNiveau}
                setSelectedNiveau={setSelectedNiveau}
                selectedMatieres={selectedMatieres}
                setSelectedMatieres={setSelectedMatieres}
                isCreatingClasse={isCreatingClasse}
                niveaux={niveaux}
                matieres={matieres}
                isLoadingMatieres={isLoadingMatieres}
              />
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <Button variant="ghost" onClick={handleCancel} className="px-6">
                Annuler
              </Button>
              <Button
                onClick={handleCreateClasse}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
                disabled={isCreatingClasse}
              >
                {isCreatingClasse ? <Spinner /> : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Drawer pour Mobile */}
      {isMobile && (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="bg-white max-h-[90vh]">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-2xl font-bold text-green-700">
                Créer une classe
              </DrawerTitle>
              <DrawerClose className="absolute right-4 top-4">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DrawerClose>
            </DrawerHeader>

            <div className="px-4 pb-4 overflow-y-auto">
              <FormContent
                classeName={classeName}
                setClasseName={setClasseName}
                classeDescription={classeDescription}
                setClasseDescription={setClasseDescription}
                selectedNiveau={selectedNiveau}
                setSelectedNiveau={setSelectedNiveau}
                selectedMatieres={selectedMatieres}
                setSelectedMatieres={setSelectedMatieres}
                isCreatingClasse={isCreatingClasse}
                niveaux={niveaux}
                matieres={matieres}
                isLoadingMatieres={isLoadingMatieres}
              />
            </div>

            <DrawerFooter className="flex-row gap-3 justify-end">
              <Button variant="ghost" onClick={handleCancel} className="flex-1">
                Annuler
              </Button>
              <Button
                onClick={handleCreateClasse}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
                disabled={isCreatingClasse}
              >
                {isCreatingClasse ? <Spinner /> : "Créer"}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
