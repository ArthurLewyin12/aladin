import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { $createMathNode } from "@/components/editor/nodes/math-node";
import { Calculator } from "lucide-react";

export function MathPickerPlugin(): React.ReactElement {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [latex, setLatex] = useState("");
  const [inline, setInline] = useState(true);

  const handleInsert = () => {
    if (!latex.trim()) return;

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const mathNode = $createMathNode(latex, inline);
        selection.insertNodes([mathNode]);
      }
    });

    setLatex("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Insérer une formule mathématique"
        >
          <Calculator className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insérer une formule mathématique</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="latex">Formule LaTeX</Label>
            <Input
              id="latex"
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              placeholder="Ex: x^2 + y^2 = z^2"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Type d'affichage</Label>
            <RadioGroup
              value={inline ? "inline" : "block"}
              onValueChange={(value) => setInline(value === "inline")}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inline" id="inline" />
                <Label htmlFor="inline">En ligne (avec le texte)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="block" id="block" />
                <Label htmlFor="block">Centrée (nouvelle ligne)</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleInsert} disabled={!latex.trim()}>
              Insérer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}