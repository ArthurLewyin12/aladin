"use client";

import { useState, useCallback } from "react";
import { X, Mail, UserPlus, Plus } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useInviteUsersToGroupe } from "@/services/hooks/groupes/useInviteUsersToGroupe";
import { toast } from "sonner";

interface InviteUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  groupName: string;
  cardColor?: string;
  isMobile?: boolean;
}

// Composant FormContent sorti du parent pour éviter les re-renders
interface FormContentProps {
  emails: string[];
  currentEmail: string;
  isPending: boolean;
  groupName: string;
  setCurrentEmail: (value: string) => void;
  handleAddEmail: () => void;
  handleRemoveEmail: (email: string) => void;
  handleEmailKeyPress: (e: React.KeyboardEvent) => void;
}

const FormContent = ({
  emails,
  currentEmail,
  isPending,
  groupName,
  setCurrentEmail,
  handleAddEmail,
  handleRemoveEmail,
  handleEmailKeyPress,
}: FormContentProps) => (
  <div className="space-y-6">
    {/* Section Email */}
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Mail className="w-4 h-4" />
        Inviter par email
      </Label>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="exemple@email.com"
          value={currentEmail}
          onChange={(e) => setCurrentEmail(e.target.value)}
          onKeyPress={handleEmailKeyPress}
          className="bg-gray-50 border-gray-200"
          disabled={isPending}
        />
        <Button
          type="button"
          onClick={handleAddEmail}
          variant="outline"
          size="icon"
          disabled={isPending}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {emails.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {emails.map((email) => (
            <Badge
              key={email}
              variant="secondary"
              className="px-3 py-1 bg-white border border-gray-200"
            >
              {email}
              <button
                onClick={() => handleRemoveEmail(email)}
                className="ml-2 hover:text-red-600"
                disabled={isPending}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>

    {/* Résumé */}
    {emails.length > 0 && (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-medium">{emails.length} invitation(s)</span>{" "}
          seront envoyées pour rejoindre{" "}
          <span className="font-semibold">{groupName}</span>
        </p>
      </div>
    )}
  </div>
);

export const InviteUsersModal = ({
  isOpen,
  onClose,
  groupId,
  groupName,
  cardColor = "bg-[#F5E6D3]",
  isMobile = false,
}: InviteUsersModalProps) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");

  const { mutate: inviteUsers, isPending } = useInviteUsersToGroupe();

  // Validation email simple
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Ajouter un email
  const handleAddEmail = useCallback(() => {
    const trimmedEmail = currentEmail.trim();
    if (!trimmedEmail) return;

    if (!isValidEmail(trimmedEmail)) {
      toast.error("Format d'email invalide");
      return;
    }

    if (emails.includes(trimmedEmail)) {
      toast.error("Cet email a déjà été ajouté");
      return;
    }

    setEmails([...emails, trimmedEmail]);
    setCurrentEmail("");
  }, [currentEmail, emails]);

  // Supprimer un email
  const handleRemoveEmail = useCallback((emailToRemove: string) => {
    setEmails((prev) => prev.filter((e) => e !== emailToRemove));
  }, []);

  // Envoyer les invitations
  const handleInvite = useCallback(() => {
    if (emails.length === 0) {
      toast.error("Veuillez ajouter au moins un email");
      return;
    }

    inviteUsers(
      {
        groupeId: groupId,
        payload: {
          member_emails: emails,
          invitation_page_url:
            "https://aladin-qze2.vercel.app/student/invitations",
          register_page_url: "https://aladin-qze2.vercel.app/student/register",
        },
      },
      {
        onSuccess: () => {
          setEmails([]);
          setCurrentEmail("");
          onClose();
        },
      },
    );
  }, [emails, groupId, inviteUsers, onClose]);

  // Réinitialiser et fermer
  const handleCancel = useCallback(() => {
    setEmails([]);
    setCurrentEmail("");
    onClose();
  }, [onClose]);

  // Gérer la touche Enter
  const handleEmailKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddEmail();
      }
    },
    [handleAddEmail],
  );

  // Version Desktop (Dialog)
  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className={`sm:max-w-[550px] ${cardColor} border-none`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              Inviter des amis
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <FormContent
              emails={emails}
              currentEmail={currentEmail}
              isPending={isPending}
              groupName={groupName}
              setCurrentEmail={setCurrentEmail}
              handleAddEmail={handleAddEmail}
              handleRemoveEmail={handleRemoveEmail}
              handleEmailKeyPress={handleEmailKeyPress}
            />
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="px-6"
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button
              onClick={handleInvite}
              className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-8"
              disabled={isPending || emails.length === 0}
            >
              {isPending ? (
                <>
                  <Spinner size="sm" className="mr-2 border-white" />
                  Envoi...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer les invitations
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Version Mobile (Drawer)
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DrawerContent className={`${cardColor} max-h-[90vh]`}>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            Inviter des amis
          </DrawerTitle>
          <DrawerClose className="absolute right-4 top-4">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-4 overflow-y-auto">
          <FormContent
            emails={emails}
            currentEmail={currentEmail}
            isPending={isPending}
            groupName={groupName}
            setCurrentEmail={setCurrentEmail}
            handleAddEmail={handleAddEmail}
            handleRemoveEmail={handleRemoveEmail}
            handleEmailKeyPress={handleEmailKeyPress}
          />
        </div>

        <DrawerFooter className="flex-row gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex-1"
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button
            onClick={handleInvite}
            className="bg-[#2C3E50] hover:bg-[#1a252f] text-white flex-1"
            disabled={isPending || emails.length === 0}
          >
            {isPending ? (
              <>
                <Spinner size="sm" className="mr-2 border-white" />
                Envoi...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Envoyer
              </>
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
