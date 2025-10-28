"use client";

import { CreditCard, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RepetiteurSettingsSubscription() {
  return (
    <div className="space-y-5">
      {/* Section: Abonnement annuel */}
      <div
        className={cn(
          "rounded-3xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md backdrop-blur-sm border-2",
          "bg-white border-[#C8E0B8]",
        )}
      >
        <div className="flex items-start gap-3 mb-6">
          <div className="p-3 bg-[#E3F1D9] rounded-xl shadow-sm">
            <CreditCard className="w-5 h-5 text-[#548C2F]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Abonnement annuel
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Gère ton abonnement et tes paiements
            </p>
          </div>
        </div>

        {/* Placeholder content */}
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-[#F0F7EC] to-transparent rounded-xl border border-[#C8E0B8]">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#548C2F] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Contenu en cours de préparation
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Cette section sera disponible très bientôt. Tu pourras gérer ton abonnement annuel ici.
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
