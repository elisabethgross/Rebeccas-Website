import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center gradient-sage overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Personalized Physical Therapy That Gets You Back to Life
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Premium one-on-one care focused on helping you return to the activities you love most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-coral text-white hover:bg-coral-dark rounded-full px-8 py-4 text-lg font-semibold"
              >
                Schedule Your Consultation
              </Button>
              <Button
                onClick={() => scrollToSection("about")}
                variant="outline"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 rounded-full px-8 py-4 text-lg font-semibold backdrop-blur-sm"
              >
                Learn About My Approach
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Physical therapist providing personalized one-on-one care to patient"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage">500+</div>
                  <div className="text-sm text-charcoal-light">Lives Transformed</div>
                </div>
                <div className="w-px h-12 bg-sage/20"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage">15+</div>
                  <div className="text-sm text-charcoal-light">Years Experience</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
