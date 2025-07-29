import { motion } from "framer-motion";
import { GraduationCap, Award, Heart, Clock } from "lucide-react";

export default function About() {
  const highlights = [
    {
      icon: GraduationCap,
      title: "Doctor of Physical Therapy",
      description: "Advanced clinical training with 15+ years of experience"
    },
    {
      icon: Award,
      title: "Manual Therapy Specialist",
      description: "Expert in hands-on treatment techniques"
    },
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Focused on your individual goals and lifestyle"
    },
    {
      icon: Clock,
      title: "No Insurance Hassles",
      description: "Direct-pay model for personalized attention"
    }
  ];

  return (
    <section id="about" className="py-20 bg-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Meet Dr. Rebecca Kleiner
          </h2>
          <p className="text-xl text-charcoal-light max-w-3xl mx-auto leading-relaxed">
            Your dedicated physical therapist committed to helping you move better, feel stronger, and return to the activities you love through personalized, evidence-based care.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
                alt="Dr. Rebecca Kleiner, Physical Therapist"
                className="rounded-2xl shadow-xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-blue/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue">15+</div>
                  <div className="text-sm text-charcoal-light">Years Experience</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-charcoal mb-6">
              My Background & Philosophy
            </h3>
            <p className="text-lg text-charcoal-light mb-6 leading-relaxed">
              With over 15 years of experience treating athletes, professionals, and everyday people, I've seen how transformative the right physical therapy approach can be. My journey began with a simple belief: every person deserves individualized care that addresses not just symptoms, but root causes.
            </p>
            <p className="text-lg text-charcoal-light mb-6 leading-relaxed">
              I earned my Doctor of Physical Therapy degree with a focus on manual therapy and movement science. What sets my practice apart is my commitment to education—I believe in empowering you with the knowledge and tools to maintain your progress long after our sessions end.
            </p>
            <p className="text-lg text-charcoal-light mb-8 leading-relaxed">
              My direct-pay model allows me to spend quality time with each patient, diving deep into movement patterns, lifestyle factors, and personal goals. This isn't just physical therapy—it's a partnership in your long-term health and wellness.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 bg-blue/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <highlight.icon className="w-4 h-4 text-blue" />
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal mb-1">{highlight.title}</div>
                    <div className="text-sm text-charcoal-light">{highlight.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
