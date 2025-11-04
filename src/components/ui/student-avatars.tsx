"use client";

import { cn } from "@/lib/utils";

interface Student {
  id?: number | string;
  nom: string;
  prenom: string;
}

interface StudentAvatarsProps {
  students: Student[];
  maxVisible?: number;
  className?: string;
}

const AVATAR_COLORS = [
  "bg-pink-300",
  "bg-green-300",
  "bg-yellow-300",
  "bg-red-300",
  "bg-purple-300",
  "bg-blue-300",
];

const getInitials = (nom: string, prenom: string): string => {
  const firstInitial = prenom?.charAt(0)?.toUpperCase() || "";
  const lastInitial = nom?.charAt(0)?.toUpperCase() || "";
  return `${firstInitial}${lastInitial}`;
};

export const StudentAvatars = ({
  students,
  maxVisible = 4,
  className,
}: StudentAvatarsProps) => {
  const visibleStudents = students.slice(0, maxVisible);
  const remainingCount = Math.max(0, students.length - maxVisible);

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visibleStudents.map((student, index) => {
        const bgColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
        const initials = getInitials(student.nom, student.prenom);
        // Utiliser l'ID si disponible, sinon une combinaison nom+prenom+index comme fallback
        const uniqueKey = student.id 
          ? `student-${student.id}` 
          : `student-${student.nom}-${student.prenom}-${index}`;

        return (
          <div
            key={uniqueKey}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm font-semibold text-gray-900",
              bgColor,
            )}
            title={`${student.prenom} ${student.nom}`}
          >
            {initials}
          </div>
        );
      })}

      {remainingCount > 0 && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white text-sm font-semibold text-gray-900 shadow-sm">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
