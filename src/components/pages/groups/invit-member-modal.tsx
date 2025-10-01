"use client";

import { useState, useCallback } from "react";
import { X, Mail, Phone, UserPlus, Plus } from "lucide-react";
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
  phoneNumbers: string[];
  currentEmail: string;
  currentPhone: string;
  isPending: boolean;
  groupName: string;
  setCurrentEmail: (value: string) => void;
  setCurrentPhone: (value: string) => void;
  handleAddEmail: () => void;
  handleAddPhone: () => void;
  handleRemoveEmail: (email: string) => void;
  handleRemovePhone: (phone: string) => void;
  handleEmailKeyPress: (e: React.KeyboardEvent) => void;
  handlePhoneKeyPress: (e: React.KeyboardEvent) => void;
}

const FormContent = ({
  emails,
  phoneNumbers,
  currentEmail,
  currentPhone,
  isPending,
  groupName,
  setCurrentEmail,
  setCurrentPhone,
  handleAddEmail,
  handleAddPhone,
  handleRemoveEmail,
  handleRemovePhone,
  handleEmailKeyPress,
  handlePhoneKeyPress,
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

    {/* Section Téléphone */}
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Phone className="w-4 h-4" />
        Inviter par téléphone
      </Label>
      <div className="flex gap-2">
        <Input
          type="tel"
          placeholder="+225 01 23 45 67 89"
          value={currentPhone}
          onChange={(e) => setCurrentPhone(e.target.value)}
          onKeyPress={handlePhoneKeyPress}
          className="bg-gray-50 border-gray-200"
          disabled={isPending}
        />
        <Button
          type="button"
          onClick={handleAddPhone}
          variant="outline"
          size="icon"
          disabled={isPending}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {phoneNumbers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {phoneNumbers.map((phone) => (
            <Badge
              key={phone}
              variant="secondary"
              className="px-3 py-1 bg-white border border-gray-200"
            >
              {phone}
              <button
                onClick={() => handleRemovePhone(phone)}
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
    {(emails.length > 0 || phoneNumbers.length > 0) && (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-medium">
            {emails.length + phoneNumbers.length} invitation(s)
          </span>{" "}
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
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPhone, setCurrentPhone] = useState("");

  const { mutate: inviteUsers, isPending } = useInviteUsersToGroupe();

  // Validation email simple
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validation téléphone simple
  const isValidPhone = (phone: string) => {
    return /^[\d\s+()-]{8,}$/.test(phone);
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

  // Ajouter un numéro de téléphone
  const handleAddPhone = useCallback(() => {
    const trimmedPhone = currentPhone.trim();
    if (!trimmedPhone) return;

    if (!isValidPhone(trimmedPhone)) {
      toast.error("Format de numéro invalide");
      return;
    }

    if (phoneNumbers.includes(trimmedPhone)) {
      toast.error("Ce numéro a déjà été ajouté");
      return;
    }

    setPhoneNumbers([...phoneNumbers, trimmedPhone]);
    setCurrentPhone("");
  }, [currentPhone, phoneNumbers]);

  // Supprimer un email
  const handleRemoveEmail = useCallback((emailToRemove: string) => {
    setEmails((prev) => prev.filter((e) => e !== emailToRemove));
  }, []);

  // Supprimer un numéro
  const handleRemovePhone = useCallback((phoneToRemove: string) => {
    setPhoneNumbers((prev) => prev.filter((p) => p !== phoneToRemove));
  }, []);

  // Envoyer les invitations
  const handleInvite = useCallback(() => {
    if (emails.length === 0 && phoneNumbers.length === 0) {
      toast.error(
        "Veuillez ajouter au moins un email ou un numéro de téléphone",
      );
      return;
    }

    inviteUsers(
      {
        groupeId: groupId,
        payload: {
          invited_emails: emails.length > 0 ? emails : undefined,
          phone_numbers: phoneNumbers.length > 0 ? phoneNumbers : undefined,
        },
      },
      {
        onSuccess: () => {
          setEmails([]);
          setPhoneNumbers([]);
          setCurrentEmail("");
          setCurrentPhone("");
          onClose();
        },
      },
    );
  }, [emails, phoneNumbers, groupId, inviteUsers, onClose]);

  // Réinitialiser et fermer
  const handleCancel = useCallback(() => {
    setEmails([]);
    setPhoneNumbers([]);
    setCurrentEmail("");
    setCurrentPhone("");
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

  const handlePhoneKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddPhone();
      }
    },
    [handleAddPhone],
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
              phoneNumbers={phoneNumbers}
              currentEmail={currentEmail}
              currentPhone={currentPhone}
              isPending={isPending}
              groupName={groupName}
              setCurrentEmail={setCurrentEmail}
              setCurrentPhone={setCurrentPhone}
              handleAddEmail={handleAddEmail}
              handleAddPhone={handleAddPhone}
              handleRemoveEmail={handleRemoveEmail}
              handleRemovePhone={handleRemovePhone}
              handleEmailKeyPress={handleEmailKeyPress}
              handlePhoneKeyPress={handlePhoneKeyPress}
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
              disabled={
                isPending || (emails.length === 0 && phoneNumbers.length === 0)
              }
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
            phoneNumbers={phoneNumbers}
            currentEmail={currentEmail}
            currentPhone={currentPhone}
            isPending={isPending}
            groupName={groupName}
            setCurrentEmail={setCurrentEmail}
            setCurrentPhone={setCurrentPhone}
            handleAddEmail={handleAddEmail}
            handleAddPhone={handleAddPhone}
            handleRemoveEmail={handleRemoveEmail}
            handleRemovePhone={handleRemovePhone}
            handleEmailKeyPress={handleEmailKeyPress}
            handlePhoneKeyPress={handlePhoneKeyPress}
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
            disabled={
              isPending || (emails.length === 0 && phoneNumbers.length === 0)
            }
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
