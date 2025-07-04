import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function About() {
  const credentials = [
    "TODO Doctor of Physical Therapy, University of Southern California",
    "TODO Orthopedic Manual Therapy Certification",
    "TODO Functional Movement Specialist"
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Active person enjoying outdoor activities after physical therapy treatment"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
              Your Partner in Recovery
            </h2>
            <p className="text-xl text-charcoal-light mb-6 leading-relaxed">
              I'm Dr. Rebecca Kleiner, and I believe that every person deserves individualized care that addresses not just their pain, but their life goals. With over 15 years of experience, I've dedicated my practice to providing premium, personalized physical therapy that gets real results.
            </p>
            <p className="text-lg text-charcoal-light mb-8 leading-relaxed">
              My direct-pay practice model means I can spend the time you deserve—no rushing through appointments or dealing with insurance limitations. Just focused, expert care tailored specifically to help you return to the activities that bring you joy.
            </p>
            
            <div className="space-y-4">
              {credentials.map((credential, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4"
                >
                  <CheckCircle className="w-5 h-5 text-sage flex-shrink-0" />
                  <span className="text-charcoal font-medium">{credential}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
