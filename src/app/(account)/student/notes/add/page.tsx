"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddNoteForm } from "@/components/pages/notes/add-note-form";

export default function AddNotePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/student/notes");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header avec fond doux */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Ajouter une note
              </h1>
              <p className="text-sm text-gray-500">
                Enregistre ta note de classe
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal avec padding adapté mobile */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-safe">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <AddNoteForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            submitLabel="Enregistrer la note"
            cancelLabel="Annuler"
          />
        </div>

        {/* Note informative soft */}
        <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
          <p className="text-sm text-blue-900/70">
            💡 <span className="font-medium">Astuce :</span> Tu peux ajouter
            plusieurs chapitres si ton évaluation couvre plusieurs thèmes.
          </p>
        </div>
      </div>
    </div>
  );
}
