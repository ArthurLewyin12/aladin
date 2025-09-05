"use client";

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
import { PhoneInput } from "@/components/ui/phone-input";

const loginSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  phone: z.string().optional(),
});

export default function AladinLoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      console.log(values);
      toast.success("Connexion en cours...");
    } catch (error) {
      console.error("Login error", error);
      toast.error("Erreur lors de la connexion. Veuillez réessayer.");
    }
  }

  return (
    <div className="w-full">
      {/* Message d'accueil */}
      <div className="mb-6 ">
        <p className="text-gray-600 text-[1.3rem] mb-4">Content de te revoir</p>
        <h1 className=" text-[1.5rem] font-bold text-gray-900">Connexion</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Nom d'utilisateur */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Nom d'utilisateur*"
                    className="h-12 bg-gray-50 border-gray-200 rounded-lg placeholder:text-gray-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Numéro de téléphone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PhoneInput
                    placeholder="Numéro de téléphone*"
                    className=" bg-gray-50 border-gray-200 rounded-lg"
                    defaultCountry="CI"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bouton de connexion */}
          <Button
            type="submit"
            className="cursor-pointer w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg mt-6"
          >
            Se connecter
          </Button>
        </form>
      </Form>

      {/* Liens de navigation */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-4">
          Vous n'avez pas encore de compte ? ou Votre compte n'est pas encore
          activé ?
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            className="cursor-pointer flex-1 h-11 border-black/80 text-black text-[1rem] hover:bg-gray-50 rounded-lg"
          >
            Inscrivez vous
          </Button>

          <Button
            variant="outline"
            className="cursor-pointer flex-1 h-11 border-black/80 text-black text-[1rem] hover:bg-gray-50 rounded-lg"
          >
            Activez votre compte
          </Button>
        </div>
      </div>
    </div>
  );
}
