import { useQuery } from "@tanstack/react-query";
import { getClasses } from "@/services/controllers/professeur.controller";
import { getClassMessages } from "@/services/controllers/professeur.controller";
import { ClassMessage } from "@/services/controllers/types/common/professeur.types";
import { createQueryKey } from "@/lib/request";

type MessageWithClass = ClassMessage & {
  classe_nom: string;
};

export const useGetAllActiveMessages = () => {
  return useQuery<MessageWithClass[]>({
    queryKey: createQueryKey("professeur", "all-active-messages"),
    queryFn: async () => {
      // 1. Récupérer toutes les classes du prof
      const classes = await getClasses();

      // 2. Pour chaque classe, récupérer ses messages
      const messagesPromises = classes.map(async (classe) => {
        try {
          const messagesData = await getClassMessages(classe.id);
          // Filtrer les messages actifs et dans la période de validité
          const now = new Date();
          const activeMessages = messagesData.messages.filter((msg) => {
            const dateDebut = new Date(msg.date_debut);
            const dateFin = new Date(msg.date_fin);
            return msg.is_active && now >= dateDebut && now <= dateFin;
          });

          // Ajouter le nom de la classe à chaque message
          return activeMessages.map((msg) => ({
            ...msg,
            classe_nom: classe.nom,
          }));
        } catch (error) {
          return [];
        }
      });

      const allMessagesArrays = await Promise.all(messagesPromises);
      const allMessages = allMessagesArrays.flat();

      // Trier par date de création (plus récents en premier)
      return allMessages.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });
};
