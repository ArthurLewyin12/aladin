import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";
import {
  getEleveDocuments,
  downloadEleveDocument,
} from "@/services/controllers/eleve.controller";
import {
  GetEleveDocumentsResponse,
} from "@/services/controllers/types/common/eleve.types";

/**
 * Hook pour récupérer tous les documents d'un élève
 */
export const useEleveDocuments = (eleveId: number) => {
  return useQuery({
    queryKey: createQueryKey("eleve-documents", { eleveId }),
    queryFn: () => getEleveDocuments(eleveId),
    enabled: !!eleveId,
  });
};

/**
 * Hook pour télécharger un document côté élève
 */
export const useDownloadEleveDocument = () => {
  return useMutation({
    mutationFn: ({
      eleveId,
      documentId
    }: {
      eleveId: number;
      documentId: number;
    }) => downloadEleveDocument(eleveId, documentId),
  });
};