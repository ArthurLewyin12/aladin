"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
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
import { useGetAllActiveMessages } from "@/services/hooks/professeur/useGetAllActiveMessages";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ClassMessagesDropdownProps {
  className?: string;
}

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

export const ClassMessagesDropdown = ({
  className,
}: ClassMessagesDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: messages = [], isLoading, isError } = useGetAllActiveMessages();

  const hasMessages = messages.length > 0;
  const messageCount = messages.length;

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
          <MessageSquare className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          {messageCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-600 hover:bg-green-700 text-white text-xs border-2 border-white dark:border-gray-900">
              {messageCount > 9 ? "9+" : messageCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-full md:w-[400px] p-0 border border-gray-200 dark:border-gray-800 rounded-3xl"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Messages de classe
            </h3>
            {messageCount > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {messageCount} message{messageCount > 1 ? "s" : ""} actif
                {messageCount > 1 ? "s" : ""}
              </p>
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
        ) : !hasMessages ? (
          <div className="px-4 py-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-3">
              <MessageSquare className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Aucun message actif
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Les messages actifs apparaîtront ici
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px] overflow-y-auto">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex gap-3">
                    {/* Icône */}
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center ring-2 bg-green-100 dark:bg-green-900/30 ring-green-50 dark:ring-green-900/20">
                        <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {message.classe_nom}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Valide jusqu&apos;au{" "}
                            {format(
                              new Date(message.date_fin),
                              "dd MMMM yyyy",
                              { locale: fr },
                            )}
                          </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0 mt-1" />
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {message.message}
                      </p>

                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(message.created_at)}
                      </p>
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
