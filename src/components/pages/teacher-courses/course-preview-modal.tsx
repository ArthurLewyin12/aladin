"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, BookOpen } from "lucide-react";
import { CourseContent } from "@/services/controllers/types/common/professeur.types";

interface CoursePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: CourseContent | null;
}

export function CoursePreviewModal({
  isOpen,
  onClose,
  title,
  content,
}: CoursePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[90vw] !max-w-4xl !max-h-[70vh] flex flex-col rounded-2xl p-0 overflow-hidden" showCloseButton={false}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-gray-900">
                Aperçu du cours
              </h2>
              <p className="text-sm text-gray-500 mt-1 truncate">{title}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-lg hover:bg-gray-100 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content Area with Scroll */}
        <div className="flex-1 overflow-y-auto min-w-0">
          <div className="w-full px-6 py-8">
            {content?.html ? (
              <div
                className="prose prose-sm sm:prose-base max-w-none text-gray-800 [&_img]:max-w-full [&_img]:h-auto [&_iframe]:max-w-full [&_iframe]:w-full"
                dangerouslySetInnerHTML={{ __html: content.html }}
              />
            ) : content?.plain_text ? (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                {content.plain_text}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <BookOpen className="w-16 h-16 mb-4 text-gray-400" />
                <p className="text-center text-lg">
                  Aucun contenu à prévisualiser.
                  <br />
                  <span className="text-sm text-gray-500">
                    Commencez à rédiger votre cours dans l'éditeur.
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Info - Simple */}
        {content?.metadata && (
          <div className="border-t border-gray-200 px-6 py-3 flex-shrink-0 bg-gray-50">
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>📝</span>
                <span>{content.metadata.word_count} mots</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔤</span>
                <span>{content.metadata.character_count} caractères</span>
              </div>
              {content.metadata.has_images && (
                <div className="flex items-center gap-2">
                  <span>🖼️</span>
                  <span>{content.metadata.image_count} image{content.metadata.image_count > 1 ? 's' : ''}</span>
                </div>
              )}
              {content.metadata.has_videos && (
                <div className="flex items-center gap-2">
                  <span>🎥</span>
                  <span>{content.metadata.video_count} vidéo{content.metadata.video_count > 1 ? 's' : ''}</span>
                </div>
              )}
              {content.metadata.has_tables && (
                <div className="flex items-center gap-2">
                  <span>📊</span>
                  <span>{content.metadata.table_count} tableau{content.metadata.table_count > 1 ? 'x' : ''}</span>
                </div>
              )}
              {content.metadata.has_math && (
                <div className="flex items-center gap-2">
                  <span>➗</span>
                  <span>Formules mathématiques</span>
                </div>
              )}
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
