"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, File, Download } from "lucide-react";
import { EleveDocument } from "@/services/controllers/types/common/eleve.types";

interface DocumentCardProps {
  document: EleveDocument;
  cardColor: string;
  onDownload: (documentId: number) => void;
}

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

export const DocumentCard = ({
  document,
  cardColor,
  onDownload,
}: DocumentCardProps) => {
  return (
    <Card
      className={`${cardColor} border-0 shadow-md hover:shadow-lg transition-shadow duration-200`}
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
        {/* Badge classe */}
        <Badge variant="secondary" className="mb-3">
          {document.classe.nom}
        </Badge>

        {/* Métadonnées */}
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
          <div className="text-xs text-gray-600">
            Par: {document.uploaded_by.prenom} {document.uploaded_by.nom}
          </div>
        </div>

        {/* Bouton téléchargement */}
        <Button
          size="sm"
          onClick={() => onDownload(document.id)}
          className="w-full"
        >
          <Download className="w-3 h-3 mr-1" />
          Télécharger
        </Button>
      </CardContent>
    </Card>
  );
};
