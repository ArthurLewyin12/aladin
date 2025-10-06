"use client";

import { Suspense } from "react";
import { GroupQuizNotes } from "@/components/pages/groups/group-quiz-notes";

export default function GroupQuizNotesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          Chargement...
        </div>
      }
    >
      <GroupQuizNotes />
    </Suspense>
  );
}
