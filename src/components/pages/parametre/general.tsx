"use client";

import { useState } from "react";
import { toast } from "sonner";
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

  // Form pour le profil
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "Konan",
      lastName: "Megan Forrest",
      phone: "+225 0708090099",
      email: "meganforrest@gmail.com",
    },
  });

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

  function onSubmitProfile(values: z.infer<typeof profileSchema>) {
    // TODO: Intégrer l'API ici avec useUpdateProfile hook
    console.log("Profile data:", values);
    toast.success("Modifications enregistrées!");
  }

  function onSubmitPassword(values: z.infer<typeof passwordSchema>) {
    // TODO: Intégrer l'API ici avec useChangePassword hook
    console.log("Password data:", values);
    toast.success("Mot de passe changé!");
    passwordForm.reset();
  }

  function onSubmitContact(values: z.infer<typeof contactSchema>) {
    // TODO: Intégrer l'API ici avec useContactAdmin hook
    console.log("Contact data:", values);
    toast.success("Message envoyé!");
    contactForm.reset();
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
            >
              Enregistrer les modifications
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
                      <Input
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Ancien Mot de passe :"
                        className="h-12 bg-white border-gray-300 rounded-lg pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showOldPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
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
                    <Input
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
            >
              Changer de mot de passe
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
            >
              Envoyer
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
