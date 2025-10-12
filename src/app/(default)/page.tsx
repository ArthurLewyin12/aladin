import HeroSection from "@/components/pages/landing/hero";
import MiddleSection from "@/components/pages/landing/middle-section";
import MiddleSection2 from "@/components/pages/landing/middle-section2";
import MiddleSection3 from "@/components/pages/landing/middle-section3";
import MiddleSection4 from "@/components/pages/landing/middle-section4";
import TestimonialCarousel from "@/components/pages/landing/testimonial-section";
import { LandingPageGuard } from "@/components/guards/landing-page-guard";
const isTrial = true;

export default function HomePage() {
  return (
    <main className="min-h-screen w-full">
      {isTrial ? <LandingPageGuard /> : <Home />}
    </main>
  );
}

const Home = () => {
  return (
    <>
      <HeroSection />
      <MiddleSection />
      <MiddleSection2 />
      <MiddleSection3 />
      <MiddleSection4 />
      <TestimonialCarousel />
    </>
  );
};
