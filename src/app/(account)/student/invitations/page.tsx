"use client";
import { useSearchParams } from "next/navigation";
import { useInvitationByToken } from "@/services/hooks/groupes/useInvitationByToken";
import { useAcceptInvitation } from "@/services/hooks/groupes/useAcceptInvitation";
import { useDeclineInvitation } from "@/services/hooks/groupes/useDeclineInvitation";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, X, MailWarning, Users } from "lucide-react";
import { Suspense } from "react";

function InvitationComponent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const {
    data: invitation,
    isLoading,
    isError,
    error,
  } = useInvitationByToken(token || "");
  const { mutate: acceptInvitation, isPending: isAccepting } =
    useAcceptInvitation();
  const { mutate: declineInvitation, isPending: isDeclining } =
    useDeclineInvitation();

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
      <div className="w-full max-w-md">
        <Alert className="border-red-200 bg-red-50">
          <MailWarning className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 font-bold">
            Invitation Invalide
          </AlertTitle>
          <AlertDescription className="text-red-700">
            {error?.message ||
              "Ce lien d'invitation est invalide ou a expiré. Veuillez demander une nouvelle invitation."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  if (invitation.status !== "pending") {
    return (
      <div className="w-full max-w-md">
        <Alert className="border-orange-200 bg-orange-50">
          <MailWarning className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-orange-800 font-bold">
            Invitation déjà traitée
          </AlertTitle>
          <AlertDescription className="text-orange-700">
            Cette invitation a déjà été{" "}
            {invitation.status === "accepted" ? "acceptée" : "refusée"}.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
      <div
        className="h-2 w-full"
        style={{
          background: "linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)",
        }}
      />
      <CardHeader className="bg-white pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Rejoindre le groupe
          </CardTitle>
        </div>
        <CardDescription className="text-base text-gray-600 leading-relaxed">
          Vous avez été invité à rejoindre le groupe{" "}
          <span className="font-bold text-orange-600">
            {invitation.groupe.nom}
          </span>{" "}
          par{" "}
          <span className="font-semibold text-gray-800">
            {invitation.invited_by.prenom} {invitation.invited_by.nom}
          </span>
          .
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-gray-50 pt-6 pb-6">
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleDecline}
            disabled={isDeclining || isAccepting}
            className="border-gray-300 hover:bg-gray-100 text-gray-700 px-6"
          >
            <X className="mr-2 h-4 w-4" />
            Refuser
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isAccepting || isDeclining}
            className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-6 shadow-lg hover:shadow-xl transition-all"
          >
            <Check className="mr-2 h-4 w-4" />
            Accepter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InvitationPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense fallback={<Spinner size="lg" />}>
        <InvitationComponent />
      </Suspense>
    </div>
  );
}
