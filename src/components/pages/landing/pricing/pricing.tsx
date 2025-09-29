"use client";

import { forwardRef, useState } from "react";
import { PAYMENT_FREQUENCIES, TIERS } from "./tarif.config";
import { PricingCard } from "./pricing-card";

export const Pricing = forwardRef<HTMLDivElement>((props, ref) => {
  const [selectedPaymentFreq, setSelectedPaymentFreq] = useState(
    PAYMENT_FREQUENCIES[0],
  );

  return (
    <section
      className="flex flex-col gap-10 items-center py-10"
      ref={ref}
      id="pricing1"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_50%)]" />
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-extrabold text-[#2C3E50] mb-6">
          Des Forfaits Adaptés à Chaque Parcours
        </h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Que vous soyez un élève cherchant l'excellence, une famille soucieuse
          de l'éducation de ses enfants, ou une entreprise souhaitant investir
          dans la réussite collective, Aladin a une solution annuelle pensée
          pour vous. Découvrez nos offres complètes et choisissez celle qui vous
          mènera vers le succès.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 w-full max-w-5xl sm:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((tier, i) => (
          <PricingCard
            key={i}
            tier={tier}
            paymentFrequency={selectedPaymentFreq}
          />
        ))}
      </div>
    </section>
  );
});

Pricing.displayName = "Pricing";
