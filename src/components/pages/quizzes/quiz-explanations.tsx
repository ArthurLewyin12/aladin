"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/services/hooks/use-media-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
  DrawerHeader,
} from "@/components/ui/drawer";

interface QuizExplanation {
  question: string;
  reponse: string;
}

interface QuizExplanationsProps {
  explanations: QuizExplanation[];
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuizExplanations({
  explanations,
  children,
  open,
  onOpenChange,
}: QuizExplanationsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="max-w-xl max-h-screen overflow-y-auto p-0 sm:p-6">
          {" "}
          {/* Largeur boostée à max-w-2xl pour plus d'espace sur desktop, padding intact */}
          <SheetHeader className="border-b border-border/50 pb-6">
            <SheetTitle className="text-xl font-semibold text-foreground">
              Explications détaillées
            </SheetTitle>
          </SheetHeader>
          <div className="px-0 sm:px-6 py-4 space-y-2">
            <Accordion type="single" collapsible className="w-full">
              {explanations.map((explanation, index) => (
                <AccordionItem
                  value={`item-${index}`}
                  key={index}
                  className="border-border/30 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <AccordionTrigger className="text-lg font-medium text-foreground hover:text-primary py-4">
                    {explanation.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground pt-2">
                    {explanation.reponse}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="max-h-[80vh] flex flex-col">
        <DrawerHeader className="border-b border-border/50 pb-4 px-4">
          <DrawerTitle className="text-lg font-semibold text-foreground">
            Explications détaillées
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          <Accordion type="single" collapsible className="w-full">
            {explanations.map((explanation, index) => (
              <AccordionItem
                value={`item-${index}`}
                key={index}
                className="border-border/30 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <AccordionTrigger className="text-base font-medium text-foreground hover:text-primary py-3">
                  {explanation.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground pt-2">
                  {explanation.reponse}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
