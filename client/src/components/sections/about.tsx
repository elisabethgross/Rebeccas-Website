import { motion } from "framer-motion";
import { GraduationCap, Award, Heart, Clock } from "lucide-react";
import rebeccaImage from "@assets/rebecca_1759421337072.jpeg";

export default function About() {
  

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-4 md:mb-6">
            Meet Dr. Rebecca Kleiner
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-charcoal-light max-w-3xl mx-auto leading-relaxed px-2">
            Your dedicated physical therapist committed to helping you move better, feel stronger, and return to the activities you love through personalized, evidence-based care.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-10 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img
                src={rebeccaImage}
                alt="Dr. Rebecca Kleiner, Physical Therapist"
                className="rounded-2xl shadow-xl w-full h-auto aspect-square object-cover object-center max-w-md mx-auto lg:max-w-none"
                data-testid="img-about-rebecca"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-orange mb-2 md:mb-3 flex items-center">
                  <GraduationCap className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                  My Education
                </h3>
                <p className="text-sm sm:text-base text-charcoal-light leading-relaxed">
                  Doctor of Physical Therapy degree with specialized training in manual therapy and movement science. Continuing education in advanced orthopedic techniques and functional movement assessment.
                </p>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-blue mb-2 md:mb-3 flex items-center">
                  <Heart className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                  My Philosophy
                </h3>
                <p className="text-sm sm:text-base text-charcoal-light leading-relaxed">
                  Every person deserves individualized care that addresses root causes, not just symptoms. I believe in empowering you with knowledge and tools to maintain progress long after our sessions end.
                </p>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-orange mb-2 md:mb-3 flex items-center">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                  My Approach
                </h3>
                <p className="text-sm sm:text-base text-charcoal-light leading-relaxed">
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
