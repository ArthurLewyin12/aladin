import HeroSection from "@/components/pages/landing/hero";
import MiddleSection from "@/components/pages/landing/middle-section";

export default function HomePage() {
  return (
    <main className="min-h-screen mx-auto">
      <HeroSection />
      <MiddleSection />
    </main>
  );
}
