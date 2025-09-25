"use client";
import { ShieldCheck } from "lucide-react";
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
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(
    null,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_6739798132: "",
      name_2425221157: "",
      name_7182574515: "",
      name_7457105706: "",
      name_4704680311: "",
      name_3715865492: "",
      name_1443242358: "",
    },
  });

  // Ouvre le dialogue de confirmation
  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    setFormData(values);
    setDialogOpen(true);
  }

  // Logique d'inscription finale
  function handleConfirmInscription() {
    if (!formData) return;

    try {
      console.log("Inscription confirmée avec les données:", formData);
      toast.success("Inscription réussie !");
      setDialogOpen(false);
      form.reset();
      // Ici, vous mettriez la logique pour envoyer les données au backend
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  }

  return (
    <div className="w-full ">
      <div className="mt-8">
        <p className="text-base leading-relaxed">
          Je suis Aladin, ton assistant intelligent. Je t'aide à réviser toute
          ton année scolaire. Inscris-toi maintenant et profite d'un mois
          gratuit ! Ensuite, l'abonnement coûte xxx FCFA par mois.
        </p>
      </div>
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
          <FormField
            control={form.control}
            name="name_6739798132"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Nom & Prénoms*"
                    className="text-base h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
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
            name="name_7182574515"
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
            name="name_7457105706"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PhoneInput
                    placeholder="Numéro de téléphone*"
                    className="text-base h-12 bg-gray-50 border-gray-200 rounded-lg"
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
                    className="text-base h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
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
            name="name_1443242358"
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
            className="cursor-pointer w-full h-12 bg-[#111D4A] text-white font-medium text-lg rounded-lg mt-6"
          >
            S'inscrire
          </Button>
        </form>
      </Form>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
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
      </Dialog>
    </div>
  );
}
