import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, HandHeart, Activity, ArrowRight, Star, Clock, CheckCircle, Video } from "lucide-react";

export default function Services() {
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

  const coreServices = [
    {
      icon: UserCheck,
      title: "Comprehensive Assessment",
      description: "Initial evaluation to understand your unique movement patterns, pain points, and goals. We'll create a personalized treatment plan just for you.",
      duration: "60 minutes",
      color: "blue",
      borderColor: "border-blue",
      iconBg: "bg-blue",
      buttonClass: "bg-blue hover:bg-blue-dark"
    },
    {
      icon: HandHeart,
      title: "Wellness Session",
      description: "Hands-on manual therapy, movement re-education, and personalized exercise prescription. Dedicated one-on-one attention focused on your goals.",
      duration: "60 minutes",
      color: "orange",
      borderColor: "border-orange",
      iconBg: "bg-orange",
      buttonClass: "bg-orange hover:bg-orange-dark"
    },
    {
      icon: Activity,
      title: "Movement Coaching",
      description: "Learn proper movement patterns and preventive strategies to maintain your progress and prevent future injuries.",
      duration: "60 minutes",
      color: "blue-light",
      borderColor: "border-blue-light",
      iconBg: "bg-blue-light",
      buttonClass: "bg-blue-light hover:bg-blue"
    }
  ];

  const whatYouGet = [
    "Highly personalized care tailored to YOUR unique needs",
    "Treatment plans designed specifically for your goals",
    "Unrestricted time - no insurance-dictated session limits",
    "Convenient care in your home, gym, or my clinic",
    "Exceptional customer service and direct therapist access",
    "Patient-centered approach focused on what YOU need"
  ];

  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-4 md:mb-6">
            What I Offer
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-charcoal-light max-w-3xl mx-auto leading-relaxed px-2">
            Premium physical therapy services designed to get you back to your best self. No insurance limitations, no rushed appointments—just personalized care that works.
          </p>
        </motion.div>

        {/* Mobile: Horizontal Scroll, Desktop: Grid */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          {/* Mobile Horizontal Scroll */}
          <div className="sm:hidden flex overflow-x-auto gap-4 pb-4 px-4 -mx-4 snap-x snap-mandatory scrollbar-hide">
            {coreServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-[300px] snap-center"
              >
                <Card className={`relative h-full border-2 ${service.borderColor} shadow-xl`} data-testid={`card-service-${index}`}>
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className={`w-14 h-14 ${service.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-charcoal mb-3">{service.title}</h3>
                    <p className="text-sm text-charcoal-light mb-4 leading-relaxed flex-grow">{service.description}</p>
                    
                    <div className="text-xs text-charcoal-light flex items-center mb-4">
                      <Clock className="w-4 h-4 mr-2" />
                      {service.duration}
                    </div>
                    
                    <Button 
                      onClick={() => scrollToSection("contact")}
                      className={`w-full text-sm ${service.buttonClass} text-white shadow-lg`}
                      data-testid={`button-book-service-${index}`}
                    >
                      Book This Service
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {coreServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`relative h-full hover:shadow-2xl transition-all duration-300 border-2 ${service.borderColor} hover:scale-105`} data-testid={`card-service-${index}`}>
                  <CardContent className="p-5 sm:p-6 md:p-8 flex flex-col h-full">
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${service.iconBg} rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg`}>
                      <service.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-charcoal mb-3 md:mb-4">{service.title}</h3>
                    <p className="text-sm md:text-base text-charcoal-light mb-4 md:mb-6 leading-relaxed flex-grow">{service.description}</p>
                    
                    <div className="text-xs md:text-sm text-charcoal-light flex items-center mb-4 md:mb-6">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      {service.duration}
                    </div>
                    
                    <Button 
                      onClick={() => scrollToSection("contact")}
                      className={`w-full text-sm md:text-base ${service.buttonClass} text-white shadow-lg`}
                      data-testid={`button-book-service-${index}`}
                    >
                      Book This Service
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Scroll hint for mobile */}
          <div className="sm:hidden text-center mt-4 text-xs text-charcoal-light">
            ← Swipe to explore services →
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-blue/10 to-sage/10 rounded-xl md:rounded-2xl p-6 md:p-8 mb-10 sm:mb-12 md:mb-16 border-2 border-blue/20"
        >
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue mb-2">$250</div>
          <div className="text-base sm:text-lg md:text-xl text-charcoal-light font-medium">All Sessions / 60 Minutes</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-12 md:mb-16"
        >
          <Card className="border-2 border-sage shadow-xl overflow-hidden" data-testid="card-imaging-review">
            <CardContent className="p-6 sm:p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-sage rounded-2xl flex items-center justify-center shadow-lg mx-auto md:mx-0">
                    <Video className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>

                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-charcoal mb-2 md:mb-3">
                    Medical Imaging Review
                  </h3>
                  <p className="text-sm sm:text-base text-charcoal-light leading-relaxed mb-3">
                    A virtual video or phone call to discuss and review your medical imaging so you can better understand your results and what your next steps should be.
                  </p>
                  <div className="text-xs sm:text-sm text-charcoal-light flex items-center justify-center md:justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    15 minutes
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-center md:items-end gap-3">
                  <div className="text-3xl md:text-4xl font-bold text-sage">$75</div>
                  <Button
                    onClick={() => scrollToSection("contact")}
                    className="bg-sage hover:bg-sage/90 text-white shadow-lg w-full md:w-auto"
                    data-testid="button-book-imaging-review"
                  >
                    Book This Service
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-blue/10 to-orange/10 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 border-2 border-blue/20 shadow-2xl"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-charcoal mb-4 md:mb-6 lg:mb-8">
            Ready to Get Started?
          </h3>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-charcoal-light mb-6 md:mb-8 lg:mb-12 max-w-4xl mx-auto leading-relaxed font-medium px-2">
            Take the first step toward personalized care that puts <strong className="text-blue">your goals first</strong>. Schedule your comprehensive assessment and experience the difference of truly individualized physical therapy.
          </p>
          
          <Button 
            onClick={() => scrollToSection("contact")}
            className="bg-gradient-to-r from-blue to-blue-dark hover:from-blue-dark hover:to-blue text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 lg:py-6 text-base sm:text-lg md:text-xl lg:text-2xl font-bold rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            data-testid="button-schedule-cta"
          >
            <span className="hidden sm:inline">Schedule Your Assessment Now</span>
            <span className="sm:hidden">Schedule Now</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-2 md:ml-3" />
          </Button>
          
          <div className="mt-6 md:mt-8 text-sm sm:text-base md:text-lg text-charcoal-light">
            <span className="bg-orange/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full inline-block">
              ⏰ Usually responds within 24 hours
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}