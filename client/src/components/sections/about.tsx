import { motion } from "framer-motion";
import { GraduationCap, Award, Heart, Clock } from "lucide-react";

export default function About() {
  

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
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-blue mb-3 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  My Education
                </h3>
                <p className="text-charcoal-light leading-relaxed">
                  Doctor of Physical Therapy degree with specialized training in manual therapy and movement science. Continuing education in advanced orthopedic techniques and functional movement assessment.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  My Philosophy
                </h3>
                <p className="text-charcoal-light leading-relaxed">
                  Every person deserves individualized care that addresses root causes, not just symptoms. I believe in empowering you with knowledge and tools to maintain progress long after our sessions end.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  My Experience
                </h3>
                <p className="text-charcoal-light leading-relaxed">
                  Over 15 years treating athletes, professionals, and everyday people. I've seen how transformative the right physical therapy approach can be when given proper time and attention.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  My Approach
                </h3>
                <p className="text-charcoal-light leading-relaxed">
                  Direct-pay model allows quality time to dive deep into movement patterns, lifestyle factors, and personal goals. This isn't just physical therapy—it's a partnership in your long-term wellness.
                </p>
              </div>
            </div>
            
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
