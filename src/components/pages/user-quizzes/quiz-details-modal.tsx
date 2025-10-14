"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useGetOneQuiz } from "@/services/hooks/quiz";
import { useMediaQuery } from "@/services/hooks/use-media-query";
import { SingleQuizResponse } from "@/services/controllers/types/common/quiz.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { convertScoreToNote } from "@/lib/quiz-score";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Clock,
  FileQuestion,
  HelpCircle,
  Info,
  List,
  XCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizDetailsModalProps {
  quizId: number | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function QuizDetailsModal({
  quizId,
  isOpen,
  onOpenChange,
}: QuizDetailsModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data, isLoading, isError, error } = useGetOneQuiz(quizId, {
    enabled: !!quizId && isOpen,
  });

  const quizData = data?.quiz;
  const [activeTab, setActiveTab] = useState("questions");

  // Reset activeTab when modal opens/closes or quizId changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab("questions");
    }
  }, [isOpen, quizId]);

  const title = quizData?.chapitre?.libelle || "Détails du Quiz";
  const description = quizData ? (
    <div className="flex flex-wrap gap-2 mt-2">
      <Badge variant="secondary" className="bg-slate-200 text-slate-700">
        <BookOpen className="w-3 h-3 mr-1.5" />
        {quizData.chapitre?.matiere?.libelle || "N/A"}{" "}
      </Badge>
      <Badge variant="secondary" className="bg-slate-200 text-slate-700">
        <Info className="w-3 h-3 mr-1.5" />
        {quizData.difficulte}
      </Badge>
      <Badge variant="secondary" className="bg-slate-200 text-slate-700">
        <Clock className="w-3 h-3 mr-1.5" />
        {quizData.time} min
      </Badge>
    </div>
  ) : (
    "Chargement des informations du quiz..."
  );

  const renderBodyContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center text-red-600">
          <AlertCircle className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-sm">
            Impossible de récupérer les détails du quiz.
          </p>
        </div>
      );
    }

    if (!quizData) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center text-gray-500">
          <HelpCircle className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-semibold">Aucune donnée</h3>
          <p className="text-sm">
            Les informations de ce quiz ne sont pas disponibles.
          </p>
        </div>
      );
    }

    return (
      <div className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-200/60">
            <TabsTrigger value="questions">
              {/*<FileQuestion className="w-4 h-4 mr-2" />*/}
              Questions ({quizData.questions.length})
            </TabsTrigger>
            <TabsTrigger
              value="approfondissement"
              disabled={quizData.questions_approfondissement.length === 0}
            >
              {/*<HelpCircle className="w-4 h-4 mr-2" />*/}
              Approfondissement
            </TabsTrigger>
            <TabsTrigger value="notes" disabled={quizData.notes.length === 0}>
              {/*<List className="w-4 h-4 mr-2" />*/}
              Mes Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <Accordion type="single" collapsible className="w-full">
                {quizData.questions.map((q, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left hover:bg-slate-100/80 px-4 rounded-lg">
                      <span className="font-medium text-slate-800">{`Question ${index + 1}:`}</span>
                      &nbsp;{q.question}
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-2 px-4 bg-white rounded-b-lg">
                      <ul className="space-y-2">
                        {(Array.isArray(q.propositions)
                          ? q.propositions
                          : []
                        ).map((prop, propIndex) => (
                          <li
                            key={propIndex}
                            className={`flex items-center p-3 rounded-md text-sm ${
                              prop.id === q.bonne_reponse_id
                                ? "bg-green-100 text-green-900 font-semibold"
                                : "bg-slate-50 text-slate-700"
                            }`}
                          >
                            {prop.id === q.bonne_reponse_id ? (
                              <CheckCircle className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 mr-3 text-slate-400 flex-shrink-0" />
                            )}
                            {prop.text}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="approfondissement" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {quizData.questions_approfondissement.length > 0 ? (
                <div className="space-y-4">
                  {quizData.questions_approfondissement.map((qa, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-2">{qa.question}</h4>
                      <p className="text-slate-700 whitespace-pre-line">{qa.reponse}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8 bg-slate-50 rounded-lg">
                  <HelpCircle className="w-8 h-8 mx-auto mb-2" />
                  Aucune question d'approfondissement pour ce quiz.
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="notes" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {quizData.notes.length > 0 ? (
                <div className="space-y-3">
                  {quizData.notes.map((note: any, index: number) => {
                    const totalQuestions = quizData.questions.length;
                    const noteSur20 = convertScoreToNote(note.note, totalQuestions);

                    return (
                      <div key={index} className="p-4 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-slate-900">{note.user?.nom} {note.user?.prenom}</p>
                          <p className="text-sm text-slate-600">{note.user?.mail}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(note.created_at).toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-slate-900">{noteSur20}</div>
                          <div className="text-sm text-slate-500">/ 20</div>
                          <div className="text-xs text-slate-400 mt-1">
                            ({note.note}/{totalQuestions})
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8 bg-slate-50 rounded-lg">
                  <List className="w-8 h-8 mx-auto mb-2" />
                  Historique des notes non disponible.
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl bg-slate-50 p-0 rounded-2xl" showCloseButton={false}>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
          <DialogHeader className="p-4 pb-0 sm:p-6 sm:pb-0">
            <DialogTitle className="text-2xl font-bold text-slate-900 pr-8">
              {title}
            </DialogTitle>
            {description}
          </DialogHeader>
          {renderBodyContent()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-slate-50">
        <DrawerHeader className="p-4 pb-0 sm:p-6 sm:pb-0">
          <DrawerTitle className="text-2xl font-bold text-slate-900">
            {title}
          </DrawerTitle>
          {description}
        </DrawerHeader>
        <div className="mx-auto w-full max-w-2xl">{renderBodyContent()}</div>
      </DrawerContent>
    </Drawer>
  );
}
