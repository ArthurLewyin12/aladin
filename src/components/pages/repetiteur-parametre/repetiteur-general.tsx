"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { useUpdateUserInfo } from "@/services/hooks/auth/useUpdateUserInfo";
import { useUpdateUserPassword } from "@/services/hooks/auth/useUpdateUserPassword";
import { UpdateUserInfoPayload } from "@/services/controllers/types/common/user.type";
import { useSession } from "@/services/hooks/auth/useSession";
import { useContactAdmin } from "@/services/hooks/contact/useContactAdmin";
import { cn } from "@/lib/utils";
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
  "bg-white border-2 border-[#C8E0B8]", // Blanc avec bordure vert doux
  "bg-white border-2 border-[#C8E0B8]",
  "bg-white border-2 border-[#C8E0B8]",
];

export default function RepetiteurSettingsGeneral() {
  const { user } = useSession();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showContactConfirm, setShowContactConfirm] = useState(false);

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
          message: "Informations mises à jour!",
        });
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Erreur",
          message: "Échec de la mise à jour.",
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
          setShowPasswordConfirm(false);
        },
        onError: (error) => {
          toast({
            variant: "error",
            title: "Erreur",
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
        setShowContactConfirm(false);
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Erreur",
          message: "Échec de l'envoi du message.",
        });
        console.error("Contact admin error:", error);
      },
    });
  }

  return (
    <div className="space-y-5">
      {/* Section 1: Informations du profil */}
      <div
        className={cn(
          "rounded-3xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md backdrop-blur-sm border-2",
          CARD_COLORS[0],
        )}
      >
        <div className="flex items-start gap-3 mb-6">
          <div className="p-3 bg-[#E3F1D9] rounded-xl shadow-sm">
            <UserIcon className="w-5 h-5 text-[#548C2F]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Informations personnelles
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Mets à jour tes données
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Prénom
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Prénom"
                        className="h-11 bg-white border border-gray-200 rounded-xl focus:border-[#C8E0B8] focus:ring-[#E3F1D9]"
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Nom
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom"
                        className="h-11 bg-white border border-gray-200 rounded-xl focus:border-[#C8E0B8] focus:ring-[#E3F1D9]"
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Téléphone
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Téléphone"
                        className="h-11 bg-white border border-gray-200 rounded-xl focus:border-[#C8E0B8] focus:ring-[#E3F1D9]"
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        type="email"
                        className="h-11 bg-white border border-gray-200 rounded-xl focus:border-[#C8E0B8] focus:ring-[#E3F1D9]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="h-11 px-6 bg-[#548C2F] hover:bg-[#3d6620] text-white font-medium rounded-xl shadow-sm transition-all hover:shadow-md"
              disabled={isUpdatingUserInfo}
            >
              {isUpdatingUserInfo ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Section 2: Changer le mot de passe */}
      <div
        className={cn(
          "rounded-3xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md backdrop-blur-sm border-2",
          CARD_COLORS[1],
        )}
      >
        <div className="flex items-start gap-3 mb-6">
          <div className="p-3 bg-[#E3F1D9] rounded-xl shadow-sm">
            <Lock className="w-5 h-5 text-[#548C2F]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Sécurité
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Gère la sécurité de ton compte
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
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Ancien mot de passe
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      type="password"
                      placeholder="Ancien mot de passe"
                      className="h-11 bg-white border border-gray-200 rounded-xl focus:border-[#C8E0B8] focus:ring-[#E3F1D9]"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nouveau mot de passe */}
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Nouveau mot de passe
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      type="password"
                      placeholder="Nouveau mot de passe"
                      className="h-11 bg-white border border-gray-200 rounded-xl focus:border-[#C8E0B8] focus:ring-[#E3F1D9]"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                className="h-11 px-6 bg-[#548C2F] hover:bg-[#3d6620] text-white font-medium rounded-xl shadow-sm transition-all hover:shadow-md"
                disabled={isUpdatingUserPassword}
              >
                {isUpdatingUserPassword ? "Changement..." : "Changer le mot de passe"}
              </Button>
              <a
                href="/forgot-password"
                className="h-11 px-6 flex items-center justify-center text-[#548C2F] hover:text-[#3d6620] text-sm font-medium"
              >
                Mot de passe oublié?
              </a>
            </div>
          </form>
        </Form>
      </div>

      {/* Section 3: Contacter le support */}
      <div
        className={cn(
          "rounded-3xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md backdrop-blur-sm border-2",
          CARD_COLORS[2],
        )}
      >
        <div className="flex items-start gap-3 mb-6">
          <div className="p-3 bg-[#E3F1D9] rounded-xl shadow-sm">
            <MessageSquare className="w-5 h-5 text-[#548C2F]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Support
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Une question? Contacte l'équipe
            </p>
          </div>
        </div>

        <Form {...contactForm}>
          <form
            onSubmit={contactForm.handleSubmit(onSubmitContact)}
            className="space-y-4"
          >
            <FormField
              control={contactForm.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Ton message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décris ton problème ou ta question..."
                      className="min-h-[120px] bg-white border border-gray-200 rounded-xl focus:border-[#C8E0B8] focus:ring-[#E3F1D9] resize-none"
                      {...field}
                      maxLength={500}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="h-11 px-6 bg-[#548C2F] hover:bg-[#3d6620] text-white font-medium rounded-xl shadow-sm transition-all hover:shadow-md"
              disabled={isContactingAdmin}
            >
              {isContactingAdmin ? "Envoi..." : "Envoyer"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
