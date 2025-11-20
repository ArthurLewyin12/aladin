"use client";

import { useState, useCallback } from "react";
import {
  Bell,
  Check,
  X,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useAcceptGroupInvitation,
  useDeclineGroupInvitation,
} from "@/services/hooks/notifications";
import {
  Notification,
  NotificationType,
  GroupInvitation,
} from "@/services/controllers/types/common/notification.types";
import { useSession } from "@/services/hooks/auth/useSession";
import { UserRole } from "@/constants/navigation";

interface NotificationCenterProps {
  className?: string;
}

// Icône et couleur selon le type de notification
const getNotificationStyle = (type: NotificationType) => {
  switch (type) {
    case "group_invitation":
      return {
        icon: Users,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        ringColor: "ring-blue-50 dark:ring-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
      };
    case "quiz_activated":
    case "quiz_created":
      return {
        icon: BookOpen,
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        ringColor: "ring-purple-50 dark:ring-purple-900/20",
        iconColor: "text-purple-600 dark:text-purple-400",
      };
    case "grade_received":
      return {
        icon: Award,
        bgColor: "bg-green-100 dark:bg-green-900/30",
        ringColor: "ring-green-50 dark:ring-green-900/20",
        iconColor: "text-green-600 dark:text-green-400",
      };
    case "course_activated":
      return {
        icon: BookOpen,
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
        ringColor: "ring-orange-50 dark:ring-orange-900/20",
        iconColor: "text-orange-600 dark:text-orange-400",
      };
    default:
      return {
        icon: Bell,
        bgColor: "bg-gray-100 dark:bg-gray-800",
        ringColor: "ring-gray-50 dark:ring-gray-900/20",
        iconColor: "text-gray-600 dark:text-gray-400",
      };
  }
};

// Formater la date relative
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

export const NotificationCenter = ({ className }: NotificationCenterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingState, setLoadingState] = useState<{
    invitationId: number;
    action: "accept" | "decline";
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useSession();
  const queryClient = useQueryClient();

  // Récupérer les notifications (20 dernières, toutes)
  const { data, isLoading, isError, refetch } = useNotifications({ per_page: 20 });
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsRead();
  const { mutate: acceptInvitation } = useAcceptGroupInvitation();
  const { mutate: declineInvitation } = useDeclineGroupInvitation();

  const notificationsGenerales = data?.notifications_generales?.data || [];
  const unreadCount = data?.notifications_generales?.unread_count || 0;
  const invitationsGroupes = data?.invitations_groupes || [];

  const hasNotifications =
    notificationsGenerales.length > 0 || invitationsGroupes.length > 0;
  const totalUnread =
    unreadCount +
    invitationsGroupes.filter((inv) => inv.reponse === "en attente").length;

  // Déterminer le préfixe de route selon le rôle
  const getRolePrefix = (): string => {
    const role = user?.statut as UserRole;
    switch (role) {
      case "eleve":
        return "/student";
      case "parent":
        return "/parent";
      case "professeur":
        return "/teacher";
      case "repetiteur":
        return "/repetiteur";
      default:
        return "/student"; // Fallback
    }
  };

  // Gérer le clic sur une notification
  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      // Marquer comme lue si non lue
      if (!notification.is_read) {
        markAsRead(notification.id);
      }

      const rolePrefix = getRolePrefix();

      // Naviguer selon le type de notification
      switch (notification.type) {
        case "quiz_activated":
        case "quiz_created":
          if (notification.data.quiz_id) {
            // Élèves et répétiteurs: rediriger vers le quiz de classe
            if (user?.statut === "eleve" || user?.statut === "repetiteur") {
              router.push(`${rolePrefix}/class-quiz/${notification.data.quiz_id}`);
            }
            // Parents: rediriger vers la page de l'enfant (si disponible)
            else if (user?.statut === "parent" && notification.data.eleve_id) {
              router.push(`${rolePrefix}/enfants`);
            }
            // Professeurs: rediriger vers la classe
            else if (
              user?.statut === "professeur" &&
              notification.data.classe_id
            ) {
              router.push(
                `${rolePrefix}/classes/${notification.data.classe_id}`,
              );
            }
          }
          break;

        case "grade_received":
          if (notification.data.quiz_id) {
            // Élèves: rediriger vers les résultats du quiz
            if (user?.statut === "eleve") {
              router.push(
                `${rolePrefix}/quiz/${notification.data.quiz_id}/results`,
              );
            }
            // Parents: rediriger vers les notes
            else if (user?.statut === "parent") {
              router.push(`${rolePrefix}/notes`);
            }
            // Professeurs: rediriger vers les notes de la classe
            else if (
              user?.statut === "professeur" &&
              notification.data.classe_id
            ) {
              router.push(
                `${rolePrefix}/classes/${notification.data.classe_id}`,
              );
            }
          }
          break;

        case "group_invitation":
          // Tous les profils: rediriger vers les groupes
          router.push(`${rolePrefix}/groups`);
          break;

        case "course_activated":
          if (notification.data.course_id) {
            // Élèves: rediriger vers le cours
            if (user?.statut === "eleve") {
              router.push(
                `${rolePrefix}/courses/${notification.data.course_id}`,
              );
            }
            // Professeurs: rediriger vers les cours
            else if (user?.statut === "professeur") {
              router.push(`${rolePrefix}/courses`);
            }
          }
          break;

        default:
          // Notification générique, juste marquer comme lue
          break;
      }

      setIsOpen(false);
    },
    [markAsRead, router, user, getRolePrefix],
  );

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleRefreshNotifications = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
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
          {totalUnread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gray-600 hover:bg-gray-700 text-white text-xs border-2 border-white dark:border-gray-900">
              {totalUnread > 9 ? "9+" : totalUnread}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-full md:w-[400px] p-0 border border-gray-200 dark:border-gray-800 rounded-2xl"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Notifications
            </h3>
            {totalUnread > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {totalUnread} non lue{totalUnread > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshNotifications}
              disabled={isRefreshing}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isRefreshing ? (
                <Spinner size="sm" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMarkingAll ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Tout marquer comme lu
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
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
        ) : !hasNotifications ? (
          <div className="px-4 py-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-3">
              <Bell className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Aucune notification
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Vous serez notifié des nouveautés
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px] overflow-y-auto">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {/* Section Invitations de groupe */}
              {invitationsGroupes.length > 0 && (
                <>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/30 sticky top-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Invitations de groupe
                    </p>
                  </div>
                  {invitationsGroupes.map((invitation) => (
                    <div
                      key={invitation.id}
                      className={cn(
                        "px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                        invitation.reponse === "en attente" &&
                          "bg-purple-50/30 dark:bg-purple-900/10",
                      )}
                    >
                      <div className="flex gap-3">
                        {/* Icône */}
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center ring-2 bg-purple-100 dark:bg-purple-900/30 ring-purple-50 dark:ring-purple-900/20">
                            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Invitation de groupe
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                De {invitation.userEnvoie.prenom}{" "}
                                {invitation.userEnvoie.nom}
                              </p>
                            </div>
                            {invitation.reponse === "en attente" && (
                              <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0 mt-1" />
                            )}
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {invitation.groupe.nom}
                          </p>

                          {invitation.reponse === "en attente" && (
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="default"
                                className="h-7 text-xs flex-1"
                                onClick={() => {
                                  setLoadingState({
                                    invitationId: invitation.id,
                                    action: "accept",
                                  });
                                  acceptInvitation(invitation.id, {
                                    onSettled: () => setLoadingState(null),
                                  });
                                }}
                                disabled={loadingState !== null}
                              >
                                {loadingState?.invitationId === invitation.id &&
                                loadingState?.action === "accept" ? (
                                  <Spinner size="sm" />
                                ) : (
                                  <Check className="h-3 w-3 mr-1" />
                                )}
                                Accepter
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs flex-1"
                                onClick={() => {
                                  setLoadingState({
                                    invitationId: invitation.id,
                                    action: "decline",
                                  });
                                  declineInvitation(invitation.id, {
                                    onSettled: () => setLoadingState(null),
                                  });
                                }}
                                disabled={loadingState !== null}
                              >
                                {loadingState?.invitationId === invitation.id &&
                                loadingState?.action === "decline" ? (
                                  <Spinner size="sm" />
                                ) : (
                                  <X className="h-3 w-3 mr-1" />
                                )}
                                Refuser
                              </Button>
                            </div>
                          )}

                          {invitation.reponse !== "en attente" && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              Invitation {invitation.reponse}
                            </p>
                          )}

                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {formatDate(invitation.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Section Notifications générales */}
              {notificationsGenerales.length > 0 && (
                <>
                  {invitationsGroupes.length > 0 && (
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/30 sticky top-0">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Notifications
                      </p>
                    </div>
                  )}
                  {notificationsGenerales.map((notification) => {
                    const style = getNotificationStyle(notification.type);
                    const IconComponent = style.icon;

                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer",
                          !notification.is_read &&
                            "bg-gray-50/30 dark:bg-gray-800/10",
                        )}
                      >
                        <div className="flex gap-3">
                          {/* Icône */}
                          <div className="flex-shrink-0">
                            <div
                              className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center ring-2",
                                style.bgColor,
                                style.ringColor,
                              )}
                            >
                              <IconComponent
                                className={cn("h-5 w-5", style.iconColor)}
                              />
                            </div>
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {notification.title}
                              </p>
                              {!notification.is_read && (
                                <div className="w-2 h-2 rounded-full bg-gray-600 flex-shrink-0 mt-1" />
                              )}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {notification.message}
                            </p>

                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {formatDate(notification.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};
