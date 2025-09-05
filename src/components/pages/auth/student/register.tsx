"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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

const formSchema = z
  .object({
    name_6739798132: z.string().min(1, "Nom et prénoms requis"),
    name_2425221157: z.string().min(1, "Statut requis"),
    name_7182574515: z.string().min(1, "Niveau requis"),
    name_7457105706: z.string().optional(),
    name_4704680311: z.string().email("Email invalide").min(1, "Email requis"),
    name_3715865492: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    name_1443242358: z.string(),
  })
  .refine((data) => data.name_3715865492 === data.name_1443242358, {
    message: "Les mots de passe ne correspondent pas",
    path: ["name_1443242358"],
  });

export default function AladinStudentInscriptionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast.success("Inscription réussie !");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  }

  return (
    <div className="w-full">
      {/* Titre */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inscription</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Nom et prénoms */}
          <FormField
            control={form.control}
            name="name_6739798132"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Nom & Prénoms*"
                    className="h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Statut */}
          <FormField
            control={form.control}
            name="name_2425221157"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg">
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
            name="name_7182574515"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg">
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
            name="name_7457105706"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PhoneInput
                    placeholder="Numéro de téléphone*"
                    className="h-12 bg-gray-50 border-gray-200 rounded-lg"
                    {...field}
                    defaultCountry="CI"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="name_4704680311"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    className="h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mot de passe */}
          <FormField
            control={form.control}
            name="name_3715865492"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    placeholder="Mot de passe*"
                    className="h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
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
            name="name_1443242358"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirmer mot de passe*"
                    className="h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
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
            className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg mt-6"
          >
            S'inscrire
          </Button>
        </form>
      </Form>
    </div>
  );
}
