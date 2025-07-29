import { motion } from "framer-motion";
import { CheckCircle, Clock, Heart, Shield, Home, Star } from "lucide-react";

export default function DirectPayBenefits() {
  const benefits = [
    {
      icon: Clock,
      title: "Unrestricted Time",
      description: "60-90 minute sessions vs typical 15-30 minute insurance visits. No rushing through your care."
    },
    {
      icon: Heart,
      title: "Highly Personalized Care",
      description: "Treatment plans tailored specifically to YOUR unique needs, goals, and lifestyle—not insurance protocols."
    },
    {
      icon: Shield,
      title: "No Insurance Limitations",
      description: "Care dictated by what you need, not what insurance companies approve. Complete treatment freedom."
    },
    {
      icon: Home,
      title: "Convenient Locations",
      description: "Choose between my clinic, your home, or your gym. Therapy that fits your life and schedule."
    },
    {
      icon: Star,
      title: "Exceptional Service",
      description: "Direct access to your therapist with premium customer service and immediate response to questions."
    },
    {
      icon: CheckCircle,
      title: "Patient-Centered Focus",
      description: "Every decision is about YOUR progress and goals. You're a person, not a claim number."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue/5 to-orange/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Why Choose Direct-Pay Physical Therapy?
          </h2>
          <p className="text-xl text-charcoal-light max-w-4xl mx-auto leading-relaxed">
            Your treatment should be about <strong className="text-charcoal">what you need</strong>, not what insurance dictates. 
            Experience the difference of truly personalized, unrestricted care.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue/10 rounded-xl flex items-center justify-center mb-6">
                <benefit.icon className="w-6 h-6 text-blue" />
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-4">{benefit.title}</h3>
              <p className="text-charcoal-light leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-white rounded-3xl p-8 md:p-12 shadow-xl"
        >
          <h3 className="text-3xl font-bold text-charcoal mb-6">
            The Direct-Pay Difference
          </h3>
          <div className="grid md:grid-cols-2 gap-12 text-left">
            <div>
              <h4 className="text-xl font-bold text-orange mb-4">Traditional Insurance-Based PT:</h4>
              <ul className="space-y-3 text-charcoal-light">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">×</span>
                  15-30 minute rushed appointments
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">×</span>
                  Cookie-cutter treatment protocols
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">×</span>
                  Limited by insurance approvals
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">×</span>
                  Difficulty reaching your therapist
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">×</span>
                  Treatment ends when coverage stops
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-blue mb-4">My Direct-Pay Practice:</h4>
              <ul className="space-y-3 text-charcoal-light">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue mr-3 mt-0.5 flex-shrink-0" />
                  60-90 minute comprehensive sessions
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue mr-3 mt-0.5 flex-shrink-0" />
                  Highly personalized treatment plans
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue mr-3 mt-0.5 flex-shrink-0" />
                  Care based on YOUR needs only
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue mr-3 mt-0.5 flex-shrink-0" />
                  Direct access and exceptional service
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue mr-3 mt-0.5 flex-shrink-0" />
                  Treatment continues until YOU reach your goals
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}