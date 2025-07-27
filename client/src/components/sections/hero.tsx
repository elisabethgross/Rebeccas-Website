import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const heroImages = [
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Young woman stretching outdoors after physical therapy",
    },
    {
      src: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Senior man walking confidently with improved mobility",
    },
    {
      src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Middle-aged woman doing physical therapy exercises",
    },
    {
      src: "https://images.unsplash.com/photo-1593810450967-f9c42742e326?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Athletic man returning to sports after injury recovery",
    },
    {
      src: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Diverse group participating in movement therapy session",
    }
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    duration: 30
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    
    // Auto-play
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-blue/10 text-blue text-sm font-medium rounded-full">
                Premium Physical Therapy Experience
              </span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-charcoal">
              A physical therapy experience that will both{" "}
              <span className="text-blue">educate</span> and{" "}
              <span className="text-orange">inspire</span> you to{" "}
              <em className="italic">move like you</em>.
            </h1>
            
            <p className="text-xl mb-8 text-charcoal-light leading-relaxed max-w-xl">
              Personalized one-on-one care that combines evidence-based treatment with movement education to get you back to the activities you love.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-blue text-white hover:bg-blue/90 px-8 py-4 text-lg font-semibold group"
              >
                Schedule Your Assessment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => scrollToSection("about")}
                variant="outline"
                className="border-blue text-blue hover:bg-blue hover:text-white px-8 py-4 text-lg font-semibold group"
              >
                <Play className="mr-2 h-5 w-5" />
                Learn My Approach
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue">500+</div>
                <div className="text-sm text-charcoal-light">Patients Helped</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-blue/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue">15+</div>
                <div className="text-sm text-charcoal-light">Years Experience</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-blue/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue">98%</div>
                <div className="text-sm text-charcoal-light">Success Rate</div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative order-first lg:order-last"
          >
            <div className="relative">
              {/* Image Carousel */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="embla" ref={emblaRef}>
                  <div className="embla__container flex">
                    {heroImages.map((image, index) => (
                      <div key={index} className="embla__slide flex-none w-full">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-[500px] lg:h-[600px] object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue/20 to-transparent"></div>
                
                {/* Carousel Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === selectedIndex ? 'bg-white scale-125' : 'bg-white/50'
                      }`}
                      onClick={() => emblaApi?.scrollTo(index)}
                    />
                  ))}
                </div>
              </div>
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-blue/10"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-charcoal">Dr. Rebecca Kleiner</div>
                    <div className="text-sm text-charcoal-light">Doctor of Physical Therapy</div>
                  </div>
                </div>
              </motion.div>
              
              {/* Background Pattern */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-blue/10 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}