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

export default function GroupsPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

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
    router.push("/student/home");
  };

  const handleCreateGroup = () => {
    // Logique pour créer le groupe
    console.log("Groupe créé:", { groupName, groupDescription });
    setIsOpen(false);
    setGroupName("");
    setGroupDescription("");
  };

  const handleCancel = () => {
    setIsOpen(false);
    setGroupName("");
    setGroupDescription("");
  };

  // Contenu du formulaire (réutilisé dans Modal et Drawer)
  const FormContent = () => (
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
        />
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
        />
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[#F5F4F1] relative overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e0e0e0' fill-opacity='0.2'%3E%3Cpath d='M20 20h10v10H20zM40 40h10v10H40zM60 20h10v10H60zM80 60h10v10H80zM30 70h10v10H30zM70 30h10v10H70zM50 50h10v10H50z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "100px 100px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header avec bouton retour et titre */}
        <div
          className="mt-4 w-full mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 mb-8"
          style={{
            backgroundImage: `url("/bg-2.png")`,
            backgroundSize: "100px 100px",
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
              <span className="text-3xl">🤝</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-500">
                Réviser à plusieurs, c'est mieux !
              </h1>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-12">
          <p className="text-gray-600 text-base sm:text-lg max-w-4xl mx-auto leading-relaxed">
            Crée ton groupe d'étude en quelques clics, invite tes amis ou
            camarades de classe et avancez ensemble. Posez-vous des questions,
            faites des quiz en groupe et entraidez-vous avec l'aide de l'IA.
          </p>
        </div>

        {/* Illustration centrale */}
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

          {/* Texte et bouton CTA */}
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-6">
              Clique ci-dessous pour créer ton premier groupe et commencer
              l'aventure collaborative !
            </p>

            <Button
              size="lg"
              onClick={() => setIsOpen(true)}
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-8 py-6 text-lg rounded-lg shadow-lg transition-all hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Créer un groupe
            </Button>
          </div>
        </div>
      </div>

      {/* Modal pour Desktop/Tablette */}
      {!isMobile && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#2C3E50]">
                Créer un groupe
              </DialogTitle>
              {/*<button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>*/}
            </DialogHeader>

            <div className="mt-4">
              <FormContent />
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <Button variant="ghost" onClick={handleCancel} className="px-6">
                Annuler
              </Button>
              <Button
                onClick={handleCreateGroup}
                className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-8"
              >
                Créer
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
              <DrawerTitle className="text-2xl font-bold text-[#2C3E50]">
                Créer un groupe
              </DrawerTitle>
              <DrawerClose className="absolute right-4 top-4">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DrawerClose>
            </DrawerHeader>

            <div className="px-4 pb-4 overflow-y-auto">
              <FormContent />
            </div>

            <DrawerFooter className="flex-row gap-3 justify-end">
              <Button variant="ghost" onClick={handleCancel} className="flex-1">
                Annuler
              </Button>
              <Button
                onClick={handleCreateGroup}
                className="bg-[#2C3E50] hover:bg-[#1a252f] text-white flex-1"
              >
                Créer
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* Éléments décoratifs en arrière-plan */}
      {/*<div className="absolute top-20 left-10 opacity-20">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
          <path d="M9 11H3V2H9V11Z" stroke="#FFA500" strokeWidth="2" />
          <path d="M21 11H15V2H21V11Z" stroke="#FFA500" strokeWidth="2" />
          <path d="M9 22H3V13H9V22Z" stroke="#FFA500" strokeWidth="2" />
          <path d="M21 22H15V13H21V22Z" stroke="#FFA500" strokeWidth="2" />
        </svg>
      </div>*/}

      {/*<div className="absolute bottom-20 right-10 opacity-20">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke="#FFA500"
            strokeWidth="2"
          />
        </svg>
      </div>*/}

      {/*<div className="absolute top-1/3 right-20 opacity-10">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#FFA500" strokeWidth="2" />
        </svg>
      </div>*/}
    </div>
  );
}
