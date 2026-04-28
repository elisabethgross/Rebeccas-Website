import Navigation from "@/components/ui/navigation";
import Footer from "@/components/sections/footer";
import Testimonials from "@/components/sections/testimonials";
import { MOCK_TESTIMONIALS } from "@/lib/mock-testimonials";
import NotFound from "@/pages/not-found";
import { AlertTriangle } from "lucide-react";

const PREVIEW_ENABLED =
  import.meta.env.VITE_ENABLE_TESTIMONIALS_PREVIEW === "true";

export default function PreviewTestimonials() {
  if (!PREVIEW_ENABLED) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-20 pb-2 px-4">
        <div className="max-w-3xl mx-auto bg-coral/10 border border-coral/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-coral mt-0.5 shrink-0" />
          <div className="text-sm text-charcoal">
            <strong>Preview only.</strong> The testimonials below are
            placeholder examples for design review (enabled by the{" "}
            <code className="font-mono text-xs bg-white/60 px-1 rounded">
              VITE_ENABLE_TESTIMONIALS_PREVIEW
            </code>{" "}
            flag). They are <em>not</em> shown on the live site and never touch
            the database. Real patient submissions appear once approved in the
            admin panel.
          </div>
        </div>
      </div>

      <Testimonials testimonials={MOCK_TESTIMONIALS} isPreview />

      <Footer />
    </div>
  );
}
