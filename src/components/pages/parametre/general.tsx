"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "@/lib/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User as UserIcon,
  Lock,
  MessageSquare,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Volume2,
  Users,
} from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { useUpdateUserInfo } from "@/services/hooks/auth/useUpdateUserInfo";
import { useUpdateUserPassword } from "@/services/hooks/auth/useUpdateUserPassword";
import { UpdateUserInfoPayload } from "@/services/controllers/types/common/user.type";
import { useSession } from "@/services/hooks/auth/useSession";
import { useContactAdmin } from "@/services/hooks/contact/useContactAdmin";
import { useNiveau } from "@/services/hooks/niveaux/useNiveau";
import { useUpdateNiveau } from "@/services/hooks/niveaux/useUpdateNiveau";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/services/hooks/use-media-query";
import { useTTSPreferences } from "@/stores/useTTSPreferences";
import { Switch } from "@/components/ui/switch";
import { Voices } from "next-tts";

// Schema pour les informations du profil
const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
});

// Schema pour le changement de mot de passe
const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Ancien mot de passe requis"),
  newPassword: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

// Schema pour contacter l'administrateur
const contactSchema = z.object({
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères"),
});

const CARD_COLORS = [
  "bg-[#F5E6D3]", // Beige/Pêche
  "bg-[#D4EBE8]", // Bleu clair
  "bg-[#E5DFF7]", // Violet clair
  "bg-[#FFE8D6]", // Orange clair
];

export default function SettingsGeneralPage() {
  const { user } = useSession();
  const { data: niveaux, isLoading: isLoadingNiveaux } = useNiveau();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { preferences, setEnabled, setVoice, setVoiceSettings } = useTTSPreferences();

  const [selectedNiveau, setSelectedNiveau] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const filteredNiveaux = useMemo(() => {
    if (!niveaux || !user) return [];
    const userNiveauId = user.niveau_id || user.niveau?.id;

    // Find the current niveau index in the array
    const currentIndex = niveaux.findIndex((n) => n.id === userNiveauId);

    if (currentIndex === -1) return [];

    // N+1 is the next niveau in the array (next grade up)
    // For French system: 6ème → 5ème → 4ème → 3ème → 2nde → 1ère → Terminale
    // So index + 1 gives us the next higher grade
    const nextNiveau = niveaux[currentIndex + 1];

    // Only return the next niveau if it exists
    return nextNiveau ? [nextNiveau] : [];
  }, [niveaux, user]);

  // Calculer si l'utilisateur peut changer de niveau
  const canChangeNiveau = useMemo(() => {
    if (!user) return { allowed: false, reason: "" };

    // Vérifier si l'utilisateur a déjà modifié son niveau
    if (
      user.nombre_modification_niveau &&
      user.nombre_modification_niveau > 0
    ) {
      return {
        allowed: false,
        reason: "Tu as déjà modifié ton niveau durant ton abonnement.",
      };
    }

    // Vérifier si l'utilisateur est dans les 48h après inscription
    const createdAt = new Date(user.created_at);
    const now = new Date();
    const hoursSinceCreation =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCreation <= 48) {
      return {
        allowed: true,
        reason: `Tu peux encore modifier ton niveau pendant ${Math.ceil(48 - hoursSinceCreation)} heure(s).`,
      };
    }

    // Sinon, l'utilisateur peut modifier son niveau une seule fois pendant l'abonnement
    return {
      allowed: true,
      reason:
        "Tu peux modifier ton niveau une seule fois durant ton abonnement de 12 mois.",
    };
  }, [user]);

  // Form pour le profil
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.prenom || "",
      lastName: user?.nom || "",
      phone: user?.numero || "",
      email: user?.mail || "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.prenom || "",
        lastName: user.nom || "",
        phone: user.numero || "",
        email: user.mail || "",
      });
      // Ne pas pré-remplir le selectedNiveau avec le niveau actuel
      // pour éviter d'afficher le niveau actuel dans le Select
    }
  }, [user, profileForm]);

  // Form pour le mot de passe
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  // Form pour contacter l'admin
  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      message: "",
    },
  });

  const { mutate: updateUserInfo, isPending: isUpdatingUserInfo } =
    useUpdateUserInfo();
  const { mutate: updateUserPassword, isPending: isUpdatingUserPassword } =
    useUpdateUserPassword();
  const { mutate: contactAdmin, isPending: isContactingAdmin } =
    useContactAdmin();
  const { mutate: updateNiveau, isPending: isUpdatingNiveau } =
    useUpdateNiveau();

  function onSubmitProfile(values: z.infer<typeof profileSchema>) {
    const payload: Partial<UpdateUserInfoPayload> = {
      nom: values.lastName,
      prenom: values.firstName,
      numero: values.phone,
      mail: values.email,
    };
    updateUserInfo(payload, {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Succès",
          message: "Modifications enregistrées!",
        });
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Erreur de mise à jour",
          message: "Échec de la mise à jour du profil.",
        });
        console.error("Update profile error:", error);
      },
    });
  }

  function onSubmitPassword(values: z.infer<typeof passwordSchema>) {
    updateUserPassword(
      {
        old_password: values.oldPassword,
        new_password: values.newPassword,
      },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            title: "Succès",
            message: "Mot de passe changé!",
          });
          passwordForm.reset();
        },
        onError: (error) => {
          toast({
            variant: "error",
            title: "Erreur de changement de mot de passe",
            message: "Échec du changement de mot de passe.",
          });
          console.error("Update password error:", error);
        },
      },
    );
  }

  function onSubmitContact(values: z.infer<typeof contactSchema>) {
    contactAdmin(values.message, {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Succès",
          message: "Message envoyé!",
        });
        contactForm.reset();
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Erreur d'envoi de message",
          message: "Échec de l'envoi du message.",
        });
        console.error("Contact admin error:", error);
      },
    });
  }

  function handleOpenConfirmDialog() {
    const userNiveauId = user?.niveau_id || user?.niveau?.id;
    if (!selectedNiveau || selectedNiveau === userNiveauId?.toString()) {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Veuillez sélectionner un niveau différent.",
      });
      return;
    }
    setShowConfirmDialog(true);
  }

  function onChangeNiveau() {
    updateNiveau(parseInt(selectedNiveau), {
      onSuccess: () => {
        setShowConfirmDialog(false);
      },
    });
  }

  const selectedNiveauLabel = useMemo(() => {
    return niveaux?.find((n) => n.id.toString() === selectedNiveau)?.libelle;
  }, [niveaux, selectedNiveau]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Section 1: Changement de niveau */}
      <div
        className={cn(
          "rounded-2xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md",
          CARD_COLORS[0],
        )}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <GraduationCap className="w-6 h-6 text-gray-900" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Changer de niveau
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Modifie ton année scolaire
            </p>
          </div>
        </div>

        {/* Info box */}
        <div
          className={cn(
            "mb-6 p-4 rounded-2xl border-2",
            canChangeNiveau.allowed
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200",
          )}
        >
          <div className="flex items-start gap-3">
            {canChangeNiveau.allowed ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  canChangeNiveau.allowed ? "text-green-900" : "text-red-900",
                )}
              >
                {canChangeNiveau.reason}
              </p>
              {!canChangeNiveau.allowed && (
                <p className="text-xs text-red-700 mt-1">
                  Tu ne pourras plus modifier ton niveau jusqu'à ton prochain
                  abonnement.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Current niveau */}
        <div className="mb-4 p-4 bg-white/60 rounded-2xl">
          <p className="text-sm text-gray-600 mb-1">Niveau actuel</p>
          <p className="text-lg font-bold text-gray-900">
            {user?.niveau?.libelle || "Non défini"}
          </p>
        </div>

        {/* Select niveau */}
        <div className="space-y-4">
          {filteredNiveaux.length === 0 && canChangeNiveau.allowed ? (
            <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
              <p className="text-sm text-gray-600">
                Tu es déjà au niveau le plus élevé. Aucune mise à jour possible.
              </p>
            </div>
          ) : (
            <Select
              value={selectedNiveau}
              onValueChange={setSelectedNiveau}
              disabled={!canChangeNiveau.allowed || isLoadingNiveaux || filteredNiveaux.length === 0}
            >
              <SelectTrigger className="h-12 bg-white border-2 border-gray-300 rounded-xl">
                <SelectValue placeholder="Sélectionne le niveau suivant" />
              </SelectTrigger>
              <SelectContent>
                {filteredNiveaux.map((niveau) => (
                  <SelectItem key={niveau.id} value={niveau.id.toString()}>
                    {niveau.libelle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            onClick={handleOpenConfirmDialog}
            disabled={
              !canChangeNiveau.allowed ||
              !selectedNiveau ||
              selectedNiveau === (user?.niveau_id || user?.niveau?.id)?.toString()
            }
            className="w-full h-12 bg-[#2C3E50] hover:bg-[#1a252f] text-white font-medium rounded-xl shadow-md transition-all hover:shadow-lg"
          >
            Changer de niveau
          </Button>
        </div>
      </div>

      {/* Section 2: Modifier les informations du profil */}
      <div
        className={cn(
          "rounded-2xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md",
          CARD_COLORS[1],
        )}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <UserIcon className="w-6 h-6 text-gray-900" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Informations du profil
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Modifie tes informations personnelles
            </p>
          </div>
        </div>

        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onSubmitProfile)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prénom */}
              <FormField
                control={profileForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">
                      Prénom
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Prénom"
                        className="h-12 bg-white border-2 border-gray-300 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nom */}
              <FormField
                control={profileForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">
                      Nom
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom"
                        className="h-12 bg-white border-2 border-gray-300 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Téléphone */}
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">
                      Téléphone
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Téléphone"
                        className="h-12 bg-white border-2 border-gray-300 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        type="email"
                        className="h-12 bg-white border-2 border-gray-300 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bouton Enregistrer */}
            <Button
              type="submit"
              className="h-12 w-full sm:w-auto px-8 bg-[#2C3E50] hover:bg-[#1a252f] text-white font-medium rounded-xl shadow-md transition-all hover:shadow-lg"
              disabled={isUpdatingUserInfo}
            >
              {isUpdatingUserInfo
                ? "Enregistrement..."
                : "Enregistrer les modifications"}
            </Button>
          </form>
         </Form>
       </div>

       {/* Section 2.5: Informations du parent */}
       <div
         className={cn(
           "rounded-2xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md",
           CARD_COLORS[2],
         )}
       >
         <div className="flex items-center gap-3 mb-6">
           <div className="p-3 bg-white rounded-2xl shadow-sm">
             <Users className="w-6 h-6 text-gray-900" />
           </div>
           <div>
             <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
               Informations du parent
             </h2>
             <p className="text-sm text-gray-600 mt-1">
               Coordonnées de ton parent référent
             </p>
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Email du parent */}
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-900">
               Email du parent
             </label>
             <div className="h-12 px-3 bg-white/60 border-2 border-gray-300 rounded-xl flex items-center">
               <span className="text-gray-700 truncate">
                 {user?.parent_mail || "Non renseigné"}
               </span>
             </div>
           </div>

           {/* Numéro du parent */}
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-900">
               Numéro du parent
             </label>
             <div className="h-12 px-3 bg-white/60 border-2 border-gray-300 rounded-xl flex items-center">
               <span className="text-gray-700 truncate">
                 {user?.parent_numero || "Non renseigné"}
               </span>
             </div>
           </div>
         </div>

         <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
           <p className="text-xs text-blue-800">
             ℹ️ Ces informations ont été saisies lors de ton inscription et ne peuvent pas être modifiées.
             Contacte l'administrateur si tu dois les mettre à jour.
           </p>
         </div>
       </div>

       {/* Section 3: Changer le mot de passe */}
      <div
        className={cn(
          "rounded-2xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md",
          CARD_COLORS[2],
        )}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <Lock className="w-6 h-6 text-gray-900" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Changer le mot de passe
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Assure-toi que ton compte reste sécurisé
            </p>
          </div>
        </div>

        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
            className="space-y-4"
          >
            {/* Ancien mot de passe */}
            <FormField
              control={passwordForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 font-medium">
                    Ancien mot de passe
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      type="password"
                      placeholder="Ancien mot de passe"
                      className="h-12 bg-white border-2 border-gray-300 rounded-xl"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lien mot de passe oublié */}
            <div>
              <a
                href="/forgot-password"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Mot de passe oublié ?
              </a>
            </div>

            {/* Nouveau mot de passe */}
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 font-medium">
                    Nouveau mot de passe
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      type="password"
                      placeholder="Nouveau mot de passe"
                      className="h-12 bg-white border-2 border-gray-300 rounded-xl"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bouton Changer */}
            <Button
              type="submit"
              className="h-12 w-full sm:w-auto px-8 bg-[#2C3E50] hover:bg-[#1a252f] text-white font-medium rounded-xl shadow-md transition-all hover:shadow-lg"
              disabled={isUpdatingUserPassword}
            >
              {isUpdatingUserPassword
                ? "Changement..."
                : "Changer de mot de passe"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Section 4: Préférences de lecture audio (TTS) */}
      <div
        className={cn(
          "rounded-2xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md",
          CARD_COLORS[0],
        )}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <Volume2 className="w-6 h-6 text-gray-900" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Préférences de lecture audio
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure la synthèse vocale pour tes cours et quiz
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Activer/Désactiver TTS */}
          <div className="flex items-center justify-between p-4 bg-white/60 rounded-2xl">
            <div>
              <p className="font-medium text-gray-900">Activer la lecture audio</p>
              <p className="text-sm text-gray-600 mt-1">
                Permet d'écouter les cours et les questions de quiz
              </p>
            </div>
            <Switch
              checked={preferences.enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {/* Choix de la voix */}
          {preferences.enabled && (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Voix
                </label>
                <Select
                  value={preferences.voice}
                  onValueChange={setVoice}
                >
                  <SelectTrigger className="h-12 bg-white border-2 border-gray-300 rounded-xl">
                    <SelectValue placeholder="Sélectionne une voix" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Voices.French.FR.Female.Denise}>
                      Denise (Femme)
                    </SelectItem>
                    <SelectItem value={Voices.French.FR.Female.Eloise}>
                      Eloise (Femme)
                    </SelectItem>
                    <SelectItem value={Voices.French.FR.Male.Henri}>
                      Henri (Homme)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Vitesse de lecture */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Vitesse de lecture
                </label>
                <Select
                  value={preferences.voiceSettings.rate}
                  onValueChange={(value) => setVoiceSettings({ rate: value })}
                >
                  <SelectTrigger className="h-12 bg-white border-2 border-gray-300 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-20%">Très lent</SelectItem>
                    <SelectItem value="-10%">Lent</SelectItem>
                    <SelectItem value="+0%">Normal</SelectItem>
                    <SelectItem value="+10%">Rapide</SelectItem>
                    <SelectItem value="+20%">Très rapide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Volume */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Volume
                </label>
                <Select
                  value={preferences.voiceSettings.volume}
                  onValueChange={(value) => setVoiceSettings({ volume: value })}
                >
                  <SelectTrigger className="h-12 bg-white border-2 border-gray-300 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-20%">Faible</SelectItem>
                    <SelectItem value="-10%">Moyen</SelectItem>
                    <SelectItem value="+0%">Normal</SelectItem>
                    <SelectItem value="+10%">Fort</SelectItem>
                    <SelectItem value="+20%">Très fort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section 5: Contacter l'administrateur */}
      <div
        className={cn(
          "rounded-2xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md",
          CARD_COLORS[3],
        )}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <MessageSquare className="w-6 h-6 text-gray-900" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Contacter l'administrateur
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Besoin d'aide ? On est là pour toi
            </p>
          </div>
        </div>

        <Form {...contactForm}>
          <form
            onSubmit={contactForm.handleSubmit(onSubmitContact)}
            className="space-y-4"
          >
            {/* Message */}
            <FormField
              control={contactForm.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 font-medium">
                    Ton message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décris ton problème ou ta question..."
                      className="min-h-[150px] bg-white border-2 border-gray-300 rounded-xl resize-none"
                      {...field}
                      maxLength={500}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bouton Envoyer */}
            <Button
              type="submit"
              className="h-12 w-full sm:w-auto px-8 bg-[#2C3E50] hover:bg-[#1a252f] text-white font-medium rounded-xl shadow-md transition-all hover:shadow-lg"
              disabled={isContactingAdmin}
            >
              {isContactingAdmin ? "Envoi..." : "Envoyer"}
            </Button>
          </form>
        </Form>
      </div>

      {/* AlertDialog pour desktop */}
      {isDesktop ? (
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-xl">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                Confirmer le changement de niveau
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Tu es sur le point de changer ton niveau de{" "}
                <span className="font-semibold text-gray-900">
                  {user?.niveau?.libelle}
                </span>{" "}
                vers{" "}
                <span className="font-semibold text-gray-900">
                  {selectedNiveauLabel}
                </span>
                .
                <br />
                <br />
                <span className="text-orange-600 font-medium">
                  ⚠️ Cette action est irréversible durant ton abonnement.
                </span>
                {" "}Tu ne pourras plus modifier ton niveau une fois la
                confirmation effectuée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onChangeNiveau}
                disabled={isUpdatingNiveau}
                className="bg-[#2C3E50] hover:bg-[#1a252f] rounded-xl"
              >
                {isUpdatingNiveau ? "Modification..." : "Confirmer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        /* Drawer pour mobile */
        <Drawer open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DrawerContent className="rounded-t-3xl">
            <DrawerHeader className="text-left">
              <DrawerTitle className="flex items-center gap-2 text-xl">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                Confirmer le changement
              </DrawerTitle>
              <DrawerDescription className="text-base pt-2">
                Tu es sur le point de changer ton niveau de{" "}
                <span className="font-semibold text-gray-900">
                  {user?.niveau?.libelle}
                </span>{" "}
                vers{" "}
                <span className="font-semibold text-gray-900">
                  {selectedNiveauLabel}
                </span>
                .
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl">
                <p className="text-sm text-orange-900 font-medium">
                  ⚠️ Cette action est irréversible durant ton abonnement.
                </p>
                <p className="text-sm text-orange-700 mt-2">
                  Tu ne pourras plus modifier ton niveau une fois la
                  confirmation effectuée.
                </p>
              </div>
            </div>
            <DrawerFooter>
              <Button
                onClick={onChangeNiveau}
                disabled={isUpdatingNiveau}
                className="h-12 bg-[#2C3E50] hover:bg-[#1a252f] text-white font-medium rounded-xl"
              >
                {isUpdatingNiveau ? "Modification..." : "Confirmer"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="h-12 rounded-xl">
                  Annuler
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
