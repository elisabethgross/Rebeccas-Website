import Navigation from "@/components/ui/navigation";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import DirectPayBenefits from "@/components/sections/direct-pay-benefits";
import Services from "@/components/sections/services";
import Testimonials from "@/components/sections/testimonials";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <DirectPayBenefits />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
