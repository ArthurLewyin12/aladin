import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";
import {
  uploadClasseDocument,
  getClasseDocuments,
  deleteClasseDocument,
  downloadClasseDocument,
} from "@/services/controllers/professeur.controller";
import {
  UploadClasseDocumentPayload,
  GetClasseDocumentsResponse,
  UploadClasseDocumentResponse,
  DeleteClasseDocumentResponse,
} from "@/services/controllers/types/common/professeur.types";

/**
 * Hook pour récupérer les documents d'une classe
 */
export const useClasseDocuments = (classeId: number) => {
  return useQuery({
    queryKey: createQueryKey("classe-documents", { classeId }),
    queryFn: () => getClasseDocuments(classeId),
    enabled: !!classeId,
  });
};

/**
 * Hook pour uploader un document de classe
 */
export const useUploadClasseDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classeId,
      payload
    }: {
      classeId: number;
      payload: UploadClasseDocumentPayload;
    }) => uploadClasseDocument(classeId, payload),
    onSuccess: (_, { classeId }) => {
      // Invalider la requête pour rafraîchir la liste des documents
      queryClient.invalidateQueries({
        queryKey: createQueryKey("classe-documents", { classeId })
      });
    },
    // Désactiver les retries pour les uploads de fichiers
    retry: false,
  });
};

/**
 * Hook pour supprimer un document de classe
 */
export const useDeleteClasseDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classeId,
      documentId
    }: {
      classeId: number;
      documentId: number;
    }) => deleteClasseDocument(classeId, documentId),
    onSuccess: (_, { classeId }) => {
      // Invalider la requête pour rafraîchir la liste des documents
      queryClient.invalidateQueries({
        queryKey: createQueryKey("classe-documents", { classeId })
      });
    },
  });
};

/**
 * Hook pour télécharger un document de classe
 */
export const useDownloadClasseDocument = () => {
  return useMutation({
    mutationFn: ({
      classeId,
      documentId
    }: {
      classeId: number;
      documentId: number;
    }) => downloadClasseDocument(classeId, documentId),
  });
};