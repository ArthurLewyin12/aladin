import { AuthUser } from "@/services/controllers/types/common/user.type";
import { Mail, GraduationCap, LogOut } from "lucide-react";
import { useSession } from "@/services/hooks/auth/useSession";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuitGroupe } from "@/services/hooks/groupes/useQuitGroupe";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface MemberPopoverCardProps {
  user: AuthUser;
  bgColor: string;
  niveauLabel: string;
  isChief: boolean;
  groupId: number;
}

export const MemberPopoverCard = ({
  user,
  bgColor,
  niveauLabel,
  isChief,
  groupId,
}: MemberPopoverCardProps) => {
  const { user: currentUser } = useSession();
  const { mutate: quitGroupe, isPending } = useQuitGroupe();
  const router = useRouter();

  const isCurrentUser = currentUser?.id === user.id;

  const handleQuitGroup = () => {
    quitGroupe(groupId, {
      onSuccess: () => {
        toast({ variant: "success", message: "Vous avez quitté le groupe." });
        router.push("/student/groups");
      },
      onError: (error: any) => {
        toast({
          variant: "error",
          title: "Erreur",
          message: error.message || "Impossible de quitter le groupe.",
        });
      },
    });
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white max-w-xs w-full">
      <div className={`h-20 ${bgColor}`} />
      <div className="p-4 relative">
        <div
          className={`w-24 h-24 rounded-full ${bgColor} flex items-center justify-center text-gray-900 font-bold text-3xl absolute -top-12 left-1/2 -translate-x-1/2 border-4 border-white`}
        >
          {user.prenom.charAt(0).toUpperCase()}
          {user.nom.charAt(0).toUpperCase()}
        </div>
        <div className="pt-12 text-center">
          <h3 className="text-xl font-bold text-gray-900">
            {user.prenom} {user.nom}
          </h3>
          <p className="text-sm text-gray-500">
            {isChief ? "Auteur du Groupe" : "Membre du Groupe"}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center text-sm text-gray-700">
            <Mail className="w-4 h-4 mr-2 text-gray-500" />
            <span>{user.mail}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
            <span>{niveauLabel}</span>
          </div>
        </div>
        {isCurrentUser && !isChief && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={isPending}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Quitter le groupe
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Êtes-vous sûr de vouloir quitter ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Vous ne pourrez plus accéder
                    aux ressources de ce groupe.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleQuitGroup}
                    disabled={isPending}
                  >
                    {isPending ? "Départ en cours..." : "Quitter"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
};
