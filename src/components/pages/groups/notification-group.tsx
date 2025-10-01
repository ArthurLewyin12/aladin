"use client";

import { useState, useCallback } from "react";
import { Bell, Check, X, Users } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useNotifications } from "@/services/hooks/groupes/useNotifications";
import { useAcceptInvitation } from "@/services/hooks/groupes/useAcceptInvitation";
import { useDeclineInvitation } from "@/services/hooks/groupes/useDeclineInvitation";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { createQueryKey } from "@/lib/request";

interface NotificationsBellProps {
  className?: string;
}

export const NotificationsBell = ({ className }: NotificationsBellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isError } = useNotifications();
  const { mutate: acceptMutation, isPending: isAccepting } =
    useAcceptInvitation();
  const { mutate: declineMutation, isPending: isDeclining } =
    useDeclineInvitation();
  const queryClient = useQueryClient();

  const invitations = data?.invitations || [];
  const pendingInvitations = invitations.filter(
    (inv) => inv.reponse === "en attente",
  );
  const hasNotifications = pendingInvitations.length > 0;

  // Gérer l'acceptation d'une invitation
  const handleAccept = useCallback(
    (invitationId: number) => {
      acceptMutation(invitationId, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: createQueryKey("notifications"),
          });
        },
      });
    },
    [acceptMutation, queryClient],
  );

  // Gérer le refus d'une invitation
  const handleDecline = useCallback(
    (invitationId: number) => {
      declineMutation(invitationId, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: createQueryKey("notifications"),
          });
        },
      });
    },
    [declineMutation, queryClient],
  );

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative rounded-full hover:bg-gray-100", className)}
        >
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 text-white text-xs">
              {pendingInvitations.length > 9 ? "9+" : pendingInvitations.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-full md:w-[380px] p-0 bg-white shadow-xl rounded-md"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {hasNotifications && (
            <p className="text-xs text-gray-500 mt-0.5">
              {pendingInvitations.length} invitation(s) en attente
            </p>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="md" />
          </div>
        ) : isError ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-red-600">
              Erreur lors du chargement des notifications
            </p>
          </div>
        ) : pendingInvitations.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">Aucune notification</p>
            <p className="text-xs text-gray-400 mt-1">
              Vous serez notifié des invitations aux groupes
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="divide-y divide-gray-100">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  {/* Header de la notification */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Contenu de la notification */}
                      <p className="text-sm text-gray-900 mb-1">
                        <span className="font-semibold">
                          {invitation.user_envoie.prenom}{" "}
                          {invitation.user_envoie.nom}
                        </span>{" "}
                        vous invite à rejoindre
                      </p>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        {invitation.groupe.nom}
                      </p>

                      {/* Description du groupe si disponible */}
                      {invitation.groupe.description && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          {invitation.groupe.description}
                        </p>
                      )}

                      {/* Timestamp */}
                      <p className="text-xs text-gray-400 mb-3">
                        {formatDate(invitation.created_at)}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(invitation.id)}
                          disabled={isAccepting || isDeclining}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white h-8 text-xs"
                        >
                          {isAccepting ? (
                            <Spinner size="sm" />
                          ) : (
                            <Check className="h-3 w-3 mr-1" />
                          )}
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecline(invitation.id)}
                          disabled={isAccepting || isDeclining}
                          className="flex-1 border-gray-300 hover:bg-gray-100 h-8 text-xs"
                        >
                          {isDeclining ? (
                            <Spinner size="sm" />
                          ) : (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          Refuser
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};
