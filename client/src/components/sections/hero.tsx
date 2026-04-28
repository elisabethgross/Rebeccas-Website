import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // Account for fixed nav bar height
      const verticalCenterOffset = window.innerHeight * 0.2; // Push section lower so it sits closer to middle
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight - verticalCenterOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden">
      <div className="w-full py-16 md:py-20 lg:py-24">
        {/* Hero Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6 md:mb-8"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-blue mb-2">
                  Dr. Rebecca Kleiner
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-semibold text-orange mb-3 md:mb-4">Doctor of Physical Therapy</div>
                <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-blue/10 text-blue text-xs md:text-sm font-medium rounded-full">
                  Premium Physical Therapy Experience
                </span>
              </motion.div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 md:mb-6 text-charcoal">
                A physical therapy experience that will both{" "}
                <span className="text-blue">educate</span> and{" "}
                <span className="text-orange">inspire</span> you to{" "}
                <em className="italic">move like you</em>.
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-charcoal-light leading-relaxed">
                Personalized one-on-one care that combines evidence-based treatment with movement education to get you back to the activities you love.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start" data-testid="hero-cta-buttons">
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="bg-blue text-white hover:bg-blue/90 px-5 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold group w-full sm:w-auto"
                  data-testid="button-schedule-assessment"
                >
                  <span className="hidden sm:inline">Schedule Your Assessment</span>
                  <span className="sm:hidden">Schedule Assessment</span>
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => scrollToSection("about")}
                  variant="outline"
                  className="border-blue text-blue hover:bg-blue hover:text-white px-5 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold group w-full sm:w-auto"
                  data-testid="button-learn-approach"
                >
                  <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Learn My Approach
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative order-first lg:order-last"
            >
              <div className="relative">
                {/* Main Image */}
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=900"
                    alt="Physical therapist providing personalized one-on-one movement assessment"
                    className="w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[500px] xl:h-[580px] object-cover"
                    data-testid="img-hero"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue/20 to-transparent"></div>
                </div>
                
                {/* Background Pattern */}
                <div className="absolute -top-8 -right-8 w-24 h-24 md:w-32 md:h-32 bg-orange/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12 -right-12 md:-bottom-16 md:-right-16 w-32 h-32 md:w-40 md:h-40 bg-blue/10 rounded-full blur-3xl"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Full-Width Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 md:mt-12 lg:mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
            <div className="text-center" data-testid="stat-patients">
              <div className="text-2xl sm:text-3xl font-bold text-blue">500+</div>
              <div className="text-sm sm:text-base md:text-lg text-charcoal-light">Patients Helped</div>
            </div>
            <div className="text-center" data-testid="stat-appointments">
              <div className="text-2xl sm:text-3xl font-bold text-orange">Same-Week</div>
              <div className="text-sm sm:text-base md:text-lg text-charcoal-light">Appointments</div>
            </div>
            <div className="text-center" data-testid="stat-care">
              <div className="text-2xl sm:text-3xl font-bold text-blue">1-on-1</div>
              <div className="text-sm sm:text-base md:text-lg text-charcoal-light">Care</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}