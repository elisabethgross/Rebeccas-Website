import { useState, useEffect } from "react";
import Navigation from "@/components/ui/navigation";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import DirectPayBenefits from "@/components/sections/direct-pay-benefits";
import Services from "@/components/sections/services";
// import Testimonials from "@/components/sections/testimonials";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { scrollToSectionId } from "@/lib/utils";

export default function Home() {
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past hero section (roughly 800px)
      setShowStickyCTA(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => scrollToSectionId('contact');

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <DirectPayBenefits />
      <Services />
      {/* <Testimonials /> */}
      <Contact />
      <Footer />

      {/* Sticky CTA Button - Mobile Only */}
      {showStickyCTA && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-300">
          <Button
            onClick={scrollToContact}
            className="w-full bg-gradient-to-r from-blue to-blue-dark hover:from-blue-dark hover:to-blue text-white py-4 text-base font-bold rounded-xl shadow-2xl"
            data-testid="button-sticky-cta"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Consultation
          </Button>
        </div>
      )}
    </div>
  );
}
