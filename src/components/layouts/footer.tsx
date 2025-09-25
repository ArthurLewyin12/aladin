import Image from "next/image";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer
      className="w-full border-t relative bg-center pb-8 "
      style={{ backgroundImage: "url('/bg1.png')", backgroundSize: "30%" }}
    >
      {/* Overlay bleu pâle */}
      <div className="absolute inset-0 bg-blue-100/80 z-0"></div>

      {/* Section principale */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center px-4 md:px-24 py-8 md:py-12">
        {/* Logo à gauche */}
        <div className="mb-6 md:mb-0">
          <Image
            height={60}
            width={60}
            src="/logo.png"
            alt="Logo Aladin"
            className="md:h-[80px] md:w-[80px]"
          />
        </div>

        {/* Bouton S'inscrire à droite */}
        <div>
          <Button className="px-8 md:px-12 py-3 md:py-4 bg-[#111D4A] hover:bg-[#0d1640] rounded-md text-white font-medium text-sm md:text-base transition-colors">
            S'inscrire
          </Button>
        </div>
      </div>

      {/* Section navigation et réseaux sociaux */}
      <div className="relative z-10 border-t border-gray-300/30 ">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-24 py-6">
          {/* Navigation et copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-4 md:mb-0">
            <span className="text-gray-600 text-sm md:text-base">© 2025</span>
            <nav className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8">
              <a
                href="#"
                className="text-gray-700 hover:text-[#111D4A] transition-colors text-sm md:text-base"
              >
                Élèves
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-[#111D4A] transition-colors text-sm md:text-base"
              >
                Parents
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-[#111D4A] transition-colors text-sm md:text-base"
              >
                Répétiteurs
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-[#111D4A] transition-colors text-sm md:text-base"
              >
                Professeurs
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-[#111D4A] transition-colors text-sm md:text-base"
              >
                TARIFS
              </a>
            </nav>
          </div>

          {/* Réseaux sociaux */}
          <div className="flex gap-4">
            <a
              href="#"
              className="w-8 h-8 md:w-10 md:h-10 bg-[#111D4A] hover:bg-[#0d1640] rounded-lg flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 md:w-10 md:h-10 bg-[#111D4A] hover:bg-[#0d1640] rounded-lg flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
