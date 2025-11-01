"use client";

import Image from "next/image";
import ParametreTabs from "@/components/pages/parametre/parametre-tabs";

export default function SettingsStudentPage() {
  return (
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Desktop Layout: Image + Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Image côté gauche - Caché sur mobile - Sticky */}
          <div className="hidden lg:flex justify-center lg:justify-start sticky top-32">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent rounded-3xl blur-xl opacity-50"></div>
              <Image
                src="/student-illustration-img.png"
                alt="Paramètres étudiant"
                width={450}
                height={400}
                className="relative z-10 max-w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Tabs côté droit */}
          <div className="flex flex-col justify-start">
            <ParametreTabs />
          </div>
        </div>
      </div>
    </div>
  );
}
