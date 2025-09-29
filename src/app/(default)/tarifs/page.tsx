"use client";

import { Pricing } from "@/components/pages/landing/pricing/pricing";

export default function TarifsPage() {
  return (
    <section
      className="w-full border-t relative bg-center py-16 md:py-24"
      style={{ backgroundImage: "url('/bg1.png')", backgroundSize: "30%" }}
    >
      {/* Overlay bleu pâle */}
      <div className="absolute inset-0 bg-blue-100/80 z-0"></div>

      {/* Contenu de la section Pricing */}
      <div className="relative z-10">
        <Pricing />
      </div>
    </section>
  );
}
