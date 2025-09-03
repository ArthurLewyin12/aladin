import HeroSection from "@/components/pages/landing/hero";
import MiddleSection from "@/components/pages/landing/middle-section";
import MiddleSection2 from "@/components/pages/landing/middle-section2";
import MiddleSection3 from "@/components/pages/landing/middle-section3";

export default function HomePage() {
  return (
    <main className="min-h-screen mx-auto">
      <HeroSection />
      <MiddleSection />
      <MiddleSection2 />
      <MiddleSection3 />
    </main>
  );
}
