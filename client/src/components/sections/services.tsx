import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Dumbbell, Activity, ArrowRight, Clock, Video, Monitor } from "lucide-react";
import { scrollToSectionId } from "@/lib/utils";

export default function Services() {
  const scrollToSection = (sectionId: string) => scrollToSectionId(sectionId);

  const coreServices = [
    {
      icon: Stethoscope,
      title: "Physical Therapy",
      description: "One-on-one care focused on restoring function, reducing pain, and optimizing movement. Includes pre- and post-surgical rehabilitation, return-to-sport training, gait training, transfer training, and improving mobility and independence. Collaboration with your healthcare team and family members as needed.",
      price: "$250",
      duration: "per session",
      length: "60 minutes",
      borderColor: "border-blue",
      iconBg: "bg-blue",
      priceColor: "text-blue",
      buttonClass: "bg-blue hover:bg-blue-dark"
    },
    {
      icon: Dumbbell,
      title: "Personal Training",
      description: "Targeted strength and movement programming focused on injury prevention, performance, and long-term physical resilience. Strength and flexibility training tailored to your goals.",
      price: "$250",
      duration: "per session",
      length: "60 minutes",
      borderColor: "border-orange",
      iconBg: "bg-orange",
      priceColor: "text-orange",
      buttonClass: "bg-orange hover:bg-orange-dark"
    },
    {
      icon: Activity,
      title: "Wellness & Movement Coaching",
      description: "Ongoing guidance for mobility, posture, strength, and sustainable movement habits.",
      price: "$250",
      duration: "per session",
      length: "60 minutes",
      borderColor: "border-blue",
      iconBg: "bg-blue",
      priceColor: "text-blue",
      buttonClass: "bg-blue hover:bg-blue-dark"
    },
    {
      icon: Monitor,
      title: "Ergonomic Workstation Assessment",
      description: "In-person or virtual evaluations to optimize your workspace, reduce strain, and prevent potential injury.",
      price: "$250",
      duration: "per session",
      length: "60 minutes",
      borderColor: "border-orange",
      iconBg: "bg-orange",
      priceColor: "text-orange",
      buttonClass: "bg-orange hover:bg-orange-dark"
    }
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
          <p className="text-base sm:text-lg md:text-xl text-charcoal-light max-w-3xl mx-auto leading-relaxed px-2 mb-4">
            I provide a comprehensive, one-on-one model of care designed to support you through every stage of movement health, from recovery to long-term strength and resilience. Care is available in-person and virtually.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-charcoal-light max-w-3xl mx-auto leading-relaxed px-2">
            Many clients begin with Physical Therapy and continue into Personal Training or Wellness Coaching for ongoing maintenance, strength, and performance.
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
                    
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className={`text-2xl font-bold ${service.priceColor}`}>{service.price}</span>
                      <span className="text-xs text-charcoal-light">{service.duration}</span>
                    </div>

                    <div className="text-xs text-charcoal-light flex items-center mb-4">
                      <Clock className="w-4 h-4 mr-2" />
                      {service.length}
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
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
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
                    
                    <div className="flex items-baseline gap-2 mb-2 md:mb-3">
                      <span className={`text-3xl md:text-4xl font-bold ${service.priceColor}`}>{service.price}</span>
                      <span className="text-sm text-charcoal-light">{service.duration}</span>
                    </div>

                    <div className="text-xs md:text-sm text-charcoal-light flex items-center mb-4 md:mb-6">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      {service.length}
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
                    Medical Imaging Review <span className="text-base sm:text-lg md:text-xl font-medium text-charcoal-light">(Virtual)</span>
                  </h3>
                  <p className="text-sm sm:text-base text-charcoal-light leading-relaxed mb-3">
                    Remote sessions to review and interpret medical imaging or reports, and discuss findings and next steps.
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
                    className="bg-sage hover:bg-sage-dark text-white shadow-lg w-full md:w-auto"
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
            className="bg-orange hover:bg-orange-dark text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 lg:py-6 text-base sm:text-lg md:text-xl lg:text-2xl font-bold rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
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
