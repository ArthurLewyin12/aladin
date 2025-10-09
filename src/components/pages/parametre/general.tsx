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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { useUpdateUserInfo } from "@/services/hooks/auth/useUpdateUserInfo";
import { useUpdateUserPassword } from "@/services/hooks/auth/useUpdateUserPassword";
import { UpdateUserInfoPayload } from "@/services/controllers/types/common/user.type";
import { useSession } from "@/services/hooks/auth/useSession";
import { User } from "@/services/controllers/types/auth.types";
import { useContactAdmin } from "@/services/hooks/contact/useContactAdmin";

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

export default function SettingsGeneralPage() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const { user } = useSession();

  console.log("User from useSession:", user);

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

  console.log("Profile form default values:", profileForm.getValues());

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
        toast({ variant: "success", message: "Modifications enregistrées!" });
      },
      onError: (error) => {
        toast({ variant: "error", title: "Erreur de mise à jour", message: "Échec de la mise à jour du profil." });
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
          toast({ variant: "success", message: "Mot de passe changé!" });
          passwordForm.reset();
        },
        onError: (error) => {
          toast({ variant: "error", title: "Erreur de changement de mot de passe", message: "Échec du changement de mot de passe." });
          console.error("Update password error:", error);
        },
      },
    );
  }

  function onSubmitContact(values: z.infer<typeof contactSchema>) {
    contactAdmin(values.message, {
      onSuccess: () => {
        toast({ variant: "success", message: "Message envoyé!" });
        contactForm.reset();
      },
      onError: (error) => {
        toast({ variant: "error", title: "Erreur d'envoi de message", message: "Échec de l'envoi du message." });
        console.error("Contact admin error:", error);
      },
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* Section 1: Modifier les informations du profil */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Modifier les informations du profil
        </h2>

        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onSubmitProfile)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <FormField
                control={profileForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Nom"
                        className="h-12 bg-white border-gray-300 rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prénom */}
              <FormField
                control={profileForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Prénom"
                        className="h-12 bg-white border-gray-300 rounded-lg"
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
                    <FormControl>
                      <Input
                        placeholder="Téléphone"
                        className="h-12 bg-white border-gray-300 rounded-lg"
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
                    <FormControl>
                      <Input
                        placeholder="Email"
                        type="email"
                        className="h-12 bg-white border-gray-300 rounded-lg"
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
              className="h-12 px-8 bg-[#111D4A] hover:bg-[#1a2a5e] text-white font-medium rounded-lg"
              disabled={isUpdatingUserInfo}
            >
              {isUpdatingUserInfo
                ? "Enregistrement..."
                : "Enregistrer les modifications"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Section 2: Changer le mot de passe */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Changer le mot de passe
        </h2>

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
                  <FormControl>
                    <div className="relative">
                      <PasswordInput
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Ancien Mot de passe :"
                        className="h-12 bg-white border-gray-300 rounded-lg pr-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lien mot de passe oublié */}
            <div>
              <a href="#" className="text-blue-600 hover:underline text-sm">
                Mot de pass oublié ?
              </a>
            </div>

            {/* Nouveau mot de passe */}
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      type="password"
                      placeholder="Nouveau  Mot de passe :"
                      className="h-12 bg-white border-gray-300 rounded-lg"
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
              className="h-12 px-8 bg-[#111D4A] hover:bg-[#1a2a5e] text-white font-medium rounded-lg"
              disabled={isUpdatingUserPassword}
            >
              {isUpdatingUserPassword
                ? "Changement..."
                : "Changer de mot de passe"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Section 3: Contacter l'administrateur */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Contacter l'administrateur
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Besoin d'aide ? Expliquez brièvement votre problème et un
          administrateur vous contactera après traitement de votre demande.
        </p>

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
                  <FormControl>
                    <Textarea
                      placeholder="Description de la classe"
                      className="min-h-[150px] bg-gray-100 border-gray-300 rounded-lg resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bouton Envoyer */}
            <Button
              type="submit"
              className="h-12 px-8 bg-[#111D4A] hover:bg-[#1a2a5e] text-white font-medium rounded-lg"
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
