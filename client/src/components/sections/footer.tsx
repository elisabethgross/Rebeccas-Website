import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-charcoal text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Dr. Rebecca Kleiner, PT</h3>
            <p className="text-white/80 mb-4">
              Premium physical therapy focused on getting you back to the activities you love through personalized, one-on-one care.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-white transition-colors"
                >
                  About Dr. Mitchell
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="hover:text-white transition-colors"
                >
                  Services & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="hover:text-white transition-colors"
                >
                  Client Success Stories
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-white transition-colors"
                >
                  Schedule Consultation
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <div className="space-y-2 text-white/80">
              <p>📞 (555) 123-4567</p>
              <p>✉️ sarah@mitchellpt.com</p>
              <p>
                📍 Downtown Medical Center<br />
                123 Health Way, Suite 200<br />
                City, State 12345
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; 2024 Dr. Rebecca Kleiner Physical Therapy. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
