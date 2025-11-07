import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { $createCalloutNode, CalloutType } from "@/components/editor/nodes/callout-node";
import { MessageSquare } from "lucide-react";

const calloutOptions = [
  { type: "info" as CalloutType, label: "ℹ️ Information", color: "blue" },
  { type: "warning" as CalloutType, label: "⚠️ Attention", color: "yellow" },
  { type: "success" as CalloutType, label: "✅ Important", color: "green" },
  { type: "note" as CalloutType, label: "📝 Note", color: "gray" },
];

export function CalloutPickerPlugin(): React.ReactElement {
  const [editor] = useLexicalComposerContext();

  const handleInsertCallout = (calloutType: CalloutType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const calloutNode = $createCalloutNode(calloutType);
        selection.insertNodes([calloutNode]);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Insérer un encadré pédagogique"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {calloutOptions.map((option) => (
          <DropdownMenuItem
            key={option.type}
            onClick={() => handleInsertCallout(option.type)}
            className="cursor-pointer"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}