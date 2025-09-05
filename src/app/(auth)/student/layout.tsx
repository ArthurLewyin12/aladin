import Image from "next/image";

export default function StudentAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen">
      {/* Section gauche - Illustration */}
      <div className="flex-1 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <Image
            src="/login-img.png"
            alt="Illustration Aladin"
            width={400}
            height={300}
            className="mx-auto"
          />

          {/* Texte descriptif */}
          <div className="mt-8">
            <p className="text-gray-600 text-sm leading-relaxed">
              Je suis Aladin, ton assistant intelligent. Je t'aide à réviser
              toute ton année scolaire. Inscris-toi maintenant et profite d'un
              mois gratuit ! Ensuite, l'abonnement coûte xxx FCFA par mois.
            </p>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-white rounded-full"
                    ></div>
                  ))}
                </div>
              </div>
              <span className="text-xl font-bold text-blue-900">aladin</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              OUTIL DE RÉVISION SCOLAIRE
            </p>
          </div>

          {/* Contenu du formulaire (children) */}
          {children}
        </div>
      </div>
    </div>
  );
}
