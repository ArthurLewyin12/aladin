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
import { PasswordInput } from "@/components/ui/password-input";
import { useLogin } from "@/services/hooks/auth/useLogin";
import { useSession } from "@/services/hooks/auth/useSession";
import { Spinner } from "@/components/ui/spinner";

import { useRouter } from "next/navigation";

import Link from "next/link";

const loginSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

export default function AladinLoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const router = useRouter();
  const { mutate, isPending } = useLogin();
  const { login } = useSession();

  function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate(values, {
      onSuccess: (data) => {
        login(data.user);
        toast.success("Connexion réussie!");
        router.push("/student/home");
      },
      onError: (error) => {
        console.error("Login error", error);
        toast.error("Erreur lors de la connexion. Veuillez réessayer.");
      },
    });
  }

  return (
    <div className="w-full ">
      {/* Message d'accueil */}
      <div className="mb-6 text-center md:text-left">
        <p className="text-gray-600 text-[1.3rem] mb-4">Content de te revoir</p>
        <h1 className=" text-[1.4rem] font-bold text-gray-900">Connexion</h1>
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

          {/* Mot de passe */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    placeholder="Mot de passe*"
                    className="h-12 bg-gray-50 border-gray-200 rounded-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Lien mot de passe oublié */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-700 hover:underline hover:text-black"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Bouton de connexion */}
          <Button
            type="submit"
            className="cursor-pointer w-full h-12 bg-[#111D4A]  text-white font-medium rounded-lg mt-6 flex items-center justify-center"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </Form>

      {/* Liens de navigation */}
      <div className="mt-6 text-center">
        <p className="text-[1rem] text-gray-600 mb-4">
          Vous n'avez pas encore de compte ?
          {/*ou Votre
          <br className="" />
          compte n'est pas encore activé ?*/}
        </p>

        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            className="cursor-pointer flex-1 h-11 border-b-2  md:border border-black text-black text-[1rem] hover:bg-blue-100 hover:border-blue-300  rounded-lg"
            onClick={() => router.push("/register")}
          >
            Inscrivez vous
          </Button>

          {/*<Button
            variant="outline"
            className="cursor-pointer flex-1 h-11 border-y-2 md:border  border-black text-black text-[1rem] hover:bg-blue-100 hover:border-blue-300  rounded-lg"
          >
            Activez votre compte
          </Button>*/}
        </div>
      </div>
    </div>
  );
}
