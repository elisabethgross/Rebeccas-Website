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
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Dr. Rebecca Kleiner, PT</h3>
            <p className="text-white/80 mb-4 max-w-sm">
              Premium physical therapy focused on getting you back to the
              activities you love through personalized, one-on-one care.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <div className="space-y-2 text-white/80">
              <p>📞 (201) 566-1406‬</p>
              <p>✉️ rebecca@kleinerpt.com</p>
              <p>New York, NY</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>
            &copy; 2024 Dr. Rebecca Kleiner Physical Therapy. All rights
            reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
