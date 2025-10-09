"use client";

import { TIERS } from "./tarif.config";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NumberFlow from "@number-flow/react";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

export const PricingCard = ({
  tier,
  paymentFrequency,
}: {
  tier: (typeof TIERS)[0];
  paymentFrequency: string;
}) => {
  const price = tier.price[paymentFrequency];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;

  return (
    <Card
      className={cn(
        "flex relative flex-col p-6 sm:p-8 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105",
        isHighlighted
          ? "bg-gradient-to-b from-blue-300 border-blue-200 shadow-xl via-blue-300/75 to-blue-500/80"
          : "bg-white/80 hover:bg-blue-50/50",
      )}
    >
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-6 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <Sparkles className="w-4 h-4" />
          Plus populaire
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
          {tier.name}
        </h3>
        <div>
          <div className="flex gap-2 items-baseline">
            {typeof price === "number" ? (
              <>
                <NumberFlow
                  format={{
                    style: "currency",
                    currency: "XOF",
                    trailingZeroDisplay: "stripIfInteger",
                  }}
                  value={price}
                  className="text-3xl sm:text-4xl font-bold text-blue-600"
                />
                <span className="text-gray-600">/an</span>
              </>
            ) : (
              <p className="text-3xl sm:text-4xl font-bold text-blue-600">{price}</p>
            )}
          </div>
          <p className="mt-3 text-gray-600">{tier.description}</p>
        </div>
      </div>

      <div className="flex-1">
        <ul className="mt-8 space-y-4">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex gap-3 items-start">
              <Check className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-sm leading-relaxed text-gray-700">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {tier.id === "entreprise" ? (
        <Link href="/donate" className="w-full">
          <Button
            className={cn(
              "py-6 mt-8 w-full text-base font-semibold transition-all duration-300",
              isHighlighted
                ? "text-white bg-blue-600 shadow-lg hover:bg-blue-700 hover:shadow-blue-500/25"
                : "text-gray-900 bg-gray-100 hover:bg-gray-200",
            )}
          >
            {tier.cta}
          </Button>
        </Link>
      ) : (
        <Button
          className={cn(
            "py-6 mt-8 w-full text-base font-semibold transition-all duration-300",
            isHighlighted
              ? "text-white bg-blue-600 shadow-lg hover:bg-blue-700 hover:shadow-blue-500/25"
              : "text-gray-900 bg-gray-100 hover:bg-gray-200",
          )}
        >
          {tier.cta}
        </Button>
      )}
    </Card>
  );
};
