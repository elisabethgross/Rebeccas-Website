import { Facebook, Instagram, Linkedin } from "lucide-react";
import { scrollToSectionId } from "@/lib/utils";

export default function Footer() {
  const scrollToSection = (sectionId: string) => scrollToSectionId(sectionId);

  return (
    <footer className="bg-charcoal text-white py-8 sm:py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-3 md:mb-4">Dr. Rebecca Kleiner, PT</h3>
            <p className="text-sm sm:text-base text-white/80 mb-3 md:mb-4 max-w-sm">
              Premium physical therapy focused on getting you back to the
              activities you love through personalized, one-on-one care.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="text-lg sm:text-xl font-bold mb-3 md:mb-4">Contact Info</h3>
            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base text-white/80">
              <p>📞 646-600-8599</p>
              <p className="break-all">✉️ kleinerDPT@gmail.com</p>
              <p>New York, NY</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs sm:text-sm text-white/60">
          <p className="px-2">
            &copy; 2024 Dr. Rebecca Kleiner Physical Therapy. All rights
            reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
