import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/98 backdrop-blur-sm shadow-sm" : "bg-white/95 backdrop-blur-sm"
      } border-b border-sage/20`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-sage">Dr. Rebecca Kleiner, PT</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("about")}
              className="text-charcoal hover:text-sage transition-colors duration-200"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-charcoal hover:text-sage transition-colors duration-200"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-charcoal hover:text-sage transition-colors duration-200"
            >
              Testimonials
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-sage text-white hover:bg-sage-dark rounded-full px-6 py-2"
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
              className="text-charcoal hover:text-sage"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            <div className="px-4 py-4 space-y-4">
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left text-charcoal hover:text-sage transition-colors duration-200"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="block w-full text-left text-charcoal hover:text-sage transition-colors duration-200"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="block w-full text-left text-charcoal hover:text-sage transition-colors duration-200"
              >
                Testimonials
              </button>
              <Button
                onClick={() => scrollToSection("contact")}
                className="w-full bg-sage text-white hover:bg-sage-dark rounded-full"
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
