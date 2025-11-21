"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useEleveDocuments,
  useDownloadEleveDocument,
} from "@/services/hooks/eleve/useEleveDocuments";
import { useSession } from "@/services/hooks/auth/useSession";
import { DocumentCard } from "@/components/pages/student/documents/document-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { FileQuestion } from "lucide-react";
import { toast } from "@/lib/toast";

const ITEMS_PER_PAGE = 6;

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export default function StudentDocumentsPage() {
  const router = useRouter();
  const { user } = useSession();
  const {
    data: documentsData,
    isLoading,
    isError,
  } = useEleveDocuments(user?.id || 0);
  const downloadDocumentMutation = useDownloadEleveDocument();

  // États avec nuqs pour persister dans l'URL
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );
  const [classFilter, setClassFilter] = useQueryState(
    "class",
    parseAsString.withDefault("all"),
  );
  const [typeFilter, setTypeFilter] = useQueryState(
    "type",
    parseAsString.withDefault("all"),
  );

  const documents = documentsData?.documents || [];
  const classes = documentsData?.classes || [];

  // Filtrage et enrichissement des documents
  const filteredDocuments = useMemo(() => {
    return documents
      .filter((document) => {
        // Filtre par recherche (nom du document)
        if (
          searchQuery &&
          !document.nom.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        // Filtre par classe
        if (classFilter !== "all" && document.classe.nom !== classFilter) {
          return false;
        }
        // Filtre par type de fichier
        if (typeFilter !== "all" && document.file_type !== typeFilter) {
          return false;
        }
        return true;
      })
      .map((document, index) => ({
        ...document,
        cardColor: CARD_COLORS[index % CARD_COLORS.length],
      }));
  }, [documents, searchQuery, classFilter, typeFilter]);

  // Calculer les documents paginés
  const { paginatedDocuments, totalPages } = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedDocuments: filteredDocuments.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE),
    };
  }, [filteredDocuments, page]);

  const handleBack = () => {
    router.push("/student/home");
  };

  const handleDownloadDocument = async (documentId: number) => {
    try {
      await downloadDocumentMutation.mutateAsync({
        eleveId: user?.id || 0,
        documentId,
      });
    } catch (error) {
      toast({
        message: "Erreur lors du téléchargement du document",
        variant: "error",
      });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          Erreur lors du chargement des documents
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header avec bouton retour et titre */}
        <div
          className="mt-2 sm:mt-4 w-full mx-auto max-w-[1600px] flex flex-row items-start sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 md:px-10 py-3 sm:py-4 mb-6 sm:mb-8 rounded-2xl"
          style={{
            backgroundImage: `url("/bg-2.png")`,
            backgroundSize: "180px 180px",
          }}
        >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="rounded-full bg-white hover:bg-gray-50 w-9 h-9 sm:w-10 sm:h-10 shadow-sm flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 leading-tight truncate">
            Mes documents
          </h1>
          {totalPages > 1 && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Page {page} sur {totalPages}
            </p>
          )}
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-center">
        {/* Barre de recherche */}
        <div className="relative flex-1 max-w-[500px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Rechercher un document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-2 border-gray-200 rounded-3xl h-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className="flex gap-2 lg:gap-4">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white border-2 border-gray-200 rounded-3xl h-12">
              <SelectValue placeholder="Toutes les classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {classes.map((classe) => (
                <SelectItem key={classe.id} value={classe.nom}>
                  {classe.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[140px] bg-white border-2 border-gray-200 rounded-3xl h-12">
              <SelectValue placeholder="Tous types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="doc">DOC</SelectItem>
              <SelectItem value="docx">DOCX</SelectItem>
              <SelectItem value="txt">TXT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="mt-8">
      {filteredDocuments.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px] py-16">
          <div className="relative w-full max-w-2xl mx-auto">
            <EmptyState
              title="Aucun document trouvé"
              description={
                documents.length === 0
                  ? "Aucun document n'a encore été partagé dans vos classes."
                  : "Aucun document ne correspond à vos critères de recherche."
              }
              icons={[<FileQuestion key="file" size={20} />]}
              size="default"
              theme="light"
              variant="default"
              className="mx-auto max-w-[50rem]"
            />
          </div>
        </div>
      ) : (
        <>
          {/* Grille des documents paginés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                cardColor={document.cardColor}
                onDownload={handleDownloadDocument}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={page === 1}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => {
                        setPage(pageNum);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`rounded-full ${
                        pageNum === page
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : ""
                      }`}
                    >
                      {pageNum}
                    </Button>
                  ),
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
         </>
       )}
       </div>
       </div>
    </div>
  );
}
