"use client";

import { useState, useCallback } from "react";
import { Bell, Check, X, Users, ChevronRight } from "lucide-react";
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
          className={cn(
            "relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
            className,
          )}
        >
          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          {hasNotifications && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 hover:bg-blue-700 text-white text-xs border-2 border-white dark:border-gray-900">
              {pendingInvitations.length > 9 ? "9+" : pendingInvitations.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-full md:w-[380px] p-0 border border-gray-200 dark:border-gray-800 rounded-2xl"
      >
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Notifications
          </h3>
          {hasNotifications && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {pendingInvitations.length} invitation
              {pendingInvitations.length > 1 ? "s" : ""} en attente
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="md" />
          </div>
        ) : isError ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">
              Erreur lors du chargement
            </p>
          </div>
        ) : pendingInvitations.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
              <Bell className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Aucune notification
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Vous serez notifié des invitations aux groupes
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[420px]">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {pendingInvitations.map((invitation, index) => (
                <div
                  key={invitation.id}
                  className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ring-2 ring-blue-50 dark:ring-blue-900/20">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          <span className="font-semibold">
                            {invitation.user_envoie.prenom}{" "}
                            {invitation.user_envoie.nom}
                          </span>{" "}
                          <span className="text-gray-600 dark:text-gray-400">
                            vous invite à rejoindre
                          </span>
                        </p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1 flex items-center gap-1">
                          {invitation.groupe.nom}
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                        </p>
                      </div>

                      {invitation.groupe.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {invitation.groupe.description}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(invitation.created_at)}
                      </p>

                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(invitation.id)}
                          disabled={isAccepting || isDeclining}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white h-8 text-xs font-medium shadow-sm"
                        >
                          {isAccepting ? (
                            <Spinner size="sm" />
                          ) : (
                            <>
                              <Check className="h-3.5 w-3.5 mr-1.5" />
                              Accepter
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecline(invitation.id)}
                          disabled={isAccepting || isDeclining}
                          className="flex-1 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 h-8 text-xs font-medium"
                        >
                          {isDeclining ? (
                            <Spinner size="sm" />
                          ) : (
                            <>
                              <X className="h-3.5 w-3.5 mr-1.5" />
                              Refuser
                            </>
                          )}
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
