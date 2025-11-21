"use client";

import { useState } from "react";
import { GetClasseResponse } from "@/services/controllers/types/common/professeur.types";
import {
  useClasseDocuments,
  useDeleteClasseDocument,
  useDownloadClasseDocument,
} from "@/services/hooks/professeur/useClasseDocuments";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  File,
  Download,
  Trash2,
  AlertTriangle,
  FileQuestion,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/lib/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DocumentUploadModal } from "./document-upload-modal";

interface DocumentsSectionProps {
  classeDetails: GetClasseResponse;
}

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return <FileText className="w-8 h-8 text-red-500" />;
    case "doc":
    case "docx":
      return <FileText className="w-8 h-8 text-blue-500" />;
    case "txt":
      return <FileText className="w-8 h-8 text-gray-500" />;
    default:
      return <File className="w-8 h-8 text-gray-400" />;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const DocumentsSection = ({ classeDetails }: DocumentsSectionProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);

  const { data: documentsData, isLoading } = useClasseDocuments(
    classeDetails.id,
  );
  const deleteDocumentMutation = useDeleteClasseDocument();
  const downloadDocumentMutation = useDownloadClasseDocument();

  const documents = documentsData?.documents || [];
  const totalDocuments = documentsData?.total_professor_documents || 0;
  const limit = documentsData?.limit || 10;

  const handleDeleteDocument = async (documentId: number) => {
    try {
      await deleteDocumentMutation.mutateAsync({
        classeId: classeDetails.id,
        documentId,
      });
      toast({
        message: "Document supprimé avec succès",
        variant: "success",
      });
      setDocumentToDelete(null);
    } catch (error) {
      toast({
        message: "Erreur lors de la suppression du document",
        variant: "error",
      });
    }
  };

  const handleDownloadDocument = async (documentId: number) => {
    try {
      await downloadDocumentMutation.mutateAsync({
        classeId: classeDetails.id,
        documentId,
      });
    } catch (error) {
      toast({
        message: "Erreur lors du téléchargement du document",
        variant: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header avec bouton d'upload et compteur */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm px-4 sm:px-0">
          <div className="ml-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Documents de classe (Uniquement partager aux élèves)
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs sm:text-sm text-gray-600">
                {documents.length} document{documents.length > 1 ? "s" : ""}
              </p>
              <Badge
                variant={totalDocuments >= limit ? "destructive" : "secondary"}
                className="text-xs"
              >
                {totalDocuments}/{limit} utilisés
              </Badge>
            </div>
          </div>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            disabled={totalDocuments >= limit}
            className="mr-4 bg-[#2C3E50] hover:bg-[#1a252f] text-white px-4 sm:px-6 py-3 text-sm sm:text-base rounded-2xl shadow-lg transition-all hover:shadow-xl w-full sm:w-auto whitespace-nowrap flex items-center justify-center"
          >
            <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
            Partager un document
          </Button>
        </div>

        {/* Message d'avertissement si limite atteinte */}
        {totalDocuments >= limit && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-4 sm:mx-0">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800 text-sm">
                Vous avez atteint la limite de {limit} documents. Supprimez des
                documents existants pour pouvoir en partager de nouveaux.
              </p>
            </div>
          </div>
        )}

        {/* Liste des documents */}
        {documents.length === 0 ? (
          <div className="px-4 sm:px-0">
            <div className="relative w-full max-w-2xl mx-auto">
              <EmptyState
                title="Aucun document pour le moment"
                description="Ajoutez vos premiers documents pour les partager avec vos élèves."
                icons={[<FileQuestion key="file" size={20} />]}
                size="default"
                theme="light"
                variant="default"
                className="mx-auto max-w-[50rem]"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
            {documents.map((document, index) => (
              <Card
                key={document.id}
                className={`${CARD_COLORS[index % CARD_COLORS.length]} border-0 shadow-md hover:shadow-lg transition-shadow duration-200`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(document.file_type)}
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm font-semibold text-gray-900 truncate">
                          {document.nom}
                        </CardTitle>
                        <p className="text-xs text-gray-600 mt-1">
                          {document.nom_fichier}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {document.description && (
                    <p className="text-xs text-gray-700 mb-3 line-clamp-2">
                      {document.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Taille:</span>
                      <span className="font-medium">
                        {formatFileSize(document.file_size)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Type:</span>
                      <Badge variant="outline" className="text-xs">
                        {document.file_type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="bg-red-600">Partager le:</span>
                      <span className="font-medium">
                        {format(new Date(document.created_at), "dd/MM/yyyy", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Par: {document.uploaded_by.prenom}{" "}
                      {document.uploaded_by.nom}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadDocument(document.id)}
                      disabled={downloadDocumentMutation.isPending}
                      className="flex-1"
                    >
                      {/*<Download className="w-3 h-3 mr-1" />*/}
                      Consulter
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Supprimer le document
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer "{document.nom}"
                            ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteDocument(document.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'upload */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        classeId={classeDetails.id}
        currentDocumentCount={totalDocuments}
        maxDocuments={limit}
      />
    </>
  );
};
