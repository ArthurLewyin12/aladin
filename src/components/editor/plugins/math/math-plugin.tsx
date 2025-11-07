import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR } from "lexical";
import { useEffect } from "react";
import { INSERT_MATH_COMMAND, InsertMathPayload } from "./math-commands";
import { $createMathNode, MathNode } from "../../nodes/math-node";

export function MathPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([MathNode])) {
      throw new Error("MathPlugin: MathNode not registered on editor");
    }

    return editor.registerCommand(
      INSERT_MATH_COMMAND,
      (payload: InsertMathPayload) => {
        const { latex, inline } = payload;
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const mathNode = $createMathNode(latex, inline);
          selection.insertNodes([mathNode]);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}