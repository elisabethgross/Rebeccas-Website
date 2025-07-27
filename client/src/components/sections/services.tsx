import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, HandHeart, Activity, ArrowRight, Star, Clock, CheckCircle } from "lucide-react";

export default function Services() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const coreServices = [
    {
      icon: UserCheck,
      title: "Comprehensive Assessment",
      description: "90-minute initial evaluation to understand your unique movement patterns, pain points, and goals. We'll create a personalized treatment plan just for you.",
      price: "$250",
      duration: "90 minutes",
      popular: false
    },
    {
      icon: HandHeart,
      title: "One-on-One Treatment",
      description: "Hands-on manual therapy, movement re-education, and personalized exercise prescription. Full hour of dedicated attention.",
      price: "$175",
      duration: "60 minutes",
      popular: true
    },
    {
      icon: Activity,
      title: "Movement Coaching",
      description: "Learn proper movement patterns and preventive strategies to maintain your progress and prevent future injuries.",
      price: "$150",
      duration: "45 minutes",
      popular: false
    }
  ];

  const whatYouGet = [
    "Highly personalized care tailored to YOUR unique needs",
    "Treatment plans designed specifically for your goals",
    "Unrestricted length of care - no insurance-dictated session limits",
    "Convenient care in your home or gym",
    "Exceptional customer service and direct therapist access",
    "Patient-centered approach focused on what YOU need"
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            What I Offer
          </h2>
          <p className="text-xl text-charcoal-light max-w-3xl mx-auto leading-relaxed">
            Premium physical therapy services designed to get you back to your best self. No insurance limitations, no rushed appointments—just personalized care that works.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {coreServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`relative h-full hover:shadow-xl transition-all duration-300 ${
                service.popular ? 'border-orange border-2' : 'border-gray-200'
              }`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-blue/10 rounded-xl flex items-center justify-center mb-6">
                    <service.icon className="w-6 h-6 text-blue" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-charcoal mb-4">{service.title}</h3>
                  <p className="text-charcoal-light mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-2xl font-bold text-blue">{service.price}</div>
                      <div className="text-sm text-charcoal-light flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => scrollToSection("contact")}
                    className={`w-full ${
                      service.popular 
                        ? 'bg-orange hover:bg-orange-dark text-white' 
                        : 'bg-blue hover:bg-blue-dark text-white'
                    }`}
                  >
                    Book This Service
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-blue/5 rounded-3xl p-8 md:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-charcoal mb-6">
                Why Choose Direct-Pay Physical Therapy?
              </h3>
              <p className="text-lg text-charcoal-light mb-6 leading-relaxed">
                Your treatment should be about <strong className="text-charcoal">what you need</strong>, not what insurance dictates. I provide highly personalized care with treatment plans tailored specifically to your goals, lifestyle, and body.
              </p>
              <p className="text-lg text-charcoal-light mb-8 leading-relaxed">
                No cookie-cutter protocols. No rushing through appointments. Just patient-centered care with exceptional customer service—whether in my clinic, your home, or your gym.
              </p>
              
              <Button 
                onClick={() => scrollToSection("contact")}
                className="bg-blue hover:bg-blue-dark text-white px-8 py-4 text-lg"
              >
                Schedule Your Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-charcoal mb-6">What You Get:</h4>
              <div className="grid gap-4">
                {whatYouGet.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-blue flex-shrink-0" />
                    <span className="text-charcoal-light">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}