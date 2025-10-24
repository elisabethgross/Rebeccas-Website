import { motion } from "framer-motion";
import { CheckCircle, Clock, Heart, Shield, Home, Star } from "lucide-react";

export default function DirectPayBenefits() {
  const benefits = [
    {
      icon: Clock,
      title: "Unrestricted Time",
      description: "50 minute sessions vs typical 15-30 minute insurance visits. No rushing through your care."
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
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue/5 to-orange/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-4 md:mb-6">
            Why Choose Direct-Pay Physical Therapy?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-charcoal-light max-w-4xl mx-auto leading-relaxed px-2">
            Your treatment should be about <strong className="text-charcoal">what you need</strong>, not what insurance dictates. 
            Experience the difference of truly personalized, unrestricted care.
          </p>
        </motion.div>

        {/* Mobile: Horizontal Scroll, Desktop: Grid */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          {/* Mobile Horizontal Scroll */}
          <div className="sm:hidden flex overflow-x-auto gap-4 pb-4 px-4 -mx-4 snap-x snap-mandatory scrollbar-hide">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-5 shadow-lg flex-shrink-0 w-[280px] snap-center"
              >
                <div className="w-10 h-10 bg-blue/10 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-5 h-5 text-blue" />
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-3">{benefit.title}</h3>
                <p className="text-sm text-charcoal-light leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue/10 rounded-xl flex items-center justify-center mb-4 md:mb-6">
                  <benefit.icon className="w-5 h-5 md:w-6 md:h-6 text-blue" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-charcoal mb-3 md:mb-4">{benefit.title}</h3>
                <p className="text-sm md:text-base text-charcoal-light leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Scroll hint for mobile */}
          <div className="sm:hidden text-center mt-4 text-xs text-charcoal-light">
            ← Swipe to see all benefits →
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-charcoal mb-6 md:mb-8">
            The Direct-Pay Difference
          </h3>
          
          {/* Mobile: Simplified Version */}
          <div className="md:hidden text-left space-y-4">
            <div className="bg-blue/5 rounded-xl p-4">
              <h4 className="text-base font-bold text-blue mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Direct-Pay Benefits
              </h4>
              <ul className="space-y-2 text-sm text-charcoal-light">
                <li className="flex items-start">
                  <span className="text-blue mr-2 flex-shrink-0">✓</span>
                  <span>50 min sessions (vs 15-30 min)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue mr-2 flex-shrink-0">✓</span>
                  <span>Personalized care (vs cookie-cutter)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue mr-2 flex-shrink-0">✓</span>
                  <span>No insurance limitations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Desktop: Full Comparison */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 md:gap-12 text-left">
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-orange mb-3 md:mb-4">Traditional Insurance-Based PT:</h4>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-charcoal-light">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 md:mr-3 flex-shrink-0">×</span>
                  <span>15-30 minute rushed appointments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 md:mr-3 flex-shrink-0">×</span>
                  <span>Cookie-cutter treatment protocols</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 md:mr-3 flex-shrink-0">×</span>
                  <span>Limited by insurance approvals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 md:mr-3 flex-shrink-0">×</span>
                  <span>Difficulty reaching your therapist</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 md:mr-3 flex-shrink-0">×</span>
                  <span>Treatment ends when coverage stops</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-blue mb-3 md:mb-4">My Direct-Pay Practice:</h4>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-charcoal-light">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                  <span>50 minute comprehensive sessions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                  <span>Highly personalized treatment plans</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                  <span>Care based on YOUR needs only</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                  <span>Direct access and exceptional service</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                  <span>Treatment continues until YOU reach your goals</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}