import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, HandHeart, Activity, Heart, Home, Calendar } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: UserCheck,
      title: "One-on-One Assessment",
      description: "Comprehensive 90-minute initial evaluation focusing on your unique movement patterns, lifestyle, and goals.",
      price: "$250"
    },
    {
      icon: HandHeart,
      title: "Manual Therapy",
      description: "Hands-on techniques including joint mobilization, soft tissue work, and movement re-education.",
      price: "$175/session"
    },
    {
      icon: Activity,
      title: "Movement Coaching",
      description: "Personalized exercise prescription and movement training to optimize your body's performance.",
      price: "$150/session"
    },
    {
      icon: Heart,
      title: "Injury Prevention",
      description: "Proactive strategies to prevent injury recurrence and optimize your long-term physical health.",
      price: "$125/session"
    },
    {
      icon: Home,
      title: "Home Visits",
      description: "Convenient in-home treatment sessions for your comfort and privacy, perfect for busy professionals.",
      price: "$225/session"
    },
    {
      icon: Calendar,
      title: "Wellness Packages",
      description: "Comprehensive monthly packages combining multiple services for optimal results and value.",
      price: "From $600/month"
    }
  ];

  const benefits = [
    {
      icon: "clock",
      title: "More Time With You",
      description: "60-90 minute sessions vs. typical 30-minute insurance visits"
    },
    {
      icon: "star",
      title: "Premium Care",
      description: "Latest techniques and equipment without insurance limitations"
    },
    {
      icon: "zap",
      title: "Faster Results",
      description: "Intensive, personalized care leads to quicker recovery times"
    }
  ];

  return (
    <section id="services" className="py-20 gradient-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Premium Services Tailored to You
          </h2>
          <p className="text-xl text-charcoal-light max-w-3xl mx-auto">
            Each treatment plan is uniquely designed to address your specific needs and goals, ensuring the fastest path back to your active lifestyle.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mb-6">
                    <service.icon className="text-white w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-charcoal mb-4">{service.title}</h3>
                  <p className="text-charcoal-light mb-6 flex-grow">{service.description}</p>
                  <div className="text-sage font-bold text-lg">{service.price}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-white rounded-2xl shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-charcoal mb-4">Why Choose Direct-Pay Care?</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-xl">
                          {benefit.icon === "clock" && "🕐"}
                          {benefit.icon === "star" && "⭐"}
                          {benefit.icon === "zap" && "⚡"}
                        </span>
                      </div>
                      <h4 className="font-semibold text-charcoal mb-2">{benefit.title}</h4>
                      <p className="text-charcoal-light text-sm">{benefit.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
