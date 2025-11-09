"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useInvitationByToken } from "@/services/hooks/groupes/useInvitationByToken";
import { useAcceptInvitation } from "@/services/hooks/groupes/useAcceptInvitation";
import { useDeclineInvitation } from "@/services/hooks/groupes/useDeclineInvitation";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Check,
  X,
  AlertCircle,
  Users,
  UserPlus,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import { Suspense } from "react";

function InvitationComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const {
    data: invitation,
    isLoading,
    isError,
    error,
  } = useInvitationByToken(token || "");
  const { mutate: acceptInvitation, isPending: isAccepting } =
    useAcceptInvitation({
      onSuccess: () => {
        // Redirection vers la page des groupes après 1 seconde
        setTimeout(() => {
          router.push("/student/groups");
        }, 1000);
      },
    });
  const { mutate: declineInvitation, isPending: isDeclining } =
    useDeclineInvitation({
      onSuccess: () => {
        // Redirection vers la page des groupes après 1 seconde
        setTimeout(() => {
          router.push("/student/groups");
        }, 1000);
      },
    });

  const handleAccept = () => {
    if (invitation) {
      acceptInvitation(invitation.id);
    }
  };

  const handleDecline = () => {
    if (invitation) {
      declineInvitation(invitation.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border-2 border-red-200 p-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 bg-red-50 rounded-xl">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Invitation invalide
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {error?.message ||
                  "Ce lien d'invitation est invalide ou a expiré. Veuillez demander une nouvelle invitation."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  if (invitation.status !== "en attente") {
    const isAccepted = invitation.status === "acceptée";

    return (
      <div className="w-full max-w-lg mx-auto">
        <div
          className={`bg-white rounded-2xl border-2 ${
            isAccepted ? "border-green-200" : "border-gray-200"
          } p-8 shadow-lg`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 p-3 rounded-xl ${
                isAccepted ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              {isAccepted ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Invitation déjà traitée
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Cette invitation a déjà été{" "}
                {isAccepted ? "acceptée" : "refusée"}.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Header Section with orange gradient */}
        <div className="px-8 py-6 bg-gradient-to-r from-orange-50 via-orange-50 to-yellow-50 border-b border-orange-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-orange-100">
              <Sparkles className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Invitation au groupe
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Rejoignez votre équipe sur la plateforme
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 bg-gray-50">
          <div className="space-y-5">
            {/* Inviter Info */}
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-xl">
                <UserPlus className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {invitation.inviteur?.prenom ||
                      invitation.user_envoie?.prenom}{" "}
                    {invitation.inviteur?.nom || invitation.user_envoie?.nom}
                  </span>{" "}
                  vous a invité à rejoindre
                </p>
              </div>
            </div>

            {/* Group Info Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {invitation.groupe.nom}
                  </h3>
                  <p className="text-sm text-gray-600">Groupe privé</p>
                </div>
              </div>
            </div>

            {/* Expiration Notice */}
            <div className="flex items-center gap-3 bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <Clock className="h-4 w-4 text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                Cette invitation expirera dans 7 jours
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="px-8 py-6 bg-white border-t border-gray-100">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleDecline}
              disabled={isDeclining || isAccepting}
              className="flex-1 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-xl h-11 font-medium transition-all"
            >
              {isDeclining ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              Décliner
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isAccepting || isDeclining}
              className="flex-1 bg-[#2C3E50] hover:bg-[#1a252f] text-white border-0 rounded-xl h-11 font-medium shadow-lg hover:shadow-xl transition-all"
            >
              {isAccepting ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Accepter l'invitation
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center px-4">
        <p className="text-sm text-gray-500">
          En acceptant cette invitation, vous rejoindrez le groupe et aurez
          accès à ses ressources partagées.
        </p>
      </div>
    </div>
  );
}

export default function InvitationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <InvitationComponent />
      </Suspense>
    </div>
  );
}
