import { request, api } from "@/lib/request";
import { EleveEndpoints } from "@/constants/endpoints";
import { CheckEleveResponse, EleveDocument, GetEleveDocumentsResponse } from "./types/common/eleve.types";

/**
 * Vérifie si un élève existe par son adresse email.
 * @param {string} email - L'email de l'élève à vérifier.
 * @returns {Promise<CheckEleveResponse>} Une promesse résolue avec le statut d'existence et les données de l'élève si trouvé.
 */
export const checkEleveByEmail = async (
  email: string,
): Promise<CheckEleveResponse> => {
  return request.get<CheckEleveResponse>(EleveEndpoints.CHECK_EMAIL, {
    params: { email },
  });
};

/**
 * ===============================
 * DOCUMENTS CÔTÉ ÉLÈVE
 * ===============================
 */

/**
 * Récupère tous les documents accessibles à un élève (toutes ses classes).
 * @param {number} eleveId - ID de l'élève.
 * @returns {Promise<GetEleveDocumentsResponse>} Liste des documents avec métadonnées.
 */
export const getEleveDocuments = async (
  eleveId: number,
): Promise<GetEleveDocumentsResponse> => {
  const endpoint = EleveEndpoints.GET_ELEVE_DOCUMENTS.replace(
    "{eleve_id}",
    eleveId.toString(),
  );
  return request.get<GetEleveDocumentsResponse>(endpoint);
};

/**
 * Télécharge un document accessible à un élève.
 * @param {number} eleveId - ID de l'élève.
 * @param {number} documentId - ID du document.
 */
export const downloadEleveDocument = async (
  eleveId: number,
  documentId: number,
): Promise<void> => {
  const endpoint = EleveEndpoints.DOWNLOAD_ELEVE_DOCUMENT
    .replace("{eleve_id}", eleveId.toString())
    .replace("{document_id}", documentId.toString());

  try {
    // Faire une requête authentifiée pour récupérer le fichier
    const response = await api.get(endpoint, {
      responseType: 'blob', // Important pour les fichiers binaires
    });

    // Extraire le nom du fichier depuis les headers Content-Disposition
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'document.pdf'; // Nom par défaut

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    // Créer un blob URL
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    // Créer un lien temporaire et déclencher le téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    throw error;
  }
};
