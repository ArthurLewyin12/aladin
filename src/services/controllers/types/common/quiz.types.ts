import { AuditFields } from "@/constants/audit.types";

export type QuizDefinition = {
  id: number;
  titre: string;
  nombre_questions: number;
  temps: number | null;

  niveau_id: number;
  matiere_id: number;
  chapitre_id: number;
  difficulte: string;
  groupe_id: number | null;
  parent_id: number | null;
  classe_id: number | null;
  trimestre: string | null;
} & AuditFields;

export type UserQuizInstance = {
  id: number;
  user_id: number;
  chapitre_id: number;
  difficulte: string;
  data: QuizQuestion[];
  time: string | null;
} & AuditFields;

export type ReponseQuiz = {
  quiz_id: number;
  data: Record<string, any>[];
} & AuditFields;

export type QuizHistory = UserQuizInstance[];

export type QuizGeneratePayload = {
  chapter_id: number;
  difficulty: string;
};

export type QuizSubmitPayload = {
  score: number;
};

export type QuizProposition = {
  id: number | string;
  text: string;
};

export type QuizQuestion = {
  id: number | string;
  question: string;
  propositions: QuizProposition[];
  bonne_reponse_id: number | string;
};

export type QuizGenerateResponse = {
  quiz_id: number;
  questions: QuizQuestion[];
  time: number;
  served: "generated" | "existing";
};

export type QuizStartResponse = {
  data: QuizQuestion[];
  time: number;
  userQuiz: {
    id: number;
    user_id: number;
    chapitre_id: number;
    difficulte: string;
    created_at: string;
  };
};

export type QuizSubmitResponse = {
  message: string;
  score: number;
  note: {
    id: number;
    user_id: number;
    quiz_id: number;
    note: number;
    created_at: string;
  };
  userQuiz: {
    id: number;
    chapitre_id: number;
    difficulte: string;
  };
  corrections: QuizQuestion[];
};

export type GetQuizResponse = {
  quiz: QuizDefinition & { matiere: { libelle: string } }; // Assuming matiere is nested
  questions: QuizQuestion[];
};

export type QuizNotesResponse = {
  userQuiz: {
    id: number;
    chapitre_id: number;
    difficulte: string;
  };
  notes: {
    id: number;
    user_id: number;
    quiz_id: number;
    note: number;
    created_at: string;
    user: {
      id: number;
      name: string;
    };
  }[];
  questions_approfondissement: {
    question: string;
    reponse: string;
  }[];
};

export type StartGroupQuizResponse = {
  quiz: {
    id: number;
    titre: string;
    description: string | null;
    difficulte: string;
    groupe_id: number;
    created_at: string;
  };
  groupe: {
    id: number;
    nom: string;
    description: string;
  };
  data: {
    question: string;
    reponses: { texte: string }[];
  }[];
  questions_approfondissement: {
    question: string;
    reponse: string;
  }[];
  time: number;
  started_at: string;
};

export type SubmitGroupQuizResponse = {
  message: string;
  note: {
    user_id: number;
    quiz_id: string;
    note: number;
    updated_at: string;
    created_at: string;
    id: number;
  };
  corrections: {
    qcm: {
      question: string;
      propositions: Record<string, string>;
      bonne_reponse: string;
    }[];
    questions_approfondissement: {
      question: string;
      reponse: string;
    }[];
  };
};
