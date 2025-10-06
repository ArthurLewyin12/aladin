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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useRegister } from "@/services/hooks/users/useUser";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z
  .object({
    nom: z.string().min(1, "Nom requis"),
    prenom: z.string().min(1, "Prénom requis"),
    status: z.string().min(1, "Statut requis"),
    level: z.string().min(1, "Niveau requis"),
    phone: z.string().optional(),
    email: z.string().email("Email invalide").min(1, "Email requis"),
    parentEmail: z
      .string()
      .email("Email parent invalide")
      .optional()
      .or(z.literal("")),
    parentPhone: z.string().optional().or(z.literal("")),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export default function AladinStudentInscriptionForm() {
  // const [isDialogOpen, setDialogOpen] = useState(false);
  // const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(
  //   null,
  // );
  const { mutate: register, isPending } = useRegister();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      status: "",
      level: "",
      phone: "",
      email: "",
      parentEmail: "",
      parentPhone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Ouvre le dialogue de confirmation
  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    // setFormData(values);
    // setDialogOpen(true);
    const payload = {
      nom: values.nom,
      prenom: values.prenom,
      statut: values.status as any,
      niveau_id: 2, // Temporarily hardcoded as per user request
      numero: values.phone || "",
      parent_numero: values.parentPhone || "",
      parent_mail: values.parentEmail || "",
      mail: values.email,
      password: values.password,
    };

    register(payload, {
      onSuccess: (response) => {
        toast.success(
          "Inscription presque terminée! Veuillez vérifier votre email pour activer votre compte.",
        );
        sessionStorage.setItem(
          "user_to_activate",
          JSON.stringify(response.user),
        );
        router.push(
          `/register/otp?email=${encodeURIComponent(response.user.mail)}`,
        );
        form.reset();
      },
      onError: (error: any) => {
        console.error("Form submission error", error);
        console.log("Full error object:", error); // Log complet de l'objet error
        const apiResponseData = error?.response?.data;
        const apiErrors = apiResponseData?.errors;
        let errorMessage =
          apiResponseData?.message ||
          "Erreur lors de l'inscription. Veuillez réessayer.";

        if (apiErrors) {
          const fieldErrorMessages: string[] = [];
          for (const field in apiErrors) {
            if (
              apiErrors[field] &&
              Array.isArray(apiErrors[field]) &&
              apiErrors[field].length > 0
            ) {
              fieldErrorMessages.push(...apiErrors[field]);
            }
          }
          if (fieldErrorMessages.length > 0) {
            errorMessage = fieldErrorMessages.join(" et "); // Combine messages, e.g., "Mail déjà utilisé et Numéro déjà utilisé"
          }
        }
        toast.error(errorMessage);
      },
    });
  }

  return (
    <div className="w-full ">
      {/*<div className="mt-8">
        <p className="text-base leading-relaxed">
          Je suis Aladin, ton assistant intelligent. Je t'aide à réviser toute
          ton année scolaire. Inscris-toi maintenant et profite d'un mois
          gratuit ! Ensuite, l'abonnement coûte xxx FCFA par mois.
        </p>
      </div>*/}
      {/* Titre */}
      <div className="mb-8 mt-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Inscription</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          {/* Nom et prénoms */}
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Nom*"
                      className="text-base h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Prénom(s)*"
                      className="text-base h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Statut */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="text-base w-full h-12 bg-gray-50 border-gray-200 rounded-lg">
                      <SelectValue placeholder="Statut*" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="etudiant">Étudiant</SelectItem>
                    <SelectItem value="eleve">Élève</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="enseignant">Enseignant</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Niveau */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="text-base w-full h-12 bg-gray-50 border-gray-200 rounded-lg">
                      <SelectValue placeholder="Choisissez votre niveau*" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="6eme">6ème</SelectItem>
                    <SelectItem value="5eme">5ème</SelectItem>
                    <SelectItem value="4eme">4ème</SelectItem>
                    <SelectItem value="3eme">3ème</SelectItem>
                    <SelectItem value="2nde">2nde</SelectItem>
                    <SelectItem value="1ere">1ère</SelectItem>
                    <SelectItem value="terminale">Terminale</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Téléphone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PhoneInput
                    placeholder="Numéro de téléphone*"
                    className="text-base h-12 bg-gray-50 border-gray-200 rounded-lg"
                    {...field}
                    defaultCountry="CI"
                    countryCallingCodeEditable={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    className="text-base h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email parent (Optionnel) */}
          <FormField
            control={form.control}
            name="parentEmail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email parent"
                    type="email"
                    className="text-base h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Numéro parent (Optionnel) */}
          <FormField
            control={form.control}
            name="parentPhone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PhoneInput
                    placeholder="Numéro parent"
                    className="text-base h-12 bg-gray-50 border-gray-200 rounded-lg"
                    {...field}
                    defaultCountry="CI"
                    countryCallingCodeEditable={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mot de passe */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    placeholder="Mot de passe*"
                    className="text-base h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirmer mot de passe */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirmer mot de passe*"
                    className="text-base h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bouton d'inscription */}
          <Button
            type="submit"
            className="cursor-pointer w-full h-12 bg-[#111D4A] text-white font-medium text-lg rounded-lg mt-6 flex items-center justify-center"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Inscription en cours...
              </>
            ) : (
              "S'inscrire"
            )}
          </Button>
        </form>
      </Form>

      {/* <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-blue-100 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <DialogTitle className="text-2xl">
                Récapitulatif de votre abonnement
              </DialogTitle>
              <DialogDescription className="mt-2">
                Veuillez vérifier les détails de votre forfait avant de
                continuer.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="my-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Forfait</span>
                <span className="font-semibold text-gray-900">
                  Élève - Annuel
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prix</span>
                <span className="font-semibold text-gray-900">9000F / an</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-600">Accès</span>
                <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                  Illimité
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleConfirmInscription}
              className="bg-[#111D4A] hover:bg-[#0d1640]"
            >
              Confirmer et passer au paiement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
