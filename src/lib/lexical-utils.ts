import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import { CourseContent, CourseContentMetadata } from "@/services/controllers/types/common/professeur.types";

/**
 * Extrait le texte brut d'un état Lexical
 */
export function extractPlainText(editor: LexicalEditor): string {
  let text = "";
  editor.getEditorState().read(() => {
    text = $getRoot().getTextContent();
  });
  return text;
}

/**
 * Extrait le HTML d'un état Lexical
 */
export function extractHTML(editor: LexicalEditor): string {
  let html = "";
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor);
  });
  return html;
}

/**
 * Compte le nombre de mots dans un texte
 */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Compte le nombre de caractères (sans espaces)
 */
export function countCharacters(text: string): number {
  return text.replace(/\s/g, "").length;
}

/**
 * Analyse le JSON de l'état Lexical pour extraire les métadonnées
 */
export function extractMetadataFromLexicalState(lexicalState: any): CourseContentMetadata {
  let imageCount = 0;
  let videoCount = 0;
  let tableCount = 0;
  let hasMath = false;

  // Fonction récursive pour parcourir les nœuds
  function traverseNodes(node: any) {
    if (!node) return;

    // Vérifier le type de nœud
    if (node.type === "image") {
      imageCount++;
    } else if (node.type === "youtube" || node.type === "tweet" || node.type === "video") {
      videoCount++;
    } else if (node.type === "table") {
      tableCount++;
    } else if (node.type === "equation") {
      hasMath = true;
    }

    // Parcourir les enfants
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverseNodes);
    }
  }

  // Parcourir l'arbre à partir de la racine
  if (lexicalState?.root) {
    traverseNodes(lexicalState.root);
  }

  // Extraire le texte pour compter les mots
  let plainText = "";
  function extractText(node: any): void {
    if (!node) return;
    if (node.text) {
      plainText += node.text + " ";
    }
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(extractText);
    }
  }

  if (lexicalState?.root) {
    extractText(lexicalState.root);
  }

  return {
    word_count: countWords(plainText),
    character_count: countCharacters(plainText),
    has_images: imageCount > 0,
    has_tables: tableCount > 0,
    has_videos: videoCount > 0,
    has_math: hasMath,
    image_count: imageCount,
    video_count: videoCount,
    table_count: tableCount,
  };
}

/**
 * Extrait le contenu complet d'un éditeur Lexical
 * Inclut lexical_state, HTML, texte brut et métadonnées
 */
export function extractCourseContent(editor: LexicalEditor): CourseContent {
  const editorState = editor.getEditorState();
  const lexicalState = editorState.toJSON();

  let html = "";
  let plainText = "";

  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor);
    plainText = $getRoot().getTextContent();
  });

  const metadata = extractMetadataFromLexicalState(lexicalState);

  return {
    lexical_state: lexicalState,
    html,
    plain_text: plainText,
    metadata,
  };
}

/**
 * Valide qu'un état Lexical est valide
 */
export function isValidLexicalState(state: any): boolean {
  try {
    return (
      state &&
      typeof state === "object" &&
      state.root &&
      typeof state.root === "object"
    );
  } catch (error) {
    return false;
  }
}


