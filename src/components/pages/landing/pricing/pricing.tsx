"use client";

import { forwardRef, useState } from "react";
import { PAYMENT_FREQUENCIES, TIERS } from "./tarif.config";
import { PricingCard } from "./pricing-card";
import { PricingHeader } from "./pricing-header";

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
      <PricingHeader
        title="Pricing"
        subtitle="Choisis le forfait qui t'arranges que ce soit mensuel ou Annuel."
        frequencies={PAYMENT_FREQUENCIES}
        selectedFrequency={selectedPaymentFreq}
        onFrequencyChange={setSelectedPaymentFreq}
      />

      {/* Pricing Cards */}
      <div className="grid gap-6 w-full max-w-3xl sm:grid-cols-2 xl:grid-cols-2">
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
