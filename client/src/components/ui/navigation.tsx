import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToSectionId } from "@/lib/utils";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Close the mobile menu first, then wait for the collapse animation
    // to finish so the scroll target is computed against the final layout.
    const wasMobileMenuOpen = isMobileMenuOpen;
    setIsMobileMenuOpen(false);
    const delay = wasMobileMenuOpen ? 320 : 0;
    window.setTimeout(() => scrollToSectionId(sectionId), delay);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/98 backdrop-blur-sm shadow-sm" : "bg-white/95 backdrop-blur-sm"
      } border-b border-sage/20`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <span className="text-base sm:text-lg md:text-xl font-bold text-sage">
              <span className="hidden sm:inline">Dr. Rebecca Kleiner, PT</span>
              <span className="sm:hidden">Dr. R. Kleiner, PT</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm lg:text-base text-charcoal hover:text-sage transition-colors duration-200"
              data-testid="link-about"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-sm lg:text-base text-charcoal hover:text-sage transition-colors duration-200"
              data-testid="link-services"
            >
              Services
            </button>
            {/* <button
              onClick={() => scrollToSection("testimonials")}
              className="text-charcoal hover:text-sage transition-colors duration-200"
            >
              Testimonials
            </button> */}
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-sage text-white hover:bg-sage-dark rounded-full px-4 py-2 text-sm lg:px-6 lg:text-base"
              data-testid="button-contact-nav"
            >
              Contact
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-charcoal hover:text-sage h-9 w-9"
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-sage/20"
          >
            <div className="px-4 py-3 space-y-3">
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left text-charcoal hover:text-sage transition-colors duration-200 py-2"
                data-testid="link-mobile-about"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="block w-full text-left text-charcoal hover:text-sage transition-colors duration-200 py-2"
                data-testid="link-mobile-services"
              >
                Services
              </button>
              {/* <button
                onClick={() => scrollToSection("testimonials")}
                className="block w-full text-left text-charcoal hover:text-sage transition-colors duration-200"
              >
                Testimonials
              </button> */}
              <Button
                onClick={() => scrollToSection("contact")}
                className="w-full bg-sage text-white hover:bg-sage-dark rounded-full py-2.5"
                data-testid="button-mobile-contact"
              >
                Contact
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
