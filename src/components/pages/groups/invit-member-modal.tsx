"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { X, Mail, UserPlus, Plus, User } from "lucide-react";
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
import { useCheckEleveByEmail } from "@/services/hooks/eleves/useCheckEleve";
import { toast } from "@/lib/toast";
import { EleveInfo } from "@/services/controllers/types/common/eleve.types";

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
  members: InvitedMember[];
  currentEmail: string;
  searchResults: EleveInfo | null;
  showDropdown: boolean;
  isChecking: boolean;
  isPending: boolean;
  groupName: string;
  handleEmailChange: (value: string) => void;
  handleAddEmail: () => void;
  handleAddUser: (user: EleveInfo) => void;
  handleRemoveMember: (email: string) => void;
  handleEmailKeyPress: (e: React.KeyboardEvent) => void;
}

const FormContent = ({
  members,
  currentEmail,
  searchResults,
  showDropdown,
  isChecking,
  isPending,
  groupName,
  handleEmailChange,
  handleAddEmail,
  handleAddUser,
  handleRemoveMember,
  handleEmailKeyPress,
}: FormContentProps) => (
  <div className="space-y-6">
    {/* Section Email avec Autocomplete */}
    <div className="space-y-3 relative">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Mail className="w-4 h-4" />
        Chercher et inviter
      </Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="email"
            placeholder="Tapez un email pour chercher..."
            value={currentEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
            onKeyPress={handleEmailKeyPress}
            className="bg-gray-50 border-gray-200"
            disabled={isPending}
          />

          {/* Dropdown Autocomplete */}
          {showDropdown && currentEmail && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {isChecking && (
                <div className="p-3 flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-gray-500">Recherche...</span>
                </div>
              )}

              {!isChecking && searchResults && (
                <button
                  onClick={() => handleAddUser(searchResults)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                  type="button"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {searchResults.prenom} {searchResults.nom}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{searchResults.email}</p>
                  </div>
                  <Plus className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                </button>
              )}

              {!isChecking && !searchResults && currentEmail && (
                <div className="p-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Aucun élève trouvé</p>
                  <button
                    onClick={handleAddEmail}
                    className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-600 transition-colors"
                    type="button"
                  >
                    Ajouter comme email libre
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          type="button"
          onClick={handleAddEmail}
          variant="outline"
          size="icon"
          disabled={isPending || isChecking || !currentEmail.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>

    {/* Liste des invités */}
    {members.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <Badge
            key={member.email}
            variant="secondary"
            className={`px-3 py-1 border ${
              member.type === "user"
                ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            {member.type === "user" && (
              <User className="w-3 h-3 mr-1" />
            )}
            {member.type === "user"
              ? `${member.user?.prenom} ${member.user?.nom}`
              : member.email}
            <button
              onClick={() => handleRemoveMember(member.email)}
              className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              disabled={isPending}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    )}

    {/* Résumé */}
    {members.length > 0 && (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-medium">{members.length} invitation(s)</span>{" "}
          seront envoyées pour rejoindre{" "}
          <span className="font-semibold">{groupName}</span>
        </p>
      </div>
    )}
  </div>
);

interface InvitedMember {
  type: "email" | "user";
  email: string;
  user?: EleveInfo;
}

export const InviteUsersModal = ({
  isOpen,
  onClose,
  groupId,
  groupName,
  cardColor = "bg-[#F5E6D3]",
  isMobile = false,
}: InviteUsersModalProps) => {
  const [members, setMembers] = useState<InvitedMember[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [searchResults, setSearchResults] = useState<EleveInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const { mutate: inviteUsers, isPending } = useInviteUsersToGroupe();
  const { mutate: checkEleve, isPending: isChecking } = useCheckEleveByEmail();

  // Validation email simple
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Gérer le changement d'email avec debounce
  const handleEmailChange = useCallback((value: string) => {
    setCurrentEmail(value);
    setShowDropdown(!!value);
    setSearchResults(null);

    // Nettoyer le timeout précédent
    if (debounceTimeout) clearTimeout(debounceTimeout);

    if (!value.trim()) {
      setShowDropdown(false);
      return;
    }

    // Nouveau timeout
    const timeout = setTimeout(() => {
      if (isValidEmail(value.trim())) {
        checkEleve(value.trim(), {
          onSuccess: (response) => {
            if ("exists" in response && response.exists) {
              setSearchResults(response.eleve);
            } else {
              setSearchResults(null);
            }
          },
          onError: () => {
            setSearchResults(null);
          },
        });
      }
    }, 500); // 500ms debounce

    setDebounceTimeout(timeout);
  }, [debounceTimeout, checkEleve]);

  // Ajouter un élève trouvé
  const handleAddUser = useCallback((user: EleveInfo) => {
    const memberExists = members.some((m) => m.email === user.email);
    if (memberExists) {
      toast({
        variant: "warning",
        title: "Déjà présent",
        message: "Cet élève a déjà été ajouté à la liste d'invitation.",
      });
      return;
    }

    setMembers([...members, { type: "user", email: user.email, user }]);
    setCurrentEmail("");
    setSearchResults(null);
    setShowDropdown(false);
  }, [members]);

  // Ajouter un email libre
  const handleAddEmail = useCallback(() => {
    const trimmedEmail = currentEmail.trim();
    if (!trimmedEmail) return;

    if (!isValidEmail(trimmedEmail)) {
      toast({
        variant: "error",
        title: "Email invalide",
        message: "Le format de l'email que vous avez entré n'est pas valide.",
      });
      return;
    }

    const memberExists = members.some((m) => m.email === trimmedEmail);
    if (memberExists) {
      toast({
        variant: "warning",
        title: "Déjà présent",
        message: "Cet email a déjà été ajouté à la liste d'invitation.",
      });
      return;
    }

    setMembers([...members, { type: "email", email: trimmedEmail }]);
    setCurrentEmail("");
    setSearchResults(null);
    setShowDropdown(false);
  }, [currentEmail, members]);

  // Supprimer un membre
  const handleRemoveMember = useCallback((emailToRemove: string) => {
    setMembers((prev) => prev.filter((m) => m.email !== emailToRemove));
  }, []);

  // Envoyer les invitations
  const handleInvite = useCallback(() => {
    if (members.length === 0) {
      toast({
        variant: "error",
        title: "Liste vide",
        message: "Veuillez ajouter au moins une personne à inviter.",
      });
      return;
    }

    const memberEmails = members.map((m) => m.email);

    inviteUsers(
      {
        groupeId: groupId,
        payload: {
          member_emails: memberEmails,
          invitation_page_url:
            "https://aladin-qze2.vercel.app/student/invitations",
          register_page_url: "https://aladin-qze2.vercel.app/student/register",
        },
      },
      {
        onSuccess: () => {
          setMembers([]);
          setCurrentEmail("");
          setSearchResults(null);
          onClose();
        },
      },
    );
  }, [members, groupId, inviteUsers, onClose]);

  // Réinitialiser et fermer
  const handleCancel = useCallback(() => {
    setMembers([]);
    setCurrentEmail("");
    setSearchResults(null);
    setShowDropdown(false);
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
              members={members}
              currentEmail={currentEmail}
              searchResults={searchResults}
              showDropdown={showDropdown}
              isChecking={isChecking}
              isPending={isPending}
              groupName={groupName}
              handleEmailChange={handleEmailChange}
              handleAddEmail={handleAddEmail}
              handleAddUser={handleAddUser}
              handleRemoveMember={handleRemoveMember}
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
              disabled={isPending || members.length === 0}
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
            members={members}
            currentEmail={currentEmail}
            searchResults={searchResults}
            showDropdown={showDropdown}
            isChecking={isChecking}
            isPending={isPending}
            groupName={groupName}
            handleEmailChange={handleEmailChange}
            handleAddEmail={handleAddEmail}
            handleAddUser={handleAddUser}
            handleRemoveMember={handleRemoveMember}
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
            disabled={isPending || members.length === 0}
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
