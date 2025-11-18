"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useMediaQuery } from "@/services/hooks/use-media-query";
import { useCreateClassMessage } from "@/services/hooks/professeur/useCreateClassMessage";

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  classeId: number;
}

const messageFormSchema = z.object({
  message: z.string().min(1, "Le message ne peut pas être vide."),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

export const SendMessageModal = ({
  isOpen,
  onClose,
  classeId,
}: SendMessageModalProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [endDate, setEndDate] = useState<Date | undefined>(
    addDays(new Date(), 7),
  );

  const { mutate: createMessage, isPending } = useCreateClassMessage();

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
  });

  const handlePublish = (data: MessageFormValues) => {
    if (!endDate) {
      return;
    }

    // Utiliser la date du jour comme date de début
    const today = new Date();

    createMessage(
      {
        classeId,
        payload: {
          message: data.message,
          date_debut: format(today, "yyyy-MM-dd"),
          date_fin: format(endDate, "yyyy-MM-dd"),
        },
      },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      },
    );
  };

  const FormContent = (
    <form onSubmit={form.handleSubmit(handlePublish)} className="space-y-4">
      <div>
        <Label className="text-sm text-gray-600">Date de fin de validité</Label>
        <div className="mt-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "LLL dd, y") : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Le message sera actif à partir d'aujourd'hui jusqu'à la date sélectionnée.
        </p>
      </div>

      <div>
        <Label htmlFor="message" className="text-sm text-gray-600">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Saisissez votre message ici..."
          rows={5}
          {...form.register("message")}
          className="mt-1 bg-gray-50 border-gray-200 resize-none"
        />
        {form.formState.errors.message && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.message.message}
          </p>
        )}
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="bg-gray-50">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl font-bold text-[#2C3E50]">
              Passer une info
            </DrawerTitle>
            <DrawerClose className="absolute right-4 top-4">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 pb-4">{FormContent}</div>
          <DrawerFooter className="flex-row gap-3 justify-end border-t">
            <Button variant="ghost" onClick={onClose} className="flex-1" disabled={isPending}>
              Annuler
            </Button>
            <Button
              onClick={form.handleSubmit(handlePublish)}
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white flex-1"
              disabled={isPending}
            >
              {isPending ? <Spinner size="sm" className="mr-2" /> : null}
              Publier
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#2C3E50]">
            Passer une info
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">{FormContent}</div>
        <div className="flex gap-3 mt-6 justify-end border-t pt-4">
          <Button variant="ghost" onClick={onClose} className="px-6" disabled={isPending}>
            Annuler
          </Button>
          <Button
            onClick={form.handleSubmit(handlePublish)}
            className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-8"
            disabled={isPending}
          >
            {isPending ? <Spinner size="sm" className="mr-2" /> : null}
            Publier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
