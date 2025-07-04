import { motion } from "framer-motion";
import { Heart, Clock, Trophy } from "lucide-react";

export default function Philosophy() {
  const principles = [
    {
      icon: Heart,
      title: "Individualized care plans tailored to your lifestyle"
    },
    {
      icon: Clock,
      title: "Adequate time for comprehensive treatment"
    },
    {
      icon: Trophy,
      title: "Focus on returning to activities you love"
    }
  ];

  return (
    <section className="py-20 bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              My Philosophy: You Deserve More
            </h2>
            <p className="text-xl text-white/90 mb-6 leading-relaxed">
              Healthcare shouldn't be rushed. Your goals shouldn't be compromised. Your recovery shouldn't be limited by insurance timelines.
            </p>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              I believe in treating the whole person, not just the injury. Every session is designed around your unique lifestyle, goals, and the activities that bring you joy. Whether you're an athlete, a busy professional, or someone who simply wants to move without pain, my approach is built on the foundation that your time and your health deserve premium attention.
            </p>
            
            <div className="space-y-4">
              {principles.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-8 h-8 bg-coral rounded-full flex items-center justify-center">
                    <principle.icon className="text-white w-4 h-4" />
                  </div>
                  <span className="text-white font-medium">{principle.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Physical therapist having detailed consultation with patient in modern clinical setting"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded-xl"
            >
              <p className="text-charcoal italic font-medium text-sm">
                "Every person's body tells a unique story. My job is to listen, understand, and help you write the next chapter pain-free."
              </p>
              <div className="text-coral font-semibold text-sm mt-2">- Dr. Rebecca Kleiner</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
