"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/services/hooks/use-media-query";
import { NoteClasse } from "@/services/controllers/types/common";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, BookOpen, MessageSquare, CheckCircle } from "lucide-react";

interface NoteDetailsModalProps {
  note: NoteClasse;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function NoteDetailsModal({
  note,
  isOpen,
  onOpenChange,
}: NoteDetailsModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const noteValue = parseFloat(note.note);
  const noteColorClass =
    noteValue >= 15
      ? "text-green-600"
      : noteValue >= 10
        ? "text-blue-600"
        : "text-red-600";

  const content = (
    <div className="space-y-6 py-4">
      {/* Note principale avec style moderne */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-muted-foreground mb-2">Note obtenue</p>
            <p className={`text-5xl font-bold ${noteColorClass}`}>
              {noteValue.toFixed(1)}
              <span className="text-3xl text-muted-foreground">/20</span>
            </p>
          </div>
        </div>
      </div>

      {/* Informations détaillées avec bordures arrondies */}
      <div className="grid gap-4">
        {/* Matière */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Matière</p>
            <p className="text-base font-semibold">
              {note.matiere?.libelle || "N/A"}
            </p>
          </div>
        </div>

        {/* Type et Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Type
              </p>
              <Badge variant="outline" className="capitalize">
                {note.type_evaluation}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Date
              </p>
              <p className="text-sm font-medium truncate">
                {new Date(note.date_evaluation).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Chapitres */}
        {note.chapitres_ids && note.chapitres_ids.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Chapitres concernés
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {note.chapitres_ids.map((id) => (
                <Badge key={id} variant="secondary" className="rounded-full">
                  Chapitre {id}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Commentaire */}
        {note.commentaire && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <MessageSquare className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Commentaire
              </p>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {note.commentaire}
            </p>
          </div>
        )}

        {/* Statut de notification parent */}
        {note.notifie_parent && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-700 dark:text-green-400">
              Parent notifié par email
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails de la note</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Détails de la note</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}
