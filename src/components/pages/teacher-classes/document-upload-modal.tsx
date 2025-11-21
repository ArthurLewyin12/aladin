"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { useUploadClasseDocument } from "@/services/hooks/professeur/useClasseDocuments";
import { toast } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  classeId: number;
  currentDocumentCount: number;
  maxDocuments: number;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const DocumentUploadModal = ({
  isOpen,
  onClose,
  classeId,
  currentDocumentCount,
  maxDocuments,
}: DocumentUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadClasseDocument();

  const validateFile = (file: File): string[] => {
    const errors: string[] = [];

    if (!ACCEPTED_TYPES.includes(file.type)) {
      errors.push(
        "Type de fichier non accepté. Utilisez PDF, DOC, DOCX ou TXT.",
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      errors.push("Le fichier ne doit pas dépasser 5MB.");
    }

    return errors;
  };

  const handleFileSelect = (file: File) => {
    const validationErrors = validateFile(file);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      setSelectedFile(file);
      if (!nom) {
        // Utiliser le nom du fichier sans extension comme nom par défaut
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setNom(nameWithoutExt);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const finalNom = nom.trim() || selectedFile.name.replace(/\.[^/.]+$/, "");

    try {
      await uploadMutation.mutateAsync({
        classeId,
        payload: {
          file: selectedFile,
          nom: finalNom,
          description: description.trim() || undefined,
        },
      });

      toast({
        message: "Document uploadé avec succès",
        variant: "success",
      });

      // Reset form
      setSelectedFile(null);
      setNom("");
      setDescription("");
      setErrors([]);
      onClose();
    } catch (error: any) {
      toast({
        message:
          error?.response?.data?.message ||
          "Erreur lors de l'upload du document",
        variant: "error",
      });
    }
  };

  const canSubmit =
    selectedFile &&
    nom.trim() &&
    errors.length === 0 &&
    !uploadMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
          <DialogDescription>
            Partagez un document avec les élèves de cette classe.
            <br />
            <span className="text-xs text-gray-500 mt-1 block">
              Documents utilisés: {currentDocumentCount}/{maxDocuments}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Zone de drop/upload */}
          <div className="space-y-2">
            <Label>Fichier *</Label>
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Glissez-déposez votre fichier ici ou{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    parcourez
                  </button>
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, TXT • Max 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_EXTENSIONS.join(",")}
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Erreurs de validation */}
            {errors.length > 0 && (
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-red-600"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nom du document */}
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du document *</Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Entrez un nom pour le document"
              maxLength={255}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ajoutez une description..."
              maxLength={1000}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-[#2C3E50] hover:bg-[#1a252f] text-white"
          >
            {uploadMutation.isPending ? "Upload en cours..." : "Uploader"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
