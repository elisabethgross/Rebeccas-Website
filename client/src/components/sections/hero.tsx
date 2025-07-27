import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-blue/10 text-blue text-sm font-medium rounded-full">
                Premium Physical Therapy Experience
              </span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-charcoal">
              A physical therapy experience that will both{" "}
              <span className="text-blue">educate</span> and{" "}
              <span className="text-orange">inspire</span> you to{" "}
              <em className="italic">move like you</em>.
            </h1>
            
            <p className="text-xl mb-8 text-charcoal-light leading-relaxed max-w-xl">
              Personalized one-on-one care that combines evidence-based treatment with movement education to get you back to the activities you love.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-blue text-white hover:bg-blue/90 px-8 py-4 text-lg font-semibold group"
              >
                Schedule Your Assessment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => scrollToSection("about")}
                variant="outline"
                className="border-blue text-blue hover:bg-blue hover:text-white px-8 py-4 text-lg font-semibold group"
              >
                <Play className="mr-2 h-5 w-5" />
                Learn My Approach
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue">500+</div>
                <div className="text-sm text-charcoal-light">Patients Helped</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-blue/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue">15+</div>
                <div className="text-sm text-charcoal-light">Years Experience</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-blue/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue">98%</div>
                <div className="text-sm text-charcoal-light">Success Rate</div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative order-first lg:order-last"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=900"
                  alt="Physical therapist providing personalized one-on-one movement assessment"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue/20 to-transparent"></div>
              </div>
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-blue/10"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-charcoal">Dr. Rebecca Kleiner</div>
                    <div className="text-sm text-charcoal-light">Doctor of Physical Therapy</div>
                  </div>
                </div>
              </motion.div>
              
              {/* Background Pattern */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-blue/10 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}